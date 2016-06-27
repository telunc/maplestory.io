'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _API = require('../lib/API');

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res, next) {
  console.log('rendering index');
  res.render('pages/index', { calls: _API2.default.availableCalls });
});

exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsa0JBQVEsTUFBUixFQUFmOztBQUVBLE9BQU8sR0FBUCxDQUFXLEdBQVgsRUFBZ0IsVUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixJQUFwQixFQUEwQjtBQUN4QyxVQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNBLE1BQUksTUFBSixDQUFXLGFBQVgsRUFBMEIsRUFBQyxPQUFPLGNBQUksY0FBWixFQUExQjtBQUNELENBSEQ7O2tCQUtlLE0iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgQVBJIGZyb20gJy4uL2xpYi9BUEknXHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpXHJcblxyXG5yb3V0ZXIuZ2V0KCcvJywgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgY29uc29sZS5sb2coJ3JlbmRlcmluZyBpbmRleCcpXHJcbiAgcmVzLnJlbmRlcigncGFnZXMvaW5kZXgnLCB7Y2FsbHM6IEFQSS5hdmFpbGFibGVDYWxsc30pXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXJcclxuIl19