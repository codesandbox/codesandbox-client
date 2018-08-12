/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Color } from '../../../../base/common/color';
var ParsedTokenThemeRule = /** @class */ (function () {
    function ParsedTokenThemeRule(token, index, fontStyle, foreground, background) {
        this.token = token;
        this.index = index;
        this.fontStyle = fontStyle;
        this.foreground = foreground;
        this.background = background;
    }
    return ParsedTokenThemeRule;
}());
export { ParsedTokenThemeRule };
/**
 * Parse a raw theme into rules.
 */
export function parseTokenTheme(source) {
    if (!source || !Array.isArray(source)) {
        return [];
    }
    var result = [], resultLen = 0;
    for (var i = 0, len = source.length; i < len; i++) {
        var entry = source[i];
        var fontStyle = -1 /* NotSet */;
        if (typeof entry.fontStyle === 'string') {
            fontStyle = 0 /* None */;
            var segments = entry.fontStyle.split(' ');
            for (var j = 0, lenJ = segments.length; j < lenJ; j++) {
                var segment = segments[j];
                switch (segment) {
                    case 'italic':
                        fontStyle = fontStyle | 1 /* Italic */;
                        break;
                    case 'bold':
                        fontStyle = fontStyle | 2 /* Bold */;
                        break;
                    case 'underline':
                        fontStyle = fontStyle | 4 /* Underline */;
                        break;
                }
            }
        }
        var foreground = null;
        if (typeof entry.foreground === 'string') {
            foreground = entry.foreground;
        }
        var background = null;
        if (typeof entry.background === 'string') {
            background = entry.background;
        }
        result[resultLen++] = new ParsedTokenThemeRule(entry.token || '', i, fontStyle, foreground, background);
    }
    return result;
}
/**
 * Resolve rules (i.e. inheritance).
 */
function resolveParsedTokenThemeRules(parsedThemeRules, customTokenColors) {
    // Sort rules lexicographically, and then by index if necessary
    parsedThemeRules.sort(function (a, b) {
        var r = strcmp(a.token, b.token);
        if (r !== 0) {
            return r;
        }
        return a.index - b.index;
    });
    // Determine defaults
    var defaultFontStyle = 0 /* None */;
    var defaultForeground = '000000';
    var defaultBackground = 'ffffff';
    while (parsedThemeRules.length >= 1 && parsedThemeRules[0].token === '') {
        var incomingDefaults = parsedThemeRules.shift();
        if (incomingDefaults.fontStyle !== -1 /* NotSet */) {
            defaultFontStyle = incomingDefaults.fontStyle;
        }
        if (incomingDefaults.foreground !== null) {
            defaultForeground = incomingDefaults.foreground;
        }
        if (incomingDefaults.background !== null) {
            defaultBackground = incomingDefaults.background;
        }
    }
    var colorMap = new ColorMap();
    // start with token colors from custom token themes
    for (var _i = 0, customTokenColors_1 = customTokenColors; _i < customTokenColors_1.length; _i++) {
        var color = customTokenColors_1[_i];
        colorMap.getId(color);
    }
    var foregroundColorId = colorMap.getId(defaultForeground);
    var backgroundColorId = colorMap.getId(defaultBackground);
    var defaults = new ThemeTrieElementRule(defaultFontStyle, foregroundColorId, backgroundColorId);
    var root = new ThemeTrieElement(defaults);
    for (var i = 0, len = parsedThemeRules.length; i < len; i++) {
        var rule = parsedThemeRules[i];
        root.insert(rule.token, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
    }
    return new TokenTheme(colorMap, root);
}
var colorRegExp = /^#?([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/;
var ColorMap = /** @class */ (function () {
    function ColorMap() {
        this._lastColorId = 0;
        this._id2color = [];
        this._color2id = new Map();
    }
    ColorMap.prototype.getId = function (color) {
        if (color === null) {
            return 0;
        }
        var match = color.match(colorRegExp);
        if (!match) {
            throw new Error('Illegal value for token color: ' + color);
        }
        color = match[1].toUpperCase();
        var value = this._color2id.get(color);
        if (value) {
            return value;
        }
        value = ++this._lastColorId;
        this._color2id.set(color, value);
        this._id2color[value] = Color.fromHex('#' + color);
        return value;
    };
    ColorMap.prototype.getColorMap = function () {
        return this._id2color.slice(0);
    };
    return ColorMap;
}());
export { ColorMap };
var TokenTheme = /** @class */ (function () {
    function TokenTheme(colorMap, root) {
        this._colorMap = colorMap;
        this._root = root;
        this._cache = new Map();
    }
    TokenTheme.createFromRawTokenTheme = function (source, customTokenColors) {
        return this.createFromParsedTokenTheme(parseTokenTheme(source), customTokenColors);
    };
    TokenTheme.createFromParsedTokenTheme = function (source, customTokenColors) {
        return resolveParsedTokenThemeRules(source, customTokenColors);
    };
    TokenTheme.prototype.getColorMap = function () {
        return this._colorMap.getColorMap();
    };
    /**
     * used for testing purposes
     */
    TokenTheme.prototype.getThemeTrieElement = function () {
        return this._root.toExternalThemeTrieElement();
    };
    TokenTheme.prototype._match = function (token) {
        return this._root.match(token);
    };
    TokenTheme.prototype.match = function (languageId, token) {
        // The cache contains the metadata without the language bits set.
        var result = this._cache.get(token);
        if (typeof result === 'undefined') {
            var rule = this._match(token);
            var standardToken = toStandardTokenType(token);
            result = (rule.metadata
                | (standardToken << 8 /* TOKEN_TYPE_OFFSET */)) >>> 0;
            this._cache.set(token, result);
        }
        return (result
            | (languageId << 0 /* LANGUAGEID_OFFSET */)) >>> 0;
    };
    return TokenTheme;
}());
export { TokenTheme };
var STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex)\b/;
export function toStandardTokenType(tokenType) {
    var m = tokenType.match(STANDARD_TOKEN_TYPE_REGEXP);
    if (!m) {
        return 0 /* Other */;
    }
    switch (m[1]) {
        case 'comment':
            return 1 /* Comment */;
        case 'string':
            return 2 /* String */;
        case 'regex':
            return 4 /* RegEx */;
    }
    throw new Error('Unexpected match for standard token type!');
}
export function strcmp(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
var ThemeTrieElementRule = /** @class */ (function () {
    function ThemeTrieElementRule(fontStyle, foreground, background) {
        this._fontStyle = fontStyle;
        this._foreground = foreground;
        this._background = background;
        this.metadata = ((this._fontStyle << 11 /* FONT_STYLE_OFFSET */)
            | (this._foreground << 14 /* FOREGROUND_OFFSET */)
            | (this._background << 23 /* BACKGROUND_OFFSET */)) >>> 0;
    }
    ThemeTrieElementRule.prototype.clone = function () {
        return new ThemeTrieElementRule(this._fontStyle, this._foreground, this._background);
    };
    ThemeTrieElementRule.prototype.acceptOverwrite = function (fontStyle, foreground, background) {
        if (fontStyle !== -1 /* NotSet */) {
            this._fontStyle = fontStyle;
        }
        if (foreground !== 0 /* None */) {
            this._foreground = foreground;
        }
        if (background !== 0 /* None */) {
            this._background = background;
        }
        this.metadata = ((this._fontStyle << 11 /* FONT_STYLE_OFFSET */)
            | (this._foreground << 14 /* FOREGROUND_OFFSET */)
            | (this._background << 23 /* BACKGROUND_OFFSET */)) >>> 0;
    };
    return ThemeTrieElementRule;
}());
export { ThemeTrieElementRule };
var ExternalThemeTrieElement = /** @class */ (function () {
    function ExternalThemeTrieElement(mainRule, children) {
        this.mainRule = mainRule;
        this.children = children || Object.create(null);
    }
    return ExternalThemeTrieElement;
}());
export { ExternalThemeTrieElement };
var ThemeTrieElement = /** @class */ (function () {
    function ThemeTrieElement(mainRule) {
        this._mainRule = mainRule;
        this._children = new Map();
    }
    /**
     * used for testing purposes
     */
    ThemeTrieElement.prototype.toExternalThemeTrieElement = function () {
        var children = Object.create(null);
        this._children.forEach(function (element, index) {
            children[index] = element.toExternalThemeTrieElement();
        });
        return new ExternalThemeTrieElement(this._mainRule, children);
    };
    ThemeTrieElement.prototype.match = function (token) {
        if (token === '') {
            return this._mainRule;
        }
        var dotIndex = token.indexOf('.');
        var head;
        var tail;
        if (dotIndex === -1) {
            head = token;
            tail = '';
        }
        else {
            head = token.substring(0, dotIndex);
            tail = token.substring(dotIndex + 1);
        }
        var child = this._children.get(head);
        if (typeof child !== 'undefined') {
            return child.match(tail);
        }
        return this._mainRule;
    };
    ThemeTrieElement.prototype.insert = function (token, fontStyle, foreground, background) {
        if (token === '') {
            // Merge into the main rule
            this._mainRule.acceptOverwrite(fontStyle, foreground, background);
            return;
        }
        var dotIndex = token.indexOf('.');
        var head;
        var tail;
        if (dotIndex === -1) {
            head = token;
            tail = '';
        }
        else {
            head = token.substring(0, dotIndex);
            tail = token.substring(dotIndex + 1);
        }
        var child = this._children.get(head);
        if (typeof child === 'undefined') {
            child = new ThemeTrieElement(this._mainRule.clone());
            this._children.set(head, child);
        }
        child.insert(tail, fontStyle, foreground, background);
    };
    return ThemeTrieElement;
}());
export { ThemeTrieElement };
export function generateTokensCSSForColorMap(colorMap) {
    var rules = [];
    for (var i = 1, len = colorMap.length; i < len; i++) {
        var color = colorMap[i];
        rules[i] = ".mtk" + i + " { color: " + color + "; }";
    }
    rules.push('.mtki { font-style: italic; }');
    rules.push('.mtkb { font-weight: bold; }');
    rules.push('.mtku { text-decoration: underline; text-underline-position: under; }');
    return rules.join('\n');
}
