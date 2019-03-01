import { Sandbox } from '../../types';
export declare type ConfigurationFile = {
    title: string;
    type: string;
    description: string;
    moreInfoUrl: string;
    getDefaultCode?: (template: string, resolveModule: (path: string) => {
        code: string;
    } | undefined) => string;
    generateFileFromState?: (state: any) => string;
    generateFileFromSandbox?: (sandbox: Sandbox) => string;
    schema?: string;
    partialSupportDisclaimer?: string;
};
export declare type ParsedConfigurationFile = {
    parsed: any | undefined;
    code: string;
    generated: string;
    error?: Error;
};
