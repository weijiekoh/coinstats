import { connect } from 'react-redux'
import CoinStats from '../components/CoinStats'
import { sortParams, sortDirections } from '../lib/shared'
import {
  fetchedCoins,
  fetchingCoins,
  prevArrowClick,
  nextArrowClick 
} from '../actions/coinstats'

const fetchCoinsAsync = (start, limit, sort, direc) => {
  return async (dispatch, getState) => {
    let url = '/api/coins/?'
    url += 't=' + encodeURIComponent(start)
    url += '&m=' + encodeURIComponent(limit)
    url += '&d=' + encodeURIComponent(direc)
    url += '&s=' + encodeURIComponent(sort)

    await dispatch(fetchingCoins())

    const data = await (await fetch(url)).json()
    return dispatch(fetchedCoins(data, sort, direc))
  }
}

const mapStateToProps = (state, ownProps) => {
  return state.coinstats
}

const handlePrevArrowClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(prevArrowClick())
    const state = getState()
    const start = state.coinstats.coinStart
    const limit = state.coinstats.coinLimit
    const sort = state.coinstats.sortParam
    const direc = state.coinstats.sortDirection
    return dispatch(fetchCoinsAsync(start, limit, sort, direc))
  }
}

const handleNextArrowClickAsync = () => {
  return async (dispatch, getState) => {
    await dispatch(nextArrowClick())
    const state = getState()
    const start = state.coinstats.coinStart
    const limit = state.coinstats.coinLimit
    const sort = state.coinstats.sortParam
    const direc = state.coinstats.sortDirection
    return dispatch(fetchCoinsAsync(start, limit, sort, direc))
  }
}

const handleSortCoinsClickAsync = nextParamName => {
  return async (dispatch, getState) => {
    const { ASC, DESC } = sortDirections
    const nextParam = sortParams.indexOf(nextParamName)
    const currentParam = getState().coinstats.sortParam
    const currentDirec = getState().coinstats.sortDirection

    let nextDirec = ASC
    if (currentParam === nextParam) {
      nextDirec = currentDirec === DESC ? ASC : DESC
    }

    const limit = getState().coinstats.coinLimit
    return dispatch(fetchCoinsAsync(0, limit, nextParam, nextDirec))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sortCoinsClick: (...params) => dispatch(handleSortCoinsClickAsync(...params)),
    nextArrowClick: () => dispatch(handleNextArrowClickAsync()),
    prevArrowClick: () => dispatch(handlePrevArrowClickAsync()),
    fetchCoins: (...params) => dispatch(fetchCoinsAsync(...params)),
    fetchedCoins: (...params) => dispatch(fetchedCoins(...params))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats)
