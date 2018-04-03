// The order of this array matters!
const sortParams = [
  'symbol',             // 0
  'name',               // 1
  'price_usd',          // 2
  'price_btc',          // 3
  'market_cap_usd',     // 4
  'volume_usd_24h',     // 5
  'available_supply',   // 6
  'total_supply',       // 7
  'max_supply',         // 8
  'percent_change_1h',  // 9
  'percent_change_24h', // 10
  'percent_change_7d'   // 11
]

const sortDirections = {
  ASC: 1,
  DESC: 0
}
export { sortParams, sortDirections }
