import { combineReducers } from 'redux'

import sidebar from './sidebar.js'
import coinstats from './coinstats.js'
import denomPicker from './denomPicker.js'
import converter from './converter.js'

export default combineReducers({ coinstats, sidebar, denomPicker, converter })
