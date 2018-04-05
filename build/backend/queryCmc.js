'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require('node-fetch');
var fs = require('fs');

var queryCmc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(db) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fs.readFile('./sample.json', function (err, data) {
              db.updateCoins(JSON.parse(data));
            });

            //const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=0'
            //const response = await fetch(url)
            //const coins = await response.json()
            //console.log('Fetched data for ' + coins.length.toString() + ' coins')
            //await db.updateCoins(coins)

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function queryCmc(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = queryCmc;