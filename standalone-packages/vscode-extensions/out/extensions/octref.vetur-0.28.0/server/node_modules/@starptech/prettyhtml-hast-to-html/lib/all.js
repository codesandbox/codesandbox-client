'use strict'

var one = require('./one')
var sensitive = require('html-whitespace-sensitive-tag-names')

module.exports = all

/* Stringify all children of `parent`. */
function all(ctx, parent) {
  var children = parent && parent.children
  var length = children && children.length
  var index = -1
  var results = []

  let printWidthOffset = 0
  let innerTextLength = 0
  while (++index < length) {
    innerTextLength = getInnerTextLength(children[index])
    results[index] = one(ctx, children[index], index, parent, printWidthOffset, innerTextLength)
    printWidthOffset = results[index].replace(/\n+/g, '').length
  }

  return results.join('')
}

/**
 * Returns the text lenght of the first line of the first child.
 * Whitespace sensitive elements are ignored.
 * @param {*} node
 */
function getInnerTextLength(node) {
  // ignore style, script, pre, textarea elements
  if (sensitive.indexOf(node.tagName) !== -1) {
    return 0
  }

  if (!node.children || !node.children.length) {
    return 0
  }

  var child = node.children[0]

  if (child.type === 'text' || child.type === 'comment') {
    return child.value.split('\n')[0].length
  }

  return 0
}
