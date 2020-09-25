export interface DocumentContext {
    resolveReference(ref: string, base?: string): string;
}
export interface RefactorAction {
    fileName: string;
    formatOptions: any;
    textRange: {
        pos: number;
        end: number;
    };
    refactorName: string;
    actionName: string;
    preferences: {};
    description: string;
}
