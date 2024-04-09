// This code is written to be performant, that's why we opted to ignore these linting issues
/* eslint-disable no-loop-func, no-continue */
import * as meriyah from 'meriyah';
import * as escope from 'escope';
import { walk } from 'estree-walker';
import flatten from 'lodash-es/flatten';
import {
  AssignmentExpression,
  Identifier,
  Property,
  Statement,
} from 'meriyah/dist/estree';
import { Syntax as n } from './syntax';
import {
  generateRequireStatement,
  generateAllExportsIterator,
  generateExportStatement,
  generateEsModuleSpecifier,
  generateInteropRequire,
  generateInteropRequireExpression,
  generateExportGetter,
} from './ast-node-utils';
import { ESTreeAST } from './utils';

export function generateVariableName(input: string): string {
  const v = input.replace(/[^A-Za-z0-9]+/g, '_');
  return v.substr(v.length - 36);
}

/**
 * Converts esmodule code to commonjs code, built to be as fast as possible
 */
export function convertEsModule(ast: ESTreeAST): void {
  const program = ast.program;
  ast.isDirty = true;

  const usedVarNames = {};
  const varsToRename = {};
  const trackedExports = {};
  /**
   * All names we export, used to predefine the exports at the start
   */
  const exportNames = new Set<string>();

  const getVarName = (name: string) => {
    let usedName = name.replace(/(\s|\.|-|@|\?|&|=|{|})/g, '');
    while (usedVarNames[usedName]) {
      usedName += '_';
    }
    usedVarNames[usedName] = true;
    return usedName;
  };

  let i = 0;
  let importOffset = 0;

  function addNodeInImportSpace(oldPosition: number, node: Statement) {
    program.body.splice(oldPosition, 1);
    program.body.splice(importOffset, 0, node);
    importOffset++;
  }

  let addedSpecifier = false;
  function addEsModuleSpecifier() {
    if (addedSpecifier) {
      return;
    }
    addedSpecifier = true;

    program.body.unshift(generateEsModuleSpecifier());

    // Make sure imports will stay after this
    importOffset++;

    i++;
  }

  let addedDefaultInterop = false;
  function addDefaultInterop() {
    if (addedDefaultInterop) {
      return;
    }
    addedDefaultInterop = true;

    program.body.push(generateInteropRequire());
  }

  /**
   * Adds the export identifiers (exports.a = exports.b = exports.c = void 0)
   */
  function addExportVoids() {
    const exportNamesArray = [...exportNames];
    while (exportNamesArray.length !== 0) {
      // We need to chunk the exports by 50, otherwise this line will get too long
      // and the visitor will create a Maximum call stack size exceeded error
      const exportNamesToUse = exportNamesArray.splice(0, 50);
      const totalNode = {
        type: n.ExpressionStatement,
        expression: {
          type: n.AssignmentExpression,
          operator: '=',
        },
      };
      let currentNode: Partial<AssignmentExpression> = totalNode.expression;
      while (exportNamesToUse.length > 0) {
        const exportName = exportNamesToUse.pop();
        currentNode.left = {
          type: n.MemberExpression,
          object: {
            type: n.Identifier,
            name: 'exports',
          },
          property: {
            type: n.Identifier,
            name: exportName,
          } as Identifier,
        };
        if (exportNamesToUse.length) {
          // @ts-expect-error This will be filled in in the next loop
          currentNode.right = {
            type: n.AssignmentExpression,
            operator: '=',
          } as Partial<AssignmentExpression>;
          currentNode = currentNode.right as Partial<AssignmentExpression>;
        } else {
          currentNode.right = {
            type: n.UnaryExpression,
            operator: 'void',
            prefix: true,
            argument: {
              type: n.Literal,
              value: 0,
            },
          };
        }
      }

      // @ts-expect-error TS thinks this is a partial type, but by now it's full
      program.body.unshift(totalNode);
    }
  }

  // If there is a declaration of `exports` (`var exports = []`), we need to rename this
  // variable as it's a reserved keyword
  let exportsDefined = false;

  walk(program, {
    enter(node, parent) {
      if (node.type === n.VariableDeclaration) {
        // We don't rename exports vars in functions, only on root level
        if (parent.type === n.BlockStatement && exportsDefined === false) {
          this.skip();
        }
      } else if (node.type === n.VariableDeclarator) {
        const declNode = node as meriyah.ESTree.VariableDeclarator;
        if (
          declNode.id.type === n.Identifier &&
          declNode.id.name === 'exports'
        ) {
          exportsDefined = true;
        }
      } else if (node.type === n.Identifier && exportsDefined) {
        const idNode = node as meriyah.ESTree.Identifier;
        if (idNode.name === 'exports') {
          idNode.name = '__$csb_exports';
          this.replace(idNode);
        }
      } else if (!exportsDefined && parent != null) {
        // Skip, we don't need to go deeper now
        this.skip();
      }
    },
  });

  for (; i < program.body.length; i++) {
    const statement = program.body[i];

    if (statement.type === n.ExportAllDeclaration) {
      // export * from './test';
      // TO:
      // const _csb = require('./test');
      // Object.keys(_csb).forEach(key => {
      //   if (key === 'default' || key === '__esModule')
      //     return;
      //   exports[key] = _csb[key])
      // }

      addEsModuleSpecifier();
      const { source } = statement;
      if (typeof source.value !== 'string') {
        continue;
      }
      const varName = getVarName(`$csb__${generateVariableName(source.value)}`);
      addNodeInImportSpace(i, generateRequireStatement(varName, source.value));
      program.body.push(generateAllExportsIterator(varName));
    } else if (statement.type === n.ExportNamedDeclaration) {
      // export { a } from './test';
      // TO:
      // const _csb = require('./test');
      // exports.a = _csb.a;

      addEsModuleSpecifier();
      if (statement.source) {
        // export { ... } from ''
        const { source } = statement;
        if (typeof source.value !== 'string') {
          continue;
        }
        const varName = getVarName(
          `$csb__${generateVariableName(source.value)}`
        );

        if (
          statement.specifiers.length === 1 &&
          statement.specifiers[0].type === n.ExportSpecifier &&
          statement.specifiers[0].local.name === 'default'
        ) {
          // In this case there's a default re-export. So we need to wrap it in a interopRequireDefault to make sure
          // that default is exposed.
          addDefaultInterop();
          addNodeInImportSpace(
            i,
            generateInteropRequireExpression(
              {
                type: n.CallExpression,
                callee: {
                  type: n.Identifier,
                  name: 'require',
                },
                arguments: [
                  {
                    type: n.Literal,
                    value: source.value,
                  },
                ],
              },
              varName
            )
          );
        } else {
          addNodeInImportSpace(
            i,
            generateRequireStatement(varName, source.value)
          );
        }

        if (statement.specifiers.length) {
          statement.specifiers.forEach(specifier => {
            if (specifier.type === n.ExportSpecifier) {
              exportNames.add(specifier.exported.name);
              program.body.splice(
                importOffset++,
                0,
                generateExportGetter(
                  { type: n.Literal, value: specifier.exported.name },
                  {
                    type: n.MemberExpression,
                    object: {
                      type: n.Identifier,
                      name: varName,
                    },
                    property: {
                      type: n.Identifier,
                      name: specifier.local.name,
                    },
                  }
                )
              );
            } else if (specifier.type === n.ExportNamespaceSpecifier) {
              program.body.splice(
                importOffset++,
                0,
                generateExportGetter(
                  { type: n.Literal, value: specifier.specifier.name },
                  { type: n.Identifier, name: varName }
                )
              );
            }

            i++;
          });
        }
      } else if (statement.declaration) {
        // First remove the export statement
        program.body[i] = statement.declaration;

        if (
          statement.declaration.type === n.FunctionDeclaration ||
          statement.declaration.type === n.ClassDeclaration
        ) {
          // export function test() {}

          const varName = statement.declaration.id.name;
          i++;
          // Add to start of the file, after the defineModule for __esModule. This way this export is already
          // defined before requiring other modules. This is only possible for function exports.
          const positionToInsert =
            statement.declaration.type === n.FunctionDeclaration ? 1 : i;
          program.body.splice(
            positionToInsert,
            0,
            generateExportStatement(varName, varName)
          );
          exportNames.add(varName);
        } else {
          // export const a = {}

          const declaration = statement.declaration as meriyah.ESTree.VariableDeclaration;

          program.body.splice(
            i,
            1,
            declaration,
            // @ts-ignore
            ...flatten(
              declaration.declarations.map(node => {
                if (node.id.type === n.ObjectPattern) {
                  // export const { a } = c;
                  return flatten(
                    node.id.properties.map(property => {
                      if (
                        property.type !== n.Property ||
                        property.value.type !== n.Identifier
                      ) {
                        return false;
                      }

                      exportNames.add(property.value.name);
                      trackedExports[property.value.name] = property.value.name;
                      return generateExportStatement(
                        property.value.name,
                        property.value.name
                      );
                    })
                  ).filter(Boolean);
                }
                if (node.id.type === n.Identifier) {
                  trackedExports[node.id.name] = node.id.name;

                  exportNames.add(node.id.name);
                  return generateExportStatement(node.id.name, node.id.name);
                }
                if (node.id.type === n.ArrayPattern) {
                  // export const [a, b] = c;

                  return flatten(
                    node.id.elements.map(property => {
                      if (property.type !== n.Identifier) {
                        return false;
                      }

                      exportNames.add(property.name);
                      trackedExports[property.name] = property.name;
                      return generateExportStatement(
                        property.name,
                        property.name
                      );
                    })
                  ).filter(Boolean);
                }

                return null;
              })
            ).filter(Boolean)
          );
        }
      } else if (statement.specifiers) {
        program.body.splice(i, 1);
        i--;
        statement.specifiers.forEach(specifier => {
          if (specifier.type === n.ExportSpecifier) {
            i++;

            exportNames.add(specifier.exported.name);
            program.body.unshift(
              generateExportGetter(
                { type: n.Literal, value: specifier.exported.name },
                { type: n.Identifier, name: specifier.local.name }
              )
            );
            // Make sure that nothing can get inbetween this
            importOffset++;
          }
        });
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
        } else if (statement.declaration.type === n.ClassDeclaration) {
          // @ts-ignore
          statement.declaration.type = n.ClassExpression;
        }
        const newDeclaration = statement.declaration as meriyah.ESTree.Expression;

        // Create a var with the export
        if (
          statement.declaration.type === n.ClassExpression ||
          statement.declaration.type === n.FunctionExpression
        ) {
          if (!statement.declaration.id) {
            // If the function or class has no name, we give it to it
            statement.declaration.id = {
              type: n.Identifier,
              name: varName,
            };
          }

          program.body[
            i
          ] = statement.declaration as meriyah.ESTree.DeclarationStatement;
          i++;

          program.body.splice(
            i,
            0,
            generateExportStatement(statement.declaration.id.name, 'default')
          );
        } else {
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

          program.body.splice(
            i,
            0,
            generateExportStatement(varName, 'default')
          );
        }

        if (
          newDeclaration.type === n.ClassDeclaration ||
          newDeclaration.type === n.FunctionExpression
        ) {
          trackedExports[newDeclaration.id.name] = 'default';
        }
      }
    } else if (statement.type === n.ImportDeclaration) {
      // @ts-ignore Wrong typing in lib?
      const source: meriyah.ESTree.Literal = statement.source;

      if (typeof source.value !== 'string') {
        continue;
      }
      const varName = getVarName(`$csb__${generateVariableName(source.value)}`);

      addNodeInImportSpace(i, generateRequireStatement(varName, source.value));

      statement.specifiers.reverse().forEach(specifier => {
        let localName: string;
        let importName: string;

        if (specifier.type === n.ImportSpecifier) {
          // import {Test} from 'test';
          // const _test = require('test');
          // var Test = _test.Test;

          // Mark that we need to rename all references to this variable
          // to the new require statement. This will happen in the second pass.
          varsToRename[specifier.local.name] = [
            varName,
            specifier.imported.name,
          ];

          return;
        }
        i++;

        if (specifier.type === n.ImportDefaultSpecifier) {
          // import Test from 'test';
          // const _test = require('test');
          // var Test = interopRequireDefault(_test).default;
          localName = specifier.local.name;
          importName = 'default';
          addDefaultInterop();

          program.body.splice(
            // After the require statement
            importOffset,
            0,
            generateInteropRequireExpression(
              { type: n.Identifier, name: varName },
              localName
            )
          );

          varsToRename[localName] = [localName, 'default'];
          importOffset++;
          return;
        }

        if (specifier.type === n.ImportNamespaceSpecifier) {
          // import * as Test from 'test';
          // const _test = require('test');
          // var Test = _test;
          localName = specifier.local.name;
          importName = null;
        }

        // insert in index 1 instead of 0 to be after the interopRequireDefault
        program.body.splice(importOffset, 0, {
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
        importOffset++;
      });
    }
  }

  // console.log(exportNames);
  if (
    Object.keys(varsToRename).length > 0 ||
    Object.keys(trackedExports).length > 0
  ) {
    // Convert all the object shorthands to not shorthands, needed later when we rename variables so we
    // don't change to the key literals
    walk(program, {
      enter(node, parent, prop, index) {
        if (node.type === n.Property) {
          const property = node as Property;
          if (
            property.shorthand &&
            property.value.type !== n.AssignmentPattern // Not a default initializer
          ) {
            property.value = {
              ...property.key,
            };
            property.shorthand = false;
          }
        }
      },
    });

    // A second pass where we rename all references to imports that were marked before.
    const scopeManager = escope.analyze(program, { ecmaVersion: 6 });

    scopeManager.acquire(program);
    scopeManager.scopes.forEach(scope => {
      scope.references.forEach(ref => {
        // If the variable cannot be resolved, it must be the var that we had
        // just changed.
        if (
          Object.prototype.hasOwnProperty.call(
            varsToRename,
            ref.identifier.name
          ) &&
          ref.resolved === null &&
          !ref.writeExpr
        ) {
          ref.identifier.name = `(0, ${varsToRename[ref.identifier.name].join(
            '.'
          )})`;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            trackedExports,
            ref.identifier.name
          ) &&
          ref.isWrite() &&
          ref.resolved === null &&
          !ref.init
        ) {
          const name = trackedExports[ref.identifier.name];
          if (ref.isRead()) {
            // If it's both a read and a write (e.g. --num), we need to go a level higher
            // However, that information is not available here, and we don't have an easy way
            // to fix it. Because of this, we bail out from this fast converter, and rely on Babel
            // to convert to commonjs.
            throw new Error("Can't convert read + write exports");
          } else {
            ref.identifier.name = `exports.${name} = ${ref.identifier.name}`;
          }
        }
      });
    });
    scopeManager.detach();
  }

  addExportVoids();
}
