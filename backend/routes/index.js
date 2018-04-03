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
  // @t: start from this index
  // @m: the number of items to return
  // @s: the sort parameter
  // @d: the sort direction
  router.get('/coins/', async (req, res) => {
    const start = parseInt(req.query.t, 10)
    const limit = parseInt(req.query.m, 10)
    const sortParam = parseInt(req.query.s, 10)
    const direcParam = parseInt(req.query.d, 10)
    const DESC = 0
    const ASC = 1
    // The order of this array matters!
    const sortParams = [
      'symbol',             // 0
      'name',               // 1
      'price_usd',          // 2
      'price_btc',          // 3
      'market_cap_usd',     // 4
      'volume_usd_24h',     // 5
      'available_supply',   // 6
      'total_supply',       // 7
      'max_supply',         // 8
      'percent_change_1h',  // 9
      'percent_change_24h', // 10
      'percent_change_7d'   // 11
    ]

    if (limit === 0) {
      // No need to query the DB
      res.type('text/json')
      return res.send([])
    }

    // Validate the start and limit query params
    const validStart = !isNaN(start) && start >= 0
    const validLimit = !isNaN(limit) && limit >= 0

    if (!(validStart && validLimit)) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid start/limit params')
    }

    // Validate the sort and direction query params. @d must be either 0 or 1,
    // and @s must be an element in sortParams.keys()

    const validSort = !isNaN(sortParam) && sortParam < sortParams.length && sortParam > 0
    const validDirec = [ASC, DESC].indexOf(direcParam) > -1

    if (!(validSort && validDirec)) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid sort/direc params')
    }

    const direction = direcParam === ASC ? 'ASC' : 'DESC'

    try {
      const coins = await db.getCoins(start, limit, sortParams[sortParam], direction)
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
