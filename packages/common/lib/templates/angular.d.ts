import Template, { ParsedConfigurationFiles } from './template';
declare class AngularTemplate extends Template {
    /**
     * Override entry file because of angular-cli
     */
    getEntries(configurationFiles: ParsedConfigurationFiles): Array<string>;
    getHTMLEntries(configurationFiles: ParsedConfigurationFiles): Array<string>;
}
declare const _default: AngularTemplate;
export default _default;
