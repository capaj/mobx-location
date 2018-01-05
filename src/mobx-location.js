import { extendObservable, observable, action } from 'mobx'
import queryString from 'query-string'
import 'history-events'

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

const createSnapshot = function() {
  const snapshot = propsToMirror.reduce((snapshot, prop) => {
    snapshot[prop] = window.location[prop]
    return snapshot
  }, {})
  snapshot.query = queryString.parse(snapshot.search)
  return snapshot
}
const firstSnapshot = createSnapshot()
const locationObservable = observable(firstSnapshot)

window.addEventListener(
  'changestate',
  action('changestateHandler', ev => {
    extendObservable(locationObservable, createSnapshot())
  })
)

export default locationObservable
