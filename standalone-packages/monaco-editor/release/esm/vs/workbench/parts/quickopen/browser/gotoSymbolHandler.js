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
var _a;
import '../../../../editor/contrib/documentSymbols/media/symbol-icons.css';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import * as strings from '../../../../base/common/strings.js';
import { QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { QuickOpenHandler, EditorQuickOpenEntryGroup, QuickOpenAction } from '../../../browser/quickopen.js';
import * as filters from '../../../../base/common/filters.js';
import { OverviewRulerLane } from '../../../../editor/common/model.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { getDocumentSymbols } from '../../../../editor/contrib/quickOpen/quickOpen.js';
import { DocumentSymbolProviderRegistry, symbolKindToCssClass, SymbolKind } from '../../../../editor/common/modes.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { overviewRulerRangeHighlight } from '../../../../editor/common/view/editorColorRegistry.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { asThenable } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
export var GOTO_SYMBOL_PREFIX = '@';
export var SCOPE_PREFIX = ':';
var FALLBACK_NLS_SYMBOL_KIND = nls.localize('property', "properties ({0})");
var NLS_SYMBOL_KIND_CACHE = (_a = {},
    _a[SymbolKind.Method] = nls.localize('method', "methods ({0})"),
    _a[SymbolKind.Function] = nls.localize('function', "functions ({0})"),
    _a[SymbolKind.Constructor] = nls.localize('_constructor', "constructors ({0})"),
    _a[SymbolKind.Variable] = nls.localize('variable', "variables ({0})"),
    _a[SymbolKind.Class] = nls.localize('class', "classes ({0})"),
    _a[SymbolKind.Struct] = nls.localize('struct', "structs ({0})"),
    _a[SymbolKind.Event] = nls.localize('event', "events ({0})"),
    _a[SymbolKind.Operator] = nls.localize('operator', "operators ({0})"),
    _a[SymbolKind.Interface] = nls.localize('interface', "interfaces ({0})"),
    _a[SymbolKind.Namespace] = nls.localize('namespace', "namespaces ({0})"),
    _a[SymbolKind.Package] = nls.localize('package', "packages ({0})"),
    _a[SymbolKind.TypeParameter] = nls.localize('typeParameter', "type parameters ({0})"),
    _a[SymbolKind.Module] = nls.localize('modules', "modules ({0})"),
    _a[SymbolKind.Property] = nls.localize('property', "properties ({0})"),
    _a[SymbolKind.Enum] = nls.localize('enum', "enumerations ({0})"),
    _a[SymbolKind.EnumMember] = nls.localize('enumMember', "enumeration members ({0})"),
    _a[SymbolKind.String] = nls.localize('string', "strings ({0})"),
    _a[SymbolKind.File] = nls.localize('file', "files ({0})"),
    _a[SymbolKind.Array] = nls.localize('array', "arrays ({0})"),
    _a[SymbolKind.Number] = nls.localize('number', "numbers ({0})"),
    _a[SymbolKind.Boolean] = nls.localize('boolean', "booleans ({0})"),
    _a[SymbolKind.Object] = nls.localize('object', "objects ({0})"),
    _a[SymbolKind.Key] = nls.localize('key', "keys ({0})"),
    _a[SymbolKind.Field] = nls.localize('field', "fields ({0})"),
    _a[SymbolKind.Constant] = nls.localize('constant', "constants ({0})"),
    _a);
var GotoSymbolAction = /** @class */ (function (_super) {
    __extends(GotoSymbolAction, _super);
    function GotoSymbolAction(actionId, actionLabel, quickOpenService) {
        return _super.call(this, actionId, actionLabel, GOTO_SYMBOL_PREFIX, quickOpenService) || this;
    }
    GotoSymbolAction.ID = 'workbench.action.gotoSymbol';
    GotoSymbolAction.LABEL = nls.localize('gotoSymbol', "Go to Symbol in File...");
    GotoSymbolAction = __decorate([
        __param(2, IQuickOpenService)
    ], GotoSymbolAction);
    return GotoSymbolAction;
}(QuickOpenAction));
export { GotoSymbolAction };
var OutlineModel = /** @class */ (function (_super) {
    __extends(OutlineModel, _super);
    function OutlineModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OutlineModel.prototype.applyFilter = function (searchValue) {
        // Normalize search
        var normalizedSearchValue = searchValue;
        if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
            normalizedSearchValue = normalizedSearchValue.substr(SCOPE_PREFIX.length);
        }
        // Check for match and update visibility and group label
        this.entries.forEach(function (entry) {
            // Clear all state first
            entry.setGroupLabel(null);
            entry.setShowBorder(false);
            entry.setHighlights(null);
            entry.setHidden(false);
            // Filter by search
            if (normalizedSearchValue) {
                var highlights = filters.matchesFuzzy(normalizedSearchValue, entry.getLabel());
                if (highlights) {
                    entry.setHighlights(highlights);
                    entry.setHidden(false);
                }
                else if (!entry.isHidden()) {
                    entry.setHidden(true);
                }
            }
        });
        // Sort properly if actually searching
        if (searchValue) {
            if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                this.entries.sort(this.sortScoped.bind(this, searchValue.toLowerCase()));
            }
            else {
                this.entries.sort(this.sortNormal.bind(this, searchValue.toLowerCase()));
            }
        }
        // Otherwise restore order as appearing in outline
        else {
            this.entries.sort(function (a, b) { return a.getIndex() - b.getIndex(); });
        }
        // Mark all type groups
        var visibleResults = this.getEntries(true);
        if (visibleResults.length > 0 && searchValue.indexOf(SCOPE_PREFIX) === 0) {
            var currentType = null;
            var currentResult = null;
            var typeCounter = 0;
            for (var i = 0; i < visibleResults.length; i++) {
                var result = visibleResults[i];
                // Found new type
                if (currentType !== result.getKind()) {
                    // Update previous result with count
                    if (currentResult) {
                        currentResult.setGroupLabel(this.renderGroupLabel(currentType, typeCounter));
                    }
                    currentType = result.getKind();
                    currentResult = result;
                    typeCounter = 1;
                    result.setShowBorder(i > 0);
                }
                // Existing type, keep counting
                else {
                    typeCounter++;
                }
            }
            // Update previous result with count
            if (currentResult) {
                currentResult.setGroupLabel(this.renderGroupLabel(currentType, typeCounter));
            }
        }
        // Mark first entry as outline
        else if (visibleResults.length > 0) {
            visibleResults[0].setGroupLabel(nls.localize('symbols', "symbols ({0})", visibleResults.length));
        }
    };
    OutlineModel.prototype.sortNormal = function (searchValue, elementA, elementB) {
        // Handle hidden elements
        if (elementA.isHidden() && elementB.isHidden()) {
            return 0;
        }
        else if (elementA.isHidden()) {
            return 1;
        }
        else if (elementB.isHidden()) {
            return -1;
        }
        var elementAName = elementA.getLabel().toLowerCase();
        var elementBName = elementB.getLabel().toLowerCase();
        // Compare by name
        var r = elementAName.localeCompare(elementBName);
        if (r !== 0) {
            return r;
        }
        // If name identical sort by range instead
        var elementARange = elementA.getRange();
        var elementBRange = elementB.getRange();
        return elementARange.startLineNumber - elementBRange.startLineNumber;
    };
    OutlineModel.prototype.sortScoped = function (searchValue, elementA, elementB) {
        // Handle hidden elements
        if (elementA.isHidden() && elementB.isHidden()) {
            return 0;
        }
        else if (elementA.isHidden()) {
            return 1;
        }
        else if (elementB.isHidden()) {
            return -1;
        }
        // Remove scope char
        searchValue = searchValue.substr(SCOPE_PREFIX.length);
        // Sort by type first if scoped search
        var elementATypeLabel = NLS_SYMBOL_KIND_CACHE[elementA.getKind()] || FALLBACK_NLS_SYMBOL_KIND;
        var elementBTypeLabel = NLS_SYMBOL_KIND_CACHE[elementB.getKind()] || FALLBACK_NLS_SYMBOL_KIND;
        var r = elementATypeLabel.localeCompare(elementBTypeLabel);
        if (r !== 0) {
            return r;
        }
        // Special sort when searching in scoped mode
        if (searchValue) {
            var elementAName = elementA.getLabel().toLowerCase();
            var elementBName = elementB.getLabel().toLowerCase();
            // Compare by name
            r = elementAName.localeCompare(elementBName);
            if (r !== 0) {
                return r;
            }
        }
        // Default to sort by range
        var elementARange = elementA.getRange();
        var elementBRange = elementB.getRange();
        return elementARange.startLineNumber - elementBRange.startLineNumber;
    };
    OutlineModel.prototype.renderGroupLabel = function (type, count) {
        var pattern = NLS_SYMBOL_KIND_CACHE[type];
        if (!pattern) {
            pattern = FALLBACK_NLS_SYMBOL_KIND;
        }
        return strings.format(pattern, count);
    };
    return OutlineModel;
}(QuickOpenModel));
var SymbolEntry = /** @class */ (function (_super) {
    __extends(SymbolEntry, _super);
    function SymbolEntry(index, name, kind, description, icon, range, revealRange, highlights, editorService, handler) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.name = name;
        _this.kind = kind;
        _this.icon = icon;
        _this.description = description;
        _this.range = range;
        _this.revealRange = revealRange || range;
        _this.setHighlights(highlights);
        _this.editorService = editorService;
        _this.handler = handler;
        return _this;
    }
    SymbolEntry.prototype.getIndex = function () {
        return this.index;
    };
    SymbolEntry.prototype.getLabel = function () {
        return this.name;
    };
    SymbolEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, symbols", this.getLabel());
    };
    SymbolEntry.prototype.getIcon = function () {
        return this.icon;
    };
    SymbolEntry.prototype.getDescription = function () {
        return this.description;
    };
    SymbolEntry.prototype.getKind = function () {
        return this.kind;
    };
    SymbolEntry.prototype.getRange = function () {
        return this.range;
    };
    SymbolEntry.prototype.getInput = function () {
        return this.editorService.activeEditor;
    };
    SymbolEntry.prototype.getOptions = function (pinned) {
        return {
            selection: this.toSelection(),
            pinned: pinned
        };
    };
    SymbolEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            return this.runOpen(context);
        }
        return this.runPreview();
    };
    SymbolEntry.prototype.runOpen = function (context) {
        // Check for sideBySide use
        var sideBySide = context.keymods.ctrlCmd;
        if (sideBySide) {
            this.editorService.openEditor(this.getInput(), this.getOptions(context.keymods.alt), SIDE_GROUP);
        }
        // Apply selection and focus
        else {
            var range = this.toSelection();
            var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
            if (activeTextEditorWidget) {
                activeTextEditorWidget.setSelection(range);
                activeTextEditorWidget.revealRangeInCenter(range, 0 /* Smooth */);
            }
        }
        return true;
    };
    SymbolEntry.prototype.runPreview = function () {
        // Select Outline Position
        var range = this.toSelection();
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            activeTextEditorWidget.revealRangeInCenter(range, 0 /* Smooth */);
            // Decorate if possible
            if (types.isFunction(activeTextEditorWidget.changeDecorations)) {
                this.handler.decorateOutline(this.range, range, activeTextEditorWidget, this.editorService.activeControl.group);
            }
        }
        return false;
    };
    SymbolEntry.prototype.toSelection = function () {
        return {
            startLineNumber: this.revealRange.startLineNumber,
            startColumn: this.revealRange.startColumn || 1,
            endLineNumber: this.revealRange.startLineNumber,
            endColumn: this.revealRange.startColumn || 1
        };
    };
    return SymbolEntry;
}(EditorQuickOpenEntryGroup));
var GotoSymbolHandler = /** @class */ (function (_super) {
    __extends(GotoSymbolHandler, _super);
    function GotoSymbolHandler(editorService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.registerListeners();
        return _this;
    }
    GotoSymbolHandler.prototype.registerListeners = function () {
        var _this = this;
        this.editorService.onDidActiveEditorChange(function () { return _this.onDidActiveEditorChange(); });
    };
    GotoSymbolHandler.prototype.onDidActiveEditorChange = function () {
        this.clearOutlineRequest();
        this.lastKnownEditorViewState = void 0;
        this.rangeHighlightDecorationId = void 0;
    };
    GotoSymbolHandler.prototype.getResults = function (searchValue, token) {
        searchValue = searchValue.trim();
        // Support to cancel pending outline requests
        if (!this.pendingOutlineRequest) {
            this.pendingOutlineRequest = new CancellationTokenSource();
        }
        // Remember view state to be able to restore on cancel
        if (!this.lastKnownEditorViewState) {
            var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
            this.lastKnownEditorViewState = activeTextEditorWidget.saveViewState();
        }
        // Resolve Outline Model
        return this.getOutline().then(function (outline) {
            if (token.isCancellationRequested) {
                return outline;
            }
            // Filter by search
            outline.applyFilter(searchValue);
            return outline;
        });
    };
    GotoSymbolHandler.prototype.getEmptyLabel = function (searchString) {
        if (searchString.length > 0) {
            return nls.localize('noSymbolsMatching', "No symbols matching");
        }
        return nls.localize('noSymbolsFound', "No symbols found");
    };
    GotoSymbolHandler.prototype.getAriaLabel = function () {
        return nls.localize('gotoSymbolHandlerAriaLabel', "Type to narrow down symbols of the currently active editor.");
    };
    GotoSymbolHandler.prototype.canRun = function () {
        var canRun = false;
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            var model = activeTextEditorWidget.getModel();
            if (model && model.modified && model.original) {
                model = model.modified; // Support for diff editor models
            }
            if (model && types.isFunction(model.getLanguageIdentifier)) {
                canRun = DocumentSymbolProviderRegistry.has(model);
            }
        }
        return canRun ? true : activeTextEditorWidget !== null ? nls.localize('cannotRunGotoSymbolInFile', "No symbol information for the file") : nls.localize('cannotRunGotoSymbol', "Open a text file first to go to a symbol");
    };
    GotoSymbolHandler.prototype.getAutoFocus = function (searchValue) {
        searchValue = searchValue.trim();
        // Remove any type pattern (:) from search value as needed
        if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
            searchValue = searchValue.substr(SCOPE_PREFIX.length);
        }
        return {
            autoFocusPrefixMatch: searchValue,
            autoFocusFirstEntry: !!searchValue
        };
    };
    GotoSymbolHandler.prototype.toQuickOpenEntries = function (flattened) {
        var results = [];
        for (var i = 0; i < flattened.length; i++) {
            var element = flattened[i];
            var label = strings.trim(element.name);
            // Show parent scope as description
            var description = element.containerName;
            var icon = symbolKindToCssClass(element.kind);
            // Add
            results.push(new SymbolEntry(i, label, element.kind, description, "symbol-icon " + icon, element.range, element.selectionRange, null, this.editorService, this));
        }
        return results;
    };
    GotoSymbolHandler.prototype.getOutline = function () {
        if (!this.cachedOutlineRequest) {
            this.cachedOutlineRequest = this.doGetActiveOutline();
        }
        return this.cachedOutlineRequest;
    };
    GotoSymbolHandler.prototype.doGetActiveOutline = function () {
        var _this = this;
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            var model_1 = activeTextEditorWidget.getModel();
            if (model_1 && model_1.modified && model_1.original) {
                model_1 = model_1.modified; // Support for diff editor models
            }
            if (model_1 && types.isFunction(model_1.getLanguageIdentifier)) {
                return TPromise.wrap(asThenable(function () { return getDocumentSymbols(model_1, true, _this.pendingOutlineRequest.token); }).then(function (entries) {
                    return new OutlineModel(_this.toQuickOpenEntries(entries));
                }));
            }
        }
        return TPromise.wrap(null);
    };
    GotoSymbolHandler.prototype.decorateOutline = function (fullRange, startRange, editor, group) {
        var _this = this;
        editor.changeDecorations(function (changeAccessor) {
            var deleteDecorations = [];
            if (_this.rangeHighlightDecorationId) {
                deleteDecorations.push(_this.rangeHighlightDecorationId.lineDecorationId);
                deleteDecorations.push(_this.rangeHighlightDecorationId.rangeHighlightId);
                _this.rangeHighlightDecorationId = null;
            }
            var newDecorations = [
                // rangeHighlight at index 0
                {
                    range: fullRange,
                    options: {
                        className: 'rangeHighlight',
                        isWholeLine: true
                    }
                },
                // lineDecoration at index 1
                {
                    range: startRange,
                    options: {
                        overviewRuler: {
                            color: themeColorFromId(overviewRulerRangeHighlight),
                            position: OverviewRulerLane.Full
                        }
                    }
                }
            ];
            var decorations = changeAccessor.deltaDecorations(deleteDecorations, newDecorations);
            var rangeHighlightId = decorations[0];
            var lineDecorationId = decorations[1];
            _this.rangeHighlightDecorationId = {
                groupId: group.id,
                rangeHighlightId: rangeHighlightId,
                lineDecorationId: lineDecorationId,
            };
        });
    };
    GotoSymbolHandler.prototype.clearDecorations = function () {
        var _this = this;
        if (this.rangeHighlightDecorationId) {
            this.editorService.visibleControls.forEach(function (editor) {
                if (editor.group.id === _this.rangeHighlightDecorationId.groupId) {
                    var editorControl = editor.getControl();
                    editorControl.changeDecorations(function (changeAccessor) {
                        changeAccessor.deltaDecorations([
                            _this.rangeHighlightDecorationId.lineDecorationId,
                            _this.rangeHighlightDecorationId.rangeHighlightId
                        ], []);
                    });
                }
            });
            this.rangeHighlightDecorationId = null;
        }
    };
    GotoSymbolHandler.prototype.onClose = function (canceled) {
        // Cancel any pending/cached outline request now
        this.clearOutlineRequest();
        // Clear Highlight Decorations if present
        this.clearDecorations();
        // Restore selection if canceled
        if (canceled && this.lastKnownEditorViewState) {
            var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
            if (activeTextEditorWidget) {
                activeTextEditorWidget.restoreViewState(this.lastKnownEditorViewState);
            }
            this.lastKnownEditorViewState = null;
        }
    };
    GotoSymbolHandler.prototype.clearOutlineRequest = function () {
        if (this.pendingOutlineRequest) {
            this.pendingOutlineRequest.cancel();
            this.pendingOutlineRequest.dispose();
            this.pendingOutlineRequest = void 0;
        }
        this.cachedOutlineRequest = null;
    };
    GotoSymbolHandler.ID = 'workbench.picker.filesymbols';
    GotoSymbolHandler = __decorate([
        __param(0, IEditorService)
    ], GotoSymbolHandler);
    return GotoSymbolHandler;
}(QuickOpenHandler));
export { GotoSymbolHandler };
