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

export { toggle, closeMenu }
