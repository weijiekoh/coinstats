import { connect } from 'react-redux'
import { toggle, closeMenu } from '../actions/sidebar'
import { changeDenom } from '../actions/denomPicker'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.sidebar,
    denomPicker: state.denomPicker
  }
}

const mapDispatchToProps = dispatch => {
  window.onkeydown = e => {
    if (e.keyCode === 27) {
      dispatch(closeMenu())
    }
  }

  return {
    toggle: () => dispatch(toggle()),
    closeMenu: () => dispatch(closeMenu()),
    changeDenom: denom => dispatch(changeDenom(denom))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
