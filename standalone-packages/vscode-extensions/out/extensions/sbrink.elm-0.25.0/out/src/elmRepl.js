"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const utils = require("./elmUtils");
const vscode_1 = require("vscode");
let replTerminal;
function getElmRepl() {
    const config = vscode.workspace.getConfiguration('elm');
    const dummyPath = path.join(vscode.workspace.rootPath, 'dummyfile');
    const repl018Command = 'elm-repl';
    const compiler = config.get('compiler');
    const [cwd, elmVersion] = utils.detectProjectRootAndElmVersion(dummyPath, vscode.workspace.rootPath);
    const replCommand = utils.isElm019(elmVersion)
        ? `${compiler} repl`
        : repl018Command;
    return replCommand;
}
function startRepl() {
    try {
        let replCommand = getElmRepl();
        if (replTerminal !== undefined) {
            replTerminal.dispose();
        }
        replTerminal = vscode_1.window.createTerminal('Elm repl');
        let [replLaunchCommand, clearCommand] = utils.getTerminalLaunchCommands(replCommand);
        replTerminal.sendText(clearCommand, true);
        replTerminal.sendText(replLaunchCommand, true);
        replTerminal.show(true);
    }
    catch (error) {
        vscode.window.showErrorMessage('Cannot start Elm REPL. ' + error);
    }
}
function send(editor, msg) {
    if (editor.document.languageId !== 'elm') {
        return;
    }
    if (replTerminal === undefined) {
        startRepl();
    }
    const // Multiline input has to have '\' at the end of each line
    inputMsg = msg.replace(/\n/g, '\\\n') + '\n';
    replTerminal.sendText('\n', false); // workaround to avoid repl commands on the same line
    replTerminal.sendText(inputMsg, false);
}
function sendLine(editor) {
    send(editor, editor.document.lineAt(editor.selection.start).text);
}
function sendSelection(editor) {
    send(editor, editor.document.getText(editor.selection));
}
function sendFile(editor) {
    send(editor, editor.document.getText());
}
vscode.window.onDidCloseTerminal(terminal => {
    if (terminal.name === 'Elm repl') {
        replTerminal = undefined;
    }
});
function activateRepl() {
    return [
        vscode.commands.registerCommand('elm.replStart', () => startRepl()),
        vscode.commands.registerTextEditorCommand('elm.replSendLine', sendLine),
        vscode.commands.registerTextEditorCommand('elm.replSendSelection', sendSelection),
        vscode.commands.registerTextEditorCommand('elm.replSendFile', sendFile),
    ];
}
exports.activateRepl = activateRepl;
//# sourceMappingURL=elmRepl.js.map