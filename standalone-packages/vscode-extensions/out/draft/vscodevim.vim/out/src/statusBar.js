"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const mode_1 = require("./mode/mode");
class StatusBarImpl {
    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this._prevModeNameForText = undefined;
        this._prevModeNameForColor = undefined;
        this._isRecordingMacro = false;
        this._isErrorCurrentlyShown = true;
    }
    SetText(text, mode, isRecordingMacro, forceUpdate = false, isError = false) {
        let updateStatusBar = this._prevModeNameForText !== mode ||
            this._isRecordingMacro !== isRecordingMacro ||
            forceUpdate;
        updateStatusBar = updateStatusBar && !this._isErrorCurrentlyShown;
        if (isError) {
            this._isErrorCurrentlyShown = true;
        }
        // If an error is shown, don't update the status bar until mode is changed
        if (this._prevModeNameForText !== mode && mode !== mode_1.ModeName.Normal) {
            this._isErrorCurrentlyShown = false;
        }
        this._prevModeNameForText = mode;
        this._isRecordingMacro = isRecordingMacro;
        if (updateStatusBar) {
            this._statusBarItem.text = text || '';
            this._statusBarItem.show();
        }
    }
    SetColor(mode, background, foreground) {
        if (this._prevModeNameForColor === mode) {
            return;
        }
        this._prevModeNameForColor = mode;
        const currentColorCustomizations = vscode.workspace
            .getConfiguration('workbench')
            .get('colorCustomizations');
        const colorCustomizations = Object.assign(currentColorCustomizations || {}, {
            'statusBar.background': `${background}`,
            'statusBar.noFolderBackground': `${background}`,
            'statusBar.debuggingBackground': `${background}`,
            'statusBar.foreground': `${foreground}`,
        });
        if (foreground === undefined) {
            delete colorCustomizations['statusBar.foreground'];
        }
        vscode.workspace
            .getConfiguration('workbench')
            .update('colorCustomizations', colorCustomizations, true);
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
exports.StatusBar = new StatusBarImpl();

//# sourceMappingURL=statusBar.js.map
