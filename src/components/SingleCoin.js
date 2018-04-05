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

//const sampleData = [
  //{ "datetime": "2018-04-05T21:52:25.516Z", "price_usd": 6747.07, "price_btc": 1 }, { "datetime": "2018-04-05T21:57:26.109Z", "price_usd": 6748.96, "price_btc": 1 }, { "datetime": "2018-04-05T22:02:27.356Z", "price_usd": 6740.08, "price_btc": 1 }, { "datetime": "2018-04-05T22:07:26.672Z", "price_usd": 6756.84, "price_btc": 1 }, { "datetime": "2018-04-05T22:12:25.829Z", "price_usd": 6751.05, "price_btc": 1 }, { "datetime": "2018-04-05T22:17:25.674Z", "price_usd": 6787.75, "price_btc": 1 }, { "datetime": "2018-04-05T22:22:26.035Z", "price_usd": 6784.89, "price_btc": 1 }, { "datetime": "2018-04-05T22:27:27.248Z", "price_usd": 6790.66, "price_btc": 1 }, { "datetime": "2018-04-05T22:32:25.873Z", "price_usd": 6786.85, "price_btc": 1 }, { "datetime": "2018-04-05T22:37:25.798Z", "price_usd": 6799.91, "price_btc": 1 }, { "datetime": "2018-04-05T22:42:26.398Z", "price_usd": 6814.99, "price_btc": 1 }, { "datetime": "2018-04-05T22:47:26.712Z", "price_usd": 6813.38, "price_btc": 1 }]

// styles for this are in chart.scss
const renderChart = (priceHistory) => {
  //const data = sampleData.map(p => ({
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
            padding={{bottom: 30, top: 30}}
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

const SingleCoin = ({ props, refreshChart }) => {
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

      <p>
        The price of {coin.name} in USD over the past hour:
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
            props.shouldChartAutorefresh,
            () => { refreshChart() }
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
