/**
 * @author Yosuke Ota
 *
 * issue        https://github.com/vuejs/eslint-plugin-vue/issues/403
 * Style guide: https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential
 *
 * I implemented it with reference to `no-confusing-v-for-v-if`
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
 * @param {ASTNode} vIf The `v-if` attribute node to check.
 * @returns {boolean} `true` if the `v-if` is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar (vIf) {
  return !!getVForUsingIterationVar(vIf)
}

function getVForUsingIterationVar (vIf) {
  const element = vIf.parent.parent
  for (var i = 0; i < vIf.value.references.length; i++) {
    const reference = vIf.value.references[i]

    const targetVFor = element.variables.find(variable =>
      variable.id.name === reference.id.name &&
      variable.kind === 'v-for'
    )
    if (targetVFor) {
      return targetVFor.id.parent
    }
  }
  return undefined
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use v-if on the same element as v-for',
      category: 'essential',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/no-use-v-if-with-v-for.html'
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        allowUsingIterationVar: {
          type: 'boolean'
        }
      }
    }]
  },

  create (context) {
    const options = context.options[0] || {}
    const allowUsingIterationVar = options.allowUsingIterationVar === true // default false
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='if']" (node) {
        const element = node.parent.parent

        if (utils.hasDirective(element, 'for')) {
          if (isUsingIterationVar(node)) {
            if (!allowUsingIterationVar) {
              const vFor = getVForUsingIterationVar(node)
              context.report({
                node,
                loc: node.loc,
                message: "The '{{iteratorName}}' variable inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'.",
                data: {
                  iteratorName: vFor.right.name
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
