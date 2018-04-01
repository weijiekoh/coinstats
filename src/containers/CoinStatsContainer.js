import { connect } from 'react-redux'
import CoinStats from '../components/CoinStats'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state, {
    denom: state.denomPicker.denom
  })
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinStats)
