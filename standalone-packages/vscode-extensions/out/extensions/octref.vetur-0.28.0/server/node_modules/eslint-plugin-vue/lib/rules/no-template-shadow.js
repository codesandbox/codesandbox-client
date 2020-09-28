/**
 * @fileoverview Disallow variable declarations from shadowing variables declared in the outer scope.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

/**
 * @typedef {import('../utils').GroupName} GroupName
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {GroupName[]} */
const GROUP_NAMES = ['props', 'computed', 'data', 'methods']

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow variable declarations from shadowing variables declared in the outer scope',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-template-shadow.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Set<string>} */
    const jsVars = new Set()

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} parent
     * @property {Identifier[]} nodes
     */
    /** @type {ScopeStack | null} */
    let scopeStack = null

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(
      context,
      {
        /** @param {VElement} node */
        VElement(node) {
          scopeStack = {
            parent: scopeStack,
            nodes: scopeStack
              ? scopeStack.nodes.slice() // make copy
              : []
          }
          if (node.variables) {
            for (const variable of node.variables) {
              const varNode = variable.id
              const name = varNode.name
              if (
                scopeStack.nodes.some((node) => node.name === name) ||
                jsVars.has(name)
              ) {
                context.report({
                  node: varNode,
                  loc: varNode.loc,
                  message:
                    "Variable '{{name}}' is already declared in the upper scope.",
                  data: {
                    name
                  }
                })
              } else {
                scopeStack.nodes.push(varNode)
              }
            }
          }
        },
        'VElement:exit'() {
          scopeStack = scopeStack && scopeStack.parent
        }
      },
      utils.executeOnVue(context, (obj) => {
        const properties = Array.from(
          utils.iterateProperties(obj, new Set(GROUP_NAMES))
        )
        for (const node of properties) {
          jsVars.add(node.name)
        }
      })
    )
  }
}
