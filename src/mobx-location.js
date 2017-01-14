import {action, observable} from 'mobx'

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

const createSnapshot = function () {
  return propsToMirror.reduce((snapshot, prop) => {
    snapshot[prop] = window.location[prop]
    return snapshot
  }, {})
}

const locationObservable = observable(createSnapshot())

window.addEventListener('popstate', action('popstateHandler', (ev) => {
  Object.assign(locationObservable, createSnapshot())
}))

export default locationObservable
