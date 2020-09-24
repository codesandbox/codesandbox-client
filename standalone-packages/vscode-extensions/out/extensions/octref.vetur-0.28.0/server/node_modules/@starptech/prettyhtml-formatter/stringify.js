'use strict'

const xtend = require('xtend')
const toHTML = require('@starptech/prettyhtml-hast-to-html')

module.exports = stringify

function stringify(config) {
  const settings = xtend(config, this.data('settings'))

  this.Compiler = compiler

  function compiler(tree) {
    return toHTML(tree, settings)
  }
}
