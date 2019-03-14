/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var grammar_1 = require("../grammar");
describe('StackElementMetadata', function () {
    function assertEquals(metadata, languageId, tokenType, fontStyle, foreground, background) {
        var actual = {
            languageId: grammar_1.StackElementMetadata.getLanguageId(metadata),
            tokenType: grammar_1.StackElementMetadata.getTokenType(metadata),
            fontStyle: grammar_1.StackElementMetadata.getFontStyle(metadata),
            foreground: grammar_1.StackElementMetadata.getForeground(metadata),
            background: grammar_1.StackElementMetadata.getBackground(metadata),
        };
        var expected = {
            languageId: languageId,
            tokenType: tokenType,
            fontStyle: fontStyle,
            foreground: foreground,
            background: background,
        };
        assert.deepEqual(actual, expected, 'equals for ' + grammar_1.StackElementMetadata.toBinaryStr(metadata));
    }
    it('works', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
    });
    it('can overwrite languageId', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        value = grammar_1.StackElementMetadata.set(value, 2, 0 /* Other */, -1 /* NotSet */, 0, 0);
        assertEquals(value, 2, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
    });
    it('can overwrite tokenType', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        value = grammar_1.StackElementMetadata.set(value, 0, 1 /* Comment */, -1 /* NotSet */, 0, 0);
        assertEquals(value, 1, 1 /* Comment */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
    });
    it('can overwrite font style', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        value = grammar_1.StackElementMetadata.set(value, 0, 0 /* Other */, 0 /* None */, 0, 0);
        assertEquals(value, 1, 4 /* RegEx */, 0 /* None */, 101, 102);
    });
    it('can overwrite foreground', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        value = grammar_1.StackElementMetadata.set(value, 0, 0 /* Other */, -1 /* NotSet */, 5, 0);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 5, 102);
    });
    it('can overwrite background', function () {
        var value = grammar_1.StackElementMetadata.set(0, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 102);
        value = grammar_1.StackElementMetadata.set(value, 0, 0 /* Other */, -1 /* NotSet */, 0, 7);
        assertEquals(value, 1, 4 /* RegEx */, 4 /* Underline */ | 2 /* Bold */, 101, 7);
    });
    it('can work at max values', function () {
        var maxLangId = 255;
        var maxTokenType = 1 /* Comment */ | 0 /* Other */ | 4 /* RegEx */ | 2 /* String */;
        var maxFontStyle = 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */;
        var maxForeground = 511;
        var maxBackground = 511;
        var value = grammar_1.StackElementMetadata.set(0, maxLangId, maxTokenType, maxFontStyle, maxForeground, maxBackground);
        assertEquals(value, maxLangId, maxTokenType, maxFontStyle, maxForeground, maxBackground);
    });
});
//# sourceMappingURL=grammar.test.js.map