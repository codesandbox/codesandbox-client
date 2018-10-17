/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../_.contribution", "assert", "../monaco.contribution"], function (require, exports, __contribution_1, assert) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Allow for running under nodejs/requirejs in tests
    var _monaco = (typeof monaco === 'undefined' ? self.monaco : monaco);
    function testTokenization(_language, tests) {
        var languages;
        if (typeof _language === 'string') {
            languages = [_language];
        }
        else {
            languages = _language;
        }
        var mainLanguage = languages[0];
        suite(mainLanguage + ' tokenization', function () {
            test('', function (done) {
                _monaco.Promise.join(languages.map(function (l) { return __contribution_1.loadLanguage(l); })).then(function () {
                    // clean stack
                    setTimeout(function () {
                        runTests(mainLanguage, tests);
                        done();
                    });
                }).then(null, done);
            });
        });
    }
    exports.testTokenization = testTokenization;
    function runTests(languageId, tests) {
        tests.forEach(function (test) { return runTest(languageId, test); });
    }
    function runTest(languageId, test) {
        var text = test.map(function (t) { return t.line; }).join('\n');
        var actualTokens = _monaco.editor.tokenize(text, languageId);
        var actual = actualTokens.map(function (lineTokens, index) {
            return {
                line: test[index].line,
                tokens: lineTokens.map(function (t) {
                    return {
                        startIndex: t.offset,
                        type: t.type
                    };
                })
            };
        });
        assert.deepEqual(actual, test);
    }
});
