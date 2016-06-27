'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _rethinkdb = require('rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _room = require('../../models/room');

var _room2 = _interopRequireDefault(_room);

var _item = require('../../models/item');

var _item2 = _interopRequireDefault(_item);

var _API = require('../../lib/API');

var _API2 = _interopRequireDefault(_API);

var _apicache = require('apicache');

var _apicache2 = _interopRequireDefault(_apicache);

var _environment = require('../../environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var caching = _apicache2.default.options({
  debug: _environment.ENV.NODE_ENV == 'development',
  defaultDuration: 60000,
  enabled: true
}).middleware;

//Try to cache the results for at least 60 seconds as CPU is also costly
router.use(caching());

_API2.default.registerCall('/api/fm/world/:worldId/rooms', 'Gets a list of rooms with the shops and items in a world.', _API2.default.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'), [{
  'shops': {
    'shopId': {
      'characterName': 'CharacterName',
      'id': 'shopId',
      'items': ['itemObject']
    }
  }
}]);
router.get('/world/:worldId/rooms', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
    var worldId, rooms;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            worldId = Number(req.params.worldId);
            _context.next = 4;
            return _room2.default.findRooms(worldId);

          case 4:
            rooms = _context.sent;

            res.success(rooms);
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            res.status(500).send({ error: _context.t0.message || _context.t0, trace: _context.t0.trace || null });
            console.log(_context.t0, _context.t0.stack);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 8]]);
  }));
  return function (_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
}());

_API2.default.registerCall('/api/fm/world/:worldId/room/:roomId', 'Gets a list of shops and items in a specific room on a specific world.', [_API2.default.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'), _API2.default.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')], {
  'shops': {
    'shopId': {
      'characterName': 'CharacterName',
      'id': 'shopId',
      'items': ['itemObject']
    }
  }
});
router.get('/world/:worldId/room/:roomId', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, next) {
    var worldId, roomId, rooms;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            worldId = Number(req.params.worldId);
            roomId = Number(req.params.roomId);
            _context2.next = 5;
            return _room2.default.findRoom(worldId, 1, roomId);

          case 5:
            rooms = _context2.sent;

            res.success(rooms);
            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);

            res.status(500).send({ error: _context2.t0.message || _context2.t0, trace: _context2.t0.trace || null });
            console.log(_context2.t0, _context2.t0.stack);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 9]]);
  }));
  return function (_x4, _x5, _x6) {
    return ref.apply(this, arguments);
  };
}());

_API2.default.registerCall('/api/fm/world/:worldId/room/:roomId/items', 'Gets a list of items in a specific room on a specific world.', [_API2.default.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'), _API2.default.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')], [{
  cash: { cash: true },
  equip: { 'accountSharable': null, 'attack': null, 'attackSpeed': null, 'bdR': null, 'bossReward': null, 'charismaEXP': null, 'charmEXP': null, 'craftEXP': null, 'durability': null, 'equipTradeBlock': null, 'exItem': null, 'imdR': null, 'incACC': null, 'incCraft': null, 'incDEX': null, 'incEVA': null, 'incINT': null, 'incJump': null, 'incLUK': null, 'incMAD': null, 'incMDD': null, 'incMHP': null, 'incMMP': null, 'incPAD': null, 'incPDD': null, 'incSTR': null, 'incSpeed': null, 'islot': 'MaPn', 'noPotential': null, 'reqDEX': 0, 'reqINT': 0, 'reqJob': 0, 'reqJob2': null, 'reqLUK': 0, 'reqLevel': 0, 'reqPOP': null, 'reqSTR': 0, 'reqSpecJob': null, 'senseEXP': null, 'superiorEqp': null, 'tradeAvailable': null, 'tradeBlock': null, 'tuc': null, 'unchangeable': null, 'vslot': 'MaPn', 'willEXP': null },
  icon: {
    icon: 'base64/png',
    iconRaw: 'base64/png'
  },
  shop: { 'monsterBook': false, 'notSale': false, 'price': 100 },
  chair: { 'recoveryHP': 100, 'recoveryMP': 50, 'reqLevel': 0 },
  description: 'Some really awesome item',
  ItemId: 0,
  name: 'Pro Item',
  slot: 0,
  acc: 0,
  avoid: 0,
  battleModeAtt: 0,
  bossDmg: 0,
  bundle: 0,
  category: 0,
  channel: 0,
  characterName: 0,
  createdAt: 0,
  creator: 'SomeCoolGuy123456789',
  dex: 0,
  diligence: 0,
  durability: 0,
  expireTime: 0,
  growth: 0,
  hammerApplied: 0,
  ignoreDef: 0,
  intelligence: 0,
  isIdentified: 0,
  jump: 0,
  luk: 0,
  matk: 0,
  mdef: 0,
  mhp: 0,
  mmp: 0,
  nebulite: 0,
  numberOfEnhancements: 0,
  numberOfPlusses: 0,
  only: 0,
  potentials: 0,
  price: 0,
  quantity: 0,
  rarity: 0,
  room: 0,
  server: 0,
  shopID: 0,
  shopName: 0,
  speed: 0,
  str: 0,
  untradeable: 0,
  upgradesAvailable: 0,
  watk: 0,
  wdef: 0
}]);
router.get('/world/:worldId/room/:roomId/items', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res, next) {
    var worldId, roomId, items;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            worldId = Number(req.params.worldId);
            roomId = Number(req.params.roomId);
            _context3.next = 5;
            return _item2.default.findAll({ room: roomId, server: worldId });

          case 5:
            items = _context3.sent;

            res.success(items);
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3['catch'](0);

            res.status(500).send({ error: _context3.t0.message || _context3.t0, trace: _context3.t0.trace || null });
            console.log(_context3.t0, _context3.t0.stack);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 9]]);
  }));
  return function (_x7, _x8, _x9) {
    return ref.apply(this, arguments);
  };
}());

exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cm9sbGVycy9hcGkvZm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTSxTQUFTLGtCQUFRLE1BQVIsRUFBZjs7QUFFQSxJQUFNLFVBQVUsbUJBQVMsT0FBVCxDQUFpQjtBQUMvQixTQUFPLGlCQUFJLFFBQUosSUFBZ0IsYUFEUTtBQUUvQixtQkFBaUIsS0FGYztBQUcvQixXQUFTO0FBSHNCLENBQWpCLEVBSWIsVUFKSDs7O0FBT0EsT0FBTyxHQUFQLENBQVcsU0FBWDs7QUFFQSxjQUFJLFlBQUosQ0FDRSw4QkFERixFQUVFLDJEQUZGLEVBR0UsY0FBSSxlQUFKLENBQW9CLFVBQXBCLEVBQWdDLFFBQWhDLEVBQTBDLDRGQUExQyxDQUhGLEVBSUUsQ0FDRTtBQUNJLFdBQVM7QUFDTCxjQUFVO0FBQ04sdUJBQWlCLGVBRFg7QUFFTixZQUFNLFFBRkE7QUFHTixlQUFTLENBQ0wsWUFESztBQUhIO0FBREw7QUFEYixDQURGLENBSkY7QUFrQkEsT0FBTyxHQUFQLENBQVcsdUJBQVg7QUFBQSx1RUFBb0MsaUJBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsSUFBakI7QUFBQSxRQUU1QixPQUY0QixFQUcxQixLQUgwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFNUIsbUJBRjRCLEdBRWxCLE9BQU8sSUFBSSxNQUFKLENBQVcsT0FBbEIsQ0FGa0I7QUFBQTtBQUFBLG1CQUdaLGVBQUssU0FBTCxDQUFlLE9BQWYsQ0FIWTs7QUFBQTtBQUcxQixpQkFIMEI7O0FBSWhDLGdCQUFJLE9BQUosQ0FBWSxLQUFaO0FBSmdDO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQU1oQyxnQkFBSSxNQUFKLENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFxQixFQUFDLE9BQU8sWUFBRyxPQUFILGVB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ZSxNIiwiZmlsZSI6ImZtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCByIGZyb20gJ3JldGhpbmtkYidcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXHJcbmltcG9ydCBSb29tIGZyb20gJy4uLy4uL21vZGVscy9yb29tJ1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuLi8uLi9tb2RlbHMvaXRlbSdcclxuaW1wb3J0IEFQSSBmcm9tICcuLi8uLi9saWIvQVBJJ1xyXG5pbXBvcnQgYXBpY2FjaGUgZnJvbSAnYXBpY2FjaGUnXHJcbmltcG9ydCB7IEVOViwgUE9SVCwgREFUQURPR19BUElfS0VZLCBEQVRBRE9HX0FQUF9LRVkgfSBmcm9tICcuLi8uLi9lbnZpcm9ubWVudCdcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5jb25zdCBjYWNoaW5nID0gYXBpY2FjaGUub3B0aW9ucyh7XHJcbiAgZGVidWc6IEVOVi5OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnLFxyXG4gIGRlZmF1bHREdXJhdGlvbjogNjAwMDAsXHJcbiAgZW5hYmxlZDogdHJ1ZVxyXG59KS5taWRkbGV3YXJlXHJcblxyXG4vL1RyeSB0byBjYWNoZSB0aGUgcmVzdWx0cyBmb3IgYXQgbGVhc3QgNjAgc2Vjb25kcyBhcyBDUFUgaXMgYWxzbyBjb3N0bHlcclxucm91dGVyLnVzZShjYWNoaW5nKCkpXHJcblxyXG5BUEkucmVnaXN0ZXJDYWxsKFxyXG4gICcvYXBpL2ZtL3dvcmxkLzp3b3JsZElkL3Jvb21zJyxcclxuICAnR2V0cyBhIGxpc3Qgb2Ygcm9vbXMgd2l0aCB0aGUgc2hvcHMgYW5kIGl0ZW1zIGluIGEgd29ybGQuJyxcclxuICBBUEkuY3JlYXRlUGFyYW1ldGVyKCc6d29ybGRJZCcsICdudW1iZXInLCAnVGhlIElEIG9mIHRoZSB3b3JsZC4gKDAgPSBTY2FuaWEsIDEgPSBXaW5kaWEsIDIgPSBCZXJhLCAzID0gS2hyb2EsIDQgPSBNWUJDS04sIDUgPSBHUkFaRUQpJyksXHJcbiAgW1xyXG4gICAge1xyXG4gICAgICAgICdzaG9wcyc6IHtcclxuICAgICAgICAgICAgJ3Nob3BJZCc6IHtcclxuICAgICAgICAgICAgICAgICdjaGFyYWN0ZXJOYW1lJzogJ0NoYXJhY3Rlck5hbWUnLFxyXG4gICAgICAgICAgICAgICAgJ2lkJzogJ3Nob3BJZCcsXHJcbiAgICAgICAgICAgICAgICAnaXRlbXMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ2l0ZW1PYmplY3QnXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgXVxyXG4pXHJcbnJvdXRlci5nZXQoJy93b3JsZC86d29ybGRJZC9yb29tcycsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gIHRyeXtcclxuICAgIHZhciB3b3JsZElkID0gTnVtYmVyKHJlcS5wYXJhbXMud29ybGRJZClcclxuICAgIGNvbnN0IHJvb21zID0gYXdhaXQgUm9vbS5maW5kUm9vbXMod29ybGRJZClcclxuICAgIHJlcy5zdWNjZXNzKHJvb21zKVxyXG4gIH1jYXRjaChleCl7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCh7ZXJyb3I6IGV4Lm1lc3NhZ2UgfHwgZXgsIHRyYWNlOiBleC50cmFjZSB8fCBudWxsfSlcclxuICAgIGNvbnNvbGUubG9nKGV4LCBleC5zdGFjaylcclxuICB9XHJcbn0pXHJcblxyXG5BUEkucmVnaXN0ZXJDYWxsKFxyXG4gICcvYXBpL2ZtL3dvcmxkLzp3b3JsZElkL3Jvb20vOnJvb21JZCcsXHJcbiAgJ0dldHMgYSBsaXN0IG9mIHNob3BzIGFuZCBpdGVtcyBpbiBhIHNwZWNpZmljIHJvb20gb24gYSBzcGVjaWZpYyB3b3JsZC4nLFxyXG4gIFtcclxuICAgIEFQSS5jcmVhdGVQYXJhbWV0ZXIoJzp3b3JsZElkJywgJ251bWJlcicsICdUaGUgSUQgb2YgdGhlIHdvcmxkLiAoMCA9IFNjYW5pYSwgMSA9IFdpbmRpYSwgMiA9IEJlcmEsIDMgPSBLaHJvYSwgNCA9IE1ZQkNLTiwgNSA9IEdSQVpFRCknKSxcclxuICAgIEFQSS5jcmVhdGVQYXJhbWV0ZXIoJzpyb29tSWQnLCAnbnVtYmVyJywgJ1RoZSBJRCBvZiB0aGUgcm9vbS4gKDEtMjIpJylcclxuICBdLFxyXG4gIHtcclxuICAgICAgJ3Nob3BzJzoge1xyXG4gICAgICAgICAgJ3Nob3BJZCc6IHtcclxuICAgICAgICAgICAgICAnY2hhcmFjdGVyTmFtZSc6ICdDaGFyYWN0ZXJOYW1lJyxcclxuICAgICAgICAgICAgICAnaWQnOiAnc2hvcElkJyxcclxuICAgICAgICAgICAgICAnaXRlbXMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICdpdGVtT2JqZWN0J1xyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuKVxyXG5yb3V0ZXIuZ2V0KCcvd29ybGQvOndvcmxkSWQvcm9vbS86cm9vbUlkJywgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgdHJ5e1xyXG4gICAgdmFyIHdvcmxkSWQgPSBOdW1iZXIocmVxLnBhcmFtcy53b3JsZElkKVxyXG4gICAgdmFyIHJvb21JZCA9IE51bWJlcihyZXEucGFyYW1zLnJvb21JZClcclxuICAgIGNvbnN0IHJvb21zID0gYXdhaXQgUm9vbS5maW5kUm9vbSh3b3JsZElkLCAxLCByb29tSWQpXHJcbiAgICByZXMuc3VjY2Vzcyhyb29tcylcclxuICB9Y2F0Y2goZXgpe1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoe2Vycm9yOiBleC5tZXNzYWdlIHx8IGV4LCB0cmFjZTogZXgudHJhY2UgfHwgbnVsbH0pXHJcbiAgICBjb25zb2xlLmxvZyhleCwgZXguc3RhY2spXHJcbiAgfVxyXG59KVxyXG5cclxuQVBJLnJlZ2lzdGVyQ2FsbChcclxuICAnL2FwaS9mbS93b3JsZC86d29ybGRJZC9yb29tLzpyb29tSWQvaXRlbXMnLFxyXG4gICdHZXRzIGEgbGlzdCBvZiBpdGVtcyBpbiBhIHNwZWNpZmljIHJvb20gb24gYSBzcGVjaWZpYyB3b3JsZC4nLFxyXG4gIFtcclxuICAgIEFQSS5jcmVhdGVQYXJhbWV0ZXIoJzp3b3JsZElkJywgJ251bWJlcicsICdUaGUgSUQgb2YgdGhlIHdvcmxkLiAoMCA9IFNjYW5pYSwgMSA9IFdpbmRpYSwgMiA9IEJlcmEsIDMgPSBLaHJvYSwgNCA9IE1ZQkNLTiwgNSA9IEdSQVpFRCknKSxcclxuICAgIEFQSS5jcmVhdGVQYXJhbWV0ZXIoJzpyb29tSWQnLCAnbnVtYmVyJywgJ1RoZSBJRCBvZiB0aGUgcm9vbS4gKDEtMjIpJylcclxuICBdLFxyXG4gIFtcclxuICAgIHtcclxuICAgICAgY2FzaDoge2Nhc2g6dHJ1ZX0sXHJcbiAgICAgIGVxdWlwOiB7J2FjY291bnRTaGFyYWJsZSc6bnVsbCwnYXR0YWNrJzpudWxsLCdhdHRhY2tTcGVlZCc6bnVsbCwnYmRSJzpudWxsLCdib3NzUmV3YXJkJzpudWxsLCdjaGFyaXNtYUVYUCc6bnVsbCwnY2hhcm1FWFAnOm51bGwsJ2NyYWZ0RVhQJzpudWxsLCdkdXJhYmlsaXR5JzpudWxsLCdlcXVpcFRyYWRlQmxvY2snOm51bGwsJ2V4SXRlbSc6bnVsbCwnaW1kUic6bnVsbCwnaW5jQUNDJzpudWxsLCdpbmNDcmFmdCc6bnVsbCwnaW5jREVYJzpudWxsLCdpbmNFVkEnOm51bGwsJ2luY0lOVCc6bnVsbCwnaW5jSnVtcCc6bnVsbCwnaW5jTFVLJzpudWxsLCdpbmNNQUQnOm51bGwsJ2luY01ERCc6bnVsbCwnaW5jTUhQJzpudWxsLCdpbmNNTVAnOm51bGwsJ2luY1BBRCc6bnVsbCwnaW5jUEREJzpudWxsLCdpbmNTVFInOm51bGwsJ2luY1NwZWVkJzpudWxsLCdpc2xvdCc6J01hUG4nLCdub1BvdGVudGlhbCc6bnVsbCwncmVxREVYJzowLCdyZXFJTlQnOjAsJ3JlcUpvYic6MCwncmVxSm9iMic6bnVsbCwncmVxTFVLJzowLCdyZXFMZXZlbCc6MCwncmVxUE9QJzpudWxsLCdyZXFTVFInOjAsJ3JlcVNwZWNKb2InOm51bGwsJ3NlbnNlRVhQJzpudWxsLCdzdXBlcmlvckVxcCc6bnVsbCwndHJhZGVBdmFpbGFibGUnOm51bGwsJ3RyYWRlQmxvY2snOm51bGwsJ3R1Yyc6bnVsbCwndW5jaGFuZ2VhYmxlJzpudWxsLCd2c2xvdCc6J01hUG4nLCd3aWxsRVhQJzpudWxsfSxcclxuICAgICAgaWNvbjoge1xyXG4gICAgICAgIGljb246ICdiYXNlNjQvcG5nJyxcclxuICAgICAgICBpY29uUmF3OiAnYmFzZTY0L3BuZydcclxuICAgICAgfSxcclxuICAgICAgc2hvcDogeydtb25zdGVyQm9vayc6ZmFsc2UsJ25vdFNhbGUnOmZhbHNlLCdwcmljZSc6MTAwfSxcclxuICAgICAgY2hhaXI6IHsncmVjb3ZlcnlIUCc6MTAwLCdyZWNvdmVyeU1QJzo1MCwncmVxTGV2ZWwnOjB9LFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NvbWUgcmVhbGx5IGF3ZXNvbWUgaXRlbScsXHJcbiAgICAgIEl0ZW1JZDogMCxcclxuICAgICAgbmFtZTogJ1BybyBJdGVtJyxcclxuICAgICAgc2xvdDogMCxcclxuICAgICAgYWNjOiAwLFxyXG4gICAgICBhdm9pZDogMCxcclxuICAgICAgYmF0dGxlTW9kZUF0dDogMCxcclxuICAgICAgYm9zc0RtZzogMCxcclxuICAgICAgYnVuZGxlOiAwLFxyXG4gICAgICBjYXRlZ29yeTogMCxcclxuICAgICAgY2hhbm5lbDogMCxcclxuICAgICAgY2hhcmFjdGVyTmFtZTogMCxcclxuICAgICAgY3JlYXRlZEF0OiAwLFxyXG4gICAgICBjcmVhdG9yOiAnU29tZUNvb2xHdXkxMjM0NTY3ODknLFxyXG4gICAgICBkZXg6IDAsXHJcbiAgICAgIGRpbGlnZW5jZTogMCxcclxuICAgICAgZHVyYWJpbGl0eTogMCxcclxuICAgICAgZXhwaXJlVGltZTogMCxcclxuICAgICAgZ3Jvd3RoOiAwLFxyXG4gICAgICBoYW1tZXJBcHBsaWVkOiAwLFxyXG4gICAgICBpZ25vcmVEZWY6IDAsXHJcbiAgICAgIGludGVsbGlnZW5jZTogMCxcclxuICAgICAgaXNJZGVudGlmaWVkOiAwLFxyXG4gICAgICBqdW1wOiAwLFxyXG4gICAgICBsdWs6IDAsXHJcbiAgICAgIG1hdGs6IDAsXHJcbiAgICAgIG1kZWY6IDAsXHJcbiAgICAgIG1ocDogMCxcclxuICAgICAgbW1wOiAwLFxyXG4gICAgICBuZWJ1bGl0ZTogMCxcclxuICAgICAgbnVtYmVyT2ZFbmhhbmNlbWVudHM6IDAsXHJcbiAgICAgIG51bWJlck9mUGx1c3NlczogMCxcclxuICAgICAgb25seTogMCxcclxuICAgICAgcG90ZW50aWFsczogMCxcclxuICAgICAgcHJpY2U6IDAsXHJcbiAgICAgIHF1YW50aXR5OiAwLFxyXG4gICAgICByYXJpdHk6IDAsXHJcbiAgICAgIHJvb206IDAsXHJcbiAgICAgIHNlcnZlcjogMCxcclxuICAgICAgc2hvcElEOiAwLFxyXG4gICAgICBzaG9wTmFtZTogMCxcclxuICAgICAgc3BlZWQ6IDAsXHJcbiAgICAgIHN0cjogMCxcclxuICAgICAgdW50cmFkZWFibGU6IDAsXHJcbiAgICAgIHVwZ3JhZGVzQXZhaWxhYmxlOiAwLFxyXG4gICAgICB3YXRrOiAwLFxyXG4gICAgICB3ZGVmOiAwLFxyXG4gICAgfVxyXG4gIF1cclxuKVxyXG5yb3V0ZXIuZ2V0KCcvd29ybGQvOndvcmxkSWQvcm9vbS86cm9vbUlkL2l0ZW1zJywgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgdHJ5e1xyXG4gICAgdmFyIHdvcmxkSWQgPSBOdW1iZXIocmVxLnBhcmFtcy53b3JsZElkKVxyXG4gICAgdmFyIHJvb21JZCA9IE51bWJlcihyZXEucGFyYW1zLnJvb21JZClcclxuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgSXRlbS5maW5kQWxsKHtyb29tOiByb29tSWQsIHNlcnZlcjogd29ybGRJZH0pXHJcbiAgICByZXMuc3VjY2VzcyhpdGVtcylcclxuICB9Y2F0Y2goZXgpe1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoe2Vycm9yOiBleC5tZXNzYWdlIHx8IGV4LCB0cmFjZTogZXgudHJhY2UgfHwgbnVsbH0pXHJcbiAgICBjb25zb2xlLmxvZyhleCwgZXguc3RhY2spXHJcbiAgfVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyIl19