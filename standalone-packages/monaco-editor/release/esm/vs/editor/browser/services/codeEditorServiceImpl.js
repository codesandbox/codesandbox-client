/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import * as strings from '../../../base/common/strings.js';
import URI from '../../../base/common/uri.js';
import * as dom from '../../../base/browser/dom.js';
import { isThemeColor } from '../../common/editorCommon.js';
import { OverviewRulerLane } from '../../common/model.js';
import { AbstractCodeEditorService } from './abstractCodeEditorService.js';
import { dispose as disposeAll } from '../../../base/common/lifecycle.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
var CodeEditorServiceImpl = /** @class */ (function (_super) {
    __extends(CodeEditorServiceImpl, _super);
    function CodeEditorServiceImpl(themeService, styleSheet) {
        if (styleSheet === void 0) { styleSheet = dom.createStyleSheet(); }
        var _this = _super.call(this) || this;
        _this._styleSheet = styleSheet;
        _this._decorationOptionProviders = Object.create(null);
        _this._themeService = themeService;
        return _this;
    }
    CodeEditorServiceImpl.prototype.registerDecorationType = function (key, options, parentTypeKey) {
        var provider = this._decorationOptionProviders[key];
        if (!provider) {
            var providerArgs = {
                styleSheet: this._styleSheet,
                key: key,
                parentTypeKey: parentTypeKey,
                options: options || Object.create(null)
            };
            if (!parentTypeKey) {
                provider = new DecorationTypeOptionsProvider(this._themeService, providerArgs);
            }
            else {
                provider = new DecorationSubTypeOptionsProvider(this._themeService, providerArgs);
            }
            this._decorationOptionProviders[key] = provider;
        }
        provider.refCount++;
    };
    CodeEditorServiceImpl.prototype.removeDecorationType = function (key) {
        var provider = this._decorationOptionProviders[key];
        if (provider) {
            provider.refCount--;
            if (provider.refCount <= 0) {
                delete this._decorationOptionProviders[key];
                provider.dispose();
                this.listCodeEditors().forEach(function (ed) { return ed.removeDecorations(key); });
            }
        }
    };
    CodeEditorServiceImpl.prototype.resolveDecorationOptions = function (decorationTypeKey, writable) {
        var provider = this._decorationOptionProviders[decorationTypeKey];
        if (!provider) {
            throw new Error('Unknown decoration type key: ' + decorationTypeKey);
        }
        return provider.getOptions(this, writable);
    };
    CodeEditorServiceImpl = __decorate([
        __param(0, IThemeService)
    ], CodeEditorServiceImpl);
    return CodeEditorServiceImpl;
}(AbstractCodeEditorService));
export { CodeEditorServiceImpl };
var DecorationSubTypeOptionsProvider = /** @class */ (function () {
    function DecorationSubTypeOptionsProvider(themeService, providerArgs) {
        this._parentTypeKey = providerArgs.parentTypeKey;
        this.refCount = 0;
        this._beforeContentRules = new DecorationCSSRules(3 /* BeforeContentClassName */, providerArgs, themeService);
        this._afterContentRules = new DecorationCSSRules(4 /* AfterContentClassName */, providerArgs, themeService);
    }
    DecorationSubTypeOptionsProvider.prototype.getOptions = function (codeEditorService, writable) {
        var options = codeEditorService.resolveDecorationOptions(this._parentTypeKey, true);
        if (this._beforeContentRules) {
            options.beforeContentClassName = this._beforeContentRules.className;
        }
        if (this._afterContentRules) {
            options.afterContentClassName = this._afterContentRules.className;
        }
        return options;
    };
    DecorationSubTypeOptionsProvider.prototype.dispose = function () {
        if (this._beforeContentRules) {
            this._beforeContentRules.dispose();
            this._beforeContentRules = null;
        }
        if (this._afterContentRules) {
            this._afterContentRules.dispose();
            this._afterContentRules = null;
        }
    };
    return DecorationSubTypeOptionsProvider;
}());
var DecorationTypeOptionsProvider = /** @class */ (function () {
    function DecorationTypeOptionsProvider(themeService, providerArgs) {
        var _this = this;
        this.refCount = 0;
        this._disposables = [];
        var createCSSRules = function (type) {
            var rules = new DecorationCSSRules(type, providerArgs, themeService);
            if (rules.hasContent) {
                _this._disposables.push(rules);
                return rules.className;
            }
            return void 0;
        };
        var createInlineCSSRules = function (type) {
            var rules = new DecorationCSSRules(type, providerArgs, themeService);
            if (rules.hasContent) {
                _this._disposables.push(rules);
                return { className: rules.className, hasLetterSpacing: rules.hasLetterSpacing };
            }
            return null;
        };
        this.className = createCSSRules(0 /* ClassName */);
        var inlineData = createInlineCSSRules(1 /* InlineClassName */);
        if (inlineData) {
            this.inlineClassName = inlineData.className;
            this.inlineClassNameAffectsLetterSpacing = inlineData.hasLetterSpacing;
        }
        this.beforeContentClassName = createCSSRules(3 /* BeforeContentClassName */);
        this.afterContentClassName = createCSSRules(4 /* AfterContentClassName */);
        this.glyphMarginClassName = createCSSRules(2 /* GlyphMarginClassName */);
        var options = providerArgs.options;
        this.isWholeLine = Boolean(options.isWholeLine);
        this.stickiness = options.rangeBehavior;
        var lightOverviewRulerColor = options.light && options.light.overviewRulerColor || options.overviewRulerColor;
        var darkOverviewRulerColor = options.dark && options.dark.overviewRulerColor || options.overviewRulerColor;
        if (typeof lightOverviewRulerColor !== 'undefined'
            || typeof darkOverviewRulerColor !== 'undefined') {
            this.overviewRuler = {
                color: lightOverviewRulerColor || darkOverviewRulerColor,
                darkColor: darkOverviewRulerColor || lightOverviewRulerColor,
                position: options.overviewRulerLane || OverviewRulerLane.Center
            };
        }
    }
    DecorationTypeOptionsProvider.prototype.getOptions = function (codeEditorService, writable) {
        if (!writable) {
            return this;
        }
        return {
            inlineClassName: this.inlineClassName,
            beforeContentClassName: this.beforeContentClassName,
            afterContentClassName: this.afterContentClassName,
            className: this.className,
            glyphMarginClassName: this.glyphMarginClassName,
            isWholeLine: this.isWholeLine,
            overviewRuler: this.overviewRuler,
            stickiness: this.stickiness
        };
    };
    DecorationTypeOptionsProvider.prototype.dispose = function () {
        this._disposables = disposeAll(this._disposables);
    };
    return DecorationTypeOptionsProvider;
}());
var _CSS_MAP = {
    color: 'color:{0} !important;',
    opacity: 'opacity:{0};',
    backgroundColor: 'background-color:{0};',
    outline: 'outline:{0};',
    outlineColor: 'outline-color:{0};',
    outlineStyle: 'outline-style:{0};',
    outlineWidth: 'outline-width:{0};',
    border: 'border:{0};',
    borderColor: 'border-color:{0};',
    borderRadius: 'border-radius:{0};',
    borderSpacing: 'border-spacing:{0};',
    borderStyle: 'border-style:{0};',
    borderWidth: 'border-width:{0};',
    fontStyle: 'font-style:{0};',
    fontWeight: 'font-weight:{0};',
    textDecoration: 'text-decoration:{0};',
    cursor: 'cursor:{0};',
    letterSpacing: 'letter-spacing:{0};',
    gutterIconPath: 'background:url(\'{0}\') center center no-repeat;',
    gutterIconSize: 'background-size:{0};',
    contentText: 'content:\'{0}\';',
    contentIconPath: 'content:url(\'{0}\');',
    margin: 'margin:{0};',
    width: 'width:{0};',
    height: 'height:{0};'
};
var DecorationCSSRules = /** @class */ (function () {
    function DecorationCSSRules(ruleType, providerArgs, themeService) {
        var _this = this;
        this._theme = themeService.getTheme();
        this._ruleType = ruleType;
        this._providerArgs = providerArgs;
        this._usesThemeColors = false;
        this._hasContent = false;
        this._hasLetterSpacing = false;
        var className = CSSNameHelper.getClassName(this._providerArgs.key, ruleType);
        if (this._providerArgs.parentTypeKey) {
            className = className + ' ' + CSSNameHelper.getClassName(this._providerArgs.parentTypeKey, ruleType);
        }
        this._className = className;
        this._unThemedSelector = CSSNameHelper.getSelector(this._providerArgs.key, this._providerArgs.parentTypeKey, ruleType);
        this._buildCSS();
        if (this._usesThemeColors) {
            this._themeListener = themeService.onThemeChange(function (theme) {
                _this._theme = themeService.getTheme();
                _this._removeCSS();
                _this._buildCSS();
            });
        }
    }
    DecorationCSSRules.prototype.dispose = function () {
        if (this._hasContent) {
            this._removeCSS();
            this._hasContent = false;
        }
        if (this._themeListener) {
            this._themeListener.dispose();
            this._themeListener = null;
        }
    };
    Object.defineProperty(DecorationCSSRules.prototype, "hasContent", {
        get: function () {
            return this._hasContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DecorationCSSRules.prototype, "hasLetterSpacing", {
        get: function () {
            return this._hasLetterSpacing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DecorationCSSRules.prototype, "className", {
        get: function () {
            return this._className;
        },
        enumerable: true,
        configurable: true
    });
    DecorationCSSRules.prototype._buildCSS = function () {
        var options = this._providerArgs.options;
        var unthemedCSS, lightCSS, darkCSS;
        switch (this._ruleType) {
            case 0 /* ClassName */:
                unthemedCSS = this.getCSSTextForModelDecorationClassName(options);
                lightCSS = this.getCSSTextForModelDecorationClassName(options.light);
                darkCSS = this.getCSSTextForModelDecorationClassName(options.dark);
                break;
            case 1 /* InlineClassName */:
                unthemedCSS = this.getCSSTextForModelDecorationInlineClassName(options);
                lightCSS = this.getCSSTextForModelDecorationInlineClassName(options.light);
                darkCSS = this.getCSSTextForModelDecorationInlineClassName(options.dark);
                break;
            case 2 /* GlyphMarginClassName */:
                unthemedCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options);
                lightCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options.light);
                darkCSS = this.getCSSTextForModelDecorationGlyphMarginClassName(options.dark);
                break;
            case 3 /* BeforeContentClassName */:
                unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.before);
                lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.before);
                darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.before);
                break;
            case 4 /* AfterContentClassName */:
                unthemedCSS = this.getCSSTextForModelDecorationContentClassName(options.after);
                lightCSS = this.getCSSTextForModelDecorationContentClassName(options.light && options.light.after);
                darkCSS = this.getCSSTextForModelDecorationContentClassName(options.dark && options.dark.after);
                break;
            default:
                throw new Error('Unknown rule type: ' + this._ruleType);
        }
        var sheet = this._providerArgs.styleSheet.sheet;
        var hasContent = false;
        if (unthemedCSS.length > 0) {
            sheet.insertRule(this._unThemedSelector + " {" + unthemedCSS + "}", 0);
            hasContent = true;
        }
        if (lightCSS.length > 0) {
            sheet.insertRule(".vs" + this._unThemedSelector + " {" + lightCSS + "}", 0);
            hasContent = true;
        }
        if (darkCSS.length > 0) {
            sheet.insertRule(".vs-dark" + this._unThemedSelector + ", .hc-black" + this._unThemedSelector + " {" + darkCSS + "}", 0);
            hasContent = true;
        }
        this._hasContent = hasContent;
    };
    DecorationCSSRules.prototype._removeCSS = function () {
        dom.removeCSSRulesContainingSelector(this._unThemedSelector, this._providerArgs.styleSheet);
    };
    /**
     * Build the CSS for decorations styled via `className`.
     */
    DecorationCSSRules.prototype.getCSSTextForModelDecorationClassName = function (opts) {
        if (!opts) {
            return '';
        }
        var cssTextArr = [];
        this.collectCSSText(opts, ['backgroundColor'], cssTextArr);
        this.collectCSSText(opts, ['outline', 'outlineColor', 'outlineStyle', 'outlineWidth'], cssTextArr);
        this.collectBorderSettingsCSSText(opts, cssTextArr);
        return cssTextArr.join('');
    };
    /**
     * Build the CSS for decorations styled via `inlineClassName`.
     */
    DecorationCSSRules.prototype.getCSSTextForModelDecorationInlineClassName = function (opts) {
        if (!opts) {
            return '';
        }
        var cssTextArr = [];
        this.collectCSSText(opts, ['fontStyle', 'fontWeight', 'textDecoration', 'cursor', 'color', 'opacity', 'letterSpacing'], cssTextArr);
        if (opts.letterSpacing) {
            this._hasLetterSpacing = true;
        }
        return cssTextArr.join('');
    };
    /**
     * Build the CSS for decorations styled before or after content.
     */
    DecorationCSSRules.prototype.getCSSTextForModelDecorationContentClassName = function (opts) {
        if (!opts) {
            return '';
        }
        var cssTextArr = [];
        if (typeof opts !== 'undefined') {
            this.collectBorderSettingsCSSText(opts, cssTextArr);
            if (typeof opts.contentIconPath !== 'undefined') {
                if (typeof opts.contentIconPath === 'string') {
                    cssTextArr.push(strings.format(_CSS_MAP.contentIconPath, URI.file(opts.contentIconPath).toString().replace(/'/g, '%27')));
                }
                else {
                    cssTextArr.push(strings.format(_CSS_MAP.contentIconPath, URI.revive(opts.contentIconPath).toString(true).replace(/'/g, '%27')));
                }
            }
            if (typeof opts.contentText === 'string') {
                var truncated = opts.contentText.match(/^.*$/m)[0]; // only take first line
                var escaped = truncated.replace(/['\\]/g, '\\$&');
                cssTextArr.push(strings.format(_CSS_MAP.contentText, escaped));
            }
            this.collectCSSText(opts, ['fontStyle', 'fontWeight', 'textDecoration', 'color', 'opacity', 'backgroundColor', 'margin'], cssTextArr);
            if (this.collectCSSText(opts, ['width', 'height'], cssTextArr)) {
                cssTextArr.push('display:inline-block;');
            }
        }
        return cssTextArr.join('');
    };
    /**
     * Build the CSS for decorations styled via `glpyhMarginClassName`.
     */
    DecorationCSSRules.prototype.getCSSTextForModelDecorationGlyphMarginClassName = function (opts) {
        if (!opts) {
            return '';
        }
        var cssTextArr = [];
        if (typeof opts.gutterIconPath !== 'undefined') {
            if (typeof opts.gutterIconPath === 'string') {
                cssTextArr.push(strings.format(_CSS_MAP.gutterIconPath, URI.file(opts.gutterIconPath).toString()));
            }
            else {
                cssTextArr.push(strings.format(_CSS_MAP.gutterIconPath, URI.revive(opts.gutterIconPath).toString(true).replace(/'/g, '%27')));
            }
            if (typeof opts.gutterIconSize !== 'undefined') {
                cssTextArr.push(strings.format(_CSS_MAP.gutterIconSize, opts.gutterIconSize));
            }
        }
        return cssTextArr.join('');
    };
    DecorationCSSRules.prototype.collectBorderSettingsCSSText = function (opts, cssTextArr) {
        if (this.collectCSSText(opts, ['border', 'borderColor', 'borderRadius', 'borderSpacing', 'borderStyle', 'borderWidth'], cssTextArr)) {
            cssTextArr.push(strings.format('box-sizing: border-box;'));
            return true;
        }
        return false;
    };
    DecorationCSSRules.prototype.collectCSSText = function (opts, properties, cssTextArr) {
        var lenBefore = cssTextArr.length;
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            var value = this.resolveValue(opts[property]);
            if (typeof value === 'string') {
                cssTextArr.push(strings.format(_CSS_MAP[property], value));
            }
        }
        return cssTextArr.length !== lenBefore;
    };
    DecorationCSSRules.prototype.resolveValue = function (value) {
        if (isThemeColor(value)) {
            this._usesThemeColors = true;
            var color = this._theme.getColor(value.id);
            if (color) {
                return color.toString();
            }
            return 'transparent';
        }
        return value;
    };
    return DecorationCSSRules;
}());
var CSSNameHelper = /** @class */ (function () {
    function CSSNameHelper() {
    }
    CSSNameHelper.getClassName = function (key, type) {
        return 'ced-' + key + '-' + type;
    };
    CSSNameHelper.getSelector = function (key, parentKey, ruleType) {
        var selector = '.monaco-editor .' + this.getClassName(key, ruleType);
        if (parentKey) {
            selector = selector + '.' + this.getClassName(parentKey, ruleType);
        }
        if (ruleType === 3 /* BeforeContentClassName */) {
            selector += '::before';
        }
        else if (ruleType === 4 /* AfterContentClassName */) {
            selector += '::after';
        }
        return selector;
    };
    return CSSNameHelper;
}());
