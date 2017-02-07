# mobx-location
just location as a mobx observable. Minimal wrapper around browser history utilizing popstate event and monkeypatching HTML5 history api

Prime usage is in your observers. You can directly access the location and your app will rerender itself without the need for react-router or similar solution.

```javascript
import location from './mobx-location'
import {autorun, toJS} from 'mobx'

autorun(() => {
  toJS(location)  // runs every time browser location changes
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


## Browser support

same as html5 history api-so with that shim even IE9