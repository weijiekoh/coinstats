const changeDenomination = denomination => {
  return {
    type: 'CHANGE_DENOMINATION',
    denomination
  }
}

const toggle = () => {
  return {
    type: 'TOGGLE'
  }
}

const closeMenu = () => {
  return {
    type: 'CLOSE_MENU'
  }
}

export { changeDenomination, toggle, closeMenu }
