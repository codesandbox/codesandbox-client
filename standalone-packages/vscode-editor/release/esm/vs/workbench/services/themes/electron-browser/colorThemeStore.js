/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import * as resources from '../../../../base/common/resources.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { VS_LIGHT_THEME, VS_DARK_THEME, VS_HC_THEME } from '../common/workbenchThemeService.js';
import { ColorThemeData } from './colorThemeData.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { Emitter } from '../../../../base/common/event.js';
var themesExtPoint = ExtensionsRegistry.registerExtensionPoint('themes', [], {
    description: nls.localize('vscode.extension.contributes.themes', 'Contributes textmate color themes.'),
    type: 'array',
    items: {
        type: 'object',
        defaultSnippets: [{ body: { label: '${1:label}', id: '${2:id}', uiTheme: VS_DARK_THEME, path: './themes/${3:id}.tmTheme.' } }],
        properties: {
            id: {
                description: nls.localize('vscode.extension.contributes.themes.id', 'Id of the icon theme as used in the user settings.'),
                type: 'string'
            },
            label: {
                description: nls.localize('vscode.extension.contributes.themes.label', 'Label of the color theme as shown in the UI.'),
                type: 'string'
            },
            uiTheme: {
                description: nls.localize('vscode.extension.contributes.themes.uiTheme', 'Base theme defining the colors around the editor: \'vs\' is the light color theme, \'vs-dark\' is the dark color theme. \'hc-black\' is the dark high contrast theme.'),
                enum: [VS_LIGHT_THEME, VS_DARK_THEME, VS_HC_THEME]
            },
            path: {
                description: nls.localize('vscode.extension.contributes.themes.path', 'Path of the tmTheme file. The path is relative to the extension folder and is typically \'./themes/themeFile.tmTheme\'.'),
                type: 'string'
            }
        },
        required: ['path', 'uiTheme']
    }
});
var ColorThemeStore = /** @class */ (function () {
    function ColorThemeStore(extensionService, defaultTheme) {
        this.extensionService = extensionService;
        this.extensionsColorThemes = [defaultTheme];
        this.onDidChangeEmitter = new Emitter();
        this.initialize();
    }
    Object.defineProperty(ColorThemeStore.prototype, "onDidChange", {
        get: function () { return this.onDidChangeEmitter.event; },
        enumerable: true,
        configurable: true
    });
    ColorThemeStore.prototype.initialize = function () {
        var _this = this;
        themesExtPoint.setHandler(function (extensions) {
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var ext = extensions_1[_i];
                var extensionData = {
                    extensionId: ext.description.id,
                    extensionPublisher: ext.description.publisher,
                    extensionName: ext.description.name,
                    extensionIsBuiltin: ext.description.isBuiltin
                };
                _this.onThemes(ext.description.extensionLocation, extensionData, ext.value, ext.collector);
            }
            _this.onDidChangeEmitter.fire(_this.extensionsColorThemes);
        });
    };
    ColorThemeStore.prototype.onThemes = function (extensionLocation, extensionData, themes, collector) {
        var _this = this;
        if (!Array.isArray(themes)) {
            collector.error(nls.localize('reqarray', "Extension point `{0}` must be an array.", themesExtPoint.name));
            return;
        }
        themes.forEach(function (theme) {
            if (!theme.path || !types.isString(theme.path)) {
                collector.error(nls.localize('reqpath', "Expected string in `contributes.{0}.path`. Provided value: {1}", themesExtPoint.name, String(theme.path)));
                return;
            }
            var colorThemeLocation = resources.joinPath(extensionLocation, theme.path);
            if (!resources.isEqualOrParent(colorThemeLocation, extensionLocation)) {
                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", themesExtPoint.name, colorThemeLocation.path, extensionLocation.path));
            }
            var themeData = ColorThemeData.fromExtensionTheme(theme, colorThemeLocation, extensionData);
            if (themeData.id === _this.extensionsColorThemes[0].id) {
                _this.extensionsColorThemes[0] = themeData;
            }
            else {
                _this.extensionsColorThemes.push(themeData);
            }
        });
    };
    ColorThemeStore.prototype.findThemeData = function (themeId, defaultId) {
        return this.getColorThemes().then(function (allThemes) {
            var defaultTheme = void 0;
            for (var _i = 0, allThemes_1 = allThemes; _i < allThemes_1.length; _i++) {
                var t = allThemes_1[_i];
                if (t.id === themeId) {
                    return t;
                }
                if (t.id === defaultId) {
                    defaultTheme = t;
                }
            }
            return defaultTheme;
        });
    };
    ColorThemeStore.prototype.findThemeDataBySettingsId = function (settingsId, defaultId) {
        return this.getColorThemes().then(function (allThemes) {
            var defaultTheme = void 0;
            for (var _i = 0, allThemes_2 = allThemes; _i < allThemes_2.length; _i++) {
                var t = allThemes_2[_i];
                if (t.settingsId === settingsId) {
                    return t;
                }
                if (t.id === defaultId) {
                    defaultTheme = t;
                }
            }
            return defaultTheme;
        });
    };
    ColorThemeStore.prototype.getColorThemes = function () {
        var _this = this;
        return this.extensionService.whenInstalledExtensionsRegistered().then(function (isReady) {
            return _this.extensionsColorThemes;
        });
    };
    ColorThemeStore = __decorate([
        __param(0, IExtensionService)
    ], ColorThemeStore);
    return ColorThemeStore;
}());
export { ColorThemeStore };
