'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rethinkdb = require('rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GetShops(filter) {
  return _rethinkdb2.default.db('maplestory').table('rooms').filter(filter || {}).map(function (room) {
    return room('shops').values().limit(1).map(function (shop) {
      return {
        server: room('server'),
        id: room('id').add('-').add(shop('id').coerceTo('string')),
        channel: room('channel'),
        createdAt: room('createTime'),
        room: room('room'),
        characterName: shop('characterName'),
        shopName: shop('shopName'),
        items: shop('items').eqJoin('id', _rethinkdb2.default.db('maplestory').table('items')).map(function (item) {
          return item('left').merge(item('right')('Description')).merge(item('right')('MetaInfo')).merge(_rethinkdb2.default.branch(item('right')('MetaInfo')('Equip'), _rethinkdb2.default.expr({ potentials: _rethinkdb2.default.expr([{ 'PotentialId': item('left')('potential1').coerceTo('number'), target: 'potential1' }, { 'PotentialId': item('left')('potential2').coerceTo('number'), target: 'potential2' }, { 'PotentialId': item('left')('potential3').coerceTo('number'), target: 'potential3' }, { 'PotentialId': item('left')('bpotential1').coerceTo('number'), target: 'bpotential1' }, { 'PotentialId': item('left')('bpotential2').coerceTo('number'), target: 'bpotential2' }, { 'PotentialId': item('left')('bpotential3').coerceTo('number'), target: 'bpotential3' }]).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentialLevels'), { index: 'PotentialId' }).zip().filter({ Level: _rethinkdb2.default.branch(item('right')('MetaInfo')('Equip')('reqLevel'), item('right')('MetaInfo')('Equip')('reqLevel'), 1).coerceTo('number').add(9).div(10).floor() }).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentials')).zip().without('Level', 'PotentialId', 'RequiredLevel') }), {}));
        }).without('unk1', 'unk2', 'unk3', 'unk4', 'unk5', 'unk6', 'unk7', 'unk8', 'WZFile', 'WZFolder', 'bpotential1Level', 'bpotential2Level', 'bpotential3Level', 'potential1Level', 'potential2Level', 'potential3Level', 'potential1', 'potential2', 'potential3', 'bpotential1', 'bpotential2', 'bpotential3')
      };
    });
  });
}

/**
 * Gets a new RethinkDB connection to run queries against.
 */
function Connect() {
  return _rethinkdb2.default.connect({
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    AUTH: process.env.RETHINKDB_AUTH,
    DB: process.env.RETHINKDB_DB
  });
}

var Shop = function () {
  function Shop(rethinkData) {
    (0, _classCallCheck3.default)(this, Shop);

    this._data = rethinkData;
  }

  (0, _createClass3.default)(Shop, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        server: this.server,
        id: this.id,
        channel: this.channel,
        createdAt: this.createdAt,
        room: this.room,
        characterName: this.characterName,
        shopName: this.shopName,
        items: this.items
      };
    }
  }, {
    key: 'server',
    get: function get() {
      return this._data.server;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._data.id;
    }
  }, {
    key: 'channel',
    get: function get() {
      return this._data.channel;
    }
  }, {
    key: 'createdAt',
    get: function get() {
      return this._data.createdAt;
    }
  }, {
    key: 'room',
    get: function get() {
      return this._data.room;
    }
  }, {
    key: 'characterName',
    get: function get() {
      return this._data.characterName;
    }
  }, {
    key: 'shopName',
    get: function get() {
      return this._data.shopName;
    }
  }, {
    key: 'items',
    get: function get() {
      return this._data.items.map(function (item) {
        return new _item2.default(item);
      });
    }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */

  }], [{
    key: 'findAll',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(filter) {
        var connection, cursor, fullItems;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Connect();

              case 2:
                connection = _context.sent;
                _context.next = 5;
                return GetShops(filter).run(connection);

              case 5:
                cursor = _context.sent;
                _context.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context.sent;

                connection.close();
                console.log('Querying for: ', filter, 'returned:', fullItems.length);
                return _context.abrupt('return', fullItems.map(function (entry) {
                  return new _item2.default(entry);
                }));

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function findAll(_x) {
        return ref.apply(this, arguments);
      }

      return findAll;
    }()

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */

  }, {
    key: 'findFirst',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filter) {
        var connection, cursor, fullItems;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Connect();

              case 2:
                connection = _context2.sent;
                _context2.next = 5;
                return GetShops(filter).limit(1).run(connection);

              case 5:
                cursor = _context2.sent;
                _context2.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context2.sent;

                connection.close();
                console.log('Querying for: ', filter, 'returned:', fullItems.length);
                return _context2.abrupt('return', fullItems.map(function (entry) {
                  return new _item2.default(entry);
                }).shift());

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findFirst(_x2) {
        return ref.apply(this, arguments);
      }

      return findFirst;
    }()
  }]);
  return Shop;
}();

exports.default = Shop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc2hvcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBeUI7QUFDdkIsU0FBTyxvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixFQUFrQyxNQUFsQyxDQUF5QyxVQUFVLEVBQW5ELEVBQXVELEdBQXZELENBQTJELFVBQVMsSUFBVCxFQUFjO0FBQzlFLFdBQU8sS0FBSyxPQUFMLEVBQWMsTUFBZCxHQUF1QixLQUF2QixDQUE2QixDQUE3QixFQUFnQyxHQUFoQyxDQUFvQyxVQUFTLElBQVQsRUFBYztBQUN2RCxhQUFPO0FBQ0wsZ0JBQVEsS0FBSyxRQUFMLENBREg7QUFFTCxZQUFJLEtBQUssSUFBTCxFQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLEdBQXBCLENBQXdCLEtBQUssSUFBTCxFQUFXLFFBQVgsQ0FBb0IsUUFBcEIsQ0FBeEIsQ0FGQztBQUdMLGlCQUFTLEtBQUssU0FBTCxDQUhKO0FBSUwsbUJBQVcsS0FBSyxZQUFMLENBSk47QUFLTCxjQUFNLEtBQUssTUFBTCxDQUxEO0FBTUwsdUJBQWUsS0FBSyxlQUFMLENBTlY7QUFPTCxrQkFBVSxLQUFLLFVBQUwsQ0FQTDtBQVFMLGVBQU8sS0FBSyxPQUFMLEVBQWMsTUFBZCxDQUFxQixJQUFyQixFQUEyQixvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixDQUEzQixFQUE4RCxHQUE5RCxDQUFrRSxVQUFTLElBQVQsRUFBYztBQUNyRixpQkFBTyxLQUFLLE1BQUwsRUFDTixLQURNLENBQ0EsS0FBSyxPQUFMLEVBQWMsYUFBZCxDQURBLEVBRU4sS0FGTSxDQUVBLEtBQUssT0FBTCxFQUFjLFVBQWQsQ0FGQSxFQUdOLEtBSE0sQ0FHQSxvQkFBRSxNQUFGLENBQVMsS0FBSyxP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LE0sRUFDQSxTOzs7Ozs7dUJBRm1CLFM7OztBQUFuQiwwQjs7dUJBQ2UsU0FBUyxNQUFULEVBQWlCLEtBQWpCLENBQXVCLENBQXZCLEVBQTBCLEdBQTFCLENBQThCLFVBQTlCLEM7OztBQUFmLHNCOzt1QkFDa0IsT0FBTyxPQUFQLEU7OztBQUFsQix5Qjs7QUFDTiwyQkFBVyxLQUFYO0FBQ0Esd0JBQVEsR0FBUixDQUFZLGdCQUFaLEVBQThCLE1BQTlCLEVBQXNDLFdBQXRDLEVBQW1ELFVBQVUsTUFBN0Q7a0RBQ08sVUFBVSxHQUFWLENBQWM7QUFBQSx5QkFBUyxtQkFBUyxLQUFULENBQVQ7QUFBQSxpQkFBZCxFQUF3QyxLQUF4QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFqRU0sSSIsImZpbGUiOiJzaG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHIgZnJvbSAncmV0aGlua2RiJ1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9pdGVtJ1xyXG5cclxuZnVuY3Rpb24gR2V0U2hvcHMoZmlsdGVyKXtcclxuICByZXR1cm4gci5kYignbWFwbGVzdG9yeScpLnRhYmxlKCdyb29tcycpLmZpbHRlcihmaWx0ZXIgfHwge30pLm1hcChmdW5jdGlvbihyb29tKXtcclxuICAgIHJldHVybiByb29tKCdzaG9wcycpLnZhbHVlcygpLmxpbWl0KDEpLm1hcChmdW5jdGlvbihzaG9wKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzZXJ2ZXI6IHJvb20oJ3NlcnZlcicpLFxyXG4gICAgICAgIGlkOiByb29tKCdpZCcpLmFkZCgnLScpLmFkZChzaG9wKCdpZCcpLmNvZXJjZVRvKCdzdHJpbmcnKSksXHJcbiAgICAgICAgY2hhbm5lbDogcm9vbSgnY2hhbm5lbCcpLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogcm9vbSgnY3JlYXRlVGltZScpLFxyXG4gICAgICAgIHJvb206IHJvb20oJ3Jvb20nKSxcclxuICAgICAgICBjaGFyYWN0ZXJOYW1lOiBzaG9wKCdjaGFyYWN0ZXJOYW1lJyksXHJcbiAgICAgICAgc2hvcE5hbWU6IHNob3AoJ3Nob3BOYW1lJyksXHJcbiAgICAgICAgaXRlbXM6IHNob3AoJ2l0ZW1zJykuZXFKb2luKCdpZCcsIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgnaXRlbXMnKSkubWFwKGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgcmV0dXJuIGl0ZW0oJ2xlZnQnKVxyXG4gICAgICAgICAgLm1lcmdlKGl0ZW0oJ3JpZ2h0JykoJ0Rlc2NyaXB0aW9uJykpXHJcbiAgICAgICAgICAubWVyZ2UoaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSlcclxuICAgICAgICAgIC5tZXJnZShyLmJyYW5jaChpdGVtKCdyaWdodCcpKCdNZXRhSW5mbycpKCdFcXVpcCcpLCByLmV4cHIoe3BvdGVudGlhbHM6IHIuZXhwcihbXHJcbiAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgncG90ZW50aWFsMScpLmNvZXJjZVRvKCdudW1iZXInKSwgdGFyZ2V0OiAncG90ZW50aWFsMSd9LFxyXG4gICAgICAgICAgICAgIHsnUG90ZW50aWFsSWQnOiBpdGVtKCdsZWZ0JykoJ3BvdGVudGlhbDInKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ3BvdGVudGlhbDInfSxcclxuICAgICAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdwb3RlbnRpYWwzJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdwb3RlbnRpYWwzJ30sXHJcbiAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgnYnBvdGVudGlhbDEnKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ2Jwb3RlbnRpYWwxJ30sXHJcbiAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgnYnBvdGVudGlhbDInKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ2Jwb3RlbnRpYWwyJ30sXHJcbiAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgnYnBvdGVudGlhbDMnKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ2Jwb3RlbnRpYWwzJ31cclxuICAgICAgICAgIF0pLmVxSm9pbignUG90ZW50aWFsSWQnLCByLmRiKCdtYXBsZXN0b3J5JykudGFibGUoJ3BvdGVudGlhbExldmVscycpLCB7aW5kZXg6ICdQb3RlbnRpYWxJZCd9KS56aXAoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHtMZXZlbDogci5icmFuY2goaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSgnRXF1aXAnKSgncmVxTGV2ZWwnKSwgaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSgnRXF1aXAnKSgncmVxTGV2ZWwnKSwgMSkuY29lcmNlVG8oJ251bWJlcicpLmFkZCg5KS5kaXYoMTApLmZsb29yKCl9KVxyXG4gICAgICAgICAgICAuZXFKb2luKCdQb3RlbnRpYWxJZCcsIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgncG90ZW50aWFscycpKS56aXAoKS53aXRob3V0KCdMZXZlbCcsICdQb3RlbnRpYWxJZCcsICdSZXF1aXJlZExldmVsJyl9KSwge30pKVxyXG4gICAgICAgIH0pLndpdGhvdXQoJ3VuazEnLCAndW5rMicsICd1bmszJywgJ3VuazQnLCAndW5rNScsICd1bms2JywgJ3VuazcnLCAndW5rOCcsICdXWkZpbGUnLCAnV1pGb2xkZXInLCAnYnBvdGVudGlhbDFMZXZlbCcsICdicG90ZW50aWFsMkxldmVsJywgJ2Jwb3RlbnRpYWwzTGV2ZWwnLCAncG90ZW50aWFsMUxldmVsJywgJ3BvdGVudGlhbDJMZXZlbCcsICdwb3RlbnRpYWwzTGV2ZWwnLCAncG90ZW50aWFsMScsICdwb3RlbnRpYWwyJywgJ3BvdGVudGlhbDMnLCAnYnBvdGVudGlhbDEnLCAnYnBvdGVudGlhbDInLCAnYnBvdGVudGlhbDMnKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgbmV3IFJldGhpbmtEQiBjb25uZWN0aW9uIHRvIHJ1biBxdWVyaWVzIGFnYWluc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25uZWN0KCkge1xyXG4gIHJldHVybiByLmNvbm5lY3Qoe1xyXG4gICAgaG9zdDogcHJvY2Vzcy5lbnYuUkVUSElOS0RCX0hPU1QsXHJcbiAgICBwb3J0OiBwcm9jZXNzLmVudi5SRVRISU5LREJfUE9SVCxcclxuICAgIEFVVEg6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9BVVRILFxyXG4gICAgREI6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9EQlxyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNob3Age1xyXG4gIGNvbnN0cnVjdG9yKHJldGhpbmtEYXRhKXtcclxuICAgIHRoaXMuX2RhdGEgPSByZXRoaW5rRGF0YTtcclxuICB9XHJcblxyXG4gIHRvSlNPTigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2VydmVyOiB0aGlzLnNlcnZlcixcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcclxuICAgICAgY3JlYXRlZEF0OiB0aGlzLmNyZWF0ZWRBdCxcclxuICAgICAgcm9vbTogdGhpcy5yb29tLFxyXG4gICAgICBjaGFyYWN0ZXJOYW1lOiB0aGlzLmNoYXJhY3Rlck5hbWUsXHJcbiAgICAgIHNob3BOYW1lOiB0aGlzLnNob3BOYW1lLFxyXG4gICAgICBpdGVtczogdGhpcy5pdGVtc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNlcnZlcigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc2VydmVyXHJcbiAgfVxyXG4gIGdldCBpZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaWRcclxuICB9XHJcbiAgZ2V0IGNoYW5uZWwoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmNoYW5uZWxcclxuICB9XHJcbiAgZ2V0IGNyZWF0ZWRBdCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY3JlYXRlZEF0XHJcbiAgfVxyXG4gIGdldCByb29tKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5yb29tXHJcbiAgfVxyXG4gIGdldCBjaGFyYWN0ZXJOYW1lKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5jaGFyYWN0ZXJOYW1lXHJcbiAgfVxyXG4gIGdldCBzaG9wTmFtZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc2hvcE5hbWVcclxuICB9XHJcblxyXG4gIGdldCBpdGVtcygpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaXRlbXMubWFwKGl0ZW0gPT4gbmV3IEl0ZW0oaXRlbSkpXHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBUaGUgcmV0aGlua2RiIGNvbXBhdGlibGUgZmlsdGVyIG9iamVjdCB0byB1c2UgZm9yIHRoZSBxdWVyeS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGZpbmRBbGwoZmlsdGVyKXtcclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgQ29ubmVjdCgpXHJcbiAgICAgICAgY29uc3QgY3Vyc29yID0gYXdhaXQgR2V0U2hvcHMoZmlsdGVyKS5ydW4oY29ubmVjdGlvbilcclxuICAgICAgICBjb25zdCBmdWxsSXRlbXMgPSBhd2FpdCBjdXJzb3IudG9BcnJheSgpXHJcbiAgICAgICAgY29ubmVjdGlvbi5jbG9zZSgpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1F1ZXJ5aW5nIGZvcjogJywgZmlsdGVyLCAncmV0dXJuZWQ6JywgZnVsbEl0ZW1zLmxlbmd0aClcclxuICAgICAgICByZXR1cm4gZnVsbEl0ZW1zLm1hcChlbnRyeSA9PiBuZXcgSXRlbShlbnRyeSkpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVyIFRoZSByZXRoaW5rZGIgY29tcGF0aWJsZSBmaWx0ZXIgb2JqZWN0IHRvIHVzZSBmb3IgdGhlIHF1ZXJ5LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZmluZEZpcnN0KGZpbHRlcil7XHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbiA9IGF3YWl0IENvbm5lY3QoKVxyXG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGF3YWl0IEdldFNob3BzKGZpbHRlcikubGltaXQoMSkucnVuKGNvbm5lY3Rpb24pXHJcbiAgICAgICAgY29uc3QgZnVsbEl0ZW1zID0gYXdhaXQgY3Vyc29yLnRvQXJyYXkoKVxyXG4gICAgICAgIGNvbm5lY3Rpb24uY2xvc2UoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdRdWVyeWluZyBmb3I6ICcsIGZpbHRlciwgJ3JldHVybmVkOicsIGZ1bGxJdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgcmV0dXJuIGZ1bGxJdGVtcy5tYXAoZW50cnkgPT4gbmV3IEl0ZW0oZW50cnkpKS5zaGlmdCgpXHJcbiAgICB9XHJcbn0iXX0=