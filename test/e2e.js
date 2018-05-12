const puppeteer = require('puppeteer')
const Bundler = require('parcel-bundler')
const bundler = new Bundler('test/index.html')
;(async () => {
  const server = await bundler.serve(4051)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const exit = async code => {
    bundler.stop()
    await browser.close()
    process.exit(code)
  }
  await page.goto('http://localhost:4051/?someQuery=1')

  // Get the "viewport" of the page, as reported by the page.
  const tests = await page.evaluate(() => {
    const initial = window.mobxLocation.query.someQuery === '1'

    history.pushState(null, null, '?someQuery=2')

    return [initial, window.mobxLocation.query.someQuery === '2']
  })
  await Promise.all(
    tests.map(async (testResult, index) => {
      if (!testResult) {
        console.error(`a test ${index} failed`)
        await exit(1)
      }
    })
  )

  console.log('test passed')
  await exit()
})()
