const fetch = require('node-fetch')
const fs = require('fs')


const queryCmc = async db => {
  fs.readFile('./sample.json', function (err, data) {
    db.updateCoins(JSON.parse(data))
  })

  //const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=0'
  //const response = await fetch(url)
  //const coins = await response.json()
  //console.log('Fetched data for ' + coins.length.toString() + ' coins')
  //await db.updateCoins(coins)
}

module.exports = queryCmc
