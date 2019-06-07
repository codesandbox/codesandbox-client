import { IConnection } from "vscode-languageserver";
export interface LoadingHandler {
    handle<T>(message: string, value: Promise<T>): Promise<T>;
    handleSync<T>(message: string, value: () => T): T;
    showError(message: string): void;
}
export declare class LanguageServerLoadingHandler implements LoadingHandler {
    private connection;
    constructor(connection: IConnection);
    private latestLoadingToken;
    handle<T>(message: string, value: Promise<T>): Promise<T>;
    handleSync<T>(message: string, value: () => T): T;
    showError(message: string): void;
}
//# sourceMappingURL=loadingHandler.d.ts.map