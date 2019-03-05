"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const configuration_1 = require("../configuration/configuration");
class Decoration {
}
Decoration.Default = vscode.window.createTextEditorDecorationType({
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
Decoration.SearchHighlight = vscode.window.createTextEditorDecorationType({
    backgroundColor: configuration_1.configuration.searchHighlightColor,
});
Decoration.EasyMotion = vscode.window.createTextEditorDecorationType({
    backgroundColor: configuration_1.configuration.searchHighlightColor,
});
exports.Decoration = Decoration;

//# sourceMappingURL=decoration.js.map
