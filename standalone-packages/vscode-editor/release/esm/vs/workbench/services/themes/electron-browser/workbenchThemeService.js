/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { VS_LIGHT_THEME, VS_DARK_THEME, VS_HC_THEME, COLOR_THEME_SETTING, ICON_THEME_SETTING, CUSTOM_WORKBENCH_COLORS_SETTING, CUSTOM_EDITOR_COLORS_SETTING, CUSTOM_EDITOR_SCOPE_COLORS_SETTING, DETECT_HC_SETTING, HC_THEME_ID } from '../common/workbenchThemeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import * as errors from '../../../../base/common/errors.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ColorThemeData } from './colorThemeData.js';
import { Extensions as ThemingExtensions } from '../../../../platform/theme/common/themeService.js';
import { Emitter } from '../../../../base/common/event.js';
import * as colorThemeSchema from '../common/colorThemeSchema.js';
import * as fileIconThemeSchema from '../common/fileIconThemeSchema.js';
import { ColorThemeStore } from './colorThemeStore.js';
import { FileIconThemeStore } from './fileIconThemeStore.js';
import { FileIconThemeData } from './fileIconThemeData.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { removeClasses, addClasses } from '../../../../base/browser/dom.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
// implementation
var DEFAULT_THEME_ID = 'vs-dark vscode-theme-defaults-themes-dark_plus-json';
var DEFAULT_THEME_SETTING_VALUE = 'Default Dark+';
var PERSISTED_THEME_STORAGE_KEY = 'colorThemeData';
var PERSISTED_ICON_THEME_STORAGE_KEY = 'iconThemeData';
var defaultThemeExtensionId = 'vscode-theme-defaults';
var oldDefaultThemeExtensionId = 'vscode-theme-colorful-defaults';
var DEFAULT_ICON_THEME_SETTING_VALUE = 'vs-seti';
var fileIconsEnabledClass = 'file-icons-enabled';
var colorThemeRulesClassName = 'contributedColorTheme';
var iconThemeRulesClassName = 'contributedIconTheme';
var themingRegistry = Registry.as(ThemingExtensions.ThemingContribution);
function validateThemeId(theme) {
    // migrations
    switch (theme) {
        case VS_LIGHT_THEME: return "vs " + defaultThemeExtensionId + "-themes-light_vs-json";
        case VS_DARK_THEME: return "vs-dark " + defaultThemeExtensionId + "-themes-dark_vs-json";
        case VS_HC_THEME: return "hc-black " + defaultThemeExtensionId + "-themes-hc_black-json";
        case "vs " + oldDefaultThemeExtensionId + "-themes-light_plus-tmTheme": return "vs " + defaultThemeExtensionId + "-themes-light_plus-json";
        case "vs-dark " + oldDefaultThemeExtensionId + "-themes-dark_plus-tmTheme": return "vs-dark " + defaultThemeExtensionId + "-themes-dark_plus-json";
    }
    return theme;
}
var WorkbenchThemeService = /** @class */ (function () {
    function WorkbenchThemeService(container, extensionService, storageService, configurationService, telemetryService, windowService, instantiationService, environmentService) {
        var _this = this;
        this.storageService = storageService;
        this.configurationService = configurationService;
        this.telemetryService = telemetryService;
        this.windowService = windowService;
        this.instantiationService = instantiationService;
        this.environmentService = environmentService;
        this.themeExtensionsActivated = new Map();
        this.container = container;
        this.colorThemeStore = new ColorThemeStore(extensionService, ColorThemeData.createLoadedEmptyTheme(DEFAULT_THEME_ID, DEFAULT_THEME_SETTING_VALUE));
        this.onFileIconThemeChange = new Emitter();
        this.iconThemeStore = new FileIconThemeStore(extensionService);
        this.onColorThemeChange = new Emitter();
        this.currentIconTheme = {
            id: '',
            label: '',
            settingsId: null,
            isLoaded: false,
            hasFileIcons: false,
            hasFolderIcons: false,
            hidesExplorerArrows: false,
            extensionData: null
        };
        // In order to avoid paint flashing for tokens, because
        // themes are loaded asynchronously, we need to initialize
        // a color theme document with good defaults until the theme is loaded
        var themeData = null;
        var persistedThemeData = this.storageService.get(PERSISTED_THEME_STORAGE_KEY, 0 /* GLOBAL */);
        if (persistedThemeData) {
            themeData = ColorThemeData.fromStorageData(persistedThemeData);
        }
        var containerBaseTheme = this.getBaseThemeFromContainer();
        if (!themeData || themeData && themeData.baseTheme !== containerBaseTheme) {
            themeData = ColorThemeData.createUnloadedTheme(containerBaseTheme);
        }
        themeData.setCustomColors(this.colorCustomizations);
        themeData.setCustomTokenColors(this.tokenColorCustomizations);
        this.updateDynamicCSSRules(themeData);
        this.applyTheme(themeData, null, true);
        var iconData = null;
        var persistedIconThemeData = this.storageService.get(PERSISTED_ICON_THEME_STORAGE_KEY, 0 /* GLOBAL */);
        if (persistedIconThemeData) {
            iconData = FileIconThemeData.fromStorageData(persistedIconThemeData);
            if (iconData) {
                _applyIconTheme(iconData, function () {
                    _this.doSetFileIconTheme(iconData);
                    return Promise.resolve(iconData);
                });
            }
        }
        this.initialize().then(null, errors.onUnexpectedError).then(function (_) {
            _this.installConfigurationListener();
        });
        // update settings schema setting
        this.colorThemeStore.onDidChange(function (themes) {
            var enumDescription = themeData.description || '';
            colorCustomizationsSchema.properties = colorThemeSchema.colorsSchema.properties;
            var copyColorCustomizationsSchema = __assign({}, colorCustomizationsSchema);
            copyColorCustomizationsSchema.properties = __assign({}, colorThemeSchema.colorsSchema.properties);
            customEditorColorSchema.properties = customEditorColorConfigurationProperties;
            var copyCustomEditorColorSchema = __assign({}, customEditorColorSchema);
            copyCustomEditorColorSchema.properties = __assign({}, customEditorColorConfigurationProperties);
            themes.forEach(function (t) {
                colorThemeSettingSchema.enum.push(t.settingsId);
                colorThemeSettingSchema.enumDescriptions.push(enumDescription);
                var themeId = "[" + t.settingsId + "]";
                colorCustomizationsSchema.properties[themeId] = copyColorCustomizationsSchema;
                customEditorColorSchema.properties[themeId] = copyCustomEditorColorSchema;
            });
            configurationRegistry.notifyConfigurationSchemaUpdated(themeSettingsConfiguration);
            configurationRegistry.notifyConfigurationSchemaUpdated(customEditorColorConfiguration);
        });
        this.iconThemeStore.onDidChange(function (themes) {
            iconThemeSettingSchema.enum = [null].concat(themes.map(function (t) { return t.settingsId; }));
            iconThemeSettingSchema.enumDescriptions = [iconThemeSettingSchema.enumDescriptions[0]].concat(themes.map(function (t) { return themeData.description || ''; }));
            configurationRegistry.notifyConfigurationSchemaUpdated(themeSettingsConfiguration);
        });
    }
    Object.defineProperty(WorkbenchThemeService.prototype, "colorCustomizations", {
        get: function () {
            return this.configurationService.getValue(CUSTOM_WORKBENCH_COLORS_SETTING) || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchThemeService.prototype, "tokenColorCustomizations", {
        get: function () {
            return this.configurationService.getValue(CUSTOM_EDITOR_COLORS_SETTING) || {};
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchThemeService.prototype.acquireFileService = function (fileService) {
        this.fileService = fileService;
    };
    Object.defineProperty(WorkbenchThemeService.prototype, "onDidColorThemeChange", {
        get: function () {
            return this.onColorThemeChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchThemeService.prototype, "onDidFileIconThemeChange", {
        get: function () {
            return this.onFileIconThemeChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchThemeService.prototype, "onIconThemeChange", {
        get: function () {
            return this.onFileIconThemeChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchThemeService.prototype, "onThemeChange", {
        get: function () {
            return this.onColorThemeChange.event;
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchThemeService.prototype.initialize = function () {
        var _this = this;
        var detectHCThemeSetting = this.configurationService.getValue(DETECT_HC_SETTING);
        var colorThemeSetting;
        if (this.windowService.getConfiguration().highContrast && detectHCThemeSetting) {
            colorThemeSetting = HC_THEME_ID;
        }
        else {
            colorThemeSetting = this.configurationService.getValue(COLOR_THEME_SETTING);
        }
        var iconThemeSetting = this.configurationService.getValue(ICON_THEME_SETTING) || '';
        return Promise.all([
            this.colorThemeStore.findThemeDataBySettingsId(colorThemeSetting, DEFAULT_THEME_ID).then(function (theme) {
                return _this.setColorTheme(theme && theme.id, null);
            }),
            this.iconThemeStore.findThemeBySettingsId(iconThemeSetting).then(function (theme) {
                return _this.setFileIconTheme(theme && theme.id, null);
            }),
        ]);
    };
    WorkbenchThemeService.prototype.installConfigurationListener = function () {
        var _this = this;
        this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(COLOR_THEME_SETTING)) {
                var colorThemeSetting = _this.configurationService.getValue(COLOR_THEME_SETTING);
                if (colorThemeSetting !== _this.currentColorTheme.settingsId) {
                    _this.colorThemeStore.findThemeDataBySettingsId(colorThemeSetting, null).then(function (theme) {
                        if (theme) {
                            _this.setColorTheme(theme.id, null);
                        }
                    });
                }
            }
            if (e.affectsConfiguration(ICON_THEME_SETTING)) {
                var iconThemeSetting = _this.configurationService.getValue(ICON_THEME_SETTING) || '';
                if (iconThemeSetting !== _this.currentIconTheme.settingsId) {
                    _this.iconThemeStore.findThemeBySettingsId(iconThemeSetting).then(function (theme) {
                        _this.setFileIconTheme(theme && theme.id, null);
                    });
                }
            }
            if (_this.currentColorTheme) {
                var hasColorChanges = false;
                if (e.affectsConfiguration(CUSTOM_WORKBENCH_COLORS_SETTING)) {
                    _this.currentColorTheme.setCustomColors(_this.colorCustomizations);
                    hasColorChanges = true;
                }
                if (e.affectsConfiguration(CUSTOM_EDITOR_COLORS_SETTING)) {
                    _this.currentColorTheme.setCustomTokenColors(_this.tokenColorCustomizations);
                    hasColorChanges = true;
                }
                if (hasColorChanges) {
                    _this.updateDynamicCSSRules(_this.currentColorTheme);
                    _this.onColorThemeChange.fire(_this.currentColorTheme);
                }
            }
        });
    };
    WorkbenchThemeService.prototype.getColorTheme = function () {
        return this.currentColorTheme;
    };
    WorkbenchThemeService.prototype.getColorThemes = function () {
        return this.colorThemeStore.getColorThemes();
    };
    WorkbenchThemeService.prototype.getTheme = function () {
        return this.getColorTheme();
    };
    WorkbenchThemeService.prototype.setColorTheme = function (themeId, settingsTarget) {
        var _this = this;
        if (!themeId) {
            return Promise.resolve(null);
        }
        if (themeId === this.currentColorTheme.id && this.currentColorTheme.isLoaded) {
            return this.writeColorThemeConfiguration(settingsTarget);
        }
        themeId = validateThemeId(themeId); // migrate theme ids
        return this.colorThemeStore.findThemeData(themeId, DEFAULT_THEME_ID).then(function (themeData) {
            if (themeData) {
                return themeData.ensureLoaded(_this.fileService).then(function (_) {
                    if (themeId === _this.currentColorTheme.id && !_this.currentColorTheme.isLoaded && _this.currentColorTheme.hasEqualData(themeData)) {
                        // the loaded theme is identical to the perisisted theme. Don't need to send an event.
                        _this.currentColorTheme = themeData;
                        themeData.setCustomColors(_this.colorCustomizations);
                        themeData.setCustomTokenColors(_this.tokenColorCustomizations);
                        return Promise.resolve(themeData);
                    }
                    themeData.setCustomColors(_this.colorCustomizations);
                    themeData.setCustomTokenColors(_this.tokenColorCustomizations);
                    _this.updateDynamicCSSRules(themeData);
                    return _this.applyTheme(themeData, settingsTarget);
                }, function (error) {
                    return Promise.reject(new Error(nls.localize('error.cannotloadtheme', "Unable to load {0}: {1}", themeData.location.toString(), error.message)));
                });
            }
            return null;
        });
    };
    WorkbenchThemeService.prototype.restoreColorTheme = function () {
        var _this = this;
        var colorThemeSetting = this.configurationService.getValue(COLOR_THEME_SETTING);
        if (colorThemeSetting !== this.currentColorTheme.settingsId) {
            this.colorThemeStore.findThemeDataBySettingsId(colorThemeSetting, null).then(function (theme) {
                if (theme) {
                    _this.setColorTheme(theme.id, null);
                }
            });
        }
    };
    WorkbenchThemeService.prototype.updateDynamicCSSRules = function (themeData) {
        var _this = this;
        var cssRules = [];
        var hasRule = {};
        var ruleCollector = {
            addRule: function (rule) {
                if (!hasRule[rule]) {
                    cssRules.push(rule);
                    hasRule[rule] = true;
                }
            }
        };
        themingRegistry.getThemingParticipants().forEach(function (p) { return p(themeData, ruleCollector, _this.environmentService); });
        _applyRules(cssRules.join('\n'), colorThemeRulesClassName);
    };
    WorkbenchThemeService.prototype.applyTheme = function (newTheme, settingsTarget, silent) {
        var _this = this;
        if (silent === void 0) { silent = false; }
        if (this.container) {
            if (this.currentColorTheme) {
                removeClasses(this.container, this.currentColorTheme.id);
            }
            else {
                removeClasses(this.container, VS_DARK_THEME, VS_LIGHT_THEME, VS_HC_THEME);
            }
            addClasses(this.container, newTheme.id);
        }
        this.currentColorTheme = newTheme;
        if (!this.themingParticipantChangeListener) {
            this.themingParticipantChangeListener = themingRegistry.onThemingParticipantAdded(function (p) { return _this.updateDynamicCSSRules(_this.currentColorTheme); });
        }
        this.sendTelemetry(newTheme.id, newTheme.extensionData, 'color');
        if (silent) {
            return Promise.resolve(null);
        }
        this.onColorThemeChange.fire(this.currentColorTheme);
        // remember theme data for a quick restore
        this.storageService.store(PERSISTED_THEME_STORAGE_KEY, newTheme.toStorageData(), 0 /* GLOBAL */);
        return this.writeColorThemeConfiguration(settingsTarget);
    };
    WorkbenchThemeService.prototype.writeColorThemeConfiguration = function (settingsTarget) {
        var _this = this;
        if (!types.isUndefinedOrNull(settingsTarget)) {
            return this.configurationWriter.writeConfiguration(COLOR_THEME_SETTING, this.currentColorTheme.settingsId, settingsTarget).then(function (_) { return _this.currentColorTheme; });
        }
        return Promise.resolve(this.currentColorTheme);
    };
    WorkbenchThemeService.prototype.sendTelemetry = function (themeId, themeData, themeType) {
        if (themeData) {
            var key = themeType + themeData.extensionId;
            if (!this.themeExtensionsActivated.get(key)) {
                /* __GDPR__
                    "activatePlugin" : {
                        "id" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
                        "name": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
                        "isBuiltin": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                        "publisherDisplayName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "themeId": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
                    }
                */
                this.telemetryService.publicLog('activatePlugin', {
                    id: themeData.extensionId,
                    name: themeData.extensionName,
                    isBuiltin: themeData.extensionIsBuiltin,
                    publisherDisplayName: themeData.extensionPublisher,
                    themeId: themeId
                });
                this.themeExtensionsActivated.set(key, true);
            }
        }
    };
    WorkbenchThemeService.prototype.getFileIconThemes = function () {
        return this.iconThemeStore.getFileIconThemes();
    };
    WorkbenchThemeService.prototype.getFileIconTheme = function () {
        return this.currentIconTheme;
    };
    WorkbenchThemeService.prototype.getIconTheme = function () {
        return this.currentIconTheme;
    };
    WorkbenchThemeService.prototype.setFileIconTheme = function (iconTheme, settingsTarget) {
        var _this = this;
        iconTheme = iconTheme || '';
        if (iconTheme === this.currentIconTheme.id && this.currentIconTheme.isLoaded) {
            return this.writeFileIconConfiguration(settingsTarget);
        }
        var onApply = function (newIconTheme) {
            _this.doSetFileIconTheme(newIconTheme);
            // remember theme data for a quick restore
            _this.storageService.store(PERSISTED_ICON_THEME_STORAGE_KEY, newIconTheme.toStorageData(), 0 /* GLOBAL */);
            return _this.writeFileIconConfiguration(settingsTarget);
        };
        return this.iconThemeStore.findThemeData(iconTheme).then(function (iconThemeData) {
            if (!iconThemeData) {
                iconThemeData = FileIconThemeData.noIconTheme();
            }
            return iconThemeData.ensureLoaded(_this.fileService).then(function (_) {
                return _applyIconTheme(iconThemeData, onApply);
            });
        });
    };
    WorkbenchThemeService.prototype.doSetFileIconTheme = function (iconThemeData) {
        this.currentIconTheme = iconThemeData;
        if (this.container) {
            if (iconThemeData.id) {
                addClasses(this.container, fileIconsEnabledClass);
            }
            else {
                removeClasses(this.container, fileIconsEnabledClass);
            }
        }
        if (iconThemeData.id) {
            this.sendTelemetry(iconThemeData.id, iconThemeData.extensionData, 'fileIcon');
        }
        this.onFileIconThemeChange.fire(this.currentIconTheme);
    };
    WorkbenchThemeService.prototype.writeFileIconConfiguration = function (settingsTarget) {
        var _this = this;
        if (!types.isUndefinedOrNull(settingsTarget)) {
            return this.configurationWriter.writeConfiguration(ICON_THEME_SETTING, this.currentIconTheme.settingsId, settingsTarget).then(function (_) { return _this.currentIconTheme; });
        }
        return Promise.resolve(this.currentIconTheme);
    };
    Object.defineProperty(WorkbenchThemeService.prototype, "configurationWriter", {
        get: function () {
            // separate out the ConfigurationWriter to avoid a dependency of the IConfigurationEditingService
            if (!this._configurationWriter) {
                this._configurationWriter = this.instantiationService.createInstance(ConfigurationWriter);
            }
            return this._configurationWriter;
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchThemeService.prototype.getBaseThemeFromContainer = function () {
        if (this.container) {
            for (var i = this.container.classList.length - 1; i >= 0; i--) {
                var item = document.body.classList.item(i);
                if (item === VS_LIGHT_THEME || item === VS_DARK_THEME || item === VS_HC_THEME) {
                    return item;
                }
            }
        }
        return VS_DARK_THEME;
    };
    WorkbenchThemeService = __decorate([
        __param(1, IExtensionService),
        __param(2, IStorageService),
        __param(3, IConfigurationService),
        __param(4, ITelemetryService),
        __param(5, IWindowService),
        __param(6, IInstantiationService),
        __param(7, IEnvironmentService)
    ], WorkbenchThemeService);
    return WorkbenchThemeService;
}());
export { WorkbenchThemeService };
function _applyIconTheme(data, onApply) {
    _applyRules(data.styleSheetContent, iconThemeRulesClassName);
    return onApply(data);
}
function _applyRules(styleSheetContent, rulesClassName) {
    var themeStyles = document.head.getElementsByClassName(rulesClassName);
    if (themeStyles.length === 0) {
        var elStyle = document.createElement('style');
        elStyle.type = 'text/css';
        elStyle.className = rulesClassName;
        elStyle.innerHTML = styleSheetContent;
        document.head.appendChild(elStyle);
    }
    else {
        themeStyles[0].innerHTML = styleSheetContent;
    }
}
colorThemeSchema.register();
fileIconThemeSchema.register();
var ConfigurationWriter = /** @class */ (function () {
    function ConfigurationWriter(configurationService) {
        this.configurationService = configurationService;
    }
    ConfigurationWriter.prototype.writeConfiguration = function (key, value, settingsTarget) {
        var settings = this.configurationService.inspect(key);
        if (settingsTarget === 1 /* USER */) {
            if (value === settings.user) {
                return Promise.resolve(null); // nothing to do
            }
            else if (value === settings.default) {
                if (types.isUndefined(settings.user)) {
                    return Promise.resolve(null); // nothing to do
                }
                value = void 0; // remove configuration from user settings
            }
        }
        else if (settingsTarget === 2 /* WORKSPACE */) {
            if (value === settings.value) {
                return Promise.resolve(null); // nothing to do
            }
        }
        return this.configurationService.updateValue(key, value, settingsTarget);
    };
    ConfigurationWriter = __decorate([
        __param(0, IConfigurationService)
    ], ConfigurationWriter);
    return ConfigurationWriter;
}());
// Configuration: Themes
var configurationRegistry = Registry.as(ConfigurationExtensions.Configuration);
var colorThemeSettingSchema = {
    type: 'string',
    description: nls.localize('colorTheme', "Specifies the color theme used in the workbench."),
    default: DEFAULT_THEME_SETTING_VALUE,
    enum: [],
    enumDescriptions: [],
    errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
var iconThemeSettingSchema = {
    type: ['string', 'null'],
    default: DEFAULT_ICON_THEME_SETTING_VALUE,
    description: nls.localize('iconTheme', "Specifies the icon theme used in the workbench or 'null' to not show any file icons."),
    enum: [null],
    enumDescriptions: [nls.localize('noIconThemeDesc', 'No file icons')],
    errorMessage: nls.localize('iconThemeError', "File icon theme is unknown or not installed.")
};
var colorCustomizationsSchema = {
    type: 'object',
    description: nls.localize('workbenchColors', "Overrides colors from the currently selected color theme."),
    properties: {},
    additionalProperties: false,
    default: {},
    defaultSnippets: [{
            body: {
                'statusBar.background': '#666666',
                'panel.background': '#555555',
                'sideBar.background': '#444444'
            }
        }]
};
var themeSettingsConfiguration = {
    id: 'workbench',
    order: 7.1,
    type: 'object',
    properties: (_a = {},
        _a[COLOR_THEME_SETTING] = colorThemeSettingSchema,
        _a[ICON_THEME_SETTING] = iconThemeSettingSchema,
        _a[CUSTOM_WORKBENCH_COLORS_SETTING] = colorCustomizationsSchema,
        _a)
};
configurationRegistry.registerConfiguration(themeSettingsConfiguration);
function tokenGroupSettings(description) {
    return {
        description: description,
        default: '#FF0000',
        anyOf: [
            {
                type: 'string',
                format: 'color-hex'
            },
            colorThemeSchema.tokenColorizationSettingSchema
        ]
    };
}
var customEditorColorConfigurationProperties = (_b = {
        comments: tokenGroupSettings(nls.localize('editorColors.comments', "Sets the colors and styles for comments")),
        strings: tokenGroupSettings(nls.localize('editorColors.strings', "Sets the colors and styles for strings literals.")),
        keywords: tokenGroupSettings(nls.localize('editorColors.keywords', "Sets the colors and styles for keywords.")),
        numbers: tokenGroupSettings(nls.localize('editorColors.numbers', "Sets the colors and styles for number literals.")),
        types: tokenGroupSettings(nls.localize('editorColors.types', "Sets the colors and styles for type declarations and references.")),
        functions: tokenGroupSettings(nls.localize('editorColors.functions', "Sets the colors and styles for functions declarations and references.")),
        variables: tokenGroupSettings(nls.localize('editorColors.variables', "Sets the colors and styles for variables declarations and references."))
    },
    _b[CUSTOM_EDITOR_SCOPE_COLORS_SETTING] = colorThemeSchema.tokenColorsSchema(nls.localize('editorColors.textMateRules', 'Sets colors and styles using textmate theming rules (advanced).')),
    _b);
var customEditorColorSchema = {
    description: nls.localize('editorColors', "Overrides editor colors and font style from the currently selected color theme."),
    default: {},
    additionalProperties: false,
    properties: {}
};
var customEditorColorConfiguration = {
    id: 'editor',
    order: 7.2,
    type: 'object',
    properties: (_c = {},
        _c[CUSTOM_EDITOR_COLORS_SETTING] = customEditorColorSchema,
        _c)
};
configurationRegistry.registerConfiguration(customEditorColorConfiguration);
