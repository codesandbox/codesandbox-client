/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @param {CallExpression | ChainExpression} node
 * @returns {boolean}
 */
function isMaybeUsedStopHandle(node) {
  const parent = node.parent
  if (parent) {
    if (parent.type === 'VariableDeclarator') {
      // var foo = watch()
      return true
    }
    if (parent.type === 'AssignmentExpression') {
      // foo = watch()
      return true
    }
    if (parent.type === 'CallExpression') {
      // foo(watch())
      return true
    }
    if (parent.type === 'Property') {
      // {foo: watch()}
      return true
    }
    if (parent.type === 'ArrayExpression') {
      // [watch()]
      return true
    }
    if (parent.type === 'ChainExpression') {
      return isMaybeUsedStopHandle(parent)
    }
  }
  return false
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow asynchronously registered `watch`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-watch-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: 'The `watch` after `await` expression are forbidden.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const watchCallNodes = new Set()
    /** @type {Map<FunctionExpression | ArrowFunctionExpression | FunctionDeclaration, { setupProperty: Property, afterAwait: boolean }>} */
    const setupFunctions = new Map()

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} functionNode
     */
    /** @type {ScopeStack | null} */
    let scopeStack = null

    return Object.assign(
      {
        Program() {
          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = {
            vue: {
              [ReferenceTracker.ESM]: true,
              watch: {
                [ReferenceTracker.CALL]: true
              },
              watchEffect: {
                [ReferenceTracker.CALL]: true
              }
            }
          }

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            watchCallNodes.add(node)
          }
        }
      },
      utils.defineVueVisitor(context, {
        /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            functionNode: node
          }
        },
        onSetupFunctionEnter(node) {
          setupFunctions.set(node, {
            setupProperty: node.parent,
            afterAwait: false
          })
        },
        AwaitExpression() {
          if (!scopeStack) {
            return
          }
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData) {
            return
          }
          setupFunctionData.afterAwait = true
        },
        /** @param {CallExpression} node */
        CallExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData || !setupFunctionData.afterAwait) {
            return
          }

          if (watchCallNodes.has(node) && !isMaybeUsedStopHandle(node)) {
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        },
        /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
        ':function:exit'(node) {
          scopeStack = scopeStack && scopeStack.upper

          setupFunctions.delete(node)
        }
      })
    )
  }
}
