"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordPattern = exports.getStylusMode = void 0;
const _ = require("lodash");
const emmet = require("vscode-emmet-helper");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const emmet_1 = require("../emmet");
const languageModelCache_1 = require("../../../embeddedSupport/languageModelCache");
const completion_item_1 = require("./completion-item");
const symbols_finder_1 = require("./symbols-finder");
const stylus_hover_1 = require("./stylus-hover");
const requirePkg_1 = require("../../../utils/prettier/requirePkg");
const paths_1 = require("../../../utils/paths");
function getStylusMode(documentRegions) {
    const embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.refreshAndGet(document).getSingleLanguageDocument('stylus'));
    let baseIndentShifted = false;
    let config = {};
    return {
        getId: () => 'stylus',
        configure(c) {
            baseIndentShifted = _.get(c, 'vetur.format.styleInitialIndent', false);
            config = c;
        },
        onDocumentRemoved() { },
        dispose() { },
        doComplete(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            const lsCompletions = completion_item_1.provideCompletionItems(embedded, position);
            const lsItems = _.map(lsCompletions.items, i => {
                return Object.assign(Object.assign({}, i), { sortText: emmet_1.Priority.Platform + i.label });
            });
            const emmetCompletions = emmet.doComplete(document, position, 'stylus', config.emmet);
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
        findDocumentSymbols(document) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return symbols_finder_1.provideDocumentSymbols(embedded);
        },
        doHover(document, position) {
            const embedded = embeddedDocuments.refreshAndGet(document);
            return stylus_hover_1.stylusHover(embedded, position);
        },
        format(document, range, formatParams) {
            if (config.vetur.format.defaultFormatter.stylus === 'none') {
                return [];
            }
            const stylusSupremacy = requirePkg_1.requireLocalPkg(paths_1.getFileFsPath(document.uri), 'stylus-supremacy');
            const inputText = document.getText(range);
            const vlsFormatConfig = config.vetur.format;
            const tabStopChar = vlsFormatConfig.options.useTabs ? '\t' : ' '.repeat(vlsFormatConfig.options.tabSize);
            // Note that this would have been `document.eol` ideally
            const newLineChar = inputText.includes('\r\n') ? '\r\n' : '\n';
            // Determine the base indentation for the multi-line Stylus content
            let baseIndent = '';
            if (range.start.line !== range.end.line) {
                const styleTagLine = document.getText().split(/\r?\n/)[range.start.line];
                if (styleTagLine) {
                    baseIndent = _.get(styleTagLine.match(/^(\t|\s)+/), '0', '');
                }
            }
            // Add one more indentation when `vetur.format.styleInitialIndent` is set to `true`
            if (baseIndentShifted) {
                baseIndent += tabStopChar;
            }
            // Build the formatting options for Stylus Supremacy
            // See https://thisismanta.github.io/stylus-supremacy/#options
            const stylusSupremacyFormattingOptions = stylusSupremacy.createFormattingOptions(config.stylusSupremacy || {});
            const formattingOptions = Object.assign(Object.assign({}, stylusSupremacyFormattingOptions), { tabStopChar, newLineChar: '\n' });
            const formattedText = stylusSupremacy.format(inputText, formattingOptions);
            // Add the base indentation and correct the new line characters
            const outputText = formattedText
                .split(/\n/)
                .map(line => (line.length > 0 ? baseIndent + line : ''))
                .join(newLineChar);
            return [vscode_languageserver_types_1.TextEdit.replace(range, outputText)];
        }
    };
}
exports.getStylusMode = getStylusMode;
exports.wordPattern = /(#?-?\d*\.\d\w*%?)|([$@#!.:]?[\w-?]+%?)|[$@#!.]/g;
//# sourceMappingURL=index.js.map