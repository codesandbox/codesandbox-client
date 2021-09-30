import { GENERATOR } from 'meriyah-printer';
import { ESTree } from 'meriyah';

/**
 * Add support for next syntax
 */
export const customGenerator = {
  // @ts-ignore baseGenerator is deprecated, and GENERATOR is not in the types?
  ...GENERATOR,
  ImportExpression(
    node: ESTree.ImportExpression,
    state: { write(s: string): void }
  ) {
    // Convert import() to $csbImport()

    state.write('$csbImport(');
    this[node.source.type](node.source, state);
    state.write(')');
  },
};
