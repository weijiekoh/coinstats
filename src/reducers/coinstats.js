import { sortParams, sortDirections } from '../lib/shared'

const initialState = {
  isFetchingCoins: false,
  coinStart: 0,
  coinLimit: 20,
  sortParam: sortParams.indexOf('market_cap_usd'),
  sortDirection: sortDirections.DESC
}

const coinstats = (state = initialState, action) => {
  switch (action.type) {
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
        isFetchingCoins: false
      })
    default:
      return state
  }
}

export default coinstats
