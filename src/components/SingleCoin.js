import React from 'react'
import close from './icons/close'
import star from './icons/star'
import {
  formatPriceNoRound,
  formatPercentChange
} from '../lib/formatters'

const SingleCoin = props => {
  const coin = props.coin
  const emptyStar = <span className='star empty-star'>{star}</span>
  const fullStar = <span className='star full-star'>{star}</span>

  return (
    <div className='singlecoin'>
      <div onClick={props.hideCoinInfo} className='close-btn'>
        <span>{close}</span>
      </div>

      <p className='name'>
        <span title='Add to favourites' onClick={() => props.toggleFave(coin)}>
          {props.isFave ? fullStar : emptyStar }
        </span>{coin.name} <span className='symbol'>({coin.symbol})</span>
      </p>

      <table className='table'>
        <thead>
          <tr>
            <th>Market Captalisation (USD)</th>
            <th>24-hour Volume (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatPriceNoRound(coin.market_cap_usd)}</td>
            <td>{formatPriceNoRound(coin.volume_usd_24h)}</td>
          </tr>
        </tbody>
      </table>

      <p className='subtitle'>Price per coin</p>
      <table className='table'>
        <thead>
          <tr>
            <th>USD</th>
            <th>BTC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatPriceNoRound(coin.price_usd)}</td>
            <td>{formatPriceNoRound(coin.price_btc, 8, true)}</td>
          </tr>
        </tbody>
      </table>

      <p className='subtitle'>Price Change (USD)</p>

      <table className='table'>
        <thead>
          <tr>
            <th>1 hour</th>
            <th>1 day</th>
            <th>1 week</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatPercentChange(coin.percent_change_1h)}</td>
            <td>{formatPercentChange(coin.percent_change_24h)}</td>
            <td>{formatPercentChange(coin.percent_change_7d)}</td>
          </tr>
        </tbody>
      </table>

      <p className='subtitle'>Supply</p>

      <table className='table'>
        <thead>
          <tr>
            <th>Available</th>
            <th>Total</th>
            <th>Maximum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatPriceNoRound(coin.available_supply)}</td>
            <td>{formatPriceNoRound(coin.total_supply)}</td>
            <td>{formatPriceNoRound(coin.max_supply)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SingleCoin
