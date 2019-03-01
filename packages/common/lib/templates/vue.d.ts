import Template, { ParsedConfigurationFiles } from './template';
declare class VueTemplate extends Template {
    getEntries(configurationFiles: ParsedConfigurationFiles): string[];
    getHTMLEntries(configurationFiles: {
        [type: string]: Object;
    }): Array<string>;
}
declare const _default: VueTemplate;
export default _default;
