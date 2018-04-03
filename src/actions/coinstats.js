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
const fetchedCoins = (data, sort, direc) => {
  return {
    type: 'FETCHED_COINS',
    coins: data.coins,
    totalCoins: data.totalCoins,
    sortDirection: direc,
    sortParam: sort
  }
}

export { fetchingCoins, fetchedCoins, prevArrowClick, nextArrowClick }
