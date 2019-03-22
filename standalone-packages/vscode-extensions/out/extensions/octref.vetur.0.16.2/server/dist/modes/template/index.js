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
const componentInfoTagProvider_1 = require("./tagProviders/componentInfoTagProvider");
function getVueHTMLMode(documentRegions, workspacePath) {
    let tagProviderSettings = tagProviders_1.getTagProviderSettings(workspacePath);
    let enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
    const embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => documentRegions.get(document).getEmbeddedDocument('vue-html'));
    const vueDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => htmlParser_1.parseHTMLDocument(document));
    const lintEngine = htmlValidation_1.createLintEngine();
    let config = {};
    let vueInfoService;
    return {
        getId() {
            return 'vue-html';
        },
        configure(c) {
            tagProviderSettings = _.assign(tagProviderSettings, c.html.suggest);
            enabledTagProviders = tagProviders_2.getEnabledTagProviders(tagProviderSettings);
            config = c;
        },
        configureService(infoService) {
            vueInfoService = infoService;
        },
        doValidation(document) {
            const embedded = embeddedDocuments.get(document);
            return htmlValidation_1.doValidation(embedded, lintEngine);
        },
        doComplete(document, position) {
            const embedded = embeddedDocuments.get(document);
            const tagProviders = [...enabledTagProviders];
            const info = vueInfoService.getInfo(document);
            if (info && info.componentInfo.childComponents) {
                tagProviders.push(componentInfoTagProvider_1.getComponentInfoTagProvider(info.componentInfo.childComponents));
            }
            return htmlCompletion_1.doComplete(embedded, position, vueDocuments.get(embedded), tagProviders, config.emmet, info);
        },
        doHover(document, position) {
            const embedded = embeddedDocuments.get(document);
            const tagProviders = [...enabledTagProviders];
            const info = vueInfoService.getInfo(document);
            if (info && info.componentInfo.childComponents) {
                tagProviders.push(componentInfoTagProvider_1.getComponentInfoTagProvider(info.componentInfo.childComponents));
            }
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
            const info = vueInfoService.getInfo(document);
            return htmlDefinition_1.findDefinition(embedded, position, vueDocuments.get(embedded), info);
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