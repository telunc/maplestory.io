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

var _ServerNames = require('../lib/ServerNames');

var _ServerNames2 = _interopRequireDefault(_ServerNames);

var _shop = require('./shop');

var _shop2 = _interopRequireDefault(_shop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

/**
 * Gets a RethinkDB query filtered to the `rooms` table on the `maplefm` db.
 */
function GetRooms(filter) {
  return _rethinkdb2.default.db('maplestory').table('rooms').filter(filter || {}).map(function (room) {
    return {
      server: room('server'),
      id: room('id'),
      channel: room('channel'),
      createdAt: room('createTime'),
      room: room('room'),
      shops: room('shops').values().map(function (shop) {
        return {
          characterName: shop('characterName'),
          shopName: shop('shopName'),
          items: shop('items').eqJoin('id', _rethinkdb2.default.db('maplestory').table('items')).map(function (item) {
            return item('left').merge(item('right')('Description')).merge(item('right')('MetaInfo').without('Icon')).merge(_rethinkdb2.default.branch(item('right')('MetaInfo')('Equip'), _rethinkdb2.default.expr({ potentials: _rethinkdb2.default.expr([{ 'PotentialId': item('left')('potential1').coerceTo('number'), target: 'potential1' }, { 'PotentialId': item('left')('potential2').coerceTo('number'), target: 'potential2' }, { 'PotentialId': item('left')('potential3').coerceTo('number'), target: 'potential3' }, { 'PotentialId': item('left')('bpotential1').coerceTo('number'), target: 'bpotential1' }, { 'PotentialId': item('left')('bpotential2').coerceTo('number'), target: 'bpotential2' }, { 'PotentialId': item('left')('bpotential3').coerceTo('number'), target: 'bpotential3' }]).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentialLevels'), { index: 'PotentialId' }).zip().filter({ Level: _rethinkdb2.default.branch(item('right')('MetaInfo')('Equip')('reqLevel'), item('right')('MetaInfo')('Equip')('reqLevel'), 1).coerceTo('number').add(9).div(10).floor() }).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentials')).zip().without('Level', 'PotentialId', 'RequiredLevel') }), {}));
          }).without('unk1', 'unk2', 'unk3', 'unk4', 'unk5', 'unk6', 'unk7', 'unk8', 'WZFile', 'WZFolder', 'bpotential1Level', 'bpotential2Level', 'bpotential3Level', 'potential1Level', 'potential2Level', 'potential3Level', 'potential1', 'potential2', 'potential3', 'bpotential1', 'bpotential2', 'bpotential3')
        };
      })
    };
  });
}

var Room = function () {
  function Room(rethinkData) {
    (0, _classCallCheck3.default)(this, Room);

    this._data = rethinkData;
  }

  (0, _createClass3.default)(Room, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        shops: this.shops,
        server: this.server,
        channel: this.channel,
        room: this.room,
        serverName: this.serverName,
        id: this.id,
        createTime: this.createTime
      };
    }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */

  }, {
    key: 'shops',
    get: function get() {
      return this._data.shops.map(function (shop) {
        return new _shop2.default(shop);
      });
    }
  }, {
    key: 'server',
    get: function get() {
      return this._data.server;
    }
  }, {
    key: 'channel',
    get: function get() {
      return this._data.channel;
    }
  }, {
    key: 'room',
    get: function get() {
      return this._data.room;
    }
  }, {
    key: 'serverName',
    get: function get() {
      return _ServerNames2.default[this._data.server];
    }
  }, {
    key: 'id',
    get: function get() {
      return this._data.id;
    }
  }, {
    key: 'createTime',
    get: function get() {
      return this._data.createTime;
    }
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
                return GetRooms(filter).run(connection);

              case 5:
                cursor = _context.sent;
                _context.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context.sent;

                connection.close();
                return _context.abrupt('return', fullItems.map(function (entry) {
                  return new Room(entry);
                }));

              case 11:
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
                return GetRooms(filter).limit(1).run(connection);

              case 5:
                cursor = _context2.sent;
                _context2.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context2.sent;

                connection.close();
                return _context2.abrupt('return', fullItems.map(function (entry) {
                  return new Room(entry);
                }).shift());

              case 11:
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

    /**
     * Gets the shop and item data in an entire server.
     * @param {number} serverId The server id to find all of the current rooms for.
     */

  }, {
    key: 'findRooms',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(serverId) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(serverId != 0 && !serverId || serverId < 0 || serverId > 5)) {
                  _context3.next = 2;
                  break;
                }

                throw 'Needs a valid Server Id (0-5)';

              case 2:
                return _context3.abrupt('return', Room.findAll({ server: Number(serverId) }));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function findRooms(_x3) {
        return ref.apply(this, arguments);
      }

      return findRooms;
    }()

    /**
     * Gets the shop and item data in a given server id, channel id, and room id.
     * @param {number} serverId The server id to find the room in. (0-5)
     * @param {number} channelId The channel we should filter to. (1-20)
     * @param {number} roomId The room number to search for. (0-21)
     */

  }, {
    key: 'findRoom',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(serverId, channelId, roomId) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log('Server Id', serverId);

                if (!(serverId != 0 && !serverId || serverId < 0 || serverId > 5)) {
                  _context4.next = 3;
                  break;
                }

                throw 'Needs a valid Server Id (0-5)';

              case 3:
                if (!(channelId != 0 && !channelId || channelId < 1 || channelId > 20)) {
                  _context4.next = 5;
                  break;
                }

                throw 'Needs a valid Channel Id (1-20)';

              case 5:
                if (!(roomId != 0 && !roomId || roomId < 0 || roomId > 21)) {
                  _context4.next = 7;
                  break;
                }

                throw 'Needs a valid Room Id (0-21)';

              case 7:
                return _context4.abrupt('return', Room.findFirst({ server: Number(serverId), channel: Number(channelId), room: Number(roomId) }));

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function findRoom(_x4, _x5, _x6) {
        return ref.apply(this, arguments);
      }

      return findRoom;
    }()
  }]);
  return Room;
}();

exports.default = Room;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcm9vbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQUtBLFNBQVMsT0FBVCxHQUFtQjtBQUNqQixTQUFPLG9CQUFFLE9BQUYsQ0FBVTtBQUNmLFVBQU0sUUFBUSxHQUFSLENBQVksY0FESDtBQUVmLFVBQU0sUUFBUSxHQUFSLENBQVksY0FGSDtBQUdmLFVBQU0sUUFBUSxHQUFSLENBQVksY0FISDtBQUlmLFFBQUksUUFBUSxHQUFSLENBQVk7QUFKRCxHQUFWLENBQVA7QUFNRDs7Ozs7QUFLRCxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBeUI7QUFDdkIsU0FBTyxvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixFQUFrQyxNQUFsQyxDQUF5QyxVQUFVLEVBQW5ELEVBQXVELEdBQXZELENBQTJELFVBQVMsSUFBVCxFQUFjO0FBQzlFLFdBQU87QUFDTCxjQUFRLEtBQUssUUFBTCxDQURIO0FBRUwsVUFBSSxLQUFLLElBQUwsQ0FGQztBQUdMLGVBQVMsS0FBSyxTQUFMLENBSEo7QUFJTCxpQkFBVyxLQUFLLFlBQUwsQ0FKTjtBQUtMLFlBQU0sS0FBSyxNQUFMLENBTEQ7QUFNTCxhQUFPLEtBQUssT0FBTCxFQUFjLE1BQWQsR0FBdUIsR0FBdkIsQ0FBMkIsVUFBUyxJQUFULEVBQWM7QUFDOUMsZUFBTztBQUNMLHlCQUFlLEtBQUssZUFBTCxDQURWO0FBRUwsb0JBQVUsS0FBSyxVQUFMLENBRkw7QUFHTCxpQkFBTyxLQUFLLE9BQUwsRUFBYyxNQUFkLENBQXFCLElBQXJCLEVBQTJCLG9CQUFFLEVBQUYsQ0FBSyxZQUFMLEVBQW1CLEtBQW5CLENBQXlCLE9BQXpCLENBQTNCLEVBQThELEdBQTlELENBQWtFLFVBQVMsSUFBVCxFQUFjO0FBQ3JGLG1CQUFPLEtBQUssTUFBTCxFQUNKLEtBREks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Q08sVUFBVSxHQUFWLENBQWM7QUFBQSx5QkFBUyxJQUFJLElBQUosQ0FBUyxLQUFULENBQVQ7QUFBQSxpQkFBZCxFQUF3QyxLQUF4QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZGQU9ZLFE7Ozs7O3NCQUNmLFlBQVksQ0FBWixJQUFpQixDQUFDLFFBQW5CLElBQWdDLFdBQVcsQ0FBM0MsSUFBZ0QsV0FBVyxDOzs7OztzQkFBUywrQjs7O2tEQUNoRSxLQUFLLE9BQUwsQ0FBYSxFQUFDLFFBQVEsT0FBTyxRQUFQLENBQVQsRUFBYixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkZBU1csUSxFQUFVLFMsRUFBVyxNOzs7OztBQUN6Qyx3QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixRQUF6Qjs7c0JBQ00sWUFBWSxDQUFaLElBQWlCLENBQUMsUUFBbkIsSUFBZ0MsV0FBVyxDQUEzQyxJQUFnRCxXQUFXLEM7Ozs7O3NCQUFTLCtCOzs7c0JBQ25FLGFBQWEsQ0FBYixJQUFrQixDQUFDLFNBQXBCLElBQWtDLFlBQVksQ0FBOUMsSUFBbUQsWUFBWSxFOzs7OztzQkFBVSxpQzs7O3NCQUN4RSxVQUFVLENBQVYsSUFBZSxDQUFDLE1BQWpCLElBQTRCLFNBQVMsQ0FBckMsSUFBMEMsU0FBUyxFOzs7OztzQkFBVSw4Qjs7O2tEQUN6RCxLQUFLLFNBQUwsQ0FBZSxFQUFDLFFBQVEsT0FBTyxRQUFQLENBQVQsRUFBMkIsU0FBUyxPQUFPLFNBQVAsQ0FBcEMsRUFBdUQsTUFBTSxPQUFPLE1BQVAsQ0FBN0QsRUFBZixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFqRk0sSSIsImZpbGUiOiJyb29tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHIgZnJvbSAncmV0aGlua2RiJztcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXHJcbmltcG9ydCBTZXJ2ZXJOYW1lcyBmcm9tICcuLi9saWIvU2VydmVyTmFtZXMnXHJcbmltcG9ydCBTaG9wIGZyb20gJy4vc2hvcCdcclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgbmV3IFJldGhpbmtEQiBjb25uZWN0aW9uIHRvIHJ1biBxdWVyaWVzIGFnYWluc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25uZWN0KCkge1xyXG4gIHJldHVybiByLmNvbm5lY3Qoe1xyXG4gICAgaG9zdDogcHJvY2Vzcy5lbnYuUkVUSElOS0RCX0hPU1QsXHJcbiAgICBwb3J0OiBwcm9jZXNzLmVudi5SRVRISU5LREJfUE9SVCxcclxuICAgIEFVVEg6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9BVVRILFxyXG4gICAgREI6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9EQlxyXG4gIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgUmV0aGlua0RCIHF1ZXJ5IGZpbHRlcmVkIHRvIHRoZSBgcm9vbXNgIHRhYmxlIG9uIHRoZSBgbWFwbGVmbWAgZGIuXHJcbiAqL1xyXG5mdW5jdGlvbiBHZXRSb29tcyhmaWx0ZXIpe1xyXG4gIHJldHVybiByLmRiKCdtYXBsZXN0b3J5JykudGFibGUoJ3Jvb21zJykuZmlsdGVyKGZpbHRlciB8fCB7fSkubWFwKGZ1bmN0aW9uKHJvb20pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2VydmVyOiByb29tKCdzZXJ2ZXInKSxcclxuICAgICAgaWQ6IHJvb20oJ2lkJyksXHJcbiAgICAgIGNoYW5uZWw6IHJvb20oJ2NoYW5uZWwnKSxcclxuICAgICAgY3JlYXRlZEF0OiByb29tKCdjcmVhdGVUaW1lJyksXHJcbiAgICAgIHJvb206IHJvb20oJ3Jvb20nKSxcclxuICAgICAgc2hvcHM6IHJvb20oJ3Nob3BzJykudmFsdWVzKCkubWFwKGZ1bmN0aW9uKHNob3Ape1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjaGFyYWN0ZXJOYW1lOiBzaG9wKCdjaGFyYWN0ZXJOYW1lJyksXHJcbiAgICAgICAgICBzaG9wTmFtZTogc2hvcCgnc2hvcE5hbWUnKSxcclxuICAgICAgICAgIGl0ZW1zOiBzaG9wKCdpdGVtcycpLmVxSm9pbignaWQnLCByLmRiKCdtYXBsZXN0b3J5JykudGFibGUoJ2l0ZW1zJykpLm1hcChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0oJ2xlZnQnKVxyXG4gICAgICAgICAgICAgIC5tZXJnZShpdGVtKCdyaWdodCcpKCdEZXNjcmlwdGlvbicpKVxyXG4gICAgICAgICAgICAgIC5tZXJnZShpdGVtKCdyaWdodCcpKCdNZXRhSW5mbycpLndpdGhvdXQoJ0ljb24nKSlcclxuICAgICAgICAgICAgICAubWVyZ2Uoci5icmFuY2goaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSgnRXF1aXAnKSwgci5leHByKHtwb3RlbnRpYWxzOiByLmV4cHIoW1xyXG4gICAgICAgICAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdwb3RlbnRpYWwxJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdwb3RlbnRpYWwxJ30sXHJcbiAgICAgICAgICAgICAgICAgIHsnUG90ZW50aWFsSWQnOiBpdGVtKCdsZWZ0JykoJ3BvdGVudGlhbDInKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ3BvdGVudGlhbDInfSxcclxuICAgICAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgncG90ZW50aWFsMycpLmNvZXJjZVRvKCdudW1iZXInKSwgdGFyZ2V0OiAncG90ZW50aWFsMyd9LFxyXG4gICAgICAgICAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdicG90ZW50aWFsMScpLmNvZXJjZVRvKCdudW1iZXInKSwgdGFyZ2V0OiAnYnBvdGVudGlhbDEnfSxcclxuICAgICAgICAgICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgnYnBvdGVudGlhbDInKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ2Jwb3RlbnRpYWwyJ30sXHJcbiAgICAgICAgICAgICAgICAgIHsnUG90ZW50aWFsSWQnOiBpdGVtKCdsZWZ0JykoJ2Jwb3RlbnRpYWwzJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdicG90ZW50aWFsMyd9XHJcbiAgICAgICAgICAgICAgXSkuZXFKb2luKCdQb3RlbnRpYWxJZCcsIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgncG90ZW50aWFsTGV2ZWxzJyksIHtpbmRleDogJ1BvdGVudGlhbElkJ30pLnppcCgpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHtMZXZlbDogci5icmFuY2goaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSgnRXF1aXAnKSgncmVxTGV2ZWwnKSwgaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKSgnRXF1aXAnKSgncmVxTGV2ZWwnKSwgMSkuY29lcmNlVG8oJ251bWJlcicpLmFkZCg5KS5kaXYoMTApLmZsb29yKCl9KVxyXG4gICAgICAgICAgICAgICAgLmVxSm9pbignUG90ZW50aWFsSWQnLCByLmRiKCdtYXBsZXN0b3J5JykudGFibGUoJ3BvdGVudGlhbHMnKSkuemlwKCkud2l0aG91dCgnTGV2ZWwnLCAnUG90ZW50aWFsSWQnLCAnUmVxdWlyZWRMZXZlbCcpfSksIHt9KSlcclxuICAgICAgICAgIH0pLndpdGhvdXQoJ3VuazEnLCAndW5rMicsICd1bmszJywgJ3VuazQnLCAndW5rNScsICd1bms2JywgJ3VuazcnLCAndW5rOCcsICdXWkZpbGUnLCAnV1pGb2xkZXInLCAnYnBvdGVudGlhbDFMZXZlbCcsICdicG90ZW50aWFsMkxldmVsJywgJ2Jwb3RlbnRpYWwzTGV2ZWwnLCAncG90ZW50aWFsMUxldmVsJywgJ3BvdGVudGlhbDJMZXZlbCcsICdwb3RlbnRpYWwzTGV2ZWwnLCAncG90ZW50aWFsMScsICdwb3RlbnRpYWwyJywgJ3BvdGVudGlhbDMnLCAnYnBvdGVudGlhbDEnLCAnYnBvdGVudGlhbDInLCAnYnBvdGVudGlhbDMnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb29tIHtcclxuICBjb25zdHJ1Y3RvcihyZXRoaW5rRGF0YSl7XHJcbiAgICB0aGlzLl9kYXRhID0gcmV0aGlua0RhdGE7XHJcbiAgfVxyXG5cclxuICBnZXQgc2hvcHMoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNob3BzLm1hcChzaG9wID0+IG5ldyBTaG9wKHNob3ApKVxyXG4gIH1cclxuICBnZXQgc2VydmVyKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5zZXJ2ZXJcclxuICB9XHJcbiAgZ2V0IGNoYW5uZWwoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmNoYW5uZWxcclxuICB9XHJcbiAgZ2V0IHJvb20oKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnJvb21cclxuICB9XHJcbiAgZ2V0IHNlcnZlck5hbWUoKXtcclxuICAgIHJldHVybiBTZXJ2ZXJOYW1lc1t0aGlzLl9kYXRhLnNlcnZlcl1cclxuICB9XHJcbiAgZ2V0IGlkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pZFxyXG4gIH1cclxuICBnZXQgY3JlYXRlVGltZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY3JlYXRlVGltZVxyXG4gIH1cclxuXHJcbiAgdG9KU09OKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzaG9wczogdGhpcy5zaG9wcyxcclxuICAgICAgc2VydmVyOiB0aGlzLnNlcnZlcixcclxuICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsLFxyXG4gICAgICByb29tOiB0aGlzLnJvb20sXHJcbiAgICAgIHNlcnZlck5hbWU6IHRoaXMuc2VydmVyTmFtZSxcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIGNyZWF0ZVRpbWU6IHRoaXMuY3JlYXRlVGltZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXIgVGhlIHJldGhpbmtkYiBjb21wYXRpYmxlIGZpbHRlciBvYmplY3QgdG8gdXNlIGZvciB0aGUgcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBmaW5kQWxsKGZpbHRlcil7XHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbiA9IGF3YWl0IENvbm5lY3QoKVxyXG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGF3YWl0IEdldFJvb21zKGZpbHRlcikucnVuKGNvbm5lY3Rpb24pXHJcbiAgICAgICAgY29uc3QgZnVsbEl0ZW1zID0gYXdhaXQgY3Vyc29yLnRvQXJyYXkoKVxyXG4gICAgICAgIGNvbm5lY3Rpb24uY2xvc2UoKVxyXG4gICAgICAgIHJldHVybiBmdWxsSXRlbXMubWFwKGVudHJ5ID0+IG5ldyBSb29tKGVudHJ5KSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXIgVGhlIHJldGhpbmtkYiBjb21wYXRpYmxlIGZpbHRlciBvYmplY3QgdG8gdXNlIGZvciB0aGUgcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBmaW5kRmlyc3QoZmlsdGVyKXtcclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgQ29ubmVjdCgpXHJcbiAgICAgICAgY29uc3QgY3Vyc29yID0gYXdhaXQgR2V0Um9vbXMoZmlsdGVyKS5saW1pdCgxKS5ydW4oY29ubmVjdGlvbilcclxuICAgICAgICBjb25zdCBmdWxsSXRlbXMgPSBhd2FpdCBjdXJzb3IudG9BcnJheSgpXHJcbiAgICAgICAgY29ubmVjdGlvbi5jbG9zZSgpXHJcbiAgICAgICAgcmV0dXJuIGZ1bGxJdGVtcy5tYXAoZW50cnkgPT4gbmV3IFJvb20oZW50cnkpKS5zaGlmdCgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBzaG9wIGFuZCBpdGVtIGRhdGEgaW4gYW4gZW50aXJlIHNlcnZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXJ2ZXJJZCBUaGUgc2VydmVyIGlkIHRvIGZpbmQgYWxsIG9mIHRoZSBjdXJyZW50IHJvb21zIGZvci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGZpbmRSb29tcyhzZXJ2ZXJJZCl7XHJcbiAgICAgICAgaWYoKHNlcnZlcklkICE9IDAgJiYgIXNlcnZlcklkKSB8fCBzZXJ2ZXJJZCA8IDAgfHwgc2VydmVySWQgPiA1KSB0aHJvdyAnTmVlZHMgYSB2YWxpZCBTZXJ2ZXIgSWQgKDAtNSknXHJcbiAgICAgICAgcmV0dXJuIFJvb20uZmluZEFsbCh7c2VydmVyOiBOdW1iZXIoc2VydmVySWQpfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIHNob3AgYW5kIGl0ZW0gZGF0YSBpbiBhIGdpdmVuIHNlcnZlciBpZCwgY2hhbm5lbCBpZCwgYW5kIHJvb20gaWQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VydmVySWQgVGhlIHNlcnZlciBpZCB0byBmaW5kIHRoZSByb29tIGluLiAoMC01KVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNoYW5uZWxJZCBUaGUgY2hhbm5lbCB3ZSBzaG91bGQgZmlsdGVyIHRvLiAoMS0yMClcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb29tSWQgVGhlIHJvb20gbnVtYmVyIHRvIHNlYXJjaCBmb3IuICgwLTIxKVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZmluZFJvb20oc2VydmVySWQsIGNoYW5uZWxJZCwgcm9vbUlkKXtcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZlciBJZCcsIHNlcnZlcklkKVxyXG4gICAgICAgIGlmKChzZXJ2ZXJJZCAhPSAwICYmICFzZXJ2ZXJJZCkgfHwgc2VydmVySWQgPCAwIHx8IHNlcnZlcklkID4gNSkgdGhyb3cgJ05lZWRzIGEgdmFsaWQgU2VydmVyIElkICgwLTUpJ1xyXG4gICAgICAgIGlmKChjaGFubmVsSWQgIT0gMCAmJiAhY2hhbm5lbElkKSB8fCBjaGFubmVsSWQgPCAxIHx8IGNoYW5uZWxJZCA+IDIwKSB0aHJvdyAnTmVlZHMgYSB2YWxpZCBDaGFubmVsIElkICgxLTIwKSdcclxuICAgICAgICBpZigocm9vbUlkICE9IDAgJiYgIXJvb21JZCkgfHwgcm9vbUlkIDwgMCB8fCByb29tSWQgPiAyMSkgdGhyb3cgJ05lZWRzIGEgdmFsaWQgUm9vbSBJZCAoMC0yMSknXHJcbiAgICAgICAgcmV0dXJuIFJvb20uZmluZEZpcnN0KHtzZXJ2ZXI6IE51bWJlcihzZXJ2ZXJJZCksIGNoYW5uZWw6IE51bWJlcihjaGFubmVsSWQpLCByb29tOiBOdW1iZXIocm9vbUlkKX0pXHJcbiAgICB9XHJcbn0iXX0=