/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentArrayEmit} ComponentArrayEmit
 * @typedef {import('../utils').ComponentObjectEmit} ComponentObjectEmit
 */

/**
 * Checks if the given node value is falsy.
 * @param {Expression} node The node to check
 * @returns {boolean} If `true`, the given node value is falsy.
 */
function isFalsy(node) {
  if (node.type === 'Literal') {
    if (node.bigint) {
      return node.bigint === '0'
    } else if (!node.value) {
      return true
    }
  } else if (node.type === 'Identifier') {
    if (node.name === 'undefined' || node.name === 'NaN') {
      return true
    }
  }
  return false
}
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in emits validator',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-emits-validator.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {ComponentObjectEmit[]} */
    const emitsValidators = []

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} functionNode
     * @property {boolean} hasReturnValue
     * @property {boolean} possibleOfReturnTrue
     */
    /**
     * @type {ScopeStack | null}
     */
    let scopeStack = null

    return Object.assign(
      {},
      utils.defineVueVisitor(context, {
        /** @param {ObjectExpression} obj */
        onVueObjectEnter(obj) {
          for (const emits of utils.getComponentEmits(obj)) {
            if (!emits.value) {
              continue
            }
            const emitsValue = emits.value
            if (
              emitsValue.type !== 'FunctionExpression' &&
              emitsValue.type !== 'ArrowFunctionExpression'
            ) {
              continue
            }
            emitsValidators.push(emits)
          }
        },
        /** @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node */
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            functionNode: node,
            hasReturnValue: false,
            possibleOfReturnTrue: false
          }

          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            scopeStack.hasReturnValue = true

            if (!isFalsy(node.body)) {
              scopeStack.possibleOfReturnTrue = true
            }
          }
        },
        /** @param {ReturnStatement} node */
        ReturnStatement(node) {
          if (!scopeStack) {
            return
          }
          if (node.argument) {
            scopeStack.hasReturnValue = true

            if (!isFalsy(node.argument)) {
              scopeStack.possibleOfReturnTrue = true
            }
          }
        },
        /** @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node */
        ':function:exit'(node) {
          if (scopeStack && !scopeStack.possibleOfReturnTrue) {
            const emits = emitsValidators.find((e) => e.value === node)
            if (emits) {
              context.report({
                node,
                message: scopeStack.hasReturnValue
                  ? 'Expected to return a true value in "{{name}}" emits validator.'
                  : 'Expected to return a boolean value in "{{name}}" emits validator.',
                data: {
                  name: emits.emitName || 'Unknown'
                }
              })
            }
          }

          scopeStack = scopeStack && scopeStack.upper
        }
      })
    )
  }
}
