import { SourceLocation, Statement } from '@babel/types';
import traverse, { Node } from '@babel/traverse';
import { CodeRange } from '../../fibers';

function convertBabelPosToPosition(babelPos: SourceLocation): CodeRange {
  return {
    startLineNumber: babelPos.start.line,
    endLineNumber: babelPos.end.line,
    startColumnNumber: babelPos.start.column,
    endColumnNumber: babelPos.end.column,
  };
}

export function analyzeProps(ast: Node, range: CodeRange) {
  const foundProps: {
    [name: string]: {
      definitionPosition: CodeRange;
      namePosition: CodeRange;
      valuePosition: CodeRange;
    };
  } = {};
  traverse(ast, {
    JSXOpeningElement(path) {
      const location = path.node.loc;
      if (!location) {
        return;
      }
      if (
        location.start.line >= range.startLineNumber &&
        location.end.line <= range.endLineNumber
      ) {
        // This means that we're looking at the component we want to look at
        const props = path.get('attributes');

        props.forEach(prop => {
          if (!prop.isJSXAttribute()) {
            return;
          }

          const name = prop.get('name');
          if (name.isJSXNamespacedName()) {
            return;
          }

          const { node: valueNode } = prop.get('value');
          if (valueNode === null || valueNode.loc === null) {
            return;
          }

          if (!prop.get('loc') || !name.get('loc')) {
            return;
          }

          foundProps[name.node.name] = {
            definitionPosition: convertBabelPosToPosition(prop.node.loc),
            namePosition: convertBabelPosToPosition(name.node.loc),
            valuePosition: convertBabelPosToPosition(valueNode.loc),
          };
        });
      }
    },
  });

  return foundProps;
}
