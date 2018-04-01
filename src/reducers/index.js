import { combineReducers } from 'redux'

import sidebar from './sidebar.js'
import coinstats from './coinstats.js'
import denomPicker from './denomPicker.js'

export default combineReducers({ coinstats, sidebar, denomPicker })
