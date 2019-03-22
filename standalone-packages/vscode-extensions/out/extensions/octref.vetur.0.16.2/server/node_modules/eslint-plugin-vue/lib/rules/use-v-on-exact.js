/**
 * @fileoverview enforce usage of `exact` modifier on `v-on`.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      category: 'essential',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/use-v-on-exact.html'
    },
    fixable: null,
    schema: []
  },

  /**
   * Creates AST event handlers for use-v-on-exact.
   *
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      VStartTag (node) {
        if (node.attributes.length > 1) {
          const groups = node.attributes
            .map(item => item.key)
            .filter(item => item && item.type === 'VDirectiveKey' && item.name === 'on')
            .reduce((rv, item) => {
              (rv[item.argument] = rv[item.argument] || []).push(item)
              return rv
            }, {})

          const directives = Object.keys(groups).map(key => groups[key])
          // const directives = Object.values(groups) // Uncomment after node 6 is dropped
            .filter(item => item.length > 1)
          for (const group of directives) {
            if (group.some(item => item.modifiers.length > 0)) { // check if there are directives with modifiers
              const invalid = group.filter(item => item.modifiers.length === 0)
              for (const node of invalid) {
                context.report({
                  node,
                  loc: node.loc,
                  message: "Consider to use '.exact' modifier."
                })
              }
            }
          }
        }
      }
    })
  }
}
