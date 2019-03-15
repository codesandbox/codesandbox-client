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
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var durations = require("durations");
var resolver_1 = require("./resolver");
var onigLibs_1 = require("../onigLibs");
var main_1 = require("../main");
describe.skip('Compare OnigLibs outputs', function () {
    var registrations = getVSCodeRegistrations();
    ;
    if (!registrations) {
        console.log('vscode repo ot found, skipping OnigLibs tests');
        return;
    }
    var onigurumaResolver = new resolver_1.Resolver(registrations.grammarRegistrations, registrations.languageRegistrations, onigLibs_1.getOniguruma(), 'oniguruma');
    var onigasmResolver = new resolver_1.Resolver(registrations.grammarRegistrations, registrations.languageRegistrations, onigLibs_1.getOnigasm(), 'onigasm');
    var fixturesDir = path.join(__dirname, '../../test-cases/onigtests/fixtures');
    var fixturesFiles = fs.readdirSync(fixturesDir);
    for (var _i = 0, fixturesFiles_1 = fixturesFiles; _i < fixturesFiles_1.length; _i++) {
        var fixturesFile = fixturesFiles_1[_i];
        var testFilePath = path.join(fixturesDir, fixturesFile);
        var scopeName = onigurumaResolver.findScopeByFilename(fixturesFile);
        addTest(scopeName, testFilePath, new main_1.Registry(onigurumaResolver), new main_1.Registry(onigasmResolver));
    }
});
function addTest(scopeName, filePath, onigurumaRegistry, onigasmRegistry) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            it(scopeName + '/' + path.basename(filePath), function () { return __awaiter(_this, void 0, void 0, function () {
                var fileContent, lines, prevState1, prevState2, grammar1, grammar2, stopWatch1, stopWatch2, i, t1, t2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileContent = fs.readFileSync(filePath).toString();
                            lines = fileContent.match(/[^\r\n]+/g);
                            prevState1 = null;
                            prevState2 = null;
                            return [4 /*yield*/, onigurumaRegistry.loadGrammar(scopeName)];
                        case 1:
                            grammar1 = _a.sent();
                            return [4 /*yield*/, onigasmRegistry.loadGrammar(scopeName)];
                        case 2:
                            grammar2 = _a.sent();
                            stopWatch1 = durations.stopwatch();
                            stopWatch2 = durations.stopwatch();
                            for (i = 0; i < lines.length; i++) {
                                stopWatch1.start();
                                t1 = grammar1.tokenizeLine(lines[i], prevState1);
                                stopWatch1.stop();
                                stopWatch2.start();
                                t2 = grammar2.tokenizeLine(lines[i], prevState2);
                                stopWatch2.stop();
                                assert.deepEqual(t2.tokens, t1.tokens, "Difference at line " + i + ": " + lines[i]);
                                prevState1 = t1.ruleStack;
                                prevState2 = t2.ruleStack;
                            }
                            console.log("Oniguruma: " + stopWatch1.format() + ", Onigasm: " + stopWatch2.format() + " (" + Math.round(stopWatch2.duration().micros() * 10 / stopWatch1.duration().micros()) / 10 + "x slower)");
                            return [2 /*return*/];
                    }
                });
            }); }).timeout(1000000);
            return [2 /*return*/];
        });
    });
}
function getVSCodeRegistrations() {
    var grammarRegistrations = [];
    var languageRegistrations = [];
    var extensionsPath = path.join(__dirname, '../../../vscode/extensions');
    if (!fs.existsSync(extensionsPath)) {
        return null;
    }
    var extDirs = fs.readdirSync(extensionsPath);
    for (var _i = 0, extDirs_1 = extDirs; _i < extDirs_1.length; _i++) {
        var ext = extDirs_1[_i];
        try {
            var packageJSONPath = path.join(extensionsPath, ext, 'package.json');
            if (!fs.existsSync(packageJSONPath)) {
                continue;
            }
            var packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString());
            var contributes = packageJSON['contributes'];
            if (contributes) {
                var grammars = contributes['grammars'];
                if (Array.isArray(grammars)) {
                    for (var _a = 0, grammars_1 = grammars; _a < grammars_1.length; _a++) {
                        var grammar = grammars_1[_a];
                        var registration = {
                            scopeName: grammar.scopeName,
                            path: path.join(extensionsPath, ext, grammar.path),
                            language: grammar.language,
                            embeddedLanguages: grammar.embeddedLanguages
                        };
                        grammarRegistrations.push(registration);
                    }
                }
                var languages = contributes['languages'];
                if (Array.isArray(languages)) {
                    for (var _b = 0, languages_1 = languages; _b < languages_1.length; _b++) {
                        var language = languages_1[_b];
                        var registration = {
                            id: language.id,
                            filenames: language.filenames,
                            extensions: language.extensions
                        };
                        languageRegistrations.push(registration);
                    }
                }
            }
        }
        catch (e) {
            // i
        }
    }
    return { grammarRegistrations: grammarRegistrations, languageRegistrations: languageRegistrations };
}
//# sourceMappingURL=onig.test.js.map