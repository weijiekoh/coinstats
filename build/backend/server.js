'use strict';

require('babel-polyfill');

require('babel-core/register');

var path = require('path');
var logger = require('morgan');
var helmet = require('helmet');
var express = require('express');
var compression = require('compression');
var nodeCleanup = require('node-cleanup');

var routes = require('./routes');
var CoinStatsDb = require('./db');
var queryCmc = require('./queryCmc');

// The maximum number of coins that /api/coins will return
var MAX_COIN_LIST_LEN = 100;

// The maximum number of coins to fetch from CMC every poll. 0 = no lmit
var CMC_MAX_COINS = process.env.CMC_MAX_COINS || 100;
var CMC_API_URI = 'https://api.coinmarketcap.com/v1/ticker/?limit=' + CMC_MAX_COINS.toString();

// The max range of the price history stored in the DB
var PRICE_HISTORY_RANGE_SECS = process.env.PRICE_HISTORY_RANGE_SECS || 60 * 60;

// Whether the app is in production
var IS_PROD = process.env.NODE_ENV === 'production';

// Default port, mainly for dev: 8080
var PORT = process.env.PORT || 8080;

// Default interval to poll the CoinMarketCap API
var DEFAULT_POLL_INTERVAL = 300;
var POLL_CMC_INTERVAL = process.env.POLL_CMC_INTERVAL_SECS || DEFAULT_POLL_INTERVAL;

// Make sure that the app doesn't abuse the API's rate limit
if (POLL_CMC_INTERVAL < DEFAULT_POLL_INTERVAL && !process.env.FORCE_POLL) {
  throw new Error('Error: the environment variable POLL_CMC_INTERVAL_SECS ' + 'must be 300 or greater');
}

// Set up the database
var dbFilepath = path.join(__dirname, '../', 'db.sqlite3');
var sqliteConnStr = 'sqlite:' + dbFilepath;

if (IS_PROD && !process.env.DATABASE_URL) {
  throw new Error('No DATABASE_URL environment variable provided');
}

var connStr = process.env.DATABASE_URL ? process.env.DATABASE_URL : sqliteConnStr;
var db = new CoinStatsDb(connStr, IS_PROD, PRICE_HISTORY_RANGE_SECS);

// Running start() will launch the app
var start = function start() {
  // Set up Express
  var app = express();
  app.use(helmet());
  app.use(compression());

  // Set up logging
  if (IS_PROD) {
    app.use(logger('common'));
  } else {
    app.use(logger('dev'));
  }

  // Set up URL routing. See ./route.js
  app.use('/api', routes(db, MAX_COIN_LIST_LEN));

  // Query the CMC API once, then schedule to do so every
  // POLL_CMC_INTERVAL_SECS seconds
  queryCmc(db, CMC_API_URI, !IS_PROD);
  var pollInt = setInterval(function () {
    queryCmc(db, CMC_API_URI, !IS_PROD);
  }, POLL_CMC_INTERVAL * 1000);

  // Clear the interval when the process exits
  nodeCleanup(function (exitCode, signal) {
    clearInterval(pollInt);
    if (!IS_PROD) {
      console.log('\nCleared CMC poll interval and exiting.');
    }
  });

  // Serve static files from the build/ directory
  var buildDir = path.join(__dirname, '../', 'build');
  if (IS_PROD) {
    buildDir = path.join(__dirname, '../');
  }
  app.use(express.static(buildDir));

  // Set up error handling
  if (IS_PROD) {
    app.use(function (err, req, res, next) {
      res.type('text/plain');
      res.status(err.status || 500).send('Internal server error');
    });
  } else {
    app.use(function (err, req, res, next) {
      res.type('text/plain');
      res.status(err.status || 500).send(err.stack);
    });
  }

  // Start the server
  app.listen(PORT, function () {
    if (IS_PROD) {
      console.log('Running on port ' + PORT.toString());
    } else {
      console.log('Backend running in dev mode: http://localhost:' + PORT.toString());
    }
  });
};

// Start the server once the database connection is alive and the tables have
// been synced
db.sequelize.authenticate().then(function () {
  db.sequelize.sync().then(start);
}).catch(function (err) {
  console.error('Unable to connect to the database.\n', err);
});