'use strict'

module.exports = sort

var severities = {
  true: 2,
  false: 1,
  null: 0,
  undefined: 0
}

function sort(file) {
  file.messages.sort(comparator)
  return file
}

function comparator(a, b) {
  return (
    check(a, b, 'line') ||
    check(a, b, 'column') ||
    severities[b.fatal] - severities[a.fatal] ||
    compare(a, b, 'source') ||
    compare(a, b, 'ruleId') ||
    compare(a, b, 'reason') ||
    0
  )
}

function check(a, b, property) {
  return (a[property] || 0) - (b[property] || 0)
}

function compare(a, b, property) {
  return (a[property] || '').localeCompare(b[property] || '')
}
