const initialState = {
  showMenu: false
}

const sidebar = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return Object.assign({}, state, {
        showMenu: !state.showMenu
      })

    case 'CLOSE_MENU':
      return Object.assign({}, state, {
        showMenu: false
      })

    case 'CHANGE_DENOMINATION':
      return Object.assign({}, state, {
        denomination: action.denomination
      })

    default:
      return state
  }
}

export default sidebar
