'use strict';

require('babel-core/register');

require('babel-polyfill');

var nodeCleanup = require('node-cleanup');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var helmet = require('helmet');
var compression = require('compression');

var CoinStatsDb = require('./db');
var routes = require('./routes');
var queryCmc = require('./queryCmc');

// The maximum number of coins that /api/coins will return
var MAXCOINLISTLEN = 100;

var ISPROD = process.env.NODE_ENV === 'production';

// Default port, mainly for dev: 8080
var PORT = process.env.PORT || 8080;

// Default interval: 4 min
var POLLCMCINTERVALSECS = process.env.POLL_CMC_INTERVAL_SECS * 1000 || 4 * 60 * 1000;

// Set up the database
var dbFilepath = path.join(__dirname, '../', 'db.sqlite3');
var sqliteConnStr = 'sqlite:' + dbFilepath;
var connStr = process.env.DATABASE_URL ? process.env.DATABASE_URL : sqliteConnStr;
var db = new CoinStatsDb(connStr, ISPROD);

var start = function start() {
  var app = express();
  app.use(helmet());
  app.use(compression());

  // Set up logging
  if (ISPROD) {
    app.use(logger('common'));
  } else {
    app.use(logger('dev'));
  }

  // Set up URL routing. See ./route.js
  app.use('/api', routes(db, MAXCOINLISTLEN));

  // Set up CoinMarketCap API polling.
  // Don't abuse the CMC API
  if (POLLCMCINTERVALSECS < 5000) {
    console.log('Error: the environment variable POLL_CMC_INTERVAL_SECS ' + 'must be 5 or greater');
    return;
  }

  // Query the CMC API once, then schedule to do so every
  // POLL_CMC_INTERVAL_SECS seconds
  queryCmc(db);
  var pollCmcInterval = setInterval(function () {
    queryCmc(db);
  }, POLLCMCINTERVALSECS);

  // Clear the interval when the process exits
  nodeCleanup(function (exitCode, signal) {
    clearInterval(pollCmcInterval);
    if (!ISPROD) {
      console.log('\nCleared CMC poll interval and exiting.');
    }
  });

  // Serve static files from the build/ directory
  var buildDir = path.join(__dirname, '../', 'build');
  if (ISPROD) {
    buildDir = path.join(__dirname, '../');
  }
  app.use(express.static(buildDir));

  // Set up error handling
  if (ISPROD) {
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
    if (ISPROD) {
      console.log('Running on port ' + PORT.toString());
    } else {
      console.log('Backend running in dev mode: http://localhost:' + PORT.toString());
    }
  });
};

// Start the server once the database connection is alive
db.sequelize.authenticate().then(function () {
  db.sequelize.sync().then(start);
}).catch(function (err) {
  console.error('Unable to connect to the database.\n', err);
});