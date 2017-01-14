// import browserEnv from 'browser-env'
const browserEnv = require('browser-env')
browserEnv()

window.eventHandlers = []
window.addEventListener = (ev, cb) => {
  window.eventHandlers.push(cb)
}
