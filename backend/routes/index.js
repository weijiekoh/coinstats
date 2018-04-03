const express = require('express')

function router (db) {
  const router = express.Router()

  router.get('/hello', (req, res) => {
    res.type('text/plain')
    res.send('Hello, world')
  })

  router.get('/coin/:id', async (req, res) => {
    res.type('text/json')
    const cmcId = req.params.id
    try {
      const coin = await db.getCoin(cmcId)
      res.send(coin)
    } catch (err) {
      res.type('text/plain')
      res.statusCode = 500
      res.send(err.message)
    }
  })

  router.get('/coin/prices/:id', async (req, res) => {
    const cmcId = req.params.id
    const earliest = req.query.earliest
    try {
      const priceHistory = await db.getPriceHistory(cmcId, earliest)
      res.type('text/json')
      res.send(priceHistory)
    } catch (err) {
      res.type('text/plain')
      res.statusCode = 500
      res.send(err.message)
    }
  })

  return router
}

module.exports = router
