"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueHTMLMode = void 0;
const languageModelCache_1 = require("../../embeddedSupport/languageModelCache");
const htmlMode_1 = require("./htmlMode");
const interpolationMode_1 = require("./interpolationMode");
const htmlParser_1 = require("./parser/htmlParser");
const vueVersion_1 = require("../../services/typescriptService/vueVersion");
class VueHTMLMode {
    constructor(tsModule, serviceHost, documentRegions, workspacePath, vueInfoService) {
        const vueDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => htmlParser_1.parseHTMLDocument(document));
        const vueVersion = vueVersion_1.inferVueVersion(tsModule, workspacePath);
        this.htmlMode = new htmlMode_1.HTMLMode(documentRegions, workspacePath, vueVersion, vueDocuments, vueInfoService);
        this.vueInterpolationMode = new interpolationMode_1.VueInterpolationMode(tsModule, serviceHost, vueDocuments, vueInfoService);
    }
    getId() {
        return 'vue-html';
    }
    configure(c) {
        this.htmlMode.configure(c);
        this.vueInterpolationMode.configure(c);
    }
    queryVirtualFileInfo(fileName, currFileText) {
        return this.vueInterpolationMode.queryVirtualFileInfo(fileName, currFileText);
    }
    doValidation(document) {
        return this.htmlMode.doValidation(document).concat(this.vueInterpolationMode.doValidation(document));
    }
    doComplete(document, position) {
        const htmlList = this.htmlMode.doComplete(document, position);
        const intList = this.vueInterpolationMode.doComplete(document, position);
        return {
            isIncomplete: htmlList.isIncomplete || intList.isIncomplete,
            items: htmlList.items.concat(intList.items)
        };
    }
    doResolve(document, item) {
        return this.vueInterpolationMode.doResolve(document, item);
    }
    doHover(document, position) {
        const interpolationHover = this.vueInterpolationMode.doHover(document, position);
        return interpolationHover.contents.length !== 0 ? interpolationHover : this.htmlMode.doHover(document, position);
    }
    findDocumentHighlight(document, position) {
        return this.htmlMode.findDocumentHighlight(document, position);
    }
    findDocumentLinks(document, documentContext) {
        return this.htmlMode.findDocumentLinks(document, documentContext);
    }
    findDocumentSymbols(document) {
        return this.htmlMode.findDocumentSymbols(document);
    }
    format(document, range, formattingOptions) {
        return this.htmlMode.format(document, range, formattingOptions);
    }
    findReferences(document, position) {
        return this.vueInterpolationMode.findReferences(document, position);
    }
    findDefinition(document, position) {
        const htmlDefinition = this.htmlMode.findDefinition(document, position);
        return htmlDefinition.length > 0 ? htmlDefinition : this.vueInterpolationMode.findDefinition(document, position);
    }
    getFoldingRanges(document) {
        return this.htmlMode.getFoldingRanges(document);
    }
    onDocumentRemoved(document) {
        this.htmlMode.onDocumentRemoved(document);
    }
    dispose() {
        this.htmlMode.dispose();
    }
}
exports.VueHTMLMode = VueHTMLMode;
//# sourceMappingURL=index.js.map