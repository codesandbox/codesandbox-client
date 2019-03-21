"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = require("../utils/strings");
const htmlScanner_1 = require("./template/parser/htmlScanner");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const htmlScanner_2 = require("./template/parser/htmlScanner");
const defaultType = {
    template: 'vue-html',
    script: 'javascript',
    style: 'css'
};
function getDocumentRegions(document) {
    const regions = [];
    const text = document.getText();
    const scanner = htmlScanner_1.createScanner(text);
    let lastTagName = '';
    let lastAttributeName = '';
    let languageIdFromType = '';
    const importedScripts = [];
    let token = scanner.scan();
    while (token !== htmlScanner_2.TokenType.EOS) {
        switch (token) {
            case htmlScanner_2.TokenType.Styles:
                regions.push({
                    languageId: /^(sass|scss|less|postcss|stylus)$/.test(languageIdFromType)
                        ? languageIdFromType
                        : defaultType['style'],
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'style'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_2.TokenType.Script:
                regions.push({
                    languageId: languageIdFromType ? languageIdFromType : defaultType['script'],
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'script'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_2.TokenType.StartTag:
                const tagName = scanner.getTokenText();
                if (tagName === 'template') {
                    const templateRegion = scanTemplateRegion(scanner, text);
                    if (templateRegion) {
                        regions.push(templateRegion);
                    }
                }
                lastTagName = tagName;
                lastAttributeName = '';
                break;
            case htmlScanner_2.TokenType.AttributeName:
                lastAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_2.TokenType.AttributeValue:
                if (lastAttributeName === 'lang') {
                    languageIdFromType = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                else {
                    if (lastAttributeName === 'src' && lastTagName.toLowerCase() === 'script') {
                        let value = scanner.getTokenText();
                        if (value[0] === "'" || value[0] === '"') {
                            value = value.substr(1, value.length - 1);
                        }
                        importedScripts.push(value);
                    }
                }
                lastAttributeName = '';
                break;
            case htmlScanner_2.TokenType.EndTagClose:
                lastAttributeName = '';
                languageIdFromType = '';
                break;
        }
        token = scanner.scan();
    }
    return {
        getLanguageRanges: (range) => getLanguageRanges(document, regions, range),
        getLanguageRangeByType: (type) => getLanguageRangeByType(document, regions, type),
        getEmbeddedDocument: (languageId) => getEmbeddedDocument(document, regions, languageId),
        getEmbeddedDocumentByType: (type) => getEmbeddedDocumentByType(document, regions, type),
        getLanguageAtPosition: (position) => getLanguageAtPosition(document, regions, position),
        getLanguagesInDocument: () => getLanguagesInDocument(document, regions),
        getImportedScripts: () => importedScripts
    };
}
exports.getDocumentRegions = getDocumentRegions;
function scanTemplateRegion(scanner, text) {
    let languageId = 'vue-html';
    let token;
    let start = 0;
    let end;
    // Scan until finding matching template EndTag
    // Also record immediate next StartTagClose to find start
    let unClosedTemplate = 1;
    let lastAttributeName = null;
    while (unClosedTemplate !== 0) {
        // skip parsing on non html syntax, just search terminator
        if (languageId !== 'vue-html' && start !== 0) {
            token = scanner.scanForRegexp(/<\/template>/);
            if (token === htmlScanner_2.TokenType.EOS) {
                return null;
            }
            // forward to endTagStart </
            scanner.scan();
            break;
        }
        token = scanner.scan();
        if (token === htmlScanner_2.TokenType.EOS) {
            return null;
        }
        if (start === 0) {
            if (token === htmlScanner_2.TokenType.AttributeName) {
                lastAttributeName = scanner.getTokenText();
            }
            else if (token === htmlScanner_2.TokenType.AttributeValue) {
                if (lastAttributeName === 'lang') {
                    languageId = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                lastAttributeName = null;
            }
            else if (token === htmlScanner_2.TokenType.StartTagClose) {
                start = scanner.getTokenEnd();
            }
        }
        else {
            if (token === htmlScanner_2.TokenType.StartTag && scanner.getTokenText() === 'template') {
                unClosedTemplate++;
            }
            else if (token === htmlScanner_2.TokenType.EndTag && scanner.getTokenText() === 'template') {
                unClosedTemplate--;
                // test leading </template>
                const charPosBeforeEndTag = scanner.getTokenOffset() - 3;
                if (text[charPosBeforeEndTag] === '\n') {
                    break;
                }
            }
            else if (token === htmlScanner_2.TokenType.Unknown) {
                if (scanner.getTokenText().charAt(0) === '<') {
                    const offset = scanner.getTokenOffset();
                    const unknownText = text.substr(offset, 11);
                    if (unknownText === '</template>') {
                        unClosedTemplate--;
                        // test leading </template>
                        if (text[offset - 1] === '\n') {
                            return {
                                languageId,
                                start,
                                end: offset,
                                type: 'template'
                            };
                        }
                    }
                }
            }
        }
    }
    // In EndTag, find end
    // -2 for </
    end = scanner.getTokenOffset() - 2;
    return {
        languageId,
        start,
        end,
        type: 'template'
    };
}
function getLanguageIdFromLangAttr(lang) {
    let languageIdFromType = strings_1.removeQuotes(lang);
    if (languageIdFromType === 'jade') {
        languageIdFromType = 'pug';
    }
    if (languageIdFromType === 'ts') {
        languageIdFromType = 'typescript';
    }
    return languageIdFromType;
}
function getLanguageRanges(document, regions, range) {
    const result = [];
    let currentPos = range ? range.start : vscode_languageserver_types_1.Position.create(0, 0);
    let currentOffset = range ? document.offsetAt(range.start) : 0;
    const endOffset = range ? document.offsetAt(range.end) : document.getText().length;
    for (const region of regions) {
        if (region.end > currentOffset && region.start < endOffset) {
            const start = Math.max(region.start, currentOffset);
            const startPos = document.positionAt(start);
            if (currentOffset < region.start) {
                result.push({
                    start: currentPos,
                    end: startPos,
                    languageId: 'vue'
                });
            }
            const end = Math.min(region.end, endOffset);
            const endPos = document.positionAt(end);
            if (end > region.start) {
                result.push({
                    start: startPos,
                    end: endPos,
                    languageId: region.languageId
                });
            }
            currentOffset = end;
            currentPos = endPos;
        }
    }
    if (currentOffset < endOffset) {
        const endPos = range ? range.end : document.positionAt(endOffset);
        result.push({
            start: currentPos,
            end: endPos,
            languageId: 'vue'
        });
    }
    return result;
}
function getLanguagesInDocument(document, regions) {
    const result = ['vue'];
    for (const region of regions) {
        if (region.languageId && result.indexOf(region.languageId) === -1) {
            result.push(region.languageId);
        }
    }
    return result;
}
function getLanguageAtPosition(document, regions, position) {
    const offset = document.offsetAt(position);
    for (const region of regions) {
        if (region.start <= offset) {
            if (offset <= region.end) {
                return region.languageId;
            }
        }
        else {
            break;
        }
    }
    return 'vue';
}
function getEmbeddedDocument(document, contents, languageId) {
    const oldContent = document.getText();
    let result = '';
    for (const c of contents) {
        if (c.languageId === languageId) {
            result = oldContent.substring(0, c.start).replace(/./g, ' ');
            result += oldContent.substring(c.start, c.end);
            break;
        }
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, languageId, document.version, result);
}
function getEmbeddedDocumentByType(document, contents, type) {
    const oldContent = document.getText();
    let result = '';
    for (const c of contents) {
        if (c.type === type) {
            result = oldContent.substring(0, c.start).replace(/./g, ' ');
            result += oldContent.substring(c.start, c.end);
            return vscode_languageserver_types_1.TextDocument.create(document.uri, c.languageId, document.version, result);
        }
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, defaultType[type], document.version, result);
}
function getLanguageRangeByType(document, contents, type) {
    for (const c of contents) {
        if (c.type === type) {
            return {
                start: document.positionAt(c.start),
                end: document.positionAt(c.end),
                languageId: c.languageId
            };
        }
    }
}
//# sourceMappingURL=embeddedSupport.js.map