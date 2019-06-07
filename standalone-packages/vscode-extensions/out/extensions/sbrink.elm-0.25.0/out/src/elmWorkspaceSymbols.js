"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const elmSymbol_1 = require("./elmSymbol");
const _ = require("lodash");
const config = vscode.workspace.getConfiguration('elm');
class ElmWorkspaceSymbolProvider {
    constructor(languagemode) {
        this.languagemode = languagemode;
        this.symbolsByContainer = {};
        this.symbolsByUri = {};
    }
    update(document) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.indexDocument(document);
        });
    }
    remove(uri) {
        this.removeDocument(uri);
    }
    provideWorkspaceSymbols(query, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const [sourceModule, symbolName] = query.split(':', 2);
            if (symbolName == null) {
                return this.searchWorkspaceSymbols(sourceModule);
            }
            return this.searchModuleSymbols(sourceModule, symbolName);
        });
    }
    searchWorkspaceSymbols(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.workspaceIndexTime == null) {
                yield this.indexWorkspace();
            }
            const matchingSymbols = _.values(this.symbolsByContainer)
                .reduce((acc, moduleSymbols) => {
                return acc.concat(moduleSymbols.filter(x => symbol.startsWith(x.name)));
            }, []);
            return matchingSymbols;
        });
    }
    searchModuleSymbols(moduleName, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerSymbols = this.symbolsByContainer[moduleName];
            if (containerSymbols == null) {
                yield this.indexModule(moduleName);
            }
            return (this.symbolsByContainer[moduleName] || []).filter(s => s.name === symbol);
        });
    }
    indexWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxFiles = config['maxWorkspaceFilesUsedBySymbols'];
            const excludePattern = config['workspaceFilesExcludePatternUsedBySymbols'];
            const workspaceFiles = yield vscode.workspace.findFiles('**/*.elm', excludePattern, maxFiles);
            try {
                yield Promise.all(workspaceFiles.map((uri) => __awaiter(this, void 0, void 0, function* () { return this.indexDocument(yield vscode.workspace.openTextDocument(uri)); })));
                this.workspaceIndexTime = new Date();
            }
            catch (error) {
                return;
            }
        });
    }
    indexModule(moduleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const modulePath = moduleName.replace(/\./g, '/') + '.elm';
            const matchedFiles = yield vscode.workspace.findFiles('**/*/' + modulePath, null, 1);
            if (matchedFiles.length === 1) {
                yield this.indexDocument(yield vscode.workspace.openTextDocument(matchedFiles[0]));
            }
        });
    }
    removeDocument(uri) {
        if (!_.has(this.symbolsByUri, uri.toString())) {
            return;
        }
        const firstSymbol = _.first(this.symbolsByUri[uri.toString()]);
        if (!_.isNil(firstSymbol)) {
            delete this.symbolsByContainer[firstSymbol.containerName];
        }
        delete this.symbolsByUri[uri.toString()];
    }
    indexDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedSymbols = yield elmSymbol_1.processDocument(document);
            this.removeDocument(document.uri);
            // Update new symbols
            updatedSymbols.forEach(s => {
                this.symbolsByContainer[s.containerName] = (this.symbolsByContainer[s.containerName] || []).concat(s);
                this.symbolsByUri[s.location.uri.toString()] = (this.symbolsByUri[s.location.uri.toString()] || []).concat(s);
            });
        });
    }
}
exports.ElmWorkspaceSymbolProvider = ElmWorkspaceSymbolProvider;
//# sourceMappingURL=elmWorkspaceSymbols.js.map