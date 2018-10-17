/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nodes from '../parser/cssNodes.js';
import * as languageFacts from './languageFacts.js';
import { Range, MarkedString } from '../../vscode-languageserver-types/main.js';
import { selectorToMarkedString, simpleSelectorToMarkedString } from './selectorPrinting.js';
var CSSHover = /** @class */ (function () {
    function CSSHover() {
    }
    CSSHover.prototype.doHover = function (document, position, stylesheet) {
        function getRange(node) {
            return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
        }
        var offset = document.offsetAt(position);
        var nodepath = nodes.getNodePath(stylesheet, offset);
        for (var i = 0; i < nodepath.length; i++) {
            var node = nodepath[i];
            if (node instanceof nodes.Selector) {
                return {
                    contents: selectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof nodes.SimpleSelector) {
                return {
                    contents: simpleSelectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof nodes.Declaration) {
                var propertyName = node.getFullPropertyName();
                var entry = languageFacts.getProperties()[propertyName];
                if (entry) {
                    var contents = [];
                    if (entry.description) {
                        contents.push(MarkedString.fromPlainText(entry.description));
                    }
                    var browserLabel = languageFacts.getBrowserLabel(entry.browsers);
                    if (browserLabel) {
                        contents.push(MarkedString.fromPlainText(browserLabel));
                    }
                    if (contents.length) {
                        return {
                            contents: contents,
                            range: getRange(node)
                        };
                    }
                }
            }
        }
        return null;
    };
    return CSSHover;
}());
export { CSSHover };
//# sourceMappingURL=cssHover.js.map