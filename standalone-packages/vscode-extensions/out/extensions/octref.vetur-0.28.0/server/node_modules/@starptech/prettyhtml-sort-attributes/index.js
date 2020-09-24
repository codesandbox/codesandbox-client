'use strict'

var visit = require('unist-util-visit')
var has = require('hast-util-has-property')

module.exports = sort

function sort() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', reorder)

  function reorder(node) {
    var props = node.properties
    var index = -1
    var result = {}
    var prop

    var all = Object.keys(props).sort((left, right) => left.localeCompare(right))

    while (++index < all.length) {
      prop = all[index]

      if (has(node, prop)) {
        result[prop] = props[prop]
      }
    }

    node.properties = result
  }
}
