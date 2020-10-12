import ts from 'typescript';
import * as tsutils from 'tsutils';
import { CodeRange, ComponentInstanceData } from '../../../fibers';

export function analyzeComponentInstances(
  sourceFile: ts.SourceFile,
  path: string
): ComponentInstanceData[] {
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

  function getPropInformation(attributes: ts.JsxAttributes) {
    const props: ComponentInstanceData['props'] = {};
    attributes.properties.forEach(property => {
      if (ts.isJsxAttribute(property)) {
        const name = property.name.text;
        props[name] = {
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
    return props;
  }

  const variableUsage = tsutils.collectVariableUsage(sourceFile);
  function getImportLocation(
    node: ts.Identifier
  ): ComponentInstanceData['importLocation'] | undefined {
    for (let [key, value] of variableUsage) {
      if (!value.uses.some(f => f.location === node)) {
        continue;
      }

      const parent = key.parent;
      if (ts.isImportSpecifier(parent)) {
        const declaration = parent.parent.parent.parent;
        const specifier = declaration.moduleSpecifier;
        if (!ts.isStringLiteral(specifier)) {
          continue;
        }

        const usedName = parent.propertyName || parent.name;
        return {
          importName: usedName.text,
          importPath: specifier.text,
        };
      } else if (ts.isImportClause(parent)) {
        const declaration = parent.parent;
        const specifier = declaration.moduleSpecifier;
        if (!ts.isStringLiteral(specifier)) {
          continue;
        }
        return {
          importName: 'default',
          importPath: specifier.text,
        };
      } else if (
        ts.isVariableDeclaration(parent) &&
        parent.initializer &&
        ts.isIdentifier(parent.initializer)
      ) {
        // Re-export
        return getImportLocation(parent.initializer);
      }
    }

    return undefined;
  }

  const componentInstances: ComponentInstanceData[] = [];

  const visitChild = (node: ts.Node) => {
    if (ts.isJsxOpeningLikeElement(node) && ts.isIdentifier(node.tagName)) {
      const { tagName } = node;
      if (!ts.isIdentifier(tagName) || !tagName.text) {
        return;
      }
      const componentInstance: ComponentInstanceData = {
        name: tagName.text,
        props: getPropInformation(node.attributes),
        importLocation: getImportLocation(tagName),
        location: {
          path,
          codePosition: convertTSPosToRange(node.getStart(), node.end),
        },
      };

      componentInstances.push(componentInstance);

      return;
    }

    node.forEachChild(visitChild);
  };

  visitChild(sourceFile);

  return componentInstances;
}
