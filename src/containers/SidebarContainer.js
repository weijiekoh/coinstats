import { connect } from 'react-redux'
import { toggle, closeMenu } from '../actions/sidebar'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  const result = Object.assign({}, state.sidebar, {
    faves: state.coinstats.faves
  })
  return result
}

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => dispatch(toggle()),
    closeMenu: () => dispatch(closeMenu())
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar))
