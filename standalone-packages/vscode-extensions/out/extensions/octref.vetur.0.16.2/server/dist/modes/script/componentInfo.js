"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const childComponents_1 = require("./childComponents");
function getComponentInfo(service, fileFsPath, config) {
    const program = service.getProgram();
    if (!program) {
        return undefined;
    }
    const sourceFile = program.getSourceFile(fileFsPath);
    if (!sourceFile) {
        return undefined;
    }
    const checker = program.getTypeChecker();
    const defaultExportExpr = getDefaultExportObjectLiteralExpr(sourceFile);
    if (!defaultExportExpr) {
        return undefined;
    }
    const vueFileInfo = analyzeDefaultExportExpr(defaultExportExpr, checker);
    const defaultExportType = checker.getTypeAtLocation(defaultExportExpr);
    const internalChildComponents = childComponents_1.getChildComponents(defaultExportType, checker, config.vetur.completion.tagCasing);
    if (internalChildComponents) {
        const childComponents = [];
        internalChildComponents.forEach(c => {
            childComponents.push({
                name: c.name,
                documentation: c.documentation,
                definition: c.definition,
                info: c.defaultExportExpr ? analyzeDefaultExportExpr(c.defaultExportExpr, checker) : undefined
            });
        });
        vueFileInfo.componentInfo.childComponents = childComponents;
    }
    return vueFileInfo;
}
exports.getComponentInfo = getComponentInfo;
function analyzeDefaultExportExpr(defaultExportExpr, checker) {
    const defaultExportType = checker.getTypeAtLocation(defaultExportExpr);
    const props = getProps(defaultExportType, checker);
    const data = getData(defaultExportType, checker);
    const computed = getComputed(defaultExportType, checker);
    const methods = getMethods(defaultExportType, checker);
    return {
        componentInfo: {
            props,
            data,
            computed,
            methods
        }
    };
}
exports.analyzeDefaultExportExpr = analyzeDefaultExportExpr;
function getDefaultExportObjectLiteralExpr(sourceFile) {
    const exportStmts = sourceFile.statements.filter(st => st.kind === ts.SyntaxKind.ExportAssignment);
    if (exportStmts.length === 0) {
        return undefined;
    }
    const exportExpr = exportStmts[0].expression;
    return getObjectLiteralExprFromExportExpr(exportExpr);
}
function getProps(defaultExportType, checker) {
    const propsSymbol = checker.getPropertyOfType(defaultExportType, 'props');
    if (!propsSymbol || !propsSymbol.valueDeclaration) {
        return undefined;
    }
    const propsDeclaration = getLastChild(propsSymbol.valueDeclaration);
    if (!propsDeclaration) {
        return undefined;
    }
    /**
     * Plain array props like `props: ['foo', 'bar']`
     */
    if (propsDeclaration.kind === ts.SyntaxKind.ArrayLiteralExpression) {
        return propsDeclaration.elements
            .filter(expr => expr.kind === ts.SyntaxKind.StringLiteral)
            .map(expr => {
            return {
                name: expr.text
            };
        });
    }
    /**
     * Object literal props like
     * ```
     * {
     *   props: {
     *     foo: { type: Boolean, default: true },
     *     bar: { type: String, default: 'bar' }
     *   }
     * }
     * ```
     */
    if (propsDeclaration.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const propsType = checker.getTypeOfSymbolAtLocation(propsSymbol, propsDeclaration);
        return checker.getPropertiesOfType(propsType).map(s => {
            return {
                name: s.name,
                documentation: buildDocumentation(s, checker)
            };
        });
    }
    return undefined;
}
/**
 * In SFC, data can only be a function
 * ```
 * {
 *   data() {
 *     return {
 *        foo: true,
 *        bar: 'bar'
 *     }
 *   }
 * }
 * ```
 */
function getData(defaultExportType, checker) {
    const dataSymbol = checker.getPropertyOfType(defaultExportType, 'data');
    if (!dataSymbol || !dataSymbol.valueDeclaration) {
        return undefined;
    }
    const dataType = checker.getTypeOfSymbolAtLocation(dataSymbol, dataSymbol.valueDeclaration);
    const dataSignatures = dataType.getCallSignatures();
    if (dataSignatures.length === 0) {
        return undefined;
    }
    const dataReturnTypeProperties = checker.getReturnTypeOfSignature(dataSignatures[0]);
    return dataReturnTypeProperties.getProperties().map(s => {
        return {
            name: s.name,
            documentation: buildDocumentation(s, checker)
        };
    });
}
function getComputed(defaultExportType, checker) {
    const computedSymbol = checker.getPropertyOfType(defaultExportType, 'computed');
    if (!computedSymbol || !computedSymbol.valueDeclaration) {
        return undefined;
    }
    const computedDeclaration = getLastChild(computedSymbol.valueDeclaration);
    if (!computedDeclaration) {
        return undefined;
    }
    if (computedDeclaration.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const computedType = checker.getTypeOfSymbolAtLocation(computedSymbol, computedDeclaration);
        return checker.getPropertiesOfType(computedType).map(s => {
            return {
                name: s.name,
                documentation: buildDocumentation(s, checker)
            };
        });
    }
    return undefined;
}
function getMethods(defaultExportType, checker) {
    const methodsSymbol = checker.getPropertyOfType(defaultExportType, 'methods');
    if (!methodsSymbol || !methodsSymbol.valueDeclaration) {
        return undefined;
    }
    const methodsDeclaration = getLastChild(methodsSymbol.valueDeclaration);
    if (!methodsDeclaration) {
        return undefined;
    }
    if (methodsDeclaration.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const methodsType = checker.getTypeOfSymbolAtLocation(methodsSymbol, methodsDeclaration);
        return checker.getPropertiesOfType(methodsType).map(s => {
            return {
                name: s.name,
                documentation: buildDocumentation(s, checker)
            };
        });
    }
    return undefined;
}
function getObjectLiteralExprFromExportExpr(exportExpr) {
    switch (exportExpr.kind) {
        case ts.SyntaxKind.CallExpression:
            // Vue.extend or synthetic __vueEditorBridge
            return exportExpr.arguments[0];
        case ts.SyntaxKind.ObjectLiteralExpression:
            return exportExpr;
    }
    return undefined;
}
exports.getObjectLiteralExprFromExportExpr = getObjectLiteralExprFromExportExpr;
function getLastChild(d) {
    const children = d.getChildren();
    if (children.length === 0) {
        return undefined;
    }
    return children[children.length - 1];
}
exports.getLastChild = getLastChild;
function buildDocumentation(s, checker) {
    let documentation = s
        .getDocumentationComment(checker)
        .map(d => d.text)
        .join('\n');
    documentation += '\n';
    if (s.valueDeclaration) {
        if (s.valueDeclaration.kind === ts.SyntaxKind.PropertyAssignment) {
            documentation += `\`\`\`js\n${formatJSLikeDocumentation(s.valueDeclaration.getText())}\n\`\`\`\n`;
        }
        else {
            documentation += `\`\`\`js\n${formatJSLikeDocumentation(s.valueDeclaration.getText())}\n\`\`\`\n`;
        }
    }
    return documentation;
}
exports.buildDocumentation = buildDocumentation;
function formatJSLikeDocumentation(src) {
    const segments = src.split('\n');
    if (segments.length === 1) {
        return src;
    }
    const spacesToDeindent = segments[segments.length - 1].search(/\S/);
    return (segments[0] +
        '\n' +
        segments
            .slice(1)
            .map(s => s.slice(spacesToDeindent))
            .join('\n'));
}
//# sourceMappingURL=componentInfo.js.map