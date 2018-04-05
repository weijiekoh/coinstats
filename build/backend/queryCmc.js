'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require('node-fetch');
var fs = require('fs');

var queryCmc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(db, url, debug) {
    var response, coins;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!debug) {
              _context2.next = 4;
              break;
            }

            fs.readFile('./sample.json', function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, data) {
                var coins;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!err) {
                          _context.next = 2;
                          break;
                        }

                        throw new Error('Error reading sample data');

                      case 2:
                        coins = JSON.parse(data);


                        coins = coins.map(function (c) {
                          c.price_usd *= Math.random();
                          return c;
                        });
                        _context.next = 6;
                        return db.updateCoins(coins);

                      case 6:
                        _context.next = 8;
                        return db.deleteOldPrices();

                      case 8:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.next = 15;
            break;

          case 4:
            _context2.next = 6;
            return fetch(url);

          case 6:
            response = _context2.sent;
            _context2.next = 9;
            return response.json();

          case 9:
            coins = _context2.sent;

            console.log('Fetched data for ' + coins.length.toString() + ' coins');
            _context2.next = 13;
            return db.updateCoins(coins);

          case 13:
            _context2.next = 15;
            return db.deleteOldPrices();

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function queryCmc(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = queryCmc;