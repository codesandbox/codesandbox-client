/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
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

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require type definitions in props',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-prop-types.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * @param {ObjectExpression} node
     * @returns {boolean}
     */
    function objectHasType(node) {
      const typeProperty = node.properties.find(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'type' &&
          (p.value.type !== 'ArrayExpression' || p.value.elements.length > 0)
      )
      const validatorProperty = node.properties.find(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'validator'
      )
      return Boolean(typeProperty || validatorProperty)
    }

    /**
     * @param { ComponentArrayProp | ComponentObjectProp } prop
     */
    function checkProperty({ value, node, propName }) {
      let hasType = true

      if (!value) {
        hasType = false
      } else if (value.type === 'ObjectExpression') {
        // foo: {
        hasType = objectHasType(value)
      } else if (value.type === 'ArrayExpression') {
        // foo: [
        hasType = value.elements.length > 0
      } else if (
        value.type === 'FunctionExpression' ||
        value.type === 'ArrowFunctionExpression'
      ) {
        hasType = false
      }
      if (!hasType) {
        const name =
          propName ||
          (node.type === 'Identifier' && node.name) ||
          'Unknown prop'
        context.report({
          node,
          message: 'Prop "{{name}}" should define at least its type.',
          data: {
            name
          }
        })
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const props = utils.getComponentProps(obj)

      for (const prop of props) {
        checkProperty(prop)
      }
    })
  }
}
