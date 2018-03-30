const hello = (prevState = {}, action) => {
  switch (action.type) {
    case 'SAY_HELLO':
      return {
        greeting: action.greeting
      }
    default:
      return prevState
  }
}

export default hello
