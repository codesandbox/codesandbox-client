"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildComponents = void 0;
const componentInfo_1 = require("./componentInfo");
const lodash_1 = require("lodash");
function getChildComponents(tsModule, defaultExportType, checker, tagCasing = 'kebab') {
    let componentsSymbol;
    if (!componentInfo_1.isClassType(tsModule, defaultExportType)) {
        componentsSymbol = checker.getPropertyOfType(defaultExportType, 'components');
    }
    else {
        // get decorator argument type when class
        const classDecoratorArgumentType = componentInfo_1.getClassDecoratorArgumentType(tsModule, defaultExportType, checker);
        if (!classDecoratorArgumentType) {
            return undefined;
        }
        componentsSymbol = checker.getPropertyOfType(classDecoratorArgumentType, 'components');
    }
    if (!componentsSymbol || !componentsSymbol.valueDeclaration) {
        return undefined;
    }
    const componentsDeclaration = componentInfo_1.getLastChild(componentsSymbol.valueDeclaration);
    if (!componentsDeclaration) {
        return undefined;
    }
    if (componentsDeclaration.kind === tsModule.SyntaxKind.ObjectLiteralExpression) {
        const componentsType = checker.getTypeOfSymbolAtLocation(componentsSymbol, componentsDeclaration);
        const result = [];
        checker.getPropertiesOfType(componentsType).forEach(s => {
            if (!s.valueDeclaration) {
                return;
            }
            let componentName = s.name;
            if (tagCasing === 'kebab') {
                componentName = lodash_1.kebabCase(s.name);
            }
            let objectLiteralSymbol;
            if (s.valueDeclaration.kind === tsModule.SyntaxKind.PropertyAssignment) {
                objectLiteralSymbol =
                    checker.getSymbolAtLocation(s.valueDeclaration.initializer) || s;
            }
            else if (s.valueDeclaration.kind === tsModule.SyntaxKind.ShorthandPropertyAssignment) {
                objectLiteralSymbol = checker.getShorthandAssignmentValueSymbol(s.valueDeclaration) || s;
            }
            if (!objectLiteralSymbol) {
                return;
            }
            if (objectLiteralSymbol.flags & tsModule.SymbolFlags.Alias) {
                const definitionSymbol = checker.getAliasedSymbol(objectLiteralSymbol);
                if (!definitionSymbol.valueDeclaration) {
                    return;
                }
                const sourceFile = definitionSymbol.valueDeclaration.getSourceFile();
                const defaultExportNode = componentInfo_1.getDefaultExportNode(tsModule, sourceFile);
                if (!defaultExportNode) {
                    return;
                }
                result.push({
                    name: componentName,
                    documentation: componentInfo_1.buildDocumentation(tsModule, definitionSymbol, checker),
                    definition: {
                        path: sourceFile.fileName,
                        start: defaultExportNode.getStart(sourceFile, true),
                        end: defaultExportNode.getEnd()
                    },
                    defaultExportNode
                });
            }
        });
        return result;
    }
}
exports.getChildComponents = getChildComponents;
//# sourceMappingURL=childComponents.js.map