/**
 * @deprecated Use the `vscode-uri` npm module which provides a more
 * complete implementation of handling VS Code URIs.
 */
export declare function uriToFilePath(uri: string): string | undefined;
export declare function resolveModule(workspaceRoot: string, moduleName: string): Thenable<any>;
export declare function resolve(moduleName: string, nodePath: string | undefined, cwd: string | undefined, tracer: (message: string, verbose?: string) => void): Thenable<string>;
export declare function resolveGlobalNodePath(tracer?: (message: string) => void): string | undefined;
export declare function resolveGlobalYarnPath(tracer?: (message: string) => void): string | undefined;
export declare namespace FileSystem {
    function isCaseSensitive(): boolean;
    function isParent(parent: string, child: string): boolean;
}
export declare function resolveModulePath(workspaceRoot: string, moduleName: string, nodePath: string, tracer: (message: string, verbose?: string) => void): Thenable<string>;
/**
 * Resolves the given module relative to the given workspace root. In contrast to
 * `resolveModule` this method considers the parent chain as well.
 */
export declare function resolveModule2(workspaceRoot: string, moduleName: string, nodePath: string, tracer: (message: string, verbose?: string) => void): Thenable<any>;
