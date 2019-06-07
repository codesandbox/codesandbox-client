'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const elm_module_parser_1 = require("elm-module-parser");
const _ = require("lodash");
class ElmDefinitionProvider {
    constructor(languagemode, workspaceSymbolProvider) {
        this.languagemode = languagemode;
        this.workspaceSymbolProvider = workspaceSymbolProvider;
    }
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let wordRange = document.getWordRangeAtPosition(position);
            let lineText = document.lineAt(position.line).text;
            let word = wordRange ? document.getText(wordRange) : '';
            if (!wordRange || lineText.startsWith('--') || word.match(/^\d+.?\d+$/)) {
                return null;
            }
            try {
                const parsedModule = elm_module_parser_1.parseElmModule(document.getText());
                let symbolName = word.substring(word.lastIndexOf('.') + 1);
                let moduleAlias = word.substring(0, word.lastIndexOf('.'));
                const exactMatchingImport = parsedModule.imports.find(i => {
                    if (moduleAlias === '') {
                        const matchedExposing = i.exposing.find(e => {
                            return e.name === symbolName;
                        });
                        return matchedExposing != null;
                    }
                    else {
                        return i.alias === moduleAlias || i.module === moduleAlias;
                    }
                });
                const moduleToSearch = exactMatchingImport != null
                    ? exactMatchingImport.module
                    : parsedModule.name;
                const query = `${moduleToSearch}:${symbolName}`;
                const exactMatch = yield this.workspaceSymbolProvider.provideWorkspaceSymbols(query, token);
                if (exactMatch.length > 0) {
                    return exactMatch[0].location;
                }
                else if (moduleAlias === '') {
                    const allImported = parsedModule.imports.filter(i => {
                        return i.exposes_all || i.exposing.find(e => e.type === 'constructor');
                    });
                    // This could find non-exposed symbols
                    const fuzzyMatches = yield Promise.all(allImported.map(i => {
                        return this.workspaceSymbolProvider.provideWorkspaceSymbols(`${i.module}:${symbolName}`, token);
                    }));
                    const firstFuzzy = _.flatMap(fuzzyMatches, m => m)[0];
                    return firstFuzzy != null ? firstFuzzy.location : null;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ElmDefinitionProvider = ElmDefinitionProvider;
//# sourceMappingURL=elmDefinition.js.map