define(["require", "exports", "./workerManager", "./languageFeatures"], function (require, exports, workerManager_1, languageFeatures) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var javaScriptWorker;
    var typeScriptWorker;
    function setupTypeScript(defaults) {
        typeScriptWorker = setupMode(defaults, 'typescript');
    }
    exports.setupTypeScript = setupTypeScript;
    function setupJavaScript(defaults) {
        javaScriptWorker = setupMode(defaults, 'javascript');
    }
    exports.setupJavaScript = setupJavaScript;
    function getJavaScriptWorker() {
        return new monaco.Promise(function (resolve, reject) {
            if (!javaScriptWorker) {
                return reject("JavaScript not registered!");
            }
            resolve(javaScriptWorker);
        });
    }
    exports.getJavaScriptWorker = getJavaScriptWorker;
    function getTypeScriptWorker() {
        return new monaco.Promise(function (resolve, reject) {
            if (!typeScriptWorker) {
                return reject("TypeScript not registered!");
            }
            resolve(typeScriptWorker);
        });
    }
    exports.getTypeScriptWorker = getTypeScriptWorker;
    function setupMode(defaults, modeId) {
        var client = new workerManager_1.WorkerManager(modeId, defaults);
        var worker = function (first) {
            var more = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                more[_i - 1] = arguments[_i];
            }
            return client.getLanguageServiceWorker.apply(client, [first].concat(more));
        };
        monaco.languages.registerCompletionItemProvider(modeId, new languageFeatures.SuggestAdapter(worker));
        monaco.languages.registerSignatureHelpProvider(modeId, new languageFeatures.SignatureHelpAdapter(worker));
        monaco.languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker));
        monaco.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.OccurrencesAdapter(worker));
        monaco.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(worker));
        monaco.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(worker));
        monaco.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.OutlineAdapter(worker));
        monaco.languages.registerDocumentRangeFormattingEditProvider(modeId, new languageFeatures.FormatAdapter(worker));
        monaco.languages.registerOnTypeFormattingEditProvider(modeId, new languageFeatures.FormatOnTypeAdapter(worker));
        new languageFeatures.DiagnostcsAdapter(defaults, modeId, worker);
        return worker;
    }
});
