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

const formatPrice = (value, roundDigits = 2) => {
  if (value == null || isNaN(value)) {
    return 'n/a'
  }
  const price = parseFloat(value)

  if (price < 0.01) {
    return '< 0.01'
  }

  const result = roundTo(price, roundDigits)
  return result
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

const formatSupply = value => {
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

export { formatPrice, formatMcap, formatVol, formatPercentChange, formatSupply }
