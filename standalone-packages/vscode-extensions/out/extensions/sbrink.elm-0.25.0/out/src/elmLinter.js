"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const readline = require("readline");
const path = require("path");
const utils = require("./elmUtils");
const vscode = require("vscode");
const elmTest = require("./elmTest");
function severityStringToDiagnosticSeverity(severity) {
    switch (severity) {
        case 'error':
            return vscode.DiagnosticSeverity.Error;
        case 'warning':
            return vscode.DiagnosticSeverity.Warning;
        default:
            return vscode.DiagnosticSeverity.Error;
    }
}
function elmMakeIssueToDiagnostic(issue) {
    let lineRange = new vscode.Range(issue.region.start.line - 1, issue.region.start.column - 1, issue.region.end.line - 1, issue.region.end.column - 1);
    return new vscode.Diagnostic(lineRange, issue.overview + ' - ' + issue.details.replace(/\[\d+m/g, ''), severityStringToDiagnosticSeverity(issue.type));
}
function parseErrorsElm019(line) {
    const returnLines = [];
    const errorObject = JSON.parse(line);
    if (errorObject.type === 'compile-errors') {
        errorObject.errors.forEach(error => {
            const problems = error.problems.map(problem => ({
                tag: 'error',
                overview: problem.title,
                subregion: '',
                details: problem.message
                    .map(message => typeof message === 'string'
                    ? message
                    : '#' + message.string + '#')
                    .join(''),
                region: problem.region,
                type: 'error',
                file: error.path,
            }));
            returnLines.push(...problems);
        });
    }
    else if (errorObject.type === 'error') {
        const problem = {
            tag: 'error',
            overview: errorObject.title,
            subregion: '',
            details: errorObject.message
                .map(message => (typeof message === 'string' ? message : message.string))
                .join(''),
            region: {
                start: {
                    line: 1,
                    column: 1,
                },
                end: {
                    line: 1,
                    column: 1,
                },
            },
            type: 'error',
            file: errorObject.path,
        };
        returnLines.push(problem);
    }
    return returnLines;
}
function parseErrorsElm018(line) {
    if (line.startsWith('Successfully generated')) {
        // ignore compiler successes
        return [];
    }
    // elm make returns an array of issues
    return JSON.parse(line);
}
function checkForErrors(filename) {
    return new Promise((resolve, reject) => {
        const config = vscode.workspace.getConfiguration('elm');
        const make018Command = config.get('makeCommand');
        const compiler = config.get('compiler');
        const elmTestCompiler = config.get('elmTestCompiler');
        const [cwd, elmVersion] = utils.detectProjectRootAndElmVersion(filename, vscode.workspace.rootPath);
        const specialFile = config.get('makeSpecialFile');
        const isTestFile = elmTest.fileIsTestFile(filename);
        let make;
        if (specialFile.length > 0) {
            filename = path.resolve(cwd, specialFile);
        }
        if (utils.isWindows) {
            filename = '"' + filename + '"';
        }
        const args018 = [filename, '--report', 'json', '--output', '/dev/null'];
        const args019 = [
            'make',
            filename,
            '--report',
            'json',
            '--output',
            '/dev/null',
        ];
        const args = utils.isElm019(elmVersion) ? args019 : args018;
        const makeCommand = utils.isElm019(elmVersion)
            ? isTestFile
                ? elmTestCompiler
                : compiler
            : make018Command;
        if (utils.isWindows) {
            make = cp.exec(makeCommand + ' ' + args.join(' '), { cwd: cwd });
        }
        else {
            make = cp.spawn(makeCommand, args, { cwd: cwd });
        }
        // output is actually optional
        // (fixed in https://github.com/Microsoft/vscode/commit/b4917afe9bdee0e9e67f4094e764f6a72a997c70,
        // but unreleased at this time)
        const errorLinesFromElmMake = readline.createInterface({
            // elm 0.19 uses stderr, elm 0.18 uses stdout
            input: utils.isElm019(elmVersion) ? make.stderr : make.stdout,
            output: undefined,
        });
        const lines = [];
        const elm018stderr = [];
        errorLinesFromElmMake.on('line', line => {
            if (utils.isElm019(elmVersion)) {
                const newLines = parseErrorsElm019(line);
                newLines.forEach(l => lines.push(l));
            }
            else {
                const newLines = parseErrorsElm018(line);
                newLines.forEach(l => lines.push(l));
            }
        });
        if (utils.isElm019(elmVersion) === false) {
            // we listen to stderr for Elm 0.18
            // as this is where a whole file issue would go
            make.stderr.on('data', (data) => {
                if (data) {
                    elm018stderr.push(data);
                }
            });
        }
        make.on('error', err => {
            errorLinesFromElmMake.close();
            if (err && err.code === 'ENOENT') {
                vscode.window.showInformationMessage(`The elm compiler is not available (${makeCommand}). Install Elm from https://elm-lang.org.`);
                resolve([]);
            }
            else {
                reject(err);
            }
        });
        make.on('close', (code, signal) => {
            errorLinesFromElmMake.close();
            if (elm018stderr.length) {
                let errorResult = {
                    tag: 'error',
                    overview: '',
                    subregion: '',
                    details: elm018stderr.join(''),
                    region: {
                        start: {
                            line: 1,
                            column: 1,
                        },
                        end: {
                            line: 1,
                            column: 1,
                        },
                    },
                    type: 'error',
                    file: filename,
                };
                resolve([errorResult]);
            }
            else {
                resolve(lines);
            }
        });
    });
}
let compileErrors;
function runLinter(document, elmAnalyse) {
    if (document.languageId !== 'elm' || document.uri.scheme !== 'file') {
        return;
    }
    let uri = document.uri;
    if (!compileErrors) {
        compileErrors = vscode.languages.createDiagnosticCollection('elm');
    }
    else {
        compileErrors.clear();
    }
    checkForErrors(uri.fsPath)
        .then((compilerErrors) => {
        const cwd = utils.detectProjectRoot(uri.fsPath) || vscode.workspace.rootPath;
        let splitCompilerErrors = new Map();
        compilerErrors.forEach((issue) => {
            // If provided path is relative, make it absolute
            if (issue.file.startsWith('.')) {
                issue.file = cwd + issue.file.slice(1);
            }
            if (splitCompilerErrors.has(issue.file)) {
                splitCompilerErrors.get(issue.file).push(issue);
            }
            else {
                splitCompilerErrors.set(issue.file, [issue]);
            }
        });
        // Turn split arrays into diagnostics and associate them with correct files in VS
        splitCompilerErrors.forEach((issue, issuePath) => {
            compileErrors.set(vscode.Uri.file(issuePath), issue.map(error => elmMakeIssueToDiagnostic(error)));
        });
    })
        .catch(error => {
        compileErrors.set(document.uri, []);
    });
    if (elmAnalyse.elmAnalyseIssues.length > 0) {
        let splitCompilerErrors = new Map();
        elmAnalyse.elmAnalyseIssues.forEach((issue) => {
            if (splitCompilerErrors.has(issue.file)) {
                splitCompilerErrors.get(issue.file).push(issue);
            }
            else {
                splitCompilerErrors.set(issue.file, [issue]);
            }
            splitCompilerErrors.forEach((analyserIssue, issuePath) => {
                compileErrors.set(vscode.Uri.file(issuePath), analyserIssue.map(error => elmMakeIssueToDiagnostic(error)));
            });
        });
    }
}
exports.runLinter = runLinter;
//# sourceMappingURL=elmLinter.js.map