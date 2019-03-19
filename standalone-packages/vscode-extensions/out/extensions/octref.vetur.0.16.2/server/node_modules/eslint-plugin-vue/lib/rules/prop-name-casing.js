/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const allowedCaseOptions = ['camelCase', 'snake_case']

function canFixPropertyName (node, key, originalName) {
  // Can not fix of computed property names & shorthand
  if (node.computed || node.shorthand) {
    return false
  }

  // Can not fix of unknown types
  if (key.type !== 'Literal' && key.type !== 'Identifier') {
    return false
  }
  // Can fix of ASCII printable characters
  return originalName.match(/[ -~]+/)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const options = context.options[0]
  const caseType = allowedCaseOptions.indexOf(options) !== -1 ? options : 'camelCase'
  const converter = casing.getConverter(caseType)

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    const props = utils.getComponentProps(obj)
      .filter(prop => prop.key && (prop.key.type === 'Literal' || (prop.key.type === 'Identifier' && !prop.node.computed)))

    for (const item of props) {
      const propName = item.key.type === 'Literal' ? item.key.value : item.key.name
      if (typeof propName !== 'string') {
        // (boolean | null | number | RegExp) Literal
        continue
      }
      const convertedName = converter(propName)
      if (convertedName !== propName) {
        context.report({
          node: item.node,
          message: 'Prop "{{name}}" is not in {{caseType}}.',
          data: {
            name: propName,
            caseType: caseType
          },
          fix: canFixPropertyName(item.node, item.key, propName) ? fixer => {
            return item.key.type === 'Literal'
              ? fixer.replaceText(item.key, item.key.raw.replace(item.key.value, convertedName))
              : fixer.replaceText(item.key, convertedName)
          } : undefined
        })
      }
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for the Prop name in Vue components',
      category: 'strongly-recommended',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/prop-name-casing.html'
    },
    fixable: 'code',  // null or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },
  create
}
