const initialState = {
  isFetching: false
}
const hello = (state = initialState, action) => {
  switch (action.type) {
    case 'SAY_HELLO':
      return Object.assign({}, state, {
        greeting: action.greeting
      })

    case 'FETCHING_GREETING':
      return Object.assign({}, state, {
        isFetching: true,
        greeting: null
      })

    case 'FETCHED_GREETING':
      return Object.assign({}, state, {
        isFetching: false,
        greeting: action.greeting
      })

    default:
      return state
  }
}

export default hello
