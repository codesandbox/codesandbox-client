/**
 * @fileoverview
 *   Check if a `link` element is “Body OK”.
 * @longdescription
 *   ## Usage
 *
 *   ```javascript
 *   var h = require('hastscript');
 *   var ok = require('hast-util-is-body-ok-link');
 *
 *   ok(h('link', {itemProp: 'foo'})); //=> true
 *   ok(h('link', {rel: ['stylesheet'], href: 'index.css'})); //=> true
 *   ok(h('link', {rel: ['author'], href: 'index.css'})); //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isBodyOkLink(node)`
 *
 *   * Return `true` for `link` elements with an `itemProp`
 *   * Return `true` for `link` elements with a `rel` list
 *     where one or more entries are `pingback`, `prefetch`,
 *     or `stylesheet`.
 */

'use strict';

var is = require('hast-util-is-element');
var has = require('hast-util-has-property');

module.exports = ok;

var list = [
  'pingback',
  'prefetch',
  'stylesheet'
];

function ok(node) {
  var length;
  var index;
  var rel;

  if (!is(node, 'link')) {
    return false;
  }

  if (has(node, 'itemProp')) {
    return true;
  }

  rel = (node.properties || {}).rel || [];
  length = rel.length;
  index = -1;

  if (rel.length === 0) {
    return false;
  }

  while (++index < length) {
    if (list.indexOf(rel[index]) === -1) {
      return false;
    }
  }

  return true;
}
