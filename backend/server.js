import 'babel-polyfill'
import 'babel-core/register'
const path = require('path')
const logger = require('morgan')
const helmet = require('helmet')
const express = require('express')
const compression = require('compression')
const nodeCleanup = require('node-cleanup')

const routes = require('./routes')
const CoinStatsDb = require('./db')
const queryCmc = require('./queryCmc')

// The maximum number of coins that /api/coins will return
const MAX_COIN_LIST_LEN = 100

// The maximum number of coins to fetch from CMC every poll. 0 = no lmit
const CMC_MAX_COINS = process.env.CMC_MAX_COINS || 100
const CMC_API_URI = 'https://api.coinmarketcap.com/v1/ticker/?limit=' + CMC_MAX_COINS.toString()

// The max range of the price history stored in the DB
const PRICE_HISTORY_RANGE_SECS = process.env.PRICE_HISTORY_RANGE_SECS || (60 * 60)

// Whether the app is in production
const IS_PROD = process.env.NODE_ENV === 'production'

// Default port, mainly for dev: 8080
const PORT = process.env.PORT || 8080

// Default interval to poll the CoinMarketCap API
const DEFAULT_POLL_INTERVAL = 300
const POLL_CMC_INTERVAL = process.env.POLL_CMC_INTERVAL_SECS ||
  DEFAULT_POLL_INTERVAL

// Make sure that the app doesn't abuse the API's rate limit
if (POLL_CMC_INTERVAL < DEFAULT_POLL_INTERVAL && !process.env.FORCE_POLL) {
  throw new Error(
    'Error: the environment variable POLL_CMC_INTERVAL_SECS ' +
    'must be 300 or greater'
  )
}

// Set up the database
const dbFilepath = path.join(__dirname, '../', 'db.sqlite3')
const sqliteConnStr = 'sqlite:' + dbFilepath

if (IS_PROD && !process.env.DATABASE_URL) {
  throw new Error('No DATABASE_URL environment variable provided')
}

const connStr = process.env.DATABASE_URL ? process.env.DATABASE_URL
  : sqliteConnStr
const db = new CoinStatsDb(connStr, IS_PROD, PRICE_HISTORY_RANGE_SECS)

// Running start() will launch the app
const start = () => {
  // Set up Express
  const app = express()
  app.use(helmet())
  app.use(compression())

  // Set up logging
  if (IS_PROD) {
    app.use(logger('common'))
  } else {
    app.use(logger('dev'))
  }

  // Set up URL routing. See ./route.js
  app.use('/api', routes(db, MAX_COIN_LIST_LEN))

  // Query the CMC API once, then schedule to do so every
  // POLL_CMC_INTERVAL_SECS seconds
  queryCmc(db, CMC_API_URI, !IS_PROD)
  const pollInt = setInterval(() => {
    queryCmc(db, CMC_API_URI, !IS_PROD)
  }, POLL_CMC_INTERVAL * 1000)

  // Clear the interval when the process exits
  nodeCleanup((exitCode, signal) => {
    clearInterval(pollInt)
    if (!IS_PROD) {
      console.log('\nCleared CMC poll interval and exiting.')
    }
  })

  // Serve static files from the build/ directory
  let buildDir = path.join(__dirname, '../', 'build')
  if (IS_PROD) {
    buildDir = path.join(__dirname, '../')
  }
  app.use(express.static(buildDir))

  // Set up error handling
  if (IS_PROD) {
    app.use((err, req, res, next) => {
      res.type('text/plain')
      res.status(err.status || 500).send('Internal server error')
    })
  } else {
    app.use((err, req, res, next) => {
      res.type('text/plain')
      res.status(err.status || 500).send(err.stack)
    })
  }

  // Start the server
  app.listen(PORT, () => {
    if (IS_PROD) {
      console.log('Running on port ' + PORT.toString())
    } else {
      console.log('Backend running in dev mode: http://localhost:' + PORT.toString())
    }
  })
}

// Start the server once the database connection is alive and the tables have
// been synced
db.sequelize.authenticate()
  .then(() => {
    db.sequelize.sync().then(start)
  }).catch(err => {
    console.error('Unable to connect to the database.\n', err)
  })
