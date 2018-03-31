import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import HelloContainer from '../containers/HelloContainer'

export default class App extends Component {
  render () {
    return (
      <div className="ibm ibm-type-c container-fluid">
        <Switch>
          <Route path='/' component={HelloContainer} />
        </Switch>
      </div>
    )
  }
}
