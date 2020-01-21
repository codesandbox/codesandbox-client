import * as astring from 'astring';
import * as meriyah from 'meriyah';
import { Identifier } from 'meriyah/dist/estree';

/**
 * Add support for next syntax
 */
export const customGenerator = Object.assign({}, astring.baseGenerator, {
  FieldDefinition: function(
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
});
