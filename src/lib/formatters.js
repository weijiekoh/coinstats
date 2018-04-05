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

const formatPriceNoRound = value => {
  if (value == null || isNaN(value)) {
    return 'n/a'
  }
  return parseFloat(value).toLocaleString()
}

const formatPrice = (value, roundDigits = 2, btc = false) => {
  if (value == null || isNaN(value)) {
    return 'n/a'
  }
  const price = parseFloat(value)

  if (btc && price < 0.00001) {
    return '< 0.00001'
  }

  if (!btc && price < 0.01) {
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

export { formatPrice, formatPriceNoRound, formatMcap, formatVol, formatPercentChange, formatSupply }
