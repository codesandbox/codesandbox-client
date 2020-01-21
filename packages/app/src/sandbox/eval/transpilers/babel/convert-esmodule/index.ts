// This code is written to be performant, that's why we opted to ignore these linting issues
/* eslint-disable no-loop-func, no-continue */
import * as meriyah from 'meriyah';
import * as astring from 'astring';
import { basename } from 'path';
import { measure, endMeasure } from '../../../../utils/metrics';
import { Syntax as n } from './syntax';
import {
  generateRequireStatement,
  generateAllExportsIterator,
  generateExportMemberStatement,
  generateExportStatement,
  generateEsModuleSpecifier,
} from './utils';
import { customGenerator } from './generator';

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

  const program = meriyah.parseModule(code, { next: true });

  let i = 0;

  let addedSpecifier = false;
  function addEsModuleSpecifier() {
    if (addedSpecifier) {
      return;
    }
    addedSpecifier = true;

    program.body.unshift(generateEsModuleSpecifier());
    i++;
  }

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
        i++;

        statement.specifiers
          .reverse()
          .forEach((specifier: meriyah.ESTree.ExportSpecifier) => {
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

          const declaration = statement.declaration as meriyah.ESTree.VariableDeclaration;

          const foundDeclaration = declaration.declarations.find(
            d => d.id.type === n.Identifier
          ) as { id: meriyah.ESTree.Identifier };

          if (!foundDeclaration) {
            continue;
          }

          varName = foundDeclaration.id.name;
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
        const newDeclaration = statement.declaration as meriyah.ESTree.Expression;

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
      // @ts-ignore Wrong typing in lib?
      const source: meriyah.ESTree.Literal = statement.source;

      if (typeof source.value !== 'string') {
        continue;
      }
      const varName = getVarName(`$csb__${basename(source.value, '.js')}`);

      // Create require statement instead of the import
      program.body[i] = generateRequireStatement(varName, source.value);
      i++;

      statement.specifiers.reverse().forEach(specifier => {
        let localName: string;
        let importName: string;

        if (specifier.type === n.ImportDefaultSpecifier) {
          // import Test from 'test';
          // const _test = require('test');
          // var Test = _test.default;
          localName = specifier.local.name;
          importName = 'default';
        } else if (specifier.type === n.ImportSpecifier) {
          // import {Test} from 'test';
          // const _test = require('test');
          // var Test = _test.Test;
          localName = specifier.local.name;
          importName = specifier.imported.name;
        } else if (specifier.type === n.ImportNamespaceSpecifier) {
          // import * as Test from 'test';
          // const _test = require('test');
          // var Test = _test;
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

  return astring.generate(program as any, {
    generator: customGenerator,
  });
}
