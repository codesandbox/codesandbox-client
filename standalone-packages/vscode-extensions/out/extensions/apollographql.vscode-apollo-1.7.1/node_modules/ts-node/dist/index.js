"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var os_1 = require("os");
var sourceMapSupport = require("source-map-support");
var mkdirp = require("mkdirp");
var crypto = require("crypto");
var yn = require("yn");
var arrify = require("arrify");
var bufferFrom = require("buffer-from");
var make_error_1 = require("make-error");
var util = require("util");
/**
 * @internal
 */
exports.INSPECT_CUSTOM = util.inspect.custom || 'inspect';
/**
 * Debugging `ts-node`.
 */
var shouldDebug = yn(process.env.TS_NODE_DEBUG);
var debug = shouldDebug ? console.log.bind(console, 'ts-node') : function () { return undefined; };
var debugFn = shouldDebug ?
    function (key, fn) {
        return function (x) {
            debug(key, x);
            return fn(x);
        };
    } :
    function (_, fn) { return fn; };
/**
 * Export the current version.
 */
exports.VERSION = require('../package.json').version;
/**
 * Default register options.
 */
exports.DEFAULTS = {
    files: yn(process.env['TS_NODE_FILES']),
    cache: yn(process.env['TS_NODE_CACHE'], { default: true }),
    pretty: yn(process.env['TS_NODE_PRETTY']),
    cacheDirectory: process.env['TS_NODE_CACHE_DIRECTORY'],
    compiler: process.env['TS_NODE_COMPILER'],
    compilerOptions: parse(process.env['TS_NODE_COMPILER_OPTIONS']),
    ignore: split(process.env['TS_NODE_IGNORE']),
    project: process.env['TS_NODE_PROJECT'],
    skipIgnore: yn(process.env['TS_NODE_SKIP_IGNORE']),
    skipProject: yn(process.env['TS_NODE_SKIP_PROJECT']),
    ignoreDiagnostics: split(process.env['TS_NODE_IGNORE_DIAGNOSTICS']),
    typeCheck: yn(process.env['TS_NODE_TYPE_CHECK']),
    transpileOnly: yn(process.env['TS_NODE_TRANSPILE_ONLY'])
};
/**
 * Default TypeScript compiler options required by `ts-node`.
 */
var DEFAULT_COMPILER_OPTIONS = {
    sourceMap: true,
    inlineSourceMap: false,
    inlineSources: true,
    declaration: false,
    noEmit: false,
    outDir: '$$ts-node$$'
};
/**
 * Split a string array of values.
 */
function split(value) {
    return typeof value === 'string' ? value.split(/ *, */g) : undefined;
}
exports.split = split;
/**
 * Parse a string as JSON.
 */
function parse(value) {
    return typeof value === 'string' ? JSON.parse(value) : undefined;
}
exports.parse = parse;
/**
 * Replace backslashes with forward slashes.
 */
function normalizeSlashes(value) {
    return value.replace(/\\/g, '/');
}
exports.normalizeSlashes = normalizeSlashes;
/**
 * TypeScript diagnostics error.
 */
var TSError = /** @class */ (function (_super) {
    __extends(TSError, _super);
    function TSError(diagnosticText, diagnosticCodes) {
        var _this = _super.call(this, "\u2A2F Unable to compile TypeScript:\n" + diagnosticText) || this;
        _this.diagnosticText = diagnosticText;
        _this.diagnosticCodes = diagnosticCodes;
        _this.name = 'TSError';
        return _this;
    }
    /**
     * @internal
     */
    TSError.prototype[exports.INSPECT_CUSTOM] = function () {
        return this.diagnosticText;
    };
    return TSError;
}(make_error_1.BaseError));
exports.TSError = TSError;
/**
 * Return a default temp directory based on home directory of user.
 */
function getTmpDir() {
    var hash = crypto.createHash('sha256').update(os_1.homedir(), 'utf8').digest('hex');
    return path_1.join(os_1.tmpdir(), "ts-node-" + hash);
}
/**
 * Register TypeScript compiler.
 */
function register(opts) {
    if (opts === void 0) { opts = {}; }
    var options = Object.assign({}, exports.DEFAULTS, opts);
    var cacheDirectory = options.cacheDirectory || getTmpDir();
    var originalJsHandler = require.extensions['.js'];
    var ignoreDiagnostics = arrify(options.ignoreDiagnostics).concat([
        6059,
        18002,
        18003 // "No inputs were found in config file."
    ]).map(Number);
    var memoryCache = {
        contents: Object.create(null),
        versions: Object.create(null),
        outputs: Object.create(null)
    };
    var ignore = options.skipIgnore ? [] : arrify(options.ignore || '/node_modules/').map(function (str) { return new RegExp(str); });
    // Install source map support and read from memory cache.
    sourceMapSupport.install({
        environment: 'node',
        retrieveFile: function (path) {
            return memoryCache.outputs[path];
        }
    });
    // Require the TypeScript compiler and configuration.
    var cwd = process.cwd();
    var compilerOptions = options.compilerOptions, project = options.project, skipProject = options.skipProject;
    var compiler = options.compiler || 'typescript';
    var typeCheck = options.typeCheck === true || options.transpileOnly !== true;
    var ts = require(compiler);
    var transformers = options.transformers || undefined;
    var readFile = options.readFile || ts.sys.readFile;
    var fileExists = options.fileExists || ts.sys.fileExists;
    var config = readConfig(cwd, ts, fileExists, readFile, compilerOptions, project, skipProject);
    var configDiagnosticList = filterDiagnostics(config.errors, ignoreDiagnostics);
    var extensions = ['.ts', '.tsx'];
    var fileNames = options.files ? config.fileNames : [];
    var cachedir = path_1.join(path_1.resolve(cwd, cacheDirectory), getCompilerDigest({
        version: ts.version,
        options: config.options,
        fileNames: fileNames,
        typeCheck: typeCheck,
        ignoreDiagnostics: ignoreDiagnostics,
        compiler: compiler
    }));
    var diagnosticHost = {
        getNewLine: function () { return os_1.EOL; },
        getCurrentDirectory: function () { return cwd; },
        getCanonicalFileName: function (path) { return path; }
    };
    var formatDiagnostics = options.pretty
        ? ts.formatDiagnosticsWithColorAndContext
        : ts.formatDiagnostics;
    function createTSError(diagnostics) {
        var diagnosticText = formatDiagnostics(diagnostics, diagnosticHost);
        var diagnosticCodes = diagnostics.map(function (x) { return x.code; });
        return new TSError(diagnosticText, diagnosticCodes);
    }
    // Render the configuration errors and exit the script.
    if (configDiagnosticList.length)
        throw createTSError(configDiagnosticList);
    // Enable `allowJs` when flag is set.
    if (config.options.allowJs) {
        extensions.push('.js');
        extensions.push('.jsx');
    }
    // Initialize files from TypeScript into project.
    for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
        var path = fileNames_1[_i];
        memoryCache.versions[path] = 1;
    }
    /**
     * Get the extension for a transpiled file.
     */
    var getExtension = config.options.jsx === ts.JsxEmit.Preserve ?
        (function (path) { return /\.[tj]sx$/.test(path) ? '.jsx' : '.js'; }) :
        (function (_) { return '.js'; });
    /**
     * Create the basic required function using transpile mode.
     */
    var getOutput = function (code, fileName, lineOffset) {
        if (lineOffset === void 0) { lineOffset = 0; }
        var result = ts.transpileModule(code, {
            fileName: fileName,
            transformers: transformers,
            compilerOptions: config.options,
            reportDiagnostics: true
        });
        var diagnosticList = result.diagnostics ?
            filterDiagnostics(result.diagnostics, ignoreDiagnostics) :
            [];
        if (diagnosticList.length)
            throw createTSError(diagnosticList);
        return [result.outputText, result.sourceMapText];
    };
    var getTypeInfo = function (_code, _fileName, _position) {
        throw new TypeError("Type information is unavailable without \"--type-check\"");
    };
    // Use full language services when the fast option is disabled.
    if (typeCheck) {
        // Set the file contents into cache.
        var updateMemoryCache_1 = function (code, fileName) {
            if (memoryCache.contents[fileName] !== code) {
                memoryCache.contents[fileName] = code;
                memoryCache.versions[fileName] = (memoryCache.versions[fileName] || 0) + 1;
            }
        };
        // Create the compiler host for type checking.
        var serviceHost = {
            getScriptFileNames: function () { return Object.keys(memoryCache.versions); },
            getScriptVersion: function (fileName) {
                var version = memoryCache.versions[fileName];
                // We need to return `undefined` and not a string here because TypeScript will use
                // `getScriptVersion` and compare against their own version - which can be `undefined`.
                // If we don't return `undefined` it results in `undefined === "undefined"` and run
                // `createProgram` again (which is very slow). Using a `string` assertion here to avoid
                // TypeScript errors from the function signature (expects `(x: string) => string`).
                return version === undefined ? undefined : String(version);
            },
            getScriptSnapshot: function (fileName) {
                // Read contents into TypeScript memory cache.
                if (!Object.prototype.hasOwnProperty.call(memoryCache.contents, fileName)) {
                    memoryCache.contents[fileName] = readFile(fileName);
                }
                var contents = memoryCache.contents[fileName];
                if (contents === undefined)
                    return;
                return ts.ScriptSnapshot.fromString(contents);
            },
            fileExists: debugFn('fileExists', fileExists),
            readFile: debugFn('readFile', readFile),
            readDirectory: debugFn('readDirectory', ts.sys.readDirectory),
            getDirectories: debugFn('getDirectories', ts.sys.getDirectories),
            directoryExists: debugFn('directoryExists', ts.sys.directoryExists),
            getNewLine: function () { return os_1.EOL; },
            getCurrentDirectory: function () { return cwd; },
            getCompilationSettings: function () { return config.options; },
            getDefaultLibFileName: function () { return ts.getDefaultLibFilePath(config.options); },
            getCustomTransformers: function () { return transformers; }
        };
        var service_1 = ts.createLanguageService(serviceHost);
        getOutput = function (code, fileName, lineOffset) {
            if (lineOffset === void 0) { lineOffset = 0; }
            // Must set memory cache before attempting to read file.
            updateMemoryCache_1(code, fileName);
            var output = service_1.getEmitOutput(fileName);
            // Get the relevant diagnostics - this is 3x faster than `getPreEmitDiagnostics`.
            var diagnostics = service_1.getCompilerOptionsDiagnostics()
                .concat(service_1.getSyntacticDiagnostics(fileName))
                .concat(service_1.getSemanticDiagnostics(fileName));
            var diagnosticList = filterDiagnostics(diagnostics, ignoreDiagnostics);
            if (diagnosticList.length)
                throw createTSError(diagnosticList);
            if (output.emitSkipped) {
                throw new TypeError(path_1.relative(cwd, fileName) + ": Emit skipped");
            }
            // Throw an error when requiring `.d.ts` files.
            if (output.outputFiles.length === 0) {
                throw new TypeError('Unable to require `.d.ts` file.\n' +
                    'This is usually the result of a faulty configuration or import. ' +
                    'Make sure there is a `.js`, `.json` or another executable extension and ' +
                    'loader (attached before `ts-node`) available alongside ' +
                    ("`" + path_1.basename(fileName) + "`."));
            }
            return [output.outputFiles[1].text, output.outputFiles[0].text];
        };
        getTypeInfo = function (code, fileName, position) {
            updateMemoryCache_1(code, fileName);
            var info = service_1.getQuickInfoAtPosition(fileName, position);
            var name = ts.displayPartsToString(info ? info.displayParts : []);
            var comment = ts.displayPartsToString(info ? info.documentation : []);
            return { name: name, comment: comment };
        };
    }
    var compile = readThrough(cachedir, options.cache === true, memoryCache, getOutput, getExtension);
    var register = { cwd: cwd, compile: compile, getTypeInfo: getTypeInfo, extensions: extensions, cachedir: cachedir, ts: ts };
    // Register the extensions.
    extensions.forEach(function (extension) {
        registerExtension(extension, ignore, register, originalJsHandler);
    });
    return register;
}
exports.register = register;
/**
 * Check if the filename should be ignored.
 */
function shouldIgnore(filename, ignore) {
    var relname = normalizeSlashes(filename);
    return ignore.some(function (x) { return x.test(relname); });
}
/**
 * Register the extension for node.
 */
function registerExtension(ext, ignore, register, originalHandler) {
    var old = require.extensions[ext] || originalHandler;
    require.extensions[ext] = function (m, filename) {
        if (shouldIgnore(filename, ignore)) {
            return old(m, filename);
        }
        var _compile = m._compile;
        m._compile = function (code, fileName) {
            debug('module._compile', fileName);
            return _compile.call(this, register.compile(code, fileName), fileName);
        };
        return old(m, filename);
    };
}
/**
 * Do post-processing on config options to support `ts-node`.
 */
function fixConfig(ts, config) {
    // Delete options that *should not* be passed through.
    delete config.options.out;
    delete config.options.outFile;
    delete config.options.composite;
    delete config.options.declarationDir;
    delete config.options.declarationMap;
    delete config.options.emitDeclarationOnly;
    // Target ES5 output by default (instead of ES3).
    if (config.options.target === undefined) {
        config.options.target = ts.ScriptTarget.ES5;
    }
    // Target CommonJS modules by default (instead of magically switching to ES6 when the target is ES6).
    if (config.options.module === undefined) {
        config.options.module = ts.ModuleKind.CommonJS;
    }
    return config;
}
/**
 * Load TypeScript configuration.
 */
function readConfig(cwd, ts, fileExists, readFile, compilerOptions, project, noProject) {
    var config = { compilerOptions: {} };
    var basePath = normalizeSlashes(cwd);
    var configFileName = undefined;
    // Read project configuration when available.
    if (!noProject) {
        configFileName = project
            ? normalizeSlashes(path_1.resolve(cwd, project))
            : ts.findConfigFile(normalizeSlashes(cwd), fileExists);
        if (configFileName) {
            var result = ts.readConfigFile(configFileName, readFile);
            // Return diagnostics.
            if (result.error) {
                return { errors: [result.error], fileNames: [], options: {} };
            }
            config = result.config;
            basePath = normalizeSlashes(path_1.dirname(configFileName));
        }
    }
    // Override default configuration options `ts-node` requires.
    config.compilerOptions = Object.assign({}, config.compilerOptions, compilerOptions, DEFAULT_COMPILER_OPTIONS);
    return fixConfig(ts, ts.parseJsonConfigFileContent(config, ts.sys, basePath, undefined, configFileName));
}
/**
 * Wrap the function with caching.
 */
function readThrough(cachedir, shouldCache, memoryCache, compile, getExtension) {
    if (shouldCache === false) {
        return function (code, fileName, lineOffset) {
            debug('readThrough', fileName);
            var _a = compile(code, fileName, lineOffset), value = _a[0], sourceMap = _a[1];
            var output = updateOutput(value, fileName, sourceMap, getExtension);
            memoryCache.outputs[fileName] = output;
            return output;
        };
    }
    // Make sure the cache directory exists before continuing.
    mkdirp.sync(cachedir);
    return function (code, fileName, lineOffset) {
        debug('readThrough', fileName);
        var cachePath = path_1.join(cachedir, getCacheName(code, fileName));
        var extension = getExtension(fileName);
        var outputPath = "" + cachePath + extension;
        try {
            var output_1 = fs_1.readFileSync(outputPath, 'utf8');
            if (isValidCacheContent(output_1)) {
                memoryCache.outputs[fileName] = output_1;
                return output_1;
            }
        }
        catch (err) { /* Ignore. */ }
        var _a = compile(code, fileName, lineOffset), value = _a[0], sourceMap = _a[1];
        var output = updateOutput(value, fileName, sourceMap, getExtension);
        memoryCache.outputs[fileName] = output;
        fs_1.writeFileSync(outputPath, output);
        return output;
    };
}
/**
 * Update the output remapping the source map.
 */
function updateOutput(outputText, fileName, sourceMap, getExtension) {
    var base64Map = bufferFrom(updateSourceMap(sourceMap, fileName), 'utf8').toString('base64');
    var sourceMapContent = "data:application/json;charset=utf-8;base64," + base64Map;
    var sourceMapLength = (path_1.basename(fileName) + ".map").length + (getExtension(fileName).length - path_1.extname(fileName).length);
    return outputText.slice(0, -sourceMapLength) + sourceMapContent;
}
/**
 * Update the source map contents for improved output.
 */
function updateSourceMap(sourceMapText, fileName) {
    var sourceMap = JSON.parse(sourceMapText);
    sourceMap.file = fileName;
    sourceMap.sources = [fileName];
    delete sourceMap.sourceRoot;
    return JSON.stringify(sourceMap);
}
/**
 * Get the file name for the cache entry.
 */
function getCacheName(sourceCode, fileName) {
    return crypto.createHash('sha256')
        .update(path_1.extname(fileName), 'utf8')
        .update('\x00', 'utf8')
        .update(sourceCode, 'utf8')
        .digest('hex');
}
/**
 * Ensure the given cached content is valid by sniffing for a base64 encoded '}'
 * at the end of the content, which should exist if there is a valid sourceMap present.
 */
function isValidCacheContent(contents) {
    return /(?:9|0=|Q==)$/.test(contents.slice(-3));
}
/**
 * Create a hash of the current configuration.
 */
function getCompilerDigest(obj) {
    return crypto.createHash('sha256').update(JSON.stringify(obj), 'utf8').digest('hex');
}
/**
 * Filter diagnostics.
 */
function filterDiagnostics(diagnostics, ignore) {
    return diagnostics.filter(function (x) { return ignore.indexOf(x.code) === -1; });
}
//# sourceMappingURL=index.js.map