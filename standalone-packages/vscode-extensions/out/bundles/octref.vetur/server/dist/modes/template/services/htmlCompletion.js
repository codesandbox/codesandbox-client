"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const htmlScanner_1 = require("../parser/htmlScanner");
const emmet = require("vscode-emmet-helper");
function doComplete(document, position, htmlDocument, tagProviders, emmetConfig) {
    const result = {
        isIncomplete: false,
        items: []
    };
    const offset = document.offsetAt(position);
    const node = htmlDocument.findNodeBefore(offset);
    if (!node || node.isInterpolation) {
        return result;
    }
    const text = document.getText();
    const scanner = htmlScanner_1.createScanner(text, node.start);
    let currentTag;
    let currentAttributeName;
    function getReplaceRange(replaceStart, replaceEnd = offset) {
        if (replaceStart > offset) {
            replaceStart = offset;
        }
        return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
    }
    function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
        const range = getReplaceRange(afterOpenBracket, tagNameEnd);
        tagProviders.forEach(provider => {
            const priority = provider.priority;
            provider.collectTags((tag, label) => {
                result.items.push({
                    label: tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    documentation: label,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, tag),
                    sortText: priority + tag,
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function getLineIndent(offset) {
        let start = offset;
        while (start > 0) {
            const ch = text.charAt(start - 1);
            if ('\n\r'.indexOf(ch) >= 0) {
                return text.substring(start, offset);
            }
            if (!isWhiteSpace(ch)) {
                return null;
            }
            start--;
        }
        return text.substring(0, offset);
    }
    function collectCloseTagSuggestions(afterOpenBracket, matchingOnly, tagNameEnd = offset) {
        const range = getReplaceRange(afterOpenBracket, tagNameEnd);
        const closeTag = isFollowedBy(text, tagNameEnd, htmlScanner_1.ScannerState.WithinEndTag, htmlScanner_1.TokenType.EndTagClose) ? '' : '>';
        let curr = node;
        while (curr) {
            const tag = curr.tag;
            if (tag && (!curr.closed || curr.endTagStart && (curr.endTagStart > offset))) {
                const item = {
                    label: '/' + tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    filterText: '/' + tag + closeTag,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                };
                const startIndent = getLineIndent(curr.start);
                const endIndent = getLineIndent(afterOpenBracket - 1);
                if (startIndent !== null && endIndent !== null && startIndent !== endIndent) {
                    const insertText = startIndent + '</' + tag + closeTag;
                    (item.textEdit = vscode_languageserver_types_1.TextEdit.replace(getReplaceRange(afterOpenBracket - 1 - endIndent.length), insertText)),
                        (item.filterText = endIndent + '</' + tag + closeTag);
                }
                result.items.push(item);
                return result;
            }
            curr = curr.parent;
        }
        if (matchingOnly) {
            return result;
        }
        tagProviders.forEach(provider => {
            provider.collectTags((tag, label) => {
                result.items.push({
                    label: '/' + tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    documentation: label,
                    filterText: '/' + tag + closeTag,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function collectTagSuggestions(tagStart, tagEnd) {
        collectOpenTagSuggestions(tagStart, tagEnd);
        collectCloseTagSuggestions(tagStart, true, tagEnd);
        return result;
    }
    function collectAttributeNameSuggestions(nameStart, nameEnd = offset) {
        const execArray = /^[:@]/.exec(scanner.getTokenText());
        const filterPrefix = execArray ? execArray[0] : '';
        const start = filterPrefix ? nameStart + 1 : nameStart;
        const range = getReplaceRange(start, nameEnd);
        const value = isFollowedBy(text, nameEnd, htmlScanner_1.ScannerState.AfterAttributeName, htmlScanner_1.TokenType.DelimiterAssign)
            ? ''
            : '="$1"';
        const tag = currentTag.toLowerCase();
        tagProviders.forEach(provider => {
            const priority = provider.priority;
            provider.collectAttributes(tag, (attribute, type, documentation) => {
                if ((type === 'event' && filterPrefix !== '@') || (type !== 'event' && filterPrefix === '@')) {
                    return;
                }
                let codeSnippet = attribute;
                if (type !== 'v' && value.length) {
                    codeSnippet = codeSnippet + value;
                }
                result.items.push({
                    label: attribute,
                    kind: type === 'event' ? vscode_languageserver_types_1.CompletionItemKind.Function : vscode_languageserver_types_1.CompletionItemKind.Value,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, codeSnippet),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
                    sortText: priority + attribute,
                    documentation
                });
            });
        });
        return result;
    }
    function collectAttributeValueSuggestions(valueStart, valueEnd) {
        let range;
        let addQuotes;
        if (valueEnd && offset > valueStart && offset <= valueEnd && text[valueStart] === '"') {
            // inside attribute
            if (valueEnd > offset && text[valueEnd - 1] === '"') {
                valueEnd--;
            }
            const wsBefore = getWordStart(text, offset, valueStart + 1);
            const wsAfter = getWordEnd(text, offset, valueEnd);
            range = getReplaceRange(wsBefore, wsAfter);
            addQuotes = false;
        }
        else {
            range = getReplaceRange(valueStart, valueEnd);
            addQuotes = true;
        }
        const tag = currentTag.toLowerCase();
        const attribute = currentAttributeName.toLowerCase();
        tagProviders.forEach(provider => {
            provider.collectValues(tag, attribute, value => {
                const insertText = addQuotes ? '"' + value + '"' : value;
                result.items.push({
                    label: value,
                    filterText: insertText,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Unit,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, insertText),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function scanNextForEndPos(nextToken) {
        if (offset === scanner.getTokenEnd()) {
            token = scanner.scan();
            if (token === nextToken && scanner.getTokenOffset() === offset) {
                return scanner.getTokenEnd();
            }
        }
        return offset;
    }
    let token = scanner.scan();
    while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenOffset() <= offset) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTagOpen:
                if (scanner.getTokenEnd() === offset) {
                    const endPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                    return collectTagSuggestions(offset, endPos);
                }
                break;
            case htmlScanner_1.TokenType.StartTag:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentTag = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.AttributeName:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.DelimiterAssign:
                if (scanner.getTokenEnd() === offset) {
                    return collectAttributeValueSuggestions(scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.Whitespace:
                if (offset <= scanner.getTokenEnd()) {
                    switch (scanner.getScannerState()) {
                        case htmlScanner_1.ScannerState.AfterOpeningStartTag:
                            const startPos = scanner.getTokenOffset();
                            const endTagPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                            return collectTagSuggestions(startPos, endTagPos);
                        case htmlScanner_1.ScannerState.WithinTag:
                        case htmlScanner_1.ScannerState.AfterAttributeName:
                            return collectAttributeNameSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.BeforeAttributeValue:
                            return collectAttributeValueSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.AfterOpeningEndTag:
                            return collectCloseTagSuggestions(scanner.getTokenOffset() - 1, false);
                    }
                }
                break;
            case htmlScanner_1.TokenType.EndTagOpen:
                if (offset <= scanner.getTokenEnd()) {
                    const afterOpenBracket = scanner.getTokenOffset() + 1;
                    const endOffset = scanNextForEndPos(htmlScanner_1.TokenType.EndTag);
                    return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
                }
                break;
            case htmlScanner_1.TokenType.EndTag:
                if (offset <= scanner.getTokenEnd()) {
                    let start = scanner.getTokenOffset() - 1;
                    while (start >= 0) {
                        const ch = text.charAt(start);
                        if (ch === '/') {
                            return collectCloseTagSuggestions(start, false, scanner.getTokenEnd());
                        }
                        else if (!isWhiteSpace(ch)) {
                            break;
                        }
                        start--;
                    }
                }
                break;
            case htmlScanner_1.TokenType.Content:
                if (offset <= scanner.getTokenEnd()) {
                    return emmet.doComplete(document, position, 'html', emmetConfig);
                }
                break;
            default:
                if (offset <= scanner.getTokenEnd()) {
                    return result;
                }
                break;
        }
        token = scanner.scan();
    }
    return result;
}
exports.doComplete = doComplete;
function isWhiteSpace(s) {
    return /^\s*$/.test(s);
}
function isFollowedBy(s, offset, intialState, expectedToken) {
    const scanner = htmlScanner_1.createScanner(s, offset, intialState);
    let token = scanner.scan();
    while (token === htmlScanner_1.TokenType.Whitespace) {
        token = scanner.scan();
    }
    return token === expectedToken;
}
function getWordStart(s, offset, limit) {
    while (offset > limit && !isWhiteSpace(s[offset - 1])) {
        offset--;
    }
    return offset;
}
function getWordEnd(s, offset, limit) {
    while (offset < limit && !isWhiteSpace(s[offset])) {
        offset++;
    }
    return offset;
}
//# sourceMappingURL=htmlCompletion.js.map