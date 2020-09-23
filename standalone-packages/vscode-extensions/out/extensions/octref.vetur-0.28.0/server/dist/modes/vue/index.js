"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueMode = void 0;
const snippets_1 = require("./snippets");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
function getVueMode(workspacePath, globalSnippetDir) {
    let config = {};
    const snippetManager = new snippets_1.SnippetManager(workspacePath, globalSnippetDir);
    let scaffoldSnippetSources = {
        workspace: '💼',
        user: '🗒️',
        vetur: '✌'
    };
    return {
        getId() {
            return 'vue';
        },
        configure(c) {
            config = c;
            if (c.vetur.completion['scaffoldSnippetSources']) {
                scaffoldSnippetSources = c.vetur.completion['scaffoldSnippetSources'];
            }
        },
        doComplete(document, position) {
            if (scaffoldSnippetSources['workspace'] === '' &&
                scaffoldSnippetSources['user'] === '' &&
                scaffoldSnippetSources['vetur'] === '') {
                return { isIncomplete: false, items: [] };
            }
            const offset = document.offsetAt(position);
            const lines = document
                .getText()
                .slice(0, offset)
                .split('\n');
            const currentLine = lines[position.line];
            const items = snippetManager ? snippetManager.completeSnippets(scaffoldSnippetSources) : [];
            // If a line starts with `<`, it's probably a starting region tag that can be wholly replaced
            if (currentLine.length > 0 && currentLine.startsWith('<')) {
                const replacementRange = vscode_css_languageservice_1.Range.create(document.positionAt(offset - currentLine.length), document.positionAt(offset));
                items.forEach(i => {
                    if (i.insertText) {
                        i.textEdit = {
                            newText: i.insertText,
                            range: replacementRange
                        };
                    }
                });
            }
            return {
                isIncomplete: false,
                items
            };
        },
        onDocumentRemoved() { },
        dispose() { }
    };
}
exports.getVueMode = getVueMode;
//# sourceMappingURL=index.js.map