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
    type: 'layout',
    docs: {
      description: 'enforce quotes style of HTML attributes',
      category: 'strongly-recommended',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/html-quotes.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['double', 'single'] }
    ]
  },

  create (context) {
    const sourceCode = context.getSourceCode()
    const double = context.options[0] !== 'single'
    const quoteChar = double ? '"' : "'"
    const quoteName = double ? 'double quotes' : 'single quotes'
    const quotePattern = double ? /"/g : /'/g
    const quoteEscaped = double ? '&quot;' : '&apos;'
    let hasInvalidEOF

    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[value!=null]' (node) {
        if (hasInvalidEOF) {
          return
        }

        const text = sourceCode.getText(node.value)
        const firstChar = text[0]

        if (firstChar !== quoteChar) {
          context.report({
            node: node.value,
            loc: node.value.loc,
            message: 'Expected to be enclosed by {{kind}}.',
            data: { kind: quoteName },
            fix (fixer) {
              const contentText = (firstChar === "'" || firstChar === '"') ? text.slice(1, -1) : text
              const replacement = quoteChar + contentText.replace(quotePattern, quoteEscaped) + quoteChar
              return fixer.replaceText(node.value, replacement)
            }
          })
        }
      }
    }, {
      Program (node) {
        hasInvalidEOF = utils.hasInvalidEOF(node)
      }
    })
  }
}
