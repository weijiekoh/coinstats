/* global define, it, describe, before */
import 'babel-polyfill'
import 'babel-core/register'

const expect = require('chai').expect
const puppeteer = require('puppeteer')
const request = require('request')

describe('Frontend tests', () => {
  const globalVariables = {
    browser: global.browser,
    expect: global.expect
  }

  const ROOT_URL = 'http://localhost:8080'

  const opts = {
    headless: false,
    //slowMo: 100,
    timeout: 10000
  }

  let page

  before (async () => {
    request(ROOT_URL, (error, response, body) => {
      if (error) {
        console.log('Please run "yarn prod" in a separate terminal before running this test.')
        process.exit(1)
      }
    })
    global.expect = expect
    global.browser = await puppeteer.launch(opts)
    page = await global.browser.newPage()
    await page.goto(ROOT_URL)
  })

  it('content and sidebar divs get rendered', done => {
    (async () => {
      await page.waitFor('.content')
      const contentDiv = await page.$$('.content')
      const sidebarDiv = await page.$$('.sidebar')
      return {contentDiv, sidebarDiv}
    })().then(({contentDiv, sidebarDiv}) => {
      expect(contentDiv.length).is.equal(1)
      expect(sidebarDiv.length).is.equal(1)
      done()
    })
  })

  after (async () => {
    global.browser.close()

    global.browser = globalVariables.browser
    global.expect = globalVariables.expect
  })
})

