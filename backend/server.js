import 'babel-core/register'
import 'babel-polyfill'
const nodeCleanup = require('node-cleanup')
const path = require('path')
const logger = require('morgan')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')

const CoinStatsDb = require('./db')
const routes = require('./routes')
const queryCmc = require('./queryCmc')

// The maximum number of coins that /api/coins will return
const MAXCOINLISTLEN = 100

const ISPROD = process.env.NODE_ENV === 'production'

// Default port, mainly for dev: 8080
const PORT = process.env.PORT || 8080

// Default interval: 4 min
const POLLCMCINTERVALSECS =
  (process.env.POLL_CMC_INTERVAL_SECS * 1000) ||
  (4 * 60 * 1000)

// Set up the database
const dbFilepath = path.join(__dirname, '../', 'db.sqlite3')
const sqliteConnStr = 'sqlite:' + dbFilepath
const connStr = process.env.DATABASE_URL ?
  process.env.DATABASE_URL : sqliteConnStr
const db = new CoinStatsDb(connStr, ISPROD)

const start = () => {
  const app = express()
  app.use(helmet())
  app.use(compression())

  // Set up logging
  if (ISPROD) {
    app.use(logger('common'))
  } else {
    app.use(logger('dev'))
  }

  // Set up URL routing. See ./route.js
  app.use('/api', routes(db, MAXCOINLISTLEN))

  // Set up CoinMarketCap API polling.
  // Don't abuse the CMC API
  if (POLLCMCINTERVALSECS < 5000) {
    console.log(
      'Error: the environment variable POLL_CMC_INTERVAL_SECS ' +
      'must be 5 or greater'
    )
    return
  }

  // Query the CMC API once, then schedule to do so every
  // POLL_CMC_INTERVAL_SECS seconds
  queryCmc(db)
  const pollCmcInterval = setInterval(() => {
    queryCmc(db)
  }, POLLCMCINTERVALSECS)

  // Clear the interval when the process exits
  nodeCleanup((exitCode, signal) => {
    clearInterval(pollCmcInterval)
    if (!ISPROD) {
      console.log('\nCleared CMC poll interval and exiting.')
    }
  })

  // Serve static files from the build/ directory
  let buildDir = path.join(__dirname, '../', 'build')
  if (ISPROD) {
    buildDir = path.join(__dirname, '../')
  }
  app.use(express.static(buildDir))

  // Set up error handling
  if (ISPROD) {
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
    if (ISPROD) {
      console.log('Running on port ' + PORT.toString())
    } else {
      console.log('Backend running in dev mode: http://localhost:' + PORT.toString())
    }
  })
}

// Start the server once the database connection is alive
db.sequelize.authenticate()
  .then(() => {
    db.sequelize.sync().then(start)
  }).catch(err => {
    console.error('Unable to connect to the database.\n', err)
  })
