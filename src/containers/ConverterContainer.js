import { connect } from 'react-redux'
import Converter from '../components/Converter'

const mapStateToProps = (state, ownProps) => {
  return state.converter
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Converter)
