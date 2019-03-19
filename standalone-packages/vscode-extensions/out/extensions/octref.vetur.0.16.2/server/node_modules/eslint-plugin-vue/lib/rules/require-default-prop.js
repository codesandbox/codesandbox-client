/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (http://github.com/michalsnik)
 */
'use strict'

const utils = require('../utils')

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol'
])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require default value for props',
      category: 'strongly-recommended',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/require-default-prop.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },

  create (context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * Checks if the passed prop is required
     * @param {Property} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propIsRequired (prop) {
      const propRequiredNode = prop.value.properties
        .find(p =>
          p.type === 'Property' &&
          p.key.name === 'required' &&
          p.value.type === 'Literal' &&
          p.value.value === true
        )

      return Boolean(propRequiredNode)
    }

    /**
     * Checks if the passed prop has a default value
     * @param {Property} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propHasDefault (prop) {
      const propDefaultNode = prop.value.properties
        .find(p =>
          p.key &&
          (p.key.name === 'default' || p.key.value === 'default')
        )

      return Boolean(propDefaultNode)
    }

    /**
     * Finds all props that don't have a default value set
     * @param {Array} props - Vue component's "props" node
     * @return {Array} Array of props without "default" value
     */
    function findPropsWithoutDefaultValue (props) {
      return props
        .filter(prop => {
          if (prop.value.type !== 'ObjectExpression') {
            return (prop.value.type !== 'CallExpression' && prop.value.type !== 'Identifier') || NATIVE_TYPES.has(prop.value.name)
          }

          return !propIsRequired(prop) && !propHasDefault(prop)
        })
    }

    /**
     * Detects whether given value node is a Boolean type
     * @param {Node} value
     * @return {Boolean}
     */
    function isValueNodeOfBooleanType (value) {
      return (
        value.type === 'Identifier' &&
        value.name === 'Boolean'
      ) || (
        value.type === 'ArrayExpression' &&
        value.elements.length === 1 &&
        value.elements[0].type === 'Identifier' &&
        value.elements[0].name === 'Boolean'
      )
    }

    /**
     * Detects whether given prop node is a Boolean
     * @param {Node} prop
     * @return {Boolean}
     */
    function isBooleanProp (prop) {
      const value = utils.unwrapTypes(prop.value)

      return isValueNodeOfBooleanType(value) || (
        value.type === 'ObjectExpression' &&
        value.properties.find(p =>
          p.key.type === 'Identifier' &&
          p.key.name === 'type' &&
          isValueNodeOfBooleanType(p.value)
        )
      )
    }

    /**
     * Excludes purely Boolean props from the Array
     * @param {Array} props - Array with props
     * @return {Array}
     */
    function excludeBooleanProps (props) {
      return props.filter(prop => !isBooleanProp(prop))
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const props = utils.getComponentProps(obj)
        .filter(prop => prop.key && prop.value && !prop.node.shorthand)

      const propsWithoutDefault = findPropsWithoutDefaultValue(props)
      const propsToReport = excludeBooleanProps(propsWithoutDefault)

      for (const prop of propsToReport) {
        context.report({
          node: prop.node,
          message: `Prop '{{propName}}' requires default value to be set.`,
          data: {
            propName: prop.key.name
          }
        })
      }
    })
  }
}
