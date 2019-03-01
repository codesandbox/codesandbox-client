export interface Result {
    editorSize: number;
    tabs?: string[];
    currentModule?: string;
    initialPath?: string;
    fontSize?: number;
    highlightedLines?: number[];
    isPreviewScreen?: boolean;
    isEditorScreen?: boolean;
    isSplitScreen?: boolean;
    isTestPreviewWindow?: boolean;
    isConsolePreviewWindow?: boolean;
    hideNavigation?: boolean;
    isInProjectView?: boolean;
    autoResize?: boolean;
    useCodeMirror?: boolean;
    enableEslint?: boolean;
    forceRefresh?: boolean;
    expandDevTools?: boolean;
    verticalMode?: boolean;
    runOnClick?: boolean;
    previewWindow?: 'tests' | 'console';
}
export declare const getSandboxOptions: (url: string) => Result;
