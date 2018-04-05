import { sortParams, sortDirections } from '../lib/shared'

const defaultCoinStart = 0
const defaultCoinLimit = 20

const initialState = {
  isFetchingCoins: false,
  showFilters: false,
  showHighVolume: true,
  showPriceAboveCent: true,
  minVol: 10000,
  minPrice: 0.01,
  coinStart: defaultCoinStart,
  coinLimit: defaultCoinLimit,
  sortParam: sortParams.indexOf('market_cap_usd'),
  sortDirection: sortDirections.DESC,
  faves: new Map(),
  coinInfoVisible: false,
  shouldAutorefresh: false,
  isAutorefreshing: false,
  shouldChartAutorefresh: false,
  isChartAutorefreshing: false,
  chartPollFailed: false,
  tablePollFailed: false
}

const coinstats = (state = initialState, action) => {
  switch (action.type) {
    case 'CHART_POLL_FAILED':
      return Object.assign({}, state, {
        chartPollFailed: true,
        isChartAutorefreshing: false
      })

    case 'TABLE_POLL_FAILED':
      return Object.assign({}, state, {
        tablePollFailed: true,
        isFetchingCoins: false
      })

    case 'UPDATE_PRICE_HISTORY':
      return Object.assign({}, state, {
        priceHistory: action.priceHistory
      })
    case 'TOGGLE_CHART_AUTOREFRESH':
      return Object.assign({}, state, {
        shouldChartAutorefresh: !state.shouldChartAutorefresh
      })

    case 'CHART_AUTOREFRESHING':
      return Object.assign({}, state, {
        isChartAutorefreshing: true
      })

    case 'CHART_AUTOREFRESHED':
      return Object.assign({}, state, {
        isChartAutorefreshing: false,
        chartPollFailed: false
      })

    case 'TOGGLE_AUTOREFRESH':
      return Object.assign({}, state, {
        shouldAutorefresh: !state.shouldAutorefresh
      })

    case 'AUTOREFRESHING':
      return Object.assign({}, state, {
        isAutorefreshing: true
      })

    case 'AUTOREFRESHED':
      return Object.assign({}, state, {
        isAutorefreshing: false,
        tablePollFailed: false
      })

    case 'TOGGLE_FAVE':
      const cmcId = action.coin.cmc_id
      let m = new Map(state.faves)

      if (state.faves.has(cmcId)) {
        m.delete(cmcId)
      } else {
        m.set(cmcId, action.coin)
      }

      return Object.assign({}, state, {
        faves: m
      })

    case 'SET_FAVES':
      return Object.assign({}, state, {
        faves: action.faves
      })

    case 'HIDE_COIN_INFO':
      return Object.assign({}, state, {
        coinInfoVisible: false
      })

    case 'SHOW_COIN_INFO':
      return Object.assign({}, state, {
        coinInfoVisible: true,
        coinToShow: action.coin
      })

    case 'RESET_PAGINATION':
      return Object.assign({}, state, {
        coinStart: defaultCoinStart,
        coinLimit: defaultCoinLimit
      })

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
