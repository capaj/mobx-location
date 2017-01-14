import test from 'ava'
import location from './mobx-location'
import {autorun, toJS} from 'mobx'

test('it reacts to popstate', t => {
  let c = 0
  autorun(() => {
    toJS(location)
    c++
  })
  window.location.hash = '#somehash'
  window.eventHandlers.forEach((cb) => cb())  // jsdom is lame, it doesn't trigger popstate event
  // window.eventHandlers.forEach((cb) => cb())

  t.is(c, 2)
})
