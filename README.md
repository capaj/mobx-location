# mobx-location
just location as a mobx observable. Very minimal wrapper around browser history utilizing popstate event of HTML5 history api

Prime usage is in your observers. You can directly access the location and your app will rerender itself without the need for react-router or similar solution.

```javascript
import location from './mobx-location'
import {autorun, toJS} from 'mobx'

autorun(() => {
  toJS(location)  // runs every time browser location changes
})
```