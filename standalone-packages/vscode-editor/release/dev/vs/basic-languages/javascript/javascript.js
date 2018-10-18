/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../typescript/typescript"], function (require, exports, typescript_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Allow for running under nodejs/requirejs in tests
    var _monaco = (typeof monaco === 'undefined' ? self.monaco : monaco);
    exports.conf = typescript_1.conf;
    exports.language = {
        // Set defaultToken to invalid to see what you do not tokenize yet
        defaultToken: 'invalid',
        tokenPostfix: '.js',
        keywords: [
            'break', 'case', 'catch', 'class', 'continue', 'const',
            'constructor', 'debugger', 'default', 'delete', 'do', 'else',
            'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
            'get', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
            'return', 'set', 'super', 'switch', 'symbol', 'this', 'throw', 'true',
            'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
            'async', 'await', 'of'
        ],
        typeKeywords: [],
        operators: typescript_1.language.operators,
        symbols: typescript_1.language.symbols,
        escapes: typescript_1.language.escapes,
        digits: typescript_1.language.digits,
        octaldigits: typescript_1.language.octaldigits,
        binarydigits: typescript_1.language.binarydigits,
        hexdigits: typescript_1.language.hexdigits,
        regexpctl: typescript_1.language.regexpctl,
        regexpesc: typescript_1.language.regexpesc,
        tokenizer: typescript_1.language.tokenizer,
    };
});
