import { connect } from 'react-redux'
import Hello from '../components/Hello'
import { sayHello } from '../actions'

const mapStateToProps = state => {
  return state.hello
}

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(sayHello())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hello)
