(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../parser/cssNodes", "./lintRules", "./lint", "../cssLanguageTypes"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var nodes = require("../parser/cssNodes");
    var lintRules_1 = require("./lintRules");
    var lint_1 = require("./lint");
    var cssLanguageTypes_1 = require("../cssLanguageTypes");
    var CSSValidation = /** @class */ (function () {
        function CSSValidation(cssDataManager) {
            this.cssDataManager = cssDataManager;
        }
        CSSValidation.prototype.configure = function (settings) {
            this.settings = settings;
        };
        CSSValidation.prototype.doValidation = function (document, stylesheet, settings) {
            if (settings === void 0) { settings = this.settings; }
            if (settings && settings.validate === false) {
                return [];
            }
            var entries = [];
            entries.push.apply(entries, nodes.ParseErrorCollector.entries(stylesheet));
            entries.push.apply(entries, lint_1.LintVisitor.entries(stylesheet, document, new lintRules_1.LintConfigurationSettings(settings && settings.lint), this.cssDataManager));
            var ruleIds = [];
            for (var r in lintRules_1.Rules) {
                ruleIds.push(lintRules_1.Rules[r].id);
            }
            function toDiagnostic(marker) {
                var range = cssLanguageTypes_1.Range.create(document.positionAt(marker.getOffset()), document.positionAt(marker.getOffset() + marker.getLength()));
                var source = document.languageId;
                return {
                    code: marker.getRule().id,
                    source: source,
                    message: marker.getMessage(),
                    severity: marker.getLevel() === nodes.Level.Warning ? cssLanguageTypes_1.DiagnosticSeverity.Warning : cssLanguageTypes_1.DiagnosticSeverity.Error,
                    range: range
                };
            }
            return entries.filter(function (entry) { return entry.getLevel() !== nodes.Level.Ignore; }).map(toDiagnostic);
        };
        return CSSValidation;
    }());
    exports.CSSValidation = CSSValidation;
});
