'use strict'

module.exports = loadPlugin
loadPlugin.resolve = resolvePlugin

function loadPlugin() {
  throw new Error('Cannot require plugins in the browser')
}

function resolvePlugin() {
  throw new Error('Cannot resolve plugins in the browser')
}
