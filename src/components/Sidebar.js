import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import menuSvg from './icons/menu.js'
import closeSvg from './icons/close.js'

// The sidebar is a an actual sidebar on medium screens and larger, but acts as
// a hamburger menu on small screens and smaller

const Sidebar = props => (
  <div>
    { props.showMenu &&
      <div className='overlay' onClick={props.closeMenu} />
    }

    <div className= {props.showMenu ? 'sidebar show' : 'sidebar'}>
      <div>
        <div className='menu-header'>
          <div className={props.showMenu ? 'menu-icon close' : 'menu-icon'}
            onClick={props.toggle} >
            { props.showMenu ? closeSvg : menuSvg }
          </div>

          <div className='logo'>
            <Link to='/' onClick={props.closeMenu}>
              <img alt='CoinStats' src='../images/logo.png' />
            </Link>
          </div>
        </div>

        <div className='sidebar-content'>
          <div className='sidebar-section'>
            <Link to='/' onClick={props.closeMenu}>
              Home
            </Link>
          </div>

          <div className='sidebar-section'>
            <Link to='/converter' onClick={props.closeMenu}>
              Currency Converter
            </Link>
          </div>

          <div className='sidebar-section'>
          </div>

        </div>
      </div>
    </div>
  </div>
)

Sidebar.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

export default Sidebar
