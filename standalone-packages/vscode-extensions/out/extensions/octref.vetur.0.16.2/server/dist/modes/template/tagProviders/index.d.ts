import { IHTMLTagProvider } from './common';
export { getComponentInfoTagProvider as getComponentTags } from './componentInfoTagProvider';
export { IHTMLTagProvider } from './common';
export declare let allTagProviders: IHTMLTagProvider[];
export interface CompletionConfiguration {
    [provider: string]: boolean;
}
export declare function getTagProviderSettings(workspacePath: string | null | undefined): CompletionConfiguration;
export declare function getEnabledTagProviders(tagProviderSetting: CompletionConfiguration): IHTMLTagProvider[];
