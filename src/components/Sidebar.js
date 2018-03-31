import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import menuSvg from './icons/menu.js'
import closeSvg from './icons/close.js'


// The sidebar is a an actual sidebar on medium screens and larger, but acts as
// a hamburger menu on small screens and smaller

const Sidebar = props => {
  return (
    <div>
      { props.showMenu && <div className='overlay' /> }
      <div className= {props.showMenu ? 'sidebar show' : 'sidebar'}>
        <div>
          <div className='menu-header'>
            <div className='menu-icon' onClick={props.toggle} >
              { props.showMenu ? closeSvg : menuSvg }
            </div>

            <span className='logo'>
              <Link to='/'>
                CoinStats
              </Link>
            </span>
          </div>

          <div className='sidebar-content'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  showMenu: PropTypes.bool.isRequired
}

export default Sidebar
