const roundTo = require('round-to')

const unitize = require('unitize')

const millify = value => {
  // Converts a large number to its thousand / million / billion / trillion
  // units. e.g. 79.91M

  const increments = [1000, 1000, 1000, 1000]
  const units = ['', 'K', 'M', 'B', 'T']
  const result = unitize(value, increments, units).toString(false)
  return result
}

const formatPrice = value => {
  if (value == null) {
    return 'n/a'
  }
  return roundTo(parseFloat(value), 2)
}

const formatVol = value => {
  if (value == null) {
    return 'n/a'
  }
  return millify(Math.round(parseFloat(value)))
}

const formatMcap = value => {
  if (value == null) {
    return 'n/a'
  }
  return millify(parseFloat(value, 3))
}

const formatPercentChange = value => {
  if (value == null) {
    return 'n/a'
  }
  return roundTo(parseFloat(value), 1).toString() + '%'
}

export { formatPrice, formatMcap, formatVol, formatPercentChange }
