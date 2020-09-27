'use strict'

var html = require('property-information/html')
var svg = require('property-information/svg')
var voids = require('html-void-elements')
var omission = require('./omission')
var one = require('./one')
const repeat = require('repeat-string')

module.exports = toHTML

/* Characters. */
var DQ = '"'
var SQ = "'"

/* Stringify the given HAST node. */
function toHTML(node, options) {
  var settings = options || {}
  var quote = settings.singleQuote ? SQ : DQ
  var printWidth = settings.printWidth === undefined ? 80 : settings.printWidth
  var useTabs = settings.useTabs
  var tabWidth = settings.tabWidth || 2
  var wrapAttributes = settings.wrapAttributes

  if (useTabs) {
    tabWidth = '\t'
  } else if (typeof tabWidth === 'number') {
    tabWidth = repeat(' ', tabWidth)
  }

  return one(
    {
      valid: settings.allowParseErrors ? 0 : 1,
      safe: settings.allowDangerousCharacters ? 0 : 1,
      schema: settings.space === 'svg' ? svg : html,
      omit: settings.omitOptionalTags && omission,
      quote: quote,
      printWidth: printWidth,
      tabWidth: tabWidth,
      wrapAttributes: wrapAttributes,
      tightDoctype: Boolean(settings.tightDoctype),
      tightLists: settings.tightCommaSeparatedLists,
      voids: settings.voids || voids.concat(),
      entities: settings.entities || {},
      close: settings.closeSelfClosing,
      tightClose: settings.tightSelfClosing,
      closeEmpty: settings.closeEmptyElements
    },
    node
  )
}
