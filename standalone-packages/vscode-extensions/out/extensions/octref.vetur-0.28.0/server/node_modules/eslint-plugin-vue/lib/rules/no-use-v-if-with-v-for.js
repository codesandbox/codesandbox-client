/**
 * @author Yosuke Ota
 *
 * Style guide: https://v3.vuejs.org/style-guide/#avoid-v-if-with-v-for-essential
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
 * Check whether the given `v-if` node is using the variable which is defined by the `v-for` directive.
 * @param {VDirective} vIf The `v-if` attribute node to check.
 * @returns {boolean} `true` if the `v-if` is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar(vIf) {
  return !!getVForUsingIterationVar(vIf)
}

/** @param {VDirective} vIf */
function getVForUsingIterationVar(vIf) {
  if (!vIf.value) {
    return null
  }
  const element = vIf.parent.parent
  for (const reference of vIf.value.references) {
    const targetVFor = element.variables.find(
      (variable) =>
        variable.id.name === reference.id.name && variable.kind === 'v-for'
    )
    if (targetVFor) {
      return targetVFor
    }
  }
  return null
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use v-if on the same element as v-for',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowUsingIterationVar: {
            type: 'boolean'
          }
        }
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const allowUsingIterationVar = options.allowUsingIterationVar === true // default false
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='if']"(node) {
        const element = node.parent.parent

        if (utils.hasDirective(element, 'for')) {
          if (isUsingIterationVar(node)) {
            if (!allowUsingIterationVar) {
              const vForVar = getVForUsingIterationVar(node)
              if (!vForVar) {
                return
              }

              let targetVForExpr = vForVar.id.parent
              while (targetVForExpr.type !== 'VForExpression') {
                targetVForExpr = /** @type {ASTNode} */ (targetVForExpr.parent)
              }
              const iteratorNode = targetVForExpr.right
              context.report({
                node,
                loc: node.loc,
                message:
                  "The '{{iteratorName}}' {{kind}} inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
                data: {
                  iteratorName:
                    iteratorNode.type === 'Identifier'
                      ? iteratorNode.name
                      : context.getSourceCode().getText(iteratorNode),
                  kind:
                    iteratorNode.type === 'Identifier'
                      ? 'variable'
                      : 'expression'
                }
              })
            }
          } else {
            context.report({
              node,
              loc: node.loc,
              message: "This 'v-if' should be moved to the wrapper element."
            })
          }
        }
      }
    })
  }
}
