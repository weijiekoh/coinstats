import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import CoinStats from '../components/CoinStats'
import { sortParams, sortDirections } from '../lib/shared'
import { getFaveIds, saveFaveIds } from '../lib/storage'
import {
  fetchedCoins,
  fetchingCoins,

  prevArrowClick,
  nextArrowClick,

  openFilterClick,
  closeFilterClick,

  priceFilterClick,
  volFilterClick,

  resetPagination,

  showCoinInfo,
  hideCoinInfo,
  toggleFave,
  setFaves,

  autorefreshing,
  autorefreshed,
  toggleAutorefresh,

  toggleChartAutorefresh,
  chartAutorefreshed,
  chartAutorefreshing,
  updatePriceHistory,

  chartPollFailed,
  tablePollFailed
} from '../actions/coinstats'

const fetchCoinsAsync = (start, limit, sort, direc, minPrice, minVol) => {
  return async (dispatch, getState) => {
    let url = '/api/coins/?'
    url += 't=' + encodeURIComponent(start)
    url += '&m=' + encodeURIComponent(limit)
    url += '&d=' + encodeURIComponent(direc)
    url += '&s=' + encodeURIComponent(sort)
    if (minPrice != null) {
      url += '&mp=' + encodeURIComponent(minPrice)
    }
    if (minVol != null) {
      url += '&mv=' + encodeURIComponent(minVol)
    }

    await dispatch(fetchingCoins())

    try {
      const data = await (await fetch(url)).json()
      return dispatch(fetchedCoins(data, sort, direc, minPrice, minVol))
    } catch (err) {
      return dispatch(tablePollFailed())
    }
  }
}

const dispatchFetchCoinsAsync = (dispatch, getState) => {
  const state = getState()
  const start = state.coinstats.coinStart
  const limit = state.coinstats.coinLimit
  const sort = state.coinstats.sortParam
  const direc = state.coinstats.sortDirection
  const minPrice = state.coinstats.minPrice
  const minVol = state.coinstats.minVol
  return dispatch(fetchCoinsAsync(start, limit, sort, direc, minPrice, minVol))
}

const initialFetch = () => {
  return async (dispatch, getState) => {
    // Fetch data for the table
    try {
      await dispatchFetchCoinsAsync(dispatch, getState)
    } catch (err) {
      return dispatch(tablePollFailed())
    }

    // Fetch data for the coin specified in the URL
    const cmcId = getState().coinstats.cmcIdToShow
    if (cmcId) {
      try {
        const coin = await (await fetch('/api/coin/' + cmcId)).json()
        const priceHistory = await (await (fetch('/api/coin/prices/' + cmcId))).json()
        dispatch(updatePriceHistory(priceHistory))
        dispatch(showCoinInfo(coin))
      } catch (err) {
        console.error('Invalid cmcId')
      }
    }

    return dispatch(handleFetchFaves())
  }
}

const handleFetchFaves = () => {
  return async (dispatch, getState) => {
    if (getFaveIds().length > 0) {
      try {
        const faveIds = getFaveIds().join(',')
        const coinData = await (await fetch('/api/coins_by_ids/' + faveIds)).json()

        let newFaves = new Map()
        coinData.forEach(coin => {
          newFaves.set(coin.cmc_id, coin)
        })

        return dispatch(setFaves(newFaves))
      } catch (err) {
        console.error('Error fetching favourite coin data')
      }
    }
  }
}

const handleCoinRowClickedAsync = cmcId => {
  return async (dispatch, getState) => {
    const coin = await (await fetch('/api/coin/' + cmcId)).json()
    const priceHistory = await (await (fetch('/api/coin/prices/' + cmcId))).json()
    await dispatch(updatePriceHistory(priceHistory))
    return dispatch(showCoinInfo(coin))
  }
}

const handlePrevArrowClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(prevArrowClick())
    return dispatchFetchCoinsAsync(dispatch, getState)
  }
}

const handleNextArrowClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(nextArrowClick())
    return dispatchFetchCoinsAsync(dispatch, getState)
  }
}

const handleSortCoinsClickAsync = nextParamName => {
  return async (dispatch, getState) => {
    await dispatch(resetPagination())
    const state = getState().coinstats
    const { ASC, DESC } = sortDirections
    const nextParam = sortParams.indexOf(nextParamName)
    const currentParam = state.sortParam
    const currentDirec = state.sortDirection

    let nextDirec = ASC
    if (currentParam === nextParam) {
      nextDirec = currentDirec === DESC ? ASC : DESC
    }

    const limit = state.coinLimit
    const minPrice = state.minPrice
    const minVol = state.minVol
    return dispatch(fetchCoinsAsync(0, limit, nextParam, nextDirec, minPrice, minVol))
  }
}

const handlePriceFilterClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(priceFilterClick())
    return dispatchFetchCoinsAsync(dispatch, getState)
  }
}

const handleVolFilterClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(volFilterClick())
    return dispatchFetchCoinsAsync(dispatch, getState)
  }
}

const handleResetPaginationAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(resetPagination())
    return dispatchFetchCoinsAsync(dispatch, getState)
  }
}

const handleToggleFave = coin => {
  return async (dispatch, getState) => {
    // get the IDs of the existing faves
    const faves = getState().coinstats.faves
    let faveIds = []
    faves.forEach(fave => {
      faveIds.push(fave.cmc_id)
    })

    // if coin.cmc_id is in faveIds, remove it. otherwise, add it.
    if (faveIds.indexOf(coin.cmc_id) > -1) {
      faveIds = faveIds.filter(f => f !== coin.cmc_id)
    } else {
      faveIds.push(coin.cmc_id)
    }

    // save to localstorage
    saveFaveIds(faveIds)
    return dispatch(toggleFave(coin))
  }
}

const handleTriggerAutorefreshAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(autorefreshing())
    try {
      await dispatchFetchCoinsAsync(dispatch, getState)
      return dispatch(autorefreshed())
    } catch (err) {
      return dispatch(tablePollFailed)
    }
  }
}

const handleTriggerChartAutorefreshAsync = cmcId => {
  return async (dispatch, getState) => {
    await dispatch(chartAutorefreshing())

    try {
      await dispatch(handleCoinRowClickedAsync(cmcId))
      return dispatch(chartAutorefreshed())
    } catch (err) {
      await dispatch(chartPollFailed())
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sortCoinsClick: (...params) => dispatch(handleSortCoinsClickAsync(...params)),
    nextArrowClick: () => dispatch(handleNextArrowClickAsync()),
    prevArrowClick: () => dispatch(handlePrevArrowClickAsync()),

    fetchCoins: (...params) => dispatch(fetchCoinsAsync(...params)),
    fetchedCoins: (...params) => dispatch(fetchedCoins(...params)),

    openFilterClick: () => dispatch(openFilterClick()),
    closeFilterClick: () => dispatch(closeFilterClick()),

    priceFilterClick: () => dispatch(handlePriceFilterClickAsync()),
    volFilterClick: () => dispatch(handleVolFilterClickAsync()),

    initialFetch: () => dispatch(initialFetch()),
    resetPagination: () => dispatch(handleResetPaginationAsync()),

    coinRowClicked: cmcId => dispatch(handleCoinRowClickedAsync(cmcId)),

    showCoinInfo: coin => dispatch(showCoinInfo(coin)),
    hideCoinInfo: () => dispatch(hideCoinInfo()),

    toggleFave: (...params) => dispatch(handleToggleFave(...params)),

    toggleAutorefresh: () => dispatch(toggleAutorefresh()),
    triggerAutorefresh: () => dispatch(handleTriggerAutorefreshAsync()),

    toggleChartAutorefresh: () => dispatch(toggleChartAutorefresh()),
    triggerChartAutorefresh: cmcId => dispatch(handleTriggerChartAutorefreshAsync(cmcId)),

    fetchFaves: () => dispatch(handleFetchFaves())
  }
}

const mapStateToProps = (state, ownProps) => {
  return Object.assign(state.coinstats, {}, {
    cmcIdToShow: ownProps.match.params.cmcId
  })
}

const CoinStatsContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats))

export default CoinStatsContainer
