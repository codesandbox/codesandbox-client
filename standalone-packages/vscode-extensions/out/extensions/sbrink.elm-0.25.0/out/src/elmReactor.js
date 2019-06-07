"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const path = require("path");
const utils = require("./elmUtils");
const vscode = require("vscode");
const elmUtils_1 = require("./elmUtils");
let reactor;
let oc = vscode.window.createOutputChannel('Elm Reactor');
let statusBarStopButton;
function getReactorAndArguments(host, port, subdir) {
    const config = vscode.workspace.getConfiguration('elm');
    const dummyPath = path.join(vscode.workspace.rootPath, 'dummyfile');
    const reactor018Command = 'elm-reactor';
    const compiler = config.get('compiler');
    const [cwd, elmVersion] = utils.detectProjectRootAndElmVersion(dummyPath, vscode.workspace.rootPath);
    const args018 = ['-a=' + host, 'p=' + port];
    const args019 = ['reactor', '--port=' + port];
    const cwdWithSubdir = path.join(cwd, subdir);
    const args = utils.isElm019(elmVersion) ? args019 : args018;
    const reactorCommand = utils.isElm019(elmVersion)
        ? compiler
        : reactor018Command;
    return [cwdWithSubdir, reactorCommand, args];
}
function startReactor() {
    try {
        stopReactor(/*notify*/ false);
        const config = vscode.workspace.getConfiguration('elm');
        const host = config.get('reactorHost');
        const port = config.get('reactorPort');
        const subdir = config.get('reactorSubdir');
        const [cwd, reactorCommand, args] = getReactorAndArguments(host, port, subdir);
        if (elmUtils_1.isWindows) {
            reactor = cp.exec(reactorCommand + ' ' + args.join(' '), { cwd: cwd });
        }
        else {
            reactor = cp.spawn(reactorCommand, args, { cwd: cwd, detached: true });
        }
        reactor.stdout.on('data', (data) => {
            if (data && data.toString().startsWith('| ') === false) {
                oc.append(data.toString());
            }
        });
        reactor.stderr.on('data', (data) => {
            if (data) {
                oc.append(data.toString());
            }
        });
        oc.show(vscode.ViewColumn.Three);
        statusBarStopButton.show();
    }
    catch (e) {
        console.error('Starting Elm reactor failed', e);
        vscode.window.showErrorMessage('Starting Elm reactor failed');
    }
}
function stopReactor(notify) {
    if (reactor) {
        if (elmUtils_1.isWindows) {
            cp.spawn('taskkill', ['/pid', reactor.pid.toString(), '/f', '/t']);
        }
        else {
            process.kill(-reactor.pid, 'SIGKILL');
        }
        reactor = null;
        statusBarStopButton.hide();
        oc.dispose();
        oc.hide();
    }
    else {
        if (notify) {
            vscode.window.showInformationMessage('Elm Reactor not running');
        }
    }
}
function activateReactor() {
    statusBarStopButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarStopButton.text = '$(primitive-square)';
    statusBarStopButton.command = 'elm.reactorStop';
    statusBarStopButton.tooltip = 'Stop reactor';
    return [
        vscode.commands.registerCommand('elm.reactorStart', startReactor),
        vscode.commands.registerCommand('elm.reactorStop', () => stopReactor(/*notify*/ true)),
    ];
}
exports.activateReactor = activateReactor;
function deactivateReactor() {
    stopReactor(/*notify*/ false);
}
exports.deactivateReactor = deactivateReactor;
//# sourceMappingURL=elmReactor.js.map