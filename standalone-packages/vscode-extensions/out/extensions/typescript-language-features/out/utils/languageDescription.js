"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesResourceLookLikeAJavaScriptFile = exports.doesResourceLookLikeATypeScriptFile = exports.isJsConfigOrTsConfigFileName = exports.isTsConfigFileName = exports.standardLanguageDescriptions = exports.allDiagnosticLanguages = void 0;
const path_1 = require("path");
const languageModeIds = require("./languageModeIds");
exports.allDiagnosticLanguages = [0 /* JavaScript */, 1 /* TypeScript */];
exports.standardLanguageDescriptions = [
    {
        id: 'typescript',
        diagnosticOwner: 'typescript',
        diagnosticSource: 'ts',
        diagnosticLanguage: 1 /* TypeScript */,
        modeIds: [languageModeIds.typescript, languageModeIds.typescriptreact],
        configFilePattern: /^tsconfig(\..*)?\.json$/gi,
        standardFileExtensions: [
            'ts',
            'tsx',
            'cts',
            'mts'
        ],
    }, {
        id: 'javascript',
        diagnosticOwner: 'typescript',
        diagnosticSource: 'ts',
        diagnosticLanguage: 0 /* JavaScript */,
        modeIds: [languageModeIds.javascript, languageModeIds.javascriptreact],
        configFilePattern: /^jsconfig(\..*)?\.json$/gi,
        standardFileExtensions: [
            'js',
            'jsx',
            'cjs',
            'mjs',
            'es6',
            'pac',
        ],
    }
];
function isTsConfigFileName(fileName) {
    return /^tsconfig\.(.+\.)?json$/i.test((0, path_1.basename)(fileName));
}
exports.isTsConfigFileName = isTsConfigFileName;
function isJsConfigOrTsConfigFileName(fileName) {
    return /^[jt]sconfig\.(.+\.)?json$/i.test((0, path_1.basename)(fileName));
}
exports.isJsConfigOrTsConfigFileName = isJsConfigOrTsConfigFileName;
function doesResourceLookLikeATypeScriptFile(resource) {
    return /\.(tsx?|mts|cts)$/i.test(resource.fsPath);
}
exports.doesResourceLookLikeATypeScriptFile = doesResourceLookLikeATypeScriptFile;
function doesResourceLookLikeAJavaScriptFile(resource) {
    return /\.(jsx?|mjs|cjs)$/i.test(resource.fsPath);
}
exports.doesResourceLookLikeAJavaScriptFile = doesResourceLookLikeAJavaScriptFile;
//# sourceMappingURL=languageDescription.js.map