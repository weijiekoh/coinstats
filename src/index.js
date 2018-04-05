import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './styles/index.css'
// import registerServiceWorker from './registerServiceWorker'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/converter' component={ConverterContainer} />
        <Route path='/:cmcId?' component={CoinStatsContainer} />
      </Switch>
    </BrowserRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('root')
)

//registerServiceWorker()
