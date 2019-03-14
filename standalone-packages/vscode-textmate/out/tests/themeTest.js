/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var themedTokenizer_1 = require("./themedTokenizer");
var ThemeTest = /** @class */ (function () {
    // private readonly contents: string;
    // private readonly initialScopeName: string;
    // private readonly initialLanguage: number;
    // private readonly embeddedLanguages: IEmbeddedLanguagesMap;
    // private readonly expected: IExpected;
    // private readonly expectedPatch: IExpectedPatch;
    function ThemeTest(THEMES_TEST_PATH, testFile, resolver) {
        this.THEMES_TEST_PATH = THEMES_TEST_PATH;
        var TEST_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile);
        var testFileContents = ThemeTest._readFile(TEST_FILE_PATH);
        var EXPECTED_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile + '.result');
        var testFileExpected = ThemeTest._readJSONFile(EXPECTED_FILE_PATH);
        var EXPECTED_PATCH_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile + '.result.patch');
        var testFileExpectedPatch = ThemeTest._readJSONFile(EXPECTED_PATCH_FILE_PATH);
        // Determine the language
        var language = resolver.findLanguageByExtension(path.extname(testFile)) || resolver.findLanguageByFilename(testFile);
        if (!language) {
            throw new Error('Could not determine language for ' + testFile);
        }
        var grammar = resolver.findGrammarByLanguage(language);
        var embeddedLanguages = Object.create(null);
        if (grammar.embeddedLanguages) {
            for (var scopeName in grammar.embeddedLanguages) {
                embeddedLanguages[scopeName] = resolver.language2id[grammar.embeddedLanguages[scopeName]];
            }
        }
        // console.log(testFileExpected);
        // console.log(testFileExpectedPatch);
        this.tests = [];
        for (var themeName in testFileExpected) {
            this.tests.push(new SingleThemeTest(themeName, testFile, testFileContents, grammar.scopeName, resolver.language2id[language], embeddedLanguages, testFileExpected[themeName], testFileExpectedPatch ? testFileExpectedPatch[themeName] : []));
        }
        this.testName = testFile + '-' + resolver.getOnigLibName();
        // this.contents = testFileContents;
        // this.initialScopeName = grammar.scopeName;
        // this.initialLanguage = resolver.language2id[language];
        // this.embeddedLanguages = embeddedLanguages;
        // this.expected = testFileExpected;
        // this.expectedPatch = testFileExpectedPatch;
        // assertTokenizationForThemes(test, themeDatas);
    }
    ThemeTest._readFile = function (filename) {
        try {
            return fs.readFileSync(filename).toString('utf8');
        }
        catch (err) {
            return null;
        }
    };
    ThemeTest._readJSONFile = function (filename) {
        try {
            return JSON.parse(this._readFile(filename));
        }
        catch (err) {
            return null;
        }
    };
    ThemeTest.prototype.evaluate = function (themeDatas) {
        var testsMap = {};
        for (var i = 0; i < this.tests.length; i++) {
            testsMap[this.tests[i].themeName] = this.tests[i];
        }
        return Promise.all(themeDatas.map(function (data) { return testsMap[data.themeName].evaluate(data); }));
    };
    ThemeTest.prototype._getDiffPageData = function () {
        return this.tests.map(function (t) { return t.getDiffPageData(); });
    };
    ThemeTest.prototype.hasDiff = function () {
        for (var i = 0; i < this.tests.length; i++) {
            var test_1 = this.tests[i];
            if (test_1.patchedDiff && test_1.patchedDiff.length > 0) {
                return true;
            }
        }
        return false;
    };
    ThemeTest.prototype.writeDiffPage = function () {
        var r = "<html><head>";
        r += "\n<link rel=\"stylesheet\" type=\"text/css\" href=\"../diff.css\"/>";
        r += "\n<meta charset=\"utf-8\">";
        r += "\n</head><body>";
        r += "\n<script>var allData = \"" + new Buffer(JSON.stringify(this._getDiffPageData())).toString('base64') + "\";</script>";
        r += "\n<script type=\"text/javascript\" src=\"../diff.js\"></script>";
        r += "\n</body></html>";
        fs.writeFileSync(path.join(this.THEMES_TEST_PATH, 'tests', this.testName + '.diff.html'), r);
    };
    return ThemeTest;
}());
exports.ThemeTest = ThemeTest;
var SingleThemeTest = /** @class */ (function () {
    function SingleThemeTest(themeName, testName, contents, initialScopeName, initialLanguage, embeddedLanguages, expected, expectedPatch) {
        this.themeName = themeName;
        this.testName = testName;
        this.contents = contents;
        this.initialScopeName = initialScopeName;
        this.initialLanguage = initialLanguage;
        this.embeddedLanguages = embeddedLanguages;
        this.expected = expected;
        this.expectedPatch = expectedPatch;
        this.patchedExpected = [];
        var patchIndex = this.expectedPatch.length - 1;
        for (var i = this.expected.length - 1; i >= 0; i--) {
            var expectedElement = this.expected[i];
            var content = expectedElement.content;
            while (patchIndex >= 0 && i === this.expectedPatch[patchIndex].index) {
                var patch = this.expectedPatch[patchIndex];
                var patchContentIndex = content.lastIndexOf(patch.content);
                var afterContent = content.substr(patchContentIndex + patch.content.length);
                if (afterContent.length > 0) {
                    this.patchedExpected.unshift({
                        _r: expectedElement._r,
                        _t: expectedElement._t,
                        content: afterContent,
                        color: expectedElement.color
                    });
                }
                this.patchedExpected.unshift({
                    _r: expectedElement._r,
                    _t: expectedElement._t,
                    content: patch.content,
                    color: patch.newColor
                });
                content = content.substr(0, patchContentIndex);
                patchIndex--;
            }
            if (content.length > 0) {
                this.patchedExpected.unshift({
                    _r: expectedElement._r,
                    _t: expectedElement._t,
                    content: content,
                    color: expectedElement.color
                });
            }
        }
        this.backgroundColor = null;
        this.actual = null;
        this.diff = null;
        this.patchedDiff = null;
    }
    SingleThemeTest.prototype.evaluate = function (themeData) {
        var _this = this;
        this.backgroundColor = themeData.theme.settings[0].settings.background;
        return this._tokenizeWithThemeAsync(themeData).then(function (res) {
            _this.actual = res;
            _this.diff = SingleThemeTest.computeThemeTokenizationDiff(_this.actual, _this.expected);
            _this.patchedDiff = SingleThemeTest.computeThemeTokenizationDiff(_this.actual, _this.patchedExpected);
        });
    };
    SingleThemeTest.prototype.getDiffPageData = function () {
        return {
            testContent: this.contents,
            themeName: this.themeName,
            backgroundColor: this.backgroundColor,
            actual: this.actual,
            expected: this.expected,
            diff: this.diff,
            patchedExpected: this.patchedExpected,
            patchedDiff: this.patchedDiff
        };
    };
    SingleThemeTest.prototype._tokenizeWithThemeAsync = function (themeData) {
        var _this = this;
        return themeData.registry.loadGrammarWithEmbeddedLanguages(this.initialScopeName, this.initialLanguage, this.embeddedLanguages).then(function (grammar) {
            return themedTokenizer_1.tokenizeWithTheme(themeData.theme, themeData.registry.getColorMap(), _this.contents, grammar);
        });
    };
    SingleThemeTest.computeThemeTokenizationDiff = function (_actual, _expected) {
        var canonicalTokens = [];
        for (var i = 0, len = _actual.length; i < len; i++) {
            var explanation = _actual[i].explanation;
            for (var j = 0, lenJ = explanation.length; j < lenJ; j++) {
                canonicalTokens.push(explanation[j].content);
            }
        }
        var actual = [];
        for (var i = 0, len = _actual.length; i < len; i++) {
            var item = _actual[i];
            for (var j = 0, lenJ = item.explanation.length; j < lenJ; j++) {
                actual.push({
                    content: item.explanation[j].content,
                    color: item.color,
                    scopes: item.explanation[j].scopes
                });
            }
        }
        var expected = [];
        for (var i = 0, len = _expected.length, canonicalIndex = 0; i < len; i++) {
            var item = _expected[i];
            var content = item.content;
            while (content.length > 0) {
                expected.push({
                    oldIndex: i,
                    content: canonicalTokens[canonicalIndex],
                    color: item.color,
                    _t: item._t,
                    _r: item._r
                });
                content = content.substr(canonicalTokens[canonicalIndex].length);
                canonicalIndex++;
            }
        }
        if (actual.length !== expected.length) {
            throw new Error('Content mismatch');
        }
        var diffs = [];
        for (var i = 0, len = actual.length; i < len; i++) {
            var expectedItem = expected[i];
            var actualItem = actual[i];
            var contentIsInvisible = /^\s+$/.test(expectedItem.content);
            if (contentIsInvisible) {
                continue;
            }
            if (actualItem.color.substr(0, 7) !== expectedItem.color) {
                diffs.push({
                    oldIndex: expectedItem.oldIndex,
                    oldToken: expectedItem,
                    newToken: actualItem
                });
            }
        }
        return diffs;
    };
    return SingleThemeTest;
}());
//# sourceMappingURL=themeTest.js.map