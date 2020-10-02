/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in computed property',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-computed-property.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          treatUndefinedAsUnspecified: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const treatUndefinedAsUnspecified = !(
      options.treatUndefinedAsUnspecified === false
    )

    /**
     * @type {Set<ComponentComputedProperty>}
     */
    const computedProperties = new Set()

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return Object.assign(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          for (const computedProperty of utils.getComputedProperties(obj)) {
            computedProperties.add(computedProperty)
          }
        }
      }),
      utils.executeOnFunctionsWithoutReturn(
        treatUndefinedAsUnspecified,
        (node) => {
          computedProperties.forEach((cp) => {
            if (cp.value && cp.value.parent === node) {
              context.report({
                node,
                message:
                  'Expected to return a value in "{{name}}" computed property.',
                data: {
                  name: cp.key || 'Unknown'
                }
              })
            }
          })
        }
      )
    )
  }
}
