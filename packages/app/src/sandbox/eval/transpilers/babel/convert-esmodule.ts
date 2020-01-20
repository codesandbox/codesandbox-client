import * as esprima from 'esprima';
import escodegen from 'escodegen';
import { basename } from 'path';
import { Identifier, Expression } from 'estree';
import { measure, endMeasure } from '../../../utils/metrics';

const n = esprima.Syntax;

function generateRequireStatement(varName: string, requirePath: string) {
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
function generateAllExportsIterator(varName: string) {
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
 * exports.$exportName = $varName.$exportName;
 */
function generateExportMemberStatement(varName: string, exportName: string) {
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
          name: exportName,
        },
      },
    },
  };
}

/**
 * exports.$exportName = $varName.$exportName;
 */
function generateExportStatement(varName: string, exportName: string) {
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
 * Converts esmodule code to commonjs code, built to be as fast as possible
 */
export function convertEsModule(path: string, code: string) {
  const usedVarNames = [];

  const getVarName = (name: string) => {
    let usedName = name.replace(/[.-]/g, '');
    while (usedVarNames.includes(usedName)) {
      usedName += '_';
    }
    usedVarNames.push(usedName);
    return usedName;
  };

  measure(`esconvert-${path}`);
  measure(`parse-${path}`);
  const program = esprima.parseModule(code);
  endMeasure(`parse-${path}`);

  let i = 0;

  let addedSpecifier = false;
  function addEsModuleSpecifier() {
    if (addedSpecifier) {
      return;
    }
    addedSpecifier = true;

    program.body.unshift({
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
                kind: 'init',
                method: false,
                shorthand: false,
              },
            ],
          },
        ],
      },
    });
    i++;
  }

  for (; i < program.body.length; i++) {
    const statement = program.body[i];

    if (statement.type === n.ExportAllDeclaration) {
      addEsModuleSpecifier();
      const { source } = statement;
      if (typeof source.value !== 'string') {
        continue;
      }
      const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

      program.body[i] = generateRequireStatement(varName, source.value);
      i++;
      program.body.splice(i, 0, generateAllExportsIterator(varName));
    } else if (statement.type === n.ExportNamedDeclaration) {
      addEsModuleSpecifier();
      if (statement.source) {
        // export { ... } from ''
        const { source } = statement;
        if (typeof source.value !== 'string') {
          continue;
        }
        const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

        program.body[i] = generateRequireStatement(varName, source.value);
        i++;
        statement.specifiers.reverse().forEach(specifier => {
          program.body.splice(
            i,
            0,
            generateExportMemberStatement(varName, specifier.exported.name)
          );
        });
      } else if (statement.declaration) {
        // First remove the export statement
        program.body[i] = statement.declaration;

        let varName: string;

        if (
          statement.declaration.type === n.FunctionDeclaration ||
          statement.declaration.type === n.ClassDeclaration
        ) {
          // export function test() {}

          varName = statement.declaration.id.name;
        } else {
          // export const a = {}

          const declaration = statement.declaration.declarations.find(
            d => d.id.type === n.Identifier
          ) as { id: Identifier };

          if (!declaration) {
            continue;
          }

          varName = declaration.id.name;
        }
        i++;
        program.body.splice(i, 0, generateExportStatement(varName, varName));
      }
    } else if (statement.type === n.ExportDefaultDeclaration) {
      addEsModuleSpecifier();
      // export default function() {}
      // export default class A {}
      const varName = getVarName(`$csb__default`);
      // First remove the export statement
      if (statement.declaration) {
        if (statement.declaration.type === n.FunctionDeclaration) {
          // @ts-ignore
          statement.declaration.type = n.FunctionExpression;
        }
        if (statement.declaration.type === n.ClassDeclaration) {
          // @ts-ignore
          statement.declaration.type = n.ClassExpression;
        }
        const newDeclaration = statement.declaration as Expression;

        // Create a var with the export
        program.body[i] = {
          type: n.VariableDeclaration,
          kind: 'var' as 'var',

          declarations: [
            {
              type: n.VariableDeclarator,
              id: {
                type: n.Identifier,
                name: varName,
              },
              init: newDeclaration,
            },
          ],
        };

        i++;

        program.body.splice(i, 0, generateExportStatement(varName, 'default'));
      }
    } else if (statement.type === n.ImportDeclaration) {
      const { source } = statement;
      if (typeof source.value !== 'string') {
        continue;
      }
      const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

      program.body[i] = generateRequireStatement(varName, source.value);
      i++;

      statement.specifiers.reverse().forEach(specifier => {
        let localName: string;
        let importName: string;

        if (specifier.type === n.ImportDefaultSpecifier) {
          localName = 'default';
          importName = 'default';
        } else if (specifier.type === n.ImportSpecifier) {
          localName = specifier.local.name;
          importName = specifier.imported.name;
        } else if (specifier.type === n.ImportNamespaceSpecifier) {
          // Wildcard, TODO
          localName = specifier.local.name;
          importName = null;
        }

        program.body.splice(i, 0, {
          type: n.VariableDeclaration,
          kind: 'var' as 'var',
          declarations: [
            {
              type: n.VariableDeclarator,
              id: {
                type: n.Identifier,
                name: localName,
              },
              init: importName
                ? {
                    type: n.MemberExpression,
                    computed: false,
                    object: {
                      type: n.Identifier,
                      name: varName,
                    },
                    property: {
                      type: n.Identifier,
                      name: importName,
                    },
                  }
                : {
                    type: n.Identifier,
                    name: varName,
                  },
            },
          ],
        });
      });
    }
  }

  endMeasure(`esconvert-${path}`);

  return escodegen.generate(program);
}
