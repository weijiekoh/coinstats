const fetch = require('node-fetch')
const fs = require('fs')

const queryCmc = async (db, url, debug) => {
  // debug method to generate random price data
  if (debug) {
    fs.readFile('./sample.json', async (err, data) => {
      if (err) {
        throw new Error('Error reading sample data')
      }

      let coins = JSON.parse(data)

      coins = coins.map(c => {
        c.price_usd *= Math.random()
        return c
      })
      await db.updateCoins(coins)
      await db.deleteOldPrices()
    })
  } else {
    const response = await fetch(url)
    const coins = await response.json()
    console.log('Fetched data for ' + coins.length.toString() + ' coins')
    await db.updateCoins(coins)
    await db.deleteOldPrices()
  }
}

module.exports = queryCmc
