'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class HLSLDefinitionProvider {
    getDefinitionLocations(document, position) {
        return new Promise((resolve, reject) => {
            let enable = vscode_1.workspace.getConfiguration('hlsl').get('suggest.basic', true);
            if (!enable) {
                reject();
            }
            let wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                reject();
            }
            let name = document.getText(wordRange);
            vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri).then(symbols => {
                let result = [];
                for (let symbol of symbols) {
                    if (symbol.name === name) {
                        result.push(symbol.location);
                    }
                }
                resolve(result);
            }, reason => reject(reason));
        });
    }
    provideDefinition(document, position, token) {
        return this.getDefinitionLocations(document, position);
    }
    provideImplementation(document, position, token) {
        return this.getDefinitionLocations(document, position);
    }
    provideTypeDefinition(document, position, token) {
        return this.getDefinitionLocations(document, position);
    }
}
exports.default = HLSLDefinitionProvider;
//# sourceMappingURL=definitionProvider.js.map