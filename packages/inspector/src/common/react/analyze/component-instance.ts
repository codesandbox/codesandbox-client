import ts from 'typescript';
import { CodeRange, FiberSourceInformation } from '../../fibers';

export function analyzeProps(
  sourceFile: ts.SourceFile,
  range: CodeRange
): FiberSourceInformation {
  function convertTSPosToRange(pos: number, end: number): CodeRange {
    const startRange = ts.getLineAndCharacterOfPosition(sourceFile, pos);
    const endRange = ts.getLineAndCharacterOfPosition(sourceFile, end);
    return {
      startLineNumber: startRange.line + 1,
      endLineNumber: endRange.line + 1,
      startColumnNumber: startRange.character + 1,
      endColumnNumber: endRange.character + 1,
    };
  }

  const startPos = ts.getPositionOfLineAndCharacter(
    sourceFile,
    range.startLineNumber - 1,
    range.startColumnNumber - 1
  );
  const endPos = ts.getPositionOfLineAndCharacter(
    sourceFile,
    range.endLineNumber - 1,
    range.endColumnNumber - 1
  );

  const foundProps: FiberSourceInformation = { props: {} };

  const visitChild = (node: ts.Node) => {
    if (ts.isJsxOpeningLikeElement(node)) {
      if (node.pos >= startPos && node.end <= endPos) {
        const attributes = node.attributes;
        attributes.properties.forEach(property => {
          if (ts.isJsxAttribute(property)) {
            const name = property.name.text;
            foundProps.props[name] = {
              name: name,
              definitionPosition: convertTSPosToRange(
                property.getStart(),
                property.end
              ),
              namePosition: convertTSPosToRange(
                property.getStart(),
                property.name.end
              ),
              valuePosition: property.initializer
                ? convertTSPosToRange(
                    property.initializer.pos,
                    property.initializer.end
                  )
                : null,
            };
          }
        });

        return;
      }
    }

    node.forEachChild(visitChild);
  };

  visitChild(sourceFile);

  return foundProps;
}
