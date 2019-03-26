"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const _ = require("lodash");
const emmet = require("vscode-emmet-helper");
const emmet_1 = require("./emmet");
const languageModelCache_1 = require("../languageModelCache");
const paths_1 = require("../../utils/paths");
const prettier_1 = require("../../utils/prettier");
const nullMode_1 = require("../nullMode");
function getCSSMode(documentRegions) {
    const languageService = vscode_css_languageservice_1.getCSSLanguageService();
    return getStyleMode('css', languageService, documentRegions);
}
exports.getCSSMode = getCSSMode;
function getPostCSSMode(documentRegions) {
    const languageService = vscode_css_languageservice_1.getCSSLanguageService();
    return getStyleMode('postcss', languageService, documentRegions);
}
exports.getPostCSSMode = getPostCSSMode;
function getSCSSMode(documentRegions) {
    const languageService = vscode_css_languageservice_1.getSCSSLanguageService();
    return getStyleMode('scss', languageService, documentRegions);
}
exports.getSCSSMode = getSCSSMode;
function getLESSMode(documentRegions) {
    const languageService = vscode_css_languageservice_1.getLESSLanguageService();
    return getStyleMode('less', languageService, documentRegions);
}
exports.getLESSMode = getLESSMode;
function getStyleMode(languageId, languageService, documentRegions) {
    const embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.get(document).getEmbeddedDocument(languageId));
    const stylesheets = languageModelCache_1.getLanguageModelCache(10, 60, document => languageService.parseStylesheet(document));
    let config = {};
    return {
        getId() {
            return languageId;
        },
        configure(c) {
            languageService.configure(c && c.css);
            config = c;
        },
        doValidation(document) {
            if (languageId === 'postcss') {
                return [];
            }
            else {
                const embedded = embeddedDocuments.get(document);
                return languageService.doValidation(embedded, stylesheets.get(embedded));
            }
        },
        doComplete(document, position) {
            const embedded = embeddedDocuments.get(document);
            const emmetSyntax = languageId === 'postcss' ? 'css' : languageId;
            const lsCompletions = languageService.doComplete(embedded, position, stylesheets.get(embedded));
            const lsItems = lsCompletions
                ? _.map(lsCompletions.items, i => {
                    return Object.assign({}, i, { sortText: emmet_1.Priority.Platform + i.label });
                })
                : [];
            const emmetCompletions = emmet.doComplete(document, position, emmetSyntax, config.emmet);
            if (!emmetCompletions) {
                return { isIncomplete: false, items: lsItems };
            }
            else {
                const emmetItems = _.map(emmetCompletions.items, i => {
                    return Object.assign({}, i, { sortText: emmet_1.Priority.Emmet + i.label });
                });
                return {
                    isIncomplete: emmetCompletions.isIncomplete,
                    items: _.concat(emmetItems, lsItems)
                };
            }
        },
        doHover(document, position) {
            const embedded = embeddedDocuments.get(document);
            return languageService.doHover(embedded, position, stylesheets.get(embedded)) || nullMode_1.NULL_HOVER;
        },
        findDocumentHighlight(document, position) {
            const embedded = embeddedDocuments.get(document);
            return languageService.findDocumentHighlights(embedded, position, stylesheets.get(embedded));
        },
        findDocumentSymbols(document) {
            const embedded = embeddedDocuments.get(document);
            return languageService.findDocumentSymbols(embedded, stylesheets.get(embedded));
        },
        findDefinition(document, position) {
            const embedded = embeddedDocuments.get(document);
            const definition = languageService.findDefinition(embedded, position, stylesheets.get(embedded));
            if (!definition) {
                return [];
            }
            return definition;
        },
        findReferences(document, position) {
            const embedded = embeddedDocuments.get(document);
            return languageService.findReferences(embedded, position, stylesheets.get(embedded));
        },
        findDocumentColors(document) {
            const embedded = embeddedDocuments.get(document);
            return languageService.findDocumentColors(embedded, stylesheets.get(embedded));
        },
        getColorPresentations(document, color, range) {
            const embedded = embeddedDocuments.get(document);
            return languageService.getColorPresentations(embedded, stylesheets.get(embedded), color, range);
        },
        format(document, currRange, formattingOptions) {
            if (config.vetur.format.defaultFormatter[languageId] === 'none') {
                return [];
            }
            const { value, range } = getValueAndRange(document, currRange);
            const needIndent = config.vetur.format.styleInitialIndent;
            const parserMap = {
                css: 'css',
                postcss: 'css',
                scss: 'scss',
                less: 'less'
            };
            return prettier_1.prettierify(value, paths_1.getFileFsPath(document.uri), range, config.vetur.format, parserMap[languageId], needIndent);
        },
        onDocumentRemoved(document) {
            embeddedDocuments.onDocumentRemoved(document);
            stylesheets.onDocumentRemoved(document);
        },
        dispose() {
            embeddedDocuments.dispose();
            stylesheets.dispose();
        }
    };
}
function getValueAndRange(document, currRange) {
    let value = document.getText();
    let range = currRange;
    if (currRange) {
        const startOffset = document.offsetAt(currRange.start);
        const endOffset = document.offsetAt(currRange.end);
        value = value.substring(startOffset, endOffset);
    }
    else {
        range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
    }
    return { value, range };
}
//# sourceMappingURL=index.js.map