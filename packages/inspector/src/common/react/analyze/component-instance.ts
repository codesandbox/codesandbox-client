import { SourceLocation } from '@babel/types';
import traverse from '@babel/traverse';
import { CodeRange, FiberSourceInformation } from '../../fibers';
import { parse } from '@babel/parser';

export function analyzeProps(
  code: string,
  range: CodeRange
): FiberSourceInformation {
  function convertBabelPosToPosition(babelPos: SourceLocation): CodeRange {
    return {
      startLineNumber: babelPos.start.line + (range.startLineNumber - 1),
      endLineNumber: babelPos.end.line + (range.startLineNumber - 1),
      startColumnNumber: babelPos.start.column + 1,
      endColumnNumber: babelPos.end.column + 1,
    };
  }

  const lines = code.split('\n');
  const isolatedComponentCode = lines
    .filter((_l, i) => {
      const lineNum = i + 1;
      return lineNum >= range.startLineNumber && lineNum <= range.endLineNumber;
    })
    .join('\n');

  const ast = parse(isolatedComponentCode, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  });

  let foundComponent = false;
  const foundProps: FiberSourceInformation = { props: {} };
  // @ts-expect-error
  traverse(ast, {
    JSXOpeningElement(path) {
      if (foundComponent) {
        return;
      }

      const location = path.node.loc;
      if (!location) {
        return;
      }

      if (location.start.column < range.startColumnNumber - 1) {
        return;
      }

      foundComponent = true;
      // This means that we're looking at the component we want to look at
      const props = path.get('attributes');

      props.forEach(prop => {
        if (!prop.isJSXAttribute()) {
          return;
        }

        const name = prop.get('name');
        if (!name.isJSXIdentifier()) {
          return;
        }

        const { node: valueNode } = prop.get('value');
        if (valueNode === null || valueNode.loc === null) {
          return;
        }

        const nameNode = name.node;
        const propNode = prop.node;

        if (!propNode.loc || !nameNode.loc) {
          return;
        }

        foundProps.props[nameNode.name] = {
          name: nameNode.name,
          definitionPosition: convertBabelPosToPosition(propNode.loc),
          namePosition: convertBabelPosToPosition(nameNode.loc),
          valuePosition: convertBabelPosToPosition(valueNode.loc),
        };
      });
    },
  });

  return foundProps;
}
