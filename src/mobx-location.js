import { set, observable, action, autorun, toJS, observe } from 'mobx'
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
const { location } = window

const createSnapshot = function() {
  const snapshot = propsToMirror.reduce((snapshot, prop) => {
    snapshot[prop] = location[prop]
    return snapshot
  }, {})
  const q = queryString.parse(snapshot.search)
  snapshot.query = q

  return snapshot
}
const firstSnapshot = createSnapshot()
const locationObservable = observable(firstSnapshot)

const propagateQueryToLocationSearch = () => {
  const currentSearch = `?${queryString.stringify(
    toJS(locationObservable.query)
  )}`
  const { search, protocol, host, pathname } = location

  if (search !== currentSearch) {
    const newUrl = protocol + '//' + host + pathname + currentSearch
    history.pushState(null, '', newUrl)
  }
}

let unsubscribe = autorun(propagateQueryToLocationSearch)

const snapshotAndSet = action('changestateHandler', ev => {
  set(locationObservable, createSnapshot())
})

observe(locationObservable, change => {
  if (location[change.name] !== change.newValue) {
    const { search, protocol, host, pathname } = locationObservable
    const newUrl = protocol + '//' + host + pathname + search
    window.removeEventListener('changestate', snapshotAndSet)
    if (change.name === 'search') {
      unsubscribe()

      locationObservable.query = queryString.parse(change.newValue)
      unsubscribe = autorun(propagateQueryToLocationSearch)
    }
    history.pushState(null, '', newUrl)
    window.addEventListener('changestate', snapshotAndSet)
  }
})

window.addEventListener('changestate', snapshotAndSet)

export default locationObservable
