/**
 * @fileoverview
 *   Sort attribute values.
 *
 *   This optimises for repetition-based compression (such as GZip).
 * @example
 *   <div class="qux quux foo bar"></div>
 */

'use strict'

var array = require('x-is-array')
var visit = require('unist-util-visit')
var is = require('hast-util-is-element')
var attributes = require('./schema')

module.exports = sortAttributeValues

var own = {}.hasOwnProperty

function sortAttributeValues() {
  return transform
}

function transform(tree) {
  var counts = {}
  var queues = []

  visit(tree, 'element', visitor)

  flush(optimize())

  function visitor(node) {
    var props = node.properties
    var prop
    var value

    for (prop in props) {
      value = props[prop]

      if (
        own.call(attributes, prop) &&
        is(node, attributes[prop]) &&
        array(value)
      ) {
        add(prop, value)
      }
    }
  }

  function add(prop, values) {
    var cache = counts[prop] || (counts[prop] = {known: []})
    var length = values.length
    var index = -1
    var value

    while (++index < length) {
      value = safe(values[index])

      if (value in cache) {
        cache[value]++
      } else {
        cache[value] = 1
        cache.known.push(values[index])
      }
    }

    queues.push([values, prop])
  }

  function optimize() {
    var caches = {}
    var prop
    var values

    for (prop in counts) {
      values = counts[prop]
      caches[prop] = values.known.sort(sort)
    }

    return caches

    function sort(a, b) {
      return values[safe(b)] - values[safe(a)] || compare(a, b, 0)
    }
  }

  function flush(caches) {
    var length = queues.length
    var index = -1
    var queue
    var cache

    while (++index < length) {
      queue = queues[index]
      cache = caches[queue[1]]
      queue[0].sort(sorter)
    }

    function sorter(a, b) {
      return cache.indexOf(a) - cache.indexOf(b)
    }
  }
}

function safe(value) {
  return '$' + value
}

// This would create an infinite loop if `a` and `b` could be equal, but the
// list we operate on only has unique values.
function compare(a, b, index) {
  return (
    (a.charCodeAt(index) || 0) - (b.charCodeAt(index) || 0) ||
    compare(a, b, index + 1)
  )
}
