import React from 'react'
import close from './icons/close'
import star from './icons/star'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from 'recharts'
import {
  formatPriceNoRound,
  formatPercentChange
} from '../lib/formatters'

const data = [
  {time: 0, price_usd: 1000},
  {time: 1, price_usd: 1000},
  {time: 2, price_usd: 100},
  {time: 3, price_usd: 280},
  {time: 4, price_usd: 200},
  {time: 5, price_usd: 78},
  {time: 10, price_usd: 199},
  {time: 11, price_usd: 89},
  {time: 12, price_usd: 189},
  {time: 13, price_usd: 189},
  {time: 14, price_usd: 189}
]

// styles for this are in chart.scss
const renderChart = (priceHistory) => {
  return (
    <div class='chart'>
      <ResponsiveContainer width='100%' aspect={3.0/1}>
        <LineChart margin={{right: 25, left: 5, top: 10, bottom: 10}} data={priceHistory}>

          <XAxis type='number' dataKey='time'
                 minTickGap={1} scale='time' interval={0}>
            <Label position='bottom' value='Time'
                   offset={-6} />
          </XAxis>

          <YAxis type='number' dataKey='price_usd'
            minTickGap={1} scale='linear' interval={0}>
            <Label position='left' value='Price(USD)'
                   offset={0} angle={-90}/>
          </YAxis>

          <Line dot={false} animationDuration='0' type="monotone" dataKey='price_usd' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

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

      {/*props.priceHistory && renderChart(props.priceHistory) */}
      {renderChart(data)}

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
