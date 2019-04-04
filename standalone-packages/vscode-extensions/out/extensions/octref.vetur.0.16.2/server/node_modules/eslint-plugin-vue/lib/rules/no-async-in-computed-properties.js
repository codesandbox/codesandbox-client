/**
 * @fileoverview Check if there are no asynchronous actions inside computed properties.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

const PROMISE_FUNCTIONS = [
  'then',
  'catch',
  'finally'
]

const PROMISE_METHODS = [
  'all',
  'race',
  'reject',
  'resolve'
]

const TIMED_FUNCTIONS = [
  'setTimeout',
  'setInterval',
  'setImmediate',
  'requestAnimationFrame'
]

function isTimedFunction (node) {
  return ((
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    TIMED_FUNCTIONS.indexOf(node.callee.name) !== -1
  ) || (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'window' && (
      TIMED_FUNCTIONS.indexOf(node.callee.property.name) !== -1
    )
  )) && node.arguments.length
}

function isPromise (node) {
  if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression') {
    return ( // hello.PROMISE_FUNCTION()
      node.callee.property.type === 'Identifier' &&
      PROMISE_FUNCTIONS.indexOf(node.callee.property.name) !== -1
    ) || ( // Promise.PROMISE_METHOD()
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'Promise' &&
      PROMISE_METHODS.indexOf(node.callee.property.name) !== -1
    )
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
      description: 'disallow asynchronous actions in computed properties',
      category: 'essential',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/no-async-in-computed-properties.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    const forbiddenNodes = []

    const expressionTypes = {
      promise: 'asynchronous action',
      await: 'await operator',
      async: 'async function declaration',
      new: 'Promise object',
      timed: 'timed function'
    }

    function onFunctionEnter (node) {
      if (node.async) {
        forbiddenNodes.push({
          node: node,
          type: 'async'
        })
      }
    }

    return Object.assign({},
      {
        FunctionDeclaration: onFunctionEnter,

        FunctionExpression: onFunctionEnter,

        ArrowFunctionExpression: onFunctionEnter,

        NewExpression (node) {
          if (node.callee.name === 'Promise') {
            forbiddenNodes.push({
              node: node,
              type: 'new'
            })
          }
        },

        CallExpression (node) {
          if (isPromise(node)) {
            forbiddenNodes.push({
              node: node,
              type: 'promise'
            })
          }
          if (isTimedFunction(node)) {
            forbiddenNodes.push({
              node: node,
              type: 'timed'
            })
          }
        },

        AwaitExpression (node) {
          forbiddenNodes.push({
            node: node,
            type: 'await'
          })
        }
      },
      utils.executeOnVue(context, (obj) => {
        const computedProperties = utils.getComputedProperties(obj)

        computedProperties.forEach(cp => {
          forbiddenNodes.forEach(el => {
            if (
              cp.value &&
              el.node.loc.start.line >= cp.value.loc.start.line &&
              el.node.loc.end.line <= cp.value.loc.end.line
            ) {
              context.report({
                node: el.node,
                message: 'Unexpected {{expressionName}} in "{{propertyName}}" computed property.',
                data: {
                  expressionName: expressionTypes[el.type],
                  propertyName: cp.key
                }
              })
            }
          })
        })
      })
    )
  }
}
