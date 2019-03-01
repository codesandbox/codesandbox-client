import { ConfigurationFile } from '../../templates/configuration/types';
import { ParsedConfigurationFiles } from '../template';
import { Sandbox, Module } from '../../types';
import { TemplateType } from '..';
declare type ConfigurationFiles = {
    [path: string]: ConfigurationFile;
};
/**
 * We convert all configuration file configs to an object with configuration per
 * type. This makes configs universal.
 */
export default function parseConfigurations(template: TemplateType, configurationFiles: ConfigurationFiles, resolveModule: (path: string) => Module | undefined, sandbox?: Sandbox): ParsedConfigurationFiles;
export {};
