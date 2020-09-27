/**
 * @fileoverview
 *   Collapse whitespace.
 *
 *   Normally, collapses to a single space.  If `newlines: true`,
 *   collapses white-space containing newlines to `'\n'` instead
 *   of `' '`.
 * @example
 *   <h1>Heading</h1>
 *   <p><strong>This</strong> and <em>that</em></p>
 */

'use strict'

var collapseWhiteSpace = require('collapse-white-space')
var whitespaceSensitive = require('html-whitespace-sensitive-tag-names')
var is = require('unist-util-is')
var modify = require('unist-util-modify-children')
var element = require('hast-util-is-element')
var has = require('hast-util-has-property')
var embedded = require('hast-util-embedded')
var bodyOK = require('hast-util-is-body-ok-link')
var list = require('./list')

module.exports = collapse

function collapse(options) {
  return transform
  function transform(tree) {
    return minify(tree, options || {})
  }
}

function minify(tree, options) {
  var whitespace = options.newlines ? collapseToNewLines : collapseWhiteSpace
  var modifier = modify(visitor)
  var inside = false
  var seen = false

  visitor(tree)

  return tree

  function visitor(node, index, parent) {
    var head
    var prev
    var next
    var value
    var start
    var end

    // don't collpase when ignore or preserve-whitespace flag was set
    if (node.data && (node.data.ignore || node.data.preserveWhitespace)) {
      return
    }

    if (is('text', node)) {
      prev = parent.children[index - 1]
      next = parent.children[index + 1]

      value = whitespace(node.value)
      end = value.length
      start = 0

      if (empty(value.charAt(0)) && viable(prev)) {
        start++
      }

      if (empty(value.charAt(end - 1)) && viable(next)) {
        end--
      }

      value = value.slice(start, end)

      /* Remove the node if it’s collapsed entirely. */
      if (!value) {
        parent.children.splice(index, 1)

        return index
      }

      node.value = value
    }

    if (!seen && !inside) {
      head = element(node, 'head')
      inside = head
      seen = head
    }

    if (node.children && !element(node, whitespaceSensitive)) {
      modifier(node)
    }

    if (head) {
      inside = false
    }
  }

  function viable(node) {
    return !node || inside || !collapsable(node)
  }
}

/* Check if `node` is collapsable. */
function collapsable(node) {
  return (
    is('text', node) ||
    element(node, list) ||
    embedded(node) ||
    bodyOK(node) ||
    (element(node, 'meta') && has(node, 'itemProp'))
  )
}

/* Collapse to spaces, or newlines if they’re in a run. */
function collapseToNewLines(value) {
  var result = String(value).replace(/\s+/g, function($0) {
    return $0.indexOf('\n') === -1 ? ' ' : '\n'
  })

  return result
}

function empty(character) {
  return character === ' ' || character === '\n'
}
