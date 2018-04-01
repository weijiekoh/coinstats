import React from 'react'
import PropTypes from 'prop-types'

const DenomPicker = props => (
  <div className='denompicker form-group row align-items-center'>
    <div className='col-12 col-sm-4 col-md-12'>
      <label htmlFor='denom'>Change base currency:</label>
    </div>

    <div className='col'>
      <select
        name='denom'
        className='form-control'
        value={props.denom}
        onChange={e => { props.changeDenom(e.target.value) }}>

        {props.allDenoms.map((denom, i) =>
          <option key={i}>
            {denom}
          </option>
        )}

      </select>
    </div>
  </div>
)

DenomPicker.propTypes = {
  denom: PropTypes.string.isRequired,
  changeDenom: PropTypes.func.isRequired
}

export default DenomPicker
