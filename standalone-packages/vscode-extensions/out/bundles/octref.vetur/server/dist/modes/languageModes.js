"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languageModelCache_1 = require("./languageModelCache");
const embeddedSupport_1 = require("./embeddedSupport");
const vue_1 = require("./vue");
const style_1 = require("./style");
const javascript_1 = require("./script/javascript");
const template_1 = require("./template");
const stylus_1 = require("./style/stylus");
function getLanguageModes(workspacePath) {
    const documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, document => embeddedSupport_1.getDocumentRegions(document));
    let modelCaches = [];
    modelCaches.push(documentRegions);
    const jsMode = javascript_1.getJavascriptMode(documentRegions, workspacePath);
    let modes = {
        vue: vue_1.getVueMode(),
        'vue-html': template_1.getVueHTMLMode(documentRegions, workspacePath, jsMode),
        css: style_1.getCSSMode(documentRegions),
        postcss: style_1.getPostCSSMode(documentRegions),
        scss: style_1.getSCSSMode(documentRegions),
        less: style_1.getLESSMode(documentRegions),
        stylus: stylus_1.getStylusMode(documentRegions),
        javascript: jsMode,
        tsx: jsMode,
        typescript: jsMode
    };
    return {
        getModeAtPosition(document, position) {
            const languageId = documentRegions.get(document).getLanguageAtPosition(position);
            if (languageId) {
                return modes[languageId];
            }
            return null;
        },
        getModesInRange(document, range) {
            return documentRegions
                .get(document)
                .getLanguageRanges(range)
                .map(r => {
                return {
                    start: r.start,
                    end: r.end,
                    mode: modes[r.languageId],
                    attributeValue: r.attributeValue
                };
            });
        },
        getAllModesInDocument(document) {
            const result = [];
            for (const languageId of documentRegions.get(document).getLanguagesInDocument()) {
                const mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getAllModes() {
            const result = [];
            for (const languageId in modes) {
                const mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getMode(languageId) {
            return modes[languageId];
        },
        onDocumentRemoved(document) {
            modelCaches.forEach(mc => mc.onDocumentRemoved(document));
            for (const mode in modes) {
                modes[mode].onDocumentRemoved(document);
            }
        },
        dispose() {
            modelCaches.forEach(mc => mc.dispose());
            modelCaches = [];
            for (const mode in modes) {
                modes[mode].dispose();
            }
            modes = {}; // drop all references
        }
    };
}
exports.getLanguageModes = getLanguageModes;
//# sourceMappingURL=languageModes.js.map