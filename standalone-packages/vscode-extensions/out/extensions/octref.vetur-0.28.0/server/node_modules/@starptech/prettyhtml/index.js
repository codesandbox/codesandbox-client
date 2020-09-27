'use strict'

const VFile = require('vfile')
const unified = require('unified')
const parse = require('@starptech/rehype-webparser')
const stringify = require('@starptech/prettyhtml-formatter/stringify')
const format = require('@starptech/prettyhtml-formatter')
const sortAttributes = require('@starptech/prettyhtml-sort-attributes')

module.exports = prettyhtml

function core(value, processor, options) {
  const file = new VFile(value)
  let proc = processor().use(format, {
    tabWidth: options.tabWidth,
    useTabs: options.useTabs,
    usePrettier: options.usePrettier,
    prettier: options.prettier
  })

  if (options.sortAttributes) {
    proc = proc.use(sortAttributes)
  }

  return proc
    .use(stringify, {
      wrapAttributes: options.wrapAttributes,
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      singleQuote: options.singleQuote,
      closeSelfClosing: true,
      closeEmptyElements: true
    })
    .processSync(file)
}

function prettyhtml(value, options) {
  const opt = Object.assign({}, options)
  return core(
    value,
    unified()
      .use(parse, {
        ignoreFirstLf: false,
        decodeEntities: false,
        selfClosingCustomElements: true,
        selfClosingElements: true
      })
      .freeze(),
    opt
  )
}
