import * as astring from 'astring';
import * as meriyah from 'meriyah';
import { Identifier } from 'meriyah/dist/estree';
import jsxGenerator from './generator-jsx';

// Enables parenthesis regardless of precedence
const NEEDS_PARENTHESES = 17;
const EXPRESSIONS_PRECEDENCE = {
  // Definitions
  ArrayExpression: 20,
  TaggedTemplateExpression: 20,
  ThisExpression: 20,
  Identifier: 20,
  Literal: 18,
  TemplateLiteral: 20,
  Super: 20,
  SequenceExpression: 20,
  // Operations
  MemberExpression: 19,
  CallExpression: 19,
  NewExpression: 19,
  // Other definitions
  ArrowFunctionExpression: NEEDS_PARENTHESES,
  ClassExpression: NEEDS_PARENTHESES,
  FunctionExpression: NEEDS_PARENTHESES,
  ObjectExpression: NEEDS_PARENTHESES,
  // Other operations
  UpdateExpression: 16,
  UnaryExpression: 15,
  BinaryExpression: 14,
  LogicalExpression: 13,
  ConditionalExpression: 4,
  AssignmentExpression: 3,
  AwaitExpression: 2,
  YieldExpression: 2,
  RestElement: 1,
};

/**
 * Add support for next syntax
 */
export const customGenerator = {
  // @ts-ignore baseGenerator is deprecated, and GENERATOR is not in the types?
  ...astring.GENERATOR,
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
  UnaryExpression(
    node: meriyah.ESTree.UnaryExpression,
    state: { write(s: string): void }
  ) {
    if (node.prefix) {
      state.write(node.operator);
      if (node.operator.length > 1) {
        state.write(' ');
      }
      if (
        EXPRESSIONS_PRECEDENCE[node.argument.type] <
        EXPRESSIONS_PRECEDENCE.UnaryExpression
      ) {
        state.write('(');
        this[node.argument.type](node.argument, state);
        state.write(')');
      } else {
        state.write(' ');
        this[node.argument.type](node.argument, state);
      }
    } else {
      // FIXME: This case never occurs
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  ...jsxGenerator,
};
