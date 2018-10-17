/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { WorkerManager } from './workerManager.js';
import * as languageFeatures from './languageFeatures.js';
export function setupMode(defaults) {
    var client = new WorkerManager(defaults);
    var worker = function (first) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return client.getLanguageServiceWorker.apply(client, [first].concat(more));
    };
    var languageId = defaults.languageId;
    monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
    monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker));
    monaco.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker));
    monaco.languages.registerDefinitionProvider(languageId, new languageFeatures.DefinitionAdapter(worker));
    monaco.languages.registerReferenceProvider(languageId, new languageFeatures.ReferenceAdapter(worker));
    monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker));
    monaco.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker));
    monaco.languages.registerColorProvider(languageId, new languageFeatures.DocumentColorAdapter(worker));
    monaco.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker));
    new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults);
}
