/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker, findVariable } = require('eslint-utils')
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow use of value wrapped by `ref()` (Composition API) as an operand',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-ref-as-operand.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireDotValue:
        'Must use `.value` to read or write the value wrapped by `{{method}}()`.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} ReferenceData
     * @property {VariableDeclarator} variableDeclarator
     * @property {VariableDeclaration | null} variableDeclaration
     * @property {string} method
     */
    /** @type {Map<Identifier, ReferenceData>} */
    const refReferenceIds = new Map()

    /**
     * @param {Identifier} node
     */
    function reportIfRefWrapped(node) {
      const data = refReferenceIds.get(node)
      if (!data) {
        return
      }
      context.report({
        node,
        messageId: 'requireDotValue',
        data: {
          method: data.method
        }
      })
    }
    return {
      Program() {
        const tracker = new ReferenceTracker(context.getScope())
        const traceMap = utils.createCompositionApiTraceMap({
          [ReferenceTracker.ESM]: true,
          ref: {
            [ReferenceTracker.CALL]: true
          },
          computed: {
            [ReferenceTracker.CALL]: true
          },
          toRef: {
            [ReferenceTracker.CALL]: true
          },
          customRef: {
            [ReferenceTracker.CALL]: true
          },
          shallowRef: {
            [ReferenceTracker.CALL]: true
          }
        })

        for (const { node, path } of tracker.iterateEsmReferences(traceMap)) {
          const variableDeclarator = node.parent
          if (
            !variableDeclarator ||
            variableDeclarator.type !== 'VariableDeclarator' ||
            variableDeclarator.id.type !== 'Identifier'
          ) {
            continue
          }
          const variable = findVariable(
            context.getScope(),
            variableDeclarator.id
          )
          if (!variable) {
            continue
          }
          const variableDeclaration =
            (variableDeclarator.parent &&
              variableDeclarator.parent.type === 'VariableDeclaration' &&
              variableDeclarator.parent) ||
            null
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }

            refReferenceIds.set(reference.identifier, {
              variableDeclarator,
              variableDeclaration,
              method: path[1]
            })
          }
        }
      },
      // if (refValue)
      /** @param {Identifier} node */
      'IfStatement>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // switch (refValue)
      /** @param {Identifier} node */
      'SwitchStatement>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // -refValue, +refValue, !refValue, ~refValue, typeof refValue
      /** @param {Identifier} node */
      'UnaryExpression>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // refValue++, refValue--
      /** @param {Identifier} node */
      'UpdateExpression>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // refValue+1, refValue-1
      /** @param {Identifier} node */
      'BinaryExpression>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // refValue+=1, refValue-=1, foo+=refValue, foo-=refValue
      /** @param {Identifier} node */
      'AssignmentExpression>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // refValue || other, refValue && other. ignore: other || refValue
      /** @param {Identifier & {parent: LogicalExpression}} node */
      'LogicalExpression>Identifier'(node) {
        if (node.parent.left !== node) {
          return
        }
        // Report only constants.
        const data = refReferenceIds.get(node)
        if (!data) {
          return
        }
        if (
          !data.variableDeclaration ||
          data.variableDeclaration.kind !== 'const'
        ) {
          return
        }
        reportIfRefWrapped(node)
      },
      // refValue ? x : y
      /** @param {Identifier & {parent: ConditionalExpression}} node */
      'ConditionalExpression>Identifier'(node) {
        if (node.parent.test !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // `${refValue}`
      /** @param {Identifier} node */
      'TemplateLiteral>Identifier'(node) {
        reportIfRefWrapped(node)
      },
      // refValue.x
      /** @param {Identifier & {parent: MemberExpression}} node */
      'MemberExpression>Identifier'(node) {
        if (node.parent.object !== node) {
          return
        }
        const name = utils.getStaticPropertyName(node.parent)
        if (
          name === 'value' ||
          name == null ||
          // WritableComputedRef
          name === 'effect'
        ) {
          return
        }
        reportIfRefWrapped(node)
      }
    }
  }
}
