"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languageModelCache_1 = require("../languageModelCache");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const serviceHost_1 = require("./serviceHost");
const prettier_1 = require("../../utils/prettier");
const paths_1 = require("../../utils/paths");
const vscode_uri_1 = require("vscode-uri");
const ts = require("typescript");
const _ = require("lodash");
const nullMode_1 = require("../nullMode");
const componentInfo_1 = require("./componentInfo");
// Todo: After upgrading to LS server 4.0, use CompletionContext for filtering trigger chars
// https://microsoft.github.io/language-server-protocol/specification#completion-request-leftwards_arrow_with_hook
const NON_SCRIPT_TRIGGERS = ['<', '/', '*', ':'];
function getJavascriptMode(documentRegions, workspacePath) {
    if (!workspacePath) {
        return Object.assign({}, nullMode_1.nullMode);
    }
    const jsDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => {
        const vueDocument = documentRegions.get(document);
        return vueDocument.getEmbeddedDocumentByType('script');
    });
    const regionStart = languageModelCache_1.getLanguageModelCache(10, 60, document => {
        const vueDocument = documentRegions.get(document);
        return vueDocument.getLanguageRangeByType('script');
    });
    const serviceHost = serviceHost_1.getServiceHost(workspacePath, jsDocuments);
    const { updateCurrentTextDocument } = serviceHost;
    let config = {};
    let vueInfoService = null;
    return {
        getId() {
            return 'javascript';
        },
        configure(c) {
            config = c;
        },
        configureService(infoService) {
            vueInfoService = infoService;
        },
        updateFileInfo(doc) {
            if (!vueInfoService) {
                return;
            }
            const { service } = updateCurrentTextDocument(doc);
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const info = componentInfo_1.getComponentInfo(service, fileFsPath, config);
            if (info) {
                vueInfoService.updateInfo(doc, info);
            }
        },
        doValidation(doc) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const diagnostics = [
                ...service.getSyntacticDiagnostics(fileFsPath),
                ...service.getSemanticDiagnostics(fileFsPath)
            ];
            return diagnostics.map(diag => {
                // syntactic/semantic diagnostic always has start and length
                // so we can safely cast diag to TextSpan
                return {
                    range: convertRange(scriptDoc, diag),
                    severity: vscode_languageserver_types_1.DiagnosticSeverity.Error,
                    message: ts.flattenDiagnosticMessageText(diag.messageText, '\n')
                };
            });
        },
        doComplete(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return { isIncomplete: false, items: [] };
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const offset = scriptDoc.offsetAt(position);
            const triggerChar = doc.getText()[offset - 1];
            if (NON_SCRIPT_TRIGGERS.includes(triggerChar)) {
                return { isIncomplete: false, items: [] };
            }
            const completions = service.getCompletionsAtPosition(fileFsPath, offset, {
                includeExternalModuleExports: _.get(config, ['vetur', 'completion', 'autoImport']),
                includeInsertTextCompletions: false
            });
            if (!completions) {
                return { isIncomplete: false, items: [] };
            }
            const entries = completions.entries.filter(entry => entry.name !== '__vueEditorBridge');
            return {
                isIncomplete: false,
                items: entries.map((entry, index) => {
                    const range = entry.replacementSpan && convertRange(scriptDoc, entry.replacementSpan);
                    return {
                        uri: doc.uri,
                        position,
                        label: entry.name,
                        sortText: entry.sortText + index,
                        kind: convertKind(entry.kind),
                        textEdit: range && vscode_languageserver_types_1.TextEdit.replace(range, entry.name),
                        data: {
                            // data used for resolving item details (see 'doResolve')
                            languageId: scriptDoc.languageId,
                            uri: doc.uri,
                            offset,
                            source: entry.source
                        }
                    };
                })
            };
        },
        doResolve(doc, item) {
            const { service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return item;
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const details = service.getCompletionEntryDetails(fileFsPath, item.data.offset, item.label, 
            /*formattingOption*/ {}, item.data.source);
            if (details) {
                item.detail = ts.displayPartsToString(details.displayParts);
                item.documentation = ts.displayPartsToString(details.documentation);
                if (details.codeActions && config.vetur.completion.autoImport) {
                    const textEdits = convertCodeAction(doc, details.codeActions, regionStart);
                    item.additionalTextEdits = textEdits;
                }
                delete item.data;
            }
            return item;
        },
        doHover(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return { contents: [] };
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const info = service.getQuickInfoAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (info) {
                const display = ts.displayPartsToString(info.displayParts);
                const doc = ts.displayPartsToString(info.documentation);
                const markedContents = [{ language: 'ts', value: display }];
                if (doc) {
                    markedContents.unshift(doc, '\n');
                }
                return {
                    range: convertRange(scriptDoc, info.textSpan),
                    contents: markedContents
                };
            }
            return { contents: [] };
        },
        doSignatureHelp(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return nullMode_1.NULL_SIGNATURE;
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const signHelp = service.getSignatureHelpItems(fileFsPath, scriptDoc.offsetAt(position));
            if (!signHelp) {
                return nullMode_1.NULL_SIGNATURE;
            }
            const ret = {
                activeSignature: signHelp.selectedItemIndex,
                activeParameter: signHelp.argumentIndex,
                signatures: []
            };
            signHelp.items.forEach(item => {
                const signature = {
                    label: '',
                    documentation: undefined,
                    parameters: []
                };
                signature.label += ts.displayPartsToString(item.prefixDisplayParts);
                item.parameters.forEach((p, i, a) => {
                    const label = ts.displayPartsToString(p.displayParts);
                    const parameter = {
                        label,
                        documentation: ts.displayPartsToString(p.documentation)
                    };
                    signature.label += label;
                    signature.parameters.push(parameter);
                    if (i < a.length - 1) {
                        signature.label += ts.displayPartsToString(item.separatorDisplayParts);
                    }
                });
                signature.label += ts.displayPartsToString(item.suffixDisplayParts);
                ret.signatures.push(signature);
            });
            return ret;
        },
        findDocumentHighlight(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const occurrences = service.getOccurrencesAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (occurrences) {
                return occurrences.map(entry => {
                    return {
                        range: convertRange(scriptDoc, entry.textSpan),
                        kind: entry.isWriteAccess
                            ? vscode_languageserver_types_1.DocumentHighlightKind.Write
                            : vscode_languageserver_types_1.DocumentHighlightKind.Text
                    };
                });
            }
            return [];
        },
        findDocumentSymbols(doc) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const items = service.getNavigationBarItems(fileFsPath);
            if (!items) {
                return [];
            }
            const result = [];
            const existing = {};
            const collectSymbols = (item, containerLabel) => {
                const sig = item.text + item.kind + item.spans[0].start;
                if (item.kind !== 'script' && !existing[sig]) {
                    const symbol = {
                        name: item.text,
                        kind: convertSymbolKind(item.kind),
                        location: {
                            uri: doc.uri,
                            range: convertRange(scriptDoc, item.spans[0])
                        },
                        containerName: containerLabel
                    };
                    existing[sig] = true;
                    result.push(symbol);
                    containerLabel = item.text;
                }
                if (item.childItems && item.childItems.length > 0) {
                    for (const child of item.childItems) {
                        collectSymbols(child, containerLabel);
                    }
                }
            };
            items.forEach(item => collectSymbols(item));
            return result;
        },
        findDefinition(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const definitions = service.getDefinitionAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (!definitions) {
                return [];
            }
            const definitionResults = [];
            const program = service.getProgram();
            if (!program) {
                return [];
            }
            definitions.forEach(d => {
                const definitionTargetDoc = getSourceDoc(d.fileName, program);
                definitionResults.push({
                    uri: vscode_uri_1.default.file(d.fileName).toString(),
                    range: convertRange(definitionTargetDoc, d.textSpan)
                });
            });
            return definitionResults;
        },
        findReferences(doc, position) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            if (!languageServiceIncludesFile(service, doc.uri)) {
                return [];
            }
            const fileFsPath = paths_1.getFileFsPath(doc.uri);
            const references = service.getReferencesAtPosition(fileFsPath, scriptDoc.offsetAt(position));
            if (!references) {
                return [];
            }
            const referenceResults = [];
            const program = service.getProgram();
            if (!program) {
                return [];
            }
            references.forEach(r => {
                const referenceTargetDoc = getSourceDoc(r.fileName, program);
                if (referenceTargetDoc) {
                    referenceResults.push({
                        uri: vscode_uri_1.default.file(r.fileName).toString(),
                        range: convertRange(referenceTargetDoc, r.textSpan)
                    });
                }
            });
            return referenceResults;
        },
        format(doc, range, formatParams) {
            const { scriptDoc, service } = updateCurrentTextDocument(doc);
            const defaultFormatter = scriptDoc.languageId === 'javascript'
                ? config.vetur.format.defaultFormatter.js
                : config.vetur.format.defaultFormatter.ts;
            if (defaultFormatter === 'none') {
                return [];
            }
            const parser = scriptDoc.languageId === 'javascript' ? 'babylon' : 'typescript';
            const needInitialIndent = config.vetur.format.scriptInitialIndent;
            const vlsFormatConfig = config.vetur.format;
            if (defaultFormatter === 'prettier' || defaultFormatter === 'prettier-eslint') {
                const code = scriptDoc.getText();
                const filePath = paths_1.getFileFsPath(scriptDoc.uri);
                return defaultFormatter === 'prettier'
                    ? prettier_1.prettierify(code, filePath, range, vlsFormatConfig, parser, needInitialIndent)
                    : prettier_1.prettierEslintify(code, filePath, range, vlsFormatConfig, parser, needInitialIndent);
            }
            else {
                const initialIndentLevel = needInitialIndent ? 1 : 0;
                const formatSettings = scriptDoc.languageId === 'javascript' ? config.javascript.format : config.typescript.format;
                const convertedFormatSettings = convertOptions(formatSettings, {
                    tabSize: vlsFormatConfig.options.tabSize,
                    insertSpaces: !vlsFormatConfig.options.useTabs
                }, initialIndentLevel);
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const start = scriptDoc.offsetAt(range.start);
                const end = scriptDoc.offsetAt(range.end);
                const edits = service.getFormattingEditsForRange(fileFsPath, start, end, convertedFormatSettings);
                if (!edits) {
                    return [];
                }
                const result = [];
                for (const edit of edits) {
                    if (edit.span.start >= start && edit.span.start + edit.span.length <= end) {
                        result.push({
                            range: convertRange(scriptDoc, edit.span),
                            newText: edit.newText
                        });
                    }
                }
                return result;
            }
        },
        onDocumentRemoved(document) {
            jsDocuments.onDocumentRemoved(document);
        },
        onDocumentChanged(filePath) {
            serviceHost.updateExternalDocument(filePath);
        },
        dispose() {
            serviceHost.dispose();
            jsDocuments.dispose();
        }
    };
}
exports.getJavascriptMode = getJavascriptMode;
function getSourceDoc(fileName, program) {
    const sourceFile = program.getSourceFile(fileName);
    return vscode_languageserver_types_1.TextDocument.create(fileName, 'vue', 0, sourceFile.getFullText());
}
function languageServiceIncludesFile(ls, documentUri) {
    const filePaths = ls.getProgram().getRootFileNames();
    const filePath = paths_1.getFilePath(documentUri);
    return filePaths.includes(filePath);
}
function convertRange(document, span) {
    const startPosition = document.positionAt(span.start);
    const endPosition = document.positionAt(span.start + span.length);
    return vscode_languageserver_types_1.Range.create(startPosition, endPosition);
}
function convertKind(kind) {
    switch (kind) {
        case 'primitive type':
        case 'keyword':
            return vscode_languageserver_types_1.CompletionItemKind.Keyword;
        case 'var':
        case 'local var':
            return vscode_languageserver_types_1.CompletionItemKind.Variable;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_types_1.CompletionItemKind.Field;
        case 'function':
        case 'method':
        case 'construct':
        case 'call':
        case 'index':
            return vscode_languageserver_types_1.CompletionItemKind.Function;
        case 'enum':
            return vscode_languageserver_types_1.CompletionItemKind.Enum;
        case 'module':
            return vscode_languageserver_types_1.CompletionItemKind.Module;
        case 'class':
            return vscode_languageserver_types_1.CompletionItemKind.Class;
        case 'interface':
            return vscode_languageserver_types_1.CompletionItemKind.Interface;
        case 'warning':
            return vscode_languageserver_types_1.CompletionItemKind.File;
    }
    return vscode_languageserver_types_1.CompletionItemKind.Property;
}
function convertSymbolKind(kind) {
    switch (kind) {
        case 'var':
        case 'local var':
        case 'const':
            return vscode_languageserver_types_1.SymbolKind.Variable;
        case 'function':
        case 'local function':
            return vscode_languageserver_types_1.SymbolKind.Function;
        case 'enum':
            return vscode_languageserver_types_1.SymbolKind.Enum;
        case 'module':
            return vscode_languageserver_types_1.SymbolKind.Module;
        case 'class':
            return vscode_languageserver_types_1.SymbolKind.Class;
        case 'interface':
            return vscode_languageserver_types_1.SymbolKind.Interface;
        case 'method':
            return vscode_languageserver_types_1.SymbolKind.Method;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_types_1.SymbolKind.Property;
    }
    return vscode_languageserver_types_1.SymbolKind.Variable;
}
function convertOptions(formatSettings, options, initialIndentLevel) {
    return _.assign(formatSettings, {
        convertTabsToSpaces: options.insertSpaces,
        tabSize: options.tabSize,
        indentSize: options.tabSize,
        baseIndentSize: options.tabSize * initialIndentLevel
    });
}
function convertCodeAction(doc, codeActions, regionStart) {
    const textEdits = [];
    for (const action of codeActions) {
        for (const change of action.changes) {
            textEdits.push(...change.textChanges.map(tc => {
                // currently, only import codeAction is available
                // change start of doc to start of script region
                if (tc.span.start === 0 && tc.span.length === 0) {
                    const region = regionStart.get(doc);
                    if (region) {
                        const line = region.start.line;
                        return {
                            range: vscode_languageserver_types_1.Range.create(line + 1, 0, line + 1, 0),
                            newText: tc.newText
                        };
                    }
                }
                return {
                    range: convertRange(doc, tc.span),
                    newText: tc.newText
                };
            }));
        }
    }
    return textEdits;
}
//# sourceMappingURL=javascript.js.map