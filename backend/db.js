const Sequelize = require('sequelize')

class CoinStatsDb {
  constructor (connStr, isProd) {
    this.sequelize = new Sequelize(connStr, {
      operatorsAliases: false,
      logging: () => !isProd,
      define: {
        underscored: true,
        freezeTableName: true
      }
    })

    this.sequelize.addHook('beforeFind', options => {
      if (!options.attributes) {
        options.attributes = {}
      }
      options.attributes.exclude =
        ['created_at', 'updated_at', 'deleted_at']
    })

    this.setupModels()
  }

  setupModels () {
    // Note: model definitions don't use camelCase to be consistent with the
    // CMC API

    // Note: CMC's API uses '24h_volume_usd' which is invalid as a JS
    // attribute, so we use 'volume_usd_24h' instead.

    // Each Coin is a single, unqiue cryptocurrency or token
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

    // Tracks the price of a coin over time
    this.PriceHistory = this.sequelize.define('priceHistory', {
      timestamp: Sequelize.DATE,
      price_usd: Sequelize.DOUBLE
    })

    this.PriceHistory.belongsTo(this.Coin)

    this.Coin.sync()
    this.PriceHistory.sync()
  }

  updateCoins (coins) {
    // Update or insert all coin data in one transaction
    return this.sequelize.transaction(t => {
      return Promise.all(coins.map(coin => {
        const lastUpdatedDate =
          coin.last_updated ? new Date(coin.last_updated * 1000) : null

        return this.Coin.upsert({
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
        }, { transaction: t })
      })).then(result => {
        this.getCoin('bitcoin').then(console.log)
      }, err => {
        console.error(err)
      })
    })
  }

  getCoin (cmcId) {
    return this.Coin.findOne({
      where: {
        cmc_id: cmcId
      }
    }).then(coin => {
      delete coin.dataValues.id
      return coin.dataValues
    })
  }
}

module.exports = CoinStatsDb
