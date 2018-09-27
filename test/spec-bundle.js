import mobxLocation from '../src/mobx-location'
import { set } from 'mobx'

window.mobxLocation = mobxLocation
mobxLocation.hash = '#/aa?'
set(mobxLocation.query, { foo: new Date().toISOString() })
