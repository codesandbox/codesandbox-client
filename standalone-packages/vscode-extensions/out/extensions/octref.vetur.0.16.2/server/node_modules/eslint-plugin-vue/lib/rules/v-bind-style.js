/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
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
      description: 'enforce `v-bind` directive style',
      category: 'strongly-recommended',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/v-bind-style.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['shorthand', 'longform'] }
    ]
  },

  create (context) {
    const shorthand = context.options[0] !== 'longform'

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='bind'][key.argument!=null]" (node) {
        if (node.key.shorthand === shorthand) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          message: shorthand
            ? "Unexpected 'v-bind' before ':'."
            : "Expected 'v-bind' before ':'.",
          fix: (fixer) => shorthand
            ? fixer.removeRange([node.range[0], node.range[0] + 6])
            : fixer.insertTextBefore(node, 'v-bind')
        })
      }
    })
  }
}
