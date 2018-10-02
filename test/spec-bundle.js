import makeMobxLocation from '../src/mobx-location'
import { set, autorun, toJS } from 'mobx'

window.mobxLocation = makeMobxLocation({ hashHistory: false })
// mobxLocation.hash = '#/aagg'
// set(mobxLocation.query, { foo: new Date().toISOString() })

// autorun(() => {
//   console.log('autorun', toJS(mobxLocation))
// })
