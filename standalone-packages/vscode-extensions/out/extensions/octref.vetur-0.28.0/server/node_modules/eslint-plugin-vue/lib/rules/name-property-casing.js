/**
 * @fileoverview Requires specific casing for the name property in Vue components
 * @author Armano
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const allowedCaseOptions = ['PascalCase', 'kebab-case']

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce specific casing for the name property in Vue components',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/name-property-casing.html',
      replacedBy: ['component-definition-name-casing']
    },
    deprecated: true,
    fixable: 'code', // or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0]
    const caseType =
      allowedCaseOptions.indexOf(options) !== -1 ? options : 'PascalCase'

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const node = utils.findProperty(obj, 'name')

      if (!node) return
      const valueNode = node.value
      if (valueNode.type !== 'Literal') return

      if (!casing.getChecker(caseType)(`${valueNode.value}`)) {
        const value = casing.getExactConverter(caseType)(`${valueNode.value}`)
        context.report({
          node: valueNode,
          message: 'Property name "{{value}}" is not {{caseType}}.',
          data: {
            value: `${valueNode.value}`,
            caseType
          },
          fix: (fixer) =>
            fixer.replaceText(
              valueNode,
              context
                .getSourceCode()
                .getText(valueNode)
                .replace(`${valueNode.value}`, value)
            )
        })
      }
    })
  }
}
