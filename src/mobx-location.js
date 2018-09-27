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
  let q
  if (snapshot.search) {
    q = queryString.parse(snapshot.search)
  } else if (snapshot.hash.includes('?')) {
    q = queryString.parse(snapshot.hash.split('?')[1])
  } else {
    q = {}
  }

  snapshot.query = q

  return snapshot
}

export default ({ hashHistory }) => {
  const firstSnapshot = createSnapshot()
  const locationObservable = observable(firstSnapshot)

  const propagateQueryToLocationSearch = () => {
    // console.log('locationObservable.query: ', locationObservable.query)

    const currentlyInObservable = `?${queryString.stringify(
      toJS(locationObservable.query)
    )}`
    // console.log('currentlyInObservable: ', currentlyInObservable)
    const { search, protocol, host, pathname, hash } = location
    let qs = search

    let hashParts
    if (hashHistory) {
      hashParts = hash.split('?')
      qs = `?${hashParts[1]}`
    }
    if (!qs && currentlyInObservable === '?') {
      return
    }
    if (qs !== currentlyInObservable) {
      let newUrl = protocol + '//' + host + pathname
      if (hashHistory) {
        newUrl += hashParts[0] + currentlyInObservable
      } else {
        newUrl += currentlyInObservable + hash
      }
      window.removeEventListener('changestate', snapshotAndSet)

      history.replaceState(null, '', newUrl)
      window.addEventListener('changestate', snapshotAndSet)
    }
  }

  let unsubscribe = autorun(propagateQueryToLocationSearch)

  const snapshotAndSet = action('changestateHandler', ev => {
    set(locationObservable, createSnapshot())
  })

  observe(locationObservable, change => {
    const { name } = change
    if (name === 'query') {
      return // we ignore these
    }
    if (location[change.name] !== change.newValue) {
      const { search, protocol, host, pathname, hash } = locationObservable
      const newUrl = protocol + '//' + host + pathname + search + hash
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

  return locationObservable
}
