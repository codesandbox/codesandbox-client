import ts from 'typescript';
import * as tsutils from 'tsutils';
import { StaticComponentInformation } from '../../../fibers';

function getComponentDocumentation(
  exportSymbol: ts.Symbol,
  typeChecker: ts.TypeChecker
) {
  return exportSymbol.getDocumentationComment(typeChecker).map(t => t.text);
}

function getFunctionPropInfo(
  declaration: ts.FunctionDeclaration,
  typeChecker: ts.TypeChecker
) {
  const parameters = declaration.parameters;
  const propsParam = parameters[0];

  const defaults: {
    [prop: string]: {
      computed: boolean;
      value: string;
    };
  } = {};
  const name = propsParam.name;
  if (ts.isObjectBindingPattern(name)) {
    name.elements.forEach(element => {
      if (!element.initializer) {
        return;
      }

      const elementName = element.name;
      if (ts.isIdentifier(elementName)) {
        defaults[elementName.text] = {
          computed: !ts.isLiteralExpression(element.initializer),
          value: element.initializer.getText(),
        };
      }
    });
  }

  const typeNode = propsParam.type;
  if (!typeNode) {
    throw new Error("Can't find typenode");
  }

  const type = typeChecker.getTypeFromTypeNode(typeNode);
  const properties = type.getProperties();

  const props: StaticComponentInformation['props'] = [];

  properties.forEach(property => {
    const value = property.valueDeclaration;
    // const typeInfo = typeChecker.getTypeFromTypeNode(value);
    const [decl] = property.declarations as ts.PropertySignature[];

    const typeNode = decl.type!;
    const resolvedType = typeChecker.getTypeFromTypeNode(typeNode);

    if (
      resolvedType.symbol &&
      resolvedType.symbol.flags & ts.SymbolFlags.Alias
    ) {
      const originalSymbol = typeChecker.getAliasedSymbol(resolvedType.symbol);
      // TODO: define where the alias came from
    }
    const descriptionSymbols = property.getDocumentationComment(typeChecker);
    const jsdocDescriptionSymbols = property.getJsDocTags();

    const defaultValue = defaults[property.name];

    props.push({
      name: property.name,
      required: !(property.flags & ts.SymbolFlags.Optional),
      descriptions: descriptionSymbols.map(d => d.text),
      jsdocTags: jsdocDescriptionSymbols,
      typeInfo: {
        type: typeNode.getText(),
        resolvedType: typeChecker.typeToString(resolvedType),
      },
      defaultValue,
    });
  });

  return props;
}

export function analyzeComponent(
  sourceFile: ts.SourceFile,
  exportName: string,
  typeChecker: ts.TypeChecker
): StaticComponentInformation | undefined {
  const symbol = typeChecker.getSymbolAtLocation(sourceFile);

  if (!symbol) {
    return undefined;
  }

  const exports = typeChecker.getExportsOfModule(symbol);
  const foundExportSymbol = exports.find(exp => exp.escapedName === exportName);

  if (!foundExportSymbol) {
    throw new Error(`There is no export named '${exportName}'`);
  }

  const declaration = foundExportSymbol.declarations[0];

  if (ts.isFunctionDeclaration(declaration)) {
    const componentInfo: StaticComponentInformation = {
      name: declaration.name?.text || 'Anonymous',
      descriptions: getComponentDocumentation(foundExportSymbol, typeChecker),
      jsdocTags: foundExportSymbol.getJsDocTags(),
      props: getFunctionPropInfo(declaration, typeChecker),
    };

    return componentInfo;
  }

  return undefined;
}
