import * as astring from 'astring';
import * as meriyah from 'meriyah';
import { Identifier } from 'meriyah/dist/estree';

/**
 * Add support for next syntax
 */
export const customGenerator = {
  ...astring.baseGenerator,
  FieldDefinition(
    node: meriyah.ESTree.FieldDefinition,
    state: { write(s: string): void }
  ) {
    // Support class fields

    if (node.static) {
      state.write('static ');
    }
    state.write((node.key as Identifier).name);
    state.write(' = ');
    this[node.value.type](node.value, state);
  },
  ImportExpression(
    node: meriyah.ESTree.ImportExpression,
    state: { write(s: string): void }
  ) {
    // Convert import() to $csbImport()

    state.write('$csbImport(');
    this[node.source.type](node.source, state);
    state.write(')');
  },
};
