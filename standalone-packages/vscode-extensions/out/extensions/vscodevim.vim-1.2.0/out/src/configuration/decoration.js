"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class DecorationImpl {
    set Default(value) {
        if (this._default) {
            this._default.dispose();
        }
        this._default = value;
    }
    get Default() {
        return this._default;
    }
    set SearchHighlight(value) {
        if (this._searchHighlight) {
            this._searchHighlight.dispose();
        }
        this._searchHighlight = value;
    }
    get SearchHighlight() {
        return this._searchHighlight;
    }
    set EasyMotion(value) {
        if (this._easyMotion) {
            this._easyMotion.dispose();
        }
        this._easyMotion = value;
    }
    get EasyMotion() {
        return this._easyMotion;
    }
    load(configuration) {
        this.Default = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editorCursor.foreground'),
            borderColor: new vscode.ThemeColor('editorCursor.foreground'),
            dark: {
                color: 'rgb(81,80,82)',
            },
            light: {
                // used for light colored themes
                color: 'rgb(255, 255, 255)',
            },
            borderStyle: 'solid',
            borderWidth: '1px',
        });
        this.SearchHighlight = vscode.window.createTextEditorDecorationType({
            backgroundColor: configuration.searchHighlightColor,
        });
        this.EasyMotion = vscode.window.createTextEditorDecorationType({
            backgroundColor: configuration.searchHighlightColor,
        });
    }
}
exports.decoration = new DecorationImpl();

//# sourceMappingURL=decoration.js.map
