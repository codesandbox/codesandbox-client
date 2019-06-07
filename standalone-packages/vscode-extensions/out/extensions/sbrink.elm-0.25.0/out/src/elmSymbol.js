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
const vscode_1 = require("vscode");
const elm_module_parser_1 = require("elm-module-parser");
const _ = require("lodash");
class ElmSymbolProvider {
    provideDocumentSymbols(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return processDocument(doc);
        });
    }
}
exports.ElmSymbolProvider = ElmSymbolProvider;
function locationToRange(location) {
    return new vscode.Range(location.start.line - 1, location.start.column - 1, location.end.line - 1, location.end.column - 1);
}
function processDocument(doc) {
    try {
        const parsedModule = elm_module_parser_1.parseElmModule(doc.getText());
        const moduleTypes = _.flatMap(parsedModule.types.map(t => {
            if (t.type === 'custom-type') {
                const constructorDefinition = new vscode_1.SymbolInformation(t.name, vscode.SymbolKind.Class, parsedModule.name, new vscode.Location(doc.uri, locationToRange(t.location)));
                return t.constructors
                    .map(ctor => {
                    return new vscode_1.SymbolInformation(ctor.name, vscode.SymbolKind.Constructor, parsedModule.name, new vscode.Location(doc.uri, locationToRange(ctor.location)));
                })
                    .concat(constructorDefinition);
            }
            else if (t.type === 'type-alias') {
                const typeAliasSymbol = new vscode_1.SymbolInformation(t.name, vscode.SymbolKind.Class, parsedModule.name, new vscode.Location(doc.uri, locationToRange(t.location)));
                return [typeAliasSymbol];
            }
            else {
                const _exhaustiveCheck = t;
                return [];
            }
        }));
        const moduleFunctions = parsedModule.function_declarations.map(f => {
            return new vscode_1.SymbolInformation(f.name, vscode.SymbolKind.Variable, parsedModule.name, new vscode.Location(doc.uri, locationToRange(f.location)));
        });
        const portAnnotations = parsedModule.port_annotations.map(p => {
            return new vscode_1.SymbolInformation(p.name, vscode.SymbolKind.Interface, parsedModule.name, new vscode.Location(doc.uri, locationToRange(p.location)));
        });
        const moduleDefinition = new vscode_1.SymbolInformation(parsedModule.name, vscode.SymbolKind.Module, parsedModule.name, new vscode.Location(doc.uri, locationToRange(parsedModule.location)));
        const allSymbols = _.concat(moduleDefinition, moduleTypes, moduleFunctions, portAnnotations);
        return allSymbols;
    }
    catch (error) {
        return [];
    }
}
exports.processDocument = processDocument;
//# sourceMappingURL=elmSymbol.js.map