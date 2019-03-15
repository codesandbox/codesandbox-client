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
var onigLibs_1 = require("../onigLibs");
var REPO_ROOT = path.join(__dirname, '../../');
function assertTokenizationSuite(testLocation) {
    var tests = JSON.parse(fs.readFileSync(testLocation).toString());
    tests.forEach(function (test) {
        if (test.skipOnigasm) {
            it.skip(test.desc + '-onigasm', function () {
                return performTest(test, onigLibs_1.getOnigasm());
            });
        }
        else {
            it(test.desc + '-onigasm', function () {
                return performTest(test, onigLibs_1.getOnigasm());
            });
        }
        it(test.desc + '-oniguruma', function () {
            return performTest(test, onigLibs_1.getOniguruma());
        });
    });
    function performTest(test, onigLib) {
        return __awaiter(this, void 0, void 0, function () {
            var grammarScopeName, grammarByScope, _i, _a, grammarPath, content, rawGrammar, locator, registry, grammar, prevState, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        grammarScopeName = test.grammarScopeName;
                        grammarByScope = {};
                        for (_i = 0, _a = test.grammars; _i < _a.length; _i++) {
                            grammarPath = _a[_i];
                            content = fs.readFileSync(path.join(path.dirname(testLocation), grammarPath)).toString();
                            rawGrammar = main_1.parseRawGrammar(content, grammarPath);
                            grammarByScope[rawGrammar.scopeName] = rawGrammar;
                            if (!grammarScopeName && grammarPath === test.grammarPath) {
                                grammarScopeName = rawGrammar.scopeName;
                            }
                        }
                        ;
                        locator = {
                            loadGrammar: function (scopeName) { return Promise.resolve(grammarByScope[scopeName]); },
                            getInjections: function (scopeName) {
                                if (scopeName === grammarScopeName) {
                                    return test.grammarInjections;
                                }
                            },
                            getOnigLib: function () { return onigLib; }
                        };
                        registry = new main_1.Registry(locator);
                        return [4 /*yield*/, registry.loadGrammar(grammarScopeName)];
                    case 1:
                        grammar = _b.sent();
                        if (!grammar) {
                            throw new Error('I HAVE NO GRAMMAR FOR TEST');
                        }
                        prevState = null;
                        for (i = 0; i < test.lines.length; i++) {
                            prevState = assertLineTokenization(grammar, test.lines[i], prevState);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function assertLineTokenization(grammar, testCase, prevState) {
        var actual = grammar.tokenizeLine(testCase.line, prevState);
        var actualTokens = actual.tokens.map(function (token) {
            return {
                value: testCase.line.substring(token.startIndex, token.endIndex),
                scopes: token.scopes
            };
        });
        // TODO@Alex: fix tests instead of working around
        if (testCase.line.length > 0) {
            // Remove empty tokens...
            testCase.tokens = testCase.tokens.filter(function (token) {
                return (token.value.length > 0);
            });
        }
        assert.deepEqual(actualTokens, testCase.tokens, 'Tokenizing line ' + testCase.line);
        return actual.ruleStack;
    }
}
describe('Tokenization /first-mate/', function () {
    assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/first-mate/tests.json'));
});
describe('Tokenization /suite1/', function () {
    assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/suite1/tests.json'));
    assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/suite1/whileTests.json'));
});
//# sourceMappingURL=tokenization.test.js.map