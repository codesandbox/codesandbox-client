"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLESSMode = exports.getSCSSMode = exports.getPostCSSMode = exports.getCSSMode = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const _ = require("lodash");
const emmet = require("vscode-emmet-helper");
const emmet_1 = require("./emmet");
const languageModelCache_1 = require("../../embeddedSupport/languageModelCache");
const paths_1 = require("../../utils/paths");
const prettier_1 = require("../../utils/prettier");
const nullMode_1 = require("../nullMode");
function getCSSMode(workspacePath, documentRegions) {
    const languageService = vscode_css_languageservice_1.getCSSLanguageService();
    return getStyleMode('css', workspacePath, languageService, documentRegions);
}
exports.getCSSMode = getCSSMode;
function getPostCSSMode(workspacePath, documentRegions) {
    const languageService = vscode_css_languageservice_1.getCSSLanguageService();
    return getStyleMode('postcss', workspacePath, languageService, documentRegions);
}
exports.getPostCSSMode = getPostCSSMode;
function getSCSSMode(workspacePath, documentRegions) {
    const languageService = vscode_css_languageservice_1.getSCSSLanguageService();
    return getStyleMode('scss', workspacePath, languageService, documentRegions);
}
exports.getSCSSMode = getSCSSMode;
function getLESSMode(workspacePath, documentRegions) {
    const languageService = vscode_css_languageservice_1.getLESSLanguageService();
    return getStyleMode('less', workspacePath, languageService, documentRegions);
}
exports.getLESSMode = getLESSMode;
function getStyleMode(languageId, workspacePath, languageService, documentRegions) {
    const embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.refreshAndGet(document).getSingleLanguageDocument(languageId));
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
                const embedded = embeddedDocuments.refreshAndGet(document);
                return languageService.doValidation(embedded, stylesheets.refreshAndGet(embedded));
            }
        },
        doComplete(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            const emmetSyntax = languageId === 'postcss' ? 'css' : languageId;
            const lsCompletions = languageService.doComplete(embedded, position, stylesheets.refreshAndGet(embedded));
            const lsItems = lsCompletions
                ? _.map(lsCompletions.items, i => {
                    return Object.assign(Object.assign({}, i), { sortText: emmet_1.Priority.Platform + i.label });
                })
                : [];
            const emmetCompletions = emmet.doComplete(document, position, emmetSyntax, config.emmet);
            if (!emmetCompletions) {
                return { isIncomplete: false, items: lsItems };
            }
            else {
                const emmetItems = emmetCompletions.items.map(i => {
                    return Object.assign(Object.assign({}, i), { sortText: emmet_1.Priority.Emmet + i.label });
                });
                return {
                    isIncomplete: emmetCompletions.isIncomplete,
                    items: _.concat(emmetItems, lsItems)
                };
            }
        },
        doHover(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.doHover(embedded, position, stylesheets.refreshAndGet(embedded)) || nullMode_1.NULL_HOVER;
        },
        findDocumentHighlight(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.findDocumentHighlights(embedded, position, stylesheets.refreshAndGet(embedded));
        },
        findDocumentSymbols(document) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.findDocumentSymbols(embedded, stylesheets.refreshAndGet(embedded));
        },
        findDefinition(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            const definition = languageService.findDefinition(embedded, position, stylesheets.refreshAndGet(embedded));
            if (!definition) {
                return [];
            }
            return definition;
        },
        findReferences(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.findReferences(embedded, position, stylesheets.refreshAndGet(embedded));
        },
        findDocumentColors(document) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.findDocumentColors(embedded, stylesheets.refreshAndGet(embedded));
        },
        getFoldingRanges(document) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.getFoldingRanges(embedded);
        },
        getColorPresentations(document, color, range) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return languageService.getColorPresentations(embedded, stylesheets.refreshAndGet(embedded), color, range);
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
            return prettier_1.prettierify(value, paths_1.getFileFsPath(document.uri), workspacePath, range, config.vetur.format, parserMap[languageId], needIndent);
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