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

var _mapleitem = require('../../models/mapleitem');

var _mapleitem2 = _interopRequireDefault(_mapleitem);

var _API = require('../../lib/API');

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

_API2.default.registerCall('/api/maplestory/item/:itemId/icon', 'Gets the inventory icon of an item', _API2.default.createParameter(':itemId', 'number', 'The ID of the item'), 'Image/PNG');

router.get('/item/:itemId/icon', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
    var itemId, item, iconData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            itemId = Number(req.params.itemId);
            _context.next = 4;
            return _mapleitem2.default.getFirst(itemId);

          case 4:
            item = _context.sent;

            if (!(!item || !item.Icon || !item.Icon.Icon)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', res.status(404).send('Couldn\'t find an icon for that item.'));

          case 7:
            iconData = new Buffer(item.Icon.Icon, 'base64');

            res.set('Content-Type', 'image/png');
            res.send(iconData);
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](0);

            res.status(500).send({ error: _context.t0.message || _context.t0, trace: _context.t0.trace || null });
            console.log(_context.t0, _context.t0.stack);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 12]]);
  }));
  return function (_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
}());

_API2.default.registerCall('/api/maplestory/item/:itemId/iconRaw', 'Gets the raw icon of an item', _API2.default.createParameter(':itemId', 'number', 'The ID of the item'), 'Image/PNG');

router.get('/item/:itemId/iconRaw', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, next) {
    var itemId, item, iconData;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            itemId = Number(req.params.itemId);
            _context2.next = 4;
            return _mapleitem2.default.getFirst(itemId);

          case 4:
            item = _context2.sent;

            if (!(!item || !item.Icon || !item.Icon.IconRaw)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', res.status(404).send('Couldn\'t find an icon for that item.'));

          case 7:
            iconData = new Buffer(item.Icon.IconRaw, 'base64');

            res.set('Content-Type', 'image/png');
            res.send(iconData);
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](0);

            res.status(500).send({ error: _context2.t0.message || _context2.t0, trace: _context2.t0.trace || null });
            console.log(_context2.t0, _context2.t0.stack);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 12]]);
  }));
  return function (_x4, _x5, _x6) {
    return ref.apply(this, arguments);
  };
}());

exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cm9sbGVycy9hcGkvbWFwbGVzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sU0FBUyxrQkFBUSxNQUFSLEVBQWY7O0FBRUEsY0FBSSxZQUFKLENBQ0UsbUNBREYsRUFFRSxvQ0FGRixFQUdFLGNBQUksZUFBSixDQUFvQixTQUFwQixFQUErQixRQUEvQixFQUF5QyxvQkFBekMsQ0FIRixFQUlFLFdBSkY7O0FBT0EsT0FBTyxHQUFQLENBQVcsb0JBQVg7QUFBQSx1RUFBaUMsaUJBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsSUFBakI7QUFBQSxRQUV6QixNQUZ5QixFQUd2QixJQUh1QixFQU96QixRQVB5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFekIsa0JBRnlCLEdBRWhCLE9BQU8sSUFBSSxNQUFKLENBQVcsTUFBbEIsQ0FGZ0I7QUFBQTtBQUFBLG1CQUdWLG9CQUFVLFFBQVYsQ0FBbUIsTUFBbkIsQ0FIVTs7QUFBQTtBQUd2QixnQkFIdUI7O0FBQUEsa0JBSzFCLENBQUMsSUFBRCxJQUFTLENBQUMsS0FBSyxJQUFmLElBQXVCLENBQUMsS0FBSyxJQUFMLENBQVUsSUFMUjtBQUFBO0FBQUE7QUFBQTs7QUFBQSw2Q0FLcUIsSUFBSSxNQUFKLENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFxQix1Q0FBckIsQ0FMckI7O0FBQUE7QUFPekIsb0JBUHlCLEdBT2QsSUFBSSxNQUFKLENBQVcsS0FBSyxJQUFMLENBQVUsSUFBckIsRUFBMkIsUUFBM0IsQ0FQYzs7QUFRN0IsZ0JBQUksR0FBSixDQUFRLGNBQVIsRUFBd0IsV0FBeEI7QUFDQSxnQkFBSSxJQUFKLENBQVMsUUFBVDtBQVQ2QjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFXN0IsZ0JBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsRUFBQyxPQUFPLFlBQUcsT0FBSCxlQUFSLEVBQTBCLE9BQU8sWUFBRyxLQUFILElBQVksSUFBN0MsRUFBckI7QUFDQSxvQkFBUSxHQUFSLGNBQWdCLFlBQUcsS0FBbkI7O0FBWjZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQWpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZ0JBLGNBQUksWUFBSixDQUNFLHNDQURGLEVBRUUsOEJBRkYsRUFHRSxjQUFJLGVBQUosQ0FBb0IsU0FBcEIsRUFBK0IsUUFBL0IsRUFBeUMsb0JBQXpDLENBSEYsRUFJRSxXQUpGOztBQU9BLE9BQU8sR0FBUCxDQUFXLHVCQUFYO0FBQUEsdUVBQW9DLGtCQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLElBQWpCO0FBQUEsUUFFNUIsTUFGNEIsRUFHMUIsSUFIMEIsRUFPNUIsUUFQNEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTVCLGtCQUY0QixHQUVuQixPQUFPLElBQUksTUFBSixDQUFXLE1BQWxCLENBRm1CO0FBQUE7QUFBQSxtQkFHYixvQkFBVSxRQUFWLENBQW1CLE1BQW5CLENBSGE7O0FBQUE7QUFHMUIsZ0JBSDBCOztBQUFBLGtCQUs3QixDQUFDLElBQUQsSUFBUyxDQUFDLEtBQUssSUFBZixJQUF1QixDQUFDLEtBQUssSUFBTCxDQUFVLE9BTEw7QUFBQTtBQUFBO0FBQUE7O0FBQUEsOENBS3FCLElBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsdUNBQXJCLENBTHJCOztBQUFBO0FBTzVCLG9CQVA0QixHQU9qQixJQUFJLE1BQUosQ0FBVyxLQUFLLElBQUwsQ0FBVSxPQUFyQixFQUE4QixRQUE5QixDQVBpQjs7QUFRaEMsZ0JBQUksR0FBSixDQUFRLGNBQVIsRUFBd0IsV0FBeEI7QUFDQSxnQkFBSSxJQUFKLENBQVMsUUFBVDtBQVRnQztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFXaEMsZ0JBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsRUFBQyxPQUFPLGFBQUcsT0FBSCxnQkFBUixFQUEwQixPQUFPLGFBQUcsS0FBSCxJQUFZLElBQTdDLEVBQXJCO0FBQ0Esb0JBQVEsR0FBUixlQUFnQixhQUFHLEtBQW5COztBQVpnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBOztrQkFnQmUsTSIsImZpbGUiOiJtYXBsZXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCByIGZyb20gJ3JldGhpbmtkYidcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXHJcbmltcG9ydCBNYXBsZUl0ZW0gZnJvbSAnLi4vLi4vbW9kZWxzL21hcGxlaXRlbSdcclxuaW1wb3J0IEFQSSBmcm9tICcuLi8uLi9saWIvQVBJJ1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbkFQSS5yZWdpc3RlckNhbGwoXHJcbiAgJy9hcGkvbWFwbGVzdG9yeS9pdGVtLzppdGVtSWQvaWNvbicsXHJcbiAgJ0dldHMgdGhlIGludmVudG9yeSBpY29uIG9mIGFuIGl0ZW0nLFxyXG4gIEFQSS5jcmVhdGVQYXJhbWV0ZXIoJzppdGVtSWQnLCAnbnVtYmVyJywgJ1RoZSBJRCBvZiB0aGUgaXRlbScpLFxyXG4gICdJbWFnZS9QTkcnXHJcbilcclxuXHJcbnJvdXRlci5nZXQoJy9pdGVtLzppdGVtSWQvaWNvbicsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gIHRyeXtcclxuICAgIHZhciBpdGVtSWQgPSBOdW1iZXIocmVxLnBhcmFtcy5pdGVtSWQpXHJcbiAgICBjb25zdCBpdGVtID0gYXdhaXQgTWFwbGVJdGVtLmdldEZpcnN0KGl0ZW1JZClcclxuXHJcbiAgICBpZighaXRlbSB8fCAhaXRlbS5JY29uIHx8ICFpdGVtLkljb24uSWNvbikgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdDb3VsZG5cXCd0IGZpbmQgYW4gaWNvbiBmb3IgdGhhdCBpdGVtLicpXHJcblxyXG4gICAgdmFyIGljb25EYXRhID0gbmV3IEJ1ZmZlcihpdGVtLkljb24uSWNvbiwgJ2Jhc2U2NCcpXHJcbiAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAnaW1hZ2UvcG5nJylcclxuICAgIHJlcy5zZW5kKGljb25EYXRhKVxyXG4gIH1jYXRjaChleCl7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCh7ZXJyb3I6IGV4Lm1lc3NhZ2UgfHwgZXgsIHRyYWNlOiBleC50cmFjZSB8fCBudWxsfSlcclxuICAgIGNvbnNvbGUubG9nKGV4LCBleC5zdGFjaylcclxuICB9XHJcbn0pXHJcblxyXG5BUEkucmVnaXN0ZXJDYWxsKFxyXG4gICcvYXBpL21hcGxlc3RvcnkvaXRlbS86aXRlbUlkL2ljb25SYXcnLFxyXG4gICdHZXRzIHRoZSByYXcgaWNvbiBvZiBhbiBpdGVtJyxcclxuICBBUEkuY3JlYXRlUGFyYW1ldGVyKCc6aXRlbUlkJywgJ251bWJlcicsICdUaGUgSUQgb2YgdGhlIGl0ZW0nKSxcclxuICAnSW1hZ2UvUE5HJ1xyXG4pXHJcblxyXG5yb3V0ZXIuZ2V0KCcvaXRlbS86aXRlbUlkL2ljb25SYXcnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICB0cnl7XHJcbiAgICB2YXIgaXRlbUlkID0gTnVtYmVyKHJlcS5wYXJhbXMuaXRlbUlkKVxyXG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IE1hcGxlSXRlbS5nZXRGaXJzdChpdGVtSWQpXHJcblxyXG4gICAgaWYoIWl0ZW0gfHwgIWl0ZW0uSWNvbiB8fCAhaXRlbS5JY29uLkljb25SYXcpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCgnQ291bGRuXFwndCBmaW5kIGFuIGljb24gZm9yIHRoYXQgaXRlbS4nKVxyXG5cclxuICAgIHZhciBpY29uRGF0YSA9IG5ldyBCdWZmZXIoaXRlbS5JY29uLkljb25SYXcsICdiYXNlNjQnKVxyXG4gICAgcmVzLnNldCgnQ29udGVudC1UeXBlJywgJ2ltYWdlL3BuZycpXHJcbiAgICByZXMuc2VuZChpY29uRGF0YSlcclxuICB9Y2F0Y2goZXgpe1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoe2Vycm9yOiBleC5tZXNzYWdlIHx8IGV4LCB0cmFjZTogZXgudHJhY2UgfHwgbnVsbH0pXHJcbiAgICBjb25zb2xlLmxvZyhleCwgZXguc3RhY2spXHJcbiAgfVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyIl19