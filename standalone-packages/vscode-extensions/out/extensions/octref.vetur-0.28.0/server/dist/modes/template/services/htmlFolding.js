"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoldingRanges = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const htmlScanner_1 = require("../parser/htmlScanner");
const htmlTags_1 = require("../tagProviders/htmlTags");
function getFoldingRanges(document) {
    const scanner = htmlScanner_1.createScanner(document.getText());
    let token = scanner.scan();
    const ranges = [];
    const stack = [];
    let lastTagName = null;
    let prevStart = -1;
    function addRange(range) {
        ranges.push(range);
        prevStart = range.startLine;
    }
    while (token !== htmlScanner_1.TokenType.EOS) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTag: {
                const tagName = scanner.getTokenText();
                const startLine = document.positionAt(scanner.getTokenOffset()).line;
                stack.push({ startLine, tagName });
                lastTagName = tagName;
                break;
            }
            case htmlScanner_1.TokenType.EndTag: {
                lastTagName = scanner.getTokenText();
                break;
            }
            case htmlScanner_1.TokenType.StartTagClose:
                if (!lastTagName || !htmlTags_1.isVoidElement(lastTagName)) {
                    break;
                }
            // fallthrough
            case htmlScanner_1.TokenType.EndTagClose:
            case htmlScanner_1.TokenType.StartTagSelfClose: {
                let i = stack.length - 1;
                while (i >= 0 && stack[i].tagName !== lastTagName) {
                    i--;
                }
                if (i >= 0) {
                    const stackElement = stack[i];
                    stack.length = i;
                    const line = document.positionAt(scanner.getTokenOffset()).line;
                    const startLine = stackElement.startLine;
                    const endLine = line - 1;
                    if (endLine > startLine && prevStart !== startLine) {
                        addRange({ startLine, endLine });
                    }
                }
                break;
            }
            case htmlScanner_1.TokenType.Comment: {
                let startLine = document.positionAt(scanner.getTokenOffset()).line;
                const text = scanner.getTokenText();
                const m = text.match(/^\s*#(region\b)|(endregion\b)/);
                if (m) {
                    if (m[1]) {
                        // start pattern match
                        stack.push({ startLine, tagName: '' }); // empty tagName marks region
                    }
                    else {
                        let i = stack.length - 1;
                        while (i >= 0 && stack[i].tagName.length) {
                            i--;
                        }
                        if (i >= 0) {
                            const stackElement = stack[i];
                            stack.length = i;
                            const endLine = startLine;
                            startLine = stackElement.startLine;
                            if (endLine > startLine && prevStart !== startLine) {
                                addRange({ startLine, endLine, kind: vscode_languageserver_types_1.FoldingRangeKind.Region });
                            }
                        }
                    }
                }
                else {
                    const endLine = document.positionAt(scanner.getTokenOffset() + scanner.getTokenLength()).line;
                    if (startLine < endLine) {
                        addRange({ startLine, endLine, kind: vscode_languageserver_types_1.FoldingRangeKind.Comment });
                    }
                }
                break;
            }
        }
        token = scanner.scan();
    }
    return ranges;
}
exports.getFoldingRanges = getFoldingRanges;
//# sourceMappingURL=htmlFolding.js.map