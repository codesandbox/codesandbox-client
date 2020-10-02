"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueSys = void 0;
const preprocess_1 = require("./preprocess");
const util_1 = require("./util");
function getVueSys(tsModule, scriptFileNameSet) {
    /**
     * This part is only accessed by TS module resolution
     */
    const vueSys = Object.assign(Object.assign({}, tsModule.sys), { fileExists(path) {
            if (util_1.isVirtualVueFile(path, scriptFileNameSet)) {
                return tsModule.sys.fileExists(path.slice(0, -'.ts'.length));
            }
            return tsModule.sys.fileExists(path);
        }, readFile(path, encoding) {
            if (util_1.isVirtualVueFile(path, scriptFileNameSet)) {
                const fileText = tsModule.sys.readFile(path.slice(0, -'.ts'.length), encoding);
                return fileText ? preprocess_1.parseVueScript(fileText) : fileText;
            }
            const fileText = tsModule.sys.readFile(path, encoding);
            return fileText;
        } });
    if (tsModule.sys.realpath) {
        const realpath = tsModule.sys.realpath;
        vueSys.realpath = function (path) {
            if (util_1.isVirtualVueFile(path, scriptFileNameSet)) {
                return realpath(path.slice(0, -'.ts'.length)) + '.ts';
            }
            return realpath(path);
        };
    }
    return vueSys;
}
exports.getVueSys = getVueSys;
//# sourceMappingURL=vueSys.js.map