import React from 'react'
import PropTypes from 'prop-types'
const roundTo = require('round-to')
const millify = require('millify')

const data = [
  {
    rank: '1',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '693.234',
    market_cap: '312667.24233',
    percentage_change_24h: '-3.190',
    volume_24h: '4160600000.0'
  },
  {
    rank: '2',
    symbol: 'SYM',
    name: 'Coin with such a long name that it should be cut off',
    price: '234.21342',
    market_cap: '232667.24233',
    percentage_change_24h: '-0.4',
    volume_24h: '1122240000.0'
  },
  {
    rank: '3',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '8000.234',
    market_cap: '3827394038',
    percentage_change_24h: '2.353',
    volume_24h: '288014000.0'
  },
  {
    rank: '4',
    symbol: 'XMR',
    name: 'Monero',
    price: '202.234',
    market_cap: '312667.24233',
    percentage_change_24h: '-1.1934',
    volume_24h: '242025000.0'
  }
]

const formatPrice = value => {
  return roundTo(parseFloat(value), 2)
}

const formatMcap = value => {
  return millify(parseFloat(value, 3))
}

const formatPercentChange = value => {
  return roundTo(parseFloat(value), 1)
}

const CoinStats = props => (
  <div className='coinstats'>
    <table className='table'>
      <thead className='mini'>
        <tr>
          <th className='coin'>Coin</th>
          <th>Mkt cap</th>
          <th>24h vol</th>
          <th>Price ({props.denom})</th>
          <th>24h chg</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th className='coin'>Coin</th>
          <th>Market Cap</th>
          <th>24h Volume</th>
          <th>Price ({props.denom})</th>
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
            <td className='volume'>{formatMcap(d.volume_24h)}</td>
            <td className='price'>{formatPrice(d.price)}</td>
            <td className='change'>{formatPercentChange(d.percentage_change_24h)}%</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

CoinStats.propTypes = {
  denom: PropTypes.string.isRequired
}

export default CoinStats
