import { connect } from 'react-redux'
import {
  fetchedCurrencyData,
  setFromAmt,
  setFromCurrency,
  setToCurrency
} from '../actions/converter.js'

import Converter from '../components/Converter'

const handleFetchCurrencyDataAsync = () => {
  return async (dispatch, getState) => {
    const currencyData = await (await fetch('/api/currencies')).json()
    dispatch(fetchedCurrencyData(currencyData))
  }
}

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state.converter)
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCurrencyData: () => dispatch(handleFetchCurrencyDataAsync()),
    setFromCurrency: fromCurrency => dispatch(setFromCurrency(fromCurrency)),
    setToCurrency: toCurrency => dispatch(setToCurrency(toCurrency)),
    setFromAmt: amt => dispatch(setFromAmt(amt))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Converter)
