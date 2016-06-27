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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GetItems(filter) {
  return _rethinkdb2.default.db('maplestory').table('rooms').filter(filter || {}).concatMap(function (room) {
    return room('shops').values().concatMap(function (shop) {
      return shop('items').merge({
        server: room('server'),
        shopId: room('id').add('-').add(shop('id').coerceTo('string')),
        channel: room('channel'),
        createdAt: room('createTime'),
        room: room('room'),
        characterName: shop('characterName'),
        shopName: shop('shopName')
      });
    });
  }).eqJoin('id', _rethinkdb2.default.db('maplestory').table('items')).map(function (item) {
    return item('left').merge(item('right')('Description')).merge(item('right')('MetaInfo').without('Icon')).merge(_rethinkdb2.default.branch(item('right')('MetaInfo')('Equip'), _rethinkdb2.default.expr({ potentials: _rethinkdb2.default.expr([{ 'PotentialId': item('left')('potential1').coerceTo('number'), target: 'potential1' }, { 'PotentialId': item('left')('potential2').coerceTo('number'), target: 'potential2' }, { 'PotentialId': item('left')('potential3').coerceTo('number'), target: 'potential3' }, { 'PotentialId': item('left')('bpotential1').coerceTo('number'), target: 'bpotential1' }, { 'PotentialId': item('left')('bpotential2').coerceTo('number'), target: 'bpotential2' }, { 'PotentialId': item('left')('bpotential3').coerceTo('number'), target: 'bpotential3' }]).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentialLevels'), { index: 'PotentialId' }).zip().filter({ Level: _rethinkdb2.default.branch(item('right')('MetaInfo')('Equip')('reqLevel'), item('right')('MetaInfo')('Equip')('reqLevel'), 1).coerceTo('number').add(9).div(10).floor() }).eqJoin('PotentialId', _rethinkdb2.default.db('maplestory').table('potentials')).zip().without('Level', 'PotentialId', 'RequiredLevel') }), {}));
  }).without('unk1', 'unk2', 'unk3', 'unk4', 'unk5', 'unk6', 'unk7', 'unk8', 'WZFile', 'WZFolder', 'bpotential1Level', 'bpotential2Level', 'bpotential3Level', 'potential1Level', 'potential2Level', 'potential3Level', 'potential1', 'potential2', 'potential3', 'bpotential1', 'bpotential2', 'bpotential3');
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

var Item = function () {
  function Item(rethinkData) {
    (0, _classCallCheck3.default)(this, Item);

    this._data = rethinkData;
  }

  (0, _createClass3.default)(Item, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        card: this.card,
        cash: this.cash,
        equip: this.equip,
        icon: this.icon,
        shop: this.shop,
        chair: this.chair,
        description: this.description,
        ItemId: this.ItemId,
        name: this.name,
        slot: this.slot,
        acc: this.acc,
        avoid: this.avoid,
        battleModeAtt: this.battleModeAtt,
        bossDmg: this.bossDmg,
        bundle: this.bundle,
        category: this.category,
        channel: this.channel,
        characterName: this.characterName,
        createdAt: this.createdAt,
        creator: this.creator,
        dex: this.dex,
        diligence: this.diligence,
        durability: this.durability,
        expireTime: this.expireTime,
        growth: this.growth,
        hammerApplied: this.hammerApplied,
        ignoreDef: this.ignoreDef,
        intelligence: this.intelligence,
        isIdentified: this.isIdentified,
        jump: this.jump,
        luk: this.luk,
        matk: this.matk,
        mdef: this.mdef,
        mhp: this.mhp,
        mmp: this.mmp,
        nebulite: this.nebulite,
        numberOfEnhancements: this.numberOfEnhancements,
        numberOfPlusses: this.numberOfPlusses,
        only: this.only,
        potentials: this.potentials,
        price: this.price,
        quantity: this.quantity,
        rarity: this.rarity,
        room: this.room,
        server: this.server,
        shopID: this.shopID,
        shopName: this.shopName,
        speed: this.speed,
        str: this.str,
        untradeable: this.untradeable,
        upgradesAvailable: this.upgradesAvailable,
        watk: this.watk,
        wdef: this.wdef
      };
    }
  }, {
    key: 'card',
    get: function get() {
      return this._data.Card;
    }
  }, {
    key: 'cash',
    get: function get() {
      return this._data.Cash;
    }
  }, {
    key: 'equip',
    get: function get() {
      return this._data.Equip;
    }
  }, {
    key: 'icon',
    get: function get() {
      return {
        icon: '/api/maplestory/item/' + this.itemId + '/icon',
        iconRaw: '/api/maplestory/item/' + this.itemId + '/iconRaw'
      };
    }
  }, {
    key: 'shop',
    get: function get() {
      return this._data.Shop;
    }
  }, {
    key: 'chair',
    get: function get() {
      return this._data.Chair;
    }
  }, {
    key: 'description',
    get: function get() {
      return this._data.Description;
    }
  }, {
    key: 'itemId',
    get: function get() {
      return this._data.Id;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._data.Name;
    }
  }, {
    key: 'slot',
    get: function get() {
      return this._data.Slot;
    }
  }, {
    key: 'acc',
    get: function get() {
      return this._data.acc;
    }
  }, {
    key: 'avoid',
    get: function get() {
      return this._data.avoid;
    }
  }, {
    key: 'battleModeAtt',
    get: function get() {
      return this._data.battleModeAtt;
    }
  }, {
    key: 'bossDmg',
    get: function get() {
      return this._data.bossDmg;
    }
  }, {
    key: 'bundle',
    get: function get() {
      return this._data.bundle;
    }
  }, {
    key: 'category',
    get: function get() {
      return this._data.category;
    }
  }, {
    key: 'channel',
    get: function get() {
      return this._data.channel;
    }
  }, {
    key: 'characterName',
    get: function get() {
      return this._data.characterName;
    }
  }, {
    key: 'createdAt',
    get: function get() {
      return this._data.createdAt;
    }
  }, {
    key: 'creator',
    get: function get() {
      return this._data.creator;
    }
  }, {
    key: 'dex',
    get: function get() {
      return this._data.dex;
    }
  }, {
    key: 'diligence',
    get: function get() {
      return this._data.diligence;
    }
  }, {
    key: 'durability',
    get: function get() {
      return this._data.durability;
    }
  }, {
    key: 'expireTime',
    get: function get() {
      return this._data.expireTime;
    }
  }, {
    key: 'growth',
    get: function get() {
      return this._data.growth;
    }
  }, {
    key: 'hammerApplied',
    get: function get() {
      return this._data.hammerApplied;
    }
  }, {
    key: 'ignoreDef',
    get: function get() {
      return this._data.ignoreDef;
    }
  }, {
    key: 'intelligence',
    get: function get() {
      return this._data.intelligence;
    }
  }, {
    key: 'isIdentified',
    get: function get() {
      return this._data.isIdentified;
    }
  }, {
    key: 'jump',
    get: function get() {
      return this._data.jump;
    }
  }, {
    key: 'luk',
    get: function get() {
      return this._data.luk;
    }
  }, {
    key: 'matk',
    get: function get() {
      return this._data.matk;
    }
  }, {
    key: 'mdef',
    get: function get() {
      return this._data.mdef;
    }
  }, {
    key: 'mhp',
    get: function get() {
      return this._data.mhp;
    }
  }, {
    key: 'mmp',
    get: function get() {
      return this._data.mmp;
    }
  }, {
    key: 'nebulite',
    get: function get() {
      return this._data.nebulite;
    }
  }, {
    key: 'numberOfEnhancements',
    get: function get() {
      return this._data.numberOfEnhancements;
    }
  }, {
    key: 'numberOfPlusses',
    get: function get() {
      return this._data.numberOfPlusses;
    }
  }, {
    key: 'only',
    get: function get() {
      return this._data.only;
    }
  }, {
    key: 'potentials',
    get: function get() {
      return this._data.potentials;
    }
  }, {
    key: 'price',
    get: function get() {
      return this._data.price;
    }
  }, {
    key: 'quantity',
    get: function get() {
      return this._data.quantity;
    }
  }, {
    key: 'rarity',
    get: function get() {
      return this._data.rarity;
    }
  }, {
    key: 'room',
    get: function get() {
      return this._data.room;
    }
  }, {
    key: 'server',
    get: function get() {
      return this._data.server;
    }
  }, {
    key: 'shopID',
    get: function get() {
      return this._data.shopId;
    }
  }, {
    key: 'shopName',
    get: function get() {
      return this._data.shopName;
    }
  }, {
    key: 'speed',
    get: function get() {
      return this._data.speed;
    }
  }, {
    key: 'str',
    get: function get() {
      return this._data.str;
    }
  }, {
    key: 'untradeable',
    get: function get() {
      return this._data.untradeable;
    }
  }, {
    key: 'upgradesAvailable',
    get: function get() {
      return this._data.upgradesAvailable;
    }
  }, {
    key: 'watk',
    get: function get() {
      return this._data.watk;
    }
  }, {
    key: 'wdef',
    get: function get() {
      return this._data.wdef;
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
                return GetItems(filter).run(connection);

              case 5:
                cursor = _context.sent;
                _context.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context.sent;

                connection.close();
                return _context.abrupt('return', fullItems.map(function (entry) {
                  return new Item(entry);
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
                return GetItems(filter).limit(1).run(connection);

              case 5:
                cursor = _context2.sent;
                _context2.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context2.sent;

                connection.close();
                return _context2.abrupt('return', fullItems.map(function (entry) {
                  return new Item(entry);
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
  }]);
  return Item;
}();

exports.default = Item;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvaXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBUyxRQUFULENBQWtCLE1BQWxCLEVBQXlCO0FBQ3ZCLFNBQU8sb0JBQUUsRUFBRixDQUFLLFlBQUwsRUFBbUIsS0FBbkIsQ0FBeUIsT0FBekIsRUFBa0MsTUFBbEMsQ0FBeUMsVUFBVSxFQUFuRCxFQUF1RCxTQUF2RCxDQUFpRSxVQUFTLElBQVQsRUFBYztBQUNwRixXQUFPLEtBQUssT0FBTCxFQUFjLE1BQWQsR0FBdUIsU0FBdkIsQ0FBaUMsVUFBUyxJQUFULEVBQWM7QUFDcEQsYUFBTyxLQUFLLE9BQUwsRUFDSixLQURJLENBQ0U7QUFDTCxnQkFBUSxLQUFLLFFBQUwsQ0FESDtBQUVMLGdCQUFRLEtBQUssSUFBTCxFQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLEdBQXBCLENBQXdCLEtBQUssSUFBTCxFQUFXLFFBQVgsQ0FBb0IsUUFBcEIsQ0FBeEIsQ0FGSDtBQUdMLGlCQUFTLEtBQUssU0FBTCxDQUhKO0FBSUwsbUJBQVcsS0FBSyxZQUFMLENBSk47QUFLTCxjQUFNLEtBQUssTUFBTCxDQUxEO0FBTUwsdUJBQWUsS0FBSyxlQUFMLENBTlY7QUFPTCxrQkFBVSxLQUFLLFVBQUw7QUFQTCxPQURGLENBQVA7QUFVRCxLQVhNLENBQVA7QUFZRCxHQWJNLEVBYUosTUFiSSxDQWFHLElBYkgsRUFhUyxvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixDQWJULEVBYTRDLEdBYjVDLENBYWdELFVBQVMsSUFBVCxFQUFjO0FBQ25FLFdBQU8sS0FBSyxNQUFMLEVBQ0osS0FESSxDQUNFLEtBQUssT0FBTCxFQUFjLGFBQWQsQ0FERixFQUVKLEtBRkksQ0FFRSxLQUFLLE9BQUwsRUFBYyxVQUFkLEVBQTBCLE9BQTFCLENBQWtDLE1BQWxDLENBRkYsRUFHSixLQUhJ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LElBQWxCO0FBQ0Q7Ozs7Ozs7Ozs0RkFLb0IsTTtZQUNiLFUsRUFDQSxNLEVBQ0EsUzs7Ozs7O3VCQUZtQixTOzs7QUFBbkIsMEI7O3VCQUNlLFNBQVMsTUFBVCxFQUFpQixHQUFqQixDQUFxQixVQUFyQixDOzs7QUFBZixzQjs7dUJBQ2tCLE9BQU8sT0FBUCxFOzs7QUFBbEIseUI7O0FBQ04sMkJBQVcsS0FBWDtpREFDTyxVQUFVLEdBQVYsQ0FBYztBQUFBLHlCQUFTLElBQUksSUFBSixDQUFTLEtBQVQsQ0FBVDtBQUFBLGlCQUFkLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2RkFNYyxNO1lBQ2YsVSxFQUNBLE0sRUFDQSxTOzs7Ozs7dUJBRm1CLFM7OztBQUFuQiwwQjs7dUJBQ2UsU0FBUyxNQUFULEVBQWlCLEtBQWpCLENBQXVCLENBQXZCLEVBQTBCLEdBQTFCLENBQThCLFVBQTlCLEM7OztBQUFmLHNCOzt1QkFDa0IsT0FBTyxPQUFQLEU7OztBQUFsQix5Qjs7QUFDTiwyQkFBVyxLQUFYO2tEQUNPLFVBQVUsR0FBVixDQUFjO0FBQUEseUJBQVMsSUFBSSxJQUFKLENBQVMsS0FBVCxDQUFUO0FBQUEsaUJBQWQsRUFBd0MsS0FBeEMsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBelNVLEkiLCJmaWxlIjoiaXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByIGZyb20gJ3JldGhpbmtkYic7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xyXG5cclxuZnVuY3Rpb24gR2V0SXRlbXMoZmlsdGVyKXtcclxuICByZXR1cm4gci5kYignbWFwbGVzdG9yeScpLnRhYmxlKCdyb29tcycpLmZpbHRlcihmaWx0ZXIgfHwge30pLmNvbmNhdE1hcChmdW5jdGlvbihyb29tKXtcclxuICAgIHJldHVybiByb29tKCdzaG9wcycpLnZhbHVlcygpLmNvbmNhdE1hcChmdW5jdGlvbihzaG9wKXtcclxuICAgICAgcmV0dXJuIHNob3AoJ2l0ZW1zJylcclxuICAgICAgICAubWVyZ2Uoe1xyXG4gICAgICAgICAgc2VydmVyOiByb29tKCdzZXJ2ZXInKSxcclxuICAgICAgICAgIHNob3BJZDogcm9vbSgnaWQnKS5hZGQoJy0nKS5hZGQoc2hvcCgnaWQnKS5jb2VyY2VUbygnc3RyaW5nJykpLFxyXG4gICAgICAgICAgY2hhbm5lbDogcm9vbSgnY2hhbm5lbCcpLFxyXG4gICAgICAgICAgY3JlYXRlZEF0OiByb29tKCdjcmVhdGVUaW1lJyksXHJcbiAgICAgICAgICByb29tOiByb29tKCdyb29tJyksXHJcbiAgICAgICAgICBjaGFyYWN0ZXJOYW1lOiBzaG9wKCdjaGFyYWN0ZXJOYW1lJyksXHJcbiAgICAgICAgICBzaG9wTmFtZTogc2hvcCgnc2hvcE5hbWUnKSxcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuICB9KS5lcUpvaW4oJ2lkJywgci5kYignbWFwbGVzdG9yeScpLnRhYmxlKCdpdGVtcycpKS5tYXAoZnVuY3Rpb24oaXRlbSl7XHJcbiAgICByZXR1cm4gaXRlbSgnbGVmdCcpXHJcbiAgICAgIC5tZXJnZShpdGVtKCdyaWdodCcpKCdEZXNjcmlwdGlvbicpKVxyXG4gICAgICAubWVyZ2UoaXRlbSgncmlnaHQnKSgnTWV0YUluZm8nKS53aXRob3V0KCdJY29uJykpXHJcbiAgICAgIC5tZXJnZShyLmJyYW5jaChpdGVtKCdyaWdodCcpKCdNZXRhSW5mbycpKCdFcXVpcCcpLCByLmV4cHIoe3BvdGVudGlhbHM6IHIuZXhwcihbXHJcbiAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdwb3RlbnRpYWwxJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdwb3RlbnRpYWwxJ30sXHJcbiAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdwb3RlbnRpYWwyJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdwb3RlbnRpYWwyJ30sXHJcbiAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdwb3RlbnRpYWwzJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdwb3RlbnRpYWwzJ30sXHJcbiAgICAgICAgICB7J1BvdGVudGlhbElkJzogaXRlbSgnbGVmdCcpKCdicG90ZW50aWFsMScpLmNvZXJjZVRvKCdudW1iZXInKSwgdGFyZ2V0OiAnYnBvdGVudGlhbDEnfSxcclxuICAgICAgICAgIHsnUG90ZW50aWFsSWQnOiBpdGVtKCdsZWZ0JykoJ2Jwb3RlbnRpYWwyJykuY29lcmNlVG8oJ251bWJlcicpLCB0YXJnZXQ6ICdicG90ZW50aWFsMid9LFxyXG4gICAgICAgICAgeydQb3RlbnRpYWxJZCc6IGl0ZW0oJ2xlZnQnKSgnYnBvdGVudGlhbDMnKS5jb2VyY2VUbygnbnVtYmVyJyksIHRhcmdldDogJ2Jwb3RlbnRpYWwzJ31cclxuICAgICAgXSkuZXFKb2luKCdQb3RlbnRpYWxJZCcsIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgncG90ZW50aWFsTGV2ZWxzJyksIHtpbmRleDogJ1BvdGVudGlhbElkJ30pLnppcCgpXHJcbiAgICAgIC5maWx0ZXIoe0xldmVsOiByLmJyYW5jaChpdGVtKCdyaWdodCcpKCdNZXRhSW5mbycpKCdFcXVpcCcpKCdyZXFMZXZlbCcpLCBpdGVtKCdyaWdodCcpKCdNZXRhSW5mbycpKCdFcXVpcCcpKCdyZXFMZXZlbCcpLCAxKS5jb2VyY2VUbygnbnVtYmVyJykuYWRkKDkpLmRpdigxMCkuZmxvb3IoKX0pXHJcbiAgICAgIC5lcUpvaW4oJ1BvdGVudGlhbElkJywgci5kYignbWFwbGVzdG9yeScpLnRhYmxlKCdwb3RlbnRpYWxzJykpLnppcCgpLndpdGhvdXQoJ0xldmVsJywgJ1BvdGVudGlhbElkJywgJ1JlcXVpcmVkTGV2ZWwnKX0pLCB7fSkpXHJcbiAgfSkud2l0aG91dCgndW5rMScsICd1bmsyJywgJ3VuazMnLCAndW5rNCcsICd1bms1JywgJ3VuazYnLCAndW5rNycsICd1bms4JywgJ1daRmlsZScsICdXWkZvbGRlcicsICdicG90ZW50aWFsMUxldmVsJywgJ2Jwb3RlbnRpYWwyTGV2ZWwnLCAnYnBvdGVudGlhbDNMZXZlbCcsICdwb3RlbnRpYWwxTGV2ZWwnLCAncG90ZW50aWFsMkxldmVsJywgJ3BvdGVudGlhbDNMZXZlbCcsICdwb3RlbnRpYWwxJywgJ3BvdGVudGlhbDInLCAncG90ZW50aWFsMycsICdicG90ZW50aWFsMScsICdicG90ZW50aWFsMicsICdicG90ZW50aWFsMycpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgbmV3IFJldGhpbmtEQiBjb25uZWN0aW9uIHRvIHJ1biBxdWVyaWVzIGFnYWluc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25uZWN0KCkge1xyXG4gIHJldHVybiByLmNvbm5lY3Qoe1xyXG4gICAgaG9zdDogcHJvY2Vzcy5lbnYuUkVUSElOS0RCX0hPU1QsXHJcbiAgICBwb3J0OiBwcm9jZXNzLmVudi5SRVRISU5LREJfUE9SVCxcclxuICAgIEFVVEg6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9BVVRILFxyXG4gICAgREI6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9EQlxyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0ge1xyXG4gIGNvbnN0cnVjdG9yKHJldGhpbmtEYXRhKXtcclxuICAgIHRoaXMuX2RhdGEgPSByZXRoaW5rRGF0YTtcclxuICB9XHJcblxyXG4gIHRvSlNPTigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2FyZDogdGhpcy5jYXJkLFxyXG4gICAgICBjYXNoOiB0aGlzLmNhc2gsXHJcbiAgICAgIGVxdWlwOiB0aGlzLmVxdWlwLFxyXG4gICAgICBpY29uOiB0aGlzLmljb24sXHJcbiAgICAgIHNob3A6IHRoaXMuc2hvcCxcclxuICAgICAgY2hhaXI6IHRoaXMuY2hhaXIsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxyXG4gICAgICBJdGVtSWQ6IHRoaXMuSXRlbUlkLFxyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIHNsb3Q6IHRoaXMuc2xvdCxcclxuICAgICAgYWNjOiB0aGlzLmFjYyxcclxuICAgICAgYXZvaWQ6IHRoaXMuYXZvaWQsXHJcbiAgICAgIGJhdHRsZU1vZGVBdHQ6IHRoaXMuYmF0dGxlTW9kZUF0dCxcclxuICAgICAgYm9zc0RtZzogdGhpcy5ib3NzRG1nLFxyXG4gICAgICBidW5kbGU6IHRoaXMuYnVuZGxlLFxyXG4gICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcclxuICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsLFxyXG4gICAgICBjaGFyYWN0ZXJOYW1lOiB0aGlzLmNoYXJhY3Rlck5hbWUsXHJcbiAgICAgIGNyZWF0ZWRBdDogdGhpcy5jcmVhdGVkQXQsXHJcbiAgICAgIGNyZWF0b3I6IHRoaXMuY3JlYXRvcixcclxuICAgICAgZGV4OiB0aGlzLmRleCxcclxuICAgICAgZGlsaWdlbmNlOiB0aGlzLmRpbGlnZW5jZSxcclxuICAgICAgZHVyYWJpbGl0eTogdGhpcy5kdXJhYmlsaXR5LFxyXG4gICAgICBleHBpcmVUaW1lOiB0aGlzLmV4cGlyZVRpbWUsXHJcbiAgICAgIGdyb3d0aDogdGhpcy5ncm93dGgsXHJcbiAgICAgIGhhbW1lckFwcGxpZWQ6IHRoaXMuaGFtbWVyQXBwbGllZCxcclxuICAgICAgaWdub3JlRGVmOiB0aGlzLmlnbm9yZURlZixcclxuICAgICAgaW50ZWxsaWdlbmNlOiB0aGlzLmludGVsbGlnZW5jZSxcclxuICAgICAgaXNJZGVudGlmaWVkOiB0aGlzLmlzSWRlbnRpZmllZCxcclxuICAgICAganVtcDogdGhpcy5qdW1wLFxyXG4gICAgICBsdWs6IHRoaXMubHVrLFxyXG4gICAgICBtYXRrOiB0aGlzLm1hdGssXHJcbiAgICAgIG1kZWY6IHRoaXMubWRlZixcclxuICAgICAgbWhwOiB0aGlzLm1ocCxcclxuICAgICAgbW1wOiB0aGlzLm1tcCxcclxuICAgICAgbmVidWxpdGU6IHRoaXMubmVidWxpdGUsXHJcbiAgICAgIG51bWJlck9mRW5oYW5jZW1lbnRzOiB0aGlzLm51bWJlck9mRW5oYW5jZW1lbnRzLFxyXG4gICAgICBudW1iZXJPZlBsdXNzZXM6IHRoaXMubnVtYmVyT2ZQbHVzc2VzLFxyXG4gICAgICBvbmx5OiB0aGlzLm9ubHksXHJcbiAgICAgIHBvdGVudGlhbHM6IHRoaXMucG90ZW50aWFscyxcclxuICAgICAgcHJpY2U6IHRoaXMucHJpY2UsXHJcbiAgICAgIHF1YW50aXR5OiB0aGlzLnF1YW50aXR5LFxyXG4gICAgICByYXJpdHk6IHRoaXMucmFyaXR5LFxyXG4gICAgICByb29tOiB0aGlzLnJvb20sXHJcbiAgICAgIHNlcnZlcjogdGhpcy5zZXJ2ZXIsXHJcbiAgICAgIHNob3BJRDogdGhpcy5zaG9wSUQsXHJcbiAgICAgIHNob3BOYW1lOiB0aGlzLnNob3BOYW1lLFxyXG4gICAgICBzcGVlZDogdGhpcy5zcGVlZCxcclxuICAgICAgc3RyOiB0aGlzLnN0cixcclxuICAgICAgdW50cmFkZWFibGU6IHRoaXMudW50cmFkZWFibGUsXHJcbiAgICAgIHVwZ3JhZGVzQXZhaWxhYmxlOiB0aGlzLnVwZ3JhZGVzQXZhaWxhYmxlLFxyXG4gICAgICB3YXRrOiB0aGlzLndhdGssXHJcbiAgICAgIHdkZWY6IHRoaXMud2RlZixcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBjYXJkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5DYXJkXHJcbiAgfVxyXG5cclxuICBnZXQgY2FzaCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuQ2FzaFxyXG4gIH1cclxuXHJcbiAgZ2V0IGVxdWlwKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5FcXVpcFxyXG4gIH1cclxuXHJcbiAgZ2V0IGljb24oKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGljb246ICcvYXBpL21hcGxlc3RvcnkvaXRlbS8nICsgdGhpcy5pdGVtSWQgKyAnL2ljb24nLFxyXG4gICAgICBpY29uUmF3OiAnL2FwaS9tYXBsZXN0b3J5L2l0ZW0vJyArIHRoaXMuaXRlbUlkICsgJy9pY29uUmF3J1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNob3AoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLlNob3BcclxuICB9XHJcblxyXG4gIGdldCBjaGFpcigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuQ2hhaXJcclxuICB9XHJcblxyXG4gIGdldCBkZXNjcmlwdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuRGVzY3JpcHRpb25cclxuICB9XHJcblxyXG4gIGdldCBpdGVtSWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLklkXHJcbiAgfVxyXG5cclxuICBnZXQgbmFtZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuTmFtZVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNsb3QoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLlNsb3RcclxuICB9XHJcblxyXG4gIGdldCBhY2MoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmFjY1xyXG4gIH1cclxuXHJcbiAgZ2V0IGF2b2lkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5hdm9pZFxyXG4gIH1cclxuXHJcbiAgZ2V0IGJhdHRsZU1vZGVBdHQoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmJhdHRsZU1vZGVBdHRcclxuICB9XHJcblxyXG4gIGdldCBib3NzRG1nKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5ib3NzRG1nXHJcbiAgfVxyXG5cclxuICBnZXQgYnVuZGxlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5idW5kbGVcclxuICB9XHJcblxyXG4gIGdldCBjYXRlZ29yeSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY2F0ZWdvcnlcclxuICB9XHJcblxyXG4gIGdldCBjaGFubmVsKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5jaGFubmVsXHJcbiAgfVxyXG5cclxuICBnZXQgY2hhcmFjdGVyTmFtZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY2hhcmFjdGVyTmFtZVxyXG4gIH1cclxuXHJcbiAgZ2V0IGNyZWF0ZWRBdCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY3JlYXRlZEF0XHJcbiAgfVxyXG5cclxuICBnZXQgY3JlYXRvcigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY3JlYXRvclxyXG4gIH1cclxuXHJcbiAgZ2V0IGRleCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuZGV4XHJcbiAgfVxyXG5cclxuICBnZXQgZGlsaWdlbmNlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5kaWxpZ2VuY2VcclxuICB9XHJcblxyXG4gIGdldCBkdXJhYmlsaXR5KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5kdXJhYmlsaXR5XHJcbiAgfVxyXG5cclxuICBnZXQgZXhwaXJlVGltZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuZXhwaXJlVGltZVxyXG4gIH1cclxuXHJcbiAgZ2V0IGdyb3d0aCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuZ3Jvd3RoXHJcbiAgfVxyXG5cclxuICBnZXQgaGFtbWVyQXBwbGllZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaGFtbWVyQXBwbGllZFxyXG4gIH1cclxuXHJcbiAgZ2V0IGlnbm9yZURlZigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaWdub3JlRGVmXHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWxsaWdlbmNlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pbnRlbGxpZ2VuY2VcclxuICB9XHJcblxyXG4gIGdldCBpc0lkZW50aWZpZWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmlzSWRlbnRpZmllZFxyXG4gIH1cclxuXHJcbiAgZ2V0IGp1bXAoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmp1bXBcclxuICB9XHJcblxyXG4gIGdldCBsdWsoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmx1a1xyXG4gIH1cclxuXHJcbiAgZ2V0IG1hdGsoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLm1hdGtcclxuICB9XHJcblxyXG4gIGdldCBtZGVmKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5tZGVmXHJcbiAgfVxyXG5cclxuICBnZXQgbWhwKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5taHBcclxuICB9XHJcblxyXG4gIGdldCBtbXAoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLm1tcFxyXG4gIH1cclxuXHJcbiAgZ2V0IG5lYnVsaXRlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5uZWJ1bGl0ZVxyXG4gIH1cclxuXHJcbiAgZ2V0IG51bWJlck9mRW5oYW5jZW1lbnRzKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5udW1iZXJPZkVuaGFuY2VtZW50c1xyXG4gIH1cclxuXHJcbiAgZ2V0IG51bWJlck9mUGx1c3Nlcygpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEubnVtYmVyT2ZQbHVzc2VzXHJcbiAgfVxyXG5cclxuICBnZXQgb25seSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEub25seVxyXG4gIH1cclxuXHJcbiAgZ2V0IHBvdGVudGlhbHMoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnBvdGVudGlhbHNcclxuICB9XHJcblxyXG4gIGdldCBwcmljZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEucHJpY2VcclxuICB9XHJcblxyXG4gIGdldCBxdWFudGl0eSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEucXVhbnRpdHlcclxuICB9XHJcblxyXG4gIGdldCByYXJpdHkoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnJhcml0eVxyXG4gIH1cclxuXHJcbiAgZ2V0IHJvb20oKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnJvb21cclxuICB9XHJcblxyXG4gIGdldCBzZXJ2ZXIoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNlcnZlclxyXG4gIH1cclxuXHJcbiAgZ2V0IHNob3BJRCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc2hvcElkXHJcbiAgfVxyXG5cclxuICBnZXQgc2hvcE5hbWUoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNob3BOYW1lXHJcbiAgfVxyXG5cclxuICBnZXQgc3BlZWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLnNwZWVkXHJcbiAgfVxyXG5cclxuICBnZXQgc3RyKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5zdHJcclxuICB9XHJcblxyXG4gIGdldCB1bnRyYWRlYWJsZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudW50cmFkZWFibGVcclxuICB9XHJcblxyXG4gIGdldCB1cGdyYWRlc0F2YWlsYWJsZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudXBncmFkZXNBdmFpbGFibGVcclxuICB9XHJcblxyXG4gIGdldCB3YXRrKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS53YXRrXHJcbiAgfVxyXG5cclxuICBnZXQgd2RlZigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEud2RlZlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBUaGUgcmV0aGlua2RiIGNvbXBhdGlibGUgZmlsdGVyIG9iamVjdCB0byB1c2UgZm9yIHRoZSBxdWVyeS5cclxuICAgKi9cclxuICBzdGF0aWMgYXN5bmMgZmluZEFsbChmaWx0ZXIpe1xyXG4gICAgY29uc3QgY29ubmVjdGlvbiA9IGF3YWl0IENvbm5lY3QoKVxyXG4gICAgY29uc3QgY3Vyc29yID0gYXdhaXQgR2V0SXRlbXMoZmlsdGVyKS5ydW4oY29ubmVjdGlvbilcclxuICAgIGNvbnN0IGZ1bGxJdGVtcyA9IGF3YWl0IGN1cnNvci50b0FycmF5KClcclxuICAgIGNvbm5lY3Rpb24uY2xvc2UoKVxyXG4gICAgcmV0dXJuIGZ1bGxJdGVtcy5tYXAoZW50cnkgPT4gbmV3IEl0ZW0oZW50cnkpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBUaGUgcmV0aGlua2RiIGNvbXBhdGlibGUgZmlsdGVyIG9iamVjdCB0byB1c2UgZm9yIHRoZSBxdWVyeS5cclxuICAgKi9cclxuICBzdGF0aWMgYXN5bmMgZmluZEZpcnN0KGZpbHRlcil7XHJcbiAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgQ29ubmVjdCgpXHJcbiAgICBjb25zdCBjdXJzb3IgPSBhd2FpdCBHZXRJdGVtcyhmaWx0ZXIpLmxpbWl0KDEpLnJ1bihjb25uZWN0aW9uKVxyXG4gICAgY29uc3QgZnVsbEl0ZW1zID0gYXdhaXQgY3Vyc29yLnRvQXJyYXkoKVxyXG4gICAgY29ubmVjdGlvbi5jbG9zZSgpXHJcbiAgICByZXR1cm4gZnVsbEl0ZW1zLm1hcChlbnRyeSA9PiBuZXcgSXRlbShlbnRyeSkpLnNoaWZ0KClcclxuICB9XHJcbn0iXX0=