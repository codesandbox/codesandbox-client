#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var repl_1 = require("repl");
var util_1 = require("util");
var arrify = require("arrify");
var Module = require("module");
var minimist = require("minimist");
var diff_1 = require("diff");
var vm_1 = require("vm");
var fs_1 = require("fs");
var index_1 = require("./index");
var argv = minimist(process.argv.slice(2), {
    stopEarly: true,
    string: ['eval', 'print', 'compiler', 'project', 'ignoreDiagnostics', 'require', 'cacheDirectory', 'ignore'],
    boolean: ['help', 'transpileOnly', 'typeCheck', 'version', 'files', 'cache', 'pretty', 'skipProject', 'skipIgnore'],
    alias: {
        eval: ['e'],
        print: ['p'],
        require: ['r'],
        help: ['h'],
        version: ['v'],
        typeCheck: ['type-check'],
        transpileOnly: ['T', 'transpile-only'],
        cacheDirectory: ['cache-directory'],
        ignore: ['I'],
        project: ['P'],
        skipIgnore: ['skip-ignore'],
        skipProject: ['skip-project'],
        compiler: ['C'],
        ignoreDiagnostics: ['D', 'ignore-diagnostics'],
        compilerOptions: ['O', 'compiler-options']
    },
    default: {
        cache: index_1.DEFAULTS.cache,
        files: index_1.DEFAULTS.files,
        pretty: index_1.DEFAULTS.pretty,
        typeCheck: index_1.DEFAULTS.typeCheck,
        transpileOnly: index_1.DEFAULTS.transpileOnly,
        cacheDirectory: index_1.DEFAULTS.cacheDirectory,
        ignore: index_1.DEFAULTS.ignore,
        project: index_1.DEFAULTS.project,
        skipIgnore: index_1.DEFAULTS.skipIgnore,
        skipProject: index_1.DEFAULTS.skipProject,
        compiler: index_1.DEFAULTS.compiler,
        ignoreDiagnostics: index_1.DEFAULTS.ignoreDiagnostics
    }
});
if (argv.help) {
    console.log("\nUsage: ts-node [options] [ -e script | script.ts ] [arguments]\n\nOptions:\n\n  -e, --eval [code]              Evaluate code\n  -p, --print [code]             Evaluate code and print result\n  -r, --require [path]           Require a node module before execution\n\n  -h, --help                     Print CLI usage\n  -v, --version                  Print module version information\n\n  -T, --transpile-only           Use TypeScript's faster `transpileModule`\n  --cache-directory              Configure the output file cache directory\n  -I, --ignore [pattern]         Override the path patterns to skip compilation\n  -P, --project [path]           Path to TypeScript JSON project file\n  -C, --compiler [name]          Specify a custom TypeScript compiler\n  -D, --ignoreDiagnostics [code] Ignore TypeScript warnings by diagnostic code\n  -O, --compilerOptions [opts]   JSON object to merge with compiler options\n\n  --files                        Load files from `tsconfig.json` on startup\n  --pretty                       Use pretty diagnostic formatter\n  --no-cache                     Disable the local TypeScript Node cache\n  --skip-project                 Skip reading `tsconfig.json`\n  --skip-ignore                  Skip `--ignore` checks\n");
    process.exit(0);
}
var cwd = process.cwd();
var code = argv.eval === undefined ? argv.print : argv.eval;
var isEval = typeof argv.eval === 'string' || !!argv.print; // Minimist struggles with empty strings.
var isPrinted = argv.print !== undefined;
// Register the TypeScript compiler instance.
var service = index_1.register({
    files: argv.files,
    pretty: argv.pretty,
    typeCheck: argv.typeCheck,
    transpileOnly: argv.transpileOnly,
    cache: argv.cache,
    cacheDirectory: argv.cacheDirectory,
    ignore: argv.ignore,
    project: argv.project,
    skipIgnore: argv.skipIgnore,
    skipProject: argv.skipProject,
    compiler: argv.compiler,
    ignoreDiagnostics: argv.ignoreDiagnostics,
    compilerOptions: index_1.parse(argv.compilerOptions) || index_1.DEFAULTS.compilerOptions,
    readFile: isEval ? readFileEval : undefined,
    fileExists: isEval ? fileExistsEval : undefined
});
// Output project information.
if (argv.version) {
    console.log("ts-node v" + index_1.VERSION);
    console.log("node " + process.version);
    console.log("typescript v" + service.ts.version);
    console.log("cache " + JSON.stringify(service.cachedir));
    process.exit(0);
}
// Require specified modules before start-up.
Module._preloadModules(arrify(argv.require));
/**
 * Eval helpers.
 */
var EVAL_FILENAME = "[eval].ts";
var EVAL_PATH = path_1.join(cwd, EVAL_FILENAME);
var EVAL_INSTANCE = { input: '', output: '', version: 0, lines: 0 };
// Execute the main contents (either eval, script or piped).
if (isEval) {
    evalAndExit(code, isPrinted);
}
else {
    if (argv._.length) {
        process.argv = ['node'].concat(path_1.resolve(cwd, argv._[0])).concat(argv._.slice(1));
        process.execArgv.unshift(__filename);
        Module.runMain();
    }
    else {
        // Piping of execution _only_ occurs when no other script is specified.
        if (process.stdin.isTTY) {
            startRepl();
        }
        else {
            var code_1 = '';
            process.stdin.on('data', function (chunk) { return code_1 += chunk; });
            process.stdin.on('end', function () { return evalAndExit(code_1, isPrinted); });
        }
    }
}
/**
 * Evaluate a script.
 */
function evalAndExit(code, isPrinted) {
    var module = new Module(EVAL_FILENAME);
    module.filename = EVAL_FILENAME;
    module.paths = Module._nodeModulePaths(cwd);
    global.__filename = EVAL_FILENAME;
    global.__dirname = cwd;
    global.exports = module.exports;
    global.module = module;
    global.require = module.require.bind(module);
    var result;
    try {
        result = _eval(code);
    }
    catch (error) {
        if (error instanceof index_1.TSError) {
            console.error(error.diagnosticText);
            process.exit(1);
        }
        throw error;
    }
    if (isPrinted) {
        console.log(typeof result === 'string' ? result : util_1.inspect(result));
    }
}
/**
 * Evaluate the code snippet.
 */
function _eval(input) {
    var lines = EVAL_INSTANCE.lines;
    var isCompletion = !/\n$/.test(input);
    var undo = appendEval(input);
    var output;
    try {
        output = service.compile(EVAL_INSTANCE.input, EVAL_PATH, -lines);
    }
    catch (err) {
        undo();
        throw err;
    }
    // Use `diff` to check for new JavaScript to execute.
    var changes = diff_1.diffLines(EVAL_INSTANCE.output, output);
    if (isCompletion) {
        undo();
    }
    else {
        EVAL_INSTANCE.output = output;
    }
    return changes.reduce(function (result, change) {
        return change.added ? exec(change.value, EVAL_FILENAME) : result;
    }, undefined);
}
/**
 * Execute some code.
 */
function exec(code, filename) {
    var script = new vm_1.Script(code, { filename: filename });
    return script.runInThisContext();
}
/**
 * Start a CLI REPL.
 */
function startRepl() {
    var repl = repl_1.start({
        prompt: '> ',
        input: process.stdin,
        output: process.stdout,
        terminal: process.stdout.isTTY,
        eval: replEval,
        useGlobal: true
    });
    // Bookmark the point where we should reset the REPL state.
    var resetEval = appendEval('');
    function reset() {
        resetEval();
        // Hard fix for TypeScript forcing `Object.defineProperty(exports, ...)`.
        exec('exports = module.exports', EVAL_FILENAME);
    }
    reset();
    repl.on('reset', reset);
    repl.defineCommand('type', {
        help: 'Check the type of a TypeScript identifier',
        action: function (identifier) {
            if (!identifier) {
                repl.displayPrompt();
                return;
            }
            var undo = appendEval(identifier);
            var _a = service.getTypeInfo(EVAL_INSTANCE.input, EVAL_PATH, EVAL_INSTANCE.input.length), name = _a.name, comment = _a.comment;
            undo();
            repl.outputStream.write(name + "\n" + (comment ? comment + "\n" : ''));
            repl.displayPrompt();
        }
    });
}
/**
 * Eval code from the REPL.
 */
function replEval(code, _context, _filename, callback) {
    var err;
    var result;
    // TODO: Figure out how to handle completion here.
    if (code === '.scope') {
        callback();
        return;
    }
    try {
        result = _eval(code);
    }
    catch (error) {
        if (error instanceof index_1.TSError) {
            // Support recoverable compilations using >= node 6.
            if (repl_1.Recoverable && isRecoverable(error)) {
                err = new repl_1.Recoverable(error);
            }
            else {
                console.error(error.diagnosticText);
                err = undefined;
            }
        }
        else {
            err = error;
        }
    }
    callback(err, result);
}
/**
 * Append to the eval instance and return an undo function.
 */
function appendEval(input) {
    var undoInput = EVAL_INSTANCE.input;
    var undoVersion = EVAL_INSTANCE.version;
    var undoOutput = EVAL_INSTANCE.output;
    var undoLines = EVAL_INSTANCE.lines;
    // Handle ASI issues with TypeScript re-evaluation.
    if (undoInput.charAt(undoInput.length - 1) === '\n' && /^\s*[\[\(\`]/.test(input) && !/;\s*$/.test(undoInput)) {
        EVAL_INSTANCE.input = EVAL_INSTANCE.input.slice(0, -1) + ";\n";
    }
    EVAL_INSTANCE.input += input;
    EVAL_INSTANCE.lines += lineCount(input);
    EVAL_INSTANCE.version++;
    return function () {
        EVAL_INSTANCE.input = undoInput;
        EVAL_INSTANCE.output = undoOutput;
        EVAL_INSTANCE.version = undoVersion;
        EVAL_INSTANCE.lines = undoLines;
    };
}
/**
 * Count the number of lines.
 */
function lineCount(value) {
    var count = 0;
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var char = value_1[_i];
        if (char === '\n') {
            count++;
        }
    }
    return count;
}
/**
 * Get the file text, checking for eval first.
 */
function readFileEval(path) {
    if (path === EVAL_PATH)
        return EVAL_INSTANCE.input;
    try {
        return fs_1.readFileSync(path, 'utf8');
    }
    catch (err) { /* Ignore. */ }
}
/**
 * Get whether the file exists.
 */
function fileExistsEval(path) {
    if (path === EVAL_PATH)
        return true;
    try {
        var stats = fs_1.statSync(path);
        return stats.isFile() || stats.isFIFO();
    }
    catch (err) {
        return false;
    }
}
var RECOVERY_CODES = new Set([
    1003,
    1005,
    1109,
    1126,
    1160,
    1161,
    2355 // "A function whose declared type is neither 'void' nor 'any' must return a value."
]);
/**
 * Check if a function can recover gracefully.
 */
function isRecoverable(error) {
    return error.diagnosticCodes.every(function (code) { return RECOVERY_CODES.has(code); });
}
//# sourceMappingURL=bin.js.map