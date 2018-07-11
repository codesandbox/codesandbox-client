define(["require", "exports", "./tokenization", "./workerManager", "./languageFeatures"], function (require, exports, tokenization_1, workerManager_1, languageFeatures) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var javaScriptWorker;
    var typeScriptWorker;
    function setupTypeScript(defaults) {
        typeScriptWorker = setupMode(defaults, 'typescript', tokenization_1.Language.TypeScript);
    }
    exports.setupTypeScript = setupTypeScript;
    function setupJavaScript(defaults) {
        javaScriptWorker = setupMode(defaults, 'javascript', tokenization_1.Language.EcmaScript5);
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
    function setupMode(defaults, modeId, language) {
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
        monaco.languages.setLanguageConfiguration(modeId, richEditConfiguration);
        monaco.languages.setTokensProvider(modeId, tokenization_1.createTokenizationSupport(language));
        return worker;
    }
    var richEditConfiguration = {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
            },
            {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' }
            },
            {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: monaco.languages.IndentAction.None, appendText: '* ' }
            },
            {
                // e.g.  */|
                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                action: { indentAction: monaco.languages.IndentAction.None, removeText: 1 }
            }
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"', notIn: ['string'] },
            { open: '\'', close: '\'', notIn: ['string', 'comment'] },
            { open: '`', close: '`', notIn: ['string', 'comment'] },
            { open: "/**", close: " */", notIn: ["string"] }
        ],
        folding: {
            markers: {
                start: new RegExp("^\\s*//\\s*#?region\\b"),
                end: new RegExp("^\\s*//\\s*#?endregion\\b")
            }
        }
    };
});
