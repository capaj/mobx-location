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

export default ({ hashHistory, arrayFormat = 'bracket' }) => {
  const createSnapshot = (previousQuery) => {
    const snapshot = propsToMirror.reduce((snapshot, prop) => {
      snapshot[prop] = location[prop]
      return snapshot
    }, {})
    let q

    if (hashHistory) {
      q = queryString.parse(snapshot.hash.split('?')[1], { arrayFormat })
    } else {
      q = queryString.parse(snapshot.search, { arrayFormat })
    }

    snapshot.query = q || {}

    return snapshot
  }

  const firstSnapshot = createSnapshot()
  const locationObservable = observable(firstSnapshot)

  /**
   * executes each time a mobxLocation.query is mutated
   */
  const propagateQueryToLocationSearch = () => {
    const queryInObservable = queryString.stringify(
      toJS(locationObservable.query),
      { encode: true, arrayFormat }
    )
    // console.log('currentlyInObservable: ', currentlyInObservable)
    const { search, protocol, host, pathname, hash } = location
    let qs = search

    const hashParts = hash.split('?')
    if (hashHistory && hash.includes('?')) {
      qs = hashParts[1]
    }
    if (!qs && !queryInObservable) {
      return
    }
    if (decodeURI(qs) === queryInObservable) {
      return
    }
    if (qs !== queryInObservable) {
      let newUrl = protocol + '//' + host + pathname
      if (hashHistory) {
        const newHash = hashParts[0] + '?' + queryInObservable

        locationObservable.hash = newHash
        newUrl += newHash
      } else {
        const newSearch = '?' + queryInObservable + hash

        locationObservable.search = newSearch
        newUrl += newSearch
      }
      locationObservable.href = newUrl

      window.removeEventListener('changestate', snapshotAndSet)
      // console.log('newUrl: ', newUrl)
      history.replaceState(null, '', newUrl)
      window.addEventListener('changestate', snapshotAndSet)
    }
  }

  const snapshotAndSet = action('changestateHandler', (ev) => {
    const snapshot = createSnapshot(toJS(locationObservable.query))
    const currentlyInObservable = toJS(locationObservable)
    //unfortunately we need to check that the new snapshot is different-for example when integrating with angularjs it happens that angular router is setting a URL again after we changed it via interacting with observable

    if (
      snapshot.href !== currentlyInObservable &&
      decodeURI(snapshot.href) !== locationObservable.href
    ) {
      set(locationObservable, snapshot)
    }
  })
  
  let unsubscribe = autorun(propagateQueryToLocationSearch)

  observe(locationObservable, (change) => {
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

        locationObservable.query = queryString.parse(change.newValue, {
          arrayFormat
        })
        unsubscribe = autorun(propagateQueryToLocationSearch)
      }
      history.pushState(null, '', newUrl)
      window.addEventListener('changestate', snapshotAndSet)
    }
  })

  window.addEventListener('changestate', snapshotAndSet)

  return locationObservable
}
