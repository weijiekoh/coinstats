import React from 'react'
import PropTypes from 'prop-types'

import createFilterOptions from "react-select-fast-filter-options"
import Select from "react-virtualized-select"
import "react-select/dist/react-select.css"

import Spinner from './Spinner'
import SidebarContainer from '../containers/SidebarContainer'


class Converter extends React.Component {
  componentDidMount () {
    this.props.fetchCurrencyData()
  }

  validate () {
    const fromAmt = this.props.fromAmt
    const fromCurrency = this.props.fromCurrency
    const toCurrency = this.props.toCurrency

    const validFromCurrency = fromCurrency &&
      typeof fromCurrency.value !== 'undefined' &&
      fromCurrency.value != null

    const validToCurrency = toCurrency &&
      typeof toCurrency.value !== 'undefined' &&
      toCurrency.value != null

    const parsed = parseFloat(fromAmt)
    const validAmt = !isNaN(parsed) && parsed >= 0

    return validAmt && validToCurrency && validFromCurrency
  }

  render () {
    if (!this.props.currencyData) {
      return (
        <div className="converter">
          <h4>Currency Converter</h4>
          <Spinner />
        </div>
      )
    }

    const options = this.props.currencyData.map(c => {
      const label = c.name + ' (' + c.symbol + ')'
      return {
        value: c.price_usd,
        label: label
      }
    })

    const convert = (fromVal, toVal, amt) => {
      const result = fromVal / toVal * amt
      console.log(fromVal, toVal, amt)
      return result
    }

    let result = null
    if (this.validate()) {
      result = convert(
        this.props.fromCurrency.value,
        this.props.toCurrency.value,
        this.props.fromAmt
      )
    }

    const filterOptions = createFilterOptions({ options })

    return (
      <div className="ibm ibm-type-c container-fluid">
        <SidebarContainer />
        <div className="content">
          <div className="converter">
            <h4>Currency Converter</h4>
            <p>
              Type to search for each currency you want to convert between.
            </p>
            <div className='row'>
              <div className='col-12 col-sm-6 from'>
                <p>From:</p>
                <Select
                  value={this.props.fromCurrency}
                  onChange={this.props.setFromCurrency}
                  filterOptions={filterOptions} />
              </div>

              <div className='col-12 col-sm-6 to'>
                <p>To:</p>
                <Select
                  value={this.props.toCurrency}
                  onChange={this.props.setToCurrency}
                  filterOptions={filterOptions} />
              </div>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-6 amt'>
                <p>Amount:</p>
                <input 
                  className='amt_input'
                  onChange={e => {this.props.setFromAmt(e.target.value)}}
                  type='number' min='0' value={this.props.fromAmt} />
              </div>
            </div>

            <div className='row justify-content-center'>
              <div className='col results'>
                {result &&
                  <span>
                    <pre>
                      {this.props.fromAmt}
                    </pre> {this.props.fromCurrency.label} costs <br />
                    <pre>{result}</pre> {this.props.toCurrency.label}.
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Converter.propTypes = {
  //convertAmts: PropTypes.func.isRequired,
  setFromCurrency: PropTypes.func.isRequired,
  setToCurrency: PropTypes.func.isRequired,
  setFromAmt: PropTypes.func.isRequired
}

export default Converter
