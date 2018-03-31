import { connect } from 'react-redux'
import Hello from '../components/Hello'
import { sayHello, fetchedGreeting, fetchingGreeting } from '../actions'


const fetchGreetingAsync = () => {
  return async (dispatch, getState) => {
    dispatch(fetchingGreeting())
    const greeting = await (await fetch('/api/hello')).text()
    return dispatch(fetchedGreeting(greeting))
  }
}

const mapStateToProps = state => {
  return state.hello
}

const mapDispatchToProps = dispatch => {
  return {
    sayHello: () => dispatch(sayHello()),
    fetchGreeting: () => dispatch(fetchGreetingAsync()),
    fetchedGreeting: greeting => dispatch(fetchedGreeting(greeting))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hello)
