import Template, { ParsedConfigurationFiles } from './template';
export declare class DojoTemplate extends Template {
    getHTMLEntries(configurationFiles: ParsedConfigurationFiles): string[];
    getEntries(configurationFiles: ParsedConfigurationFiles): string[];
}
declare const _default: DojoTemplate;
export default _default;
