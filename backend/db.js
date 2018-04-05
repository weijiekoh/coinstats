const Sequelize = require('sequelize')

class CoinStatsDb {
  constructor (connStr, isProd, debug = false) {
    // Set up the database connection
    this.sequelize = new Sequelize(connStr, {
      operatorsAliases: false,
      logging: false,
      define: {
        underscored: true,
        freezeTableName: true
      }
    })

    // Do not return these attributes during queries
    this.sequelize.addHook('beforeFind', options => {
      if (!options.attributes) {
        options.attributes = {}
      }
      options.attributes.exclude =
        ['created_at', 'updated_at', 'deleted_at']
    })

    // Create and sync models
    this.setupModels()
  }

  setupModels () {
    // Each Coin is a single, unqiue cryptocurrency or token
    // Note: these model definitions don't use camelCase to be consistent with
    // the CMC API, and CMC's API uses '24h_volume_usd' which is invalid as a
    // JS attribute, so we use 'volume_usd_24h' instead.

    this.Coin = this.sequelize.define('coin', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cmc_id: {
        type: Sequelize.STRING,
        unique: true
      },
      cmc_rank: Sequelize.INTEGER,
      symbol: Sequelize.STRING,
      name: Sequelize.STRING,
      price_usd: Sequelize.DOUBLE,
      price_btc: Sequelize.DOUBLE,
      market_cap_usd: Sequelize.DOUBLE,
      volume_usd_24h: Sequelize.DOUBLE,
      available_supply: Sequelize.DOUBLE,
      total_supply: Sequelize.DOUBLE,
      max_supply: Sequelize.DOUBLE,
      percent_change_1h: Sequelize.DOUBLE,
      percent_change_24h: Sequelize.DOUBLE,
      percent_change_7d: Sequelize.DOUBLE,
      last_updated: Sequelize.DATE
    })

    this.Coin.sync()

    // Tracks the price of a coin over time
    this.PriceHistory = this.sequelize.define('priceHistory', {
      cmc_id: {
        type: Sequelize.STRING,
        references: {
          model: this.Coin,
          key: 'cmc_id'
        }
      },
      datetime: Sequelize.DATE,
      price_usd: Sequelize.DOUBLE,
      price_btc: Sequelize.DOUBLE
    })

    this.PriceHistory.sync()
  }

  async getCurrencyData () {
    // Return a list of each coin and their USD price
    return this.Coin.findAll({
      attributes: ['name', 'symbol', 'price_usd'],
      where: {
        price_usd: {
          [Sequelize.Op.gte]: 0
        }
      },
      order: [['name', 'ASC']]
    }).catch(err => {
      console.error(err, 'Could not get price  data')
      throw new UnableToFetchCurrencyException()
    })
  }

  async updateCoins (coins) {
    // Update or insert all coin data in one transaction
    await this.sequelize.transaction(async transaction => {
      // For each coin:
      await Promise.all(coins.map(async coin => {
        const lastUpdatedDate =
          coin.last_updated ? new Date(coin.last_updated * 1000) : null

        try {
          // Insert the coin
          await this.Coin.upsert({
            cmc_id: coin.id,
            cmc_rank: coin.rank,
            name: coin.name,
            symbol: coin.symbol,
            price_usd: coin.price_usd,
            price_btc: coin.price_btc,
            volume_usd_24h: coin['24h_volume_usd'],
            market_cap_usd: coin.market_cap_usd,
            available_supply: coin.available_supply,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            percent_change_1h: coin.percent_change_1h,
            percent_change_24h: coin.percent_change_24h,
            percent_change_7d: coin.percent_change_7d,
            last_updated: lastUpdatedDate
          }, { transaction })

          // Update price history
          await this.PriceHistory.create({
            cmc_id: coin.id,
            price_usd: coin.price_usd,
            price_btc: coin.price_btc,
            datetime: Date.now()
          }, { transaction })
        } catch (err) {
          console.error(err, 'Could not add to price history')
        }
      }))
      console.log('Updated coin data.')
    })
  }

  async deleteOldPrices () {
    // Delete all entries in PriceHistory which are older than a day
    try {
      const oneDayAgo = new Date() - (1000 * 86400)
      const d = await this.PriceHistory.destroy({
        where: {
          datetime: {
            [Sequelize.Op.lt]: oneDayAgo
          }
        },
        force: true
      })
      console.log('Deleted old price history data:', d, 'rows')
    } catch (err) {
      console.error(err, 'Could not delete old price data')
    }
  }

  async getCoinsByCmcIds (ids) {
    // @ids is a list of coin IDs as per the CMC API
    // Returns a list of coin data (sans native ID)
    try {
      const coins = await this.Coin.findAll({
        where: {
          cmc_id: {
            [Sequelize.Op.in]: ids
          }
        }
      })

      return coins.map(coin => {
        delete coin.dataValues.id
        return coin.dataValues
      })
    } catch (err) {
      console.log(err, 'Could not get coin data given these CMC IDs:', ids)
      throw new UnableFetchCoinsException()
    }
  }

  async getCoin (cmcId) {
    // Returns data for one coin (sans native ID)
    try {
      const coin = await this.Coin.findOne({
        where: { cmc_id: cmcId }
      })

      // This doesn't work in spite of what the docs say, so delete each id
      // field manually
      // this.Coin.findAll({
      //   attributes: { exclude: ['id'] }
      // });
      delete coin.dataValues.id
      return coin.dataValues
    } catch (err) {
      console.error('Could not get coin data:', err)
      throw new UnableFetchCoinException()
    }
  }

  async getCoins (start, limit, sortParam, direction, minPriceUsd, minVolUsd) {
    // @start: the start from this row 
    // @limit: max number of items to return
    // @limit: sortParam: index of sortParams, which is the field to sort on
    // @direction: sort direction: ASC or DESC
    // @minPriceUsd: minimum price_usd
    // @minVolUsd: minimum volume_usd_24h
    try {
      let where = {}
      where[sortParam] = {
        [Sequelize.Op.ne]: null
      }

      if (minPriceUsd != null) {
        where.price_usd = { [Sequelize.Op.gte]: minPriceUsd }
      }

      if (minVolUsd != null) {
        where.volume_usd_24h = { [Sequelize.Op.gte]: minVolUsd }
      }

      const coins = await this.Coin.findAndCountAll({
        offset: start,
        limit: limit,
        order: [
          [sortParam, direction]
        ],
        where
      })

      const c = coins.rows.map(c => {
        delete c.dataValues.id
        return c.dataValues
      })

      return { coins: c, totalCoins: coins.count }
    } catch (err) {
      console.error(err, 'Could not get list of coins')
      throw new UnableFetchCoinsException()
    }
  }

  async getPriceHistory (cmcId, earliestTimestamp) {
    // Get a list of price_usd and timestamps for the given coin
    let where = {
      cmc_id: cmcId
    }

    if (typeof earliestTimestamp !== 'undefined') {
      try {
        let datetime = new Date(earliestTimestamp * 1000)
        where.datetime = {
          [Sequelize.Op.gte]: datetime
        }
      } catch (err) {
        console.error('Invalid timestamp provided')
        throw new InvalidTimestampException()
      }
    }

    const coinExists = await this.Coin.findOne({
      where: { cmc_id: cmcId }
    }) != null

    if (!coinExists) {
      throw new UnableFetchCoinException()
    }

    try {
      return this.PriceHistory.findAll({
        where: where,
        order: [['datetime', 'ASC']]
      }).then(priceHistory => {
        return priceHistory.map(ph => {
          delete ph.dataValues.id
          delete ph.dataValues.id
          return ph.dataValues
        })
      })
    } catch (err) {
      console.error(err, 'Could not fetch price history')
      throw new UnableFetchCoinException()
    }
  }
}

function InvalidTimestampException (message) {
  this.message = message || 'Invalid timestamp'
  this.name = 'InvalidTimestampException'
}

function UnableFetchCoinException (message) {
  this.message = message || 'Error fetching data for this coin'
  this.name = 'UnableFetchCoinException'
}

function UnableFetchCoinsException (message) {
  this.message = message || 'Error fetching coin data'
  this.name = 'UnableFetchCoinsException'
}

function UnableToFetchCurrencyException (message) {
  this.message = message || 'Error counting coins'
  this.name = 'UnableToCountCoinsException'
}

module.exports = CoinStatsDb
