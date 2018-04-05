# CoinStats

CoinStats displays cryptocurrency market statistics.

## Building the app

Assuming that you have the [`yarn`](https://yarnpkg.com) package manager installed, and you are
using Ubuntu Linux 17.10, run the following commands to build CoinStats:

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

## Deployment to Heroku

This app has been tested on a [Heroku](https://www.heroku.com) dyno running
NodeJS v8 and PostgreSQL 9.6.8 (via the
[`heroku-postgresql`](https://elements.heroku.com/addons/heroku-postgresql)
add-on).

Your production system must have the following environment
variables set up:

| Environment variable | Value |
|---|---|
| `DATABASE_URL` | `postgres://username:password@host:port/database` |
| `PORT` | `80` |
| `NODE_ENV` | `production` |
