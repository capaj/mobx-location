'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mobx = require('mobx');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propsToMirror = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol', 'search'];

var createSnapshot = function createSnapshot() {
  var snapshot = propsToMirror.reduce(function (snapshot, prop) {
    snapshot[prop] = window.location[prop];
    return snapshot;
  }, {});
  snapshot.query = _queryString2.default.parse(snapshot.search);
  return snapshot;
};
var firstSnapshot = createSnapshot();
var locationObservable = (0, _mobx.observable)(firstSnapshot);

window.addEventListener('popstate', (0, _mobx.action)('popstateHandler', function (ev) {
  (0, _mobx.extendObservable)(locationObservable, createSnapshot());
}));

exports.default = locationObservable;
