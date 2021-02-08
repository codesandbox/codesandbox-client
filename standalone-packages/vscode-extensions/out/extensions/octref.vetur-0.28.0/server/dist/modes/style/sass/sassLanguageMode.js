"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SassLanguageMode = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const sass_formatter_1 = require("sass-formatter");
const emmet = require("vscode-emmet-helper");
const emmet_1 = require("../emmet");
class SassLanguageMode {
    constructor() {
        this.config = {};
    }
    getId() {
        return 'sass';
    }
    configure(c) {
        this.config = c;
    }
    doComplete(document, position) {
        const emmetCompletions = emmet.doComplete(document, position, 'sass', this.config.emmet);
        if (!emmetCompletions) {
            return { isIncomplete: false, items: [] };
        }
        else {
            const emmetItems = emmetCompletions.items.map(i => {
                return Object.assign(Object.assign({}, i), { sortText: emmet_1.Priority.Emmet + i.label });
            });
            return {
                isIncomplete: emmetCompletions.isIncomplete,
                items: emmetItems
            };
        }
    }
    format(document, range, formattingOptions) {
        const sassConfig = {
            convert: true,
            deleteEmptyRows: true,
            deleteWhitespace: true,
            debug: false,
            insertSpaces: formattingOptions.insertSpaces,
            tabSize: formattingOptions.tabSize,
            setPropertySpace: true
        };
        Object.assign(sassConfig, this.config.sass.format);
        if (this.config.vetur.format.defaultFormatter.sass === 'sass-formatter') {
            return [vscode_css_languageservice_1.TextEdit.replace(range, sass_formatter_1.SassFormatter.Format(document.getText(range), sassConfig))];
        }
        return [];
    }
    onDocumentRemoved(document) { }
    dispose() { }
}
exports.SassLanguageMode = SassLanguageMode;
//# sourceMappingURL=sassLanguageMode.js.map