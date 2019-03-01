import Template, { ParsedConfigurationFiles } from './template';
export declare class ParcelTemplate extends Template {
    getEntries(configurationFiles: ParsedConfigurationFiles): any[];
    /**
     * The file to open by the editor
     */
    getDefaultOpenedFiles(configFiles: any): any[];
}
declare const _default: ParcelTemplate;
export default _default;
