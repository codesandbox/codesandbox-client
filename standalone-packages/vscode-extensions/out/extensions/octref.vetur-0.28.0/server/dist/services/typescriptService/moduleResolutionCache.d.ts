import * as ts from 'typescript';
export declare class ModuleResolutionCache {
    private _cache;
    getCache(moduleName: string, containingFile: string): ts.ResolvedModule | undefined;
    setCache(moduleName: string, containingFile: string, cache: ts.ResolvedModule): undefined;
}
