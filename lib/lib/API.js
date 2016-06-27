'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APICalls = [];

var API = function () {
  function API() {
    (0, _classCallCheck3.default)(this, API);
  }

  (0, _createClass3.default)(API, null, [{
    key: 'registerCall',
    value: function registerCall(callUrl, description, parameters, example, exampleUrl) {

      if (!exampleUrl) {
        exampleUrl = callUrl;
        while (exampleUrl.indexOf(':') != -1) {
          var parameterStart = exampleUrl.indexOf(':');
          var parameterEnd = exampleUrl.indexOf('/', parameterStart);
          exampleUrl = exampleUrl.substr(0, parameterStart) + '1' + (parameterEnd == -1 ? '' : exampleUrl.substr(parameterEnd));
        }
      }

      APICalls.push({
        url: callUrl,
        exampleUrl: exampleUrl,
        desc: description,
        params: parameters instanceof Array ? parameters : [parameters],
        example: example
      });
    }
  }, {
    key: 'createParameter',
    value: function createParameter(parameterName, parameterType, parameterDescription) {
      return {
        name: parameterName,
        type: parameterType,
        desc: parameterDescription
      };
    }
  }, {
    key: 'availableCalls',
    get: function get() {
      return APICalls;
    }
  }]);
  return API;
}();

exports.default = API;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQVBJLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLFdBQVcsRUFBZjs7SUFFcUIsRzs7Ozs7OztpQ0FDRSxPLEVBQVMsVyxFQUFhLFUsRUFBWSxPLEVBQVMsVSxFQUFZOztBQUUxRSxVQUFHLENBQUMsVUFBSixFQUFlO0FBQ2IscUJBQWEsT0FBYjtBQUNBLGVBQU0sV0FBVyxPQUFYLENBQW1CLEdBQW5CLEtBQTJCLENBQUMsQ0FBbEMsRUFBb0M7QUFDbEMsY0FBSSxpQkFBaUIsV0FBVyxPQUFYLENBQW1CLEdBQW5CLENBQXJCO0FBQ0EsY0FBSSxlQUFlLFdBQVcsT0FBWCxDQUFtQixHQUFuQixFQUF3QixjQUF4QixDQUFuQjtBQUNBLHVCQUFhLFdBQVcsTUFBWCxDQUFrQixDQUFsQixFQUFxQixjQUFyQixJQUF1QyxHQUF2QyxJQUE4QyxnQkFBZ0IsQ0FBQyxDQUFqQixHQUFxQixFQUFyQixHQUEwQixXQUFXLE1BQVgsQ0FBa0IsWUFBbEIsQ0FBeEUsQ0FBYjtBQUNEO0FBQ0Y7O0FBRUQsZUFBUyxJQUFULENBQWM7QUFDWixhQUFLLE9BRE87QUFFWixvQkFBWSxVQUZBO0FBR1osY0FBTSxXQUhNO0FBSVosZ0JBQVMsc0JBQXNCLEtBQXRCLEdBQThCLFVBQTlCLEdBQTJDLENBQUMsVUFBRCxDQUp4QztBQUtaLGlCQUFTO0FBTEcsT0FBZDtBQU9EOzs7b0NBTXVCLGEsRUFBZSxhLEVBQWUsb0IsRUFBc0I7QUFDMUUsYUFBTztBQUNMLGNBQU0sYUFERDtBQUVMLGNBQU0sYUFGRDtBQUdMLGNBQU07QUFIRCxPQUFQO0FBS0Q7Ozt3QkFWNEI7QUFDM0IsYUFBTyxRQUFQO0FBQ0Q7Ozs7O2tCQXZCa0IsRyIsImZpbGUiOiJBUEkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQVBJQ2FsbHMgPSBbXVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJIHtcclxuICBzdGF0aWMgcmVnaXN0ZXJDYWxsIChjYWxsVXJsLCBkZXNjcmlwdGlvbiwgcGFyYW1ldGVycywgZXhhbXBsZSwgZXhhbXBsZVVybCkge1xyXG5cclxuICAgIGlmKCFleGFtcGxlVXJsKXtcclxuICAgICAgZXhhbXBsZVVybCA9IGNhbGxVcmxcclxuICAgICAgd2hpbGUoZXhhbXBsZVVybC5pbmRleE9mKCc6JykgIT0gLTEpe1xyXG4gICAgICAgIHZhciBwYXJhbWV0ZXJTdGFydCA9IGV4YW1wbGVVcmwuaW5kZXhPZignOicpXHJcbiAgICAgICAgdmFyIHBhcmFtZXRlckVuZCA9IGV4YW1wbGVVcmwuaW5kZXhPZignLycsIHBhcmFtZXRlclN0YXJ0KVxyXG4gICAgICAgIGV4YW1wbGVVcmwgPSBleGFtcGxlVXJsLnN1YnN0cigwLCBwYXJhbWV0ZXJTdGFydCkgKyAnMScgKyAocGFyYW1ldGVyRW5kID09IC0xID8gJycgOiBleGFtcGxlVXJsLnN1YnN0cihwYXJhbWV0ZXJFbmQpKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQVBJQ2FsbHMucHVzaCh7XHJcbiAgICAgIHVybDogY2FsbFVybCxcclxuICAgICAgZXhhbXBsZVVybDogZXhhbXBsZVVybCxcclxuICAgICAgZGVzYzogZGVzY3JpcHRpb24sXHJcbiAgICAgIHBhcmFtczogKHBhcmFtZXRlcnMgaW5zdGFuY2VvZiBBcnJheSA/IHBhcmFtZXRlcnMgOiBbcGFyYW1ldGVyc10pLFxyXG4gICAgICBleGFtcGxlOiBleGFtcGxlXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBhdmFpbGFibGVDYWxscyAoKSB7XHJcbiAgICByZXR1cm4gQVBJQ2FsbHNcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjcmVhdGVQYXJhbWV0ZXIgKHBhcmFtZXRlck5hbWUsIHBhcmFtZXRlclR5cGUsIHBhcmFtZXRlckRlc2NyaXB0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuYW1lOiBwYXJhbWV0ZXJOYW1lLFxyXG4gICAgICB0eXBlOiBwYXJhbWV0ZXJUeXBlLFxyXG4gICAgICBkZXNjOiBwYXJhbWV0ZXJEZXNjcmlwdGlvblxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=