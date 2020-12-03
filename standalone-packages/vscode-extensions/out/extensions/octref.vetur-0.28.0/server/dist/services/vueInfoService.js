"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueInfoService = void 0;
const paths_1 = require("../utils/paths");
class VueInfoService {
    constructor() {
        this.vueFileInfo = new Map();
    }
    init(languageModes) {
        this.languageModes = languageModes;
    }
    updateInfo(doc, info) {
        this.vueFileInfo.set(paths_1.getFileFsPath(doc.uri), info);
    }
    getInfo(doc) {
        this.languageModes.getAllLanguageModeRangesInDocument(doc).forEach(m => {
            if (m.mode.updateFileInfo) {
                m.mode.updateFileInfo(doc);
            }
        });
        return this.vueFileInfo.get(paths_1.getFileFsPath(doc.uri));
    }
}
exports.VueInfoService = VueInfoService;
//# sourceMappingURL=vueInfoService.js.map