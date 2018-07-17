/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nodes from '../parser/cssNodes.js';
import * as languageFacts from './languageFacts.js';
import { difference } from '../utils/strings.js';
import { Rules } from '../services/lintRules.js';
import { Command, TextEdit } from '../../vscode-languageserver-types/main.js';
import * as nls from '../../../fillers/vscode-nls.js';
var localize = nls.loadMessageBundle();
var CSSCodeActions = /** @class */ (function () {
    function CSSCodeActions() {
    }
    CSSCodeActions.prototype.doCodeActions = function (document, range, context, stylesheet) {
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
        for (var p in languageFacts.getProperties()) {
            var score = difference(propertyName, p);
            if (score >= propertyName.length / 2 /*score_lim*/) {
                candidates.push({ property: p, score: score });
            }
        }
        // Sort in descending order.
        candidates.sort(function (a, b) {
            return b.score - a.score;
        });
        var maxActions = 3;
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            var propertyName_1 = candidate.property;
            var title = localize('css.codeaction.rename', "Rename to '{0}'", propertyName_1);
            var edit = TextEdit.replace(marker.range, propertyName_1);
            result.push(Command.create(title, '_css.applyCodeAction', document.uri, document.version, [edit]));
            if (--maxActions <= 0) {
                return;
            }
        }
    };
    CSSCodeActions.prototype.appendFixesForMarker = function (document, stylesheet, marker, result) {
        if (marker.code !== Rules.UnknownProperty.id) {
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
export { CSSCodeActions };
//# sourceMappingURL=cssCodeActions.js.map