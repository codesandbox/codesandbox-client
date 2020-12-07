'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class HLSLReferenceProvider {
    provideReferences(document, position, options, token) {
        let enable = vscode_1.workspace.getConfiguration('hlsl').get('suggest.basic', true);
        if (!enable) {
            return null;
        }
        let wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }
        let name = document.getText(wordRange);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let results = [];
            const text = document.getText();
            const regex = new RegExp(`\\b${name}\\b`, 'gm');
            let match = null;
            while (match = regex.exec(text)) {
                let refPosition = document.positionAt(match.index);
                results.push(new vscode_1.Location(document.uri, document.getWordRangeAtPosition(refPosition)));
            }
            let symbols = yield vscode_1.commands.executeCommand('vscode.executeWorkspaceSymbolProvider', name);
            symbols.filter(s => (s.name === name && s.location.uri.toString() != document.uri.toString())).forEach(symbol => {
                results.push(symbol.location);
            });
            resolve(results);
        }));
    }
}
exports.default = HLSLReferenceProvider;
//# sourceMappingURL=referenceProvider.js.map