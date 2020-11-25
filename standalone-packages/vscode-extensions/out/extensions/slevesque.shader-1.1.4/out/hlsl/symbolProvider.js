'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const common_1 = require("../common");
const child_process_1 = require("child_process");
const path_1 = require("path");
const searchPatterns = [
    { kind: vscode_1.SymbolKind.Function, pattern: /^\w+\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)\s*\(/.source },
    { kind: vscode_1.SymbolKind.Struct, pattern: /^(?:struct|cbuffer|tbuffer)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Variable, pattern: /^(?:sampler|sampler1D|sampler2D|sampler3D|samplerCUBE|samplerRECT|sampler_state|SamplerState)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Field, pattern: /^(?:texture|texture2D|textureCUBE|Texture1D|Texture1DArray|Texture2D|Texture2DArray|Texture2DMS|Texture2DMSArray|Texture3D|TextureCube|TextureCubeArray|RWTexture1D|RWTexture1DArray|RWTexture2D|RWTexture2DArray|RWTexture3D)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
    { kind: vscode_1.SymbolKind.Field, pattern: /^(?:AppendStructuredBuffer|Buffer|ByteAddressBuffer|ConsumeStructuredBuffer|RWBuffer|RWByteAddressBuffer|RWStructuredBuffer|StructuredBuffer)(?:\s*<(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9,_\x7f-\xff]*)>)?\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9\[\]_\x7f-\xff]*)/.source },
];
class HLSLDocumentSymbolProvider {
    constructor() {
        this._disposables = [];
        this._hlslPattern = ['.hlsl', '.hlsli', '.fx', '.fxh', '.vsh', '.psh', '.cginc', '.compute'];
        const extention = vscode_1.extensions.getExtension('vscode.hlsl');
        if (extention && extention.packageJSON
            && extention.packageJSON.contributes
            && extention.packageJSON.contributes.languages) {
            let hlsllang = extention.packageJSON.contributes.languages.filter(l => l.id === 'hlsl');
            if (hlsllang.length && hlsllang[0].extensions) {
                this._hlslPattern = hlsllang[0].extensions;
            }
        }
    }
    dispose() {
        if (this._disposables.length > 0) {
            this._disposables.forEach(d => d.dispose());
            this._disposables = [];
        }
    }
    getDocumentSymbols(uri) {
        return new Promise((resolve, reject) => {
            let result = [];
            let document = null;
            for (let d of vscode_1.workspace.textDocuments) {
                if (d.uri.toString() === uri.toString()) {
                    document = d;
                    break;
                }
            }
            if (document === null) {
                resolve([]);
                return;
            }
            let text = document.getText();
            function fetchSymbol(entry) {
                const kind = entry.kind;
                const pattern = entry.pattern;
                let regex = new RegExp(pattern, "gm");
                let match = null;
                while (match = regex.exec(text)) {
                    let line = document.positionAt(match.index).line;
                    let range = document.lineAt(line).range;
                    let word = match[1];
                    let lastChar = kind === vscode_1.SymbolKind.Function ? ')' :
                        kind === vscode_1.SymbolKind.Struct ? '}' :
                            kind === vscode_1.SymbolKind.Variable ? ';' :
                                kind === vscode_1.SymbolKind.Field ? ';' :
                                    '';
                    if (lastChar) {
                        let end = text.indexOf(lastChar, match.index) + 1;
                        range = new vscode_1.Range(range.start, document.positionAt(end));
                    }
                    result.push(new vscode_1.SymbolInformation(word, kind, '', new vscode_1.Location(document.uri, range)));
                }
            }
            for (let entry of searchPatterns) {
                fetchSymbol(entry);
            }
            resolve(result);
        });
    }
    provideDocumentSymbols(document, token) {
        return this.getDocumentSymbols(document.uri);
    }
    provideWorkspaceSymbols(query, token) {
        if (!common_1.rgPath) {
            return null;
        }
        return new Promise((resolve, reject) => {
            const execOpts = {
                cwd: vscode_1.workspace.rootPath,
                maxBuffer: 1024 * 1024
            };
            let results = [];
            let includePattern = '-g *' + this._hlslPattern.join(' -g *');
            for (let entry of searchPatterns) {
                const kind = entry.kind;
                const searchPattern = entry.pattern;
                let output = child_process_1.execSync(`"${common_1.rgPath}" ${includePattern} -o --case-sensitive -H --line-number --column --hidden -e "${searchPattern}" .`, execOpts);
                let lines = output.toString().split('\n');
                for (let line of lines) {
                    let lineMatch = /^(?:((?:[a-zA-Z]:)?[^:]*):)?(\d+):(\d):(.+)/.exec(line);
                    if (lineMatch) {
                        let position = new vscode_1.Position(parseInt(lineMatch[2]) - 1, parseInt(lineMatch[3]) - 1);
                        let range = new vscode_1.Range(position, position);
                        let filepath = path_1.join(vscode_1.workspace.rootPath, lineMatch[1]);
                        let regex = new RegExp(searchPattern);
                        let word = '?????';
                        let symbolMatch = regex.exec(lineMatch[4].toString());
                        if (symbolMatch) {
                            word = symbolMatch[1];
                            position = position.with({ character: symbolMatch[0].indexOf(word) });
                            range = new vscode_1.Range(position, position.translate(0, word.length));
                        }
                        results.push(new vscode_1.SymbolInformation(word, kind, '', new vscode_1.Location(vscode_1.Uri.file(filepath), range)));
                    }
                }
            }
            resolve(results);
        });
    }
}
exports.default = HLSLDocumentSymbolProvider;
//# sourceMappingURL=symbolProvider.js.map