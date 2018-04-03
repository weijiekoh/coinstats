import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { formatPrice, formatMcap, formatVol, formatPercentChange } from '../lib/formatters'
import { arrowLeft, arrowRight, caretDown, caretUp } from './icons/arrows'
import Spinner from './Spinner'

class CoinStats extends Component {
  componentDidMount () {
    this.props.initialFetch()
  }

  renderTable (coins) {
    const sort = sortParam => {
      return () => this.props.sortCoinsClick(sortParam)
    }

    const makeTh = (className, sortField, text) => (
      <th className={className} onClick={sort(sortField)}>
        {text}
      </th>
    )

    return (
      <div>
        <table className='table'>
          <thead className='mini'>
            <tr>
              {makeTh('coin', 'symbol', 'Symbol')}
              {makeTh('', 'market_cap_usd', 'Mkt cap')}
              {makeTh('', 'volume_usd_24h', '24h vol')}
              {makeTh('', 'price_usd', 'Price (USD)')}
              {makeTh('change', 'percent_change_24h', '24h chg')}
            </tr>
          </thead>
          <thead>
            <tr>
              {makeTh('coin', 'symbol', 'Symbol')}
              {makeTh('', 'market_cap_usd', 'Market cap')}
              {makeTh('', 'volume_usd_24h', '24h Volume')}
              {makeTh('', 'price_usd', 'Price (USD)')}
              {makeTh('', 'percent_change_24h', '24h change')}
            </tr>
          </thead>

          { !this.props.isFetchingCoins && this.props.coins &&
            <tbody>
              {coins.map((d, i) =>
                <tr key={i}>
                  <td title={d.name}
                    className='coin'>
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

  renderControls (isAtBottom) {
    const start = this.props.coinStart + 1
    const increment = this.props.coinStart + this.props.coinLimit
    const end = increment > this.props.totalCoins ? this.props.totalCoins : increment

    const optAnimClass = this.props.showFilters ? 'opened' : 'closed'

    return (
      <div className='parent'>
        <div className='controls'>
          {isAtBottom ?
            <div className='filters' />
            :
            <div className='filters'>
              {this.props.showFilters ?
                <div onClick={this.props.closeFilterClick}>
                  <span>Filters{caretUp}</span>
                </div>
                :
                <div onClick={this.props.openFilterClick}>
                  <span>Filters{caretDown}</span>
                </div>
              }
            </div>
          }

          <div className='page-size'>
            {this.props.totalCoins &&
                <span>
                  <span>
                    <span className='range'>{start} - {end}</span> of {this.props.totalCoins}
                  </span>
                  {/*
              <div className='size-chooser'>
              </div>
              */}
            </span>
            }
          </div>
          <div className='nav-arrows'>
            {this.props.coinStart > 0 ?
                <span onClick={this.props.prevArrowClick} className='arrow'>
                  {arrowLeft}
                </span>
                :
                <span className='arrow' />
            }
            {increment > this.props.totalCoins ?
                <span className='arrow' />
                :
                <span onClick={this.props.nextArrowClick} className='arrow'>
                  {arrowRight}
                </span>
            }
          </div>
        </div>

        {!isAtBottom &&
          <div className={'opts ' + optAnimClass}>
            <div className='opt'>
              <label htmlFor='vol_checkbox'>
                <input
                  onChange={this.props.volFilterClick}
                  id='vol_checkbox' type='checkbox'
                  checked={this.props.showHighVolume}
                  value={this.props.showHighVolume}
                />
                24h volume above 10K
              </label>

              <label htmlFor='price_checkbox'>
                <input id='price_checkbox' type='checkbox'
                  onChange={this.props.priceFilterClick}
                  checked={this.props.showPriceAboveCent}
                  value={this.props.showPriceAboveCent} />
                Price above 0.01 USD
              </label>
            </div>
          </div>
        }
      </div>
    )
  }

  render () {
    return (
      <div className='coinstats'>
        { this.props.totalCoins && this.renderControls(false) }

        { this.renderTable(this.props.coins) }

        { !this.props.isFetchingCoins &&
            this.props.totalCoins &&
            this.renderControls(true) }

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
