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
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const autoClose_1 = require("./html/autoClose");
var TagCloseRequest;
(function (TagCloseRequest) {
    TagCloseRequest.type = new vscode_languageclient_1.RequestType('html/tag');
})(TagCloseRequest || (TagCloseRequest = {}));
function activate(context) {
    let serverModule = context.asAbsolutePath(path.join('./', 'node_modules', 'svelte-language-server', 'bin', 'server.js'));
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions },
    };
    const lsConfig = vscode_1.workspace.getConfiguration('svelte.language-server');
    const serverRuntime = lsConfig.get('runtime');
    if (serverRuntime) {
        serverOptions.run.runtime = serverRuntime;
        serverOptions.debug.runtime = serverRuntime;
        console.log('setting server runtime to', serverRuntime);
    }
    let clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'svelte' }],
        synchronize: {
            configurationSection: ['svelte', 'html'],
        },
    };
    let ls = createLanguageServer(serverOptions, clientOptions);
    context.subscriptions.push(ls.start());
    ls.onReady().then(() => {
        let tagRequestor = (document, position) => {
            let param = ls.code2ProtocolConverter.asTextDocumentPositionParams(document, position);
            return ls.sendRequest(TagCloseRequest.type, param);
        };
        let disposable = autoClose_1.activateTagClosing(tagRequestor, { svelte: true }, 'html.autoClosingTags');
        context.subscriptions.push(disposable);
    });
    context.subscriptions.push(vscode_1.commands.registerCommand('svelte.restartLanguageServer', () => __awaiter(this, void 0, void 0, function* () {
        yield ls.stop();
        ls = createLanguageServer(serverOptions, clientOptions);
        context.subscriptions.push(ls.start());
        yield ls.onReady();
        vscode_1.window.showInformationMessage('Svelte language server restarted.');
    })));
}
exports.activate = activate;
function createLanguageServer(serverOptions, clientOptions) {
    return new vscode_languageclient_1.LanguageClient('svelte', 'Svelte', serverOptions, clientOptions);
}
//# sourceMappingURL=extension.js.map