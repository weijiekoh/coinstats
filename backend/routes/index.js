const express = require('express')
const router = express.Router()

router.get('/hello', function (req, res) {
  res.type('text/plain')
  res.send('Hello, world')
})

module.exports = router
