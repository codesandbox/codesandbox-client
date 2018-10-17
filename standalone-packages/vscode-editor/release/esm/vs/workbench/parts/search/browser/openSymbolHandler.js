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
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { QuickOpenHandler, EditorQuickOpenEntry } from '../../../browser/quickopen.js';
import { QuickOpenModel, compareEntries } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import * as filters from '../../../../base/common/filters.js';
import * as strings from '../../../../base/common/strings.js';
import { Range } from '../../../../editor/common/core/range.js';
import { symbolKindToCssClass } from '../../../../editor/common/modes.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { getWorkspaceSymbols } from '../common/search.js';
import { basename } from '../../../../base/common/paths.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Schemas } from '../../../../base/common/network.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
var SymbolEntry = /** @class */ (function (_super) {
    __extends(SymbolEntry, _super);
    function SymbolEntry(bearing, provider, configurationService, editorService, labelService, openerService) {
        var _this = _super.call(this, editorService) || this;
        _this.bearing = bearing;
        _this.provider = provider;
        _this.configurationService = configurationService;
        _this.labelService = labelService;
        _this.openerService = openerService;
        return _this;
    }
    SymbolEntry.prototype.getLabel = function () {
        return this.bearing.name;
    };
    SymbolEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, symbols picker", this.getLabel());
    };
    SymbolEntry.prototype.getDescription = function () {
        var containerName = this.bearing.containerName;
        if (this.bearing.location.uri) {
            if (containerName) {
                return containerName + " \u2014 " + basename(this.bearing.location.uri.fsPath);
            }
            return this.labelService.getUriLabel(this.bearing.location.uri, { relative: true });
        }
        return containerName;
    };
    SymbolEntry.prototype.getIcon = function () {
        return symbolKindToCssClass(this.bearing.kind);
    };
    SymbolEntry.prototype.getResource = function () {
        return this.bearing.location.uri;
    };
    SymbolEntry.prototype.run = function (mode, context) {
        var _this = this;
        // resolve this type bearing if neccessary
        if (!this.bearingResolve && typeof this.provider.resolveWorkspaceSymbol === 'function' && !this.bearing.location.range) {
            this.bearingResolve = Promise.resolve(this.provider.resolveWorkspaceSymbol(this.bearing, CancellationToken.None)).then(function (result) {
                _this.bearing = result || _this.bearing;
                return _this;
            }, onUnexpectedError);
        }
        // open after resolving
        TPromise.as(this.bearingResolve).then(function () {
            var scheme = _this.bearing.location.uri ? _this.bearing.location.uri.scheme : void 0;
            if (scheme === Schemas.http || scheme === Schemas.https) {
                _this.openerService.open(_this.bearing.location.uri); // support http/https resources (https://github.com/Microsoft/vscode/issues/58924))
            }
            else {
                _super.prototype.run.call(_this, mode, context);
            }
        });
        // hide if OPEN
        return mode === 1 /* OPEN */;
    };
    SymbolEntry.prototype.getInput = function () {
        var input = {
            resource: this.bearing.location.uri,
            options: {
                pinned: !this.configurationService.getValue().workbench.editor.enablePreviewFromQuickOpen
            }
        };
        if (this.bearing.location.range) {
            input.options.selection = Range.collapseToStart(this.bearing.location.range);
        }
        return input;
    };
    SymbolEntry.compare = function (elementA, elementB, searchValue) {
        // Sort by Type if name is identical
        var elementAName = elementA.getLabel().toLowerCase();
        var elementBName = elementB.getLabel().toLowerCase();
        if (elementAName === elementBName) {
            var elementAType = symbolKindToCssClass(elementA.bearing.kind);
            var elementBType = symbolKindToCssClass(elementB.bearing.kind);
            return elementAType.localeCompare(elementBType);
        }
        return compareEntries(elementA, elementB, searchValue);
    };
    SymbolEntry = __decorate([
        __param(2, IConfigurationService),
        __param(3, IEditorService),
        __param(4, ILabelService),
        __param(5, IOpenerService)
    ], SymbolEntry);
    return SymbolEntry;
}(EditorQuickOpenEntry));
var OpenSymbolHandler = /** @class */ (function (_super) {
    __extends(OpenSymbolHandler, _super);
    function OpenSymbolHandler(instantiationService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.delayer = new ThrottledDelayer(OpenSymbolHandler.TYPING_SEARCH_DELAY);
        _this.options = Object.create(null);
        return _this;
    }
    OpenSymbolHandler.prototype.setOptions = function (options) {
        this.options = options;
    };
    OpenSymbolHandler.prototype.canRun = function () {
        return true;
    };
    OpenSymbolHandler.prototype.getResults = function (searchValue, token) {
        var _this = this;
        searchValue = searchValue.trim();
        var promise;
        if (!this.options.skipDelay) {
            promise = this.delayer.trigger(function () {
                if (token.isCancellationRequested) {
                    return TPromise.wrap([]);
                }
                return _this.doGetResults(searchValue, token);
            });
        }
        else {
            promise = this.doGetResults(searchValue, token);
        }
        return promise.then(function (e) { return new QuickOpenModel(e); });
    };
    OpenSymbolHandler.prototype.doGetResults = function (searchValue, token) {
        var _this = this;
        return getWorkspaceSymbols(searchValue, token).then(function (tuples) {
            if (token.isCancellationRequested) {
                return [];
            }
            var result = [];
            for (var _i = 0, tuples_1 = tuples; _i < tuples_1.length; _i++) {
                var tuple = tuples_1[_i];
                var provider = tuple[0], bearings = tuple[1];
                _this.fillInSymbolEntries(result, provider, bearings, searchValue);
            }
            // Sort (Standalone only)
            if (!_this.options.skipSorting) {
                searchValue = searchValue ? strings.stripWildcards(searchValue.toLowerCase()) : searchValue;
                return result.sort(function (a, b) { return SymbolEntry.compare(a, b, searchValue); });
            }
            return result;
        });
    };
    OpenSymbolHandler.prototype.fillInSymbolEntries = function (bucket, provider, types, searchValue) {
        // Convert to Entries
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var element = types_1[_i];
            if (this.options.skipLocalSymbols && !!element.containerName) {
                continue; // ignore local symbols if we are told so
            }
            var entry = this.instantiationService.createInstance(SymbolEntry, element, provider);
            entry.setHighlights(filters.matchesFuzzy(searchValue, entry.getLabel()));
            bucket.push(entry);
        }
    };
    OpenSymbolHandler.prototype.getGroupLabel = function () {
        return nls.localize('symbols', "symbol results");
    };
    OpenSymbolHandler.prototype.getEmptyLabel = function (searchString) {
        if (searchString.length > 0) {
            return nls.localize('noSymbolsMatching', "No symbols matching");
        }
        return nls.localize('noSymbolsWithoutInput', "Type to search for symbols");
    };
    OpenSymbolHandler.prototype.getAutoFocus = function (searchValue) {
        return {
            autoFocusFirstEntry: true,
            autoFocusPrefixMatch: searchValue.trim()
        };
    };
    OpenSymbolHandler.ID = 'workbench.picker.symbols';
    OpenSymbolHandler.TYPING_SEARCH_DELAY = 200; // This delay accommodates for the user typing a word and then stops typing to start searching
    OpenSymbolHandler = __decorate([
        __param(0, IInstantiationService)
    ], OpenSymbolHandler);
    return OpenSymbolHandler;
}(QuickOpenHandler));
export { OpenSymbolHandler };
