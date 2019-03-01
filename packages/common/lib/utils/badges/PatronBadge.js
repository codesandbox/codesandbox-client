'use strict';
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Badge_1 = require('./Badge');
const DEFAULT_BADGE = {
  id: 'patron_1',
  name: 'Patron I',
  visible: true,
};
exports.default = _a => {
  var { size } = _a,
    props = __rest(_a, ['size']);
  return React.createElement(
    Badge_1.default,
    Object.assign({}, props, { badge: DEFAULT_BADGE, size: size })
  );
};
