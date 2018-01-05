import test from 'ava'
import location from './mobx-location'
import { autorun, toJS } from 'mobx'
// import jsdom from 'jsdom'

test('it reacts to popstate', t => {
  let c = 0
  autorun(() => {
    toJS(location)
    c++
  })
  window.location.hash = '#somehash'
  // window.location.href =
  // jsdom.changeURL(window, 'https://example.com/#someHash')
  window.eventHandlers.forEach(cb => cb()) // jsdom is lame, it doesn't trigger popstate event

  t.is(c, 2)
})

test('it has query object', t => {
  // jsdom.changeURL(window, 'http://localhost:3003/?redirect=no')
  console.log('window.location.search: ', window.location.search)
  window.location.search = `?redirect=no`
  console.log('window.location.search: ', window.location.search)
  window.eventHandlers.forEach(cb => cb())
  t.is(location.query.redirect, 'no')

  // jsdom.changeURL(window, 'http://localhost:3003/?other=1')
  window.location.search = `?other=1`

  window.eventHandlers.forEach(cb => cb())

  t.is(location.query.redirect, undefined)
  t.is(location.query.other, '1')
})
