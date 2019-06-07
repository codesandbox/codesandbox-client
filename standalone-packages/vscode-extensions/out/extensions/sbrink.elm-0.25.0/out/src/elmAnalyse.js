"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const elmLinter_1 = require("./elmLinter");
const elmUtils_1 = require("./elmUtils");
const WebSocket = require("ws");
const request = require('request');
var ElmAnalyseServerState;
(function (ElmAnalyseServerState) {
    ElmAnalyseServerState[ElmAnalyseServerState["NotRunning"] = 1] = "NotRunning";
    ElmAnalyseServerState[ElmAnalyseServerState["PortInUse"] = 2] = "PortInUse";
    ElmAnalyseServerState[ElmAnalyseServerState["Running"] = 3] = "Running";
})(ElmAnalyseServerState || (ElmAnalyseServerState = {}));
class ElmAnalyse {
    constructor(elmAnalyseIssues) {
        this.elmAnalyseIssues = elmAnalyseIssues;
        this.unprocessedMessage = false;
        this.oc = vscode.window.createOutputChannel('Elm Analyse');
        this.statusBarStopButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarInformation = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarStopButton.text =
            '$(primitive-square)' + ' Stop Elm-analyse process';
        this.statusBarStopButton.command = 'elm.analyseStop';
        this.statusBarStopButton.tooltip = 'Stop elm-analyse process';
        this.analyse = {};
        const config = vscode.workspace.getConfiguration('elm');
        const enabledOnStartup = config.get('analyseEnabled');
        if (enabledOnStartup) {
            this.execActivateAnalyseProcesses();
        }
    }
    activateAnalyse() {
        return [
            vscode.commands.registerTextEditorCommand('elm.analyseStart', () => this.execActivateAnalyseProcesses()),
            vscode.commands.registerCommand('elm.analyseStop', () => this.execStopAnalyse(/*notify*/ true)),
        ];
    }
    deactivateAnalyse() {
        this.execStopAnalyse(/*notify*/ false);
    }
    initSocketClient() {
        try {
            const cwd = vscode.workspace.rootPath;
            const config = vscode.workspace.getConfiguration('elm');
            const port = config.get('analysePort');
            const wsPath = 'ws://localhost:' + port + '/state';
            if (this.analyseSocket) {
                this.analyseSocket.close();
            }
            this.analyseSocket = new WebSocket(wsPath);
            this.analyseSocket.on('open', () => {
                this.analyseSocket.send('PING');
                this.statusBarInformation.text =
                    'elm-analyse websocket listening on port ' + port;
            });
            this.analyseSocket.on('message', stateJson => {
                try {
                    this.elmAnalyseIssues = [];
                    const state = JSON.parse(stateJson);
                    const messages = state.messages;
                    let failedMessages = messages
                        .map(message => this.parseMessage(cwd, message))
                        .filter(result => !result.success);
                    if (failedMessages.length > 0) {
                        let items = failedMessages.map(result => "Type: '" + result.messageType + "' - " + result.reason);
                        let messageText = items.length +
                            ' of ' +
                            messages.length +
                            ' messages from Elm-analyse could not be parsed. Check if you are running at least elm-analyse 0.14.2 or higher and has been configured correctly.';
                        vscode.window
                            .showErrorMessage(messageText, 'Show details')
                            .then(item => {
                            if (item === 'Show details') {
                                vscode.window.showErrorMessage(messageText +
                                    '\n\nFollowing messages could not be parsed:\n' +
                                    items.join('\n'));
                            }
                        });
                    }
                    this.unprocessedMessage = true;
                }
                catch (e) {
                    vscode.window.showErrorMessage('Running websocket against Elm-analyse failed. Check if elm-analyse has been configured correctly.');
                }
            });
            this.analyseSocket.on('error', e => {
                vscode.window.showErrorMessage('Running websocket against Elm-analyse failed. Check if elm-analyse has been configured correctly.');
            });
        }
        catch (e) {
            vscode.window.showErrorMessage('Running websocket against Elm-analyse failed. If set to external - check if elm-analyse has been started in separate console.');
        }
    }
    parseMessage(cwd, message) {
        function generateError(reason) {
            return {
                success: false,
                reason: reason,
                messageType: message.type || null,
            };
        }
        function generateMissingError(path) {
            return generateError(path + ' is missing');
        }
        try {
            if (!message.hasOwnProperty('data')) {
                return generateMissingError('message.data');
            }
            if (!message.hasOwnProperty('type')) {
                return generateMissingError('message.type');
            }
            if (!message.hasOwnProperty('file')) {
                return generateMissingError('message.file');
            }
            if (!message.data.hasOwnProperty('description')) {
                return generateMissingError('message.data.description');
            }
            if (!message.data.hasOwnProperty('properties')) {
                return generateMissingError('message.data.properties');
            }
            const messageInfoFileRegions = this.parseMessageInfoFileRanges(message.data).map(this.convertRangeToRegion);
            messageInfoFileRegions.forEach(messageInfoFileRegion => {
                const issue = {
                    tag: 'analyser',
                    overview: message.type,
                    subregion: '',
                    details: message.data.description,
                    region: messageInfoFileRegion,
                    type: 'warning',
                    file: path.join(this.cwd, message.file),
                };
                this.elmAnalyseIssues.push(issue);
            });
            return { success: true, reason: null, messageType: null };
        }
        catch (e) {
            return generateError('message parsing failed');
        }
    }
    parseMessageInfoFileRanges(messageInfoData) {
        let messageInfoFileRanges;
        let messageInfoProperties = messageInfoData.properties;
        if (messageInfoProperties.hasOwnProperty('range')) {
            messageInfoFileRanges = [messageInfoProperties.range];
        }
        else if (messageInfoProperties.hasOwnProperty('range1') &&
            messageInfoProperties.hasOwnProperty('range2')) {
            messageInfoFileRanges = [
                messageInfoProperties.range1,
                messageInfoProperties.range2,
            ];
        }
        else if (messageInfoProperties.hasOwnProperty('ranges')) {
            messageInfoFileRanges = messageInfoProperties.ranges;
        }
        else {
            messageInfoFileRanges = [[0, 0, 0, 0]];
        }
        return messageInfoFileRanges;
    }
    convertRangeToRegion(range) {
        return {
            start: {
                line: range[0],
                column: range[1],
            },
            end: {
                line: range[2],
                column: range[3],
            },
        };
    }
    startAnalyseProcess(analyseCommand, analysePort, fileName, forceRestart = false) {
        const [cwdCurrent, version] = elmUtils_1.detectProjectRootAndElmVersion(fileName, vscode.workspace.rootPath);
        this.cwd = cwdCurrent;
        this.version = version;
        if (this.analyse.isRunning) {
            vscode.window.showErrorMessage('Elm-analyse is already running in vscode. Please run the stop command if you want to restart elm-analyse.');
            return Promise.resolve(false);
        }
        return checkElmAnalyseServerState(analysePort).then(state => {
            if (state === ElmAnalyseServerState.Running) {
                return true;
            }
            else if (state === ElmAnalyseServerState.PortInUse) {
                vscode.window.showErrorMessage('Port already in use by another process. Please stop the running process or select another port for elm-analyse.');
                return false;
            }
            else {
                this.analyse = elmUtils_1.execCmd(analyseCommand, {
                    fileName: fileName,
                    cmdArguments: ['-s', '-p', analysePort],
                    showMessageOnError: true,
                    onStart: () => this.analyse.stdin.write.bind(this.analyse.stdin),
                    onStdout: data => {
                        if (data) {
                            let info = data.toString();
                            this.oc.append(info);
                        }
                    },
                    onStderr: data => {
                        if (data) {
                            this.oc.append(data.toString());
                        }
                    },
                    notFoundText: 'Install Elm-analyse using npm i elm-analyse -g',
                });
                this.oc.show(vscode.ViewColumn.Three);
                return true;
            }
        });
    }
    execActivateAnalyseProcesses() {
        let editor = vscode.window.activeTextEditor;
        if (editor.document.languageId !== 'elm') {
            return;
        }
        try {
            const cwd = vscode.workspace.rootPath;
            const config = vscode.workspace.getConfiguration('elm');
            const analyseCommand = config.get('analyseCommand');
            const analysePort = config.get('analysePort');
            this.startAnalyseProcess(analyseCommand, analysePort, editor.document.fileName).then(processReady => {
                if (processReady) {
                    // Had to implement this timeout as this sometimes causes error when server has not been started yet.
                    this.statusBarInformation.text =
                        'elm-analyse websocket waiting 3 seconds to ensure server has started...';
                    this.statusBarInformation.show();
                    setTimeout(() => {
                        this.initSocketClient();
                        this.updateLinterInterval = setInterval(() => this.updateLinter(), 500);
                    }, 3000);
                }
            });
        }
        catch (e) {
            console.error('Running Elm-analyse command failed', e);
            vscode.window.showErrorMessage('Running Elm-analyse failed');
        }
    }
    execStopAnalyse(notify) {
        this.elmAnalyseIssues = [];
        if (this.analyse.isRunning) {
            this.analyse.kill();
            if (this.analyseSocket) {
                this.analyseSocket.removeAllListeners();
                this.analyseSocket.close();
            }
            this.updateLinterInterval = clearInterval(this.updateLinterInterval);
            this.statusBarStopButton.hide();
            this.statusBarInformation.hide();
            this.oc.clear();
            if (notify) {
                this.oc.appendLine('Elm-analyse process stopped');
            }
            this.oc.dispose();
        }
        else {
            if (notify) {
                vscode.window.showErrorMessage('Cannot stop Elm-analyse. Elm-analyse is not running.');
            }
        }
    }
    updateLinter() {
        if (this.unprocessedMessage) {
            elmLinter_1.runLinter(vscode.window.activeTextEditor.document, this);
            this.unprocessedMessage = false;
        }
    }
}
exports.ElmAnalyse = ElmAnalyse;
function checkElmAnalyseServerState(port) {
    let result = getElmAnalyseServerInfo('http://localhost:' + port).then(info => {
        if (info.match(/Elm Analyse/)) {
            return ElmAnalyseServerState.Running;
        }
        else {
            return ElmAnalyseServerState.PortInUse;
        }
    }, err => {
        return ElmAnalyseServerState.NotRunning;
    });
    return result;
}
function getElmAnalyseServerInfo(url) {
    const titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
    return new Promise((resolve, reject) => {
        request(url, (err, _, body) => {
            if (err) {
                reject(err);
            }
            else {
                let info = '';
                try {
                    const match = titleRegex.exec(body);
                    if (match && match[2]) {
                        console.log(match[2]);
                        info = match[2];
                    }
                }
                catch (e) {
                    reject(e);
                }
                resolve(info);
            }
        });
    });
}
//# sourceMappingURL=elmAnalyse.js.map