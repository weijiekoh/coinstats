const Sequelize = require('sequelize')

class CoinStatsDb {
  constructor (connStr, isProd) {
    // Set up the database connection
    this.sequelize = new Sequelize(connStr, {
      operatorsAliases: false,
      logging: () => !isProd,
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

  async updateCoins (coins) {
    // Update or insert all coin data in one transaction
    await this.sequelize.transaction(async transaction => {
      await Promise.all(coins.map(async coin => {
        const lastUpdatedDate =
          coin.last_updated ? new Date(coin.last_updated * 1000) : null

        try {
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

          await this.PriceHistory.create({
            cmc_id: coin.id,
            price_usd: coin.price_usd,
            price_btc: coin.price_btc,
            datetime: Date.now()
          }, { transaction })
        } catch (err) {
          console.error(err)
        }
      }))
      console.log('Updated coin data.')
    })
  }

  async getCoin (cmcId) {
    try {
      const coin = await this.Coin.findOne({
        where: { cmc_id: cmcId }
      })
      delete coin.dataValues.id
      return coin.dataValues
    } catch (err) {
      console.error(err)
      throw new UnableFetchCoinException()
    }
  }

  async getPriceHistory (cmcId, earliestTimestamp) {
    let where = {
      where: { cmc_id: cmcId }
    }

    if (typeof earliestTimestamp !== 'undefined') {
      let validTimestamp =
        earliestTimestamp != null &&
        isFinite(earliestTimestamp) &&
        earliestTimestamp >= 0

      let datetime = new Date(earliestTimestamp * 1000)
      validTimestamp &= datetime.toString() !== 'Invalid Date'

      if (validTimestamp) {
        where.where.datetime = {
          [Sequelize.Op.gte]: datetime
        }
      } else {
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
      return this.PriceHistory.findAll(where).then(priceHistory => {
        return priceHistory.map(ph => {
          delete ph.dataValues.id
          delete ph.dataValues.id
          return ph.dataValues
        })
      })
    } catch (err) {
      console.error(err)
      throw new UnableFetchCoinException()
    }
  }
}

function InvalidTimestampException (message) {
  this.message = message || 'Invalid timestamp'
  this.name = 'InvalidTimestampException'
}

function UnableFetchCoinException (message) {
  this.message = message || 'Error fetching coin data'
  this.name = 'UnableFetchCoinException'
}

module.exports = CoinStatsDb