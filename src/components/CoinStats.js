import React from 'react'
import PropTypes from 'prop-types'
import SidebarContainer from '../containers/SidebarContainer'
import autorefreshToggle from './autorefreshToggle'

import {
  formatPrice,
  formatMcap,
  formatVol,
  formatPercentChange
} from '../lib/formatters'
import { arrowLeft, arrowRight, caretDown, caretUp } from './icons/arrows'
import star from './icons/star'
import SingleCoin from './SingleCoin'
import Spinner from './Spinner'

class CoinStats extends React.Component {
  componentDidMount () {
    // Set up autorefresh intervals
    this.autorefreshInterval = setInterval(
      () => {
        if (this.props.shouldAutorefresh) {
          this.refreshTable()
        }

        if (this.props.shouldChartAutorefresh) {
          this.refreshChart()
        }
      },
      (1000 * 60)
    )

    window.onkeydown = e => {
      if (e.keyCode === 27) {
        this.props.hideCoinInfo()
      }
    }

    this.props.hideCoinInfo()
    this.props.initialFetch()
  }

  refreshTable () {
    this.props.triggerAutorefresh()
    this.props.fetchFaves()
  }

  refreshChart () {
    this.props.triggerChartAutorefresh(this.props.coinToShow.cmc_id)
    this.props.fetchFaves()
  }

  componentWillUnmount () {
    if (this.autorefreshInterval) {
      clearInterval(this.autorefreshInterval)
    }
  }

  renderTable () {
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
        <table className='table sortable'>
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
              <th className='no-pointer'></th>
              {makeTh('coin', 'symbol', 'Symbol')}
              {makeTh('', 'market_cap_usd', 'Market cap')}
              {makeTh('', 'volume_usd_24h', '24h Volume')}
              {makeTh('', 'price_usd', 'Price (USD)')}
              {makeTh('', 'percent_change_24h', '24h change')}
            </tr>
          </thead>

          { !this.props.isFetchingCoins && this.props.coins &&
            <tbody>
              {this.props.coins.map((d, i) =>
                <tr className='coinrow' key={i}
                  onClick={() => this.props.coinRowClicked(d.cmc_id)}>

                  <td onClick={e => {
                      this.props.toggleFave(d)
                      e.stopPropagation()
                    }}
                      className='star'>

                    {this.props.faves.has(d.cmc_id) ?
                      <span className='star full-star'>
                        {star}
                      </span>
                      :
                      <span className='star empty-star'>
                        {star}
                      </span>
                    }
                  </td>

                  <td title={d.name} className='coin'>
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

          {isAtBottom && <div className='autorefresh' />}
          {!isAtBottom && !this.props.tablePollFailed &&
            autorefreshToggle(
              this.props.isAutorefreshing,
              this.props.toggleAutorefresh,
              this.props.shouldAutorefresh,
              () => {this.refreshTable()}
            )
          }

          <div className='page-size'>
            {this.props.totalCoins &&
              <span>
                <span>
                  <span className='range'>{start} - {end}</span> of {this.props.totalCoins}
                </span>
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
      <div className="ibm ibm-type-c container-fluid">
        <SidebarContainer
          faves={this.props.faves}
          onLogoClick={this.props.hideCoinInfo}
        />
        <div className="content">
          <div className='coinstats'>
            { !this.props.coinInfoVisible && this.props.totalCoins && this.renderControls(false) }

            { !this.props.tablePollFailed &&
              !this.props.coinInfoVisible &&
              this.renderTable() }

            { this.props.tablePollFailed &&
                <p>
                  Could not download coin statistics. Please check your connection.
                </p>
            }

            { this.props.coinInfoVisible &&
                <SingleCoin
                  refreshChart={() => {this.refreshChart()}}
                  props={this.props} />
            }

            { !this.props.coinInfoVisible &&
              !this.props.isFetchingCoins &&
              this.props.totalCoins &&
              this.renderControls(true) }
          </div>
        </div>
      </div>
    )
  }
}

CoinStats.propTypes = {
  fetchCoins: PropTypes.func.isRequired,
  initialFetch: PropTypes.func.isRequired,
  sortCoinsClick: PropTypes.func.isRequired,
  showCoinInfo: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  openFilterClick: PropTypes.func.isRequired,
  closeFilterClick: PropTypes.func.isRequired,
  totalCoins: PropTypes.number,
  coinStart: PropTypes.number.isRequired,
  coinLimit: PropTypes.number.isRequired,
  coins: PropTypes.array,
  isFetchingCoins: PropTypes.bool.isRequired
}

export default CoinStats
