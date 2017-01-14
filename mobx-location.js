const mobx = require('mobx')

const propsToMirror = [
  'hash',
  'host',
  'hostname',
  'href',
  'origin',
  'pathname',
  'port',
  'protocol',
  'search'
]

function createSnapshot () {
  return propsToMirror.reduce((snapshot, prop) => {
    snapshot[prop] = window.location[prop]
    return snapshot
  }, {})
}

const locationObservable = mobx.observable(createSnapshot())

window.addEventListener('popstate', mobx.action('popstateHandler', (ev) => {
  Object.assign(locationObservable, createSnapshot())
}))

module.exports = locationObservable
