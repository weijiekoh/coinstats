/* global define, it, describe, before */
/* eslint-disable handle-callback-err */

const expect = require('chai').expect
const request = require('request')

const ROOT_URL = 'http://localhost:8080'

before(() => {
  request(ROOT_URL, (error, response, body) => {
    if (error) {
      console.log('Please run "yarn prod" in a separate terminal before running this test.')
      process.exit(1)
    }
  })
})

it('/api/coins/', done => {
  const minVol = 10000
  const minPrice = 1
  const length = 20
  const path = '/api/coins/?t=0&m=' + length + '&d=0&s=4&mp=' + minPrice + '&mv=' + minVol
  request(ROOT_URL + path, (error, response, body) => {
    const coins = JSON.parse(body).coins
    coins.forEach(coin => {
      expect(coin.volume_usd_24h).is.above(minVol)
      expect(coin.price_usd).is.above(minPrice)
    })
    expect(coins.length).is.below(length + 1)
    done()
  })
})

it('/api/coins_by_ids/', done => {
  request(ROOT_URL + '/api/coins_by_ids/ethereum', (error, response, body) => {
    const data = JSON.parse(body)
    expect(data).to.have.lengthOf.above(0)
    expect(data[0].cmc_id).is.equal('ethereum')
    done()
  })
})

it('/api/coin/prices/bitcoin', done => {
  request(ROOT_URL + '/api/coin/prices/bitcoin', (error, response, body) => {
    const data = JSON.parse(body)
    expect(data).to.have.lengthOf.above(0)
    expect(data[0].datetime).to.exist
    expect(data[0].price_usd).to.exist
    expect(data[0].price_btc).to.exist
    done()
  })
})

it('index page content', done => {
  request(ROOT_URL, (error, response, body) => {
    expect(body).to.have.lengthOf.above(0)
    expect(body).to.include('title')
    expect(body).to.include('html')
    expect(body).to.include('body')
    expect(body).to.include('root')
    expect(body).to.include('/static/js/main')
    done()
  })
})

it('favicons', done => {
  const faviconPaths = [
    '/favicons/favicon.ico',
    '/favicons/favicon-32x32.png',
    '/favicons/favicon-16x16.png',
    '/favicons/apple-touch-icon.png',
    '/favicons/safari-pinned-tab.svg'
  ]

  faviconPaths.forEach(path => {
    request(ROOT_URL + path, (error, response, body) => {
      expect(response.statusCode).is(200)
    })
  })
  done()
})
