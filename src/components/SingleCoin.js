import React from 'react'
import close from './icons/close'
import star from './icons/star'
import format from 'date-fns/format'
import autorefreshToggle from './autorefreshToggle'
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

const formatTime = timestamp => {
  return format(timestamp, 'HH:mm')
}

// styles for this are in chart.scss
const renderChart = (priceHistory) => {
  const data = priceHistory.map(p => ({
    price_usd: p.price_usd,
    datetime: (new Date(p.datetime)).getTime()
  }))

  return (
    <div className='chart'>
      <ResponsiveContainer width='100%' aspect={3.0/1}>
        <LineChart margin={{right: 25, left: 5, top: 10, bottom: 10}}
                   data={data}>

          <XAxis type='number' dataKey='datetime'
                 tickFormatter={formatTime}
                 domain = {['auto', 'auto']}
                 minTickGap={60} scale='time' interval={'preserveStartEnd'}>
            <Label position='bottom' value='Time'
                   offset={-6} />
          </XAxis>

          <YAxis type='number' dataKey='price_usd'
                 interval={'preserveStartEnd'}>
            <Label position='left' value='Price (USD)'
                   offset={0} angle={-90}/>
          </YAxis>

          <Line dot={false} animationDuration={0}
                type="monotone" dataKey='price_usd' />

        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

const SingleCoin = ({ props }) => {
  const isFave = props.faves.has(props.coinToShow.cmc_id)
  const coin = props.coinToShow
  const emptyStar = (<span className='star empty-star'>{star}</span>)
  const fullStar = (<span className='star full-star'>{star}</span>)

  return (
    <div className='singlecoin'>
      <div onClick={props.hideCoinInfo} className='close-btn'>
        <span>{close}</span>
      </div>

      <p className='name'>
        <span title='Add to favourites' onClick={() => props.toggleFave(coin)}>
          {isFave ? fullStar : emptyStar }
        </span>{coin.name} <span className='symbol'>({coin.symbol})</span>
      </p>

      {props.priceHistory && renderChart(props.priceHistory) }

      <div className='controls'>
        {props.chartPollFailed ?
          <p className='autorefresh'>
            Please check your connection.
          </p>
          :
          autorefreshToggle(
            props.isChartAutorefreshing,
            props.toggleChartAutorefresh,
            props.shouldChartAutorefresh
          )
        }
      </div>

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
