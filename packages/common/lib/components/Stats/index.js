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
const eye_1 = require('react-icons/lib/fa/eye');
const repo_forked_1 = require('react-icons/lib/go/repo-forked');
const heart_1 = require('react-icons/lib/go/heart');
const Stat_1 = require('./Stat');
const elements_1 = require('./elements');
function StatsComponent(_a) {
  var { viewCount, likeCount, forkCount, vertical, text } = _a,
    props = __rest(_a, [
      'viewCount',
      'likeCount',
      'forkCount',
      'vertical',
      'text',
    ]);
  return React.createElement(
    elements_1.Stats,
    Object.assign({ vertical: vertical }, props),
    React.createElement(Stat_1.default, {
      text: text ? 'views' : undefined,
      textOne: text ? 'view' : undefined,
      vertical: vertical,
      Icon: React.createElement(eye_1.default, null),
      count: viewCount,
    }),
    React.createElement(Stat_1.default, {
      text: text ? 'likes' : undefined,
      textOne: text ? 'like' : undefined,
      vertical: vertical,
      Icon: React.createElement(heart_1.default, null),
      count: likeCount,
    }),
    React.createElement(Stat_1.default, {
      text: text ? 'forks' : undefined,
      textOne: text ? 'fork' : undefined,
      vertical: vertical,
      Icon: React.createElement(repo_forked_1.default, null),
      count: forkCount,
    })
  );
}
exports.default = StatsComponent;
