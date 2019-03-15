"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var ModeName;
(function (ModeName) {
    ModeName[ModeName["Normal"] = 0] = "Normal";
    ModeName[ModeName["Insert"] = 1] = "Insert";
    ModeName[ModeName["Visual"] = 2] = "Visual";
    ModeName[ModeName["VisualBlock"] = 3] = "VisualBlock";
    ModeName[ModeName["VisualLine"] = 4] = "VisualLine";
    ModeName[ModeName["SearchInProgressMode"] = 5] = "SearchInProgressMode";
    ModeName[ModeName["CommandlineInProgress"] = 6] = "CommandlineInProgress";
    ModeName[ModeName["Replace"] = 7] = "Replace";
    ModeName[ModeName["EasyMotionMode"] = 8] = "EasyMotionMode";
    ModeName[ModeName["EasyMotionInputMode"] = 9] = "EasyMotionInputMode";
    ModeName[ModeName["SurroundInputMode"] = 10] = "SurroundInputMode";
    ModeName[ModeName["Disabled"] = 11] = "Disabled";
})(ModeName = exports.ModeName || (exports.ModeName = {}));
var VSCodeVimCursorType;
(function (VSCodeVimCursorType) {
    VSCodeVimCursorType[VSCodeVimCursorType["Block"] = 0] = "Block";
    VSCodeVimCursorType[VSCodeVimCursorType["Line"] = 1] = "Line";
    VSCodeVimCursorType[VSCodeVimCursorType["LineThin"] = 2] = "LineThin";
    VSCodeVimCursorType[VSCodeVimCursorType["Underline"] = 3] = "Underline";
    VSCodeVimCursorType[VSCodeVimCursorType["TextDecoration"] = 4] = "TextDecoration";
    VSCodeVimCursorType[VSCodeVimCursorType["Native"] = 5] = "Native";
})(VSCodeVimCursorType = exports.VSCodeVimCursorType || (exports.VSCodeVimCursorType = {}));
class Mode {
    constructor(name, statusBarText, cursorType, isVisualMode = false) {
        this.name = name;
        this.cursorType = cursorType;
        this.isVisualMode = isVisualMode;
        this._statusBarText = statusBarText;
        this._isActive = false;
    }
    get friendlyName() {
        return ModeName[this.name];
    }
    get isActive() {
        return this._isActive;
    }
    set isActive(val) {
        this._isActive = val;
    }
    getStatusBarText(vimState) {
        return this._statusBarText.toLocaleUpperCase();
    }
    getStatusBarCommandText(vimState) {
        return vimState.recordedState.commandString;
    }
    static translateCursor(cursorType) {
        return this._cursorMap.get(cursorType);
    }
}
Mode._cursorMap = new Map([
    [VSCodeVimCursorType.Block, vscode.TextEditorCursorStyle.Block],
    [VSCodeVimCursorType.Line, vscode.TextEditorCursorStyle.Line],
    [VSCodeVimCursorType.LineThin, vscode.TextEditorCursorStyle.LineThin],
    [VSCodeVimCursorType.Underline, vscode.TextEditorCursorStyle.Underline],
    [VSCodeVimCursorType.TextDecoration, vscode.TextEditorCursorStyle.LineThin],
    [VSCodeVimCursorType.Native, vscode.TextEditorCursorStyle.Block],
]);
exports.Mode = Mode;

//# sourceMappingURL=mode.js.map
