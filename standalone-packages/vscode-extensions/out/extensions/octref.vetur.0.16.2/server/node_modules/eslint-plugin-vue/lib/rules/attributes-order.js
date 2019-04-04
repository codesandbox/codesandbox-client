/**
 * @fileoverview enforce ordering of attributes
 * @author Erin Depew
 */
'use strict'
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function getAttributeType (name, isDirective) {
  if (isDirective) {
    if (name === 'for') {
      return 'LIST_RENDERING'
    } else if (name === 'if' || name === 'else-if' || name === 'else' || name === 'show' || name === 'cloak') {
      return 'CONDITIONALS'
    } else if (name === 'pre' || name === 'once') {
      return 'RENDER_MODIFIERS'
    } else if (name === 'model') {
      return 'TWO_WAY_BINDING'
    } else if (name === 'on') {
      return 'EVENTS'
    } else if (name === 'html' || name === 'text') {
      return 'CONTENT'
    } else {
      return 'OTHER_DIRECTIVES'
    }
  } else {
    if (name === 'is') {
      return 'DEFINITION'
    } else if (name === 'id') {
      return 'GLOBAL'
    } else if (name === 'ref' || name === 'key' || name === 'slot' || name === 'slot-scope') {
      return 'UNIQUE'
    } else {
      return 'OTHER_ATTR'
    }
  }
}
function getPosition (attribute, attributePosition) {
  const attributeType = attribute.directive && attribute.key.name === 'bind'
    ? getAttributeType(attribute.key.argument, false)
    : getAttributeType(attribute.key.name, attribute.directive)
  return attributePosition.hasOwnProperty(attributeType) ? attributePosition[attributeType] : -1
}

function create (context) {
  const sourceCode = context.getSourceCode()
  let attributeOrder = ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT']
  if (context.options[0] && context.options[0].order) {
    attributeOrder = context.options[0].order
  }
  const attributePosition = {}
  attributeOrder.forEach((item, i) => {
    if (item instanceof Array) {
      item.forEach((attr) => {
        attributePosition[attr] = i
      })
    } else attributePosition[item] = i
  })
  let currentPosition
  let previousNode

  function reportIssue (node, previousNode) {
    const currentNode = sourceCode.getText(node.key)
    const prevNode = sourceCode.getText(previousNode.key)
    context.report({
      node: node.key,
      loc: node.loc,
      message: `Attribute "${currentNode}" should go before "${prevNode}".`,
      data: {
        currentNode
      },

      fix (fixer) {
        const attributes = node.parent.attributes
        const shiftAttrs = attributes.slice(attributes.indexOf(previousNode), attributes.indexOf(node) + 1)

        return shiftAttrs.map((attr, i) => {
          const text = attr === previousNode ? sourceCode.getText(node) : sourceCode.getText(shiftAttrs[i - 1])
          return fixer.replaceText(attr, text)
        })
      }
    })
  }

  return utils.defineTemplateBodyVisitor(context, {
    'VStartTag' () {
      currentPosition = -1
      previousNode = null
    },
    'VAttribute' (node) {
      if ((currentPosition === -1) || (currentPosition <= getPosition(node, attributePosition))) {
        currentPosition = getPosition(node, attributePosition)
        previousNode = node
      } else {
        reportIssue(node, previousNode)
      }
    }
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of attributes',
      category: 'recommended',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/attributes-order.html'
    },
    fixable: 'code',
    schema: {
      type: 'array',
      properties: {
        order: {
          items: {
            type: 'string'
          },
          maxItems: 10,
          minItems: 10
        }
      }
    }
  },
  create
}
