import { connect } from 'react-redux'
import { changeDenomination, toggle, closeMenu } from '../actions/sidebar'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  return state.sidebar
}

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps')
  window.onkeydown = e => {
    if (e.keyCode === 27) {
      dispatch(closeMenu())
    }
  }

  return {
    changeDenomination: () => dispatch(changeDenomination()),
    toggle: () => dispatch(toggle()),
    closeMenu: () => dispatch(closeMenu())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
