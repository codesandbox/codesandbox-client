import * as ts from 'typescript/lib/tsserverlibrary';
import Logger from './logger';
import TemplateLanguageService from './template-language-service';
import TemplateSettings from './template-settings';
import TemplateContext from './template-context';
export { Logger, TemplateLanguageService, TemplateSettings, TemplateContext };
/**
 * Configuration of the decorated language service.
 */
export interface AdditionalConfiguration {
    /**
     * Logger to use for printing debug messages to the TS Server log.
     */
    readonly logger?: Logger;
}
/**
 * Augments a TypeScript language service with language support for the contents
 * of template strings.
 *
 * @param typescript Instance of typescript to use.
 * @param languageService Base language service to augment.
 * @param templateService Language service for contents of template strings.
 * @param project Language service for contents of template strings.
 * @param templateSettings Determines how template strings are processed.
 * @param additionalConfig Additional configuration for the service.
 *
 * @return A copy of the language service with the template language applied. Does not mutate the
 * input language service.
 */
export declare function decorateWithTemplateLanguageService(typescript: typeof ts, languageService: ts.LanguageService, project: ts.server.Project, templateService: TemplateLanguageService, templateSettings: TemplateSettings, additionalConfig?: AdditionalConfiguration): ts.LanguageService;
