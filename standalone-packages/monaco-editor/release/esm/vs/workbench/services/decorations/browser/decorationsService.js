/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter, debounceEvent, anyEvent } from '../../../../base/common/event.js';
import { TernarySearchTree } from '../../../../base/common/map.js';
import { dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { isThenable } from '../../../../base/common/async.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { createStyleSheet, createCSSRule, removeCSSRulesContainingSelector } from '../../../../base/browser/dom.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IdGenerator } from '../../../../base/common/idGenerator.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { localize } from '../../../../nls.js';
import { isPromiseCanceledError } from '../../../../base/common/errors.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
var DecorationRule = /** @class */ (function () {
    function DecorationRule(data) {
        this.data = data;
        this.itemColorClassName = DecorationRule._classNames.nextId();
        this.itemBadgeClassName = DecorationRule._classNames.nextId();
        this.bubbleBadgeClassName = DecorationRule._classNames.nextId();
    }
    DecorationRule.keyOf = function (data) {
        if (Array.isArray(data)) {
            return data.map(DecorationRule.keyOf).join(',');
        }
        else {
            var color = data.color, letter = data.letter;
            return color + "/" + letter;
        }
    };
    DecorationRule.prototype.appendCSSRules = function (element, theme) {
        if (!Array.isArray(this.data)) {
            this._appendForOne(this.data, element, theme);
        }
        else {
            this._appendForMany(this.data, element, theme);
        }
    };
    DecorationRule.prototype._appendForOne = function (data, element, theme) {
        var color = data.color, letter = data.letter;
        // label
        createCSSRule("." + this.itemColorClassName, "color: " + (theme.getColor(color) || 'inherit') + ";", element);
        // letter
        if (letter) {
            createCSSRule("." + this.itemBadgeClassName + "::after", "content: \"" + letter + "\"; color: " + (theme.getColor(color) || 'inherit') + ";", element);
        }
    };
    DecorationRule.prototype._appendForMany = function (data, element, theme) {
        // label
        var color = data[0].color;
        createCSSRule("." + this.itemColorClassName, "color: " + (theme.getColor(color) || 'inherit') + ";", element);
        // badge
        var letters = data.filter(function (d) { return !isFalsyOrWhitespace(d.letter); }).map(function (d) { return d.letter; });
        if (letters.length) {
            createCSSRule("." + this.itemBadgeClassName + "::after", "content: \"" + letters.join(', ') + "\"; color: " + (theme.getColor(color) || 'inherit') + ";", element);
        }
        // bubble badge
        createCSSRule("." + this.bubbleBadgeClassName + "::after", "content: \"\uF052\"; color: " + (theme.getColor(color) || 'inherit') + "; font-family: octicons; font-size: 14px; padding-right: 14px; opacity: 0.4;", element);
    };
    DecorationRule.prototype.removeCSSRules = function (element) {
        removeCSSRulesContainingSelector(this.itemColorClassName, element);
        removeCSSRulesContainingSelector(this.itemBadgeClassName, element);
        removeCSSRulesContainingSelector(this.bubbleBadgeClassName, element);
    };
    DecorationRule.prototype.isUnused = function () {
        return !document.querySelector("." + this.itemColorClassName)
            && !document.querySelector("." + this.itemBadgeClassName)
            && !document.querySelector("." + this.bubbleBadgeClassName);
    };
    DecorationRule._classNames = new IdGenerator('monaco-decorations-style-');
    return DecorationRule;
}());
var DecorationStyles = /** @class */ (function () {
    function DecorationStyles(_themeService) {
        this._themeService = _themeService;
        this._styleElement = createStyleSheet();
        this._decorationRules = new Map();
        this._disposables = [this._themeService.onThemeChange(this._onThemeChange, this)];
    }
    DecorationStyles.prototype.dispose = function () {
        dispose(this._disposables);
        this._styleElement.parentElement.removeChild(this._styleElement);
    };
    DecorationStyles.prototype.asDecoration = function (data, onlyChildren) {
        var _this = this;
        // sort by weight
        data.sort(function (a, b) { return b.weight - a.weight; });
        var key = DecorationRule.keyOf(data);
        var rule = this._decorationRules.get(key);
        if (!rule) {
            // new css rule
            rule = new DecorationRule(data);
            this._decorationRules.set(key, rule);
            rule.appendCSSRules(this._styleElement, this._themeService.getTheme());
        }
        var labelClassName = rule.itemColorClassName;
        var badgeClassName = rule.itemBadgeClassName;
        var tooltip = data.filter(function (d) { return !isFalsyOrWhitespace(d.tooltip); }).map(function (d) { return d.tooltip; }).join(' • ');
        if (onlyChildren) {
            // show items from its children only
            badgeClassName = rule.bubbleBadgeClassName;
            tooltip = localize('bubbleTitle', "Contains emphasized items");
        }
        return {
            labelClassName: labelClassName,
            badgeClassName: badgeClassName,
            tooltip: tooltip,
            update: function (replace) {
                var newData = data.slice();
                for (var i = 0; i < newData.length; i++) {
                    if (newData[i].source === replace.source) {
                        // replace
                        newData[i] = replace;
                    }
                }
                return _this.asDecoration(newData, onlyChildren);
            }
        };
    };
    DecorationStyles.prototype._onThemeChange = function () {
        var _this = this;
        this._decorationRules.forEach(function (rule) {
            rule.removeCSSRules(_this._styleElement);
            rule.appendCSSRules(_this._styleElement, _this._themeService.getTheme());
        });
    };
    DecorationStyles.prototype.cleanUp = function (iter) {
        var _this = this;
        // remove every rule for which no more
        // decoration (data) is kept. this isn't cheap
        var usedDecorations = new Set();
        for (var e = iter.next(); !e.done; e = iter.next()) {
            e.value.data.forEach(function (value, key) {
                if (value && !(value instanceof DecorationDataRequest)) {
                    usedDecorations.add(DecorationRule.keyOf(value));
                }
            });
        }
        this._decorationRules.forEach(function (value, index) {
            var data = value.data;
            if (value.isUnused()) {
                var remove = void 0;
                if (Array.isArray(data)) {
                    remove = data.some(function (data) { return !usedDecorations.has(DecorationRule.keyOf(data)); });
                }
                else if (!usedDecorations.has(DecorationRule.keyOf(data))) {
                    remove = true;
                }
                if (remove) {
                    value.removeCSSRules(_this._styleElement);
                    _this._decorationRules.delete(index);
                }
            }
        });
    };
    return DecorationStyles;
}());
var FileDecorationChangeEvent = /** @class */ (function () {
    function FileDecorationChangeEvent() {
        this._data = TernarySearchTree.forPaths();
    }
    FileDecorationChangeEvent.prototype.affectsResource = function (uri) {
        return this._data.get(uri.toString()) || this._data.findSuperstr(uri.toString()) !== undefined;
    };
    FileDecorationChangeEvent.debouncer = function (last, current) {
        if (!last) {
            last = new FileDecorationChangeEvent();
        }
        if (Array.isArray(current)) {
            // many
            for (var _i = 0, current_1 = current; _i < current_1.length; _i++) {
                var uri = current_1[_i];
                last._data.set(uri.toString(), true);
            }
        }
        else {
            // one
            last._data.set(current.toString(), true);
        }
        return last;
    };
    return FileDecorationChangeEvent;
}());
var DecorationDataRequest = /** @class */ (function () {
    function DecorationDataRequest(source, thenable) {
        this.source = source;
        this.thenable = thenable;
    }
    return DecorationDataRequest;
}());
var DecorationProviderWrapper = /** @class */ (function () {
    function DecorationProviderWrapper(_provider, _uriEmitter, _flushEmitter) {
        var _this = this;
        this._provider = _provider;
        this._uriEmitter = _uriEmitter;
        this._flushEmitter = _flushEmitter;
        this.data = TernarySearchTree.forPaths();
        this._dispoable = this._provider.onDidChange(function (uris) {
            if (!uris) {
                // flush event -> drop all data, can affect everything
                _this.data.clear();
                _this._flushEmitter.fire({ affectsResource: function () { return true; } });
            }
            else {
                // selective changes -> drop for resource, fetch again, send event
                // perf: the map stores thenables, decorations, or `null`-markers.
                // we make us of that and ignore all uris in which we have never
                // been interested.
                for (var _i = 0, uris_1 = uris; _i < uris_1.length; _i++) {
                    var uri = uris_1[_i];
                    _this._fetchData(uri);
                }
            }
        });
    }
    DecorationProviderWrapper.prototype.dispose = function () {
        this._dispoable.dispose();
        this.data.clear();
    };
    DecorationProviderWrapper.prototype.knowsAbout = function (uri) {
        return Boolean(this.data.get(uri.toString())) || Boolean(this.data.findSuperstr(uri.toString()));
    };
    DecorationProviderWrapper.prototype.getOrRetrieve = function (uri, includeChildren, callback) {
        var key = uri.toString();
        var item = this.data.get(key);
        if (item === undefined) {
            // unknown -> trigger request
            item = this._fetchData(uri);
        }
        if (item && !(item instanceof DecorationDataRequest)) {
            // found something (which isn't pending anymore)
            callback(item, false);
        }
        if (includeChildren) {
            // (resolved) children
            var iter = this.data.findSuperstr(key);
            if (iter) {
                for (var item_1 = iter.next(); !item_1.done; item_1 = iter.next()) {
                    if (item_1.value && !(item_1.value instanceof DecorationDataRequest)) {
                        callback(item_1.value, true);
                    }
                }
            }
        }
    };
    DecorationProviderWrapper.prototype._fetchData = function (uri) {
        var _this = this;
        // check for pending request and cancel it
        var pendingRequest = this.data.get(uri.toString());
        if (pendingRequest instanceof DecorationDataRequest) {
            pendingRequest.source.cancel();
            this.data.delete(uri.toString());
        }
        var source = new CancellationTokenSource();
        var dataOrThenable = this._provider.provideDecorations(uri, source.token);
        if (!isThenable(dataOrThenable)) {
            // sync -> we have a result now
            return this._keepItem(uri, dataOrThenable);
        }
        else {
            // async -> we have a result soon
            var request_1 = new DecorationDataRequest(source, Promise.resolve(dataOrThenable).then(function (data) {
                if (_this.data.get(uri.toString()) === request_1) {
                    _this._keepItem(uri, data);
                }
            }).catch(function (err) {
                if (!isPromiseCanceledError(err) && _this.data.get(uri.toString()) === request_1) {
                    _this.data.delete(uri.toString());
                }
            }));
            this.data.set(uri.toString(), request_1);
            return undefined;
        }
    };
    DecorationProviderWrapper.prototype._keepItem = function (uri, data) {
        var deco = data ? data : null;
        var old = this.data.set(uri.toString(), deco);
        if (deco || old) {
            // only fire event when something changed
            this._uriEmitter.fire(uri);
        }
        return deco;
    };
    return DecorationProviderWrapper;
}());
var FileDecorationsService = /** @class */ (function () {
    function FileDecorationsService(themeService, cleanUpCount) {
        if (cleanUpCount === void 0) { cleanUpCount = 17; }
        var _this = this;
        this._data = new LinkedList();
        this._onDidChangeDecorationsDelayed = new Emitter();
        this._onDidChangeDecorations = new Emitter();
        this.onDidChangeDecorations = anyEvent(this._onDidChangeDecorations.event, debounceEvent(this._onDidChangeDecorationsDelayed.event, FileDecorationChangeEvent.debouncer));
        this._decorationStyles = new DecorationStyles(themeService);
        // every so many events we check if there are
        // css styles that we don't need anymore
        var count = 0;
        var reg = this.onDidChangeDecorations(function () {
            if (++count % cleanUpCount === 0) {
                _this._decorationStyles.cleanUp(_this._data.iterator());
            }
        });
        this._disposables = [
            reg,
            this._decorationStyles
        ];
    }
    FileDecorationsService.prototype.dispose = function () {
        dispose(this._disposables);
        dispose(this._onDidChangeDecorations);
        dispose(this._onDidChangeDecorationsDelayed);
    };
    FileDecorationsService.prototype.registerDecorationsProvider = function (provider) {
        var _this = this;
        var wrapper = new DecorationProviderWrapper(provider, this._onDidChangeDecorationsDelayed, this._onDidChangeDecorations);
        var remove = this._data.push(wrapper);
        this._onDidChangeDecorations.fire({
            // everything might have changed
            affectsResource: function () { return true; }
        });
        return toDisposable(function () {
            // fire event that says 'yes' for any resource
            // known to this provider. then dispose and remove it.
            remove();
            _this._onDidChangeDecorations.fire({ affectsResource: function (uri) { return wrapper.knowsAbout(uri); } });
            wrapper.dispose();
        });
    };
    FileDecorationsService.prototype.getDecoration = function (uri, includeChildren, overwrite) {
        var data = [];
        var containsChildren;
        for (var iter = this._data.iterator(), next = iter.next(); !next.done; next = iter.next()) {
            next.value.getOrRetrieve(uri, includeChildren, function (deco, isChild) {
                if (!isChild || deco.bubble) {
                    data.push(deco);
                    containsChildren = isChild || containsChildren;
                }
            });
        }
        if (data.length === 0) {
            // nothing, maybe overwrite data
            if (overwrite) {
                return this._decorationStyles.asDecoration([overwrite], containsChildren);
            }
            else {
                return undefined;
            }
        }
        else {
            // result, maybe overwrite
            var result = this._decorationStyles.asDecoration(data, containsChildren);
            if (overwrite) {
                return result.update(overwrite);
            }
            else {
                return result;
            }
        }
    };
    FileDecorationsService = __decorate([
        __param(0, IThemeService)
    ], FileDecorationsService);
    return FileDecorationsService;
}());
export { FileDecorationsService };
