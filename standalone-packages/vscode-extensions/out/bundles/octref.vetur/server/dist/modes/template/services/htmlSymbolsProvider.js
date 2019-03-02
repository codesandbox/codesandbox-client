"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function findDocumentSymbols(document, htmlDocument) {
    const symbols = [];
    htmlDocument.roots.forEach(node => {
        provideFileSymbolsInternal(document, node, '', symbols);
    });
    return symbols;
}
exports.findDocumentSymbols = findDocumentSymbols;
function provideFileSymbolsInternal(document, node, container, symbols) {
    if (node.isInterpolation) {
        return;
    }
    const name = nodeToName(node);
    const location = vscode_languageserver_types_1.Location.create(document.uri, vscode_languageserver_types_1.Range.create(document.positionAt(node.start), document.positionAt(node.end)));
    const symbol = {
        name,
        location,
        containerName: container,
        kind: vscode_languageserver_types_1.SymbolKind.Field
    };
    symbols.push(symbol);
    node.children.forEach(child => {
        provideFileSymbolsInternal(document, child, name, symbols);
    });
}
function nodeToName(node) {
    let name = node.tag;
    if (!name) {
        return '';
    }
    if (node.attributes) {
        const id = node.attributes['id'];
        const classes = node.attributes['class'];
        if (id) {
            name += `#${id.replace(/[\"\']/g, '')}`;
        }
        if (classes) {
            name += classes
                .replace(/[\"\']/g, '')
                .split(/\s+/)
                .map(className => `.${className}`)
                .join('');
        }
    }
    return name;
}
//# sourceMappingURL=htmlSymbolsProvider.js.map