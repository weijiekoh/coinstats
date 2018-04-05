'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require('node-fetch');
var fs = require('fs');

var queryCmc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(db, url) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fs.readFile('./sample.json', function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, data) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return db.updateCoins(JSON.parse(data));

                      case 2:
                        _context.next = 4;
                        return db.deleteOldPrices();

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }());

            //const response = await fetch(url)
            //const coins = await response.json()
            //console.log('Fetched data for ' + coins.length.toString() + ' coins')
            //await db.updateCoins(coins)
            //await db.deleteOldPrices()

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function queryCmc(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = queryCmc;