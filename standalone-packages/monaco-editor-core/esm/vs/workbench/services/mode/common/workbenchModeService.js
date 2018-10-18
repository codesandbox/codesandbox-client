/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls';
import * as resources from '../../../../base/common/resources';
import * as mime from '../../../../base/common/mime';
import { FILES_ASSOCIATIONS_CONFIG } from '../../../../platform/files/common/files';
import { IExtensionService } from '../../extensions/common/extensions';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry';
import { ModesRegistry } from '../../../../editor/common/modes/modesRegistry';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { ModeServiceImpl } from '../../../../editor/common/services/modeServiceImpl';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
export var languagesExtPoint = ExtensionsRegistry.registerExtensionPoint('languages', [], {
    description: nls.localize('vscode.extension.contributes.languages', 'Contributes language declarations.'),
    type: 'array',
    items: {
        type: 'object',
        defaultSnippets: [{ body: { id: '${1:languageId}', aliases: ['${2:label}'], extensions: ['${3:extension}'], configuration: './language-configuration.json' } }],
        properties: {
            id: {
                description: nls.localize('vscode.extension.contributes.languages.id', 'ID of the language.'),
                type: 'string'
            },
            aliases: {
                description: nls.localize('vscode.extension.contributes.languages.aliases', 'Name aliases for the language.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            extensions: {
                description: nls.localize('vscode.extension.contributes.languages.extensions', 'File extensions associated to the language.'),
                default: ['.foo'],
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            filenames: {
                description: nls.localize('vscode.extension.contributes.languages.filenames', 'File names associated to the language.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            filenamePatterns: {
                description: nls.localize('vscode.extension.contributes.languages.filenamePatterns', 'File name glob patterns associated to the language.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            mimetypes: {
                description: nls.localize('vscode.extension.contributes.languages.mimetypes', 'Mime types associated to the language.'),
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            firstLine: {
                description: nls.localize('vscode.extension.contributes.languages.firstLine', 'A regular expression matching the first line of a file of the language.'),
                type: 'string'
            },
            configuration: {
                description: nls.localize('vscode.extension.contributes.languages.configuration', 'A relative path to a file containing configuration options for the language.'),
                type: 'string',
                default: './language-configuration.json'
            }
        }
    }
});
var WorkbenchModeServiceImpl = /** @class */ (function (_super) {
    __extends(WorkbenchModeServiceImpl, _super);
    function WorkbenchModeServiceImpl(extensionService, configurationService, environmentService) {
        var _this = _super.call(this, environmentService.verbose || environmentService.isExtensionDevelopment || !environmentService.isBuilt) || this;
        _this._configurationService = configurationService;
        _this._extensionService = extensionService;
        languagesExtPoint.setHandler(function (extensions) {
            var allValidLanguages = [];
            for (var i = 0, len = extensions.length; i < len; i++) {
                var extension = extensions[i];
                if (!Array.isArray(extension.value)) {
                    extension.collector.error(nls.localize('invalid', "Invalid `contributes.{0}`. Expected an array.", languagesExtPoint.name));
                    continue;
                }
                for (var j = 0, lenJ = extension.value.length; j < lenJ; j++) {
                    var ext = extension.value[j];
                    if (isValidLanguageExtensionPoint(ext, extension.collector)) {
                        var configuration = void 0;
                        if (ext.configuration) {
                            configuration = resources.joinPath(extension.description.extensionLocation, ext.configuration);
                        }
                        allValidLanguages.push({
                            id: ext.id,
                            extensions: ext.extensions,
                            filenames: ext.filenames,
                            filenamePatterns: ext.filenamePatterns,
                            firstLine: ext.firstLine,
                            aliases: ext.aliases,
                            mimetypes: ext.mimetypes,
                            configuration: configuration
                        });
                    }
                }
            }
            ModesRegistry.registerLanguages(allValidLanguages);
        });
        _this._configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(FILES_ASSOCIATIONS_CONFIG)) {
                _this.updateMime();
            }
        });
        _this.onDidCreateMode(function (mode) {
            _this._extensionService.activateByEvent("onLanguage:" + mode.getId());
        });
        return _this;
    }
    WorkbenchModeServiceImpl.prototype._onReady = function () {
        var _this = this;
        if (!this._onReadyPromise) {
            this._onReadyPromise = this._extensionService.whenInstalledExtensionsRegistered().then(function () {
                _this.updateMime();
                return true;
            });
        }
        return this._onReadyPromise;
    };
    WorkbenchModeServiceImpl.prototype.updateMime = function () {
        var _this = this;
        var configuration = this._configurationService.getValue();
        // Clear user configured mime associations
        mime.clearTextMimes(true /* user configured */);
        // Register based on settings
        if (configuration.files && configuration.files.associations) {
            Object.keys(configuration.files.associations).forEach(function (pattern) {
                var langId = configuration.files.associations[pattern];
                var mimetype = _this.getMimeForMode(langId) || "text/x-" + langId;
                mime.registerTextMime({ id: langId, mime: mimetype, filepattern: pattern, userConfigured: true });
            });
        }
    };
    WorkbenchModeServiceImpl = __decorate([
        __param(0, IExtensionService),
        __param(1, IConfigurationService),
        __param(2, IEnvironmentService)
    ], WorkbenchModeServiceImpl);
    return WorkbenchModeServiceImpl;
}(ModeServiceImpl));
export { WorkbenchModeServiceImpl };
function isUndefinedOrStringArray(value) {
    if (typeof value === 'undefined') {
        return true;
    }
    if (!Array.isArray(value)) {
        return false;
    }
    return value.every(function (item) { return typeof item === 'string'; });
}
function isValidLanguageExtensionPoint(value, collector) {
    if (!value) {
        collector.error(nls.localize('invalid.empty', "Empty value for `contributes.{0}`", languagesExtPoint.name));
        return false;
    }
    if (typeof value.id !== 'string') {
        collector.error(nls.localize('require.id', "property `{0}` is mandatory and must be of type `string`", 'id'));
        return false;
    }
    if (!isUndefinedOrStringArray(value.extensions)) {
        collector.error(nls.localize('opt.extensions', "property `{0}` can be omitted and must be of type `string[]`", 'extensions'));
        return false;
    }
    if (!isUndefinedOrStringArray(value.filenames)) {
        collector.error(nls.localize('opt.filenames', "property `{0}` can be omitted and must be of type `string[]`", 'filenames'));
        return false;
    }
    if (typeof value.firstLine !== 'undefined' && typeof value.firstLine !== 'string') {
        collector.error(nls.localize('opt.firstLine', "property `{0}` can be omitted and must be of type `string`", 'firstLine'));
        return false;
    }
    if (typeof value.configuration !== 'undefined' && typeof value.configuration !== 'string') {
        collector.error(nls.localize('opt.configuration', "property `{0}` can be omitted and must be of type `string`", 'configuration'));
        return false;
    }
    if (!isUndefinedOrStringArray(value.aliases)) {
        collector.error(nls.localize('opt.aliases', "property `{0}` can be omitted and must be of type `string[]`", 'aliases'));
        return false;
    }
    if (!isUndefinedOrStringArray(value.mimetypes)) {
        collector.error(nls.localize('opt.mimetypes', "property `{0}` can be omitted and must be of type `string[]`", 'mimetypes'));
        return false;
    }
    return true;
}
