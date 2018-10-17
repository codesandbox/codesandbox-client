/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
import { TokenTheme, generateTokensCSSForColorMap } from "../../common/modes/supports/tokenization.js";
import { vs, vs_dark, hc_black } from "../common/themes.js";
import * as dom from "../../../base/browser/dom.js";
import { TokenizationRegistry } from "../../common/modes.js";
import { Color } from "../../../base/common/color.js";
import { Extensions } from "../../../platform/theme/common/colorRegistry.js";
import { Extensions as ThemingExtensions } from "../../../platform/theme/common/themeService.js";
import { Registry } from "../../../platform/registry/common/platform.js";
import { Emitter } from "../../../base/common/event.js";
var VS_THEME_NAME = "vs";
var VS_DARK_THEME_NAME = "vs-dark";
var HC_BLACK_THEME_NAME = "hc-black";
var colorRegistry = Registry.as(Extensions.ColorContribution);
var themingRegistry = Registry.as(ThemingExtensions.ThemingContribution);
var StandaloneTheme = /** @class */ (function () {
    function StandaloneTheme(name, standaloneThemeData) {
        this.themeData = standaloneThemeData;
        var base = standaloneThemeData.base;
        if (name.length > 0) {
            this.id = base + " " + name;
            this.themeName = name;
        }
        else {
            this.id = base;
            this.themeName = base;
        }
        this.colors = null;
        this.defaultColors = Object.create(null);
        this._tokenTheme = null;
    }
    Object.defineProperty(StandaloneTheme.prototype, "base", {
        get: function () {
            return this.themeData.base;
        },
        enumerable: true,
        configurable: true
    });
    StandaloneTheme.prototype.notifyBaseUpdated = function () {
        if (this.themeData.inherit) {
            this.colors = null;
            this._tokenTheme = null;
        }
    };
    StandaloneTheme.prototype.getColors = function () {
        if (!this.colors) {
            var colors = Object.create(null);
            for (var id in this.themeData.colors) {
                colors[id] = Color.fromHex(this.themeData.colors[id]);
            }
            if (this.themeData.inherit) {
                var baseData = getBuiltinRules(this.themeData.base);
                for (var id in baseData.colors) {
                    if (!colors[id]) {
                        colors[id] = Color.fromHex(baseData.colors[id]);
                    }
                }
            }
            this.colors = colors;
        }
        return this.colors;
    };
    StandaloneTheme.prototype.getColor = function (colorId, useDefault) {
        var color = this.getColors()[colorId];
        if (color) {
            return color;
        }
        if (useDefault !== false) {
            return this.getDefault(colorId);
        }
        return null;
    };
    StandaloneTheme.prototype.getDefault = function (colorId) {
        var color = this.defaultColors[colorId];
        if (color) {
            return color;
        }
        color = colorRegistry.resolveDefaultColor(colorId, this);
        this.defaultColors[colorId] = color;
        return color;
    };
    StandaloneTheme.prototype.defines = function (colorId) {
        return Object.prototype.hasOwnProperty.call(this.getColors(), colorId);
    };
    Object.defineProperty(StandaloneTheme.prototype, "type", {
        get: function () {
            switch (this.base) {
                case VS_THEME_NAME:
                    return "light";
                case HC_BLACK_THEME_NAME:
                    return "hc";
                default:
                    return "dark";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandaloneTheme.prototype, "tokenTheme", {
        get: function () {
            if (!this._tokenTheme) {
                var rules = [];
                var encodedTokensColors = [];
                if (this.themeData.inherit) {
                    var baseData = getBuiltinRules(this.themeData.base);
                    rules = baseData.rules;
                    if (baseData.encodedTokensColors) {
                        encodedTokensColors = baseData.encodedTokensColors;
                    }
                }
                rules = rules.concat(this.themeData.rules);
                if (this.themeData.encodedTokensColors) {
                    encodedTokensColors = this.themeData.encodedTokensColors;
                }
                this._tokenTheme = TokenTheme.createFromRawTokenTheme(rules, encodedTokensColors);
            }
            return this._tokenTheme;
        },
        enumerable: true,
        configurable: true
    });
    return StandaloneTheme;
}());
function isBuiltinTheme(themeName) {
    return (themeName === VS_THEME_NAME ||
        themeName === VS_DARK_THEME_NAME ||
        themeName === HC_BLACK_THEME_NAME);
}
function getBuiltinRules(builtinTheme) {
    switch (builtinTheme) {
        case VS_THEME_NAME:
            return vs;
        case VS_DARK_THEME_NAME:
            return vs_dark;
        case HC_BLACK_THEME_NAME:
            return hc_black;
    }
}
function newBuiltInTheme(builtinTheme) {
    var themeData = getBuiltinRules(builtinTheme);
    return new StandaloneTheme(builtinTheme, themeData);
}
var StandaloneThemeServiceImpl = /** @class */ (function () {
    function StandaloneThemeServiceImpl() {
        this.environment = Object.create(null);
        this._onThemeChange = new Emitter();
        this._knownThemes = new Map();
        this._knownThemes.set(VS_THEME_NAME, newBuiltInTheme(VS_THEME_NAME));
        this._knownThemes.set(VS_DARK_THEME_NAME, newBuiltInTheme(VS_DARK_THEME_NAME));
        this._knownThemes.set(HC_BLACK_THEME_NAME, newBuiltInTheme(HC_BLACK_THEME_NAME));
        this._styleElement = dom.createStyleSheet();
        this._styleElement.className = "monaco-colors";
        this.setTheme(VS_THEME_NAME);
    }
    Object.defineProperty(StandaloneThemeServiceImpl.prototype, "onThemeChange", {
        get: function () {
            return this._onThemeChange.event;
        },
        enumerable: true,
        configurable: true
    });
    StandaloneThemeServiceImpl.prototype.defineTheme = function (themeName, themeData) {
        if (!/^[a-z0-9\-]+$/i.test(themeName)) {
            throw new Error("Illegal theme name!");
        }
        if (!isBuiltinTheme(themeData.base) && !isBuiltinTheme(themeName)) {
            throw new Error("Illegal theme base!");
        }
        // set or replace theme
        this._knownThemes.set(themeName, new StandaloneTheme(themeName, themeData));
        if (isBuiltinTheme(themeName)) {
            this._knownThemes.forEach(function (theme) {
                if (theme.base === themeName) {
                    theme.notifyBaseUpdated();
                }
            });
        }
        if (this._theme && this._theme.themeName === themeName) {
            this.setTheme(themeName); // refresh theme
        }
    };
    StandaloneThemeServiceImpl.prototype.getTheme = function () {
        return this._theme;
    };
    StandaloneThemeServiceImpl.prototype.setTheme = function (themeName) {
        var _this = this;
        var theme;
        if (this._knownThemes.has(themeName)) {
            theme = this._knownThemes.get(themeName);
        }
        else {
            theme = this._knownThemes.get(VS_THEME_NAME);
        }
        this._theme = theme;
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
        themingRegistry
            .getThemingParticipants()
            .forEach(function (p) { return p(theme, ruleCollector, _this.environment); });
        var tokenTheme = theme.tokenTheme;
        var colorMap = tokenTheme.getColorMap();
        ruleCollector.addRule(generateTokensCSSForColorMap(colorMap));
        this._styleElement.innerHTML = cssRules.join("\n");
        TokenizationRegistry.setColorMap(colorMap);
        this._onThemeChange.fire(theme);
        return theme.id;
    };
    return StandaloneThemeServiceImpl;
}());
export { StandaloneThemeServiceImpl };
