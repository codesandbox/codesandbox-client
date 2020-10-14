/**
 * This adds {fileName, lineNumber, columnNumber} annotations to JSX tags.
 *
 * NOTE: lineNumber and columnNumber are both 1-based.
 *
 * == JSX Literals ==
 *
 * <sometag />
 *
 * becomes:
 *
 * var __jsxFileName = 'this/file.js';
 * <sometag __source={{fileName: __jsxFileName, lineNumber: 10, columnNumber: 1}}/>
 */

import { Visitor } from '@babel/traverse';
import { types } from '@babel/core';

const TRACE_ID = '__source';
const FILE_NAME_VAR = '_jsxFileName';

export default ({ types: t }: { types: typeof types }) => {
  function makeTrace(
    fileNameIdentifier: types.Identifier,
    lineNumber: number,
    column0Based: number,
    endLineNumber: number,
    endColumn0Based: number,
    importPath: string | null,
    importName: string | null
  ) {
    const fileLineLiteral =
      lineNumber != null ? t.numericLiteral(lineNumber) : t.nullLiteral();
    const endFileLineLiteral =
      endLineNumber != null ? t.numericLiteral(endLineNumber) : t.nullLiteral();
    const fileColumnLiteral =
      column0Based != null
        ? t.numericLiteral(column0Based + 1)
        : t.nullLiteral();
    const endFileColumnLiteral =
      endColumn0Based != null
        ? t.numericLiteral(endColumn0Based + 1)
        : t.nullLiteral();

    const fileNameProperty = t.objectProperty(
      t.identifier('fileName'),
      fileNameIdentifier
    );

    const importPathProperty = t.objectProperty(
      t.identifier('importPath'),
      importPath ? t.stringLiteral(importPath) : t.nullLiteral()
    );

    const importNameProperty = t.objectProperty(
      t.identifier('importName'),
      importName ? t.stringLiteral(importName) : t.nullLiteral()
    );

    const lineNumberProperty = t.objectProperty(
      t.identifier('lineNumber'),
      fileLineLiteral
    );

    const endLineNumberProperty = t.objectProperty(
      t.identifier('endLineNumber'),
      endFileLineLiteral
    );

    const columnNumberProperty = t.objectProperty(
      t.identifier('columnNumber'),
      fileColumnLiteral
    );

    const endColumnNumberProperty = t.objectProperty(
      t.identifier('endColumnNumber'),
      endFileColumnLiteral
    );

    return t.objectExpression([
      fileNameProperty,
      lineNumberProperty,
      columnNumberProperty,
      endColumnNumberProperty,
      endLineNumberProperty,
      importPathProperty,
      importNameProperty,
    ]);
  }

  function getJSXElementName(node: types.JSXOpeningElement): string | null {
    if (node.name.type === 'JSXIdentifier') {
      return node.name.name;
    }

    return null;
  }

  const visitor: Visitor = {
    JSXOpeningElement(
      path,
      state: { fileNameIdentifier?: types.Identifier; filename?: string }
    ) {
      const id = t.jsxIdentifier(TRACE_ID);
      const location = path.node.loc;
      if (!location) {
        // the element was generated and doesn't have location information
        return;
      }

      const attributes = path.node.attributes;
      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        if (attribute.type === 'JSXSpreadAttribute') {
          // eslint-disable-next-line no-continue
          continue;
        }

        const name = attribute.name;
        if (name?.name === TRACE_ID) {
          // The __source attribute already exists
          return;
        }
      }

      if (!state.fileNameIdentifier) {
        const fileName = state.filename || '';

        const fileNameIdentifier = path.scope.generateUidIdentifier(
          FILE_NAME_VAR
        );

        const scope = path.scope;
        if (scope) {
          // Add the var to the root scope
          scope.getProgramParent().push({
            id: fileNameIdentifier,
            init: t.stringLiteral(fileName),
            unique: true,
          });
        }
        state.fileNameIdentifier = fileNameIdentifier;
      }

      const elementName = getJSXElementName(path.node);
      let importPath: string | null = null;
      let importName: string | null = null;
      if (elementName) {
        const binding = path.scope.getBinding(elementName);

        if (binding) {
          const nodePath = binding.path;

          if (
            t.isImportSpecifier(nodePath.node) &&
            t.isImportDeclaration(nodePath.parent)
          ) {
            // In case the component is a named export
            importPath = nodePath.parent.source.value;
            importName = nodePath.node.imported.name;
          } else if (
            t.isImportDefaultSpecifier(nodePath.node) &&
            t.isImportDeclaration(nodePath.parent)
          ) {
            // In case the component is a default export
            importPath = nodePath.parent.source.value;
            importName = 'default';
          } else if (
            t.isVariableDeclarator(nodePath.node) &&
            t.isIdentifier(nodePath.node.id)
          ) {
            // In case the component is defined in the same file
            importPath = null;
            importName = nodePath.node.id.name;
          }
        }
      }
      const trace = makeTrace(
        t.cloneNode(state.fileNameIdentifier),
        location.start.line,
        location.start.column,
        location.end.line,
        location.end.column,
        importPath,
        importName
      );
      attributes.push(t.jsxAttribute(id, t.jsxExpressionContainer(trace)));
    },
  };

  return {
    name: 'transform-react-jsx-source',
    visitor,
  };
};
