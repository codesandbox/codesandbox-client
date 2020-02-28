"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const standard_script_source_helper_1 = require("./standard-script-source-helper");
const template_language_service_decorator_1 = require("./template-language-service-decorator");
const standard_template_source_helper_1 = require("./standard-template-source-helper");
const nullLogger = new class NullLogger {
    log(_msg) { }
}();
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
function decorateWithTemplateLanguageService(typescript, languageService, project, templateService, templateSettings, additionalConfig) {
    const logger = (additionalConfig && additionalConfig.logger) || nullLogger;
    return new template_language_service_decorator_1.default(typescript, new standard_template_source_helper_1.default(typescript, templateSettings, new standard_script_source_helper_1.default(typescript, project), logger), templateService, logger).decorate(languageService);
}
exports.decorateWithTemplateLanguageService = decorateWithTemplateLanguageService;
