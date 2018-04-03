import React from 'react'

const arrowLeft =
  <svg width='16' height='14' viewBox='0 0 16 14' fillRule='evenodd'>
    <path d='M3.4 8H16V6H3.3l5-4.7L7 0 0 7l7 7 1.3-1.3z' />
  </svg>

const arrowRight =
  <svg width='16' height='14' viewBox='0 0 16 14' fillRule='evenodd'>
    <path d='M12.6 6H0v2h12.7l-5 4.7L9 14l7-7-7-7-1.3 1.3z' />
  </svg>

const caretDown = (
  <svg width='10' height='5' viewBox='0 0 10 5' fillRule='evenodd'>
    <path d='M10 0L5 5 0 0z' />
  </svg>
)

const caretUp = (
  <svg width='10' height='5' viewBox='0 0 10 5' fillRule='evenodd'>
    <path d='M10 5L5 0 0 5z' />
  </svg>
)

export { arrowLeft, arrowRight, caretDown, caretUp }
