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
  return _rethinkdb2.default.db('maplestory').table('items').filter(filter).map(function (item) {
    return item('MetaInfo').merge(_rethinkdb2.default.expr({
      id: item('id'),
      description: item('Description')('Description'),
      name: item('Description')('Name')
    })).merge(item('TypeInfo'));
  }).without('HighItemId', 'LowItemId');
}

function GetItem(id) {
  return _rethinkdb2.default.db('maplestory').table('items').getAll(id).map(function (item) {
    return item('MetaInfo').merge(_rethinkdb2.default.expr({
      id: item('id'),
      description: item('Description')('Description'),
      name: item('Description')('Name')
    })).merge(item('TypeInfo'));
  }).without('HighItemId', 'LowItemId');
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

var MapleItem = function () {
  function MapleItem(rethinkData) {
    (0, _classCallCheck3.default)(this, MapleItem);

    this._data = rethinkData;
  }

  (0, _createClass3.default)(MapleItem, [{
    key: 'toJSON',
    value: function toJSON() {
      return this._data;
    }
  }, {
    key: 'Icon',
    get: function get() {
      return this._data.Icon;
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
                  return new MapleItem(entry);
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
                  return new MapleItem(entry);
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
     * @param {Number} itemId The ID to look the item up with.
     */

  }, {
    key: 'getFirst',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(itemId) {
        var connection, cursor, fullItems;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return Connect();

              case 2:
                connection = _context3.sent;
                _context3.next = 5;
                return GetItem(itemId).limit(1).run(connection);

              case 5:
                cursor = _context3.sent;
                _context3.next = 8;
                return cursor.toArray();

              case 8:
                fullItems = _context3.sent;

                connection.close();
                return _context3.abrupt('return', fullItems.map(function (entry) {
                  return new MapleItem(entry);
                }).shift());

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getFirst(_x3) {
        return ref.apply(this, arguments);
      }

      return getFirst;
    }()
  }]);
  return MapleItem;
}();

exports.default = MapleItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvbWFwbGVpdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBeUI7QUFDdkIsU0FBTyxvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixFQUFrQyxNQUFsQyxDQUF5QyxNQUF6QyxFQUFpRCxHQUFqRCxDQUFxRCxVQUFTLElBQVQsRUFBYztBQUN4RSxXQUFPLEtBQUssVUFBTCxFQUNKLEtBREksQ0FDRSxvQkFBRSxJQUFGLENBQU87QUFDWixVQUFJLEtBQUssSUFBTCxDQURRO0FBRVosbUJBQWEsS0FBSyxhQUFMLEVBQW9CLGFBQXBCLENBRkQ7QUFHWixZQUFNLEtBQUssYUFBTCxFQUFvQixNQUFwQjtBQUhNLEtBQVAsQ0FERixFQU1KLEtBTkksQ0FNRSxLQUFLLFVBQUwsQ0FORixDQUFQO0FBT0QsR0FSTSxFQVFKLE9BUkksQ0FRSSxZQVJKLEVBUWtCLFdBUmxCLENBQVA7QUFTRDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsRUFBakIsRUFBb0I7QUFDbEIsU0FBTyxvQkFBRSxFQUFGLENBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixPQUF6QixFQUFrQyxNQUFsQyxDQUF5QyxFQUF6QyxFQUE2QyxHQUE3QyxDQUFpRCxVQUFDLElBQUQsRUFBVTtBQUNoRSxXQUFPLEtBQUssVUFBTCxFQUNKLEtBREksQ0FDRSxvQkFBRSxJQUFGLENBQU87QUFDWixVQUFJLEtBQUssSUFBTCxDQURRO0FBRVosbUJBQWEsS0FBSyxhQUFMLEVBQW9CLGFBQXBCLENBRkQ7QUFHWixZQUFNLEtBQUssYUFBTCxFQUFvQixNQUFwQjtBQUhNLEtBQVAsQ0FERixFQU1KLEtBTkksQ0FNRSxLQUFLLFVBQUwsQ0FORixDQUFQO0FBT0QsR0FSTSxFQVFKLE9BUkksQ0FRSSxZQVJKLEVBUWtCLFdBUmxCLENBQVA7QUFTRDs7Ozs7QUFLRCxTQUFTLE9BQVQsR0FBbUI7QUFDakIsU0FBTyxvQkFBRSxPQUFGLENBQVU7QUFDZixVQUFNLFFBQVEsR0FBUixDQUFZLGNBREg7QUFFZixVQUFNLFFBQVEsR0FBUixDQUFZLGNBRkg7QUFHZixVQUFNLFFBQVEsR0FBUixDQUFZLGNBSEg7QUFJZixRQUFJLFFBQVEsR0FBUixDQUFZO0FBSkQsR0FBVixDQUFQO0FBTUQ7O0lBRW9CLFM7QUFDbkIscUJBQVksV0FBWixFQUF3QjtBQUFBOztBQUN0QixTQUFLLEtBQUwsR0FBYSxXQUFiO0FBQ0Q7Ozs7NkJBRU87QUFDTixhQUFPLEtBQUssS0FBWjtBQUNEOzs7d0JBRVM7QUFDUixhQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCO0FBQ0Q7Ozs7Ozs7Ozs0RkFLb0IsTTtZQUNiLFUsRUFDQSxNLEVBQ0EsUzs7Ozs7O3VCQUZtQixTOzs7QUFBbkIsMEI7O3VCQUNlLFNBQVMsTUFBVCxFQUFpQixHQUFqQixDQUFxQixVQUFyQixDOzs7QUFBZixzQjs7dUJBQ2tCLE9BQU8sT0FBUCxFOzs7QUFBbEIseUI7O0FBQ04sMkJBQVcsS0FBWDtpREFDTyxVQUFVLEdBQVYsQ0FBYztBQUFBLHlCQUFTLElBQUksU0FBSixDQUFjLEtBQWQsQ0FBVDtBQUFBLGlCQUFkLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2RkFNYyxNO1lBQ2YsVSxFQUNBLE0sRUFDQSxTOzs7Ozs7dUJBRm1CLFM7OztBQUFuQiwwQjs7dUJBQ2UsU0FBUyxNQUFULEVBQWlCLEtBQWpCLENBQXVCLENBQXZCLEVBQTBCLEdBQTFCLENBQThCLFVBQTlCLEM7OztBQUFmLHNCOzt1QkFDa0IsT0FBTyxPQUFQLEU7OztBQUFsQix5Qjs7QUFDTiwyQkFBVyxLQUFYO2tEQUNPLFVBQVUsR0FBVixDQUFjO0FBQUEseUJBQVMsSUFBSSxTQUFKLENBQWMsS0FBZCxDQUFUO0FBQUEsaUJBQWQsRUFBNkMsS0FBN0MsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZGQU1hLE07WUFDZCxVLEVBQ0EsTSxFQUNBLFM7Ozs7Ozt1QkFGbUIsUzs7O0FBQW5CLDBCOzt1QkFDZSxRQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBc0IsQ0FBdEIsRUFBeUIsR0FBekIsQ0FBNkIsVUFBN0IsQzs7O0FBQWYsc0I7O3VCQUNrQixPQUFPLE9BQVAsRTs7O0FBQWxCLHlCOztBQUNOLDJCQUFXLEtBQVg7a0RBQ08sVUFBVSxHQUFWLENBQWM7QUFBQSx5QkFBUyxJQUFJLFNBQUosQ0FBYyxLQUFkLENBQVQ7QUFBQSxpQkFBZCxFQUE2QyxLQUE3QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkEzQ1UsUyIsImZpbGUiOiJtYXBsZWl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgciBmcm9tICdyZXRoaW5rZGInO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcclxuXHJcbmZ1bmN0aW9uIEdldEl0ZW1zKGZpbHRlcil7XHJcbiAgcmV0dXJuIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgnaXRlbXMnKS5maWx0ZXIoZmlsdGVyKS5tYXAoZnVuY3Rpb24oaXRlbSl7XHJcbiAgICByZXR1cm4gaXRlbSgnTWV0YUluZm8nKVxyXG4gICAgICAubWVyZ2Uoci5leHByKHtcclxuICAgICAgICBpZDogaXRlbSgnaWQnKSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaXRlbSgnRGVzY3JpcHRpb24nKSgnRGVzY3JpcHRpb24nKSxcclxuICAgICAgICBuYW1lOiBpdGVtKCdEZXNjcmlwdGlvbicpKCdOYW1lJylcclxuICAgICAgfSkpXHJcbiAgICAgIC5tZXJnZShpdGVtKCdUeXBlSW5mbycpKVxyXG4gIH0pLndpdGhvdXQoJ0hpZ2hJdGVtSWQnLCAnTG93SXRlbUlkJylcclxufVxyXG5cclxuZnVuY3Rpb24gR2V0SXRlbShpZCl7XHJcbiAgcmV0dXJuIHIuZGIoJ21hcGxlc3RvcnknKS50YWJsZSgnaXRlbXMnKS5nZXRBbGwoaWQpLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgcmV0dXJuIGl0ZW0oJ01ldGFJbmZvJylcclxuICAgICAgLm1lcmdlKHIuZXhwcih7XHJcbiAgICAgICAgaWQ6IGl0ZW0oJ2lkJyksXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0oJ0Rlc2NyaXB0aW9uJykoJ0Rlc2NyaXB0aW9uJyksXHJcbiAgICAgICAgbmFtZTogaXRlbSgnRGVzY3JpcHRpb24nKSgnTmFtZScpXHJcbiAgICAgIH0pKVxyXG4gICAgICAubWVyZ2UoaXRlbSgnVHlwZUluZm8nKSlcclxuICB9KS53aXRob3V0KCdIaWdoSXRlbUlkJywgJ0xvd0l0ZW1JZCcpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgbmV3IFJldGhpbmtEQiBjb25uZWN0aW9uIHRvIHJ1biBxdWVyaWVzIGFnYWluc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25uZWN0KCkge1xyXG4gIHJldHVybiByLmNvbm5lY3Qoe1xyXG4gICAgaG9zdDogcHJvY2Vzcy5lbnYuUkVUSElOS0RCX0hPU1QsXHJcbiAgICBwb3J0OiBwcm9jZXNzLmVudi5SRVRISU5LREJfUE9SVCxcclxuICAgIEFVVEg6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9BVVRILFxyXG4gICAgREI6IHByb2Nlc3MuZW52LlJFVEhJTktEQl9EQlxyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcGxlSXRlbSB7XHJcbiAgY29uc3RydWN0b3IocmV0aGlua0RhdGEpe1xyXG4gICAgdGhpcy5fZGF0YSA9IHJldGhpbmtEYXRhXHJcbiAgfVxyXG5cclxuICB0b0pTT04oKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhXHJcbiAgfVxyXG5cclxuICBnZXQgSWNvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuSWNvblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciBUaGUgcmV0aGlua2RiIGNvbXBhdGlibGUgZmlsdGVyIG9iamVjdCB0byB1c2UgZm9yIHRoZSBxdWVyeS5cclxuICAgKi9cclxuICBzdGF0aWMgYXN5bmMgZmluZEFsbChmaWx0ZXIpe1xyXG4gICAgY29uc3QgY29ubmVjdGlvbiA9IGF3YWl0IENvbm5lY3QoKVxyXG4gICAgY29uc3QgY3Vyc29yID0gYXdhaXQgR2V0SXRlbXMoZmlsdGVyKS5ydW4oY29ubmVjdGlvbilcclxuICAgIGNvbnN0IGZ1bGxJdGVtcyA9IGF3YWl0IGN1cnNvci50b0FycmF5KClcclxuICAgIGNvbm5lY3Rpb24uY2xvc2UoKVxyXG4gICAgcmV0dXJuIGZ1bGxJdGVtcy5tYXAoZW50cnkgPT4gbmV3IE1hcGxlSXRlbShlbnRyeSkpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVyIFRoZSByZXRoaW5rZGIgY29tcGF0aWJsZSBmaWx0ZXIgb2JqZWN0IHRvIHVzZSBmb3IgdGhlIHF1ZXJ5LlxyXG4gICAqL1xyXG4gIHN0YXRpYyBhc3luYyBmaW5kRmlyc3QoZmlsdGVyKXtcclxuICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBhd2FpdCBDb25uZWN0KClcclxuICAgIGNvbnN0IGN1cnNvciA9IGF3YWl0IEdldEl0ZW1zKGZpbHRlcikubGltaXQoMSkucnVuKGNvbm5lY3Rpb24pXHJcbiAgICBjb25zdCBmdWxsSXRlbXMgPSBhd2FpdCBjdXJzb3IudG9BcnJheSgpXHJcbiAgICBjb25uZWN0aW9uLmNsb3NlKClcclxuICAgIHJldHVybiBmdWxsSXRlbXMubWFwKGVudHJ5ID0+IG5ldyBNYXBsZUl0ZW0oZW50cnkpKS5zaGlmdCgpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge051bWJlcn0gaXRlbUlkIFRoZSBJRCB0byBsb29rIHRoZSBpdGVtIHVwIHdpdGguXHJcbiAgICovXHJcbiAgc3RhdGljIGFzeW5jIGdldEZpcnN0KGl0ZW1JZCl7XHJcbiAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgQ29ubmVjdCgpXHJcbiAgICBjb25zdCBjdXJzb3IgPSBhd2FpdCBHZXRJdGVtKGl0ZW1JZCkubGltaXQoMSkucnVuKGNvbm5lY3Rpb24pXHJcbiAgICBjb25zdCBmdWxsSXRlbXMgPSBhd2FpdCBjdXJzb3IudG9BcnJheSgpXHJcbiAgICBjb25uZWN0aW9uLmNsb3NlKClcclxuICAgIHJldHVybiBmdWxsSXRlbXMubWFwKGVudHJ5ID0+IG5ldyBNYXBsZUl0ZW0oZW50cnkpKS5zaGlmdCgpXHJcbiAgfVxyXG59Il19