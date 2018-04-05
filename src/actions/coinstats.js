const chartPollFailed = () => {
  return {
    type: 'CHART_POLL_FAILED'
  }
}

const tablePollFailed = () => {
  return {
    type: 'TABLE_POLL_FAILED'
  }
}

const updatePriceHistory = priceHistory => {
  return {
    type: 'UPDATE_PRICE_HISTORY',
    priceHistory
  }
}
const chartAutorefreshed = () => {
  return {
    type: 'CHART_AUTOREFRESHED'
  }
}

const chartAutorefreshing = () => {
  return {
    type: 'CHART_AUTOREFRESHING'
  }
}

const toggleChartAutorefresh = () => {
  return {
    type: 'TOGGLE_CHART_AUTOREFRESH'
  }
}

const autorefreshing = () => {
  return {
    type: 'AUTOREFRESHING'
  }
}

const autorefreshed = () => {
  return {
    type: 'AUTOREFRESHED'
  }
}

const toggleAutorefresh = () => {
  return {
    type: 'TOGGLE_AUTOREFRESH'
  }
}

const setFaves = faves => {
  return {
    type: 'SET_FAVES',
    faves
  }
}

const toggleFave = coin => {
  return {
    type: 'TOGGLE_FAVE',
    coin
  }
}

const hideCoinInfo = () => {
  return {
    type: 'HIDE_COIN_INFO'
  }
}

const showCoinInfo = coin => {
  return {
    type: 'SHOW_COIN_INFO',
    coin
  }
}

const resetPagination = () => {
  return {
    type: 'RESET_PAGINATION'
  }
}

const priceFilterClick = () => {
  return {
    type: 'PRICE_FILTER_CLICK'
  }
}

const volFilterClick = () => {
  return {
    type: 'VOL_FILTER_CLICK'
  }
}

const openFilterClick = () => {
  return {
    type: 'OPEN_FILTER_CLICK'
  }
}

const closeFilterClick = () => {
  return {
    type: 'CLOSE_FILTER_CLICK'
  }
}

const prevArrowClick = () => {
  return {
    type: 'PREV_ARROW_CLICK'
  }
}

const nextArrowClick = () => {
  return {
    type: 'NEXT_ARROW_CLICK'
  }
}

const fetchingCoins = () => {
  return {
    type: 'FETCHING_COINS'
  }
}
const fetchedCoins = (data, sort, direc, minPrice, minVol) => {
  return {
    type: 'FETCHED_COINS',
    coins: data.coins,
    totalCoins: data.totalCoins,
    sortDirection: direc,
    sortParam: sort,
    minPrice,
    minVol
  }
}

export {
  openFilterClick,
  closeFilterClick,
  fetchingCoins,
  fetchedCoins,
  prevArrowClick,
  nextArrowClick,
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
  chartAutorefreshed,
  chartAutorefreshing,
  toggleChartAutorefresh,
  updatePriceHistory,
  chartPollFailed,
  tablePollFailed
}
