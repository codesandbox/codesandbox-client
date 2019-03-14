/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ParsedThemeRule = /** @class */ (function () {
    function ParsedThemeRule(scope, parentScopes, index, fontStyle, foreground, background) {
        this.scope = scope;
        this.parentScopes = parentScopes;
        this.index = index;
        this.fontStyle = fontStyle;
        this.foreground = foreground;
        this.background = background;
    }
    return ParsedThemeRule;
}());
exports.ParsedThemeRule = ParsedThemeRule;
function isValidHexColor(hex) {
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
        // #rrggbb
        return true;
    }
    if (/^#[0-9a-f]{8}$/i.test(hex)) {
        // #rrggbbaa
        return true;
    }
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
        // #rgb
        return true;
    }
    if (/^#[0-9a-f]{4}$/i.test(hex)) {
        // #rgba
        return true;
    }
    return false;
}
/**
 * Parse a raw theme into rules.
 */
function parseTheme(source) {
    if (!source) {
        return [];
    }
    if (!source.settings || !Array.isArray(source.settings)) {
        return [];
    }
    var settings = source.settings;
    var result = [], resultLen = 0;
    for (var i = 0, len = settings.length; i < len; i++) {
        var entry = settings[i];
        if (!entry.settings) {
            continue;
        }
        var scopes = void 0;
        if (typeof entry.scope === 'string') {
            var _scope = entry.scope;
            // remove leading commas
            _scope = _scope.replace(/^[,]+/, '');
            // remove trailing commans
            _scope = _scope.replace(/[,]+$/, '');
            scopes = _scope.split(',');
        }
        else if (Array.isArray(entry.scope)) {
            scopes = entry.scope;
        }
        else {
            scopes = [''];
        }
        var fontStyle = -1 /* NotSet */;
        if (typeof entry.settings.fontStyle === 'string') {
            fontStyle = 0 /* None */;
            var segments = entry.settings.fontStyle.split(' ');
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
        if (typeof entry.settings.foreground === 'string' && isValidHexColor(entry.settings.foreground)) {
            foreground = entry.settings.foreground;
        }
        var background = null;
        if (typeof entry.settings.background === 'string' && isValidHexColor(entry.settings.background)) {
            background = entry.settings.background;
        }
        for (var j = 0, lenJ = scopes.length; j < lenJ; j++) {
            var _scope = scopes[j].trim();
            var segments = _scope.split(' ');
            var scope = segments[segments.length - 1];
            var parentScopes = null;
            if (segments.length > 1) {
                parentScopes = segments.slice(0, segments.length - 1);
                parentScopes.reverse();
            }
            result[resultLen++] = new ParsedThemeRule(scope, parentScopes, i, fontStyle, foreground, background);
        }
    }
    return result;
}
exports.parseTheme = parseTheme;
/**
 * Resolve rules (i.e. inheritance).
 */
function resolveParsedThemeRules(parsedThemeRules) {
    // Sort rules lexicographically, and then by index if necessary
    parsedThemeRules.sort(function (a, b) {
        var r = strcmp(a.scope, b.scope);
        if (r !== 0) {
            return r;
        }
        r = strArrCmp(a.parentScopes, b.parentScopes);
        if (r !== 0) {
            return r;
        }
        return a.index - b.index;
    });
    // Determine defaults
    var defaultFontStyle = 0 /* None */;
    var defaultForeground = '#000000';
    var defaultBackground = '#ffffff';
    while (parsedThemeRules.length >= 1 && parsedThemeRules[0].scope === '') {
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
    var defaults = new ThemeTrieElementRule(0, null, defaultFontStyle, colorMap.getId(defaultForeground), colorMap.getId(defaultBackground));
    var root = new ThemeTrieElement(new ThemeTrieElementRule(0, null, -1 /* NotSet */, 0, 0), []);
    for (var i = 0, len = parsedThemeRules.length; i < len; i++) {
        var rule = parsedThemeRules[i];
        root.insert(0, rule.scope, rule.parentScopes, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
    }
    return new Theme(colorMap, defaults, root);
}
var ColorMap = /** @class */ (function () {
    function ColorMap() {
        this._lastColorId = 0;
        this._id2color = [];
        this._color2id = Object.create(null);
    }
    ColorMap.prototype.getId = function (color) {
        if (color === null) {
            return 0;
        }
        color = color.toUpperCase();
        var value = this._color2id[color];
        if (value) {
            return value;
        }
        value = ++this._lastColorId;
        this._color2id[color] = value;
        this._id2color[value] = color;
        return value;
    };
    ColorMap.prototype.getColorMap = function () {
        return this._id2color.slice(0);
    };
    return ColorMap;
}());
exports.ColorMap = ColorMap;
var Theme = /** @class */ (function () {
    function Theme(colorMap, defaults, root) {
        this._colorMap = colorMap;
        this._root = root;
        this._defaults = defaults;
        this._cache = {};
    }
    Theme.createFromRawTheme = function (source) {
        return this.createFromParsedTheme(parseTheme(source));
    };
    Theme.createFromParsedTheme = function (source) {
        return resolveParsedThemeRules(source);
    };
    Theme.prototype.getColorMap = function () {
        return this._colorMap.getColorMap();
    };
    Theme.prototype.getDefaults = function () {
        return this._defaults;
    };
    Theme.prototype.match = function (scopeName) {
        if (!this._cache.hasOwnProperty(scopeName)) {
            this._cache[scopeName] = this._root.match(scopeName);
        }
        return this._cache[scopeName];
    };
    return Theme;
}());
exports.Theme = Theme;
function strcmp(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
exports.strcmp = strcmp;
function strArrCmp(a, b) {
    if (a === null && b === null) {
        return 0;
    }
    if (!a) {
        return -1;
    }
    if (!b) {
        return 1;
    }
    var len1 = a.length;
    var len2 = b.length;
    if (len1 === len2) {
        for (var i = 0; i < len1; i++) {
            var res = strcmp(a[i], b[i]);
            if (res !== 0) {
                return res;
            }
        }
        return 0;
    }
    return len1 - len2;
}
exports.strArrCmp = strArrCmp;
var ThemeTrieElementRule = /** @class */ (function () {
    function ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background) {
        this.scopeDepth = scopeDepth;
        this.parentScopes = parentScopes;
        this.fontStyle = fontStyle;
        this.foreground = foreground;
        this.background = background;
    }
    ThemeTrieElementRule.prototype.clone = function () {
        return new ThemeTrieElementRule(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
    };
    ThemeTrieElementRule.cloneArr = function (arr) {
        var r = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            r[i] = arr[i].clone();
        }
        return r;
    };
    ThemeTrieElementRule.prototype.acceptOverwrite = function (scopeDepth, fontStyle, foreground, background) {
        if (this.scopeDepth > scopeDepth) {
            console.log('how did this happen?');
        }
        else {
            this.scopeDepth = scopeDepth;
        }
        // console.log('TODO -> my depth: ' + this.scopeDepth + ', overwriting depth: ' + scopeDepth);
        if (fontStyle !== -1 /* NotSet */) {
            this.fontStyle = fontStyle;
        }
        if (foreground !== 0) {
            this.foreground = foreground;
        }
        if (background !== 0) {
            this.background = background;
        }
    };
    return ThemeTrieElementRule;
}());
exports.ThemeTrieElementRule = ThemeTrieElementRule;
var ThemeTrieElement = /** @class */ (function () {
    function ThemeTrieElement(mainRule, rulesWithParentScopes, children) {
        if (rulesWithParentScopes === void 0) { rulesWithParentScopes = []; }
        if (children === void 0) { children = {}; }
        this._mainRule = mainRule;
        this._rulesWithParentScopes = rulesWithParentScopes;
        this._children = children;
    }
    ThemeTrieElement._sortBySpecificity = function (arr) {
        if (arr.length === 1) {
            return arr;
        }
        arr.sort(this._cmpBySpecificity);
        return arr;
    };
    ThemeTrieElement._cmpBySpecificity = function (a, b) {
        if (a.scopeDepth === b.scopeDepth) {
            var aParentScopes = a.parentScopes;
            var bParentScopes = b.parentScopes;
            var aParentScopesLen = aParentScopes === null ? 0 : aParentScopes.length;
            var bParentScopesLen = bParentScopes === null ? 0 : bParentScopes.length;
            if (aParentScopesLen === bParentScopesLen) {
                for (var i = 0; i < aParentScopesLen; i++) {
                    var aLen = aParentScopes[i].length;
                    var bLen = bParentScopes[i].length;
                    if (aLen !== bLen) {
                        return bLen - aLen;
                    }
                }
            }
            return bParentScopesLen - aParentScopesLen;
        }
        return b.scopeDepth - a.scopeDepth;
    };
    ThemeTrieElement.prototype.match = function (scope) {
        if (scope === '') {
            return ThemeTrieElement._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
        }
        var dotIndex = scope.indexOf('.');
        var head;
        var tail;
        if (dotIndex === -1) {
            head = scope;
            tail = '';
        }
        else {
            head = scope.substring(0, dotIndex);
            tail = scope.substring(dotIndex + 1);
        }
        if (this._children.hasOwnProperty(head)) {
            return this._children[head].match(tail);
        }
        return ThemeTrieElement._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
    };
    ThemeTrieElement.prototype.insert = function (scopeDepth, scope, parentScopes, fontStyle, foreground, background) {
        if (scope === '') {
            this._doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background);
            return;
        }
        var dotIndex = scope.indexOf('.');
        var head;
        var tail;
        if (dotIndex === -1) {
            head = scope;
            tail = '';
        }
        else {
            head = scope.substring(0, dotIndex);
            tail = scope.substring(dotIndex + 1);
        }
        var child;
        if (this._children.hasOwnProperty(head)) {
            child = this._children[head];
        }
        else {
            child = new ThemeTrieElement(this._mainRule.clone(), ThemeTrieElementRule.cloneArr(this._rulesWithParentScopes));
            this._children[head] = child;
        }
        child.insert(scopeDepth + 1, tail, parentScopes, fontStyle, foreground, background);
    };
    ThemeTrieElement.prototype._doInsertHere = function (scopeDepth, parentScopes, fontStyle, foreground, background) {
        if (parentScopes === null) {
            // Merge into the main rule
            this._mainRule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
            return;
        }
        // Try to merge into existing rule
        for (var i = 0, len = this._rulesWithParentScopes.length; i < len; i++) {
            var rule = this._rulesWithParentScopes[i];
            if (strArrCmp(rule.parentScopes, parentScopes) === 0) {
                // bingo! => we get to merge this into an existing one
                rule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
                return;
            }
        }
        // Must add a new rule
        // Inherit from main rule
        if (fontStyle === -1 /* NotSet */) {
            fontStyle = this._mainRule.fontStyle;
        }
        if (foreground === 0) {
            foreground = this._mainRule.foreground;
        }
        if (background === 0) {
            background = this._mainRule.background;
        }
        this._rulesWithParentScopes.push(new ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background));
    };
    return ThemeTrieElement;
}());
exports.ThemeTrieElement = ThemeTrieElement;
//# sourceMappingURL=theme.js.map