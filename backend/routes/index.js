const express = require('express')

function makeRouter (db) {
  const router = express.Router()

  router.get('/hello', (req, res) => {
    res.type('text/plain')
    res.send('Hello, world')
  })

  // Return data for one coin
  // @id: the cmc_id of the coin
  router.get('/coin/:id', async (req, res) => {
    res.type('text/json')
    const cmcId = req.params.id
    try {
      const coin = await db.getCoin(cmcId)
      res.send(coin)
    } catch (err) {
      res.type('text/plain')
      res.statusCode = 500
      return res.send(err.message)
    }
  })

  // Return a list of coins
  // @start: start from this index
  // @limit: the number of items to return
  // TODO: implement sorting
  router.get('/coins/', async (req, res) => {
    const start = parseInt(req.query.start, 10)
    const limit = parseInt(req.query.limit, 10)

    if (limit === 0) {
      res.type('text/json')
      return res.send([])
    }

    const validStart = !isNaN(start) && start >= 0
    const validLimit = !isNaN(limit) && limit >= 0

    if (!(validStart && validLimit)) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid start/limit params')
    }

    try {
      const coins = await db.getCoins(start, limit)
      res.type('text/json')
      return res.send(coins)
    } catch (err) {
      res.type('text/plain')
      res.statusCode = 500
      res.send(err.message)
    }
  })

  // Return the price history of a coin
  // @id: the cmc_id of the coin
  router.get('/coin/prices/:id', async (req, res) => {
    const cmcId = req.params.id
    const earliest = req.query.earliest
    try {
      const priceHistory = await db.getPriceHistory(cmcId, earliest)
      res.type('text/json')
      return res.send(priceHistory)
    } catch (err) {
      res.type('text/plain')
      res.statusCode = 500
      res.send(err.message)
    }
  })

  return router
}

module.exports = makeRouter
