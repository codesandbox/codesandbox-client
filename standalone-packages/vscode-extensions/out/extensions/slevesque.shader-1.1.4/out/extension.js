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
const vscode = require("vscode");
const fs = require("fs");
const Path = require("path");
const tmp = require("tmp");
const common_1 = require("./common");
const hoverProvider_1 = require("./hlsl/hoverProvider");
const completionProvider_1 = require("./hlsl/completionProvider");
const signatureProvider_1 = require("./hlsl/signatureProvider");
const symbolProvider_1 = require("./hlsl/symbolProvider");
const definitionProvider_1 = require("./hlsl/definitionProvider");
const referenceProvider_1 = require("./hlsl/referenceProvider");
class HLSLFormatingProvider {
    provideDocumentFormattingEdits(document, options, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var tmpFile = tmp.fileSync({ prefix: 'hlsl-', postfix: '.cpp' });
            fs.writeFileSync(tmpFile.name, document.getText());
            return vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', vscode.Uri.file(tmpFile), options);
        });
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var tmpFile = tmp.fileSync({ prefix: 'hlsl-', postfix: '.cpp' });
            fs.writeFileSync(tmpFile.name, document.getText());
            let doc = yield vscode.workspace.openTextDocument(tmpFile.name);
            return vscode.commands.executeCommand('vscode.executeFormatRangeProvider', doc.uri, range, options);
        });
    }
}
const documentSelector = [
    { language: 'hlsl', scheme: 'file' },
    { language: 'hlsl', scheme: 'untitled' },
];
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('vscode-shader extension started');
        if (process.mainModule.hasOwnProperty('paths')) {
            for (let path of process.mainModule['paths']) {
                let testPath = Path.join(path, 'vscode-ripgrep', 'bin', process.platform === 'win32' ? 'rg.exe' : 'rg');
                if (fs.existsSync(testPath)) {
                    common_1.setRgPath(testPath);
                    break;
                }
            }
        }
        // add providers
        context.subscriptions.push(vscode.languages.registerHoverProvider(documentSelector, new hoverProvider_1.default()));
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(documentSelector, new completionProvider_1.default(), '.'));
        context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(documentSelector, new signatureProvider_1.default(), '(', ','));
        context.subscriptions.push(vscode.languages.registerReferenceProvider(documentSelector, new referenceProvider_1.default()));
        let symbolProvider = new symbolProvider_1.default();
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(documentSelector, symbolProvider));
        if (vscode.workspace.rootPath) {
            context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(symbolProvider));
        }
        let definitionProvider = new definitionProvider_1.default();
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(documentSelector, definitionProvider));
        context.subscriptions.push(vscode.languages.registerImplementationProvider(documentSelector, definitionProvider));
        context.subscriptions.push(vscode.languages.registerTypeDefinitionProvider(documentSelector, definitionProvider));
        if (vscode.extensions.getExtension('ms-vscode.cpptools') !== undefined) {
            let formatingProvider = new HLSLFormatingProvider();
            context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(documentSelector, formatingProvider));
            context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(documentSelector, formatingProvider));
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map