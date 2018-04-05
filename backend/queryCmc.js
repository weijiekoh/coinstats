const fetch = require('node-fetch')
const fs = require('fs')


const queryCmc = async (db, url) => {
  fs.readFile('./sample.json', async (err, data) => {
    await db.updateCoins(JSON.parse(data))
    await db.deleteOldPrices()
  })

  //const response = await fetch(url)
  //const coins = await response.json()
  //console.log('Fetched data for ' + coins.length.toString() + ' coins')
  //await db.updateCoins(coins)
  //await db.deleteOldPrices()
}

module.exports = queryCmc
