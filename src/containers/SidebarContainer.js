import { connect } from 'react-redux'
import { toggle, closeMenu } from '../actions/sidebar'
import { withRouter } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  const result = Object.assign({}, state.sidebar, {
    faves: state.coinstats.faves
  })
  return result
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar))
