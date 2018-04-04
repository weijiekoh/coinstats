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

class Sidebar extends Component {
  componentDidMount () {
    window.onkeydown = e => {
      if (e.keyCode === 27) {
        this.props.closeMenu()
      }
    }
  }

  render () {
    const props = this.props
    return (
      <div>
        { props.showMenu && <div className='overlay' onClick={props.closeMenu} /> }
        <div className='sidebar'>
          <div className={props.showMenu ? 'menu-header show' : 'menu-header hide'}>

            <div className={props.showMenu ? 'menu-icon close' : 'menu-icon'}
              onClick={props.toggle} >
              { props.showMenu ? closeSvg : menuSvg }
            </div>

            <Link to='/' onClick={() => {
              if (this.props.onLogoClick){
                this.props.onLogoClick()
              }
              props.closeMenu()
            }}>
            <div className='logo'>
              <img alt='CoinStats' src='../images/logo.png' />
            </div>
          </Link>

          <div className='sidebar-content'>
            <div className='sidebar-section'>
              <Link to='/converter' onClick={props.closeMenu}>
                Currency Converter
              </Link>
            </div>

            <div className='sidebar-title'>
              <p className='title'>Your favourites:</p>
            </div>

            <div className='faves'>
              {props.faves && Array.from(props.faves).map((f, i) => (
                <div key={i} className='fave'>
                  <span className='name'>
                    {f[1].symbol}
                  </span> ${formatPrice(f[1].price_usd)}
                </div>
              ))}
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
