import { BaseError } from 'make-error';
import * as _ts from 'typescript';
/**
 * @internal
 */
export declare const INSPECT_CUSTOM: symbol;
/**
 * Common TypeScript interfaces between versions.
 */
export interface TSCommon {
    version: typeof _ts.version;
    sys: typeof _ts.sys;
    ScriptSnapshot: typeof _ts.ScriptSnapshot;
    displayPartsToString: typeof _ts.displayPartsToString;
    createLanguageService: typeof _ts.createLanguageService;
    getDefaultLibFilePath: typeof _ts.getDefaultLibFilePath;
    getPreEmitDiagnostics: typeof _ts.getPreEmitDiagnostics;
    flattenDiagnosticMessageText: typeof _ts.flattenDiagnosticMessageText;
    transpileModule: typeof _ts.transpileModule;
    ModuleKind: typeof _ts.ModuleKind;
    ScriptTarget: typeof _ts.ScriptTarget;
    findConfigFile: typeof _ts.findConfigFile;
    readConfigFile: typeof _ts.readConfigFile;
    parseJsonConfigFileContent: typeof _ts.parseJsonConfigFileContent;
    formatDiagnostics: typeof _ts.formatDiagnostics;
    formatDiagnosticsWithColorAndContext: typeof _ts.formatDiagnosticsWithColorAndContext;
}
/**
 * Export the current version.
 */
export declare const VERSION: any;
/**
 * Registration options.
 */
export interface Options {
    pretty?: boolean | null;
    typeCheck?: boolean | null;
    transpileOnly?: boolean | null;
    files?: boolean | null;
    cache?: boolean | null;
    cacheDirectory?: string;
    compiler?: string;
    ignore?: string | string[];
    project?: string;
    skipIgnore?: boolean | null;
    skipProject?: boolean | null;
    compilerOptions?: object;
    ignoreDiagnostics?: number | string | Array<number | string>;
    readFile?: (path: string) => string | undefined;
    fileExists?: (path: string) => boolean;
    transformers?: _ts.CustomTransformers;
}
/**
 * Information retrieved from type info check.
 */
export interface TypeInfo {
    name: string;
    comment: string;
}
/**
 * Default register options.
 */
export declare const DEFAULTS: Options;
/**
 * Split a string array of values.
 */
export declare function split(value: string | undefined): string[] | undefined;
/**
 * Parse a string as JSON.
 */
export declare function parse(value: string | undefined): object | undefined;
/**
 * Replace backslashes with forward slashes.
 */
export declare function normalizeSlashes(value: string): string;
/**
 * TypeScript diagnostics error.
 */
export declare class TSError extends BaseError {
    diagnosticText: string;
    diagnosticCodes: number[];
    name: string;
    constructor(diagnosticText: string, diagnosticCodes: number[]);
}
/**
 * Return type for registering `ts-node`.
 */
export interface Register {
    cwd: string;
    extensions: string[];
    cachedir: string;
    ts: TSCommon;
    compile(code: string, fileName: string, lineOffset?: number): string;
    getTypeInfo(code: string, fileName: string, position: number): TypeInfo;
}
/**
 * Register TypeScript compiler.
 */
export declare function register(opts?: Options): Register;
