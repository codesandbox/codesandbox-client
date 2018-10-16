/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { WorkerManager } from './workerManager.js';
import * as languageFeatures from './languageFeatures.js';
import { createTokenizationSupport } from './tokenization.js';
export function setupMode(defaults) {
    var disposables = [];
    var client = new WorkerManager(defaults);
    disposables.push(client);
    var worker = function () {
        var uris = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            uris[_i] = arguments[_i];
        }
        return client.getLanguageServiceWorker.apply(client, uris);
    };
    var languageId = defaults.languageId;
    disposables.push(monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker)));
    disposables.push(monaco.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
    disposables.push(monaco.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
    disposables.push(monaco.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker)));
    disposables.push(monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker)));
    disposables.push(new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults));
    disposables.push(monaco.languages.setTokensProvider(languageId, createTokenizationSupport(true)));
    disposables.push(monaco.languages.setLanguageConfiguration(languageId, richEditConfiguration));
    disposables.push(monaco.languages.registerColorProvider(languageId, new languageFeatures.DocumentColorAdapter(worker)));
}
var richEditConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
    },
    brackets: [
        ['{', '}'],
        ['[', ']']
    ],
    autoClosingPairs: [
        { open: '{', close: '}', notIn: ['string'] },
        { open: '[', close: ']', notIn: ['string'] },
        { open: '"', close: '"', notIn: ['string'] }
    ]
};
