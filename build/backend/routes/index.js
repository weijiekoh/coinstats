'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sortParams = ['symbol', // 0
'name', // 1
'price_usd', // 2
'price_btc', // 3
'market_cap_usd', // 4
'volume_usd_24h', // 5
'available_supply', // 6
'total_supply', // 7
'max_supply', // 8
'percent_change_1h', // 9
'percent_change_24h', // 10
'percent_change_7d' // 11
];

var sortDirections = {
  ASC: 1,
  DESC: 0
};

var express = require('express');

function makeRouter(db, maxCoinListLen) {
  var _this = this;

  var router = express.Router();

  router.get('/hello', function (req, res) {
    res.type('text/plain');
    res.send('Hello, world');
  });

  // Return all currency data (name/symbol:USD) pairs
  // for the currency converter
  router.get('/currencies/', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var currencies;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return db.getCurrencyData();

            case 2:
              currencies = _context.sent;

              res.type('text/json');
              return _context.abrupt('return', res.send(currencies));

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // Return data for one coin
  // @id: the cmc_id of the coin
  router.get('/coin/:id', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var cmcId, coin;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              res.type('text/json');
              cmcId = req.params.id;
              _context2.prev = 2;
              _context2.next = 5;
              return db.getCoin(cmcId);

            case 5:
              coin = _context2.sent;

              res.send(coin);
              _context2.next = 14;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2['catch'](2);

              res.type('text/plain');
              res.statusCode = 500;
              return _context2.abrupt('return', res.send(_context2.t0.message));

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[2, 9]]);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  router.get('/coins_by_ids/:ids', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var cmcIds, coins;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              cmcIds = req.params.ids.split(',');

              if (!(cmcIds.length === 0)) {
                _context3.next = 4;
                break;
              }

              res.type('text/json');
              return _context3.abrupt('return', res.send([]));

            case 4:
              _context3.next = 6;
              return db.getCoinsByCmcIds(cmcIds);

            case 6:
              coins = _context3.sent;

              res.type('text/json');
              return _context3.abrupt('return', res.send(coins));

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  // Return a list of coins
  // @t: start from this index
  // @m: the number of items to return
  // @s: the sort parameter
  // @d: the sort direction
  router.get('/coins/', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var start, limit, sortParam, direcParam, mp, mv, minPrice, minVol, DESC, ASC, validStart, validLimit, validSort, validDirec, direction, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              start = parseInt(req.query.t, 10);
              limit = parseInt(req.query.m, 10);
              sortParam = parseInt(req.query.s, 10);
              direcParam = parseInt(req.query.d, 10);
              mp = parseFloat(req.query.mp, 10);
              mv = parseFloat(req.query.mv, 10);

              // Validate minPrice and minVol

              if (!(!isNaN(mp) && mp < 0)) {
                _context4.next = 10;
                break;
              }

              res.type('text/json');
              res.statusCode = 500;
              return _context4.abrupt('return', res.send('Invalid min price param'));

            case 10:
              if (!(!isNaN(mv) && mv < 0)) {
                _context4.next = 14;
                break;
              }

              res.type('text/json');
              res.statusCode = 500;
              return _context4.abrupt('return', res.send('Invalid min vol param'));

            case 14:
              minPrice = isNaN(mp) ? null : mp;
              minVol = isNaN(mv) ? null : mv;
              DESC = sortDirections.DESC, ASC = sortDirections.ASC;

              if (!(limit === 0)) {
                _context4.next = 20;
                break;
              }

              // No need to query the DB
              res.type('text/json');
              return _context4.abrupt('return', res.send([]));

            case 20:

              // Validate the start and limit query params
              validStart = !isNaN(start) && start >= 0;
              validLimit = !isNaN(limit) && limit >= 0 && limit <= maxCoinListLen;

              if (validStart && validLimit) {
                _context4.next = 26;
                break;
              }

              res.type('text/json');
              res.statusCode = 500;
              return _context4.abrupt('return', res.send('Invalid start/limit params'));

            case 26:

              // Validate the sort and direction query params. @d must be either 0 or 1,
              // and @s must be an element in sortParams.keys()

              validSort = !isNaN(sortParam) && sortParam < sortParams.length && sortParam >= 0;
              validDirec = [ASC, DESC].indexOf(direcParam) > -1;

              if (validSort && validDirec) {
                _context4.next = 32;
                break;
              }

              res.type('text/json');
              res.statusCode = 500;
              return _context4.abrupt('return', res.send('Invalid sort/direc params'));

            case 32:
              direction = direcParam === ASC ? 'ASC' : 'DESC';
              _context4.prev = 33;
              _context4.next = 36;
              return db.getCoins(start, limit, sortParams[sortParam], direction, minPrice, minVol);

            case 36:
              result = _context4.sent;


              // Return the total number of coins available

              res.type('text/json');
              return _context4.abrupt('return', res.send(result));

            case 41:
              _context4.prev = 41;
              _context4.t0 = _context4['catch'](33);

              res.type('text/plain');
              res.statusCode = 500;
              res.send(_context4.t0.message);

            case 46:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this, [[33, 41]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  // Return the price history of a coin
  // @id: the cmc_id of the coin
  router.get('/coin/prices/:id', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
      var cmcId, earliest, validTimestamp, datetime, priceHistory;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              cmcId = req.params.id;
              earliest = req.query.earliest;

              if (!(typeof earliest !== 'undefined')) {
                _context5.next = 10;
                break;
              }

              validTimestamp = earliest != null && isFinite(earliest) && earliest >= 0;
              datetime = new Date(earliest * 1000);

              validTimestamp &= datetime.toString() !== 'Invalid Date';

              if (validTimestamp) {
                _context5.next = 10;
                break;
              }

              res.type('text/plain');
              res.statusCode = 500;
              return _context5.abrupt('return', res.send('Invalid timestamp'));

            case 10:
              _context5.prev = 10;
              _context5.next = 13;
              return db.getPriceHistory(cmcId, earliest);

            case 13:
              priceHistory = _context5.sent;

              res.type('text/json');
              return _context5.abrupt('return', res.send(priceHistory));

            case 18:
              _context5.prev = 18;
              _context5.t0 = _context5['catch'](10);

              res.type('text/plain');
              res.statusCode = 500;
              res.send(_context5.t0.message);

            case 23:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this, [[10, 18]]);
    }));

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());

  return router;
}

module.exports = makeRouter;