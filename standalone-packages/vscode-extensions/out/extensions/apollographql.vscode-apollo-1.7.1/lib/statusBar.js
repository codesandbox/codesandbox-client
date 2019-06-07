"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ApolloStatusBar {
    constructor({ hasActiveTextEditor }) {
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
        this.showLoadingState({ hasActiveTextEditor });
        this.statusBarItem.command = "apollographql/showStats";
    }
    changeState({ hasActiveTextEditor, text, tooltip }) {
        if (!hasActiveTextEditor) {
            this.statusBarItem.hide();
            return;
        }
        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = tooltip;
        this.statusBarItem.show();
    }
    showLoadingState({ hasActiveTextEditor }) {
        this.changeState({
            hasActiveTextEditor,
            text: ApolloStatusBar.loadingStateText
        });
    }
    showLoadedState({ hasActiveTextEditor }) {
        this.changeState({
            hasActiveTextEditor,
            text: ApolloStatusBar.loadedStateText
        });
    }
    showWarningState({ hasActiveTextEditor, tooltip }) {
        this.changeState({
            hasActiveTextEditor,
            text: ApolloStatusBar.warningText,
            tooltip
        });
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
ApolloStatusBar.loadingStateText = "Apollo GraphQL $(rss)";
ApolloStatusBar.loadedStateText = "ApolloGraphQL $(rocket)";
ApolloStatusBar.warningText = "Apollo GraphQL $(alert)";
exports.default = ApolloStatusBar;
//# sourceMappingURL=statusBar.js.map