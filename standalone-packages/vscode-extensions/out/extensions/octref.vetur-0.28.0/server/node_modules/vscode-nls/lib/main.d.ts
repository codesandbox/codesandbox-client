export declare enum MessageFormat {
    file = "file",
    bundle = "bundle",
    both = "both"
}
export declare enum BundleFormat {
    standalone = "standalone",
    languagePack = "languagePack"
}
export interface Options {
    locale?: string;
    cacheLanguageResolution?: boolean;
    messageFormat?: MessageFormat;
    bundleFormat?: BundleFormat;
}
export interface LocalizeInfo {
    key: string;
    comment: string[];
}
export interface LocalizeFunc {
    (info: LocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
    (key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
}
export interface LoadFunc {
    (file?: string): LocalizeFunc;
}
export declare type KeyInfo = string | LocalizeInfo;
export declare function loadMessageBundle(file?: string): LocalizeFunc;
export declare function config(opts?: Options): LoadFunc;
