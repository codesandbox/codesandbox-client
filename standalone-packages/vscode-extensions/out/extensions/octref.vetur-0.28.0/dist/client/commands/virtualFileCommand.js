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
exports.setVirtualContents = exports.generateShowVirtualFileCommand = exports.registerVeturTextDocumentProviders = void 0;
const vscode = require("vscode");
let fileName = '';
let virtualFileSource = '';
let prettySourceMap = '';
const separator = Array(20)
    .fill('=')
    .join('');
const onDidChangeEmitter = new vscode.EventEmitter();
function registerVeturTextDocumentProviders() {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.workspace.registerTextDocumentContentProvider('vetur', {
            onDidChange: onDidChangeEmitter.event,
            provideTextDocumentContent(uri) {
                return buildUpContent();
            }
        });
    });
}
exports.registerVeturTextDocumentProviders = registerVeturTextDocumentProviders;
function generateShowVirtualFileCommand(client) {
    return () => __awaiter(this, void 0, void 0, function* () {
        if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document.fileName.endsWith('.vue')) {
            return vscode.window.showInformationMessage('Failed to show virtual file. Make sure the current file is a .vue file.');
        }
        const currFileName = vscode.window.activeTextEditor.document.fileName;
        const currFileText = vscode.window.activeTextEditor.document.getText();
        const uri = vscode.Uri.parse('vetur:' + currFileName);
        fileName = currFileName;
        const result = yield client.sendRequest('$/queryVirtualFileInfo', { fileName, currFileText });
        virtualFileSource = result.source;
        prettySourceMap = result.sourceMapNodesString;
        onDidChangeEmitter.fire(uri);
        const doc = yield vscode.workspace.openTextDocument(uri);
        vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
    });
}
exports.generateShowVirtualFileCommand = generateShowVirtualFileCommand;
function setVirtualContents(virtualFileSource, prettySourceMap) {
    virtualFileSource = virtualFileSource;
    prettySourceMap = prettySourceMap;
}
exports.setVirtualContents = setVirtualContents;
function buildUpContent() {
    return `${separator}
Virtual content of ${fileName + '.template'}
Hover, semantic diagnostics, jump to definition and find references are run on this file.
${separator}

${virtualFileSource}

${separator}
SourceMap
from: ${fileName}
to  : ${fileName + '.template'}
[VueFileStart, VueFileEnd, VueFileText] => [TSVirtualFileStart, TSVirtualFileEnd, TSVirtualFileText]
${separator}

${prettySourceMap}
`;
}
//# sourceMappingURL=virtualFileCommand.js.map