import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  formatPrice
} from '../lib/formatters'

import menuSvg from './icons/menu.js'
import closeSvg from './icons/close.js'

// The sidebar is a an actual sidebar on medium screens and larger, but acts as
// a hamburger menu on small screens and smaller

const renderFaves = (props) => {
  let result = []
  props.faves.forEach((f, i) => {
    result.push(
      <div key={i} className='fave'>
        <span className='name'>
          {f.symbol}
        </span> ${formatPrice(f.price_usd)}
      </div>
    )
  })
  return result
}

class Sidebar extends Component {
  render () {
    const props = this.props
    return (
      <div>
        { props.showMenu && <div className='overlay' onClick={props.closeMenu} /> }

        <div className= {props.showMenu ? 'sidebar show' : 'sidebar'}>
          <div>
            <div className='menu-header'>
              <div className={props.showMenu ? 'menu-icon close' : 'menu-icon'}
                onClick={props.toggle} >
                { props.showMenu ? closeSvg : menuSvg }
              </div>

              <a onClick={(e) => {
                e.preventDefault()
                props.history.push('/')
              }}>
                <div className='logo'>
                  <img alt='CoinStats' src='../images/logo.png' />
                </div>
              </a>
            </div>

            <div className='sidebar-content'>
              <div className='sidebar-section'>
                <Link to='/' onClick={props.closeMenu}>
                  Market Stats
                </Link>
              </div>

              <div className='sidebar-section'>
                <Link to='/converter' onClick={props.closeMenu}>
                  Currency Converter
                </Link>
              </div>

              <div className='sidebar-title'>
                <p className='title'>Your favourites:</p>
              </div>

              <div className='faves'>
                {renderFaves(props)}
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  faves: PropTypes.object.isRequired
}

export default Sidebar
