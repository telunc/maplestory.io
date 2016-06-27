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

var _fm = require('./api/fm');

var _fm2 = _interopRequireDefault(_fm);

var _maplestory = require('./api/maplestory');

var _maplestory2 = _interopRequireDefault(_maplestory);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//Convert objects appropriately
router.use('/', function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.success = function (model) {
              if (model instanceof Array) return res.status(200).send(model.map(function (entry) {
                return entry.toJSON ? entry.toJSON() : entry;
              }));

              res.status(200).send(model.toJSON ? model.toJSON() : model);
            };

            return _context.abrupt('return', next());

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));
  return function (_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
}());

//Try to compress the objects, because 5Mb per request is costly
router.use((0, _compression2.default)());

router.use('/fm', _fm2.default);
router.use('/maplestory', _maplestory2.default);

exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9hcGkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sU0FBUyxrQkFBUSxNQUFSLEVBQWY7OztBQUdBLE9BQU8sR0FBUCxDQUFXLEdBQVg7QUFBQSx1RUFBZ0IsaUJBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsSUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNkLGdCQUFJLE9BQUosR0FBYyxVQUFDLEtBQUQsRUFBVztBQUN2QixrQkFBRyxpQkFBaUIsS0FBcEIsRUFDRSxPQUFPLElBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsTUFBTSxHQUFOLENBQVUsVUFBQyxLQUFEO0FBQUEsdUJBQVcsTUFBTSxNQUFOLEdBQWUsTUFBTSxNQUFOLEVBQWYsR0FBZ0MsS0FBM0M7QUFBQSxlQUFWLENBQXJCLENBQVA7O0FBRUYsa0JBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsTUFBTSxNQUFOLEdBQWUsTUFBTSxNQUFOLEVBQWYsR0FBZ0MsS0FBckQ7QUFDRCxhQUxEOztBQURjLDZDQVFQLE1BUk87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FBWUEsT0FBTyxHQUFQLENBQVcsNEJBQVg7O0FBRUEsT0FBTyxHQUFQLENBQVcsS0FBWDtBQUNBLE9BQU8sR0FBUCxDQUFXLGFBQVg7O2tCQUVlLE0iLCJmaWxlIjoiYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCByIGZyb20gJ3JldGhpbmtkYidcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXHJcbmltcG9ydCBGTUFwaSBmcm9tICcuL2FwaS9mbSdcclxuaW1wb3J0IE1hcGxlc3RvcnkgZnJvbSAnLi9hcGkvbWFwbGVzdG9yeSdcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbi8vQ29udmVydCBvYmplY3RzIGFwcHJvcHJpYXRlbHlcclxucm91dGVyLnVzZSgnLycsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gIHJlcy5zdWNjZXNzID0gKG1vZGVsKSA9PiB7XHJcbiAgICBpZihtb2RlbCBpbnN0YW5jZW9mIEFycmF5KVxyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQobW9kZWwubWFwKChlbnRyeSkgPT4gZW50cnkudG9KU09OID8gZW50cnkudG9KU09OKCkgOiBlbnRyeSApKVxyXG5cclxuICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKG1vZGVsLnRvSlNPTiA/IG1vZGVsLnRvSlNPTigpIDogbW9kZWwpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV4dCgpXHJcbn0pXHJcblxyXG4vL1RyeSB0byBjb21wcmVzcyB0aGUgb2JqZWN0cywgYmVjYXVzZSA1TWIgcGVyIHJlcXVlc3QgaXMgY29zdGx5XHJcbnJvdXRlci51c2UoY29tcHJlc3Npb24oKSlcclxuXHJcbnJvdXRlci51c2UoJy9mbScsIEZNQXBpKVxyXG5yb3V0ZXIudXNlKCcvbWFwbGVzdG9yeScsIE1hcGxlc3RvcnkpXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXIiXX0=