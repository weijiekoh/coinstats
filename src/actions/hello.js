const sayHello = () => {
  return {
    type: 'SAY_HELLO',
    greeting: 'hello',
  }
}

const fetchedGreeting = greeting => {
  return {
    type: 'FETCHED_GREETING',
    greeting
  }
}

const fetchingGreeting = () => {
  return {
    type: 'FETCHING_GREETING'
  }
}

export { sayHello, fetchedGreeting, fetchingGreeting }
