'use strict'

var isEmpty = require('is-empty')

/* Detect color support. */

var color = true

try {
  color = 'inspect' in require('util')
} catch (err) {
  /* istanbul ignore next - browser */
  color = false
}

module.exports = color ? inspect : /* istanbul ignore next */ noColor

inspect.color = inspect
noColor.color = inspect
inspect.noColor = noColor
noColor.noColor = noColor

var dim = ansiColor(2, 22)
var yellow = ansiColor(33, 39)
var green = ansiColor(32, 39)

/* Define ANSII color removal functionality. */
var COLOR_EXPRESSION = new RegExp(
  '(?:' +
    '(?:\\u001b\\[)|' +
    '\\u009b' +
    ')' +
    '(?:' +
    '(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m]' +
    ')|' +
    '\\u001b[A-M]',
  'g'
)

/* Standard keys defined by unist:
 * https://github.com/syntax-tree/unist.
 * We don’t ignore `data` though. */
var ignore = ['type', 'value', 'children', 'position']

/* Inspects a node, without using color. */
function noColor(node, pad) {
  return stripColor(inspect(node, pad))
}

/* Inspects a node. */
function inspect(node, pad) {
  var result
  var children
  var index
  var length

  if (node && Boolean(node.length) && typeof node !== 'string') {
    length = node.length
    index = -1
    result = []

    while (++index < length) {
      result[index] = inspect(node[index])
    }

    return result.join('\n')
  }

  if (!node || !node.type) {
    return String(node)
  }

  result = [formatNode(node)]
  children = node.children
  length = children && children.length
  index = -1

  if (!length) {
    return result[0]
  }

  if (!pad || typeof pad === 'number') {
    pad = ''
  }

  while (++index < length) {
    node = children[index]

    if (index === length - 1) {
      result.push(formatNesting(pad + '└─ ') + inspect(node, pad + '   '))
    } else {
      result.push(formatNesting(pad + '├─ ') + inspect(node, pad + '│  '))
    }
  }

  return result.join('\n')
}

/* Colored nesting formatter. */
function formatNesting(value) {
  return dim(value)
}

/* Compile a single position. */
function compile(pos) {
  var values = []

  if (!pos) {
    return null
  }

  values = [[pos.line || 1, pos.column || 1].join(':')]

  if ('offset' in pos) {
    values.push(String(pos.offset || 0))
  }

  return values
}

/* Compile a location. */
function stringify(start, end) {
  var values = []
  var positions = []
  var offsets = []

  add(start)
  add(end)

  if (positions.length !== 0) {
    values.push(positions.join('-'))
  }

  if (offsets.length !== 0) {
    values.push(offsets.join('-'))
  }

  return values.join(', ')

  /* Add a position. */
  function add(position) {
    var tuple = compile(position)

    if (tuple) {
      positions.push(tuple[0])

      if (tuple[1]) {
        offsets.push(tuple[1])
      }
    }
  }
}

/* Colored node formatter. */
function formatNode(node) {
  var log = node.type
  var location = node.position || {}
  var position = stringify(location.start, location.end)
  var key
  var values = []
  var value

  if (node.children) {
    log += dim('[') + yellow(node.children.length) + dim(']')
  } else if (typeof node.value === 'string') {
    log += dim(': ') + green(JSON.stringify(node.value))
  }

  if (position) {
    log += ' (' + position + ')'
  }

  for (key in node) {
    value = node[key]

    if (
      ignore.indexOf(key) !== -1 ||
      value === null ||
      value === undefined ||
      (typeof value === 'object' && isEmpty(value))
    ) {
      continue
    }

    values.push('[' + key + '=' + JSON.stringify(value) + ']')
  }

  if (values.length !== 0) {
    log += ' ' + values.join('')
  }

  return log
}

/* Remove ANSI colour from `value`. */
function stripColor(value) {
  return value.replace(COLOR_EXPRESSION, '')
}

/* Factory to wrap values in ANSI colours. */
function ansiColor(open, close) {
  return color

  function color(value) {
    return '\u001B[' + open + 'm' + value + '\u001B[' + close + 'm'
  }
}
