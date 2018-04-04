import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './styles/index.css'
//import registerServiceWorker from './registerServiceWorker'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import SidebarContainer from './containers/SidebarContainer'
import CoinStatsContainer from './containers/CoinStatsContainer'
import ConverterContainer from './containers/ConverterContainer'

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

          {/*<Route path='/' component={SidebarContainer} />*/}
          <SidebarContainer />

          <div className='content'>
            <Switch>
              <Route exact path='/converter' component={ConverterContainer} />
              <Route exact path='/' component={CoinStatsContainer} />
            </Switch>
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
