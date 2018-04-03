import { connect } from 'react-redux'
import { toggle, closeMenu } from '../actions/sidebar'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  return state.sidebar
}

const mapDispatchToProps = dispatch => {
  window.onkeydown = e => {
    if (e.keyCode === 27) {
      dispatch(closeMenu())
    }
  }

  return {
    toggle: () => dispatch(toggle()),
    closeMenu: () => dispatch(closeMenu())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
