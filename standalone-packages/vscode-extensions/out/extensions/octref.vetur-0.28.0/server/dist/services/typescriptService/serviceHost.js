"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceHost = exports.templateSourceMap = void 0;
const path = require("path");
const ts = require("typescript");
const vscode_uri_1 = require("vscode-uri");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const parseGitIgnore = require("parse-gitignore");
const preprocess_1 = require("./preprocess");
const paths_1 = require("../../utils/paths");
const bridge = require("./bridge");
const vueSys_1 = require("./vueSys");
const sourceMap_1 = require("./sourceMap");
const util_1 = require("./util");
const log_1 = require("../../log");
const moduleResolutionCache_1 = require("./moduleResolutionCache");
const transformTemplate_1 = require("./transformTemplate");
const vueVersion_1 = require("./vueVersion");
const NEWLINE = process.platform === 'win32' ? '\r\n' : '\n';
/**
 * For prop validation
 */
const allChildComponentsInfo = new Map();
function patchTS(tsModule) {
    // Patch typescript functions to insert `import Vue from 'vue'` and `new Vue` around export default.
    // NOTE: this is a global hack that all ts instances after is changed
    const { createLanguageServiceSourceFile, updateLanguageServiceSourceFile } = preprocess_1.createUpdater(tsModule, allChildComponentsInfo);
    tsModule.createLanguageServiceSourceFile = createLanguageServiceSourceFile;
    tsModule.updateLanguageServiceSourceFile = updateLanguageServiceSourceFile;
}
function getDefaultCompilerOptions(tsModule) {
    const defaultCompilerOptions = {
        allowNonTsExtensions: true,
        allowJs: true,
        lib: ['lib.dom.d.ts', 'lib.es2017.d.ts'],
        target: tsModule.ScriptTarget.Latest,
        moduleResolution: tsModule.ModuleResolutionKind.NodeJs,
        module: tsModule.ModuleKind.CommonJS,
        jsx: tsModule.JsxEmit.Preserve,
        allowSyntheticDefaultImports: true,
        experimentalDecorators: true
    };
    return defaultCompilerOptions;
}
exports.templateSourceMap = {};
/**
 * Manges 4 set of files
 *
 * - `vue` files in workspace
 * - `js/ts` files in workspace
 * - `vue` files in `node_modules`
 * - `js/ts` files in `node_modules`
 */
function getServiceHost(tsModule, workspacePath, updatedScriptRegionDocuments) {
    patchTS(tsModule);
    let currentScriptDoc;
    const versions = new Map();
    const localScriptRegionDocuments = new Map();
    const nodeModuleSnapshots = new Map();
    const projectFileSnapshots = new Map();
    const moduleResolutionCache = new moduleResolutionCache_1.ModuleResolutionCache();
    const parsedConfig = getParsedConfig(tsModule, workspacePath);
    /**
     * Only js/ts files in local project
     */
    const initialProjectFiles = parsedConfig.fileNames;
    log_1.logger.logDebug(`Initializing ServiceHost with ${initialProjectFiles.length} files: ${JSON.stringify(initialProjectFiles)}`);
    const scriptFileNameSet = new Set(initialProjectFiles);
    const vueSys = vueSys_1.getVueSys(tsModule, scriptFileNameSet);
    const vueVersion = vueVersion_1.inferVueVersion(tsModule, workspacePath);
    const compilerOptions = Object.assign(Object.assign({}, getDefaultCompilerOptions(tsModule)), parsedConfig.options);
    compilerOptions.allowNonTsExtensions = true;
    function queryVirtualFileInfo(fileName, currFileText) {
        const program = templateLanguageService.getProgram();
        if (program) {
            const tsVirtualFile = program.getSourceFile(fileName + '.template');
            if (tsVirtualFile) {
                return {
                    source: tsVirtualFile.getText(),
                    sourceMapNodesString: sourceMap_1.stringifySourceMapNodes(exports.templateSourceMap[fileName], currFileText, tsVirtualFile.getText())
                };
            }
        }
        return {
            source: '',
            sourceMapNodesString: ''
        };
    }
    function updateCurrentVirtualVueTextDocument(doc, childComponents) {
        const fileFsPath = paths_1.getFileFsPath(doc.uri);
        const filePath = paths_1.getFilePath(doc.uri);
        // When file is not in language service, add it
        if (!localScriptRegionDocuments.has(fileFsPath)) {
            if (fileFsPath.endsWith('.vue') || fileFsPath.endsWith('.vue.template')) {
                scriptFileNameSet.add(filePath);
            }
        }
        if (util_1.isVirtualVueTemplateFile(fileFsPath)) {
            localScriptRegionDocuments.set(fileFsPath, doc);
            scriptFileNameSet.add(filePath);
            if (childComponents) {
                allChildComponentsInfo.set(filePath, childComponents);
            }
            versions.set(fileFsPath, (versions.get(fileFsPath) || 0) + 1);
        }
        return {
            templateService: templateLanguageService,
            templateSourceMap: exports.templateSourceMap
        };
    }
    function updateCurrentVueTextDocument(doc) {
        const fileFsPath = paths_1.getFileFsPath(doc.uri);
        const filePath = paths_1.getFilePath(doc.uri);
        // When file is not in language service, add it
        if (!localScriptRegionDocuments.has(fileFsPath)) {
            if (fileFsPath.endsWith('.vue') || fileFsPath.endsWith('.vue.template')) {
                scriptFileNameSet.add(filePath);
            }
        }
        if (!currentScriptDoc || doc.uri !== currentScriptDoc.uri || doc.version !== currentScriptDoc.version) {
            currentScriptDoc = updatedScriptRegionDocuments.refreshAndGet(doc);
            const localLastDoc = localScriptRegionDocuments.get(fileFsPath);
            if (localLastDoc && currentScriptDoc.languageId !== localLastDoc.languageId) {
                // if languageId changed, restart the language service; it can't handle file type changes
                jsLanguageService.dispose();
                jsLanguageService = tsModule.createLanguageService(jsHost);
            }
            localScriptRegionDocuments.set(fileFsPath, currentScriptDoc);
            scriptFileNameSet.add(filePath);
            versions.set(fileFsPath, (versions.get(fileFsPath) || 0) + 1);
        }
        return {
            service: jsLanguageService,
            scriptDoc: currentScriptDoc
        };
    }
    // External Documents: JS/TS, non Vue documents
    function updateExternalDocument(fileFsPath) {
        const ver = versions.get(fileFsPath) || 0;
        versions.set(fileFsPath, ver + 1);
        // Clear cache so we read the js/ts file from file system again
        if (projectFileSnapshots.has(fileFsPath)) {
            projectFileSnapshots.delete(fileFsPath);
        }
    }
    function createLanguageServiceHost(options) {
        return {
            getCompilationSettings: () => options,
            getScriptFileNames: () => Array.from(scriptFileNameSet),
            getScriptVersion(fileName) {
                if (fileName.includes('node_modules')) {
                    return '0';
                }
                if (fileName === bridge.fileName) {
                    return '0';
                }
                const normalizedFileFsPath = paths_1.normalizeFileNameToFsPath(fileName);
                const version = versions.get(normalizedFileFsPath);
                return version ? version.toString() : '0';
            },
            getScriptKind(fileName) {
                if (fileName.includes('node_modules')) {
                    return tsModule.getScriptKindFromFileName(fileName);
                }
                if (util_1.isVueFile(fileName)) {
                    const uri = vscode_uri_1.URI.file(fileName);
                    const fileFsPath = paths_1.normalizeFileNameToFsPath(fileName);
                    let doc = localScriptRegionDocuments.get(fileFsPath);
                    if (!doc) {
                        doc = updatedScriptRegionDocuments.refreshAndGet(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, tsModule.sys.readFile(fileName) || ''));
                        localScriptRegionDocuments.set(fileFsPath, doc);
                        scriptFileNameSet.add(fileName);
                    }
                    return getScriptKind(tsModule, doc.languageId);
                }
                else if (util_1.isVirtualVueTemplateFile(fileName)) {
                    return tsModule.ScriptKind.JS;
                }
                else {
                    if (fileName === bridge.fileName) {
                        return tsModule.ScriptKind.TS;
                    }
                    // NOTE: Typescript 2.3 should export getScriptKindFromFileName. Then this cast should be removed.
                    return tsModule.getScriptKindFromFileName(fileName);
                }
            },
            getDirectories: vueSys.getDirectories,
            directoryExists: vueSys.directoryExists,
            fileExists: vueSys.fileExists,
            readFile: vueSys.readFile,
            readDirectory(path, extensions, exclude, include, depth) {
                const allExtensions = extensions ? extensions.concat(['.vue']) : extensions;
                return vueSys.readDirectory(path, allExtensions, exclude, include, depth);
            },
            resolveModuleNames(moduleNames, containingFile) {
                // in the normal case, delegate to ts.resolveModuleName
                // in the relative-imported.vue case, manually build a resolved filename
                const result = moduleNames.map(name => {
                    if (name === bridge.moduleName) {
                        return {
                            resolvedFileName: bridge.fileName,
                            extension: tsModule.Extension.Ts
                        };
                    }
                    const cachedResolvedModule = moduleResolutionCache.getCache(name, containingFile);
                    if (cachedResolvedModule) {
                        return cachedResolvedModule;
                    }
                    if (path.isAbsolute(name) || !util_1.isVueFile(name)) {
                        const tsResolvedModule = tsModule.resolveModuleName(name, containingFile, options, tsModule.sys)
                            .resolvedModule;
                        if (tsResolvedModule) {
                            moduleResolutionCache.setCache(name, containingFile, tsResolvedModule);
                        }
                        return tsResolvedModule;
                    }
                    const tsResolvedModule = tsModule.resolveModuleName(name, containingFile, options, vueSys).resolvedModule;
                    if (!tsResolvedModule) {
                        return undefined;
                    }
                    if (tsResolvedModule.resolvedFileName.endsWith('.vue.ts')) {
                        const resolvedFileName = tsResolvedModule.resolvedFileName.slice(0, -'.ts'.length);
                        const uri = vscode_uri_1.URI.file(resolvedFileName);
                        const resolvedFileFsPath = paths_1.normalizeFileNameToFsPath(resolvedFileName);
                        let doc = localScriptRegionDocuments.get(resolvedFileFsPath);
                        // Vue file not created yet
                        if (!doc) {
                            doc = updatedScriptRegionDocuments.refreshAndGet(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, tsModule.sys.readFile(resolvedFileName) || ''));
                            localScriptRegionDocuments.set(resolvedFileFsPath, doc);
                            scriptFileNameSet.add(resolvedFileName);
                        }
                        const extension = doc.languageId === 'typescript'
                            ? tsModule.Extension.Ts
                            : doc.languageId === 'tsx'
                                ? tsModule.Extension.Tsx
                                : tsModule.Extension.Js;
                        const tsResolvedVueModule = { resolvedFileName, extension };
                        moduleResolutionCache.setCache(name, containingFile, tsResolvedVueModule);
                        return tsResolvedVueModule;
                    }
                    else {
                        moduleResolutionCache.setCache(name, containingFile, tsResolvedModule);
                        return tsResolvedModule;
                    }
                });
                return result;
            },
            getScriptSnapshot: (fileName) => {
                if (fileName.includes('node_modules')) {
                    if (nodeModuleSnapshots.has(fileName)) {
                        return nodeModuleSnapshots.get(fileName);
                    }
                    const fileText = tsModule.sys.readFile(fileName) || '';
                    const snapshot = {
                        getText: (start, end) => fileText.substring(start, end),
                        getLength: () => fileText.length,
                        getChangeRange: () => void 0
                    };
                    nodeModuleSnapshots.set(fileName, snapshot);
                    return snapshot;
                }
                if (fileName === bridge.fileName) {
                    const text = vueVersion === vueVersion_1.VueVersion.VPre25
                        ? bridge.preVue25Content
                        : vueVersion === vueVersion_1.VueVersion.V25
                            ? bridge.vue25Content
                            : bridge.vue30Content;
                    return {
                        getText: (start, end) => text.substring(start, end),
                        getLength: () => text.length,
                        getChangeRange: () => void 0
                    };
                }
                const fileFsPath = paths_1.normalizeFileNameToFsPath(fileName);
                // .vue.template files are handled in pre-process phase
                if (util_1.isVirtualVueTemplateFile(fileFsPath)) {
                    const doc = localScriptRegionDocuments.get(fileFsPath);
                    const fileText = doc ? doc.getText() : '';
                    return {
                        getText: (start, end) => fileText.substring(start, end),
                        getLength: () => fileText.length,
                        getChangeRange: () => void 0
                    };
                }
                // js/ts files in workspace
                if (!util_1.isVueFile(fileFsPath)) {
                    if (projectFileSnapshots.has(fileFsPath)) {
                        return projectFileSnapshots.get(fileFsPath);
                    }
                    const fileText = tsModule.sys.readFile(fileFsPath) || '';
                    const snapshot = {
                        getText: (start, end) => fileText.substring(start, end),
                        getLength: () => fileText.length,
                        getChangeRange: () => void 0
                    };
                    projectFileSnapshots.set(fileFsPath, snapshot);
                    return snapshot;
                }
                // vue files in workspace
                const doc = localScriptRegionDocuments.get(fileFsPath);
                let fileText = '';
                if (doc) {
                    fileText = doc.getText();
                }
                else {
                    // Note: This is required in addition to the parsing in embeddedSupport because
                    // this works for .vue files that aren't even loaded by VS Code yet.
                    const rawVueFileText = tsModule.sys.readFile(fileFsPath) || '';
                    fileText = preprocess_1.parseVueScript(rawVueFileText);
                }
                return {
                    getText: (start, end) => fileText.substring(start, end),
                    getLength: () => fileText.length,
                    getChangeRange: () => void 0
                };
            },
            getCurrentDirectory: () => workspacePath,
            getDefaultLibFileName: tsModule.getDefaultLibFilePath,
            getNewLine: () => NEWLINE,
            useCaseSensitiveFileNames: () => true
        };
    }
    const jsHost = createLanguageServiceHost(compilerOptions);
    const templateHost = createLanguageServiceHost(Object.assign(Object.assign({}, compilerOptions), { noUnusedLocals: false, noUnusedParameters: false, allowJs: true, checkJs: true }));
    const registry = tsModule.createDocumentRegistry(true);
    let jsLanguageService = tsModule.createLanguageService(jsHost, registry);
    const templateLanguageService = patchTemplateService(tsModule.createLanguageService(templateHost, registry));
    return {
        queryVirtualFileInfo,
        updateCurrentVirtualVueTextDocument,
        updateCurrentVueTextDocument,
        updateExternalDocument,
        dispose: () => {
            jsLanguageService.dispose();
        }
    };
}
exports.getServiceHost = getServiceHost;
function patchTemplateService(original) {
    const allowedGlobals = new Set(transformTemplate_1.globalScope);
    return Object.assign(Object.assign({}, original), { getCompletionsAtPosition(fileName, position, options) {
            const result = original.getCompletionsAtPosition(fileName, position, options);
            if (!result) {
                return;
            }
            if (result.isMemberCompletion) {
                return result;
            }
            return Object.assign(Object.assign({}, result), { entries: result.entries.filter(entry => {
                    return allowedGlobals.has(entry.name);
                }) });
        } });
}
function defaultIgnorePatterns(tsModule, workspacePath) {
    const nodeModules = ['node_modules', '**/node_modules/*'];
    const gitignore = tsModule.findConfigFile(workspacePath, tsModule.sys.fileExists, '.gitignore');
    if (!gitignore) {
        return nodeModules;
    }
    const parsed = parseGitIgnore(gitignore);
    const filtered = parsed.filter(s => !s.startsWith('!'));
    return nodeModules.concat(filtered);
}
function getScriptKind(tsModule, langId) {
    return langId === 'typescript'
        ? tsModule.ScriptKind.TS
        : langId === 'tsx'
            ? tsModule.ScriptKind.TSX
            : tsModule.ScriptKind.JS;
}
function getParsedConfig(tsModule, workspacePath) {
    const configFilename = tsModule.findConfigFile(workspacePath, tsModule.sys.fileExists, 'tsconfig.json') ||
        tsModule.findConfigFile(workspacePath, tsModule.sys.fileExists, 'jsconfig.json');
    const configJson = (configFilename && tsModule.readConfigFile(configFilename, tsModule.sys.readFile).config) || {
        exclude: defaultIgnorePatterns(tsModule, workspacePath)
    };
    // existingOptions should be empty since it always takes priority
    return tsModule.parseJsonConfigFileContent(configJson, tsModule.sys, workspacePath, 
    /*existingOptions*/ {}, configFilename, 
    /*resolutionStack*/ undefined, [
        {
            extension: 'vue',
            isMixedContent: true,
            // Note: in order for parsed config to include *.vue files, scriptKind must be set to Deferred.
            // tslint:disable-next-line max-line-length
            // See: https://github.com/microsoft/TypeScript/blob/2106b07f22d6d8f2affe34b9869767fa5bc7a4d9/src/compiler/utilities.ts#L6356
            scriptKind: ts.ScriptKind.Deferred
        }
    ]);
}
//# sourceMappingURL=serviceHost.js.map