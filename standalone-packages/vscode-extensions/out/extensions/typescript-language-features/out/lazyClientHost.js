"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazilyActivateClient = exports.createLazyClientHost = void 0;
const vscode = require("vscode");
const typeScriptServiceClientHost_1 = require("./typeScriptServiceClientHost");
const arrays_1 = require("./utils/arrays");
const fileSchemes = require("./utils/fileSchemes");
const languageDescription_1 = require("./utils/languageDescription");
const lazy_1 = require("./utils/lazy");
const managedFileContext_1 = require("./utils/managedFileContext");
function createLazyClientHost(context, onCaseInsensitiveFileSystem, services, onCompletionAccepted) {
    return (0, lazy_1.lazy)(() => {
        const clientHost = new typeScriptServiceClientHost_1.default(languageDescription_1.standardLanguageDescriptions, context, onCaseInsensitiveFileSystem, services, onCompletionAccepted);
        context.subscriptions.push(clientHost);
        return clientHost;
    });
}
exports.createLazyClientHost = createLazyClientHost;
function lazilyActivateClient(lazyClientHost, pluginManager, activeJsTsEditorTracker) {
    const disposables = [];
    const supportedLanguage = (0, arrays_1.flatten)([
        ...languageDescription_1.standardLanguageDescriptions.map(x => x.modeIds),
        ...pluginManager.plugins.map(x => x.languages)
    ]);
    let hasActivated = false;
    const maybeActivate = (textDocument) => {
        if (!hasActivated && isSupportedDocument(supportedLanguage, textDocument)) {
            hasActivated = true;
            // Force activation
            void lazyClientHost.value;
            disposables.push(new managedFileContext_1.default(activeJsTsEditorTracker, resource => {
                return lazyClientHost.value.serviceClient.toPath(resource);
            }));
            return true;
        }
        return false;
    };
    const didActivate = vscode.workspace.textDocuments.some(maybeActivate);
    if (!didActivate) {
        const openListener = vscode.workspace.onDidOpenTextDocument(doc => {
            if (maybeActivate(doc)) {
                openListener.dispose();
            }
        }, undefined, disposables);
    }
    return vscode.Disposable.from(...disposables);
}
exports.lazilyActivateClient = lazilyActivateClient;
function isSupportedDocument(supportedLanguage, document) {
    return supportedLanguage.indexOf(document.languageId) >= 0
        && !fileSchemes.disabledSchemes.has(document.uri.scheme);
}
//# sourceMappingURL=lazyClientHost.js.map