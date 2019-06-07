export declare class ToolError extends Error {
    name: string;
    constructor(message: string);
}
export declare function logError(error: Error): void;
export declare function logErrorMessage(message: string, fileName?: string, lineNumber?: number): void;
//# sourceMappingURL=logger.d.ts.map