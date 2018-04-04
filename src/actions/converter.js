const fetchingCurrencyData = () => {
  return {
    type: 'FETCHING_CURRENCY_DATA'
  }
}

const fetchedCurrencyData = currencyData => {
  return {
    type: 'FETCHED_CURRENCY_DATA',
    currencyData
  }
}

const setFromAmt = amt => {
  return {
    type: 'SET_FROM_AMT',
    amt
  }
}

const setToCurrency = toCurrency => {
  return {
    type: 'SET_TO_CURRENCY',
    toCurrency
  }
}

const setFromCurrency = fromCurrency => {
  return {
    type: 'SET_FROM_CURRENCY',
    fromCurrency
  }
}

export {
  fetchingCurrencyData,
  fetchedCurrencyData,
  setFromAmt,
  setFromCurrency,
  setToCurrency
}
