import { Syntax as n } from './syntax';

export function generateRequireStatement(varName: string, requirePath: string) {
  // Generates `var $varName = require('$requirePath');
  return {
    type: n.VariableDeclaration,
    declarations: [
      {
        type: n.VariableDeclarator,
        id: {
          type: n.Identifier,
          name: varName,
        },
        init: {
          type: n.CallExpression,
          callee: {
            type: n.Identifier,
            name: 'require',
          },
          arguments: [
            {
              type: n.Literal,
              value: requirePath,
            },
          ],
        },
      },
    ],
    kind: 'var' as 'var',
  };
}

/**
 * Generates:
 * ```js
 * Object.keys($varName).forEach(function (key) {
 *   if (key === "default" || key === "__esModule") return;
 *   exports[key] = _store[key];
 * });
 * ```
 */
export function generateAllExportsIterator(varName: string) {
  return {
    type: n.ExpressionStatement,
    expression: {
      type: n.CallExpression,
      callee: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.CallExpression,
          callee: {
            type: n.MemberExpression,
            computed: false,
            object: {
              type: n.Identifier,
              name: 'Object',
            },
            property: {
              type: n.Identifier,
              name: 'keys',
            },
          },
          arguments: [
            {
              type: n.Identifier,
              name: varName,
            },
          ],
        },
        property: {
          type: n.Identifier,
          name: 'forEach',
        },
      },
      arguments: [
        {
          type: n.FunctionExpression,
          id: null,
          params: [
            {
              type: n.Identifier,
              name: 'key',
            },
          ],
          body: {
            type: n.BlockStatement,
            body: [
              {
                type: n.IfStatement,
                test: {
                  type: n.LogicalExpression,
                  operator: '||' as '||',
                  left: {
                    type: n.BinaryExpression,
                    operator: '===' as '===',
                    left: {
                      type: n.Identifier,
                      name: 'key',
                    },
                    right: {
                      type: n.Literal,
                      value: 'default',
                      raw: '"default"',
                    },
                  },
                  right: {
                    type: n.BinaryExpression,
                    operator: '===' as '===',
                    left: {
                      type: n.Identifier,
                      name: 'key',
                    },
                    right: {
                      type: n.Literal,
                      value: '__esModule',
                      raw: '"__esModule"',
                    },
                  },
                },
                consequent: {
                  type: n.ReturnStatement,
                  argument: null,
                },
                alternate: null,
              },
              {
                type: n.ExpressionStatement,
                expression: {
                  type: n.AssignmentExpression,
                  operator: '=' as '=',
                  left: {
                    type: n.MemberExpression,
                    computed: true,
                    object: {
                      type: n.Identifier,
                      name: 'exports',
                    },
                    property: {
                      type: n.Identifier,
                      name: 'key',
                    },
                  },
                  right: {
                    type: n.MemberExpression,
                    computed: true,
                    object: {
                      type: n.Identifier,
                      name: varName,
                    },
                    property: {
                      type: n.Identifier,
                      name: 'key',
                    },
                  },
                },
              },
            ],
          },
          generator: false,
          expression: false,
          async: false,
        },
      ],
    },
  };
}

/**
 * exports.$exportName = $varName.$localName;
 */
export function generateExportMemberStatement(
  varName: string,
  exportName: string,
  localName: string
) {
  return {
    type: n.ExpressionStatement,
    expression: {
      type: n.AssignmentExpression,
      operator: '=' as '=',
      left: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.Identifier,
          name: 'exports',
        },
        property: {
          type: n.Identifier,
          name: exportName,
        },
      },
      right: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.Identifier,
          name: varName,
        },
        property: {
          type: n.Identifier,
          name: localName,
        },
      },
    },
  };
}

/**
 * exports.$exportName = $varName.$exportName;
 */
export function generateExportStatement(varName: string, exportName: string) {
  return {
    type: n.ExpressionStatement,
    expression: {
      type: n.AssignmentExpression,
      operator: '=' as '=',
      left: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.Identifier,
          name: 'exports',
        },
        property: {
          type: n.Identifier,
          name: exportName,
        },
      },
      right: {
        type: n.Identifier,
        name: varName,
      },
    },
  };
}

/**
 * Object.defineProperty(exports, { __esModule: true })
 */
export function generateEsModuleSpecifier() {
  return {
    type: n.ExpressionStatement,
    expression: {
      type: n.CallExpression,
      callee: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.Identifier,
          name: 'Object',
        },
        property: {
          type: n.Identifier,
          name: 'defineProperty',
        },
      },
      arguments: [
        {
          type: n.Identifier,
          name: 'exports',
        },
        {
          type: n.Literal,
          value: '__esModule',
          raw: '"__esModule"',
        },
        {
          type: n.ObjectExpression,
          properties: [
            {
              type: n.Property,
              key: {
                type: n.Identifier,
                name: 'value',
              },
              computed: false,
              value: {
                type: n.Literal,
                value: true,
                raw: 'true',
              },
              kind: 'init' as 'init',
              method: false,
              shorthand: false,
            },
          ],
        },
      ],
    },
  };
}

/**
 * Object.defineProperty(exports, $exportName, {
 *   enumerable: true,
 *   get: function get() {
 *     return $localName;
 *   }
 * })
 */
export function generateExportGetter(exportName: string, localName: string) {
  return {
    type: n.ExpressionStatement,
    expression: {
      type: n.CallExpression,
      callee: {
        type: n.MemberExpression,
        computed: false,
        object: {
          type: n.Identifier,
          name: 'Object',
        },
        property: {
          type: n.Identifier,
          name: 'defineProperty',
        },
      },
      arguments: [
        {
          type: n.Identifier,
          name: 'exports',
        },
        {
          type: n.Literal,
          value: exportName,
        },
        {
          type: n.ObjectExpression,
          properties: [
            {
              type: n.Property,
              key: {
                type: n.Identifier,
                name: 'enumerable',
              },
              computed: false,
              value: {
                type: n.Literal,
                value: true,
                raw: 'true',
              },
              kind: 'init' as 'init',
              method: false,
              shorthand: false,
            },
            {
              type: n.Property,
              key: {
                type: n.Identifier,
                name: 'get',
              },
              computed: false,
              value: {
                type: n.FunctionExpression,
                id: {
                  type: n.Identifier,
                  name: 'get',
                },
                generator: false,
                async: false,
                params: [],
                body: {
                  type: n.BlockStatement,
                  body: [
                    {
                      type: n.ReturnStatement,
                      argument: {
                        type: n.Identifier,
                        name: localName,
                      },
                    },
                  ],
                },
              },
              kind: 'init' as 'init',
              method: false,
              shorthand: false,
            },
          ],
        },
      ],
    },
  };
}

export function generateInteropRequire() {
  return {
    type: n.FunctionDeclaration,
    params: [
      {
        type: n.Identifier,
        name: 'obj' as 'obj',
      },
    ],
    body: {
      type: n.BlockStatement,
      body: [
        {
          type: n.ReturnStatement,
          argument: {
            type: n.ConditionalExpression,
            test: {
              type: n.LogicalExpression,
              left: {
                type: n.Identifier,
                name: 'obj',
              },
              right: {
                type: n.MemberExpression,
                object: {
                  type: n.Identifier,
                  name: 'obj',
                },
                computed: false,
                property: {
                  type: n.Identifier,
                  name: '__esModule',
                },
              },
              operator: '&&',
            },
            consequent: {
              type: n.Identifier,
              name: 'obj',
            },
            alternate: {
              type: n.ObjectExpression,
              properties: [
                {
                  type: n.Property,
                  key: {
                    type: n.Identifier,
                    name: 'default',
                  },
                  value: {
                    type: n.Identifier,
                    name: 'obj',
                  },
                  kind: 'init' as 'init',
                  computed: false,
                  method: false,
                  shorthand: false,
                },
              ],
            },
          },
        },
      ],
    },
    async: false,
    generator: false,
    id: {
      type: n.Identifier,
      name: '$_csb__interopRequireDefault',
    },
  };
}

export function generateInteropRequireExpression(
  varName: string,
  localName: string
) {
  return {
    type: n.VariableDeclaration,
    kind: 'var' as 'var',
    declarations: [
      {
        type: n.VariableDeclarator,
        init: {
          type: n.CallExpression,
          callee: {
            type: n.Identifier,
            name: '$_csb__interopRequireDefault',
          },
          arguments: [
            {
              type: n.Identifier,
              name: varName,
            },
          ],
        },
        id: {
          type: n.Identifier,
          name: localName,
        },
      },
    ],
  };
}
