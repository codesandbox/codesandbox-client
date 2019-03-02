"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_uri_1 = require("vscode-uri");
function findComponents(service, fileFsPath) {
    const program = service.getProgram();
    if (!program) {
        return [];
    }
    const sourceFile = program.getSourceFile(fileFsPath);
    const exportStmt = sourceFile.statements.filter(st => st.kind === ts.SyntaxKind.ExportAssignment);
    if (exportStmt.length === 0) {
        return [];
    }
    const exportExpr = exportStmt[0].expression;
    const comp = getComponentFromExport(exportExpr);
    if (!comp) {
        return [];
    }
    const checker = program.getTypeChecker();
    const compType = checker.getTypeAtLocation(comp);
    const childComps = getPropertyTypeOfType(compType, 'components', checker);
    if (!childComps) {
        return [];
    }
    return checker.getPropertiesOfType(childComps).map(s => getCompInfo(s, checker));
}
exports.findComponents = findComponents;
function getComponentFromExport(exportExpr) {
    switch (exportExpr.kind) {
        case ts.SyntaxKind.CallExpression:
            // Vue.extend or synthetic __vueEditorBridge
            return exportExpr.arguments[0];
        case ts.SyntaxKind.ObjectLiteralExpression:
            return exportExpr;
    }
    return undefined;
}
// Vue.extend will return a type without `props`. We need to find the object literal
function findDefinitionLiteralSymbol(symbol, checker) {
    const node = symbol.valueDeclaration;
    if (!node) {
        return undefined;
    }
    if (node.kind === ts.SyntaxKind.PropertyAssignment) {
        // {comp: importedComponent}
        symbol = checker.getSymbolAtLocation(node.initializer) || symbol;
    }
    else if (node.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
        // {comp}
        symbol = checker.getShorthandAssignmentValueSymbol(node) || symbol;
    }
    if (symbol.flags & ts.SymbolFlags.Alias) {
        // resolve import Comp from './comp.vue'
        symbol = checker.getAliasedSymbol(symbol);
    }
    return symbol;
}
function getCompInfo(symbol, checker) {
    const info = {
        name: hyphenate(symbol.name)
    };
    const literalSymbol = findDefinitionLiteralSymbol(symbol, checker);
    if (!literalSymbol) {
        return info;
    }
    const declaration = literalSymbol.valueDeclaration;
    if (!declaration) {
        return info;
    }
    info.definition = [
        {
            uri: vscode_uri_1.default.file(declaration.getSourceFile().fileName).toString(),
            range: vscode_languageserver_types_1.Range.create(0, 0, 0, 0)
        }
    ];
    let node = declaration;
    if (declaration.kind === ts.SyntaxKind.ExportAssignment) {
        const expr = declaration.expression;
        node = getComponentFromExport(expr) || declaration;
    }
    const compType = checker.getTypeAtLocation(node);
    const arrayProps = getArrayProps(compType, checker);
    if (arrayProps) {
        info.props = arrayProps;
        return info;
    }
    const props = getPropertyTypeOfType(compType, 'props', checker);
    if (!props) {
        return info;
    }
    info.props = checker.getPropertiesOfType(props).map(s => {
        return {
            name: hyphenate(s.name),
            doc: getPropTypeDeclaration(s, checker)
        };
    });
    return info;
}
function getPropTypeDeclaration(prop, checker) {
    if (!prop.valueDeclaration) {
        return '';
    }
    const declaration = prop.valueDeclaration.getChildAt(2);
    if (!declaration) {
        return '';
    }
    if (declaration.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        const text = [];
        declaration.forEachChild(n => {
            text.push(n.getText());
        });
        return text.join('\n');
    }
    return declaration.getText();
}
function isStringLiteral(e) {
    return e.kind === ts.SyntaxKind.StringLiteral;
}
function getArrayProps(compType, checker) {
    const propSymbol = checker.getPropertyOfType(compType, 'props');
    if (!propSymbol || !propSymbol.valueDeclaration) {
        return undefined;
    }
    const propDef = propSymbol.valueDeclaration.getChildAt(2);
    if (!propDef || propDef.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return undefined;
    }
    const propArray = propDef;
    return propArray.elements
        .filter(isStringLiteral)
        .map(e => ({ name: hyphenate(e.text) }));
}
function getPropertyTypeOfType(tpe, property, checker) {
    const propSymbol = checker.getPropertyOfType(tpe, property);
    return getSymbolType(propSymbol, checker);
}
function getSymbolType(symbol, checker) {
    if (!symbol || !symbol.valueDeclaration) {
        return undefined;
    }
    return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
}
const hyphenateRE = /\B([A-Z])/g;
function hyphenate(word) {
    return word.replace(hyphenateRE, '-$1').toLowerCase();
}
//# sourceMappingURL=findComponents.js.map