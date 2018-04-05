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
  autorefreshing,
  autorefreshed,
  toggleAutorefresh
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

    const data = await (await fetch(url)).json()
    return dispatch(fetchedCoins(data, sort, direc, minPrice, minVol))
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
    await dispatchFetchCoinsAsync(dispatch, getState)

    const faves = getState().coinstats.faves

    // Fetch data for the coin specified in the URL
    const cmcId = getState().coinstats.cmcIdToShow
    if (cmcId) {
      try {
        const coin = await (await fetch('/api/coin/' + cmcId)).json()
        dispatch(showCoinInfo(coin))
      } catch(err) {
        console.error("Invalid cmcId")
      }
    }

    if (getFaveIds().length > 0) {
      try {
        const faveIds = getFaveIds().join(',')
        const coinData = await (await fetch('/api/coins_by_ids/' + faveIds)).json()
        coinData.forEach(coin => {
          if (!faves.has(coin.cmc_id)) {
            dispatch(toggleFave(coin))
          }
        })
      } catch (err) {
        console.error('Error fetching favourite coin data')
      }
    }
  }
}

const fetchAndShowCoinInfoAsync = cmcId => {
  return async (dispatch, getState) => {
    if (cmcId) {
      const coin = await (await fetch('/api/coin/' + cmcId)).json()
      return dispatch(showCoinInfo(coin))
    }
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
    await dispatchFetchCoinsAsync(dispatch, getState)
    return dispatch(autorefreshed())
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
    showCoinInfo: coin => dispatch(showCoinInfo(coin)),
    showCoinInfoByCmcId: cmcId => dispatch(fetchAndShowCoinInfoAsync()),
    hideCoinInfo: () => dispatch(hideCoinInfo()),
    toggleFave: (...params) => dispatch(handleToggleFave(...params)),
    toggleAutorefresh: () => dispatch(toggleAutorefresh()),
    triggerAutorefresh: () => dispatch(handleTriggerAutorefreshAsync())
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
