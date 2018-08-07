import '../../editor/editor.api.js';
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Emitter = monaco.Emitter;
// --- JSON configuration and defaults ---------
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(languageId, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._languageId = languageId;
        this.setDiagnosticsOptions(diagnosticsOptions);
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
        get: function () {
            return this._languageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "diagnosticsOptions", {
        get: function () {
            return this._diagnosticsOptions;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    return LanguageServiceDefaultsImpl;
}());
export { LanguageServiceDefaultsImpl };
var diagnosticDefault = {
    validate: true,
    allowComments: true,
    schemas: []
};
var jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault);
// Export API
function createAPI() {
    return {
        jsonDefaults: jsonDefaults,
    };
}
monaco.languages.json = createAPI();
// --- Registration to monaco editor ---
function getMode() {
    return monaco.Promise.wrap(import('./jsonMode.js'));
}
monaco.languages.register({
    id: 'json',
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});
monaco.languages.onLanguage('json', function () {
    getMode().then(function (mode) { return mode.setupMode(jsonDefaults); });
});
