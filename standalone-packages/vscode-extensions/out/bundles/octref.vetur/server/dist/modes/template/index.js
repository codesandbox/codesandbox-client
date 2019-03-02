"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const languageModelCache_1 = require("../languageModelCache");
const htmlCompletion_1 = require("./services/htmlCompletion");
const htmlHover_1 = require("./services/htmlHover");
const htmlHighlighting_1 = require("./services/htmlHighlighting");
const htmlLinks_1 = require("./services/htmlLinks");
const htmlSymbolsProvider_1 = require("./services/htmlSymbolsProvider");
const htmlFormat_1 = require("./services/htmlFormat");
const htmlParser_1 = require("./parser/htmlParser");
const htmlValidation_1 = require("./services/htmlValidation");
const htmlDefinition_1 = require("./services/htmlDefinition");
const tagProviders_1 = require("./tagProviders");
const tagProviders_2 = require("./tagProviders");
function getVueHTMLMode(documentRegions, workspacePath, scriptMode) {
    let tagProviderSettings = tagProviders_1.getTagProviderSettings(workspacePath);
    let enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
    const embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.get(document).getEmbeddedDocument('vue-html'));
    const vueDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => htmlParser_1.parseHTMLDocument(document));
    const lintEngine = htmlValidation_1.createLintEngine();
    let config = {};
    return {
        getId() {
            return 'vue-html';
        },
        configure(c) {
            tagProviderSettings = _.assign(tagProviderSettings, c.html.suggest);
            enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
            config = c;
        },
        doValidation(document) {
            const embedded = embeddedDocuments.get(document);
            return htmlValidation_1.doValidation(embedded, lintEngine);
        },
        doComplete(document, position) {
            const embedded = embeddedDocuments.get(document);
            const components = scriptMode.findComponents(document);
            const tagProviders = enabledTagProviders.concat(tagProviders_2.getComponentTags(components));
            return htmlCompletion_1.doComplete(embedded, position, vueDocuments.get(embedded), tagProviders, config.emmet);
        },
        doHover(document, position) {
            const embedded = embeddedDocuments.get(document);
            const components = scriptMode.findComponents(document);
            const tagProviders = enabledTagProviders.concat(tagProviders_2.getComponentTags(components));
            return htmlHover_1.doHover(embedded, position, vueDocuments.get(embedded), tagProviders);
        },
        findDocumentHighlight(document, position) {
            return htmlHighlighting_1.findDocumentHighlights(document, position, vueDocuments.get(document));
        },
        findDocumentLinks(document, documentContext) {
            return htmlLinks_1.findDocumentLinks(document, documentContext);
        },
        findDocumentSymbols(document) {
            return htmlSymbolsProvider_1.findDocumentSymbols(document, vueDocuments.get(document));
        },
        format(document, range, formattingOptions) {
            return htmlFormat_1.htmlFormat(document, range, config.vetur.format);
        },
        findDefinition(document, position) {
            const embedded = embeddedDocuments.get(document);
            const components = scriptMode.findComponents(document);
            return htmlDefinition_1.findDefinition(embedded, position, vueDocuments.get(embedded), components);
        },
        onDocumentRemoved(document) {
            vueDocuments.onDocumentRemoved(document);
        },
        dispose() {
            vueDocuments.dispose();
        }
    };
}
exports.getVueHTMLMode = getVueHTMLMode;
//# sourceMappingURL=index.js.map