"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const vscode_uri_1 = require("vscode-uri");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const parseGitIgnore = require("parse-gitignore");
const preprocess_1 = require("./preprocess");
const paths_1 = require("../../utils/paths");
const bridge = require("./bridge");
// Patch typescript functions to insert `import Vue from 'vue'` and `new Vue` around export default.
// NOTE: this is a global hack that all ts instances after is changed
const { createLanguageServiceSourceFile, updateLanguageServiceSourceFile } = preprocess_1.createUpdater();
ts.createLanguageServiceSourceFile = createLanguageServiceSourceFile;
ts.updateLanguageServiceSourceFile = updateLanguageServiceSourceFile;
const vueSys = Object.assign({}, ts.sys, { fileExists(path) {
        if (isVueProject(path)) {
            return ts.sys.fileExists(path.slice(0, -3));
        }
        return ts.sys.fileExists(path);
    },
    readFile(path, encoding) {
        if (isVueProject(path)) {
            const fileText = ts.sys.readFile(path.slice(0, -3), encoding);
            return fileText ? preprocess_1.parseVue(fileText) : fileText;
        }
        else {
            const fileText = ts.sys.readFile(path, encoding);
            return fileText;
        }
    } });
if (ts.sys.realpath) {
    const realpath = ts.sys.realpath;
    vueSys.realpath = function (path) {
        if (isVueProject(path)) {
            return realpath(path.slice(0, -3)) + '.ts';
        }
        return realpath(path);
    };
}
const defaultCompilerOptions = {
    allowNonTsExtensions: true,
    allowJs: true,
    lib: ['lib.dom.d.ts', 'lib.es2017.d.ts'],
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.Preserve,
    allowSyntheticDefaultImports: true
};
function getServiceHost(workspacePath, jsDocuments) {
    let currentScriptDoc;
    const versions = new Map();
    const scriptDocs = new Map();
    const parsedConfig = getParsedConfig(workspacePath);
    const files = parsedConfig.fileNames;
    const isOldVersion = inferIsOldVersion(workspacePath);
    const compilerOptions = Object.assign({}, defaultCompilerOptions, parsedConfig.options);
    compilerOptions.allowNonTsExtensions = true;
    function updateCurrentTextDocument(doc) {
        const fileFsPath = paths_1.getFileFsPath(doc.uri);
        const filePath = paths_1.getFilePath(doc.uri);
        // When file is not in language service, add it
        if (!scriptDocs.has(fileFsPath)) {
            if (fileFsPath.endsWith('.vue')) {
                files.push(filePath);
            }
        }
        if (!currentScriptDoc || doc.uri !== currentScriptDoc.uri || doc.version !== currentScriptDoc.version) {
            currentScriptDoc = jsDocuments.get(doc);
            const lastDoc = scriptDocs.get(fileFsPath);
            if (lastDoc && currentScriptDoc.languageId !== lastDoc.languageId) {
                // if languageId changed, restart the language service; it can't handle file type changes
                jsLanguageService.dispose();
                jsLanguageService = ts.createLanguageService(host);
            }
            scriptDocs.set(fileFsPath, currentScriptDoc);
            versions.set(fileFsPath, (versions.get(fileFsPath) || 0) + 1);
        }
        return {
            service: jsLanguageService,
            scriptDoc: currentScriptDoc
        };
    }
    // External Documents: JS/TS, non Vue documents
    function updateExternalDocument(filePath) {
        const ver = versions.get(filePath) || 0;
        versions.set(filePath, ver + 1);
    }
    function getScriptDocByFsPath(fsPath) {
        return scriptDocs.get(fsPath);
    }
    const host = {
        getCompilationSettings: () => compilerOptions,
        getScriptFileNames: () => files,
        getScriptVersion(fileName) {
            if (fileName === bridge.fileName) {
                return '0';
            }
            const normalizedFileFsPath = getNormalizedFileFsPath(fileName);
            const version = versions.get(normalizedFileFsPath);
            return version ? version.toString() : '0';
        },
        getScriptKind(fileName) {
            if (preprocess_1.isVue(fileName)) {
                const uri = vscode_uri_1.default.file(fileName);
                fileName = uri.fsPath;
                const doc = scriptDocs.get(fileName) ||
                    jsDocuments.get(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, ts.sys.readFile(fileName) || ''));
                return getScriptKind(doc.languageId);
            }
            else {
                if (fileName === bridge.fileName) {
                    return ts.Extension.Ts;
                }
                // NOTE: Typescript 2.3 should export getScriptKindFromFileName. Then this cast should be removed.
                return ts.getScriptKindFromFileName(fileName);
            }
        },
        // resolve @types, see https://github.com/Microsoft/TypeScript/issues/16772
        getDirectories: vueSys.getDirectories,
        directoryExists: vueSys.directoryExists,
        fileExists: vueSys.fileExists,
        readFile: vueSys.readFile,
        readDirectory: vueSys.readDirectory,
        resolveModuleNames(moduleNames, containingFile) {
            // in the normal case, delegate to ts.resolveModuleName
            // in the relative-imported.vue case, manually build a resolved filename
            return moduleNames.map(name => {
                if (name === bridge.moduleName) {
                    return {
                        resolvedFileName: bridge.fileName,
                        extension: ts.Extension.Ts
                    };
                }
                if (path.isAbsolute(name) || !preprocess_1.isVue(name)) {
                    return ts.resolveModuleName(name, containingFile, compilerOptions, ts.sys).resolvedModule;
                }
                const resolved = ts.resolveModuleName(name, containingFile, compilerOptions, vueSys).resolvedModule;
                if (!resolved) {
                    return undefined;
                }
                if (!resolved.resolvedFileName.endsWith('.vue.ts')) {
                    return resolved;
                }
                const resolvedFileName = resolved.resolvedFileName.slice(0, -3);
                const uri = vscode_uri_1.default.file(resolvedFileName);
                const doc = scriptDocs.get(resolvedFileName) ||
                    jsDocuments.get(vscode_languageserver_types_1.TextDocument.create(uri.toString(), 'vue', 0, ts.sys.readFile(resolvedFileName) || ''));
                const extension = doc.languageId === 'typescript'
                    ? ts.Extension.Ts
                    : doc.languageId === 'tsx' ? ts.Extension.Tsx : ts.Extension.Js;
                return { resolvedFileName, extension };
            });
        },
        getScriptSnapshot: (fileName) => {
            if (fileName === bridge.fileName) {
                const text = isOldVersion ? bridge.oldContent : bridge.content;
                return {
                    getText: (start, end) => text.substring(start, end),
                    getLength: () => text.length,
                    getChangeRange: () => void 0
                };
            }
            const normalizedFileFsPath = getNormalizedFileFsPath(fileName);
            const doc = scriptDocs.get(normalizedFileFsPath);
            let fileText = doc ? doc.getText() : ts.sys.readFile(normalizedFileFsPath) || '';
            if (!doc && preprocess_1.isVue(fileName)) {
                // Note: This is required in addition to the parsing in embeddedSupport because
                // this works for .vue files that aren't even loaded by VS Code yet.
                fileText = preprocess_1.parseVue(fileText);
            }
            return {
                getText: (start, end) => fileText.substring(start, end),
                getLength: () => fileText.length,
                getChangeRange: () => void 0
            };
        },
        getCurrentDirectory: () => workspacePath,
        getDefaultLibFileName: ts.getDefaultLibFilePath,
        getNewLine: () => '\n'
    };
    let jsLanguageService = ts.createLanguageService(host);
    return {
        updateCurrentTextDocument,
        updateExternalDocument,
        getScriptDocByFsPath,
        dispose: () => {
            jsLanguageService.dispose();
        }
    };
}
exports.getServiceHost = getServiceHost;
function getNormalizedFileFsPath(fileName) {
    return vscode_uri_1.default.file(fileName).fsPath;
}
function isVueProject(path) {
    return path.endsWith('.vue.ts') && !path.includes('node_modules');
}
function defaultIgnorePatterns(workspacePath) {
    const nodeModules = ['node_modules', '**/node_modules/*'];
    const gitignore = ts.findConfigFile(workspacePath, ts.sys.fileExists, '.gitignore');
    if (!gitignore) {
        return nodeModules;
    }
    const parsed = parseGitIgnore(gitignore);
    const filtered = parsed.filter(s => !s.startsWith('!'));
    return nodeModules.concat(filtered);
}
function getScriptKind(langId) {
    return langId === 'typescript' ? ts.ScriptKind.TS : langId === 'tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.JS;
}
function inferIsOldVersion(workspacePath) {
    const packageJSONPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'package.json');
    try {
        const packageJSON = packageJSONPath && JSON.parse(ts.sys.readFile(packageJSONPath));
        const vueStr = packageJSON.dependencies.vue || packageJSON.devDependencies.vue;
        // use a sloppy method to infer version, to reduce dep on semver or so
        const vueDep = vueStr.match(/\d+\.\d+/)[0];
        const sloppyVersion = parseFloat(vueDep);
        return sloppyVersion < 2.5;
    }
    catch (e) {
        return true;
    }
}
function getParsedConfig(workspacePath) {
    const configFilename = ts.findConfigFile(workspacePath, ts.sys.fileExists, 'tsconfig.json') ||
        ts.findConfigFile(workspacePath, ts.sys.fileExists, 'jsconfig.json');
    const configJson = (configFilename && ts.readConfigFile(configFilename, ts.sys.readFile).config) || {
        exclude: defaultIgnorePatterns(workspacePath)
    };
    // existingOptions should be empty since it always takes priority
    return ts.parseJsonConfigFileContent(configJson, ts.sys, workspacePath, 
    /*existingOptions*/ {}, configFilename, 
    /*resolutionStack*/ undefined, [{ extension: 'vue', isMixedContent: true }]);
}
//# sourceMappingURL=serviceHost.js.map