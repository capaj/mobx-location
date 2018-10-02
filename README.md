# mobx-location

a browser location as a mobx observable. Minimal wrapper around browser history utilizing popstate event and HTML5 history api. Package [history-events](https://github.com/xpepermint/history-events) is used for monkeypatching.

Prime usage is in your mobx observers. You can directly access the location and your app will rerender itself without the need for react-router or similar solution.

```javascript
import makeMobxLocation from './mobx-location'
import { autorun, toJS } from 'mobx'

const mobxLocation = makeMobxLocation({ hashHistory: false }) // default
const mobxLocation = makeMobxLocation({ hashHistory: true }) // when you use hash history instead of html5 history APIs

const mobxLocation = makeMobxLocation({ arrayFormat: 'bracket' }) // default
const mobxLocation = makeMobxLocation({ arrayFormat: 'index' }) // will index array params in the url, refer to https://www.npmjs.com/package/query-string#arrayformat

autorun(() => {
  toJS(location) // runs every time browser location changes
})
```

location has all the standard properties:

```
hash
host
hostname
href
origin
pathname
port
protocol
search
```

plus one extra- `query`. Query is just parsed `location.search`. Query is always there even if no search params are in your location.

If you modify the query object, it will propagate back to the window location so you don't have to construct the search params yourself when modifying.
Keep in mind that any newly added property in `query` won't be picked up-you must use `set` from `import {set} from 'mobx'` to set new props.

## Browser support

same as html5 history api-so with that shim even IE9
