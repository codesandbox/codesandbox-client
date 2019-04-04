"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const mode_1 = require("./mode/mode");
const configuration_1 = require("./configuration/configuration");
class StatusBarImpl {
    constructor() {
        this._previousModeName = undefined;
        this._wasRecordingMacro = false;
        this._wasHighPriority = false;
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this._statusBarItem.show();
    }
    Set(text, mode, isRecordingMacro, isHighPriority = false) {
        const hasModeChanged = mode !== this._previousModeName;
        // text
        const shouldUpdateText = hasModeChanged ||
            mode === mode_1.ModeName.SearchInProgressMode ||
            mode === mode_1.ModeName.CommandlineInProgress ||
            isRecordingMacro !== this._wasRecordingMacro ||
            configuration_1.configuration.showcmd;
        // errors and other high-priorty messages remain displayed on the status bar
        // until specific conditions are met (such as the mode has changed)
        if ((shouldUpdateText && !this._wasHighPriority) || isHighPriority) {
            this.UpdateText(text);
        }
        // color
        const shouldUpdateColor = configuration_1.configuration.statusBarColorControl && hasModeChanged;
        if (shouldUpdateColor) {
            this.UpdateColor(mode);
        }
        if (hasModeChanged && mode !== mode_1.ModeName.Normal) {
            this._wasHighPriority = false;
        }
        else if (isHighPriority) {
            this._wasHighPriority = true;
        }
        this._previousModeName = mode;
        this._wasRecordingMacro = isRecordingMacro;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
    UpdateText(text) {
        this._statusBarItem.text = text || '';
    }
    UpdateColor(mode) {
        let foreground = undefined;
        let background = undefined;
        let colorToSet = configuration_1.configuration.statusBarColors[mode_1.ModeName[mode].toLowerCase()];
        if (colorToSet !== undefined) {
            if (typeof colorToSet === 'string') {
                background = colorToSet;
            }
            else {
                [background, foreground] = colorToSet;
            }
        }
        const workbenchConfiguration = vscode.workspace.getConfiguration('workbench');
        const currentColorCustomizations = workbenchConfiguration.get('colorCustomizations');
        const colorCustomizations = Object.assign({}, currentColorCustomizations || {}, {
            'statusBar.background': `${background}`,
            'statusBar.noFolderBackground': `${background}`,
            'statusBar.debuggingBackground': `${background}`,
            'statusBar.foreground': `${foreground}`,
        });
        // if colors are undefined, return to vscode defaults
        if (background === undefined) {
            delete colorCustomizations['statusBar.background'];
            delete colorCustomizations['statusBar.noFolderBackground'];
            delete colorCustomizations['statusBar.debuggingBackground'];
        }
        if (foreground === undefined) {
            delete colorCustomizations['statusBar.foreground'];
        }
        if (currentColorCustomizations !== colorCustomizations) {
            workbenchConfiguration.update('colorCustomizations', colorCustomizations, true);
        }
    }
}
exports.StatusBar = new StatusBarImpl();

//# sourceMappingURL=statusBar.js.map
