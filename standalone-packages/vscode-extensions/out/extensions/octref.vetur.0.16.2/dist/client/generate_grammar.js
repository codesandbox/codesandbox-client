"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
const path_1 = require("path");
const grammar_1 = require("./grammar");
function generateGrammarCommandHandler(extensionPath) {
    return () => {
        try {
            const customBlocks = vscode.workspace.getConfiguration().get('vetur.grammar.customBlocks') || {};
            const generatedGrammar = grammar_1.getGeneratedGrammar(path_1.resolve(extensionPath, 'syntaxes/vue.tmLanguage.json'), customBlocks);
            fs_1.writeFileSync(path_1.resolve(extensionPath, 'syntaxes/vue-generated.json'), generatedGrammar, 'utf-8');
            vscode.window.showInformationMessage('Successfully generated vue grammar. Reload VS Code to enable it.');
        }
        catch (e) {
            vscode.window.showErrorMessage('Failed to generate vue grammar. `vetur.grammar.customBlocks` contain invalid language values');
        }
    };
}
exports.generateGrammarCommandHandler = generateGrammarCommandHandler;
//# sourceMappingURL=generate_grammar.js.map