import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import HelloContainer from '../containers/HelloContainer'

export default class App extends Component {
  render () {
    return (
      <Switch>
        <Route path='/' component={HelloContainer} />
      </Switch>
    )
  }
}
