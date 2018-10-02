const puppeteer = require('puppeteer')
const Bundler = require('parcel-bundler')
const bundler = new Bundler('test/index.html')
;(async () => {
  const server = await bundler.serve(4051)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.on('console', msg => {
    console.log(msg._text)
  })

  const exit = async code => {
    bundler.stop()
    await browser.close()
    process.exit(code)
  }
  await page.goto('http://localhost:4051/?someQuery=1')

  // Get the "viewport" of the page, as reported by the page.
  const tests = await page.evaluate(() => {
    const { query } = mobxLocation
    const initial = query.someQuery === '1'

    history.pushState(null, null, '?someQuery=2')
    const secondAssert = query.someQuery === '2'
    console.log('bb', JSON.stringify(query), location.search)

    query.someQuery = 3
    console.log('aaa', JSON.stringify(query))
    const thirdAssert = query.someQuery === 3

    return [initial, secondAssert, thirdAssert]
  })
  await Promise.all(
    tests.map(async (testResult, index) => {
      if (!testResult) {
        console.error(`a test ${index + 1} failed`)
        await exit(1)
      }
    })
  )

  console.log('test passed')
  await exit()
})()
