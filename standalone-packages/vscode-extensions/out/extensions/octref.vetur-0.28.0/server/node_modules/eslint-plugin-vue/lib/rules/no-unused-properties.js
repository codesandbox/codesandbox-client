/**
 * @fileoverview Disallow unused properties, data and computed properties.
 * @author Learning Equality
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const eslintUtils = require('eslint-utils')

/**
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').VueObjectData} VueObjectData
 */
/**
 * @typedef {object} TemplatePropertiesContainer
 * @property {Set<string>} usedNames
 * @property {Set<string>} refNames
 * @typedef {object} VueComponentPropertiesContainer
 * @property {ComponentPropertyData[]} properties
 * @property {Set<string>} usedNames
 * @property {boolean} unknown
 * @property {Set<string>} usedPropsNames
 * @property {boolean} unknownProps
 * @typedef { { node: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration, index: number } } CallIdAndParamIndex
 * @typedef { { usedNames: UsedNames, unknown: boolean } } UsedProperties
 * @typedef { (context: RuleContext) => UsedProps } UsedPropsTracker
 */

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const GROUP_PROPERTY = 'props'
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_METHODS = 'methods'
const GROUP_SETUP = 'setup'
const GROUP_WATCHER = 'watch'

const PROPERTY_LABEL = {
  props: 'property',
  data: 'data',
  computed: 'computed property',
  methods: 'method',
  setup: 'property returned from `setup()`',
  watch: 'watch'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Find the variable of a given name.
 * @param {RuleContext} context The rule context
 * @param {Identifier} node The variable name to find.
 * @returns {Variable|null} The found variable or null.
 */
function findVariable(context, node) {
  return eslintUtils.findVariable(getScope(context, node), node)
}
/**
 * Gets the scope for the current node
 * @param {RuleContext} context The rule context
 * @param {ESNode} currentNode The node to get the scope of
 * @returns { import('eslint').Scope.Scope } The scope information for this node
 */
function getScope(context, currentNode) {
  // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
  const inner = currentNode.type !== 'Program'
  const scopeManager = context.getSourceCode().scopeManager

  /** @type {ESNode | null} */
  let node = currentNode
  for (; node; node = /** @type {ESNode | null} */ (node.parent)) {
    const scope = scopeManager.acquire(node, inner)

    if (scope) {
      if (scope.type === 'function-expression-name') {
        return scope.childScopes[0]
      }
      return scope
    }
  }

  return scopeManager.scopes[0]
}

/**
 * Extract names from references objects.
 * @param {VReference[]} references
 */
function getReferencesNames(references) {
  return references
    .filter((ref) => ref.variable == null)
    .map((ref) => ref.id.name)
}

class UsedNames {
  constructor() {
    /** @type {Map<string, UsedPropsTracker[]>} */
    this.map = new Map()
  }
  /**
   * @returns {IterableIterator<string>}
   */
  names() {
    return this.map.keys()
  }
  /**
   * @param {string} name
   * @returns {UsedPropsTracker[]}
   */
  get(name) {
    return this.map.get(name) || []
  }
  /**
   * @param {string} name
   * @param {UsedPropsTracker} tracker
   */
  add(name, tracker) {
    const list = this.map.get(name)
    if (list) {
      list.push(tracker)
    } else {
      this.map.set(name, [tracker])
    }
  }
  /**
   * @param {UsedNames} other
   */
  addAll(other) {
    other.map.forEach((trackers, name) => {
      const list = this.map.get(name)
      if (list) {
        list.push(...trackers)
      } else {
        this.map.set(name, trackers)
      }
    })
  }
}

/**
 * @param {ObjectPattern} node
 * @returns {UsedProperties}
 */
function extractObjectPatternProperties(node) {
  const usedNames = new UsedNames()
  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      const name = utils.getStaticPropertyName(prop)
      if (name) {
        usedNames.add(name, getObjectPatternPropertyPatternTracker(prop.value))
      } else {
        // If cannot trace name, everything is used!
        return {
          usedNames,
          unknown: true
        }
      }
    } else {
      // If use RestElement, everything is used!
      return {
        usedNames,
        unknown: true
      }
    }
  }
  return {
    usedNames,
    unknown: false
  }
}

/**
 * @param {Pattern} pattern
 * @returns {UsedPropsTracker}
 */
function getObjectPatternPropertyPatternTracker(pattern) {
  if (pattern.type === 'ObjectPattern') {
    return () => {
      const result = new UsedProps()
      const { usedNames, unknown } = extractObjectPatternProperties(pattern)
      result.usedNames.addAll(usedNames)
      result.unknown = unknown
      return result
    }
  }
  if (pattern.type === 'Identifier') {
    return (context) => {
      const result = new UsedProps()
      const variable = findVariable(context, pattern)
      if (!variable) {
        return result
      }
      for (const reference of variable.references) {
        const id = reference.identifier
        const { usedNames, unknown, calls } = extractPatternOrThisProperties(
          id,
          context
        )
        result.usedNames.addAll(usedNames)
        result.unknown = result.unknown || unknown
        result.calls.push(...calls)
      }
      return result
    }
  } else if (pattern.type === 'AssignmentPattern') {
    return getObjectPatternPropertyPatternTracker(pattern.left)
  }
  return () => {
    const result = new UsedProps()
    result.unknown = true
    return result
  }
}

/**
 * @param {Identifier | MemberExpression | ChainExpression | ThisExpression} node
 * @param {RuleContext} context
 * @returns {UsedProps}
 */
function extractPatternOrThisProperties(node, context) {
  const result = new UsedProps()
  const parent = node.parent
  if (parent.type === 'AssignmentExpression') {
    if (parent.right === node && parent.left.type === 'ObjectPattern') {
      // `({foo} = arg)`
      const { usedNames, unknown } = extractObjectPatternProperties(parent.left)
      result.usedNames.addAll(usedNames)
      result.unknown = result.unknown || unknown
    }
    return result
  } else if (parent.type === 'VariableDeclarator') {
    if (parent.init === node) {
      if (parent.id.type === 'ObjectPattern') {
        // `const {foo} = arg`
        const { usedNames, unknown } = extractObjectPatternProperties(parent.id)
        result.usedNames.addAll(usedNames)
        result.unknown = result.unknown || unknown
      } else if (parent.id.type === 'Identifier') {
        // `const foo = arg`
        const variable = findVariable(context, parent.id)
        if (!variable) {
          return result
        }
        for (const reference of variable.references) {
          const id = reference.identifier
          const { usedNames, unknown, calls } = extractPatternOrThisProperties(
            id,
            context
          )
          result.usedNames.addAll(usedNames)
          result.unknown = result.unknown || unknown
          result.calls.push(...calls)
        }
      }
    }
    return result
  } else if (parent.type === 'MemberExpression') {
    if (parent.object === node) {
      // `arg.foo`
      const name = utils.getStaticPropertyName(parent)
      if (name) {
        result.usedNames.add(name, () =>
          extractPatternOrThisProperties(parent, context)
        )
      } else {
        result.unknown = true
      }
    }
    return result
  } else if (parent.type === 'CallExpression') {
    const argIndex = parent.arguments.indexOf(node)
    if (argIndex > -1 && parent.callee.type === 'Identifier') {
      // `foo(arg)`
      const calleeVariable = findVariable(context, parent.callee)
      if (!calleeVariable) {
        return result
      }
      if (calleeVariable.defs.length === 1) {
        const def = calleeVariable.defs[0]
        if (
          def.type === 'Variable' &&
          def.parent.kind === 'const' &&
          def.node.init &&
          (def.node.init.type === 'FunctionExpression' ||
            def.node.init.type === 'ArrowFunctionExpression')
        ) {
          result.calls.push({
            node: def.node.init,
            index: argIndex
          })
        } else if (def.node.type === 'FunctionDeclaration') {
          result.calls.push({
            node: def.node,
            index: argIndex
          })
        }
      }
    }
  } else if (parent.type === 'ChainExpression') {
    const { usedNames, unknown, calls } = extractPatternOrThisProperties(
      parent,
      context
    )
    result.usedNames.addAll(usedNames)
    result.unknown = result.unknown || unknown
    result.calls.push(...calls)
  }
  return result
}

/**
 * Collects the property names used.
 */
class UsedProps {
  constructor() {
    this.usedNames = new UsedNames()
    /** @type {CallIdAndParamIndex[]} */
    this.calls = []
    this.unknown = false
  }
}

/**
 * Collects the property names used for one parameter of the function.
 */
class ParamUsedProps extends UsedProps {
  /**
   * @param {Pattern} paramNode
   * @param {RuleContext} context
   */
  constructor(paramNode, context) {
    super()
    while (paramNode.type === 'AssignmentPattern') {
      paramNode = paramNode.left
    }
    if (paramNode.type === 'RestElement' || paramNode.type === 'ArrayPattern') {
      // cannot check
      return
    }
    if (paramNode.type === 'ObjectPattern') {
      const { usedNames, unknown } = extractObjectPatternProperties(paramNode)
      this.usedNames.addAll(usedNames)
      this.unknown = this.unknown || unknown
      return
    }
    if (paramNode.type !== 'Identifier') {
      return
    }
    const variable = findVariable(context, paramNode)
    if (!variable) {
      return
    }
    for (const reference of variable.references) {
      const id = reference.identifier
      const { usedNames, unknown, calls } = extractPatternOrThisProperties(
        id,
        context
      )
      this.usedNames.addAll(usedNames)
      this.unknown = this.unknown || unknown
      this.calls.push(...calls)
    }
  }
}

/**
 * Collects the property names used for parameters of the function.
 */
class ParamsUsedProps {
  /**
   * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
   * @param {RuleContext} context
   */
  constructor(node, context) {
    this.node = node
    this.context = context
    /** @type {ParamUsedProps[]} */
    this.params = []
  }

  /**
   * @param {number} index
   * @returns {ParamUsedProps | null}
   */
  getParam(index) {
    const param = this.params[index]
    if (param != null) {
      return param
    }
    if (this.node.params[index]) {
      return (this.params[index] = new ParamUsedProps(
        this.node.params[index],
        this.context
      ))
    }
    return null
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused properties',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-properties.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              enum: [
                GROUP_PROPERTY,
                GROUP_DATA,
                GROUP_COMPUTED_PROPERTY,
                GROUP_METHODS,
                GROUP_SETUP
              ]
            },
            additionalItems: false,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unused: "'{{name}}' of {{group}} found, but never used."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const groups = new Set(options.groups || [GROUP_PROPERTY])

    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, ParamsUsedProps>} */
    const paramsUsedPropsMap = new Map()
    /** @type {TemplatePropertiesContainer} */
    const templatePropertiesContainer = {
      usedNames: new Set(),
      refNames: new Set()
    }
    /** @type {Map<ASTNode, VueComponentPropertiesContainer>} */
    const vueComponentPropertiesContainerMap = new Map()

    /**
     * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
     * @returns {ParamsUsedProps}
     */
    function getParamsUsedProps(node) {
      let usedProps = paramsUsedPropsMap.get(node)
      if (!usedProps) {
        usedProps = new ParamsUsedProps(node, context)
        paramsUsedPropsMap.set(node, usedProps)
      }
      return usedProps
    }

    /**
     * @param {ASTNode} node
     * @returns {VueComponentPropertiesContainer}
     */
    function getVueComponentPropertiesContainer(node) {
      let container = vueComponentPropertiesContainerMap.get(node)
      if (!container) {
        container = {
          properties: [],
          usedNames: new Set(),
          usedPropsNames: new Set(),
          unknown: false,
          unknownProps: false
        }
        vueComponentPropertiesContainerMap.set(node, container)
      }
      return container
    }

    /**
     * Report all unused properties.
     */
    function reportUnusedProperties() {
      for (const container of vueComponentPropertiesContainerMap.values()) {
        if (container.unknown) {
          // unknown
          continue
        }
        for (const property of container.properties) {
          if (
            container.usedNames.has(property.name) ||
            templatePropertiesContainer.usedNames.has(property.name)
          ) {
            // used
            continue
          }
          if (
            property.groupName === 'props' &&
            (container.unknownProps ||
              container.usedPropsNames.has(property.name))
          ) {
            // used props
            continue
          }
          if (
            property.groupName === 'setup' &&
            templatePropertiesContainer.refNames.has(property.name)
          ) {
            // used template refs
            continue
          }
          context.report({
            node: property.node,
            messageId: 'unused',
            data: {
              group: PROPERTY_LABEL[property.groupName],
              name: property.name
            }
          })
        }
      }
    }

    /**
     * @param {UsedProps} usedProps
     * @param {Map<ASTNode,Set<number>>} already
     * @returns {IterableIterator<UsedProps>}
     */
    function* iterateUsedProps(usedProps, already = new Map()) {
      yield usedProps
      for (const call of usedProps.calls) {
        let alreadyIndexes = already.get(call.node)
        if (!alreadyIndexes) {
          alreadyIndexes = new Set()
          already.set(call.node, alreadyIndexes)
        }
        if (alreadyIndexes.has(call.index)) {
          continue
        }
        alreadyIndexes.add(call.index)
        const paramsUsedProps = getParamsUsedProps(call.node)
        const paramUsedProps = paramsUsedProps.getParam(call.index)
        if (!paramUsedProps) {
          continue
        }
        yield paramUsedProps
        yield* iterateUsedProps(paramUsedProps, already)
      }
    }

    /**
     * @param {VueComponentPropertiesContainer} container
     * @param {UsedProps} baseUseProps
     */
    function processParamPropsUsed(container, baseUseProps) {
      for (const { usedNames, unknown } of iterateUsedProps(baseUseProps)) {
        if (unknown) {
          container.unknownProps = true
          return
        }
        for (const name of usedNames.names()) {
          container.usedPropsNames.add(name)
        }
      }
    }

    const scriptVisitor = Object.assign(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          const container = getVueComponentPropertiesContainer(node)
          const watcherUsedProperties = new Set()
          for (const watcher of utils.iterateProperties(
            node,
            new Set([GROUP_WATCHER])
          )) {
            // Process `watch: { foo /* <- this */ () {} }`
            let path
            for (const seg of watcher.name.split('.')) {
              path = path ? `${path}.${seg}` : seg
              watcherUsedProperties.add(path)
            }

            // Process `watch: { x: 'foo' /* <- this */  }`
            if (watcher.type === 'object') {
              const property = watcher.property
              if (property.kind === 'init') {
                /** @type {Expression | null} */
                let handlerValueNode = null
                if (property.value.type === 'ObjectExpression') {
                  const handler = utils.findProperty(property.value, 'handler')
                  if (handler) {
                    handlerValueNode = handler.value
                  }
                } else {
                  handlerValueNode = property.value
                }
                if (
                  handlerValueNode &&
                  (handlerValueNode.type === 'Literal' ||
                    handlerValueNode.type === 'TemplateLiteral')
                ) {
                  const name = utils.getStringLiteralValue(handlerValueNode)
                  if (name != null) {
                    watcherUsedProperties.add(name)
                  }
                }
              }
            }
          }
          for (const prop of utils.iterateProperties(node, groups)) {
            if (watcherUsedProperties.has(prop.name)) {
              continue
            }
            container.properties.push(prop)
          }
        },
        onSetupFunctionEnter(node, vueData) {
          const container = getVueComponentPropertiesContainer(vueData.node)
          if (node.params[0]) {
            const paramsUsedProps = getParamsUsedProps(node)
            const paramUsedProps = /** @type {ParamUsedProps} */ (paramsUsedProps.getParam(
              0
            ))

            processParamPropsUsed(container, paramUsedProps)
          }
        },
        onRenderFunctionEnter(node, vueData) {
          const container = getVueComponentPropertiesContainer(vueData.node)
          if (node.params[0]) {
            // for Vue 3.x render
            const paramsUsedProps = getParamsUsedProps(node)
            const paramUsedProps = /** @type {ParamUsedProps} */ (paramsUsedProps.getParam(
              0
            ))

            processParamPropsUsed(container, paramUsedProps)
            if (container.unknownProps) {
              return
            }
          }

          if (vueData.functional && node.params[1]) {
            // for Vue 2.x render & functional
            const paramsUsedProps = getParamsUsedProps(node)
            const paramUsedProps = /** @type {ParamUsedProps} */ (paramsUsedProps.getParam(
              1
            ))

            for (const { usedNames, unknown } of iterateUsedProps(
              paramUsedProps
            )) {
              if (unknown) {
                container.unknownProps = true
                return
              }
              for (const usedPropsTracker of usedNames.get('props')) {
                const propUsedProps = usedPropsTracker(context)
                processParamPropsUsed(container, propUsedProps)
                if (container.unknownProps) {
                  return
                }
              }
            }
          }
        },
        /**
         * @param {ThisExpression | Identifier} node
         * @param {VueObjectData} vueData
         */
        'ThisExpression, Identifier'(node, vueData) {
          if (!utils.isThis(node, context)) {
            return
          }
          const container = getVueComponentPropertiesContainer(vueData.node)
          const usedProps = extractPatternOrThisProperties(node, context)

          for (const { usedNames, unknown } of iterateUsedProps(usedProps)) {
            if (unknown) {
              container.unknown = true
              return
            }
            for (const name of usedNames.names()) {
              container.usedNames.add(name)
            }
          }
        }
      }),
      {
        /** @param {Program} node */
        'Program:exit'(node) {
          if (!node.templateBody) {
            reportUnusedProperties()
          }
        }
      }
    )

    const templateVisitor = {
      /**
       * @param {VExpressionContainer} node
       */
      VExpressionContainer(node) {
        for (const name of getReferencesNames(node.references)) {
          templatePropertiesContainer.usedNames.add(name)
        }
      },
      /**
       * @param {VAttribute} node
       */
      'VAttribute[directive=false]'(node) {
        if (node.key.name === 'ref' && node.value != null) {
          templatePropertiesContainer.refNames.add(node.value.value)
        }
      },
      "VElement[parent.type!='VElement']:exit"() {
        reportUnusedProperties()
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateVisitor,
      scriptVisitor
    )
  }
}
