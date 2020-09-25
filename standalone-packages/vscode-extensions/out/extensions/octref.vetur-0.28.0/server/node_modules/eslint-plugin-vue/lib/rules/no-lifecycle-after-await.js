/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('eslint-utils').TYPES.TraceMap} TraceMap
 */

const LIFECYCLE_HOOKS = [
  'onBeforeMount',
  'onBeforeUnmount',
  'onBeforeUpdate',
  'onErrorCaptured',
  'onMounted',
  'onRenderTracked',
  'onRenderTriggered',
  'onUnmounted',
  'onUpdated',
  'onActivated',
  'onDeactivated'
]

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow asynchronously registered lifecycle hooks',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-lifecycle-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: 'The lifecycle hooks after `await` expression are forbidden.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} SetupFunctionData
     * @property {Property} setupProperty
     * @property {boolean} afterAwait
     */
    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} functionNode
     */
    /** @type {Set<ESNode>} */
    const lifecycleHookCallNodes = new Set()
    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, SetupFunctionData>} */
    const setupFunctions = new Map()

    /** @type {ScopeStack | null} */
    let scopeStack = null

    return Object.assign(
      {
        Program() {
          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = {
            /** @type {TraceMap} */
            vue: {
              [ReferenceTracker.ESM]: true
            }
          }
          for (const lifecycleHook of LIFECYCLE_HOOKS) {
            traceMap.vue[lifecycleHook] = {
              [ReferenceTracker.CALL]: true
            }
          }

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            lifecycleHookCallNodes.add(node)
          }
        }
      },
      utils.defineVueVisitor(context, {
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
        CallExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData || !setupFunctionData.afterAwait) {
            return
          }

          if (lifecycleHookCallNodes.has(node)) {
            if (node.arguments.length >= 2) {
              // Has target instance. e.g. `onMounted(() => {}, instance)`
              return
            }
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        },
        ':function:exit'(node) {
          scopeStack = scopeStack && scopeStack.upper

          setupFunctions.delete(node)
        }
      })
    )
  }
}
