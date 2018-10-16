/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nls from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { LanguageConfigurationRegistry } from './languageConfigurationRegistry.js';
import { LanguageIdentifier } from '../modes.js';
// Define extension point ids
export var Extensions = {
    ModesRegistry: 'editor.modesRegistry'
};
var EditorModesRegistry = /** @class */ (function () {
    function EditorModesRegistry() {
        this._onDidAddLanguages = new Emitter();
        this.onDidAddLanguages = this._onDidAddLanguages.event;
        this._languages = [];
    }
    // --- languages
    EditorModesRegistry.prototype.registerLanguage = function (def) {
        this._languages.push(def);
        this._onDidAddLanguages.fire([def]);
    };
    EditorModesRegistry.prototype.registerLanguages = function (def) {
        this._languages = this._languages.concat(def);
        this._onDidAddLanguages.fire(def);
    };
    EditorModesRegistry.prototype.getLanguages = function () {
        return this._languages.slice(0);
    };
    return EditorModesRegistry;
}());
export { EditorModesRegistry };
export var ModesRegistry = new EditorModesRegistry();
Registry.add(Extensions.ModesRegistry, ModesRegistry);
export var PLAINTEXT_MODE_ID = 'plaintext';
export var PLAINTEXT_LANGUAGE_IDENTIFIER = new LanguageIdentifier(PLAINTEXT_MODE_ID, 1 /* PlainText */);
ModesRegistry.registerLanguage({
    id: PLAINTEXT_MODE_ID,
    extensions: ['.txt', '.gitignore'],
    aliases: [nls.localize('plainText.alias', "Plain Text"), 'text'],
    mimetypes: ['text/plain']
});
LanguageConfigurationRegistry.register(PLAINTEXT_LANGUAGE_IDENTIFIER, {
    brackets: [
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
    ]
});
