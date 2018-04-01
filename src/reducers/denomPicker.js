import { allDenoms, defaultDenom } from '../api/denoms.js'

const initialState = {
  denom: defaultDenom,
  allDenoms
}

const denomPicker = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_DENOM':
      return Object.assign({}, state, {
        allDenoms: state.allDenoms,
        denom: action.denom
      })

    default:
      return state
  }
}

export default denomPicker
