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

function formatSequence(state, nodes) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state;
  state.write('(');
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state);
    const { length } = nodes;
    for (let i = 1; i < length; i++) {
      const param = nodes[i];
      state.write(', ');
      generator[param.type](param, state);
    }
  }
  state.write(')');
}

/**
 * Add support for next syntax
 */
export const customGenerator = {
  // @ts-ignore baseGenerator is deprecated, and GENERATOR is not in the types?
  ...astring.GENERATOR,
  OptionalExpression(
    node: meriyah.ESTree.OptionalExpression,
    state: { write(s: string): void }
  ) {
    this[node.object.type](node.object, state);
    state.write('?.');
    this[node.chain.property!.type](node.chain.property!, state);
  },
  ArrowFunctionExpression(
    node: meriyah.ESTree.ArrowFunctionExpression,
    state: { write(s: string, c?: any): void }
  ) {
    state.write(node.async ? 'async ' : '', node);
    const { params } = node;
    if (params != null) {
      // Omit parenthesis if only one named parameter
      if (params.length === 1 && params[0].type[0] === 'I') {
        // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is `Identifier`
        const id = params[0] as meriyah.ESTree.Identifier;
        state.write(id.name, id);
      } else {
        formatSequence(state, node.params);
      }
    }
    state.write(' => ');
    if (node.body.type[0] === 'ObjectExpression') {
      // Body is an object expression
      state.write('(');
      this.ObjectExpression(node.body, state);
      state.write(')');
    } else {
      this[node.body.type](node.body, state);
    }
  },
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
