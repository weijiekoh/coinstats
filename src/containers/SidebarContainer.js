import { connect } from 'react-redux'
import { toggle, closeMenu } from '../actions/sidebar'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state.sidebar, {
    faves: state.coinstats.faves
  })
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
