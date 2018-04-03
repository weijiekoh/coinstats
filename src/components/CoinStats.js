import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { formatPrice, formatMcap, formatVol, formatPercentChange } from '../lib/formatters'
import { arrowLeft, arrowRight } from './icons/arrows'
import Spinner from './Spinner'

class CoinStats extends Component {
  componentDidMount () {
    this.props.fetchCoins(
      this.props.coinStart,
      this.props.coinLimit,
      this.props.sortParam,
      this.props.sortDirection
    )
  }

  renderTable (coins) {
    return (
      <div>
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

          { !this.props.isFetchingCoins && this.props.coins &&
            <tbody>
              {coins.map((d, i) =>
                <tr key={i}>
                  <td className='coin'>
                    <span>{d.symbol}</span> <span className='name'>({d.name})</span>
                  </td>
                  <td className='mcap'>{formatMcap(d.market_cap_usd)}</td>
                  <td className='volume'>{formatVol(d.volume_usd_24h)}</td>
                  <td className='price'>{formatPrice(d.price_usd)}</td>
                  <td className='change'>{formatPercentChange(d.percent_change_24h)}</td>
                </tr>
              )}
            </tbody>
          }
        </table>

        { this.props.isFetchingCoins && <Spinner /> }
      </div>
    )
  }

  renderControls () {
    const start = this.props.coinStart + 1
    const increment = this.props.coinStart + this.props.coinLimit 
    const end = increment > this.props.totalCoins ?  this.props.totalCoins : increment
    return (
      <div className='controls'>
        <div className='page-size'>
          {this.props.totalCoins &&
            <span>
              {start} - {end} of {this.props.totalCoins}
            </span>
          }
        </div>
        <div className='nav-arrows'>
          {this.props.coinStart > 0 ?
            <span onClick={this.props.prevArrowClick} className='arrow'>
              {arrowLeft}
            </span>
            :
            <span className='arrow'></span>
          }
          {increment > this.props.totalCoins ?
            <span className='arrow'></span>
            :
            <span onClick={this.props.nextArrowClick} className='arrow'>
              {arrowRight}
            </span>
          }
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='coinstats'>
        { this.props.totalCoins && this.renderControls() }

        { this.renderTable(this.props.coins) }

        { !this.props.isFetchingCoins &&
            this.props.totalCoins &&
            this.renderControls() }

      </div>
    )
  }
}

CoinStats.propTypes = {
  fetchCoins: PropTypes.func.isRequired,
  totalCoins: PropTypes.number,
  coins: PropTypes.array
}

export default CoinStats
