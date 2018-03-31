import { combineReducers } from 'redux'

import sidebar from './sidebar.js'
import coinstats from './coinstats.js'

export default combineReducers({ coinstats, sidebar })
