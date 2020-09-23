/**
 * @fileoverview enforce valid `v-is` directives
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check whether the given node is valid or not.
 * @param {VElement} node The element node to check.
 * @returns {boolean} `true` if the node is valid.
 */
function isValidElement(node) {
  if (
    utils.isHtmlElementNode(node) &&
    !utils.isHtmlWellKnownElementName(node.rawName)
  ) {
    // Vue-component
    return false
  }
  return true
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-is` directives',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-is.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpectedArgument: "'v-is' directives require no argument.",
      unexpectedModifier: "'v-is' directives require no modifier.",
      expectedValue: "'v-is' directives require that attribute value.",
      ownerMustBeHTMLElement:
        "'v-is' directive must be owned by a native HTML element, but '{{name}}' is not."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='is']"(node) {
        if (node.key.argument) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'unexpectedArgument'
          })
        }
        if (node.key.modifiers.length > 0) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'unexpectedModifier'
          })
        }
        if (!node.value || utils.isEmptyValueDirective(node, context)) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'expectedValue'
          })
        }

        const element = node.parent.parent

        if (!isValidElement(element)) {
          const name = element.name
          context.report({
            node,
            loc: node.loc,
            messageId: 'ownerMustBeHTMLElement',
            data: { name }
          })
        }
      }
    })
  }
}
