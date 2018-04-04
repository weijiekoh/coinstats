import React, { Component } from 'react'
import SidebarContainer from '../containers/SidebarContainer'

class LayoutParent extends Component {
  renderLayout (component, showCoin) {
    return (
      <div className="ibm ibm-type-c container-fluid">
        <SidebarContainer showCoin={showCoin} />

        <div className="content">
          { component }
        </div>
      </div>
    )
  }
}

export default LayoutParent
