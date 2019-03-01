import { ConfigurationFile, ParsedConfigurationFile } from './configuration/types';
export declare type Options = {
    showOnHomePage?: boolean;
    distDir?: string;
    extraConfigurations?: {
        [path: string]: ConfigurationFile;
    };
    isTypescript?: boolean;
    externalResourcesEnabled?: boolean;
    showCube?: boolean;
    isServer?: boolean;
    main?: boolean;
    backgroundColor?: () => string;
    mainFile?: Array<string>;
};
export declare type ConfigurationFiles = {
    [path: string]: ConfigurationFile;
};
export declare type ParsedConfigurationFiles = {
    [path: string]: ParsedConfigurationFile;
};
export default class Template {
    name: string;
    niceName: string;
    shortid: string;
    url: string;
    main: boolean;
    color: () => string;
    backgroundColor: (() => string | undefined);
    showOnHomePage: boolean;
    distDir: string;
    configurationFiles: ConfigurationFiles;
    isTypescript: boolean;
    externalResourcesEnabled: boolean;
    showCube: boolean;
    isServer: boolean;
    mainFile: undefined | string[];
    constructor(name: string, niceName: string, url: string, shortid: string, color: () => string, options?: Options);
    /**
     * Get possible entry files to evaluate, differs per template
     */
    getEntries(configurationFiles: ParsedConfigurationFiles): Array<string>;
    /**
     * Files to be opened by default by the editor when opening the editor
     */
    getDefaultOpenedFiles(configurationFiles: ParsedConfigurationFiles): Array<string>;
    getHTMLEntries(configurationFiles: {
        [type: string]: Object;
    }): Array<string>;
    /**
     * Alter the apiData to ZEIT for making deployment work
     */
    alterDeploymentData: (apiData: any) => any;
}
