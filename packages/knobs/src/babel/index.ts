import * as fs from 'fs';
import { basename, dirname, join, relative } from 'path';

import * as types from '@babel/types';
import { Visitor } from '@babel/traverse';
// @ts-ignore
import { addNamespace } from '@babel/helper-module-imports';

type Input = {
  types: typeof types;
};

function createKnobsFile(fileName: string) {
  const knobsName = join(dirname(fileName), basename(fileName) + '.knobs.json');
  const exists = fs.existsSync(knobsName);

  if (!exists) {
    fs.writeFileSync(knobsName, '{}');
  }

  return { fileName: knobsName };
}

export default function babelPlugin(_ref: Input): { visitor: Visitor } {
  return {
    visitor: {
      MemberExpression: {
        enter(path, state: { file?: { opts?: { filename: string } } }) {
          if (!state.file?.opts?.filename) {
            throw new Error(
              'Cannot generate knob file, since babel is not passing filename'
            );
          }

          if (
            path.node.object.type === 'Identifier' &&
            path.node.object.name === 'knobs' &&
            path.parent.type === 'CallExpression' &&
            path.parent.arguments[0].type === 'StringLiteral'
          ) {
            const { fileName } = createKnobsFile(state.file.opts.filename);
            const relativeFileName = relative(
              state.file.opts.filename,
              fileName
            ).replace('../', './');

            const nameIdentifier =
              state.file.get('createdKnobIdentifier') ||
              (addNamespace(path, relativeFileName) as types.Identifier);
            state.file.set('createdKnobIdentifier', nameIdentifier);

            path.parent.arguments.unshift(
              types.memberExpression(
                nameIdentifier,
                types.identifier(path.parent.arguments[0].value)
              )
            );
          }
        },
      },
    },
  };
}
