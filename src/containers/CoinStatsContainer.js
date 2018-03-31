import { connect } from 'react-redux'
import CoinStats from '../components/CoinStats'

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats)
