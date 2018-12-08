/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import * as objects from '../../../../base/common/objects.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { Extensions, editorConfigurationSchemaId, validateProperty } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Extensions as JSONExtensions } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { workspaceSettingsSchemaId, launchSchemaId } from './configuration.js';
import { isObject } from '../../../../base/common/types.js';
var configurationRegistry = Registry.as(Extensions.Configuration);
var configurationEntrySchema = {
    type: 'object',
    defaultSnippets: [{ body: { title: '', properties: {} } }],
    properties: {
        title: {
            description: nls.localize('vscode.extension.contributes.configuration.title', 'A summary of the settings. This label will be used in the settings file as separating comment.'),
            type: 'string'
        },
        properties: {
            description: nls.localize('vscode.extension.contributes.configuration.properties', 'Description of the configuration properties.'),
            type: 'object',
            additionalProperties: {
                anyOf: [
                    { $ref: 'http://json-schema.org/draft-07/schema#' },
                    {
                        type: 'object',
                        properties: {
                            isExecutable: {
                                type: 'boolean',
                                deprecationMessage: 'This property is deprecated. Instead use `scope` property and set it to `application` value.'
                            },
                            scope: {
                                type: 'string',
                                enum: ['application', 'window', 'resource'],
                                default: 'window',
                                enumDescriptions: [
                                    nls.localize('scope.application.description', "Application specific configuration, which can be configured only in User settings."),
                                    nls.localize('scope.window.description', "Window specific configuration, which can be configured in the User or Workspace settings."),
                                    nls.localize('scope.resource.description', "Resource specific configuration, which can be configured in the User, Workspace or Folder settings.")
                                ],
                                description: nls.localize('scope.description', "Scope in which the configuration is applicable. Available scopes are `window` and `resource`.")
                            },
                            enumDescriptions: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                description: nls.localize('scope.enumDescriptions', 'Descriptions for enum values')
                            },
                            markdownEnumDescription: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                description: nls.localize('scope.markdownEnumDescription', 'Descriptions for enum values in the markdown format.')
                            },
                            markdownDescription: {
                                type: 'string',
                                description: nls.localize('scope.markdownDescription', 'The description in the markdown format.')
                            },
                            deprecationMessage: {
                                type: 'string',
                                description: nls.localize('scope.deprecationMessage', 'If set, the property is marked as deprecated and the given message is shown as an explanation.')
                            }
                        }
                    }
                ]
            }
        }
    }
};
var registeredDefaultConfigurations = [];
// BEGIN VSCode extension point `configurationDefaults`
var defaultConfigurationExtPoint = ExtensionsRegistry.registerExtensionPoint('configurationDefaults', [], {
    description: nls.localize('vscode.extension.contributes.defaultConfiguration', 'Contributes default editor configuration settings by language.'),
    type: 'object',
    defaultSnippets: [{ body: {} }],
    patternProperties: {
        '\\[.*\\]$': {
            type: 'object',
            default: {},
            $ref: editorConfigurationSchemaId,
        }
    }
});
defaultConfigurationExtPoint.setHandler(function (extensions) {
    registeredDefaultConfigurations = extensions.map(function (extension) {
        var id = extension.description.id;
        var name = extension.description.name;
        var defaults = objects.deepClone(extension.value);
        return {
            id: id, name: name, defaults: defaults
        };
    });
});
// END VSCode extension point `configurationDefaults`
// BEGIN VSCode extension point `configuration`
var configurationExtPoint = ExtensionsRegistry.registerExtensionPoint('configuration', [defaultConfigurationExtPoint], {
    description: nls.localize('vscode.extension.contributes.configuration', 'Contributes configuration settings.'),
    oneOf: [
        configurationEntrySchema,
        {
            type: 'array',
            items: configurationEntrySchema
        }
    ]
});
configurationExtPoint.setHandler(function (extensions) {
    var configurations = [];
    function handleConfiguration(node, extension) {
        var configuration = objects.deepClone(node);
        if (configuration.title && (typeof configuration.title !== 'string')) {
            extension.collector.error(nls.localize('invalid.title', "'configuration.title' must be a string"));
        }
        validateProperties(configuration, extension);
        configuration.id = node.id || extension.description.id || extension.description.uuid;
        configuration.contributedByExtension = true;
        configuration.title = configuration.title || extension.description.displayName || extension.description.id;
        configurations.push(configuration);
    }
    var _loop_1 = function (extension) {
        var value = extension.value;
        if (!Array.isArray(value)) {
            handleConfiguration(value, extension);
        }
        else {
            value.forEach(function (v) { return handleConfiguration(v, extension); });
        }
    };
    for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
        var extension = extensions_1[_i];
        _loop_1(extension);
    }
    configurationRegistry.registerConfigurations(configurations, registeredDefaultConfigurations, false);
});
// END VSCode extension point `configuration`
function validateProperties(configuration, extension) {
    var properties = configuration.properties;
    if (properties) {
        if (typeof properties !== 'object') {
            extension.collector.error(nls.localize('invalid.properties', "'configuration.properties' must be an object"));
            configuration.properties = {};
        }
        for (var key in properties) {
            var message = validateProperty(key);
            if (message) {
                delete properties[key];
                extension.collector.warn(message);
                continue;
            }
            var propertyConfiguration = properties[key];
            if (!isObject(propertyConfiguration)) {
                delete properties[key];
                extension.collector.error(nls.localize('invalid.property', "'configuration.property' must be an object"));
                continue;
            }
            if (propertyConfiguration.scope) {
                if (propertyConfiguration.scope.toString() === 'application') {
                    propertyConfiguration.scope = 1 /* APPLICATION */;
                }
                else if (propertyConfiguration.scope.toString() === 'resource') {
                    propertyConfiguration.scope = 3 /* RESOURCE */;
                }
                else {
                    propertyConfiguration.scope = 2 /* WINDOW */;
                }
            }
            else {
                propertyConfiguration.scope = 2 /* WINDOW */;
            }
        }
    }
    var subNodes = configuration.allOf;
    if (subNodes) {
        extension.collector.error(nls.localize('invalid.allOf', "'configuration.allOf' is deprecated and should no longer be used. Instead, pass multiple configuration sections as an array to the 'configuration' contribution point."));
        for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
            var node = subNodes_1[_i];
            validateProperties(node, extension);
        }
    }
}
var jsonRegistry = Registry.as(JSONExtensions.JSONContribution);
jsonRegistry.registerSchema('vscode://schemas/workspaceConfig', {
    allowComments: true,
    default: {
        folders: [
            {
                path: ''
            }
        ],
        settings: {}
    },
    required: ['folders'],
    properties: {
        'folders': {
            minItems: 0,
            uniqueItems: true,
            description: nls.localize('workspaceConfig.folders.description', "List of folders to be loaded in the workspace."),
            items: {
                type: 'object',
                default: { path: '' },
                oneOf: [{
                        properties: {
                            path: {
                                type: 'string',
                                description: nls.localize('workspaceConfig.path.description', "A file path. e.g. `/root/folderA` or `./folderA` for a relative path that will be resolved against the location of the workspace file.")
                            },
                            name: {
                                type: 'string',
                                description: nls.localize('workspaceConfig.name.description', "An optional name for the folder. ")
                            }
                        },
                        required: ['path']
                    }, {
                        properties: {
                            uri: {
                                type: 'string',
                                description: nls.localize('workspaceConfig.uri.description', "URI of the folder")
                            },
                            name: {
                                type: 'string',
                                description: nls.localize('workspaceConfig.name.description', "An optional name for the folder. ")
                            }
                        },
                        required: ['uri']
                    }]
            }
        },
        'settings': {
            type: 'object',
            default: {},
            description: nls.localize('workspaceConfig.settings.description', "Workspace settings"),
            $ref: workspaceSettingsSchemaId
        },
        'launch': {
            type: 'object',
            default: { configurations: [], compounds: [] },
            description: nls.localize('workspaceConfig.launch.description', "Workspace launch configurations"),
            $ref: launchSchemaId
        },
        'extensions': {
            type: 'object',
            default: {},
            description: nls.localize('workspaceConfig.extensions.description', "Workspace extensions"),
            $ref: 'vscode://schemas/extensions'
        }
    },
    additionalProperties: false,
    errorMessage: nls.localize('unknownWorkspaceProperty', "Unknown workspace configuration property")
});
