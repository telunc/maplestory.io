'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _datadogMetrics = require('datadog-metrics');

var _datadogMetrics2 = _interopRequireDefault(_datadogMetrics);

var _environment = require('../environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function collectProcessMetrics() {
  if (typeof process.cpuUsage === 'function') {
    //works on node 6 only

    var _process$cpuUsage = process.cpuUsage();

    var system = _process$cpuUsage.system;
    var user = _process$cpuUsage.user;

    _datadogMetrics2.default.gauge('cpu.system', system);
    _datadogMetrics2.default.gauge('cpu.user', user);
  }

  var _process$memoryUsage = process.memoryUsage();

  var rss = _process$memoryUsage.rss;
  var heapTotal = _process$memoryUsage.heapTotal;
  var heapUsed = _process$memoryUsage.heapUsed;

  _datadogMetrics2.default.gauge('memory.rss', rss);
  _datadogMetrics2.default.gauge('memory.heapTotal', heapTotal);
  _datadogMetrics2.default.gauge('memory.heapUsed', heapUsed);
}

if (_environment.DATADOG_API_KEY && _environment.DATADOG_APP_KEY) {
  _datadogMetrics2.default.init({
    host: 'stream',
    prefix: 'stream.',
    apiKey: _environment.DATADOG_API_KEY,
    appKey: _environment.DATADOG_APP_KEY
  });
  setInterval(collectProcessMetrics, 5000);
}

exports.default = _datadogMetrics2.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc3RhdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUtBLFNBQVMscUJBQVQsR0FBa0M7QUFDaEMsTUFBSSxPQUFPLFFBQVEsUUFBZixLQUE0QixVQUFoQyxFQUE0Qzs7O0FBQUEsNEJBQ2pCLFFBQVEsUUFBUixFQURpQjs7QUFBQSxRQUNsQyxNQURrQyxxQkFDbEMsTUFEa0M7QUFBQSxRQUMxQixJQUQwQixxQkFDMUIsSUFEMEI7O0FBRTFDLDZCQUFNLEtBQU4sQ0FBWSxZQUFaLEVBQTBCLE1BQTFCO0FBQ0EsNkJBQU0sS0FBTixDQUFZLFVBQVosRUFBd0IsSUFBeEI7QUFDRDs7QUFMK0IsNkJBTUssUUFBUSxXQUFSLEVBTkw7O0FBQUEsTUFNeEIsR0FOd0Isd0JBTXhCLEdBTndCO0FBQUEsTUFNbkIsU0FObUIsd0JBTW5CLFNBTm1CO0FBQUEsTUFNUixRQU5RLHdCQU1SLFFBTlE7O0FBT2hDLDJCQUFNLEtBQU4sQ0FBWSxZQUFaLEVBQTBCLEdBQTFCO0FBQ0EsMkJBQU0sS0FBTixDQUFZLGtCQUFaLEVBQWdDLFNBQWhDO0FBQ0EsMkJBQU0sS0FBTixDQUFZLGlCQUFaLEVBQStCLFFBQS9CO0FBQ0Q7O0FBRUQsSUFBSSw0REFBSixFQUF3QztBQUN0QywyQkFBTSxJQUFOLENBQVc7QUFDVCxVQUFNLFFBREc7QUFFVCxZQUFRLFNBRkM7QUFHVCx3Q0FIUztBQUlUO0FBSlMsR0FBWDtBQU1BLGNBQVkscUJBQVosRUFBbUMsSUFBbkM7QUFDRCIsImZpbGUiOiJzdGF0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdGF0cyBmcm9tICdkYXRhZG9nLW1ldHJpY3MnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEQVRBRE9HX0FQSV9LRVksXHJcbiAgREFUQURPR19BUFBfS0VZXHJcbn0gZnJvbSAnLi4vZW52aXJvbm1lbnQnO1xyXG5cclxuZnVuY3Rpb24gY29sbGVjdFByb2Nlc3NNZXRyaWNzICgpIHtcclxuICBpZiAodHlwZW9mIHByb2Nlc3MuY3B1VXNhZ2UgPT09ICdmdW5jdGlvbicpIHsgLy93b3JrcyBvbiBub2RlIDYgb25seVxyXG4gICAgY29uc3QgeyBzeXN0ZW0sIHVzZXIgfSA9IHByb2Nlc3MuY3B1VXNhZ2UoKTtcclxuICAgIHN0YXRzLmdhdWdlKCdjcHUuc3lzdGVtJywgc3lzdGVtKTtcclxuICAgIHN0YXRzLmdhdWdlKCdjcHUudXNlcicsIHVzZXIpO1xyXG4gIH1cclxuICBjb25zdCB7IHJzcywgaGVhcFRvdGFsLCBoZWFwVXNlZCB9ID0gcHJvY2Vzcy5tZW1vcnlVc2FnZSgpO1xyXG4gIHN0YXRzLmdhdWdlKCdtZW1vcnkucnNzJywgcnNzKTtcclxuICBzdGF0cy5nYXVnZSgnbWVtb3J5LmhlYXBUb3RhbCcsIGhlYXBUb3RhbCk7XHJcbiAgc3RhdHMuZ2F1Z2UoJ21lbW9yeS5oZWFwVXNlZCcsIGhlYXBVc2VkKTtcclxufVxyXG5cclxuaWYgKERBVEFET0dfQVBJX0tFWSAmJiBEQVRBRE9HX0FQUF9LRVkpIHtcclxuICBzdGF0cy5pbml0KHtcclxuICAgIGhvc3Q6ICdzdHJlYW0nLFxyXG4gICAgcHJlZml4OiAnc3RyZWFtLicsXHJcbiAgICBhcGlLZXk6IERBVEFET0dfQVBJX0tFWSxcclxuICAgIGFwcEtleTogREFUQURPR19BUFBfS0VZXHJcbiAgfSk7XHJcbiAgc2V0SW50ZXJ2YWwoY29sbGVjdFByb2Nlc3NNZXRyaWNzLCA1MDAwKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RhdHM7XHJcbiJdfQ==