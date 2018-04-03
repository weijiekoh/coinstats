import { connect } from 'react-redux'
import CoinStats from '../components/CoinStats'
import { fetchedCoins, fetchingCoins, prevArrowClick, nextArrowClick } from '../actions/coinstats'

const fetchCoinsAsync = (start, limit, sort, direc) => {
  return async (dispatch, getState) => {
    let url = '/api/coins/?'
    url += 't=' + encodeURIComponent(start)
    url += '&m=' + encodeURIComponent(limit)
    url += '&d=' + encodeURIComponent(direc)
    url += '&s=' + encodeURIComponent(sort)

    await dispatch(fetchingCoins())

    const data = await (await fetch(url)).json()
    return dispatch(fetchedCoins(data))
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

const mapDispatchToProps = dispatch => {
  return {
    nextArrowClick: () => dispatch(handleNextArrowClickAsync()),
    prevArrowClick: () => dispatch(handlePrevArrowClickAsync()),
    fetchCoins: (...params) => dispatch(fetchCoinsAsync(...params)),
    fetchedCoins: coins => dispatch(fetchedCoins(coins))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats)
