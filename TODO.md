- User can select to see real-time price changes in charts
     - use recharts

- singlecoin url (not necessary)

# Project Description
(d) Create a app to display cryptocurrencies market stats using Bootstrap 4 and ReactJS
(d) Use Flux or Redux architecture depending on whichever you are comfortable with
(d) Use https://coinmarketcap.com/api/ APIs to fetch market prices

(d) User can see list of cryptocurrencies with sorting and filtering based on various parameters
(d) Currency conversion calculator
(d) App functionality should be exposed as Node.js APIs 
(d) User should be able to select favorite cryptocurrencies and these should be displayed in front always
(d) - Price of the cryptocurrencies should be displayed in real-time

Price of the cryptocurrencies should be displayed in real-time
User can select to see real-time price changes in charts

# Acceptance criteria
(d) Frontend should be responsive
(d) Must be a SPA
Implements all the above features

# Bonus
Uses WebSockets or Socket.IO for APIs
Uses Recharts, FusionCharts or ReactD3
End-to-End test cases
(d) Utilizes HMTL5 storage for storing users favorites
(d) Uses ES6 features

# Plan

Server to poll the CMC API every 5 minutes
    - https://api.coinmarketcap.com/v1/ticker/?limit=0 returns all results
Store the data in a DB managed by Sequelize
    - if NODE_ENV === 'production' and DATABASE_URL exists, connect to DATABASE_URL
    - otherwise, use SQLite

Filters:
    - Coins traded during the last 24 hours
        - Coins with positive 24h volume
    - Coins by price range (default = more than 0.001 USD)

API:
    - All timestamps will be in UNIX time, UTC
    - All prices will be in USD

    - api/coins/
        - :start
        - :limit
        - Returns: { id, name, symbol, price_usd, volume_24h, market_cap,
                     percent_change_24h }

    - api/coin/
        - :id (ID of the coin, based on what CMC provides)
        - Returns: { id, name, symbol, price_usd, volume_24h, market_cap,
          percent_change_24h, total_supply, available_supply, oldest price timestamp}

    - api/coin/prices
        - :id (ID of the coin, based on what CMC provides)
        - :minutes (maximum time window)
        - Returns { prices: [{ price: X, timestamp: Y}, ...] }

# Assumptions:

    - The base currency is USD. To support other base currencies is possible
      with what the CoinMarketCap API provides, but this app doesn't implement
      it as it wasn't specified in the proejct description.
