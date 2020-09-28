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
exports.languageServiceIncludesFile = exports.getJavascriptMode = exports.APPLY_REFACTOR_COMMAND = void 0;
const languageModelCache_1 = require("../../embeddedSupport/languageModelCache");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const prettier_1 = require("../../utils/prettier");
const paths_1 = require("../../utils/paths");
const vscode_uri_1 = require("vscode-uri");
const ts = require("typescript");
const _ = require("lodash");
const nullMode_1 = require("../nullMode");
const componentInfo_1 = require("./componentInfo");
const util_1 = require("../../services/typescriptService/util");
const Previewer = require("./previewer");
// Todo: After upgrading to LS server 4.0, use CompletionContext for filtering trigger chars
// https://microsoft.github.io/language-server-protocol/specification#completion-request-leftwards_arrow_with_hook
const NON_SCRIPT_TRIGGERS = ['<', '*', ':'];
exports.APPLY_REFACTOR_COMMAND = 'vetur.applyRefactorCommand';
function getJavascriptMode(serviceHost, documentRegions, workspacePath, vueInfoService, dependencyService) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workspacePath) {
            return Object.assign({}, nullMode_1.nullMode);
        }
        const jsDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => {
            const vueDocument = documentRegions.refreshAndGet(document);
            return vueDocument.getSingleTypeDocument('script');
        });
        const firstScriptRegion = languageModelCache_1.getLanguageModelCache(10, 60, document => {
            const vueDocument = documentRegions.refreshAndGet(document);
            const scriptRegions = vueDocument.getLanguageRangesOfType('script');
            return scriptRegions.length > 0 ? scriptRegions[0] : undefined;
        });
        let tsModule = ts;
        if (dependencyService) {
            const tsDependency = dependencyService.getDependency('typescript');
            if (tsDependency && tsDependency.state === 0 /* Loaded */) {
                tsModule = tsDependency.module;
            }
        }
        const { updateCurrentVueTextDocument } = serviceHost;
        let config = {};
        let supportedCodeFixCodes;
        return {
            getId() {
                return 'javascript';
            },
            configure(c) {
                config = c;
            },
            updateFileInfo(doc) {
                if (!vueInfoService) {
                    return;
                }
                const { service } = updateCurrentVueTextDocument(doc);
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const info = componentInfo_1.getComponentInfo(tsModule, service, fileFsPath, config);
                if (info) {
                    vueInfoService.updateInfo(doc, info);
                }
            },
            doValidation(doc) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return [];
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const rawScriptDiagnostics = [
                    ...service.getSyntacticDiagnostics(fileFsPath),
                    ...service.getSemanticDiagnostics(fileFsPath)
                ];
                return rawScriptDiagnostics.map(diag => {
                    const tags = [];
                    if (diag.reportsUnnecessary) {
                        tags.push(vscode_languageserver_types_1.DiagnosticTag.Unnecessary);
                    }
                    // syntactic/semantic diagnostic always has start and length
                    // so we can safely cast diag to TextSpan
                    return {
                        range: convertRange(scriptDoc, diag),
                        severity: convertTSDiagnosticCategoryToDiagnosticSeverity(diag.category),
                        message: tsModule.flattenDiagnosticMessageText(diag.messageText, '\n'),
                        tags,
                        code: diag.code,
                        source: 'Vetur'
                    };
                });
            },
            doComplete(doc, position) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
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
                    includeCompletionsWithInsertText: true,
                    includeCompletionsForModuleExports: _.get(config, ['vetur', 'completion', 'autoImport'])
                });
                if (!completions) {
                    return { isIncomplete: false, items: [] };
                }
                const entries = completions.entries.filter(entry => entry.name !== '__vueEditorBridge');
                return {
                    isIncomplete: false,
                    items: entries.map((entry, index) => {
                        const range = entry.replacementSpan && convertRange(scriptDoc, entry.replacementSpan);
                        const { label, detail } = calculateLabelAndDetailTextForPathImport(entry);
                        return {
                            uri: doc.uri,
                            position,
                            preselect: entry.isRecommended ? true : undefined,
                            label,
                            detail,
                            filterText: getFilterText(entry.insertText),
                            sortText: entry.sortText + index,
                            kind: util_1.toCompletionItemKind(entry.kind),
                            textEdit: range && vscode_languageserver_types_1.TextEdit.replace(range, entry.name),
                            insertText: entry.insertText,
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
                function calculateLabelAndDetailTextForPathImport(entry) {
                    // Is import path completion
                    if (entry.kind === ts.ScriptElementKind.scriptElement) {
                        if (entry.kindModifiers) {
                            return {
                                label: entry.name,
                                detail: entry.name + entry.kindModifiers
                            };
                        }
                        else {
                            if (entry.name.endsWith('.vue')) {
                                return {
                                    label: entry.name.slice(0, -'.vue'.length),
                                    detail: entry.name
                                };
                            }
                        }
                    }
                    return {
                        label: entry.name,
                        detail: undefined
                    };
                }
            },
            doResolve(doc, item) {
                const { service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return item;
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const userPrefs = doc.languageId === 'javascript' ? config.javascript.preferences : config.typescript.preferences;
                const details = service.getCompletionEntryDetails(fileFsPath, item.data.offset, item.label, getFormatCodeSettings(config), item.data.source, userPrefs);
                if (details && item.kind !== vscode_languageserver_types_1.CompletionItemKind.File && item.kind !== vscode_languageserver_types_1.CompletionItemKind.Folder) {
                    item.detail = Previewer.plain(tsModule.displayPartsToString(details.displayParts));
                    const documentation = {
                        kind: 'markdown',
                        value: tsModule.displayPartsToString(details.documentation) + '\n\n'
                    };
                    if (details.tags) {
                        if (details.tags) {
                            details.tags.forEach(x => {
                                const tagDoc = Previewer.getTagDocumentation(x);
                                if (tagDoc) {
                                    documentation.value += tagDoc + '\n\n';
                                }
                            });
                        }
                    }
                    if (details.codeActions && config.vetur.completion.autoImport) {
                        const textEdits = convertCodeAction(doc, details.codeActions, firstScriptRegion);
                        item.additionalTextEdits = textEdits;
                        details.codeActions.forEach(action => {
                            if (action.description) {
                                documentation.value += '\n' + action.description;
                            }
                        });
                    }
                    item.documentation = documentation;
                    delete item.data;
                }
                return item;
            },
            doHover(doc, position) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return { contents: [] };
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const info = service.getQuickInfoAtPosition(fileFsPath, scriptDoc.offsetAt(position));
                if (info) {
                    const display = tsModule.displayPartsToString(info.displayParts);
                    const markedContents = [{ language: 'ts', value: display }];
                    let hoverMdDoc = '';
                    const doc = Previewer.plain(tsModule.displayPartsToString(info.documentation));
                    if (doc) {
                        hoverMdDoc += doc + '\n\n';
                    }
                    if (info.tags) {
                        info.tags.forEach(x => {
                            const tagDoc = Previewer.getTagDocumentation(x);
                            if (tagDoc) {
                                hoverMdDoc += tagDoc + '\n\n';
                            }
                        });
                    }
                    if (hoverMdDoc.trim() !== '') {
                        markedContents.push(hoverMdDoc);
                    }
                    return {
                        range: convertRange(scriptDoc, info.textSpan),
                        contents: markedContents
                    };
                }
                return { contents: [] };
            },
            doSignatureHelp(doc, position) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return nullMode_1.NULL_SIGNATURE;
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const signatureHelpItems = service.getSignatureHelpItems(fileFsPath, scriptDoc.offsetAt(position), undefined);
                if (!signatureHelpItems) {
                    return nullMode_1.NULL_SIGNATURE;
                }
                const signatures = [];
                signatureHelpItems.items.forEach(item => {
                    let sigLabel = '';
                    let sigMdDoc = '';
                    const sigParamemterInfos = [];
                    sigLabel += tsModule.displayPartsToString(item.prefixDisplayParts);
                    item.parameters.forEach((p, i, a) => {
                        const label = tsModule.displayPartsToString(p.displayParts);
                        const parameter = {
                            label,
                            documentation: tsModule.displayPartsToString(p.documentation)
                        };
                        sigLabel += label;
                        sigParamemterInfos.push(parameter);
                        if (i < a.length - 1) {
                            sigLabel += tsModule.displayPartsToString(item.separatorDisplayParts);
                        }
                    });
                    sigLabel += tsModule.displayPartsToString(item.suffixDisplayParts);
                    item.tags
                        .filter(x => x.name !== 'param')
                        .forEach(x => {
                        const tagDoc = Previewer.getTagDocumentation(x);
                        if (tagDoc) {
                            sigMdDoc += tagDoc + '\n\n';
                        }
                    });
                    signatures.push({
                        label: sigLabel,
                        documentation: {
                            kind: 'markdown',
                            value: sigMdDoc
                        },
                        parameters: sigParamemterInfos
                    });
                });
                return {
                    activeSignature: signatureHelpItems.selectedItemIndex,
                    activeParameter: signatureHelpItems.argumentIndex,
                    signatures
                };
            },
            findDocumentHighlight(doc, position) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return [];
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const occurrences = service.getOccurrencesAtPosition(fileFsPath, scriptDoc.offsetAt(position));
                if (occurrences) {
                    return occurrences.map(entry => {
                        return {
                            range: convertRange(scriptDoc, entry.textSpan),
                            kind: entry.isWriteAccess ? vscode_languageserver_types_1.DocumentHighlightKind.Write : vscode_languageserver_types_1.DocumentHighlightKind.Text
                        };
                    });
                }
                return [];
            },
            findDocumentSymbols(doc) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
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
                            kind: util_1.toSymbolKind(item.kind),
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
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
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
                        uri: vscode_uri_1.URI.file(d.fileName).toString(),
                        range: convertRange(definitionTargetDoc, d.textSpan)
                    });
                });
                return definitionResults;
            },
            findReferences(doc, position) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
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
                            uri: vscode_uri_1.URI.file(r.fileName).toString(),
                            range: convertRange(referenceTargetDoc, r.textSpan)
                        });
                    }
                });
                return referenceResults;
            },
            getFoldingRanges(doc) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                if (!languageServiceIncludesFile(service, doc.uri)) {
                    return [];
                }
                const fileFsPath = paths_1.getFileFsPath(doc.uri);
                const spans = service.getOutliningSpans(fileFsPath);
                return spans.map(s => {
                    const range = convertRange(scriptDoc, s.textSpan);
                    const kind = getFoldingRangeKind(s);
                    return {
                        startLine: range.start.line,
                        startCharacter: range.start.character,
                        endLine: range.end.line,
                        endCharacter: range.end.character,
                        kind
                    };
                });
            },
            getCodeActions(doc, range, _formatParams, context) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                const fileName = paths_1.getFileFsPath(scriptDoc.uri);
                const start = scriptDoc.offsetAt(range.start);
                const end = scriptDoc.offsetAt(range.end);
                if (!supportedCodeFixCodes) {
                    supportedCodeFixCodes = new Set(ts
                        .getSupportedCodeFixes()
                        .map(Number)
                        .filter(x => !isNaN(x)));
                }
                const fixableDiagnosticCodes = context.diagnostics.map(d => +d.code).filter(c => supportedCodeFixCodes.has(c));
                if (!fixableDiagnosticCodes) {
                    return [];
                }
                const formatSettings = getFormatCodeSettings(config);
                const result = [];
                const fixes = service.getCodeFixesAtPosition(fileName, start, end, fixableDiagnosticCodes, formatSettings, 
                /*preferences*/ {});
                collectQuickFixCommands(fixes, service, result);
                const textRange = { pos: start, end };
                const refactorings = service.getApplicableRefactors(fileName, textRange, /*preferences*/ {});
                collectRefactoringCommands(refactorings, fileName, formatSettings, textRange, result);
                return result;
            },
            getRefactorEdits(doc, args) {
                const { service } = updateCurrentVueTextDocument(doc);
                const response = service.getEditsForRefactor(args.fileName, args.formatOptions, args.textRange, args.refactorName, args.actionName, args.preferences);
                if (!response) {
                    // TODO: What happens when there's no response?
                    return {};
                }
                return { changes: createUriMappingForEdits(response.edits, service) };
            },
            format(doc, range, formatParams) {
                const { scriptDoc, service } = updateCurrentVueTextDocument(doc);
                const defaultFormatter = scriptDoc.languageId === 'javascript'
                    ? config.vetur.format.defaultFormatter.js
                    : config.vetur.format.defaultFormatter.ts;
                if (defaultFormatter === 'none') {
                    return [];
                }
                const parser = scriptDoc.languageId === 'javascript' ? 'babel' : 'typescript';
                const needInitialIndent = config.vetur.format.scriptInitialIndent;
                const vlsFormatConfig = config.vetur.format;
                if (defaultFormatter === 'prettier' ||
                    defaultFormatter === 'prettier-eslint' ||
                    defaultFormatter === 'prettier-tslint') {
                    const code = doc.getText(range);
                    const filePath = paths_1.getFileFsPath(scriptDoc.uri);
                    let doFormat;
                    if (defaultFormatter === 'prettier-eslint') {
                        doFormat = prettier_1.prettierEslintify;
                    }
                    else if (defaultFormatter === 'prettier-tslint') {
                        doFormat = prettier_1.prettierTslintify;
                    }
                    else {
                        doFormat = prettier_1.prettierify;
                    }
                    return doFormat(code, filePath, workspacePath, range, vlsFormatConfig, parser, needInitialIndent);
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
                jsDocuments.dispose();
            }
        };
    });
}
exports.getJavascriptMode = getJavascriptMode;
function collectRefactoringCommands(refactorings, fileName, formatSettings, textRange, result) {
    const actions = [];
    for (const refactoring of refactorings) {
        const refactorName = refactoring.name;
        if (refactoring.inlineable) {
            actions.push({
                fileName,
                formatOptions: formatSettings,
                textRange,
                refactorName,
                actionName: refactorName,
                preferences: {},
                description: refactoring.description
            });
        }
        else {
            actions.push(...refactoring.actions.map(action => ({
                fileName,
                formatOptions: formatSettings,
                textRange,
                refactorName,
                actionName: action.name,
                preferences: {},
                description: action.description
            })));
        }
    }
    for (const action of actions) {
        result.push({
            title: action.description,
            kind: vscode_languageserver_types_1.CodeActionKind.Refactor,
            command: {
                title: action.description,
                command: exports.APPLY_REFACTOR_COMMAND,
                arguments: [action]
            }
        });
    }
}
function collectQuickFixCommands(fixes, service, result) {
    for (const fix of fixes) {
        const uriTextEditMapping = createUriMappingForEdits(fix.changes, service);
        result.push(createApplyCodeAction(vscode_languageserver_types_1.CodeActionKind.QuickFix, fix.description, uriTextEditMapping));
    }
}
function createApplyCodeAction(kind, title, uriTextEditMapping) {
    return {
        title,
        kind,
        edit: {
            changes: uriTextEditMapping
        }
    };
}
function createUriMappingForEdits(changes, service) {
    const program = service.getProgram();
    const result = {};
    for (const { fileName, textChanges } of changes) {
        const targetDoc = getSourceDoc(fileName, program);
        const edits = textChanges.map(({ newText, span }) => ({
            newText,
            range: convertRange(targetDoc, span)
        }));
        const uri = vscode_uri_1.URI.file(fileName).toString();
        if (result[uri]) {
            result[uri].push(...edits);
        }
        else {
            result[uri] = edits;
        }
    }
    return result;
}
function getSourceDoc(fileName, program) {
    const sourceFile = program.getSourceFile(fileName);
    return vscode_languageserver_types_1.TextDocument.create(fileName, 'vue', 0, sourceFile.getFullText());
}
function languageServiceIncludesFile(ls, documentUri) {
    const filePaths = ls.getProgram().getRootFileNames();
    const filePath = paths_1.getFilePath(documentUri);
    return filePaths.includes(filePath);
}
exports.languageServiceIncludesFile = languageServiceIncludesFile;
function convertRange(document, span) {
    const startPosition = document.positionAt(span.start);
    const endPosition = document.positionAt(span.start + span.length);
    return vscode_languageserver_types_1.Range.create(startPosition, endPosition);
}
function convertOptions(formatSettings, options, initialIndentLevel) {
    return _.assign(formatSettings, {
        convertTabsToSpaces: options.insertSpaces,
        tabSize: options.tabSize,
        indentSize: options.tabSize,
        baseIndentSize: options.tabSize * initialIndentLevel
    });
}
function getFormatCodeSettings(config) {
    return {
        tabSize: config.vetur.format.options.tabSize,
        indentSize: config.vetur.format.options.tabSize,
        convertTabsToSpaces: !config.vetur.format.options.useTabs
    };
}
function convertCodeAction(doc, codeActions, regionStart) {
    const scriptStartOffset = doc.offsetAt(regionStart.refreshAndGet(doc).start);
    const textEdits = [];
    for (const action of codeActions) {
        for (const change of action.changes) {
            textEdits.push(...change.textChanges.map(tc => {
                // currently, only import codeAction is available
                // change start of doc to start of script region
                if (tc.span.start <= scriptStartOffset && tc.span.length === 0) {
                    const region = regionStart.refreshAndGet(doc);
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
function convertTSDiagnosticCategoryToDiagnosticSeverity(c) {
    switch (c) {
        case ts.DiagnosticCategory.Error:
            return vscode_languageserver_types_1.DiagnosticSeverity.Error;
        case ts.DiagnosticCategory.Warning:
            return vscode_languageserver_types_1.DiagnosticSeverity.Warning;
        case ts.DiagnosticCategory.Message:
            return vscode_languageserver_types_1.DiagnosticSeverity.Information;
        case ts.DiagnosticCategory.Suggestion:
            return vscode_languageserver_types_1.DiagnosticSeverity.Hint;
    }
}
/* tslint:disable:max-line-length */
/**
 * Adapted from https://github.com/microsoft/vscode/blob/2b090abd0fdab7b21a3eb74be13993ad61897f84/extensions/typescript-language-features/src/languageFeatures/completions.ts#L147-L181
 */
function getFilterText(insertText) {
    // For `this.` completions, generally don't set the filter text since we don't want them to be overly prioritized. #74164
    if (insertText === null || insertText === void 0 ? void 0 : insertText.startsWith('this.')) {
        return undefined;
    }
    // Handle the case:
    // ```
    // const xyz = { 'ab c': 1 };
    // xyz.ab|
    // ```
    // In which case we want to insert a bracket accessor but should use `.abc` as the filter text instead of
    // the bracketed insert text.
    else if (insertText === null || insertText === void 0 ? void 0 : insertText.startsWith('[')) {
        return insertText.replace(/^\[['"](.+)[['"]\]$/, '.$1');
    }
    // In all other cases, fallback to using the insertText
    return insertText;
}
function getFoldingRangeKind(span) {
    switch (span.kind) {
        case 'comment':
            return vscode_languageserver_types_1.FoldingRangeKind.Comment;
        case 'region':
            return vscode_languageserver_types_1.FoldingRangeKind.Region;
        case 'imports':
            return vscode_languageserver_types_1.FoldingRangeKind.Imports;
        case 'code':
        default:
            return undefined;
    }
}
//# sourceMappingURL=javascript.js.map