export declare const enum State {
    Loaded = 0,
    Unloaded = 1
}
interface UnloadedDependency {
    name: string;
    state: State.Unloaded;
}
interface LoadedDependency<T> {
    name: string;
    state: State.Loaded;
    version: string;
    bundled: boolean;
    module: T;
}
declare type RuntimeDependency<T> = LoadedDependency<T> | UnloadedDependency;
export declare type T_PrettyHtml = typeof import('@starptech/prettyhtml');
export declare type T_ESLint = typeof import('eslint');
export declare type T_ESLintPluginVue = typeof import('eslint-plugin-vue');
export declare type T_JSBeautify = typeof import('js-beautify');
export declare type T_Prettier = typeof import('prettier');
export declare type T_StylusSupremacy = typeof import('stylus-supremacy');
export declare type T_TypeScript = typeof import('typescript');
interface VLSDependencies {
    prettyhtml: RuntimeDependency<T_PrettyHtml>;
    eslint: RuntimeDependency<T_ESLint>;
    eslintPluginVue: RuntimeDependency<T_ESLintPluginVue>;
    jsbeautify: RuntimeDependency<T_JSBeautify>;
    prettier: RuntimeDependency<T_Prettier>;
    stylusSupremacy: RuntimeDependency<T_StylusSupremacy>;
    typescript: RuntimeDependency<T_TypeScript>;
}
export declare class DependencyService {
    private dependencies;
    constructor();
    init(workspacePath: string, useWorkspaceDependencies: boolean, tsSDKPath?: string): Promise<void>;
    getDependency(d: keyof VLSDependencies): UnloadedDependency | LoadedDependency<any> | undefined;
}
export {};
