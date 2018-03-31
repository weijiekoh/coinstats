import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './styles/index.css'
//import registerServiceWorker from './registerServiceWorker'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import SidebarContainer from './containers/SidebarContainer'
import CoinStatsContainer from './containers/CoinStatsContainer'

import reducer from './reducers'

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
)

const Root = ({ store }) => (
  <div className="ibm ibm-type-c container-fluid">
    <Provider store={store}>
      <BrowserRouter>
        <div className="root-flex">

          <Route path='/' component={SidebarContainer} />

          <div className='content'>
            <Route path='/' component={CoinStatsContainer} />
          </div>

        </div>
      </BrowserRouter>
    </Provider>
  </div>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('root')
)

//registerServiceWorker()
