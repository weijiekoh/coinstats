const initialState = {
  fetchingCurrencyData: false,
  currencyData: null,
  fromAmt: 1
}

const converter = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FROM_AMT':
      return Object.assign({}, state, {
        fromAmt: action.amt
      })
    case 'SET_FROM_CURRENCY':
      return Object.assign({}, state, {
        fromCurrency: action.fromCurrency
      })
    case 'SET_TO_CURRENCY':
      return Object.assign({}, state, {
        toCurrency: action.toCurrency
      })
    case 'FETCHING_CURRENCY_DATA':
      return Object.assign({}, state, {
        fetchingCurrencyData: true
      })
    case 'FETCHED_CURRENCY_DATA':
      return Object.assign({}, state, {
        fetchingCurrencyData: false,
        currencyData: action.currencyData
      })
    default:
      return state
  }
}

export default converter
