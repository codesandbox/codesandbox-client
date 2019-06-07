interface LoadingInput {
    hasActiveTextEditor: boolean;
}
interface StateChangeInput extends LoadingInput {
    text: string;
    tooltip?: string;
}
export default class ApolloStatusBar {
    statusBarItem: import("vscode").StatusBarItem;
    static loadingStateText: string;
    static loadedStateText: string;
    static warningText: string;
    constructor({ hasActiveTextEditor }: LoadingInput);
    protected changeState({ hasActiveTextEditor, text, tooltip }: StateChangeInput): void;
    showLoadingState({ hasActiveTextEditor }: LoadingInput): void;
    showLoadedState({ hasActiveTextEditor }: LoadingInput): void;
    showWarningState({ hasActiveTextEditor, tooltip }: LoadingInput & {
        tooltip: string;
    }): void;
    dispose(): void;
}
export {};
//# sourceMappingURL=statusBar.d.ts.map