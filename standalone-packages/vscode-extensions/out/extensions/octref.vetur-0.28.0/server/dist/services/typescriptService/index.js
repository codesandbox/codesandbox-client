"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptService = void 0;
class TypescriptService {
    constructor(dependencyService) {
        const tsDependency = dependencyService.getDependency('typescript');
        if (tsDependency && tsDependency.state === 0 /* Loaded */) {
            this.tsModule = tsDependency.module;
        }
        else {
            throw Error('Failed to load TypeScript module');
        }
    }
}
exports.TypescriptService = TypescriptService;
//# sourceMappingURL=index.js.map