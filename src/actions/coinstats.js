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
  volFilterClick
}
