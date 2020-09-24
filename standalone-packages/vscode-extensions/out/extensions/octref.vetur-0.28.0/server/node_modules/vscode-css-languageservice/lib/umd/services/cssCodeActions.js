(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../parser/cssNodes", "../utils/strings", "../services/lintRules", "../cssLanguageTypes", "vscode-nls"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var nodes = require("../parser/cssNodes");
    var strings_1 = require("../utils/strings");
    var lintRules_1 = require("../services/lintRules");
    var cssLanguageTypes_1 = require("../cssLanguageTypes");
    var nls = require("vscode-nls");
    var localize = nls.loadMessageBundle();
    var CSSCodeActions = /** @class */ (function () {
        function CSSCodeActions(cssDataManager) {
            this.cssDataManager = cssDataManager;
        }
        CSSCodeActions.prototype.doCodeActions = function (document, range, context, stylesheet) {
            return this.doCodeActions2(document, range, context, stylesheet).map(function (ca) {
                var textDocumentEdit = ca.edit && ca.edit.documentChanges && ca.edit.documentChanges[0];
                return cssLanguageTypes_1.Command.create(ca.title, '_css.applyCodeAction', document.uri, document.version, textDocumentEdit && textDocumentEdit.edits);
            });
        };
        CSSCodeActions.prototype.doCodeActions2 = function (document, range, context, stylesheet) {
            var result = [];
            if (context.diagnostics) {
                for (var _i = 0, _a = context.diagnostics; _i < _a.length; _i++) {
                    var diagnostic = _a[_i];
                    this.appendFixesForMarker(document, stylesheet, diagnostic, result);
                }
            }
            return result;
        };
        CSSCodeActions.prototype.getFixesForUnknownProperty = function (document, property, marker, result) {
            var propertyName = property.getName();
            var candidates = [];
            this.cssDataManager.getProperties().forEach(function (p) {
                var score = strings_1.difference(propertyName, p.name);
                if (score >= propertyName.length / 2 /*score_lim*/) {
                    candidates.push({ property: p.name, score: score });
                }
            });
            // Sort in descending order.
            candidates.sort(function (a, b) {
                return b.score - a.score || a.property.localeCompare(b.property);
            });
            var maxActions = 3;
            for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
                var candidate = candidates_1[_i];
                var propertyName_1 = candidate.property;
                var title = localize('css.codeaction.rename', "Rename to '{0}'", propertyName_1);
                var edit = cssLanguageTypes_1.TextEdit.replace(marker.range, propertyName_1);
                var documentIdentifier = cssLanguageTypes_1.VersionedTextDocumentIdentifier.create(document.uri, document.version);
                var workspaceEdit = { documentChanges: [cssLanguageTypes_1.TextDocumentEdit.create(documentIdentifier, [edit])] };
                var codeAction = cssLanguageTypes_1.CodeAction.create(title, workspaceEdit, cssLanguageTypes_1.CodeActionKind.QuickFix);
                codeAction.diagnostics = [marker];
                result.push(codeAction);
                if (--maxActions <= 0) {
                    return;
                }
            }
        };
        CSSCodeActions.prototype.appendFixesForMarker = function (document, stylesheet, marker, result) {
            if (marker.code !== lintRules_1.Rules.UnknownProperty.id) {
                return;
            }
            var offset = document.offsetAt(marker.range.start);
            var end = document.offsetAt(marker.range.end);
            var nodepath = nodes.getNodePath(stylesheet, offset);
            for (var i = nodepath.length - 1; i >= 0; i--) {
                var node = nodepath[i];
                if (node instanceof nodes.Declaration) {
                    var property = node.getProperty();
                    if (property && property.offset === offset && property.end === end) {
                        this.getFixesForUnknownProperty(document, property, marker, result);
                        return;
                    }
                }
            }
        };
        return CSSCodeActions;
    }());
    exports.CSSCodeActions = CSSCodeActions;
});
