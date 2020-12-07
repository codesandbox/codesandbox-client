'use strict'

module.exports = hidden

function hidden(filename) {
  if (typeof filename !== 'string') {
    throw new Error('Expected string')
  }

  return filename.charAt(0) === '.'
}
