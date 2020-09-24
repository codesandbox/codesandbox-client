/**
 * @fileoverview Report used components that are not registered
 * @author Jesús Ángel González Novez
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('eslint-plugin-vue/lib/utils')
const casing = require('eslint-plugin-vue/lib/utils/casing')

// ------------------------------------------------------------------------------
// Rule helpers
// ------------------------------------------------------------------------------

const VUE_BUILT_IN_COMPONENTS = [
  'component',
  'suspense',
  'teleport',
  'transition',
  'transition-group',
  'keep-alive',
  'slot'
]
/**
 * Check whether the given node is a built-in component or not.
 *
 * Includes `suspense` and `teleport` from Vue 3.
 *
 * @param {VElement} node The start tag node to check.
 * @returns {boolean} `true` if the node is a built-in component.
 */
const isBuiltInComponent = (node) => {
  const rawName = node && casing.kebabCase(node.rawName)
  return (
    utils.isHtmlElementNode(node) &&
    !utils.isHtmlWellKnownElementName(node.rawName) &&
    VUE_BUILT_IN_COMPONENTS.indexOf(rawName) > -1
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow using components that are not registered inside templates',
      categories: null,
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/no-unregistered-components.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    /** @type {string[]} */
    const ignorePatterns = options.ignorePatterns || []
    /** @type { { node: VElement | VDirective | VAttribute, name: string }[] } */
    const usedComponentNodes = []
    /** @type { { node: Property, name: string }[] } */
    const registeredComponents = []

    return utils.defineTemplateBodyVisitor(
      context,
      {
        /** @param {VElement} node */
        VElement(node) {
          if (
            (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
            utils.isHtmlWellKnownElementName(node.rawName) ||
            utils.isSvgWellKnownElementName(node.rawName) ||
            isBuiltInComponent(node)
          ) {
            return
          }

          usedComponentNodes.push({ node, name: node.rawName })
        },
        /** @param {VDirective} node */
        "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is'], VAttribute[directive=true][key.name.name='is']"(
          node
        ) {
          if (
            !node.value ||
            node.value.type !== 'VExpressionContainer' ||
            !node.value.expression
          )
            return

          if (node.value.expression.type === 'Literal') {
            if (
              utils.isHtmlWellKnownElementName(`${node.value.expression.value}`)
            )
              return
            usedComponentNodes.push({
              node,
              name: `${node.value.expression.value}`
            })
          }
        },
        /** @param {VAttribute} node */
        "VAttribute[directive=false][key.name='is']"(node) {
          if (
            !node.value || // `<component is />`
            utils.isHtmlWellKnownElementName(node.value.value)
          )
            return
          usedComponentNodes.push({ node, name: node.value.value })
        },
        /** @param {VElement} node */
        "VElement[name='template']:exit"() {
          // All registered components, transformed to kebab-case
          const registeredComponentNames = registeredComponents.map(
            ({ name }) => casing.kebabCase(name)
          )

          // All registered components using kebab-case syntax
          const componentsRegisteredAsKebabCase = registeredComponents
            .filter(({ name }) => name === casing.kebabCase(name))
            .map(({ name }) => name)

          usedComponentNodes
            .filter(({ name }) => {
              const kebabCaseName = casing.kebabCase(name)

              // Check ignored patterns in first place
              if (
                ignorePatterns.find((pattern) => {
                  const regExp = new RegExp(pattern)
                  return (
                    regExp.test(kebabCaseName) ||
                    regExp.test(casing.pascalCase(name)) ||
                    regExp.test(casing.camelCase(name)) ||
                    regExp.test(casing.snakeCase(name)) ||
                    regExp.test(name)
                  )
                })
              )
                return false

              // Component registered as `foo-bar` cannot be used as `FooBar`
              if (
                casing.isPascalCase(name) &&
                componentsRegisteredAsKebabCase.indexOf(kebabCaseName) !== -1
              ) {
                return true
              }

              // Otherwise
              return registeredComponentNames.indexOf(kebabCaseName) === -1
            })
            .forEach(({ node, name }) =>
              context.report({
                node,
                message:
                  'The "{{name}}" component has been used but not registered.',
                data: {
                  name
                }
              })
            )
        }
      },
      utils.executeOnVue(context, (obj) => {
        registeredComponents.push(...utils.getRegisteredComponents(obj))
      })
    )
  }
}
