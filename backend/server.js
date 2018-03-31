const path = require('path')
const logger = require('morgan')
const express = require('express')
const helmet = require('helmet')
const routes = require('./routes')
const compression = require('compression')

const app = express()
app.use(helmet())
app.use(compression())

const isProd = process.env.NODE_ENV === 'production'

// Set up logging
if (isProd) {
  app.use(logger('common'))
} else {
  app.use(logger('dev'))
}

// Set up URL routing. See ./route.js
app.use('/api', routes)

// Serve static files from the build/ directory
const buildDir = path.join(__dirname, '../', 'build')
app.use(express.static(buildDir))

// Set up error handling
if (isProd) {
  app.use(function (err, req, res, next) {
    res.type('text/plain')
    res.status(err.status || 500).send('Internal server error')
  })
} else {
  app.use(function (err, req, res, next) {
    res.type('text/plain')
    res.status(err.status || 500).send(err.stack)
  })
}

// Start the server
const defaultPort = 8080
const port = process.env.PORT || defaultPort

if (process.env.DEV) {
  console.log('Backend running in dev mode: http://localhost:' + port.toString())
}

app.listen(port)
