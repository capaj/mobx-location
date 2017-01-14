'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mobx = require('mobx');

var propsToMirror = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search'];

var createSnapshot = function createSnapshot() {
  return propsToMirror.reduce(function (snapshot, prop) {
    snapshot[prop] = window.location[prop];
    return snapshot;
  }, {});
};

var locationObservable = (0, _mobx.observable)(createSnapshot());

window.addEventListener('popstate', (0, _mobx.action)('popstateHandler', function (ev) {
  Object.assign(locationObservable, createSnapshot());
}));

exports.default = locationObservable;
