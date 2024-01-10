// This code is written to be performant, that's why we opted to ignore these linting issues
/* eslint-disable no-loop-func, no-continue */
import * as meriyah from 'meriyah';
import { walk } from 'estree-walker';

import { Syntax as n } from './syntax';
import { ESTreeAST } from './utils';

export interface IESModuleMeta {
  url: string;
}

const CSB_IMPORT_META_NAME = '$csb__import_meta';
export function rewriteImportMeta(ast: ESTreeAST, meta: IESModuleMeta): void {
  let hasImportMeta = false;
  walk(ast.program, {
    enter(node: meriyah.ESTree.MemberExpression) {
      if (node.type === n.MemberExpression) {
        if (
          node.object.type === n.MetaProperty &&
          node.object.meta.name === 'import'
        ) {
          node.object = {
            type: n.Identifier,
            name: CSB_IMPORT_META_NAME,
          };

          hasImportMeta = true;

          this.skip();
        }
      }
    },
  });

  if (hasImportMeta) {
    ast.program.body.unshift({
      type: n.VariableDeclaration,
      kind: 'var',
      declarations: [
        {
          type: n.VariableDeclarator,
          id: {
            type: n.Identifier,
            name: CSB_IMPORT_META_NAME,
          },
          init: {
            type: n.ObjectExpression,
            properties: [
              {
                type: n.Property,
                kind: 'init',
                computed: false,
                shorthand: false,
                method: false,
                key: {
                  type: n.Identifier,
                  name: 'url',
                },
                value: {
                  type: n.Literal,
                  value: meta.url,
                  raw: JSON.stringify(meta.url),
                },
              },
            ],
          },
        },
      ],
    });
  }
}
