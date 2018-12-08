/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as Paths from '../../../../base/common/paths.js';
import * as Json from '../../../../base/common/json.js';
import { Color } from '../../../../base/common/color.js';
import { VS_LIGHT_THEME, VS_HC_THEME } from '../common/workbenchThemeService.js';
import { convertSettings } from './themeCompatibility.js';
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import * as objects from '../../../../base/common/objects.js';
import * as resources from '../../../../base/common/resources.js';
import { Extensions, editorBackground, editorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
var colorRegistry = Registry.as(Extensions.ColorContribution);
var tokenGroupToScopesMap = {
    comments: ['comment'],
    strings: ['string'],
    keywords: ['keyword - keyword.operator', 'keyword.control', 'storage', 'storage.type'],
    numbers: ['constant.numeric'],
    types: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
    functions: ['entity.name.function', 'support.function'],
    variables: ['variable', 'entity.name.variable']
};
var ColorThemeData = /** @class */ (function () {
    function ColorThemeData() {
        this.themeTokenColors = [];
        this.customTokenColors = [];
        this.colorMap = {};
        this.customColorMap = {};
    }
    Object.defineProperty(ColorThemeData.prototype, "tokenColors", {
        get: function () {
            // Add the custom colors after the theme colors
            // so that they will override them
            return this.themeTokenColors.concat(this.customTokenColors);
        },
        enumerable: true,
        configurable: true
    });
    ColorThemeData.prototype.getColor = function (colorId, useDefault) {
        var color = this.customColorMap[colorId];
        if (color) {
            return color;
        }
        color = this.colorMap[colorId];
        if (useDefault !== false && types.isUndefined(color)) {
            color = this.getDefault(colorId);
        }
        return color;
    };
    ColorThemeData.prototype.getDefault = function (colorId) {
        return colorRegistry.resolveDefaultColor(colorId, this);
    };
    ColorThemeData.prototype.defines = function (colorId) {
        return this.customColorMap.hasOwnProperty(colorId) || this.colorMap.hasOwnProperty(colorId);
    };
    ColorThemeData.prototype.setCustomColors = function (colors) {
        this.customColorMap = {};
        this.overwriteCustomColors(colors);
        var themeSpecificColors = colors["[" + this.settingsId + "]"];
        if (types.isObject(themeSpecificColors)) {
            this.overwriteCustomColors(themeSpecificColors);
        }
        if (this.themeTokenColors && this.themeTokenColors.length) {
            updateDefaultRuleSettings(this.themeTokenColors[0], this);
        }
    };
    ColorThemeData.prototype.overwriteCustomColors = function (colors) {
        for (var id in colors) {
            var colorVal = colors[id];
            if (typeof colorVal === 'string') {
                this.customColorMap[id] = Color.fromHex(colorVal);
            }
        }
    };
    ColorThemeData.prototype.setCustomTokenColors = function (customTokenColors) {
        this.customTokenColors = [];
        // first add the non-theme specific settings
        this.addCustomTokenColors(customTokenColors);
        // append theme specific settings. Last rules will win.
        var themeSpecificTokenColors = customTokenColors["[" + this.settingsId + "]"];
        if (types.isObject(themeSpecificTokenColors)) {
            this.addCustomTokenColors(themeSpecificTokenColors);
        }
    };
    ColorThemeData.prototype.addCustomTokenColors = function (customTokenColors) {
        // Put the general customizations such as comments, strings, etc. first so that
        // they can be overridden by specific customizations like "string.interpolated"
        for (var tokenGroup in tokenGroupToScopesMap) {
            var value = customTokenColors[tokenGroup];
            if (value) {
                var settings = typeof value === 'string' ? { foreground: value } : value;
                var scopes = tokenGroupToScopesMap[tokenGroup];
                for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
                    var scope = scopes_1[_i];
                    this.customTokenColors.push({ scope: scope, settings: settings });
                }
            }
        }
        // specific customizations
        if (Array.isArray(customTokenColors.textMateRules)) {
            for (var _a = 0, _b = customTokenColors.textMateRules; _a < _b.length; _a++) {
                var rule = _b[_a];
                if (rule.scope && rule.settings) {
                    this.customTokenColors.push(rule);
                }
            }
        }
    };
    ColorThemeData.prototype.ensureLoaded = function (fileService) {
        var _this = this;
        if (!this.isLoaded) {
            if (this.location) {
                return _loadColorTheme(fileService, this.location, this.themeTokenColors, this.colorMap).then(function (_) {
                    _this.isLoaded = true;
                    _this.sanitizeTokenColors();
                });
            }
        }
        return Promise.resolve(null);
    };
    /**
     * Place the default settings first and add the token-info rules
     */
    ColorThemeData.prototype.sanitizeTokenColors = function () {
        var hasDefaultTokens = false;
        var updatedTokenColors = [updateDefaultRuleSettings({ settings: {} }, this)];
        this.themeTokenColors.forEach(function (rule) {
            if (rule.scope && rule.settings) {
                if (rule.scope === 'token.info-token') {
                    hasDefaultTokens = true;
                }
                updatedTokenColors.push(rule);
            }
        });
        if (!hasDefaultTokens) {
            updatedTokenColors.push.apply(updatedTokenColors, defaultThemeColors[this.type]);
        }
        this.themeTokenColors = updatedTokenColors;
    };
    ColorThemeData.prototype.toStorageData = function () {
        var colorMapData = {};
        for (var key in this.colorMap) {
            colorMapData[key] = Color.Format.CSS.formatHexA(this.colorMap[key], true);
        }
        // no need to persist custom colors, they will be taken from the settings
        return JSON.stringify({
            id: this.id,
            label: this.label,
            settingsId: this.settingsId,
            selector: this.id.split(' ').join('.'),
            themeTokenColors: this.themeTokenColors,
            extensionData: this.extensionData,
            colorMap: colorMapData
        });
    };
    ColorThemeData.prototype.hasEqualData = function (other) {
        return objects.equals(this.colorMap, other.colorMap) && objects.equals(this.tokenColors, other.tokenColors);
    };
    Object.defineProperty(ColorThemeData.prototype, "baseTheme", {
        get: function () {
            return this.id.split(' ')[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorThemeData.prototype, "type", {
        get: function () {
            switch (this.baseTheme) {
                case VS_LIGHT_THEME: return 'light';
                case VS_HC_THEME: return 'hc';
                default: return 'dark';
            }
        },
        enumerable: true,
        configurable: true
    });
    // constructors
    ColorThemeData.createUnloadedTheme = function (id) {
        var themeData = new ColorThemeData();
        themeData.id = id;
        themeData.label = '';
        themeData.settingsId = null;
        themeData.isLoaded = false;
        themeData.themeTokenColors = [{ settings: {} }];
        return themeData;
    };
    ColorThemeData.createLoadedEmptyTheme = function (id, settingsId) {
        var themeData = new ColorThemeData();
        themeData.id = id;
        themeData.label = '';
        themeData.settingsId = settingsId;
        themeData.isLoaded = true;
        themeData.themeTokenColors = [{ settings: {} }];
        return themeData;
    };
    ColorThemeData.fromStorageData = function (input) {
        try {
            var data = JSON.parse(input);
            var theme = new ColorThemeData();
            for (var key in data) {
                switch (key) {
                    case 'colorMap':
                        var colorMapData = data[key];
                        for (var id in colorMapData) {
                            theme.colorMap[id] = Color.fromHex(colorMapData[id]);
                        }
                        break;
                    case 'themeTokenColors':
                    case 'id':
                    case 'label':
                    case 'settingsId':
                    case 'extensionData':
                        theme[key] = data[key];
                        break;
                }
            }
            return theme;
        }
        catch (e) {
            return null;
        }
    };
    ColorThemeData.fromExtensionTheme = function (theme, colorThemeLocation, extensionData) {
        var baseTheme = theme['uiTheme'] || 'vs-dark';
        var themeSelector = toCSSSelector(extensionData.extensionId + '-' + Paths.normalize(theme.path));
        var themeData = new ColorThemeData();
        themeData.id = baseTheme + " " + themeSelector;
        themeData.label = theme.label || Paths.basename(theme.path);
        themeData.settingsId = theme.id || themeData.label;
        themeData.description = theme.description;
        themeData.location = colorThemeLocation;
        themeData.extensionData = extensionData;
        themeData.isLoaded = false;
        return themeData;
    };
    return ColorThemeData;
}());
export { ColorThemeData };
function toCSSSelector(str) {
    str = str.replace(/[^_\-a-zA-Z0-9]/g, '-');
    if (str.charAt(0).match(/[0-9\-]/)) {
        str = '_' + str;
    }
    return str;
}
function _loadColorTheme(fileService, themeLocation, resultRules, resultColors) {
    if (Paths.extname(themeLocation.path) === '.json') {
        return fileService.resolveContent(themeLocation, { encoding: 'utf8' }).then(function (content) {
            var errors = [];
            var contentValue = Json.parse(content.value.toString(), errors);
            if (errors.length > 0) {
                return Promise.reject(new Error(nls.localize('error.cannotparsejson', "Problems parsing JSON theme file: {0}", errors.map(function (e) { return getParseErrorMessage(e.error); }).join(', '))));
            }
            var includeCompletes = Promise.resolve(null);
            if (contentValue.include) {
                includeCompletes = _loadColorTheme(fileService, resources.joinPath(resources.dirname(themeLocation), contentValue.include), resultRules, resultColors);
            }
            return includeCompletes.then(function (_) {
                if (Array.isArray(contentValue.settings)) {
                    convertSettings(contentValue.settings, resultRules, resultColors);
                    return null;
                }
                var colors = contentValue.colors;
                if (colors) {
                    if (typeof colors !== 'object') {
                        return Promise.reject(new Error(nls.localize({ key: 'error.invalidformat.colors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'colors' is not of type 'object'.", themeLocation.toString())));
                    }
                    // new JSON color themes format
                    for (var colorId in colors) {
                        var colorHex = colors[colorId];
                        if (typeof colorHex === 'string') { // ignore colors tht are null
                            resultColors[colorId] = Color.fromHex(colors[colorId]);
                        }
                    }
                }
                var tokenColors = contentValue.tokenColors;
                if (tokenColors) {
                    if (Array.isArray(tokenColors)) {
                        resultRules.push.apply(resultRules, tokenColors);
                        return null;
                    }
                    else if (typeof tokenColors === 'string') {
                        return _loadSyntaxTokens(fileService, resources.joinPath(resources.dirname(themeLocation), tokenColors), resultRules, {});
                    }
                    else {
                        return Promise.reject(new Error(nls.localize({ key: 'error.invalidformat.tokenColors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'tokenColors' should be either an array specifying colors or a path to a TextMate theme file", themeLocation.toString())));
                    }
                }
                return null;
            });
        });
    }
    else {
        return _loadSyntaxTokens(fileService, themeLocation, resultRules, resultColors);
    }
}
var pListParser;
function getPListParser() {
    return pListParser || import('fast-plist.js');
}
function _loadSyntaxTokens(fileService, themeLocation, resultRules, resultColors) {
    return fileService.resolveContent(themeLocation, { encoding: 'utf8' }).then(function (content) {
        return getPListParser().then(function (parser) {
            try {
                var contentValue = parser.parse(content.value.toString());
                var settings = contentValue.settings;
                if (!Array.isArray(settings)) {
                    return Promise.reject(new Error(nls.localize('error.plist.invalidformat', "Problem parsing tmTheme file: {0}. 'settings' is not array.")));
                }
                convertSettings(settings, resultRules, resultColors);
                return Promise.resolve(null);
            }
            catch (e) {
                return Promise.reject(new Error(nls.localize('error.cannotparse', "Problems parsing tmTheme file: {0}", e.message)));
            }
        });
    }, function (error) {
        return Promise.reject(new Error(nls.localize('error.cannotload', "Problems loading tmTheme file {0}: {1}", themeLocation.toString(), error.message)));
    });
}
function updateDefaultRuleSettings(defaultRule, theme) {
    var foreground = theme.getColor(editorForeground) || theme.getDefault(editorForeground);
    var background = theme.getColor(editorBackground) || theme.getDefault(editorBackground);
    defaultRule.settings.foreground = Color.Format.CSS.formatHexA(foreground);
    defaultRule.settings.background = Color.Format.CSS.formatHexA(background);
    return defaultRule;
}
var defaultThemeColors = {
    'light': [
        { scope: 'token.info-token', settings: { foreground: '#316bcd' } },
        { scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
        { scope: 'token.error-token', settings: { foreground: '#cd3131' } },
        { scope: 'token.debug-token', settings: { foreground: '#800080' } }
    ],
    'dark': [
        { scope: 'token.info-token', settings: { foreground: '#6796e6' } },
        { scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
        { scope: 'token.error-token', settings: { foreground: '#f44747' } },
        { scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
    ],
    'hc': [
        { scope: 'token.info-token', settings: { foreground: '#6796e6' } },
        { scope: 'token.warn-token', settings: { foreground: '#008000' } },
        { scope: 'token.error-token', settings: { foreground: '#FF0000' } },
        { scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
    ],
};
