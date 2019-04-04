'use strict'

/* Dependencies. */
var is = require('hast-util-is-element')

/* Expose. */
module.exports = embedded

/* Tag-names. */
var names = [
  'audio',
  'canvas',
  'embed',
  'iframe',
  'img',
  'math',
  'object',
  'picture',
  'svg',
  'video'
]

/* Check if a node is a embedded element. */
function embedded(node) {
  return is(node, names)
}
