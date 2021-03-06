CoinStats displays cryptocurrency market statistics fetched from the
[CoinMarketCap API](https://coinmarketcap.com/api/) via a responsive and
mobile-friendly single-page app.

Use it here: https://coinstatswj.herokuapp.com

It also includes a simple cryptocurrency converter which allows you to calculate
the value of any amount of a particular cryptocurrency in the denomination of
another. 

# Technology stack

On the backend, it runs an Express server on Node which periodically fetches
cryptocurrency market data and stores it in a database managed by the Sequelize
ORM. 

The frontend runs a single-page app powered by React, and `react-redux`. Styles
are made possible with the help of a Bootstrap 4 implementation of the [IBM
Carbon Design](http://carbondesignsystem.com/). Price charts use the
[Recharts](http://recharts.org/) library.

# Development

Download the source code and install dependencies via:

```bash
git clone https://github.com/weijiekoh/coinstats.git && \
cd coinstats && \
yarn install
```

An ideal development environment requires two terminals. You may choose to use
`tmux` or `screen` with split panes for your convenience.

1. In the first terminal, run `yarn start`.
    - This launches a `create-react-app` server on http://localhost:3000/.
      Launch this to access the frontend. Changes made to the code will trigger
      a recompile and hot reload.
2. In the second terminal, run `yarn dev`.
    - This launches the backend server in development mode. By default, it
      will run an Sqlite3 database (`./db.sqlite3`)
    - No configuration is needed. To change the default settings (see the
      Environment Variables section below), preface `yarn dev` with the
      environment variable name and value. For instance, to connect to a
      different database, run:

```
DATABASE_URL=<your database connection string> yarn dev
```

# Tests

To run `mocha` tests for the backend and frontend, first run this in a separate terminal:

```bash
yarn prod
```

Then run this to test both the frontend and backend:

```bash
yarn test
```

To test the frontend or backend separately, run `yarn test-frontend` or `yarn
test-backend` respectively.

# Building the app

Assuming that you have NodeJS, the [`yarn`](https://yarnpkg.com) package
manager, and you are using Ubuntu Linux 17.10, run the following commands to
build CoinStats:

```bash
git clone https://github.com/weijiekoh/coinstats.git && \
cd coinstats &&
yarn install &&
yarn build
```

If you prever to use `npm`, run this instead:

```bash
git clone https://github.com/weijiekoh/coinstats.git && \
cd coinstats &&
npm install &&
npm run build
```

To run CoinStats on your local machine, run:

```bash
yarn run-prod
```

(or `npm run run-prod`)

You may now access CoinStats via http://localhost:8080/ in your web browser.

# Deployment to Heroku

This app has been tested on a [Heroku](https://www.heroku.com) dyno running
NodeJS v8 and PostgreSQL 9.6.8 (via the
[`heroku-postgresql`](https://elements.heroku.com/addons/heroku-postgresql)
add-on).

Your production system must have the following environment
variables set up:

## Environment variables
| Environment variable | Recommended value for production | Default |
|---|---|---|
| `DATABASE_URL` | (your DB connection string) | `sqlite:/path/to/coinstats/db.sqlite3` |
| `PORT` | `80` | `8080` |
| `NODE_ENV` | `production` | |
| `PRICE_HISTORY_RANGE_SECS` | `3600` | `3600` |
| `CMC_MAX_COINS` | `100` | `100` |


Run the following commands to create a Heroku instance and deploy this app:

```bash
heroku create && \
heroku config:set PORT=80 NODE_ENV=production
```

Provision the Postgres add-on. Note that the following will incur a monthly
cost, but is necessary if you accept the default `PRICE_HISTORY_RANGE_SECS` and
`CMC_MAX_COINS` `configuration variables (see the Limitations section for more
information).

```bash
heroku addons:create heroku-postgresql:hobby-basic
```

To deploy the app, run:

```bash
./build_and_deploy.sh 'Deploy to Heroku'
```

Delete the dyno when you're done, to minimise costs:

```bash
heroku apps:destroy
```

# Limitations

- The CoinMarketCap API updates every 5 minutes. As such, the data shown on
  CoinStats will be at most 5 minutes old.
- At the time of writing, the CoinMarketCap API provides data for about 1500
  cryptocurrencies. If the backend were to download and store data for every
  cryptocurrency every 5 minutes, the database would grow at a maximum rate of
  more than 1,080,000 rows per hour.
- For demonstration purposes, the following strategy helps to rein in this
  growth rate:
    - By default, price data older than 1 hour will be regularly pruned from the
      database, so all price charts are limited to 1 hour's worth of data.
    - By default, only the top 100 coins (ranked by CoinMarketCap) will be fetched
      from the API.
- To change the data growth rate, you can modify these environment variables:
    - `PRICE_HISTORY_RANGE_SECS`: the maximum age of price history data, in seconds
    - `CMC_MAX_COINS`: only fetch the X highest ranked cryptocurrencies from
      CoinMarketCap. A value of 0 will make the backend fetch *all*
      cryptocurrencies; use it with caution.
