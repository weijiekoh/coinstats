import React from 'react'

const AutorefreshToggle = 
  (isAutorefreshing, toggleAutorefresh, shouldAutorefresh, callRefresh) => {
  return (
    <div className='autorefresh'>
      <label htmlFor='autorefresh'>
        <input
          onChange={() => {
            if (!shouldAutorefresh) {
              callRefresh()
            }
            toggleAutorefresh()
          }}
          id='autorefresh' type='checkbox'
          checked={shouldAutorefresh}
          value={shouldAutorefresh} />
        {isAutorefreshing ?
          <span>Refreshing...</span>
          :
          <span>Autorefresh?</span>
        }
      </label>
    </div>
  )
}

export default AutorefreshToggle
