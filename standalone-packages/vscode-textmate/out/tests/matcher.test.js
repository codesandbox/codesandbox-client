/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var matcher_1 = require("../matcher");
describe('Matcher', function () {
    var tests = [
        { "expression": "foo", "input": ["foo"], "result": true },
        { "expression": "foo", "input": ["bar"], "result": false },
        { "expression": "- foo", "input": ["foo"], "result": false },
        { "expression": "- foo", "input": ["bar"], "result": true },
        { "expression": "- - foo", "input": ["bar"], "result": false },
        { "expression": "bar foo", "input": ["foo"], "result": false },
        { "expression": "bar foo", "input": ["bar"], "result": false },
        { "expression": "bar foo", "input": ["bar", "foo"], "result": true },
        { "expression": "bar - foo", "input": ["bar"], "result": true },
        { "expression": "bar - foo", "input": ["foo", "bar"], "result": false },
        { "expression": "bar - foo", "input": ["foo"], "result": false },
        { "expression": "bar, foo", "input": ["foo"], "result": true },
        { "expression": "bar, foo", "input": ["bar"], "result": true },
        { "expression": "bar, foo", "input": ["bar", "foo"], "result": true },
        { "expression": "bar, -foo", "input": ["bar", "foo"], "result": true },
        { "expression": "bar, -foo", "input": ["yo"], "result": true },
        { "expression": "bar, -foo", "input": ["foo"], "result": false },
        { "expression": "(foo)", "input": ["foo"], "result": true },
        { "expression": "(foo - bar)", "input": ["foo"], "result": true },
        { "expression": "(foo - bar)", "input": ["foo", "bar"], "result": false },
        { "expression": "foo bar - (yo man)", "input": ["foo", "bar"], "result": true },
        { "expression": "foo bar - (yo man)", "input": ["foo", "bar", "yo"], "result": true },
        { "expression": "foo bar - (yo man)", "input": ["foo", "bar", "yo", "man"], "result": false },
        { "expression": "foo bar - (yo | man)", "input": ["foo", "bar", "yo", "man"], "result": false },
        { "expression": "foo bar - (yo | man)", "input": ["foo", "bar", "yo"], "result": false },
        { "expression": "R:text.html - (comment.block, text.html source)", "input": ["text.html", "bar", "source"], "result": false },
        { "expression": "text.html.php - (meta.embedded | meta.tag), L:text.html.php meta.tag, L:source.js.embedded.html", "input": ["text.html.php", "bar", "source.js"], "result": true }
    ];
    var nameMatcher = function (identifers, stackElements) {
        var lastIndex = 0;
        return identifers.every(function (identifier) {
            for (var i = lastIndex; i < stackElements.length; i++) {
                if (stackElements[i] === identifier) {
                    lastIndex = i + 1;
                    return true;
                }
            }
            return false;
        });
    };
    tests.forEach(function (test, index) {
        it('Test #' + index, function () {
            var matchers = matcher_1.createMatchers(test.expression, nameMatcher);
            var result = matchers.some(function (m) { return m.matcher(test.input); });
            assert.equal(result, test.result);
        });
    });
});
//# sourceMappingURL=matcher.test.js.map