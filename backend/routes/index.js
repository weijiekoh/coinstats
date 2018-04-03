import { sortParams, sortDirections } from '../../src/lib/shared'

const express = require('express')

function makeRouter (db, maxCoinListLen) {
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
    const mp = parseFloat(req.query.mp, 10)
    const mv = parseFloat(req.query.mv, 10)

    // Validate minPrice and minVol
    if (!isNaN(mp) && mp < 0) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid min price param')
    }

    if (!isNaN(minVol) && minVol < 0) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid min vol param')
    }

    let minPrice = isNaN(mp) ? null : mp
    let minVol = isNaN(mv) ? null : mv

    const { DESC, ASC } = sortDirections

    if (limit === 0) {
      // No need to query the DB
      res.type('text/json')
      return res.send([])
    }

    // Validate the start and limit query params
    const validStart = !isNaN(start) && start >= 0
    const validLimit = !isNaN(limit) && limit >= 0 && limit <= maxCoinListLen

    if (!(validStart && validLimit)) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid start/limit params')
    }

    // Validate the sort and direction query params. @d must be either 0 or 1,
    // and @s must be an element in sortParams.keys()

    const validSort = !isNaN(sortParam) && sortParam < sortParams.length && sortParam >= 0
    const validDirec = [ASC, DESC].indexOf(direcParam) > -1

    if (!(validSort && validDirec)) {
      res.type('text/json')
      res.statusCode = 500
      return res.send('Invalid sort/direc params')
    }

    const direction = direcParam === ASC ? 'ASC' : 'DESC'

    try {
      // Get the coin data
      const result = await db.getCoins(
        start, limit, sortParams[sortParam], direction, minPrice, minVol
      )

      // Return the total number of coins available

      res.type('text/json')
      return res.send(result)
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

    if (typeof earliest !== 'undefined') {
      let validTimestamp =
        earliest != null &&
        isFinite(earliest) &&
        earliest >= 0

      let datetime = new Date(earliest * 1000)
      validTimestamp &= datetime.toString() !== 'Invalid Date'

      if (!validTimestamp) {
        res.type('text/plain')
        res.statusCode = 500
        return res.send('Invalid timestamp')
      }
    }

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
