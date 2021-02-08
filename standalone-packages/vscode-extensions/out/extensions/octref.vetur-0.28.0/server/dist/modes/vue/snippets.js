"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnippetManager = void 0;
const fs = require("fs");
const path = require("path");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
class SnippetManager {
    constructor(workspacePath, globalSnippetDir) {
        this._snippets = [];
        const workspaceSnippets = loadAllSnippets(path.resolve(workspacePath, '.vscode/vetur/snippets'), 'workspace');
        const userSnippets = globalSnippetDir ? loadAllSnippets(globalSnippetDir, 'user') : [];
        const veturSnippets = loadAllSnippets(path.resolve(__dirname, './veturSnippets'), 'vetur');
        this._snippets = [...workspaceSnippets, ...userSnippets, ...veturSnippets];
    }
    // Return all snippets in order
    completeSnippets(scaffoldSnippetSources) {
        return this._snippets
            .filter(s => {
            return scaffoldSnippetSources[s.source] !== '';
        })
            .map(s => {
            let scaffoldLabelPre = '';
            switch (s.type) {
                case 'file':
                    scaffoldLabelPre = '<vue> with';
                    break;
                case 'custom':
                    scaffoldLabelPre = `<${s.customTypeName || 'custom'}> with`;
                    break;
                case 'template':
                case 'style':
                case 'script':
                    scaffoldLabelPre = `<${s.type}>`;
                    break;
            }
            const sourceIndicator = scaffoldSnippetSources[s.source];
            const label = `${scaffoldLabelPre} ${s.name} ${sourceIndicator}`;
            return {
                label,
                insertText: s.content,
                insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
                // Use file icon to indicate file/template/style/script/custom completions
                kind: vscode_languageserver_types_1.CompletionItemKind.File,
                documentation: computeDocumentation(s),
                detail: computeDetailsForFileIcon(s),
                sortText: computeSortTextPrefix(s) + label
            };
        });
    }
}
exports.SnippetManager = SnippetManager;
function loadAllSnippets(rootDir, source) {
    let snippets = [
        ...loadSnippetsFromDir(rootDir, source, 'file'),
        ...loadSnippetsFromDir(path.resolve(rootDir, 'template'), source, 'template'),
        ...loadSnippetsFromDir(path.resolve(rootDir, 'style'), source, 'style'),
        ...loadSnippetsFromDir(path.resolve(rootDir, 'script'), source, 'script')
    ];
    try {
        fs.readdirSync(rootDir).forEach(p => {
            if (p === 'template' || p === 'style' || p === 'script') {
                return;
            }
            const absPath = path.resolve(rootDir, p);
            if (!absPath.endsWith('.vue') && fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory()) {
                const customDirSnippets = loadSnippetsFromDir(absPath, source, 'custom').map(s => {
                    return Object.assign(Object.assign({}, s), { customTypeName: p });
                });
                snippets = [...snippets, ...customDirSnippets];
            }
        });
    }
    catch (err) { }
    return snippets;
}
function loadSnippetsFromDir(dir, source, type) {
    const snippets = [];
    if (!fs.existsSync(dir)) {
        return snippets;
    }
    try {
        fs.readdirSync(dir)
            .filter(p => p.endsWith('.vue'))
            .forEach(p => {
            snippets.push({
                source,
                name: p,
                type,
                content: fs.readFileSync(path.resolve(dir, p), 'utf-8').replace(/\\t/g, '\t')
            });
        });
    }
    catch (err) { }
    return snippets;
}
function computeSortTextPrefix(snippet) {
    const s = {
        workspace: 0,
        user: 1,
        vetur: 2
    }[snippet.source];
    const t = {
        file: 'a',
        template: 'b',
        style: 'c',
        script: 'd',
        custom: 'e'
    }[snippet.type];
    return s + t;
}
function computeDetailsForFileIcon(s) {
    switch (s.type) {
        case 'file':
            return s.name + ' | .vue';
        case 'template':
            return s.name + ' | .html';
        case 'style':
            return s.name + ' | .css';
        case 'template':
            return s.name + ' | .js';
        case 'custom':
            return s.name;
    }
}
function computeDocumentation(s) {
    return {
        kind: 'markdown',
        value: `\`\`\`vue\n${s.content}\n\`\`\``
    };
}
//# sourceMappingURL=snippets.js.map