/**
 * @author Yosuke Ota
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
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated the `is` attribute on HTML elements (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-html-element-is.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'The `is` attribute on HTML element are deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective | VAttribute} node */
      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is'], VAttribute[directive=false][key.name='is']"(
        node
      ) {
        const element = node.parent.parent
        if (
          !utils.isHtmlWellKnownElementName(element.rawName) &&
          !utils.isSvgWellKnownElementName(element.rawName)
        ) {
          return
        }
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
