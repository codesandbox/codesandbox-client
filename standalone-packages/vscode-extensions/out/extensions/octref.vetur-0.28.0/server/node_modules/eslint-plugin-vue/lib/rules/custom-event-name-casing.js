/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { findVariable } = require('eslint-utils')
const utils = require('../utils')
const { isKebabCase } = require('../utils/casing')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check whether the given event name is valid.
 * @param {string} name The name to check.
 * @returns {boolean} `true` if the given event name is valid.
 */
function isValidEventName(name) {
  return isKebabCase(name) || name.startsWith('update:')
}

/**
 * Get the name param node from the given CallExpression
 * @param {CallExpression} node CallExpression
 * @returns { Literal & { value: string } | null }
 */
function getNameParamNode(node) {
  const nameLiteralNode = node.arguments[0]
  if (
    !nameLiteralNode ||
    nameLiteralNode.type !== 'Literal' ||
    typeof nameLiteralNode.value !== 'string'
  ) {
    // cannot check
    return null
  }

  return /** @type {Literal & { value: string }} */ (nameLiteralNode)
}
/**
 * Get the callee member node from the given CallExpression
 * @param {CallExpression} node CallExpression
 */
function getCalleeMemberNode(node) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
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
      description: 'enforce custom event names always use "kebab-case"',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/custom-event-name-casing.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: "Custom event name '{{name}}' must be kebab-case."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const setupContexts = new Map()

    /**
     * @param { Literal & { value: string } } nameLiteralNode
     */
    function verify(nameLiteralNode) {
      const name = nameLiteralNode.value
      if (isValidEventName(name)) {
        return
      }
      context.report({
        node: nameLiteralNode,
        messageId: 'unexpected',
        data: {
          name
        }
      })
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        CallExpression(node) {
          const callee = node.callee
          const nameLiteralNode = getNameParamNode(node)
          if (!nameLiteralNode) {
            // cannot check
            return
          }
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            verify(nameLiteralNode)
          }
        }
      },
      utils.compositingVisitors(
        utils.defineVueVisitor(context, {
          onSetupFunctionEnter(node, { node: vueNode }) {
            const contextParam = utils.skipDefaultParamValue(node.params[1])
            if (!contextParam) {
              // no arguments
              return
            }
            if (
              contextParam.type === 'RestElement' ||
              contextParam.type === 'ArrayPattern'
            ) {
              // cannot check
              return
            }
            const contextReferenceIds = new Set()
            const emitReferenceIds = new Set()
            if (contextParam.type === 'ObjectPattern') {
              const emitProperty = utils.findAssignmentProperty(
                contextParam,
                'emit'
              )
              if (!emitProperty || emitProperty.value.type !== 'Identifier') {
                return
              }
              const emitParam = emitProperty.value
              // `setup(props, {emit})`
              const variable = findVariable(context.getScope(), emitParam)
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                emitReferenceIds.add(reference.identifier)
              }
            } else {
              // `setup(props, context)`
              const variable = findVariable(context.getScope(), contextParam)
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                contextReferenceIds.add(reference.identifier)
              }
            }
            setupContexts.set(vueNode, {
              contextReferenceIds,
              emitReferenceIds
            })
          },
          CallExpression(node, { node: vueNode }) {
            const nameLiteralNode = getNameParamNode(node)
            if (!nameLiteralNode) {
              // cannot check
              return
            }

            // verify setup context
            const setupContext = setupContexts.get(vueNode)
            if (setupContext) {
              const { contextReferenceIds, emitReferenceIds } = setupContext
              if (emitReferenceIds.has(node.callee)) {
                // verify setup(props,{emit}) {emit()}
                verify(nameLiteralNode)
              } else {
                const emit = getCalleeMemberNode(node)
                if (
                  emit &&
                  emit.name === 'emit' &&
                  contextReferenceIds.has(emit.member.object)
                ) {
                  // verify setup(props,context) {context.emit()}
                  verify(nameLiteralNode)
                }
              }
            }
          },
          onVueObjectExit(node) {
            setupContexts.delete(node)
          }
        }),
        {
          CallExpression(node) {
            const nameLiteralNode = getNameParamNode(node)
            if (!nameLiteralNode) {
              // cannot check
              return
            }
            const emit = getCalleeMemberNode(node)
            // verify $emit
            if (emit && emit.name === '$emit') {
              // verify this.$emit()
              verify(nameLiteralNode)
            }
          }
        }
      )
    )
  }
}
