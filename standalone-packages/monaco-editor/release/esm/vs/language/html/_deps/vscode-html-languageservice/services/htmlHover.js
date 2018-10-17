/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TokenType, createScanner } from '../parser/htmlScanner.js';
import { MarkedString } from '../../vscode-languageserver-types/main.js';
import { allTagProviders } from './tagProviders.js';
export function doHover(document, position, htmlDocument) {
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeAt(offset);
    if (!node || !node.tag) {
        return null;
    }
    var tagProviders = allTagProviders.filter(function (p) { return p.isApplicable(document.languageId); });
    function getTagHover(tag, range, open) {
        tag = tag.toLowerCase();
        var _loop_1 = function (provider) {
            var hover = null;
            provider.collectTags(function (t, label) {
                if (t === tag) {
                    var tagLabel = open ? '<' + tag + '>' : '</' + tag + '>';
                    hover = { contents: [{ language: 'html', value: tagLabel }, MarkedString.fromPlainText(label)], range: range };
                }
            });
            if (hover) {
                return { value: hover };
            }
        };
        for (var _i = 0, tagProviders_1 = tagProviders; _i < tagProviders_1.length; _i++) {
            var provider = tagProviders_1[_i];
            var state_1 = _loop_1(provider);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    }
    function getTagNameRange(tokenType, startOffset) {
        var scanner = createScanner(document.getText(), startOffset);
        var token = scanner.scan();
        while (token !== TokenType.EOS && (scanner.getTokenEnd() < offset || scanner.getTokenEnd() === offset && token !== tokenType)) {
            token = scanner.scan();
        }
        if (token === tokenType && offset <= scanner.getTokenEnd()) {
            return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
        }
        return null;
    }
    if (node.endTagStart && offset >= node.endTagStart) {
        var tagRange_1 = getTagNameRange(TokenType.EndTag, node.endTagStart);
        if (tagRange_1) {
            return getTagHover(node.tag, tagRange_1, false);
        }
        return null;
    }
    var tagRange = getTagNameRange(TokenType.StartTag, node.start);
    if (tagRange) {
        return getTagHover(node.tag, tagRange, true);
    }
    return null;
}
//# sourceMappingURL=htmlHover.js.map