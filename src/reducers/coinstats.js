import { sortParams, sortDirections } from '../lib/shared'

const initialState = {
  isFetchingCoins: false,
  showFilters: false,
  showHighVolume: true,
  showPriceAboveCent: true,
  minVol: 10000,
  minPrice: 0.01,
  coinStart: 0,
  coinLimit: 20,
  sortParam: sortParams.indexOf('market_cap_usd'),
  sortDirection: sortDirections.DESC
}

const coinstats = (state = initialState, action) => {
  switch (action.type) {
    case 'PRICE_FILTER_CLICK':
      const f = !state.showPriceAboveCent
      return Object.assign({}, state, {
        showPriceAboveCent: f,
        minPrice: f ? 0.01 : null
      })
    case 'VOL_FILTER_CLICK':
      const v = !state.showHighVolume
      return Object.assign({}, state, {
        showHighVolume: !state.showHighVolume,
        minVol: v ? 10000 : null
      })
    case 'OPEN_FILTER_CLICK':
      return Object.assign({}, state, {
        showFilters: true
      })

    case 'CLOSE_FILTER_CLICK':
      return Object.assign({}, state, {
        showFilters: false
      })

    case 'PREV_ARROW_CLICK':
      return Object.assign({}, state, {
        coins: null,
        coinStart: state.coinStart - state.coinLimit,
        isFetchingCoins: true
      })

    case 'NEXT_ARROW_CLICK':
      return Object.assign({}, state, {
        coins: null,
        coinStart: state.coinStart + state.coinLimit,
        isFetchingCoins: true
      })

    case 'FETCHING_COINS':
      return Object.assign({}, state, {
        coins: null,
        isFetchingCoins: true
      })

    case 'FETCHED_COINS':
      return Object.assign({}, state, {
        coins: action.coins,
        totalCoins: action.totalCoins,
        isFetchingCoins: false,
        sortDirection: action.sortDirection,
        sortParam: action.sortParam,
        minPrice: action.minPrice,
        minVol: action.minVol
      })

    default:
      return state
  }
}

export default coinstats
