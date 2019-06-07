"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oracle = require("./elmOracle");
const vscode = require("vscode");
const config = vscode.workspace.getConfiguration('elm');
class ElmHoverProvider {
    provideHover(document, position, token) {
        return oracle
            .GetOracleResults(document, position, oracle.OracleAction.IsHover)
            .then(result => {
            if (result && result.length > 0) {
                if (result.length > 1) {
                    let wordAtPosition = document.getWordRangeAtPosition(position);
                    if (wordAtPosition) {
                        let currentWord = document.getText(wordAtPosition);
                        let exactMatches = result.filter(item => item.name === currentWord);
                        if (exactMatches.length > 0) {
                            result = exactMatches;
                        }
                    }
                }
                let text = this.formatSig(result[0].signature) + '\n\n' + result[0].comment;
                let hover = new vscode.Hover(config['showSuggestionsInElmSyntax']
                    ? { language: 'elm', value: text }
                    : text);
                return hover;
            }
            else {
                return null;
            }
        });
    }
    formatSig(signature) {
        return ('~~~\n' +
            signature
                .replace(/\{/g, '  {') // spaces before open brace
                .replace(/\s?,/g, '\n  ,') // newlines + spaces before comma
                .replace(/\}\s?/g, '\n  }\n') + // newline + spaces before close brace + newline after
            '\n~~~');
    }
}
exports.ElmHoverProvider = ElmHoverProvider;
//# sourceMappingURL=elmInfo.js.map