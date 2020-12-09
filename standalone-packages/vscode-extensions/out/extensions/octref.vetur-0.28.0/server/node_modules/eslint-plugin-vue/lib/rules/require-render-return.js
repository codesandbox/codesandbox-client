/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce render function to always return value',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-render-return.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ESNode, Property['key']>} */
    const renderFunctions = new Map()

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onRenderFunctionEnter(node) {
          renderFunctions.set(node.parent.value, node.parent.key)
        }
      }),
      utils.executeOnFunctionsWithoutReturn(true, (node) => {
        const key = renderFunctions.get(node)
        if (key) {
          context.report({
            node: key,
            message: 'Expected to return a value in render function.'
          })
        }
      })
    )
  }
}
