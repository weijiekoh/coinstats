import React from 'react'
//import PropTypes from 'prop-types'
import { formatPrice, formatMcap, formatVol, formatPercentChange } from '../lib/formatters'
import { arrowLeft, arrowRight } from './icons/arrows'
const Chance = require('chance')

let generateRandomData = numCoins => {
  const chance = new Chance()
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let data = []
  let symbols = {}

  let i = 0
  while (data.length < numCoins) {
    const symbol = chance.string({length: i % 4 + 3, pool: letters}).toUpperCase()
    if (Object.keys(symbols).indexOf(symbol) > -1) {
      continue
    }

    const name = chance.word({syllables: 2 + (5 - (i % 5 + 1))})
    const volume_24h = chance.floating({min: 1 * (i + 1), max: 10000 * (i + 1)})
    const market_cap = chance.floating({min: 10 * (i + 1), max: 100000000 * (i + 1)})
    const price = chance.floating({min: 0.01, max: 2000})
    const percentage_change_24h = chance.floating({min: -30.0, max: 30.0})

    data.push({symbol, name, volume_24h, price, market_cap, percentage_change_24h})

    i++
  }
  return data
}

const data = generateRandomData(20)

const CoinStats = props => (
  <div className='coinstats'>
    <div className='controls'>
      <div className='page-size'>
        1 - 20 of 800
      </div>
      <div className='nav-arrows'>
        <span className='arrow'>{arrowLeft}</span>
        <span className='arrow'>{arrowRight}</span>
      </div>
    </div>

    <table className='table'>
      <thead className='mini'>
        <tr>
          <th className='coin'>Coin</th>
          <th>Mkt cap</th>
          <th>24h vol</th>
          <th>Price (USD)</th>
          <th className='change'>24h chg</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th className='coin'>Coin</th>
          <th>Market Cap</th>
          <th>24h Volume</th>
          <th>Price (USD)</th>
          <th>24h change</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) =>
          <tr key={i}>
            <td className='coin'>
              <span>{d.symbol}</span> <span className='name'>({d.name})</span>
            </td>
            <td className='mcap'>{formatMcap(d.market_cap)}</td>
            <td className='volume'>{formatVol(d.volume_24h)}</td>
            <td className='price'>{formatPrice(d.price)}</td>
            <td className='change'>{formatPercentChange(d.percentage_change_24h)}%</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

//CoinStats.propTypes = {
//}

export default CoinStats
