/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (https://github.com/michalsnik)
 */
'use strict'

/**
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 * @typedef {ComponentObjectProp & { value: ObjectExpression} } ComponentObjectPropObject
 */

const utils = require('../utils')
const { isDef } = require('../utils')

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
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-default-prop.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * Checks if the passed prop is required
     * @param {ComponentObjectPropObject} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propIsRequired(prop) {
      const propRequiredNode = prop.value.properties.find(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'required' &&
          p.value.type === 'Literal' &&
          p.value.value === true
      )

      return Boolean(propRequiredNode)
    }

    /**
     * Checks if the passed prop has a default value
     * @param {ComponentObjectPropObject} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propHasDefault(prop) {
      const propDefaultNode = prop.value.properties.find(
        (p) =>
          p.type === 'Property' && utils.getStaticPropertyName(p) === 'default'
      )

      return Boolean(propDefaultNode)
    }

    /**
     * Finds all props that don't have a default value set
     * @param {ComponentObjectProp[]} props - Vue component's "props" node
     * @return {ComponentObjectProp[]} Array of props without "default" value
     */
    function findPropsWithoutDefaultValue(props) {
      return props.filter((prop) => {
        if (prop.value.type !== 'ObjectExpression') {
          if (prop.value.type === 'Identifier') {
            return NATIVE_TYPES.has(prop.value.name)
          }
          if (
            prop.value.type === 'CallExpression' ||
            prop.value.type === 'MemberExpression'
          ) {
            // OK
            return false
          }
          // NG
          return true
        }

        return (
          !propIsRequired(/** @type {ComponentObjectPropObject} */ (prop)) &&
          !propHasDefault(/** @type {ComponentObjectPropObject} */ (prop))
        )
      })
    }

    /**
     * Detects whether given value node is a Boolean type
     * @param {Expression} value
     * @return {boolean}
     */
    function isValueNodeOfBooleanType(value) {
      if (value.type === 'Identifier' && value.name === 'Boolean') {
        return true
      }
      if (value.type === 'ArrayExpression') {
        const elements = value.elements.filter(isDef)
        return (
          elements.length === 1 &&
          elements[0].type === 'Identifier' &&
          elements[0].name === 'Boolean'
        )
      }
      return false
    }

    /**
     * Detects whether given prop node is a Boolean
     * @param {ComponentObjectProp} prop
     * @return {Boolean}
     */
    function isBooleanProp(prop) {
      const value = utils.skipTSAsExpression(prop.value)

      return (
        isValueNodeOfBooleanType(value) ||
        (value.type === 'ObjectExpression' &&
          value.properties.some(
            (p) =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'type' &&
              isValueNodeOfBooleanType(p.value)
          ))
      )
    }

    /**
     * Excludes purely Boolean props from the Array
     * @param {ComponentObjectProp[]} props - Array with props
     * @return {ComponentObjectProp[]}
     */
    function excludeBooleanProps(props) {
      return props.filter((prop) => !isBooleanProp(prop))
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const props = utils
        .getComponentProps(obj)
        .filter(
          (prop) =>
            prop.value &&
            !(prop.node.type === 'Property' && prop.node.shorthand)
        )

      const propsWithoutDefault = findPropsWithoutDefaultValue(
        /** @type {ComponentObjectProp[]} */ (props)
      )
      const propsToReport = excludeBooleanProps(propsWithoutDefault)

      for (const prop of propsToReport) {
        const propName =
          prop.propName != null
            ? prop.propName
            : `[${context.getSourceCode().getText(prop.node.key)}]`

        context.report({
          node: prop.node,
          message: `Prop '{{propName}}' requires default value to be set.`,
          data: {
            propName
          }
        })
      }
    })
  }
}
