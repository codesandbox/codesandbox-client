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
const vscode_1 = require("vscode");
const html_1 = require("./html");
const hlslGlobals = require("./hlslGlobals");
const follow_redirects_1 = require("follow-redirects");
const jsdom_1 = require("jsdom");
exports.hlsldocUri = vscode_1.Uri.parse('hlsldoc://default');
function textToMarkedString(text) {
    return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
}
exports.textToMarkedString = textToMarkedString;
function linkToMarkdownString(linkUrl) {
    if (linkUrl === undefined || linkUrl === '') {
        return;
    }
    let link = new vscode_1.MarkdownString('[HLSL documentation][1]\n\n[1]: ');
    let openDocOnSide = vscode_1.workspace.getConfiguration('hlsl').get('openDocOnSide', false);
    if (openDocOnSide) {
        link.appendText(encodeURI('command:shader.openLink?' + JSON.stringify([linkUrl, true])));
    }
    else {
        link.appendText(linkUrl);
    }
    link.isTrusted = true;
    return link;
}
exports.linkToMarkdownString = linkToMarkdownString;
class HLSLHoverProvider {
    constructor() {
        this._subscriptions = [];
        this._hlslDocProvider = null;
        this._hlslDocProvider = new HLSLDocumentationTextDocumentProvider();
        this._subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('hlsldoc', this._hlslDocProvider));
        this._subscriptions.push(vscode_1.commands.registerCommand('shader.openLink', (link, newWindow) => {
            vscode_1.commands.executeCommand('vscode.previewHtml', exports.hlsldocUri, newWindow ? vscode_1.ViewColumn.Two : vscode_1.ViewColumn.Active, "HLSL Documentation").then(() => {
                vscode_1.commands.executeCommand('_workbench.htmlPreview.postMessage', vscode_1.Uri.parse('hlsldoc://default'), {
                    line: 0
                });
            });
            this._hlslDocProvider.goto(vscode_1.Uri.parse(link));
        }));
    }
    getSymbols(document) {
        return vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
    }
    dispose() {
        this._subscriptions.forEach(s => { s.dispose(); });
    }
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let enable = vscode_1.workspace.getConfiguration('hlsl').get('suggest.basic', true);
            if (!enable) {
                return null;
            }
            let wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }
            let name = document.getText(wordRange);
            let backchar = '';
            if (wordRange.start.character > 0) {
                let backidx = wordRange.start.translate({ characterDelta: -1 });
                backchar = backidx.character < 0 ? '' : document.getText(new vscode_1.Range(backidx, wordRange.start));
            }
            if (backchar === '#') {
                const key = name.substr(1);
                var entry = hlslGlobals.preprocessors[name.toUpperCase()];
                if (entry && entry.description) {
                    let signature = '(*preprocessor*) ';
                    signature += '**#' + name + '**';
                    let contents = [];
                    contents.push(new vscode_1.MarkdownString(signature));
                    contents.push(textToMarkedString(entry.description));
                    contents.push(linkToMarkdownString(entry.link));
                    return new vscode_1.Hover(contents, wordRange);
                }
            }
            var entry = hlslGlobals.intrinsicfunctions[name];
            if (entry && entry.description) {
                let signature = '(*function*) ';
                signature += '**' + name + '**';
                signature += '(';
                if (entry.parameters && entry.parameters.length != 0) {
                    let params = '';
                    entry.parameters.forEach(p => params += p.label + ',');
                    signature += params.slice(0, -1);
                }
                signature += ')';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                contents.push(linkToMarkdownString(entry.link));
                return new vscode_1.Hover(contents, wordRange);
            }
            entry = hlslGlobals.datatypes[name];
            if (entry && entry.description) {
                let signature = '(*datatype*) ';
                signature += '**' + name + '**';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                contents.push(linkToMarkdownString(entry.link));
                return new vscode_1.Hover(contents, wordRange);
            }
            entry = hlslGlobals.semantics[name.toUpperCase()];
            if (entry && entry.description) {
                let signature = '(*semantic*) ';
                signature += '**' + name + '**';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                contents.push(linkToMarkdownString(entry.link));
                return new vscode_1.Hover(contents, wordRange);
            }
            let key = name.replace(/\d+$/, ''); //strip tailing number
            entry = hlslGlobals.semanticsNum[key.toUpperCase()];
            if (entry && entry.description) {
                let signature = '(*semantic*) ';
                signature += '**' + name + '**';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                contents.push(linkToMarkdownString(entry.link));
                return new vscode_1.Hover(contents, wordRange);
            }
            entry = hlslGlobals.keywords[name];
            if (entry) {
                let signature = '(*keyword*) ';
                signature += '**' + name + '**';
                let contents = [];
                contents.push(new vscode_1.MarkdownString(signature));
                contents.push(textToMarkedString(entry.description));
                contents.push(linkToMarkdownString(entry.link));
                return new vscode_1.Hover(contents, wordRange);
            }
            let symbols = yield this.getSymbols(document);
            for (let s of symbols) {
                if (s.name === name) {
                    let contents = [];
                    let signature = '(*' + vscode_1.SymbolKind[s.kind].toLowerCase() + '*) ';
                    signature += s.containerName ? s.containerName + '.' : '';
                    signature += '**' + name + '**';
                    contents.push(new vscode_1.MarkdownString(signature));
                    if (s.location.uri.toString() === document.uri.toString()) {
                        //contents = [];
                        contents.push({ language: 'hlsl', value: document.getText(s.location.range) });
                    }
                    return new vscode_1.Hover(contents, wordRange);
                }
            }
        });
    }
}
exports.default = HLSLHoverProvider;
class HLSLDocumentationTextDocumentProvider {
    constructor() {
        this._uri = null;
        this._onDidChange = new vscode_1.EventEmitter();
    }
    goto(uri) {
        this._uri = uri;
        this._onDidChange.fire(exports.hlsldocUri);
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    provideTextDocumentContent(uri) {
        uri = this._uri;
        return new Promise((resolve, reject) => {
            let request = follow_redirects_1.https.request({
                host: uri.authority,
                path: uri.path,
                rejectUnauthorized: vscode_1.workspace.getConfiguration().get("http.proxyStrictSSL", true)
            }, (response) => {
                if (response.statusCode == 301 || response.statusCode == 302)
                    return resolve(response.headers.location);
                if (response.statusCode != 200)
                    return resolve(response.statusCode.toString());
                let html = '';
                response.on('data', (data) => { html += data.toString(); });
                response.on('end', () => {
                    const dom = new jsdom_1.JSDOM(html);
                    let topic = '';
                    let node = dom.window.document.querySelector('.content');
                    if (node) {
                        let num = node.getElementsByTagName('a').length;
                        for (let i = 0; i < num; ++i) {
                            if (node.getElementsByTagName('a')[i].href.startsWith('http')) {
                                node.getElementsByTagName('a')[i].href = encodeURI('command:shader.openLink?' + JSON.stringify([node.getElementsByTagName('a')[i].href, false]));
                            }
                        }
                        topic = node.outerHTML;
                    }
                    else {
                        let link = uri.with({ scheme: 'https' }).toString();
                        topic = `<a href="${link}">No topic found, click to follow link</a>`;
                    }
                    resolve(html_1.HTML_TEMPLATE.replace('{0}', topic));
                });
                response.on('error', (error) => { console.log(error); });
            });
            request.on('error', (error) => { console.log(error); });
            request.end();
        });
    }
}
//# sourceMappingURL=hoverProvider.js.map