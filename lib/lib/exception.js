'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exception;

var _raven = require('raven');

var _raven2 = _interopRequireDefault(_raven);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

var _environment = require('../environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('stream:exception');

var client = null;

if (_environment.SENTRY_DSN) {
  client = new _raven2.default.Client(_environment.SENTRY_DSN);
  client.patchGlobal(_environment.SENTRY_DSN);
}

function exception(e) {
  if (client) client.captureException(e);
  _stats2.default.increment('exception.thrown');
  log(e);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXhjZXB0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWV3QixTOztBQWZ4Qjs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBLElBQU0sTUFBTSxxQkFBTSxrQkFBTixDQUFaOztBQUVBLElBQUksU0FBUyxJQUFiOztBQUVBLDZCQUFnQjtBQUNkLFdBQVMsSUFBSSxnQkFBTSxNQUFWLHlCQUFUO0FBQ0EsU0FBTyxXQUFQO0FBQ0Q7O0FBRWMsU0FBUyxTQUFULENBQW9CLENBQXBCLEVBQXVCO0FBQ3BDLE1BQUksTUFBSixFQUFZLE9BQU8sZ0JBQVAsQ0FBd0IsQ0FBeEI7QUFDWixrQkFBTSxTQUFOLENBQWdCLGtCQUFoQjtBQUNBLE1BQUksQ0FBSjtBQUNEIiwiZmlsZSI6ImV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYXZlbiBmcm9tICdyYXZlbic7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XHJcblxyXG5pbXBvcnQgc3RhdHMgZnJvbSAnLi9zdGF0cyc7XHJcbmltcG9ydCB7IFNFTlRSWV9EU04gfSBmcm9tICcuLi9lbnZpcm9ubWVudCc7XHJcblxyXG5jb25zdCBsb2cgPSBkZWJ1Zygnc3RyZWFtOmV4Y2VwdGlvbicpO1xyXG5cclxubGV0IGNsaWVudCA9IG51bGw7XHJcblxyXG5pZiAoU0VOVFJZX0RTTikge1xyXG4gIGNsaWVudCA9IG5ldyByYXZlbi5DbGllbnQoU0VOVFJZX0RTTik7XHJcbiAgY2xpZW50LnBhdGNoR2xvYmFsKFNFTlRSWV9EU04pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleGNlcHRpb24gKGUpIHtcclxuICBpZiAoY2xpZW50KSBjbGllbnQuY2FwdHVyZUV4Y2VwdGlvbihlKTtcclxuICBzdGF0cy5pbmNyZW1lbnQoJ2V4Y2VwdGlvbi50aHJvd24nKTtcclxuICBsb2coZSk7XHJcbn1cclxuIl19