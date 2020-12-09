/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentArrayProp} ComponentArrayProp
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @param {Property | SpreadElement} prop
 */
function isBooleanProp(prop) {
  return (
    prop.type === 'Property' &&
    prop.key.type === 'Identifier' &&
    prop.key.name === 'type' &&
    prop.value.type === 'Identifier' &&
    prop.value.name === 'Boolean'
  )
}

/**
 * @typedef {ComponentObjectProp & { value : ObjectExpression }} ObjectExpressionProp
 */

/**
 * @param {(ComponentArrayProp | ComponentObjectProp)[]} props
 * @returns {ObjectExpressionProp[]}
 */
function getBooleanProps(props) {
  return props.filter(
    /**
     * @param {ComponentArrayProp | ComponentObjectProp} prop
     * @returns {prop is ObjectExpressionProp}
     */
    (prop) =>
      prop.value != null &&
      prop.value.type === 'ObjectExpression' &&
      prop.value.properties.some(isBooleanProp)
  )
}

/**
 * @param {ObjectExpressionProp} propDef
 */
function getDefaultNode(propDef) {
  return utils.findProperty(propDef.value, 'default')
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow boolean defaults',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-boolean-default.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['default-false', 'no-default']
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.executeOnVueComponent(context, (obj) => {
      const props = utils.getComponentProps(obj)
      const booleanProps = getBooleanProps(props)

      if (!booleanProps.length) return

      const booleanType = context.options[0] || 'no-default'

      booleanProps.forEach((propDef) => {
        const defaultNode = getDefaultNode(propDef)
        if (!defaultNode) {
          return
        }

        switch (booleanType) {
          case 'no-default':
            context.report({
              node: defaultNode,
              message:
                'Boolean prop should not set a default (Vue defaults it to false).'
            })
            break

          case 'default-false':
            if (
              defaultNode.value.type !== 'Literal' ||
              defaultNode.value.value !== false
            ) {
              context.report({
                node: defaultNode,
                message: 'Boolean prop should only be defaulted to false.'
              })
            }
            break
        }
      })
    })
  }
}
