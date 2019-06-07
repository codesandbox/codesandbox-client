"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const vscode_1 = require("vscode");
exports.isWindows = process.platform === 'win32';
/** Executes a command. Shows an error message if the command isn't found */
function execCmd(cmd, options = {}) {
    const { fileName, onStart, onStdout, onStderr, onExit, cmdArguments, } = options;
    let childProcess, firstResponse = true, wasKilledbyUs = false;
    const executingCmd = new Promise((resolve, reject) => {
        let cmdArguments = options ? options.cmdArguments : [];
        const dummyPath = path.join(vscode.workspace.rootPath, 'dummyfile');
        const [cwdCurrent, _] = detectProjectRootAndElmVersion(fileName || dummyPath, vscode_1.workspace.rootPath);
        const fullCommand = cmd + ' ' + (cmdArguments || []).join(' ');
        childProcess = cp.exec(fullCommand, { cwd: cwdCurrent }, handleExit);
        childProcess.stdout.on('data', (data) => {
            if (firstResponse && onStart) {
                onStart();
            }
            firstResponse = false;
            if (onStdout) {
                onStdout(data.toString());
            }
        });
        childProcess.stderr.on('data', (data) => {
            if (firstResponse && onStart) {
                onStart();
            }
            firstResponse = false;
            if (onStderr) {
                onStderr(data.toString());
            }
        });
        function handleExit(err, stdout, stderr) {
            executingCmd.isRunning = false;
            if (onExit) {
                onExit();
            }
            if (!wasKilledbyUs) {
                if (err) {
                    if (options.showMessageOnError) {
                        const cmdName = cmd.split(' ', 1)[0];
                        const cmdWasNotFound = 
                        // Windows method apparently still works on non-English systems
                        (exports.isWindows &&
                            err.message.includes(`'${cmdName}' is not recognized`)) ||
                            (!exports.isWindows && err.code === 127);
                        if (cmdWasNotFound) {
                            let notFoundText = options ? options.notFoundText : '';
                            vscode_1.window.showErrorMessage(`${cmdName} is not available in your path. ` + notFoundText);
                        }
                        else {
                            vscode_1.window.showErrorMessage(err.message);
                        }
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve({ stdout: stdout, stderr: stderr });
                }
            }
        }
    });
    executingCmd.stdin = childProcess.stdin;
    executingCmd.kill = killProcess;
    executingCmd.isRunning = true;
    return executingCmd;
    function killProcess() {
        wasKilledbyUs = true;
        if (exports.isWindows) {
            cp.spawn('taskkill', ['/pid', childProcess.pid.toString(), '/f', '/t']);
        }
        else {
            childProcess.kill('SIGINT');
        }
    }
}
exports.execCmd = execCmd;
function findProjAndElmVersion(dir) {
    if (fs.lstatSync(dir).isDirectory()) {
        const files = fs.readdirSync(dir);
        const elm019file = files.find((v, i) => v === 'elm.json');
        const elm018file = files.find((v, i) => v === 'elm-package.json');
        if (elm019file !== undefined) {
            return [dir + path.sep + elm019file, '0.19'];
        }
        if (elm018file !== undefined) {
            return [dir + path.sep + elm018file, '0.18'];
        }
        let parent = '';
        if (dir.lastIndexOf(path.sep) > 0) {
            parent = dir.substr(0, dir.lastIndexOf(path.sep));
        }
        if (parent === '') {
            return ['', ''];
        }
        else {
            return findProjAndElmVersion(parent);
        }
    }
}
exports.findProjAndElmVersion = findProjAndElmVersion;
function findProj(dir) {
    if (fs.lstatSync(dir).isDirectory()) {
        const files = fs.readdirSync(dir);
        const file = files.find((v, i) => v === 'elm-package.json' || v === 'elm.json');
        if (file !== undefined) {
            return dir + path.sep + file;
        }
        let parent = '';
        if (dir.lastIndexOf(path.sep) > 0) {
            parent = dir.substr(0, dir.lastIndexOf(path.sep));
        }
        if (parent === '') {
            return '';
        }
        else {
            return findProj(parent);
        }
    }
}
exports.findProj = findProj;
function detectProjectRootAndElmVersion(fileName, workspaceRootPath) {
    const proj = findProjAndElmVersion(path.dirname(fileName));
    if (proj[0] !== '') {
        return [path.dirname(proj[0]), proj[1]];
    }
    return [workspaceRootPath, '0.19'];
}
exports.detectProjectRootAndElmVersion = detectProjectRootAndElmVersion;
function detectProjectRoot(fileName) {
    const proj = findProj(path.dirname(fileName));
    if (proj !== '') {
        return path.dirname(proj);
    }
    return undefined;
}
exports.detectProjectRoot = detectProjectRoot;
function isElm019(elmVersion) {
    return elmVersion === '0.19' ? true : false;
}
exports.isElm019 = isElm019;
function getIndicesOf(searchStr, str) {
    let startIndex = 0, searchStrLen = searchStr.length;
    let index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
exports.getIndicesOf = getIndicesOf;
function isPowershell() {
    try {
        const config = vscode.workspace.getConfiguration('elm');
        const t = config.get('terminal.integrated.shell.windows');
        return t.toLowerCase().includes('powershell');
    }
    catch (error) {
        return false;
    }
}
function getTerminalLaunchCommands(command) {
    if (exports.isWindows) {
        if (isPowershell()) {
            return [`cmd /c ${command}`, 'clear'];
        }
        else {
            return [`${command}`, 'cls'];
        }
    }
    else {
        return [command, 'clear'];
    }
}
exports.getTerminalLaunchCommands = getTerminalLaunchCommands;
exports.pluginPath = vscode.extensions.getExtension('sbrink.elm')
    .extensionPath;
//# sourceMappingURL=elmUtils.js.map