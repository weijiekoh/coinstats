import { connect } from 'react-redux'
import CoinStats from '../components/CoinStats'
import { sortParams, sortDirections } from '../lib/shared'
import {
  fetchedCoins,
  fetchingCoins,
  prevArrowClick,
  nextArrowClick,
  openFilterClick,
  closeFilterClick,
  priceFilterClick,
  volFilterClick
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

const mapStateToProps = (state, ownProps) => {
  return state.coinstats
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
    return dispatchFetchCoinsAsync(dispatch, getState)
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
    initialFetch: () => dispatch(initialFetch())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats)
