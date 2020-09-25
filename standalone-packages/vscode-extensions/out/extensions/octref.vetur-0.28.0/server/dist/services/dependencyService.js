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
exports.DependencyService = void 0;
const path = require("path");
class DependencyService {
    constructor() {
        this.dependencies = {
            prettyhtml: { name: 'prettyhtml', state: 1 /* Unloaded */ },
            eslint: { name: 'eslint', state: 1 /* Unloaded */ },
            eslintPluginVue: { name: 'eslint-plugin-vue', state: 1 /* Unloaded */ },
            jsbeautify: { name: 'js-beautify', state: 1 /* Unloaded */ },
            prettier: { name: 'prettier', state: 1 /* Unloaded */ },
            // prettierEslint: { name: 'prettier-eslint', state: State.Unloaded },
            stylusSupremacy: { name: 'stylus-supremacy', state: 1 /* Unloaded */ },
            typescript: { name: 'typescript', state: 1 /* Unloaded */ }
        };
    }
    init(workspacePath, useWorkspaceDependencies, tsSDKPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!useWorkspaceDependencies) {
                const tsModule = yield Promise.resolve().then(() => require('typescript'));
                console.log(`Loaded bundled typescript@${tsModule.version}.`);
                this.dependencies.typescript = {
                    name: 'typecript',
                    state: 0 /* Loaded */,
                    version: tsModule.version,
                    bundled: true,
                    module: tsModule
                };
            }
            else {
                let workspaceTSPath = path.resolve(workspacePath, 'node_modules/typescript');
                if (tsSDKPath) {
                    if (path.isAbsolute(tsSDKPath)) {
                        workspaceTSPath = path.resolve(tsSDKPath, '..');
                    }
                    else {
                        workspaceTSPath = path.resolve(workspacePath, tsSDKPath, '..');
                    }
                }
                let tsModule;
                let bundled = false;
                try {
                    tsModule = yield Promise.resolve().then(() => require(workspaceTSPath));
                    console.log(`Loaded typescript@${tsModule.version} from ${workspaceTSPath}.`);
                }
                catch (err) {
                    tsModule = yield Promise.resolve().then(() => require('typescript'));
                    bundled = true;
                    console.log(`Failed to load typescript from ${workspaceTSPath}. Using bundled typescript@${tsModule.version}.`);
                }
                this.dependencies.typescript = {
                    name: 'typecript',
                    state: 0 /* Loaded */,
                    version: tsModule.version,
                    bundled,
                    module: tsModule
                };
            }
        });
    }
    getDependency(d) {
        if (!this.dependencies[d]) {
            return undefined;
        }
        return this.dependencies[d];
    }
}
exports.DependencyService = DependencyService;
//# sourceMappingURL=dependencyService.js.map