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
const mark_github_1 = require('react-icons/lib/go/mark-github');
const elements_1 = require('./elements');
const DivOrA = _a => {
  var { href } = _a,
    props = __rest(_a, ['href']);
  return href
    ? React.createElement(
        elements_1.StyledA,
        Object.assign(
          { target: '_blank', rel: 'noopener noreferrer', href: href },
          props
        )
      )
    : React.createElement('div', Object.assign({}, props));
};
function GithubBadge(_a) {
  var { username, repo, url, branch } = _a,
    props = __rest(_a, ['username', 'repo', 'url', 'branch']);
  return React.createElement(
    DivOrA,
    Object.assign({}, props, { href: url }),
    React.createElement(
      elements_1.BorderRadius,
      { hasUrl: !!url },
      React.createElement(
        elements_1.Icon,
        null,
        React.createElement(mark_github_1.default, null)
      ),
      React.createElement(
        elements_1.Text,
        null,
        username,
        '/',
        repo,
        branch && branch !== 'master' ? `@${branch}` : ''
      )
    )
  );
}
exports.default = GithubBadge;
