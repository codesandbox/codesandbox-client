"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleResolutionCache = void 0;
class ModuleResolutionCache {
    constructor() {
        this._cache = {};
    }
    getCache(moduleName, containingFile) {
        if (!this._cache[containingFile]) {
            if (containingFile.endsWith('.vue')) {
                this._cache[containingFile] = this._cache[containingFile + '.template'] = {};
            }
            else if (containingFile.endsWith('.vue.template')) {
                this._cache[containingFile.slice(0, -'.template'.length)] = this._cache[containingFile] = {};
            }
            else {
                this._cache[containingFile] = {};
            }
            return undefined;
        }
        return this._cache[containingFile][moduleName];
    }
    setCache(moduleName, containingFile, cache) {
        if (!this._cache[containingFile]) {
            if (containingFile.endsWith('.vue')) {
                this._cache[containingFile] = this._cache[containingFile + '.template'] = {};
            }
            else if (containingFile.endsWith('.vue.template')) {
                this._cache[containingFile.slice(0, -'.template'.length)] = this._cache[containingFile] = {};
            }
            else {
                this._cache[containingFile] = {};
            }
            return undefined;
        }
        this._cache[containingFile][moduleName] = cache;
    }
}
exports.ModuleResolutionCache = ModuleResolutionCache;
//# sourceMappingURL=moduleResolutionCache.js.map