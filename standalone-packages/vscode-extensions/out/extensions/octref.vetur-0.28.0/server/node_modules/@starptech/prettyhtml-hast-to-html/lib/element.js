'use strict'

var xtend = require('xtend')
var svg = require('property-information/svg')
var find = require('property-information/find')
var spaces = require('space-separated-tokens').stringify
var commas = require('comma-separated-tokens').stringify
var entities = require('stringify-entities')
var all = require('./all')
var constants = require('./constants')
const repeat = require('repeat-string')

module.exports = element

/* Constants. */
var emptyString = ''

/* Characters. */
var space = ' '
var quotationMark = '"'
var apostrophe = "'"
var equalsTo = '='
var lessThan = '<'
var greaterThan = '>'
var slash = '/'
var newLine = '\n'

/* Stringify an element `node`. */
function element(ctx, node, index, parent, printWidthOffset, innerTextLength) {
  var parentSchema = ctx.schema
  var name = node.tagName
  var value = ''
  var selfClosing
  var close
  var omit
  var root = node
  var content
  var attrs
  var indentLevel = getNodeData(node, 'indentLevel', 0)
  var printContext = {
    offset: printWidthOffset,
    wrapAttributes: false,
    indentLevel
  }
  var isVoid = ctx.voids.indexOf(name) !== -1
  var ignoreAttrCollapsing =
    getNodeData(node, 'ignore', false) || getNodeData(node, 'preserveAttrWrapping', false)

  if (parentSchema.space === 'html' && name === 'svg') {
    ctx.schema = svg
  }

  if (ctx.schema.space === 'svg') {
    omit = false
    close = true
    selfClosing = ctx.closeEmpty
  } else {
    omit = ctx.omit
    close = ctx.close
    selfClosing = isVoid
  }

  // check for 'selfClosing' property set by hast-util-from-webparser package
  // in order to support custom self-closing elements
  if (selfClosing === false) {
    selfClosing = getNodeData(node, 'selfClosing', false)
  }

  // <
  printContext.offset += lessThan.length

  // tagName length
  printContext.offset += node.tagName.length

  // / closing tag
  if (selfClosing && !isVoid) {
    printContext.offset += slash.length
  }

  // >
  printContext.offset += greaterThan.length

  const propertyCount = Object.keys(node.properties).length

  // force to wrap attributes on multiple lines when the node contains
  // more than one attribute
  if (propertyCount > 1 && ctx.wrapAttributes) {
    printContext.wrapAttributes = true
  }

  // one space before each attribute
  if (propertyCount) {
    printContext.offset += propertyCount * space.length
  }

  // represent the length of the inner text of the node
  printContext.offset += innerTextLength

  attrs = attributes(ctx, node.properties, printContext, ignoreAttrCollapsing)

  const shouldCollapse = ignoreAttrCollapsing === false && printContext.wrapAttributes

  content = all(ctx, root)

  /* If the node is categorised as void, but it has
   * children, remove the categorisation.  This
   * enables for example `menuitem`s, which are
   * void in W3C HTML but not void in WHATWG HTML, to
   * be stringified properly. */
  selfClosing = content ? false : selfClosing

  if (attrs || !omit || !omit.opening(node, index, parent)) {
    value = lessThan + name

    if (attrs) {
      // add no space after tagName when element is collapsed
      if (shouldCollapse) {
        value += attrs
      } else {
        value += space + attrs
      }
    }

    let selfClosed = false

    // check if the should close self-closing elements
    if (selfClosing && close) {
      if ((!ctx.tightClose || attrs.charAt(attrs.length - 1) === slash) && !shouldCollapse) {
        value += space
      }

      if (shouldCollapse) {
        value += newLine + repeat(ctx.tabWidth, printContext.indentLevel)
      }

      selfClosed = true
      value += slash
    }

    // allow any element to self close itself except known HTML void elements
    else if (selfClosing && !isVoid) {
      if (shouldCollapse) {
        value += newLine + repeat(ctx.tabWidth, printContext.indentLevel)
      }

      selfClosed = true
      value += slash
    }

    // add newline when element should be wrappend on multiple lines and when
    // it's no self-closing element because in that case the newline was already added before the slash (/)
    if (shouldCollapse && !selfClosed) {
      value += newLine + repeat(ctx.tabWidth, printContext.indentLevel)
    }

    value += greaterThan
  }

  value += content

  if (!selfClosing && (!omit || !omit.closing(node, index, parent))) {
    value += lessThan + slash + name + greaterThan
  }

  ctx.schema = parentSchema

  return value
}

/* Stringify all attributes. */
function attributes(ctx, props, printContext, ignoreIndent) {
  var values = []
  var key
  var value
  var result
  var length
  var index
  var last

  for (key in props) {
    value = props[key]

    if (value == null) {
      continue
    }

    result = attribute(ctx, key, value)

    printContext.offset += result.length

    if (ignoreIndent === false && printContext.offset > ctx.printWidth) {
      printContext.wrapAttributes = true
    }

    if (result) {
      values.push(result)
    }
  }

  length = values.length
  index = -1

  while (++index < length) {
    result = values[index]
    last = null

    /* In tight mode, don’t add a space after quoted attributes. */
    if (last !== quotationMark && last !== apostrophe) {
      if (printContext.wrapAttributes) {
        values[index] = newLine + repeat(ctx.tabWidth, printContext.indentLevel + 1) + result
      } else if (index !== length - 1) {
        values[index] = result + space
      } else {
        values[index] = result
      }
    }
  }

  return values.join(emptyString)
}

/* Stringify one attribute. */
function attribute(ctx, key, value) {
  var schema = ctx.schema
  var info = find(schema, key)
  var name = info.attribute

  if (value == null || (typeof value === 'number' && isNaN(value)) || (value === false && info.boolean)) {
    return emptyString
  }

  name = attributeName(ctx, name)

  if ((value === true && info.boolean) || (value === true && info.overloadedBoolean)) {
    return name
  }

  return name + attributeValue(ctx, key, value, info)
}

/* Stringify the attribute name. */
function attributeName(ctx, name) {
  // Always encode without parse errors in non-HTML.
  var valid = ctx.schema.space === 'html' ? ctx.valid : 1
  var subset = constants.name[valid][ctx.safe]

  return entities(name, xtend(ctx.entities, { subset: subset }))
}

/* Stringify the attribute value. */
function attributeValue(ctx, key, value, info) {
  var quote = ctx.quote

  if (typeof value === 'object' && 'length' in value) {
    /* `spaces` doesn’t accept a second argument, but it’s
     * given here just to keep the code cleaner. */
    value = (info.commaSeparated ? commas : spaces)(value, {
      padLeft: !ctx.tightLists
    })
  }

  value = String(value)

  // When attr has no value we avoid quoting
  if (value === '') {
    return value
  } else {
    value = equalsTo + quote + value + quote
  }

  return value
}

function getNodeData(node, key, defaultValue) {
  let data = node.data || {}
  return data[key] || defaultValue
}
