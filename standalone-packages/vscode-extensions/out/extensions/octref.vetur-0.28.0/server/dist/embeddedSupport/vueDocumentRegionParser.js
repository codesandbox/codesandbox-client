"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVueDocumentRegions = void 0;
const htmlScanner_1 = require("../modes/template/parser/htmlScanner");
const strings_1 = require("../utils/strings");
const defaultScriptLang = 'javascript';
const defaultCSSLang = 'css';
function parseVueDocumentRegions(document) {
    const regions = [];
    const text = document.getText();
    const scanner = htmlScanner_1.createScanner(text);
    let lastTagName = '';
    let lastAttributeName = '';
    let languageIdFromType = '';
    const importedScripts = [];
    let token = scanner.scan();
    while (token !== htmlScanner_1.TokenType.EOS) {
        switch (token) {
            case htmlScanner_1.TokenType.Styles:
                regions.push({
                    languageId: /^(sass|scss|less|postcss|stylus)$/.test(languageIdFromType)
                        ? languageIdFromType
                        : defaultCSSLang,
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'style'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_1.TokenType.Script:
                regions.push({
                    languageId: languageIdFromType ? languageIdFromType : defaultScriptLang,
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'script'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_1.TokenType.StartTag:
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
            case htmlScanner_1.TokenType.AttributeName:
                lastAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (lastAttributeName === 'lang') {
                    languageIdFromType = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                else {
                    if (lastAttributeName === 'src' && lastTagName.toLowerCase() === 'script') {
                        let value = scanner.getTokenText();
                        if (value[0] === "'" || value[0] === '"') {
                            value = value.slice(1, value.length - 1);
                        }
                        importedScripts.push(value);
                    }
                }
                lastAttributeName = '';
                break;
            case htmlScanner_1.TokenType.EndTagClose:
                lastAttributeName = '';
                languageIdFromType = '';
                break;
        }
        token = scanner.scan();
    }
    return {
        regions,
        importedScripts
    };
}
exports.parseVueDocumentRegions = parseVueDocumentRegions;
function scanTemplateRegion(scanner, text) {
    let languageId = 'vue-html';
    let token = -1;
    let start = 0;
    let end;
    // Scan until finding matching template EndTag
    // Also record immediate next StartTagClose to find start
    let unClosedTemplate = 1;
    let lastAttributeName = null;
    while (unClosedTemplate !== 0) {
        // skip parsing on non html syntax, just search terminator
        if (token === htmlScanner_1.TokenType.AttributeValue && languageId !== 'vue-html') {
            while (token !== htmlScanner_1.TokenType.StartTagClose) {
                token = scanner.scan();
            }
            start = scanner.getTokenEnd();
            token = scanner.scanForRegexp(/<\/template>/);
            if (token === htmlScanner_1.TokenType.EOS) {
                return null;
            }
            // scan to `EndTag`, past `</` to `template`
            while (token !== htmlScanner_1.TokenType.EndTag) {
                token = scanner.scan();
            }
            break;
        }
        token = scanner.scan();
        if (token === htmlScanner_1.TokenType.EOS) {
            return null;
        }
        if (start === 0) {
            if (token === htmlScanner_1.TokenType.AttributeName) {
                lastAttributeName = scanner.getTokenText();
            }
            else if (token === htmlScanner_1.TokenType.AttributeValue) {
                if (lastAttributeName === 'lang') {
                    languageId = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                lastAttributeName = null;
            }
            else if (token === htmlScanner_1.TokenType.StartTagClose) {
                start = scanner.getTokenEnd();
            }
        }
        else {
            if (token === htmlScanner_1.TokenType.StartTag && scanner.getTokenText() === 'template') {
                unClosedTemplate++;
            }
            else if (token === htmlScanner_1.TokenType.EndTag && scanner.getTokenText() === 'template') {
                unClosedTemplate--;
                // test leading </template>
                const charPosBeforeEndTag = scanner.getTokenOffset() - 3;
                if (text[charPosBeforeEndTag] === '\n') {
                    break;
                }
            }
            else if (token === htmlScanner_1.TokenType.Unknown) {
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
//# sourceMappingURL=vueDocumentRegionParser.js.map