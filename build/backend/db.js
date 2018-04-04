'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequelize = require('sequelize');

var CoinStatsDb = function () {
  function CoinStatsDb(connStr, isProd) {
    _classCallCheck(this, CoinStatsDb);

    // Set up the database connection
    this.sequelize = new Sequelize(connStr, {
      operatorsAliases: false,
      logging: console.log,
      define: {
        underscored: true,
        freezeTableName: true
      }
    });

    // Do not return these attributes during queries
    this.sequelize.addHook('beforeFind', function (options) {
      if (!options.attributes) {
        options.attributes = {};
      }
      options.attributes.exclude = ['created_at', 'updated_at', 'deleted_at'];
    });

    // Create and sync models
    this.setupModels();
  }

  _createClass(CoinStatsDb, [{
    key: 'setupModels',
    value: function setupModels() {
      // Each Coin is a single, unqiue cryptocurrency or token
      // Note: these model definitions don't use camelCase to be consistent with
      // the CMC API, and CMC's API uses '24h_volume_usd' which is invalid as a
      // JS attribute, so we use 'volume_usd_24h' instead.

      this.Coin = this.sequelize.define('coin', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cmc_id: {
          type: Sequelize.STRING,
          unique: true
        },
        cmc_rank: Sequelize.INTEGER,
        symbol: Sequelize.STRING,
        name: Sequelize.STRING,
        price_usd: Sequelize.DOUBLE,
        price_btc: Sequelize.DOUBLE,
        market_cap_usd: Sequelize.DOUBLE,
        volume_usd_24h: Sequelize.DOUBLE,
        available_supply: Sequelize.DOUBLE,
        total_supply: Sequelize.DOUBLE,
        max_supply: Sequelize.DOUBLE,
        percent_change_1h: Sequelize.DOUBLE,
        percent_change_24h: Sequelize.DOUBLE,
        percent_change_7d: Sequelize.DOUBLE,
        last_updated: Sequelize.DATE
      });

      this.Coin.sync();

      // Tracks the price of a coin over time
      this.PriceHistory = this.sequelize.define('priceHistory', {
        cmc_id: {
          type: Sequelize.STRING,
          references: {
            model: this.Coin,
            key: 'cmc_id'
          }
        },
        datetime: Sequelize.DATE,
        price_usd: Sequelize.DOUBLE,
        price_btc: Sequelize.DOUBLE
      });

      this.PriceHistory.sync();
    }
  }, {
    key: 'getCurrencyData',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.Coin.findAll({
                  attributes: ['name', 'symbol', 'price_usd'],
                  where: {
                    price_usd: _defineProperty({}, Sequelize.Op.gte, 0)
                  },
                  order: [['name', 'ASC']]
                }).catch(function (err) {
                  console.error(err);
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getCurrencyData() {
        return _ref.apply(this, arguments);
      }

      return getCurrencyData;
    }()
  }, {
    key: 'updateCoins',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(coins) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.sequelize.transaction(function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transaction) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return Promise.all(coins.map(function () {
                              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(coin) {
                                var lastUpdatedDate;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                  while (1) {
                                    switch (_context2.prev = _context2.next) {
                                      case 0:
                                        lastUpdatedDate = coin.last_updated ? new Date(coin.last_updated * 1000) : null;
                                        _context2.prev = 1;
                                        _context2.next = 4;
                                        return _this.Coin.upsert({
                                          cmc_id: coin.id,
                                          cmc_rank: coin.rank,
                                          name: coin.name,
                                          symbol: coin.symbol,
                                          price_usd: coin.price_usd,
                                          price_btc: coin.price_btc,
                                          volume_usd_24h: coin['24h_volume_usd'],
                                          market_cap_usd: coin.market_cap_usd,
                                          available_supply: coin.available_supply,
                                          total_supply: coin.total_supply,
                                          max_supply: coin.max_supply,
                                          percent_change_1h: coin.percent_change_1h,
                                          percent_change_24h: coin.percent_change_24h,
                                          percent_change_7d: coin.percent_change_7d,
                                          last_updated: lastUpdatedDate
                                        }, { transaction: transaction });

                                      case 4:
                                        _context2.next = 6;
                                        return _this.PriceHistory.create({
                                          cmc_id: coin.id,
                                          price_usd: coin.price_usd,
                                          price_btc: coin.price_btc,
                                          datetime: Date.now()
                                        }, { transaction: transaction });

                                      case 6:
                                        _context2.next = 11;
                                        break;

                                      case 8:
                                        _context2.prev = 8;
                                        _context2.t0 = _context2['catch'](1);

                                        console.error(_context2.t0, 'Could not add to price history');

                                      case 11:
                                      case 'end':
                                        return _context2.stop();
                                    }
                                  }
                                }, _callee2, _this, [[1, 8]]);
                              }));

                              return function (_x3) {
                                return _ref4.apply(this, arguments);
                              };
                            }()));

                          case 2:
                            console.log('Updated coin data.');

                          case 3:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }());

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateCoins(_x) {
        return _ref2.apply(this, arguments);
      }

      return updateCoins;
    }()
  }, {
    key: 'getCoinsByCmcIds',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ids) {
        var coins;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.Coin.findAll({
                  where: {
                    cmc_id: _defineProperty({}, Sequelize.Op.in, ids)
                  }
                });

              case 2:
                coins = _context5.sent;
                return _context5.abrupt('return', coins.map(function (coin) {
                  delete coin.dataValues.id;
                  return coin.dataValues;
                }));

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getCoinsByCmcIds(_x4) {
        return _ref5.apply(this, arguments);
      }

      return getCoinsByCmcIds;
    }()
  }, {
    key: 'getCoin',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(cmcId) {
        var coin;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.Coin.findOne({
                  where: { cmc_id: cmcId }
                });

              case 3:
                coin = _context6.sent;


                // This doesn't work in spite of what the docs say, so delete each id
                // field manually
                // this.Coin.findAll({
                //   attributes: { exclude: ['id'] }
                // });
                delete coin.dataValues.id;
                return _context6.abrupt('return', coin.dataValues);

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6['catch'](0);

                console.error('Could not get coin data');
                throw new UnableFetchCoinException();

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 8]]);
      }));

      function getCoin(_x5) {
        return _ref6.apply(this, arguments);
      }

      return getCoin;
    }()
  }, {
    key: 'getCoins',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(start, limit, sortParam, direction, minPriceUsd, minVolUsd) {
        var where, coins, totalCoins, c;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                where = {};


                if (minPriceUsd != null) {
                  where.price_usd = _defineProperty({}, Sequelize.Op.gte, minPriceUsd);
                }

                if (minVolUsd != null) {
                  where.volume_usd_24h = _defineProperty({}, Sequelize.Op.gte, minVolUsd);
                }

                _context7.next = 6;
                return this.Coin.findAll({
                  offset: start,
                  limit: limit,
                  order: [[sortParam, direction]],
                  where: where
                });

              case 6:
                coins = _context7.sent;
                _context7.next = 9;
                return this.Coin.count({
                  col: 'id',
                  where: where
                });

              case 9:
                totalCoins = _context7.sent;
                c = coins.map(function (c) {
                  delete c.dataValues.id;
                  return c.dataValues;
                });
                return _context7.abrupt('return', { coins: c, totalCoins: totalCoins });

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7['catch'](0);

                console.error('Could not get list of coins');
                console.error(_context7.t0);
                throw new UnableFetchCoinsException();

              case 19:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 14]]);
      }));

      function getCoins(_x6, _x7, _x8, _x9, _x10, _x11) {
        return _ref7.apply(this, arguments);
      }

      return getCoins;
    }()
  }, {
    key: 'getPriceHistory',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(cmcId, earliestTimestamp) {
        var where, datetime, coinExists;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                where = {
                  cmc_id: cmcId
                };

                if (!(typeof earliestTimestamp !== 'undefined')) {
                  _context8.next = 11;
                  break;
                }

                _context8.prev = 2;
                datetime = new Date(earliestTimestamp * 1000);

                where.datetime = _defineProperty({}, Sequelize.Op.gte, datetime);
                _context8.next = 11;
                break;

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8['catch'](2);

                console.error('Invalid timestamp provided');
                throw new InvalidTimestampException();

              case 11:
                _context8.next = 13;
                return this.Coin.findOne({
                  where: { cmc_id: cmcId }
                });

              case 13:
                _context8.t1 = _context8.sent;
                coinExists = _context8.t1 != null;

                if (coinExists) {
                  _context8.next = 17;
                  break;
                }

                throw new UnableFetchCoinException();

              case 17:
                _context8.prev = 17;
                return _context8.abrupt('return', this.PriceHistory.findAll({
                  where: where,
                  order: [['datetime', 'ASC']]
                }).then(function (priceHistory) {
                  return priceHistory.map(function (ph) {
                    delete ph.dataValues.id;
                    delete ph.dataValues.id;
                    return ph.dataValues;
                  });
                }));

              case 21:
                _context8.prev = 21;
                _context8.t2 = _context8['catch'](17);

                console.error('Could not fetch price history');
                throw new UnableFetchCoinException();

              case 25:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2, 7], [17, 21]]);
      }));

      function getPriceHistory(_x12, _x13) {
        return _ref8.apply(this, arguments);
      }

      return getPriceHistory;
    }()
  }]);

  return CoinStatsDb;
}();

function InvalidTimestampException(message) {
  this.message = message || 'Invalid timestamp';
  this.name = 'InvalidTimestampException';
}

function UnableFetchCoinException(message) {
  this.message = message || 'Error fetching data for this coin';
  this.name = 'UnableFetchCoinException';
}

function UnableFetchCoinsException(message) {
  this.message = message || 'Error fetching coin data';
  this.name = 'UnableFetchCoinsException';
}

function UnableToCountCoinsException(message) {
  this.message = message || 'Error counting coins';
  this.name = 'UnableToCountCoinsException';
}

module.exports = CoinStatsDb;