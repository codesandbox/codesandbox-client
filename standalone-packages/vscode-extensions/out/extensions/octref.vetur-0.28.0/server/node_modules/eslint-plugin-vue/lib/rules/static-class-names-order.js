/**
 * @fileoverview Alphabetizes static class names.
 * @author Maciej Chmurski
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { defineTemplateBodyVisitor } = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://eslint.vuejs.org/rules/static-class-names-order.html',
      description: 'enforce static class names order',
      categories: undefined
    },
    fixable: 'code',
    schema: []
  },
  /** @param {RuleContext} context */
  create: (context) => {
    return defineTemplateBodyVisitor(context, {
      /** @param {VAttribute} node */
      "VAttribute[directive=false][key.name='class']"(node) {
        const value = node.value
        if (!value) {
          return
        }
        const classList = value.value
        const classListWithWhitespace = classList.split(/(\s+)/)

        // Detect and reuse any type of whitespace.
        let divider = ''
        if (classListWithWhitespace.length > 1) {
          divider = classListWithWhitespace[1]
        }

        const classListNoWhitespace = classListWithWhitespace.filter(
          (className) => className.trim() !== ''
        )
        const classListSorted = classListNoWhitespace.sort().join(divider)

        if (classList !== classListSorted) {
          context.report({
            node,
            loc: node.loc,
            message: 'Classes should be ordered alphabetically.',
            fix: (fixer) => fixer.replaceText(value, `"${classListSorted}"`)
          })
        }
      }
    })
  }
}
