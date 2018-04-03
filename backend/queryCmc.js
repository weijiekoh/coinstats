const fetch = require('node-fetch')
const fs = require('fs')


function queryCmc (db) {
  const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=2'
  fs.readFile('./sample.json', function (err, data) {
    db.updateCoins(JSON.parse(data))
  })

  //fetch(url).then(function (response) {
    //response.json().then(function (coins) {
      //console.log('Fetched data for ' + coins.length.toString() + ' coins')
      //db.updateCoins(coins)
    //})
  //})
}

module.exports = queryCmc
