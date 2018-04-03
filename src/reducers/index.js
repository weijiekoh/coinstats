import { combineReducers } from 'redux'

import sidebar from './sidebar.js'
import coinstats from './coinstats.js'
import converter from './converter.js'

export default combineReducers({ coinstats, sidebar, converter })
