"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.templateToSnippet = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
const defaultJsDoc = new vscode.SnippetString(`/**\n * $0\n */`);
class JsDocCompletionItem extends vscode.CompletionItem {
    constructor(document, position) {
        super('/** */', vscode.CompletionItemKind.Text);
        this.document = document;
        this.position = position;
        this.detail = localize('typescript.jsDocCompletionItem.documentation', 'JSDoc comment');
        this.sortText = '\0';
        const line = document.lineAt(position.line).text;
        const prefix = line.slice(0, position.character).match(/\/\**\s*$/);
        const suffix = line.slice(position.character).match(/^\s*\**\//);
        const start = position.translate(0, prefix ? -prefix[0].length : 0);
        const range = new vscode.Range(start, position.translate(0, suffix ? suffix[0].length : 0));
        this.range = { inserting: range, replacing: range };
    }
}
class JsDocCompletionProvider {
    constructor(client, fileConfigurationManager) {
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
    }
    async provideCompletionItems(document, position, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return undefined;
        }
        if (!this.isPotentiallyValidDocCompletionPosition(document, position)) {
            return undefined;
        }
        const response = await this.client.interruptGetErr(async () => {
            await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
            const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
            return this.client.execute('docCommentTemplate', args, token);
        });
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        const item = new JsDocCompletionItem(document, position);
        // Workaround for #43619
        // docCommentTemplate previously returned undefined for empty jsdoc templates.
        // TS 2.7 now returns a single line doc comment, which breaks indentation.
        if (response.body.newText === '/** */') {
            item.insertText = defaultJsDoc;
        }
        else {
            item.insertText = templateToSnippet(response.body.newText);
        }
        return [item];
    }
    isPotentiallyValidDocCompletionPosition(document, position) {
        // Only show the JSdoc completion when the everything before the cursor is whitespace
        // or could be the opening of a comment
        const line = document.lineAt(position.line).text;
        const prefix = line.slice(0, position.character);
        if (!/^\s*$|\/\*\*\s*$|^\s*\/\*\*+\s*$/.test(prefix)) {
            return false;
        }
        // And everything after is possibly a closing comment or more whitespace
        const suffix = line.slice(position.character);
        return /^\s*(\*+\/)?\s*$/.test(suffix);
    }
}
function templateToSnippet(template) {
    // TODO: use append placeholder
    let snippetIndex = 1;
    template = template.replace(/\$/g, '\\$');
    template = template.replace(/^[ \t]*(?=(\/|[ ]\*))/gm, '');
    template = template.replace(/^(\/\*\*\s*\*[ ]*)$/m, (x) => x + `\$0`);
    template = template.replace(/\* @param([ ]\{\S+\})?\s+(\S+)[ \t]*$/gm, (_param, type, post) => {
        let out = '* @param ';
        if (type === ' {any}' || type === ' {*}') {
            out += `{\$\{${snippetIndex++}:*\}} `;
        }
        else if (type) {
            out += type + ' ';
        }
        out += post + ` \${${snippetIndex++}}`;
        return out;
    });
    template = template.replace(/\* @returns[ \t]*$/gm, `* @returns \${${snippetIndex++}}`);
    return new vscode.SnippetString(template);
}
exports.templateToSnippet = templateToSnippet;
function register(selector, modeId, client, fileConfigurationManager) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireConfiguration)(modeId, 'suggest.completeJSDocs')
    ], () => {
        return vscode.languages.registerCompletionItemProvider(selector.syntax, new JsDocCompletionProvider(client, fileConfigurationManager), '*');
    });
}
exports.register = register;
//# sourceMappingURL=jsDocCompletions.js.map