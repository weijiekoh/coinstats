const express = require('express')

function router (db) {
  const router = express.Router()

  router.get('/hello', function (req, res) {
    res.type('text/plain')
    res.send('Hello, world')
  })

  return router
}

module.exports = router
