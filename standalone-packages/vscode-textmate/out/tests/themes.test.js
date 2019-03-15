/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var assert = require("assert");
var main_1 = require("../main");
var grammar_1 = require("../grammar");
var theme_1 = require("../theme");
var plist = require("../plist");
var themeTest_1 = require("./themeTest");
var onigLibs_1 = require("../onigLibs");
var resolver_1 = require("./resolver");
var THEMES_TEST_PATH = path.join(__dirname, '../../test-cases/themes');
var ThemeInfo = /** @class */ (function () {
    function ThemeInfo(themeName, filename, includeFilename) {
        this._themeName = themeName;
        this._filename = filename;
        this._includeFilename = includeFilename;
    }
    ThemeInfo._loadThemeFile = function (filename) {
        var fullPath = path.join(THEMES_TEST_PATH, filename);
        var fileContents = fs.readFileSync(fullPath).toString();
        if (/\.json$/.test(filename)) {
            return JSON.parse(fileContents);
        }
        return plist.parse(fileContents);
    };
    ThemeInfo.prototype.create = function (resolver) {
        var theme = ThemeInfo._loadThemeFile(this._filename);
        if (this._includeFilename) {
            var includeTheme = ThemeInfo._loadThemeFile(this._includeFilename);
            theme.settings = includeTheme.settings.concat(theme.settings);
        }
        // console.log(JSON.stringify(theme, null, '\t')); process.exit(0);
        var registry = new main_1.Registry(resolver);
        registry.setTheme(theme);
        return {
            themeName: this._themeName,
            theme: theme,
            registry: registry
        };
    };
    return ThemeInfo;
}());
(function () {
    var _this = this;
    var THEMES = [
        new ThemeInfo('abyss', 'Abyss.tmTheme'),
        new ThemeInfo('dark_vs', 'dark_vs.json'),
        new ThemeInfo('light_vs', 'light_vs.json'),
        new ThemeInfo('hc_black', 'hc_black.json'),
        new ThemeInfo('dark_plus', 'dark_plus.json', 'dark_vs.json'),
        new ThemeInfo('light_plus', 'light_plus.json', 'light_vs.json'),
        new ThemeInfo('kimbie_dark', 'Kimbie_dark.tmTheme'),
        new ThemeInfo('monokai', 'Monokai.tmTheme'),
        new ThemeInfo('monokai_dimmed', 'dimmed-monokai.tmTheme'),
        new ThemeInfo('quietlight', 'QuietLight.tmTheme'),
        new ThemeInfo('red', 'red.tmTheme'),
        new ThemeInfo('solarized_dark', 'Solarized-dark.tmTheme'),
        new ThemeInfo('solarized_light', 'Solarized-light.tmTheme'),
        new ThemeInfo('tomorrow_night_blue', 'Tomorrow-Night-Blue.tmTheme'),
    ];
    // Load all language/grammar metadata
    var _grammars = JSON.parse(fs.readFileSync(path.join(THEMES_TEST_PATH, 'grammars.json')).toString('utf8'));
    for (var _i = 0, _grammars_1 = _grammars; _i < _grammars_1.length; _i++) {
        var grammar = _grammars_1[_i];
        grammar.path = path.join(THEMES_TEST_PATH, grammar.path);
    }
    var _languages = JSON.parse(fs.readFileSync(path.join(THEMES_TEST_PATH, 'languages.json')).toString('utf8'));
    var _resolvers = [
        new resolver_1.Resolver(_grammars, _languages, onigLibs_1.getOnigasm(), 'onigasm'),
        new resolver_1.Resolver(_grammars, _languages, onigLibs_1.getOniguruma(), 'oniguruma')
    ];
    var _themeDatas = _resolvers.map(function (resolver) { return THEMES.map(function (theme) { return theme.create(resolver); }); });
    describe('Theme suite', function () { return __awaiter(_this, void 0, void 0, function () {
        var testFiles, _i, testFiles_1, testFile, _loop_1, i;
        return __generator(this, function (_a) {
            testFiles = fs.readdirSync(path.join(THEMES_TEST_PATH, 'tests'));
            testFiles = testFiles.filter(function (testFile) { return !/\.result$/.test(testFile); });
            testFiles = testFiles.filter(function (testFile) { return !/\.result.patch$/.test(testFile); });
            testFiles = testFiles.filter(function (testFile) { return !/\.actual$/.test(testFile); });
            testFiles = testFiles.filter(function (testFile) { return !/\.diff.html$/.test(testFile); });
            for (_i = 0, testFiles_1 = testFiles; _i < testFiles_1.length; _i++) {
                testFile = testFiles_1[_i];
                _loop_1 = function (i) {
                    var test_1 = new themeTest_1.ThemeTest(THEMES_TEST_PATH, testFile, _resolvers[i]);
                    it(test_1.testName, function () {
                        return test_1.evaluate(_themeDatas[i]).then(function (_) {
                            //test.writeDiffPage();
                            assert.ok(!test_1.hasDiff(), 'no more unpatched differences');
                        });
                    }).timeout(20000);
                };
                for (i = 0; i < _resolvers.length; i++) {
                    _loop_1(i);
                }
            }
            return [2 /*return*/];
        });
    }); });
})();
describe('Theme matching', function () {
    it('gives higher priority to deeper matches', function () {
        var theme = theme_1.Theme.createFromRawTheme({
            settings: [
                { settings: { foreground: '#100000', background: '#200000' } },
                { scope: 'punctuation.definition.string.begin.html', settings: { foreground: '#300000' } },
                { scope: 'meta.tag punctuation.definition.string', settings: { foreground: '#400000' } },
            ]
        });
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#100000');
        var _B = colorMap.getId('#200000');
        var _C = colorMap.getId('#400000');
        var _D = colorMap.getId('#300000');
        var actual = theme.match('punctuation.definition.string.begin.html');
        // console.log(actual); process.exit(0);
        assert.deepEqual(actual, [
            new theme_1.ThemeTrieElementRule(5, null, -1 /* NotSet */, _D, _NOT_SET),
            new theme_1.ThemeTrieElementRule(3, ['meta.tag'], -1 /* NotSet */, _C, _NOT_SET),
        ]);
    });
    it('gives higher priority to parent matches 1', function () {
        var theme = theme_1.Theme.createFromRawTheme({
            settings: [
                { settings: { foreground: '#100000', background: '#200000' } },
                { scope: 'c a', settings: { foreground: '#300000' } },
                { scope: 'd a.b', settings: { foreground: '#400000' } },
                { scope: 'a', settings: { foreground: '#500000' } },
            ]
        });
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#100000');
        var _B = colorMap.getId('#200000');
        var _C = colorMap.getId('#500000');
        var _D = colorMap.getId('#300000');
        var _E = colorMap.getId('#400000');
        var actual = theme.match('a.b');
        assert.deepEqual(actual, [
            new theme_1.ThemeTrieElementRule(2, ['d'], -1 /* NotSet */, _E, _NOT_SET),
            new theme_1.ThemeTrieElementRule(1, ['c'], -1 /* NotSet */, _D, _NOT_SET),
            new theme_1.ThemeTrieElementRule(1, null, -1 /* NotSet */, _C, _NOT_SET),
        ]);
    });
    it('gives higher priority to parent matches 2', function () {
        var theme = theme_1.Theme.createFromRawTheme({
            settings: [
                { settings: { foreground: '#100000', background: '#200000' } },
                { scope: 'meta.tag entity', settings: { foreground: '#300000' } },
                { scope: 'meta.selector.css entity.name.tag', settings: { foreground: '#400000' } },
                { scope: 'entity', settings: { foreground: '#500000' } },
            ]
        });
        var root = new grammar_1.ScopeListElement(null, 'text.html.cshtml', 0);
        var parent = new grammar_1.ScopeListElement(root, 'meta.tag.structure.any.html', 0);
        var r = grammar_1.ScopeListElement.mergeMetadata(0, parent, new grammar_1.ScopeMetadata('entity.name.tag.structure.any.html', 0, 0, theme.match('entity.name.tag.structure.any.html')));
        var colorMap = theme.getColorMap();
        assert.equal(colorMap[grammar_1.StackElementMetadata.getForeground(r)], '#300000');
    });
    it('can match', function () {
        var theme = theme_1.Theme.createFromRawTheme({
            settings: [
                { settings: { foreground: '#F8F8F2', background: '#272822' } },
                { scope: 'source, something', settings: { background: '#100000' } },
                { scope: ['bar', 'baz'], settings: { background: '#200000' } },
                { scope: 'source.css selector bar', settings: { fontStyle: 'bold' } },
                { scope: 'constant', settings: { fontStyle: 'italic', foreground: '#300000' } },
                { scope: 'constant.numeric', settings: { foreground: '#400000' } },
                { scope: 'constant.numeric.hex', settings: { fontStyle: 'bold' } },
                { scope: 'constant.numeric.oct', settings: { fontStyle: 'bold italic underline' } },
                { scope: 'constant.numeric.dec', settings: { fontStyle: '', foreground: '#500000' } },
                { scope: 'storage.object.bar', settings: { fontStyle: '', foreground: '#600000' } },
            ]
        });
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#200000');
        var _D = colorMap.getId('#300000');
        var _E = colorMap.getId('#400000');
        var _F = colorMap.getId('#500000');
        var _G = colorMap.getId('#100000');
        var _H = colorMap.getId('#600000');
        function assertMatch(scopeName, expected) {
            var actual = theme.match(scopeName);
            assert.deepEqual(actual, expected, 'when matching <<' + scopeName + '>>');
        }
        function assertSimpleMatch(scopeName, scopeDepth, fontStyle, foreground, background) {
            assertMatch(scopeName, [
                new theme_1.ThemeTrieElementRule(scopeDepth, null, fontStyle, foreground, background)
            ]);
        }
        function assertNoMatch(scopeName) {
            assertMatch(scopeName, [
                new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)
            ]);
        }
        // matches defaults
        assertNoMatch('');
        assertNoMatch('bazz');
        assertNoMatch('asdfg');
        // matches source
        assertSimpleMatch('source', 1, -1 /* NotSet */, _NOT_SET, _G);
        assertSimpleMatch('source.ts', 1, -1 /* NotSet */, _NOT_SET, _G);
        assertSimpleMatch('source.tss', 1, -1 /* NotSet */, _NOT_SET, _G);
        // matches something
        assertSimpleMatch('something', 1, -1 /* NotSet */, _NOT_SET, _G);
        assertSimpleMatch('something.ts', 1, -1 /* NotSet */, _NOT_SET, _G);
        assertSimpleMatch('something.tss', 1, -1 /* NotSet */, _NOT_SET, _G);
        // matches baz
        assertSimpleMatch('baz', 1, -1 /* NotSet */, _NOT_SET, _C);
        assertSimpleMatch('baz.ts', 1, -1 /* NotSet */, _NOT_SET, _C);
        assertSimpleMatch('baz.tss', 1, -1 /* NotSet */, _NOT_SET, _C);
        // matches constant
        assertSimpleMatch('constant', 1, 1 /* Italic */, _D, _NOT_SET);
        assertSimpleMatch('constant.string', 1, 1 /* Italic */, _D, _NOT_SET);
        assertSimpleMatch('constant.hex', 1, 1 /* Italic */, _D, _NOT_SET);
        // matches constant.numeric
        assertSimpleMatch('constant.numeric', 2, 1 /* Italic */, _E, _NOT_SET);
        assertSimpleMatch('constant.numeric.baz', 2, 1 /* Italic */, _E, _NOT_SET);
        // matches constant.numeric.hex
        assertSimpleMatch('constant.numeric.hex', 3, 2 /* Bold */, _E, _NOT_SET);
        assertSimpleMatch('constant.numeric.hex.baz', 3, 2 /* Bold */, _E, _NOT_SET);
        // matches constant.numeric.oct
        assertSimpleMatch('constant.numeric.oct', 3, 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */, _E, _NOT_SET);
        assertSimpleMatch('constant.numeric.oct.baz', 3, 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */, _E, _NOT_SET);
        // matches constant.numeric.dec
        assertSimpleMatch('constant.numeric.dec', 3, 0 /* None */, _F, _NOT_SET);
        assertSimpleMatch('constant.numeric.dec.baz', 3, 0 /* None */, _F, _NOT_SET);
        // matches storage.object.bar
        assertSimpleMatch('storage.object.bar', 3, 0 /* None */, _H, _NOT_SET);
        assertSimpleMatch('storage.object.bar.baz', 3, 0 /* None */, _H, _NOT_SET);
        // does not match storage.object.bar
        assertSimpleMatch('storage.object.bart', 0, -1 /* NotSet */, _NOT_SET, _NOT_SET);
        assertSimpleMatch('storage.object', 0, -1 /* NotSet */, _NOT_SET, _NOT_SET);
        assertSimpleMatch('storage', 0, -1 /* NotSet */, _NOT_SET, _NOT_SET);
        assertMatch('bar', [
            new theme_1.ThemeTrieElementRule(1, ['selector', 'source.css'], 2 /* Bold */, _NOT_SET, _C),
            new theme_1.ThemeTrieElementRule(1, null, -1 /* NotSet */, _NOT_SET, _C),
        ]);
    });
    it('Microsoft/vscode#23460', function () {
        var theme = theme_1.Theme.createFromRawTheme({
            settings: [
                {
                    settings: {
                        foreground: '#aec2e0',
                        background: '#14191f'
                    }
                }, {
                    name: 'JSON String',
                    scope: 'meta.structure.dictionary.json string.quoted.double.json',
                    settings: {
                        foreground: '#FF410D'
                    }
                }, {
                    scope: 'meta.structure.dictionary.json string.quoted.double.json',
                    settings: {
                        foreground: '#ffffff'
                    }
                },
                {
                    scope: 'meta.structure.dictionary.value.json string.quoted.double.json',
                    settings: {
                        foreground: '#FF410D'
                    }
                }
            ]
        });
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#aec2e0');
        var _B = colorMap.getId('#14191f');
        var _C = colorMap.getId('#FF410D');
        var _D = colorMap.getId('#ffffff');
        function assertMatch(scopeName, expected) {
            var actual = theme.match(scopeName);
            assert.deepEqual(actual, expected, 'when matching <<' + scopeName + '>>');
        }
        // string.quoted.double.json
        // meta.structure.dictionary.value.json
        // meta.structure.dictionary.json
        // source.json
        assertMatch('string.quoted.double.json', [
            new theme_1.ThemeTrieElementRule(4, ['meta.structure.dictionary.value.json'], -1 /* NotSet */, _C, _NOT_SET),
            new theme_1.ThemeTrieElementRule(4, ['meta.structure.dictionary.json'], -1 /* NotSet */, _D, _NOT_SET),
            new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET),
        ]);
        var parent3 = new grammar_1.ScopeListElement(null, 'source.json', 0);
        var parent2 = new grammar_1.ScopeListElement(parent3, 'meta.structure.dictionary.json', 0);
        var parent1 = new grammar_1.ScopeListElement(parent2, 'meta.structure.dictionary.value.json', 0);
        var r = grammar_1.ScopeListElement.mergeMetadata(0, parent1, new grammar_1.ScopeMetadata('string.quoted.double.json', 0, 0, theme.match('string.quoted.double.json')));
        var colorMap2 = theme.getColorMap();
        assert.equal(colorMap2[grammar_1.StackElementMetadata.getForeground(r)], '#FF410D');
    });
});
describe('Theme parsing', function () {
    it('can parse', function () {
        var actual = theme_1.parseTheme({
            settings: [
                { settings: { foreground: '#F8F8F2', background: '#272822' } },
                { scope: 'source, something', settings: { background: '#100000' } },
                { scope: ['bar', 'baz'], settings: { background: '#010000' } },
                { scope: 'source.css selector bar', settings: { fontStyle: 'bold' } },
                { scope: 'constant', settings: { fontStyle: 'italic', foreground: '#ff0000' } },
                { scope: 'constant.numeric', settings: { foreground: '#00ff00' } },
                { scope: 'constant.numeric.hex', settings: { fontStyle: 'bold' } },
                { scope: 'constant.numeric.oct', settings: { fontStyle: 'bold italic underline' } },
                { scope: 'constant.numeric.dec', settings: { fontStyle: '', foreground: '#0000ff' } },
                { scope: 'foo', settings: { fontStyle: '', foreground: '#CFA' } },
            ]
        });
        var expected = [
            new theme_1.ParsedThemeRule('', null, 0, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('source', null, 1, -1 /* NotSet */, null, '#100000'),
            new theme_1.ParsedThemeRule('something', null, 1, -1 /* NotSet */, null, '#100000'),
            new theme_1.ParsedThemeRule('bar', null, 2, -1 /* NotSet */, null, '#010000'),
            new theme_1.ParsedThemeRule('baz', null, 2, -1 /* NotSet */, null, '#010000'),
            new theme_1.ParsedThemeRule('bar', ['selector', 'source.css'], 3, 2 /* Bold */, null, null),
            new theme_1.ParsedThemeRule('constant', null, 4, 1 /* Italic */, '#ff0000', null),
            new theme_1.ParsedThemeRule('constant.numeric', null, 5, -1 /* NotSet */, '#00ff00', null),
            new theme_1.ParsedThemeRule('constant.numeric.hex', null, 6, 2 /* Bold */, null, null),
            new theme_1.ParsedThemeRule('constant.numeric.oct', null, 7, 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */, null, null),
            new theme_1.ParsedThemeRule('constant.numeric.dec', null, 8, 0 /* None */, '#0000ff', null),
            new theme_1.ParsedThemeRule('foo', null, 9, 0 /* None */, '#CFA', null),
        ];
        assert.deepEqual(actual, expected);
    });
});
describe('Theme resolving', function () {
    it('strcmp works', function () {
        var actual = ['bar', 'z', 'zu', 'a', 'ab', ''].sort(theme_1.strcmp);
        var expected = ['', 'a', 'ab', 'bar', 'z', 'zu'];
        assert.deepEqual(actual, expected);
    });
    it('strArrCmp works', function () {
        function assertStrArrCmp(testCase, a, b, expected) {
            assert.equal(theme_1.strArrCmp(a, b), expected, testCase);
        }
        assertStrArrCmp('001', null, null, 0);
        assertStrArrCmp('002', null, [], -1);
        assertStrArrCmp('003', null, ['a'], -1);
        assertStrArrCmp('004', [], null, 1);
        assertStrArrCmp('005', ['a'], null, 1);
        assertStrArrCmp('006', [], [], 0);
        assertStrArrCmp('007', [], ['a'], -1);
        assertStrArrCmp('008', ['a'], [], 1);
        assertStrArrCmp('009', ['a'], ['a'], 0);
        assertStrArrCmp('010', ['a', 'b'], ['a'], 1);
        assertStrArrCmp('011', ['a'], ['a', 'b'], -1);
        assertStrArrCmp('012', ['a', 'b'], ['a', 'b'], 0);
        assertStrArrCmp('013', ['a', 'b'], ['a', 'c'], -1);
        assertStrArrCmp('014', ['a', 'c'], ['a', 'b'], 1);
    });
    it('always has defaults', function () {
        var actual = theme_1.Theme.createFromParsedTheme([]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#000000');
        var _B = colorMap.getId('#ffffff');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('respects incoming defaults 1', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, null, null)
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#000000');
        var _B = colorMap.getId('#ffffff');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('respects incoming defaults 2', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, 0 /* None */, null, null)
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#000000');
        var _B = colorMap.getId('#ffffff');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('respects incoming defaults 3', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, 2 /* Bold */, null, null)
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#000000');
        var _B = colorMap.getId('#ffffff');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 2 /* Bold */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('respects incoming defaults 4', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#ff0000', null)
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#ff0000');
        var _B = colorMap.getId('#ffffff');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('respects incoming defaults 5', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, null, '#ff0000')
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#000000');
        var _B = colorMap.getId('#ff0000');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('can merge incoming defaults', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, null, '#ff0000'),
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#00ff00', null),
            new theme_1.ParsedThemeRule('', null, -1, 2 /* Bold */, null, null),
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#00ff00');
        var _B = colorMap.getId('#ff0000');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 2 /* Bold */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET)));
        assert.deepEqual(actual, expected);
    });
    it('defaults are inherited', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('var', null, -1, -1 /* NotSet */, '#ff0000', null)
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#ff0000');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET), [], {
            'var': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, -1 /* NotSet */, _C, _NOT_SET))
        }));
        assert.deepEqual(actual, expected);
    });
    it('same rules get merged', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('var', null, 1, 2 /* Bold */, null, null),
            new theme_1.ParsedThemeRule('var', null, 0, -1 /* NotSet */, '#ff0000', null),
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#ff0000');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET), [], {
            'var': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, 2 /* Bold */, _C, _NOT_SET))
        }));
        assert.deepEqual(actual, expected);
    });
    it('rules are inherited 1', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('var', null, -1, 2 /* Bold */, '#ff0000', null),
            new theme_1.ParsedThemeRule('var.identifier', null, -1, -1 /* NotSet */, '#00ff00', null),
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#ff0000');
        var _D = colorMap.getId('#00ff00');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET), [], {
            'var': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, 2 /* Bold */, _C, _NOT_SET), [], {
                'identifier': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(2, null, 2 /* Bold */, _D, _NOT_SET))
            })
        }));
        assert.deepEqual(actual, expected);
    });
    it('rules are inherited 2', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('var', null, -1, 2 /* Bold */, '#ff0000', null),
            new theme_1.ParsedThemeRule('var.identifier', null, -1, -1 /* NotSet */, '#00ff00', null),
            new theme_1.ParsedThemeRule('constant', null, 4, 1 /* Italic */, '#100000', null),
            new theme_1.ParsedThemeRule('constant.numeric', null, 5, -1 /* NotSet */, '#200000', null),
            new theme_1.ParsedThemeRule('constant.numeric.hex', null, 6, 2 /* Bold */, null, null),
            new theme_1.ParsedThemeRule('constant.numeric.oct', null, 7, 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */, null, null),
            new theme_1.ParsedThemeRule('constant.numeric.dec', null, 8, 0 /* None */, '#300000', null),
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#100000');
        var _D = colorMap.getId('#200000');
        var _E = colorMap.getId('#300000');
        var _F = colorMap.getId('#ff0000');
        var _G = colorMap.getId('#00ff00');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET), [], {
            'var': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, 2 /* Bold */, _F, _NOT_SET), [], {
                'identifier': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(2, null, 2 /* Bold */, _G, _NOT_SET))
            }),
            'constant': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, 1 /* Italic */, _C, _NOT_SET), [], {
                'numeric': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(2, null, 1 /* Italic */, _D, _NOT_SET), [], {
                    'hex': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(3, null, 2 /* Bold */, _D, _NOT_SET)),
                    'oct': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(3, null, 2 /* Bold */ | 1 /* Italic */ | 4 /* Underline */, _D, _NOT_SET)),
                    'dec': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(3, null, 0 /* None */, _E, _NOT_SET)),
                })
            })
        }));
        assert.deepEqual(actual, expected);
    });
    it('rules with parent scopes', function () {
        var actual = theme_1.Theme.createFromParsedTheme([
            new theme_1.ParsedThemeRule('', null, -1, -1 /* NotSet */, '#F8F8F2', '#272822'),
            new theme_1.ParsedThemeRule('var', null, -1, 2 /* Bold */, '#100000', null),
            new theme_1.ParsedThemeRule('var.identifier', null, -1, -1 /* NotSet */, '#200000', null),
            new theme_1.ParsedThemeRule('var', ['source.css'], 1, 1 /* Italic */, '#300000', null),
            new theme_1.ParsedThemeRule('var', ['source.css'], 2, 4 /* Underline */, null, null),
        ]);
        var colorMap = new theme_1.ColorMap();
        var _NOT_SET = 0;
        var _A = colorMap.getId('#F8F8F2');
        var _B = colorMap.getId('#272822');
        var _C = colorMap.getId('#100000');
        var _D = colorMap.getId('#300000');
        var _E = colorMap.getId('#200000');
        var expected = new theme_1.Theme(colorMap, new theme_1.ThemeTrieElementRule(0, null, 0 /* None */, _A, _B), new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(0, null, -1 /* NotSet */, _NOT_SET, _NOT_SET), [], {
            'var': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(1, null, 2 /* Bold */, _C, 0), [new theme_1.ThemeTrieElementRule(1, ['source.css'], 4 /* Underline */, _D, _NOT_SET)], {
                'identifier': new theme_1.ThemeTrieElement(new theme_1.ThemeTrieElementRule(2, null, 2 /* Bold */, _E, _NOT_SET), [new theme_1.ThemeTrieElementRule(1, ['source.css'], 4 /* Underline */, _D, _NOT_SET)])
            })
        }));
        assert.deepEqual(actual, expected);
    });
    it('issue #38: ignores rules with invalid colors', function () {
        var actual = theme_1.parseTheme({
            settings: [{
                    settings: {
                        background: '#222222',
                        foreground: '#cccccc'
                    }
                }, {
                    name: 'Variable',
                    scope: 'variable',
                    settings: {
                        fontStyle: ''
                    }
                }, {
                    name: 'Function argument',
                    scope: 'variable.parameter',
                    settings: {
                        fontStyle: 'italic',
                        foreground: ''
                    }
                }, {
                    name: 'Library variable',
                    scope: 'support.other.variable',
                    settings: {
                        fontStyle: ''
                    }
                }, {
                    name: 'Function argument',
                    scope: 'variable.other',
                    settings: {
                        foreground: '',
                        fontStyle: 'normal'
                    }
                }, {
                    name: 'Coffeescript Function argument',
                    scope: 'variable.parameter.function.coffee',
                    settings: {
                        foreground: '#F9D423',
                        fontStyle: 'italic'
                    }
                }]
        });
        var expected = [
            new theme_1.ParsedThemeRule('', null, 0, -1 /* NotSet */, '#cccccc', '#222222'),
            new theme_1.ParsedThemeRule('variable', null, 1, 0 /* None */, null, null),
            new theme_1.ParsedThemeRule('variable.parameter', null, 2, 1 /* Italic */, null, null),
            new theme_1.ParsedThemeRule('support.other.variable', null, 3, 0 /* None */, null, null),
            new theme_1.ParsedThemeRule('variable.other', null, 4, 0 /* None */, null, null),
            new theme_1.ParsedThemeRule('variable.parameter.function.coffee', null, 5, 1 /* Italic */, '#F9D423', null),
        ];
        assert.deepEqual(actual, expected);
    });
    it('issue #35: Trailing comma in a tmTheme scope selector', function () {
        var actual = theme_1.parseTheme({
            settings: [{
                    settings: {
                        background: '#25292C',
                        foreground: '#EFEFEF'
                    }
                }, {
                    name: 'CSS at-rule keyword control',
                    scope: [
                        'meta.at-rule.return.scss,',
                        'meta.at-rule.return.scss punctuation.definition,',
                        'meta.at-rule.else.scss,',
                        'meta.at-rule.else.scss punctuation.definition,',
                        'meta.at-rule.if.scss,',
                        'meta.at-rule.if.scss punctuation.definition,'
                    ].join('\n'),
                    settings: {
                        foreground: '#CC7832'
                    }
                }]
        });
        var expected = [
            new theme_1.ParsedThemeRule('', null, 0, -1 /* NotSet */, '#EFEFEF', '#25292C'),
            new theme_1.ParsedThemeRule('meta.at-rule.return.scss', null, 1, -1 /* NotSet */, '#CC7832', null),
            new theme_1.ParsedThemeRule('punctuation.definition', ['meta.at-rule.return.scss'], 1, -1 /* NotSet */, '#CC7832', null),
            new theme_1.ParsedThemeRule('meta.at-rule.else.scss', null, 1, -1 /* NotSet */, '#CC7832', null),
            new theme_1.ParsedThemeRule('punctuation.definition', ['meta.at-rule.else.scss'], 1, -1 /* NotSet */, '#CC7832', null),
            new theme_1.ParsedThemeRule('meta.at-rule.if.scss', null, 1, -1 /* NotSet */, '#CC7832', null),
            new theme_1.ParsedThemeRule('punctuation.definition', ['meta.at-rule.if.scss'], 1, -1 /* NotSet */, '#CC7832', null),
        ];
        assert.deepEqual(actual, expected);
    });
});
//# sourceMappingURL=themes.test.js.map