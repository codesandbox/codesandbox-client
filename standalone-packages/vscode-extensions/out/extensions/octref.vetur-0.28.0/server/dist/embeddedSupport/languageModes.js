"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageModes = void 0;
const languageModelCache_1 = require("./languageModelCache");
const embeddedSupport_1 = require("./embeddedSupport");
const vue_1 = require("../modes/vue");
const style_1 = require("../modes/style");
const javascript_1 = require("../modes/script/javascript");
const template_1 = require("../modes/template");
const stylus_1 = require("../modes/style/stylus");
const nullMode_1 = require("../modes/nullMode");
const serviceHost_1 = require("../services/typescriptService/serviceHost");
const sassLanguageMode_1 = require("../modes/style/sass/sassLanguageMode");
const pug_1 = require("../modes/pug");
class LanguageModes {
    constructor() {
        this.modes = {
            vue: nullMode_1.nullMode,
            pug: nullMode_1.nullMode,
            'vue-html': nullMode_1.nullMode,
            css: nullMode_1.nullMode,
            postcss: nullMode_1.nullMode,
            scss: nullMode_1.nullMode,
            less: nullMode_1.nullMode,
            sass: nullMode_1.nullMode,
            stylus: nullMode_1.nullMode,
            javascript: nullMode_1.nullMode,
            typescript: nullMode_1.nullMode,
            tsx: nullMode_1.nullMode
        };
        this.documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, document => embeddedSupport_1.getVueDocumentRegions(document));
        this.modelCaches = [];
        this.modelCaches.push(this.documentRegions);
    }
    init(workspacePath, services, globalSnippetDir) {
        return __awaiter(this, void 0, void 0, function* () {
            let tsModule = yield Promise.resolve().then(() => require('typescript'));
            if (services.dependencyService) {
                const ts = services.dependencyService.getDependency('typescript');
                if (ts && ts.state === 0 /* Loaded */) {
                    tsModule = ts.module;
                }
            }
            /**
             * Documents where everything outside `<script>` is replaced with whitespace
             */
            const scriptRegionDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => {
                const vueDocument = this.documentRegions.refreshAndGet(document);
                return vueDocument.getSingleTypeDocument('script');
            });
            this.serviceHost = serviceHost_1.getServiceHost(tsModule, workspacePath, scriptRegionDocuments);
            const vueHtmlMode = new template_1.VueHTMLMode(tsModule, this.serviceHost, this.documentRegions, workspacePath, services.infoService);
            const jsMode = yield javascript_1.getJavascriptMode(this.serviceHost, this.documentRegions, workspacePath, services.infoService, services.dependencyService);
            this.modes['vue'] = vue_1.getVueMode(workspacePath, globalSnippetDir);
            this.modes['vue-html'] = vueHtmlMode;
            this.modes['pug'] = pug_1.getPugMode(workspacePath);
            this.modes['css'] = style_1.getCSSMode(workspacePath, this.documentRegions);
            this.modes['postcss'] = style_1.getPostCSSMode(workspacePath, this.documentRegions);
            this.modes['scss'] = style_1.getSCSSMode(workspacePath, this.documentRegions);
            this.modes['sass'] = new sassLanguageMode_1.SassLanguageMode();
            this.modes['less'] = style_1.getLESSMode(workspacePath, this.documentRegions);
            this.modes['stylus'] = stylus_1.getStylusMode(this.documentRegions);
            this.modes['javascript'] = jsMode;
            this.modes['typescript'] = jsMode;
            this.modes['tsx'] = jsMode;
        });
    }
    getModeAtPosition(document, position) {
        const languageId = this.documentRegions.refreshAndGet(document).getLanguageAtPosition(position);
        return this.modes[languageId];
    }
    getAllLanguageModeRangesInDocument(document) {
        const result = [];
        const documentRegions = this.documentRegions.refreshAndGet(document);
        documentRegions.getAllLanguageRanges().forEach(lr => {
            const mode = this.modes[lr.languageId];
            if (mode) {
                result.push(Object.assign({ mode }, lr));
            }
        });
        return result;
    }
    getAllModes() {
        const result = [];
        for (const languageId in this.modes) {
            const mode = this.modes[languageId];
            if (mode) {
                result.push(mode);
            }
        }
        return result;
    }
    getMode(languageId) {
        return this.modes[languageId];
    }
    onDocumentRemoved(document) {
        this.modelCaches.forEach(mc => mc.onDocumentRemoved(document));
        for (const mode in this.modes) {
            this.modes[mode].onDocumentRemoved(document);
        }
    }
    dispose() {
        this.modelCaches.forEach(mc => mc.dispose());
        this.modelCaches = [];
        for (const mode in this.modes) {
            this.modes[mode].dispose();
        }
        this.serviceHost.dispose();
    }
}
exports.LanguageModes = LanguageModes;
//# sourceMappingURL=languageModes.js.map