// This code is written to be performant, that's why we opted to ignore these linting issues
/* eslint-disable no-loop-func, no-continue */
import * as meriyah from 'meriyah';
import * as astring from 'astring';
import * as escope from 'escope';
import { basename } from 'path';
import { walk } from 'estree-walker';
import { Property } from 'meriyah/dist/estree';
import { Syntax as n } from './syntax';
import {
  generateRequireStatement,
  generateAllExportsIterator,
  generateExportMemberStatement,
  generateExportStatement,
  generateEsModuleSpecifier,
  generateInteropRequire,
  generateInteropRequireExpression,
  generateExportGetter,
} from './utils';
import { customGenerator } from './generator';

/**
 * Converts esmodule code to commonjs code, built to be as fast as possible
 */
export function convertEsModule(code: string) {
  const usedVarNames = {};
  const varsToRename = {};
  const trackedExports = {};

  const getVarName = (name: string) => {
    let usedName = name.replace(/[.-]/g, '');
    while (usedVarNames[usedName]) {
      usedName += '_';
    }
    usedVarNames[usedName] = true;
    return usedName;
  };

  let program = meriyah.parseModule(code, { next: true });

  let i = 0;
  let importOffset = 0;

  let addedSpecifier = false;
  function addEsModuleSpecifier() {
    if (addedSpecifier) {
      return;
    }
    addedSpecifier = true;

    program.body.unshift(generateEsModuleSpecifier());
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

  // If there is a declaration of `exports` (`var exports = []`), we need to rename this
  // variable as it's a reserved keyword
  let exportsDefined = false;
  // @ts-ignore
  program = walk(program, {
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
      const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

      program.body[i] = generateRequireStatement(varName, source.value);
      i++;
      program.body.splice(i, 0, generateAllExportsIterator(varName));
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
        const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

        program.body[i] = generateRequireStatement(varName, source.value);
        if (statement.specifiers.length) {
          i++;

          statement.specifiers
            .reverse()
            .forEach((specifier: meriyah.ESTree.ExportSpecifier) => {
              program.body.splice(
                i,
                0,
                generateExportMemberStatement(
                  varName,
                  specifier.exported.name,
                  specifier.local.name
                )
              );
            });
        }
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

          const declaration = statement.declaration as meriyah.ESTree.VariableDeclaration;

          const foundDeclaration = declaration.declarations.find(
            d => d.id.type === n.Identifier
          ) as { id: meriyah.ESTree.Identifier };

          if (!foundDeclaration) {
            continue;
          }

          trackedExports[foundDeclaration.id.name] = foundDeclaration.id.name;
          varName = foundDeclaration.id.name;
        }
        i++;
        program.body.splice(i, 0, generateExportStatement(varName, varName));
      } else if (statement.specifiers) {
        program.body.splice(i, 1);
        i--;
        statement.specifiers.forEach(specifier => {
          if (specifier.type === n.ExportSpecifier) {
            i++;
            program.body.unshift(
              generateExportGetter(
                specifier.exported.name,
                specifier.local.name
              )
            );
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
      const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

      // Remove this statement
      program.body.splice(i, 1);
      // Create require statement instead of the import
      program.body.splice(
        importOffset,
        0,
        generateRequireStatement(varName, source.value)
      );
      importOffset++;

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
            generateInteropRequireExpression(varName, localName)
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

  if (
    Object.keys(varsToRename).length > 0 ||
    Object.keys(trackedExports).length > 0
  ) {
    // Convert all the object shorthands to not shorthands, needed later when we rename variables so we
    // don't change to the key literals
    // @ts-ignore
    program = walk(program, {
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
    const scopeManager = escope.analyze(program);

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
          ref.identifier.name = varsToRename[ref.identifier.name].join('.');
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
          ref.identifier.name = `exports.${name} = ${ref.identifier.name}`;
        }
      });
    });
    scopeManager.detach();
  }

  return astring.generate(program as any, {
    generator: customGenerator,
  });
}
