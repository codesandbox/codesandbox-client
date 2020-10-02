"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDocumentLinks = void 0;
const htmlScanner_1 = require("../parser/htmlScanner");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_uri_1 = require("vscode-uri");
function stripQuotes(url) {
    return url.replace(/^'([^']*)'$/, (substr, match1) => match1).replace(/^"([^"]*)"$/, (substr, match1) => match1);
}
function getWorkspaceUrl(modelAbsoluteUri, tokenContent, documentContext, base) {
    if (/^\s*javascript\:/i.test(tokenContent) || /^\s*\#/i.test(tokenContent) || /[\n\r]/.test(tokenContent)) {
        return null;
    }
    tokenContent = tokenContent.replace(/^\s*/g, '');
    if (/^https?:\/\//i.test(tokenContent) || /^file:\/\//i.test(tokenContent)) {
        // Absolute link that needs no treatment
        return tokenContent;
    }
    if (/^\/\//i.test(tokenContent)) {
        // Absolute link (that does not name the protocol)
        let pickedScheme = 'http';
        if (modelAbsoluteUri.scheme === 'https') {
            pickedScheme = 'https';
        }
        return pickedScheme + ':' + tokenContent.replace(/^\s*/g, '');
    }
    if (documentContext) {
        return documentContext.resolveReference(tokenContent, base);
    }
    return tokenContent;
}
function createLink(document, documentContext, attributeValue, startOffset, endOffset, base) {
    const documentUri = vscode_uri_1.URI.parse(document.uri);
    const tokenContent = stripQuotes(attributeValue);
    if (tokenContent.length === 0) {
        return null;
    }
    if (tokenContent.length < attributeValue.length) {
        startOffset++;
        endOffset--;
    }
    const workspaceUrl = getWorkspaceUrl(documentUri, tokenContent, documentContext, base);
    if (!workspaceUrl || !isValidURI(workspaceUrl)) {
        return null;
    }
    return {
        range: vscode_languageserver_types_1.Range.create(document.positionAt(startOffset), document.positionAt(endOffset)),
        target: workspaceUrl
    };
}
function isValidURI(uri) {
    try {
        vscode_uri_1.URI.parse(uri);
        return true;
    }
    catch (e) {
        return false;
    }
}
function findDocumentLinks(document, documentContext) {
    const newLinks = [];
    const scanner = htmlScanner_1.createScanner(document.getText(), 0);
    let token = scanner.scan();
    let afterHrefOrSrc = false;
    let afterBase = false;
    let base = undefined;
    while (token !== htmlScanner_1.TokenType.EOS) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTag:
                if (!base) {
                    const tagName = scanner.getTokenText().toLowerCase();
                    afterBase = tagName === 'base';
                }
                break;
            case htmlScanner_1.TokenType.AttributeName:
                const attributeName = scanner.getTokenText().toLowerCase();
                afterHrefOrSrc = attributeName === 'src' || attributeName === 'href';
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (afterHrefOrSrc) {
                    const attributeValue = scanner.getTokenText();
                    const link = createLink(document, documentContext, attributeValue, scanner.getTokenOffset(), scanner.getTokenEnd(), base);
                    if (link) {
                        newLinks.push(link);
                    }
                    if (afterBase && typeof base === 'undefined') {
                        base = stripQuotes(attributeValue);
                    }
                    afterBase = false;
                    afterHrefOrSrc = false;
                }
                break;
        }
        token = scanner.scan();
    }
    return newLinks;
}
exports.findDocumentLinks = findDocumentLinks;
//# sourceMappingURL=htmlLinks.js.map