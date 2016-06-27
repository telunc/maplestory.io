'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./controllers/api');

var _api2 = _interopRequireDefault(_api);

var _index = require('./controllers/index');

var _index2 = _interopRequireDefault(_index);

var _environment = require('./environment');

var _expressLess = require('express-less');

var _expressLess2 = _interopRequireDefault(_expressLess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); // Tie the routes to the routers here, and listen.

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', _index2.default);
app.use('/api', _api2.default);
app.use('/css', (0, _expressLess2.default)(__dirname + '/../less', { debug: _environment.ENV.NODE_ENV == 'development' }));
app.use(_express2.default.static('public'));

app.listen(_environment.PORT);
console.log('Listening on', _environment.PORT);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFJLE1BQU0sd0JBQVYsQzs7QUFFQSxJQUFJLEdBQUosQ0FBUSxhQUFSLEVBQXVCLEtBQXZCO0FBQ0EsSUFBSSxHQUFKLENBQVEsT0FBUixFQUFpQixZQUFZLFFBQTdCOztBQUVBLElBQUksR0FBSixDQUFRLEdBQVI7QUFDQSxJQUFJLEdBQUosQ0FBUSxNQUFSO0FBQ0EsSUFBSSxHQUFKLENBQVEsTUFBUixFQUFnQiwyQkFBWSxZQUFZLFVBQXhCLEVBQW9DLEVBQUMsT0FBTyxpQkFBSSxRQUFKLElBQWdCLGFBQXhCLEVBQXBDLENBQWhCO0FBQ0EsSUFBSSxHQUFKLENBQVEsa0JBQVEsTUFBUixDQUFlLFFBQWYsQ0FBUjs7QUFFQSxJQUFJLE1BQUo7QUFDQSxRQUFRLEdBQVIsQ0FBWSxjQUFaIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGllIHRoZSByb3V0ZXMgdG8gdGhlIHJvdXRlcnMgaGVyZSwgYW5kIGxpc3Rlbi5cclxuXHJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCBNYXBsZVN0b3J5QVBJIGZyb20gJy4vY29udHJvbGxlcnMvYXBpJ1xyXG5pbXBvcnQgSW5kZXggZnJvbSAnLi9jb250cm9sbGVycy9pbmRleCdcclxuaW1wb3J0IHsgRU5WLCBQT1JULCBEQVRBRE9HX0FQSV9LRVksIERBVEFET0dfQVBQX0tFWSB9IGZyb20gJy4vZW52aXJvbm1lbnQnXHJcbmltcG9ydCBleHByZXNzTGVzcyBmcm9tICdleHByZXNzLWxlc3MnXHJcblxyXG52YXIgYXBwID0gZXhwcmVzcygpXHJcblxyXG5hcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKVxyXG5hcHAuc2V0KCd2aWV3cycsIF9fZGlybmFtZSArICcvdmlld3MnKVxyXG5cclxuYXBwLnVzZSgnLycsIEluZGV4KVxyXG5hcHAudXNlKCcvYXBpJywgTWFwbGVTdG9yeUFQSSlcclxuYXBwLnVzZSgnL2NzcycsIGV4cHJlc3NMZXNzKF9fZGlybmFtZSArICcvLi4vbGVzcycsIHtkZWJ1ZzogRU5WLk5PREVfRU5WID09ICdkZXZlbG9wbWVudCd9KSlcclxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXHJcblxyXG5hcHAubGlzdGVuKFBPUlQpXHJcbmNvbnNvbGUubG9nKCdMaXN0ZW5pbmcgb24nLCBQT1JUKVxyXG4iXX0=