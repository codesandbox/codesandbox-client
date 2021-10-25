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
export declare type SingleFileJsonFormat = string[] | {
    messages: string[];
    keys: string[];
};
export interface NlsBundle {
    [key: string]: string[];
}
export declare type KeyInfo = string | LocalizeInfo;
export interface MetaDataEntry {
    messages: string[];
    keys: KeyInfo[];
}
export interface MetadataHeader {
    id: string;
    type: string;
    hash: string;
    outDir: string;
}
export interface MetaDataFile {
    [key: string]: MetaDataEntry;
}
export interface TranslationConfig {
    [extension: string]: string;
}
export interface I18nBundle {
    version: string;
    contents: {
        [module: string]: {
            [messageKey: string]: string;
        };
    };
}
export interface LanguageBundle {
    header: MetadataHeader;
    nlsBundle: NlsBundle;
}
export declare function isDefined(value: any): boolean;
export declare let isPseudo: boolean;
export declare function setPseudo(pseudo: boolean): void;
export declare function format(message: string, args: any[]): string;
export declare function localize(_key: string | LocalizeInfo, message: string, ...args: any[]): string;
export declare function loadMessageBundle(file?: string): LocalizeFunc;
export declare function config(opts?: Options): LoadFunc;
//# sourceMappingURL=common.d.ts.map