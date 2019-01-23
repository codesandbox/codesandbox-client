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
import './folding.css';
import * as nls from '../../../nls.js';
import * as types from '../../../base/common/types.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { RunOnceScheduler, Delayer, createCancelablePromise } from '../../../base/common/async.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { registerEditorAction, registerEditorContribution, EditorAction, registerInstantiatedEditorAction } from '../../browser/editorExtensions.js';
import { MouseTargetType } from '../../browser/editorBrowser.js';
import { FoldingModel, setCollapseStateAtLevel, setCollapseStateLevelsDown, setCollapseStateLevelsUp, setCollapseStateForMatchingLines, setCollapseStateForType } from './foldingModel.js';
import { FoldingDecorationProvider } from './foldingDecorations.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { HiddenRangeModel } from './hiddenRangeModel.js';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry.js';
import { IndentRangeProvider } from './indentRangeProvider.js';
import { FoldingRangeProviderRegistry, FoldingRangeKind } from '../../common/modes.js';
import { SyntaxRangeProvider, ID_SYNTAX_PROVIDER } from './syntaxRangeProvider.js';
import { InitializingRangeProvider, ID_INIT_PROVIDER } from './intializingRangeProvider.js';
export var ID = 'editor.contrib.folding';
var FoldingController = /** @class */ (function () {
    function FoldingController(editor) {
        var _this = this;
        this.editor = editor;
        this._isEnabled = this.editor.getConfiguration().contribInfo.folding;
        this._autoHideFoldingControls = this.editor.getConfiguration().contribInfo.showFoldingControls === 'mouseover';
        this._useFoldingProviders = this.editor.getConfiguration().contribInfo.foldingStrategy !== 'indentation';
        this.globalToDispose = [];
        this.localToDispose = [];
        this.foldingDecorationProvider = new FoldingDecorationProvider(editor);
        this.foldingDecorationProvider.autoHideFoldingControls = this._autoHideFoldingControls;
        this.globalToDispose.push(this.editor.onDidChangeModel(function () { return _this.onModelChanged(); }));
        this.globalToDispose.push(FoldingRangeProviderRegistry.onDidChange(function () { return _this.onFoldingStrategyChanged(); }));
        this.globalToDispose.push(this.editor.onDidChangeConfiguration(function (e) {
            if (e.contribInfo) {
                var oldIsEnabled = _this._isEnabled;
                _this._isEnabled = _this.editor.getConfiguration().contribInfo.folding;
                if (oldIsEnabled !== _this._isEnabled) {
                    _this.onModelChanged();
                }
                var oldShowFoldingControls = _this._autoHideFoldingControls;
                _this._autoHideFoldingControls = _this.editor.getConfiguration().contribInfo.showFoldingControls === 'mouseover';
                if (oldShowFoldingControls !== _this._autoHideFoldingControls) {
                    _this.foldingDecorationProvider.autoHideFoldingControls = _this._autoHideFoldingControls;
                    _this.onModelContentChanged();
                }
                var oldUseFoldingProviders = _this._useFoldingProviders;
                _this._useFoldingProviders = _this.editor.getConfiguration().contribInfo.foldingStrategy !== 'indentation';
                if (oldUseFoldingProviders !== _this._useFoldingProviders) {
                    _this.onFoldingStrategyChanged();
                }
            }
        }));
        this.globalToDispose.push({ dispose: function () { return dispose(_this.localToDispose); } });
        this.onModelChanged();
    }
    FoldingController.get = function (editor) {
        return editor.getContribution(ID);
    };
    FoldingController.prototype.getId = function () {
        return ID;
    };
    FoldingController.prototype.dispose = function () {
        this.globalToDispose = dispose(this.globalToDispose);
    };
    /**
     * Store view state.
     */
    FoldingController.prototype.saveViewState = function () {
        var model = this.editor.getModel();
        if (!model || !this._isEnabled || model.isTooLargeForTokenization()) {
            return {};
        }
        if (this.foldingModel) { // disposed ?
            var collapsedRegions = this.foldingModel.isInitialized ? this.foldingModel.getMemento() : this.hiddenRangeModel.getMemento();
            var provider = this.rangeProvider ? this.rangeProvider.id : void 0;
            return { collapsedRegions: collapsedRegions, lineCount: model.getLineCount(), provider: provider };
        }
        return void 0;
    };
    /**
     * Restore view state.
     */
    FoldingController.prototype.restoreViewState = function (state) {
        var model = this.editor.getModel();
        if (!model || !this._isEnabled || model.isTooLargeForTokenization()) {
            return;
        }
        if (!state || !state.collapsedRegions || state.lineCount !== model.getLineCount()) {
            return;
        }
        if (state.provider === ID_SYNTAX_PROVIDER || state.provider === ID_INIT_PROVIDER) {
            this.foldingStateMemento = state;
        }
        // set the hidden ranges right away, before waiting for the folding model.
        if (this.hiddenRangeModel.applyMemento(state.collapsedRegions)) {
            this.getFoldingModel().then(function (foldingModel) {
                if (foldingModel) {
                    foldingModel.applyMemento(state.collapsedRegions);
                }
            });
        }
    };
    FoldingController.prototype.onModelChanged = function () {
        var _this = this;
        this.localToDispose = dispose(this.localToDispose);
        var model = this.editor.getModel();
        if (!this._isEnabled || !model || model.isTooLargeForTokenization()) {
            // huge files get no view model, so they cannot support hidden areas
            return;
        }
        this.foldingModel = new FoldingModel(model, this.foldingDecorationProvider);
        this.localToDispose.push(this.foldingModel);
        this.hiddenRangeModel = new HiddenRangeModel(this.foldingModel);
        this.localToDispose.push(this.hiddenRangeModel);
        this.localToDispose.push(this.hiddenRangeModel.onDidChange(function (hr) { return _this.onHiddenRangesChanges(hr); }));
        this.updateScheduler = new Delayer(200);
        this.cursorChangedScheduler = new RunOnceScheduler(function () { return _this.revealCursor(); }, 200);
        this.localToDispose.push(this.cursorChangedScheduler);
        this.localToDispose.push(this.editor.onDidChangeModelLanguageConfiguration(function (e) { return _this.onModelContentChanged(); })); // covers model language changes as well
        this.localToDispose.push(this.editor.onDidChangeModelContent(function (e) { return _this.onModelContentChanged(); }));
        this.localToDispose.push(this.editor.onDidChangeCursorPosition(function (e) { return _this.onCursorPositionChanged(); }));
        this.localToDispose.push(this.editor.onMouseDown(function (e) { return _this.onEditorMouseDown(e); }));
        this.localToDispose.push(this.editor.onMouseUp(function (e) { return _this.onEditorMouseUp(e); }));
        this.localToDispose.push({
            dispose: function () {
                if (_this.foldingRegionPromise) {
                    _this.foldingRegionPromise.cancel();
                    _this.foldingRegionPromise = null;
                }
                _this.updateScheduler.cancel();
                _this.updateScheduler = null;
                _this.foldingModel = null;
                _this.foldingModelPromise = null;
                _this.hiddenRangeModel = null;
                _this.cursorChangedScheduler = null;
                _this.foldingStateMemento = null;
                if (_this.rangeProvider) {
                    _this.rangeProvider.dispose();
                }
                _this.rangeProvider = null;
            }
        });
        this.onModelContentChanged();
    };
    FoldingController.prototype.onFoldingStrategyChanged = function () {
        if (this.rangeProvider) {
            this.rangeProvider.dispose();
        }
        this.rangeProvider = null;
        this.onModelContentChanged();
    };
    FoldingController.prototype.getRangeProvider = function (editorModel) {
        var _this = this;
        if (this.rangeProvider) {
            return this.rangeProvider;
        }
        this.rangeProvider = new IndentRangeProvider(editorModel); // fallback
        if (this._useFoldingProviders) {
            var foldingProviders = FoldingRangeProviderRegistry.ordered(this.foldingModel.textModel);
            if (foldingProviders.length === 0 && this.foldingStateMemento) {
                this.rangeProvider = new InitializingRangeProvider(editorModel, this.foldingStateMemento.collapsedRegions, function () {
                    // if after 30 the InitializingRangeProvider is still not replaced, force a refresh
                    _this.foldingStateMemento = null;
                    _this.onFoldingStrategyChanged();
                }, 30000);
                return this.rangeProvider; // keep memento in case there are still no foldingProviders on the next request.
            }
            else if (foldingProviders.length > 0) {
                this.rangeProvider = new SyntaxRangeProvider(editorModel, foldingProviders);
            }
        }
        this.foldingStateMemento = null;
        return this.rangeProvider;
    };
    FoldingController.prototype.getFoldingModel = function () {
        return this.foldingModelPromise;
    };
    FoldingController.prototype.onModelContentChanged = function () {
        var _this = this;
        if (this.updateScheduler) {
            if (this.foldingRegionPromise) {
                this.foldingRegionPromise.cancel();
                this.foldingRegionPromise = null;
            }
            this.foldingModelPromise = this.updateScheduler.trigger(function () {
                if (!_this.foldingModel) { // null if editor has been disposed, or folding turned off
                    return null;
                }
                var foldingRegionPromise = _this.foldingRegionPromise = createCancelablePromise(function (token) { return _this.getRangeProvider(_this.foldingModel.textModel).compute(token); });
                return TPromise.wrap(foldingRegionPromise.then(function (foldingRanges) {
                    if (foldingRanges && foldingRegionPromise === _this.foldingRegionPromise) { // new request or cancelled in the meantime?
                        // some cursors might have moved into hidden regions, make sure they are in expanded regions
                        var selections = _this.editor.getSelections();
                        var selectionLineNumbers = selections ? selections.map(function (s) { return s.startLineNumber; }) : [];
                        _this.foldingModel.update(foldingRanges, selectionLineNumbers);
                    }
                    return _this.foldingModel;
                }));
            });
        }
    };
    FoldingController.prototype.onHiddenRangesChanges = function (hiddenRanges) {
        if (hiddenRanges.length) {
            var selections = this.editor.getSelections();
            if (selections) {
                if (this.hiddenRangeModel.adjustSelections(selections)) {
                    this.editor.setSelections(selections);
                }
            }
        }
        this.editor.setHiddenAreas(hiddenRanges);
    };
    FoldingController.prototype.onCursorPositionChanged = function () {
        if (this.hiddenRangeModel.hasRanges()) {
            this.cursorChangedScheduler.schedule();
        }
    };
    FoldingController.prototype.revealCursor = function () {
        var _this = this;
        this.getFoldingModel().then(function (foldingModel) {
            if (foldingModel) {
                var selections = _this.editor.getSelections();
                if (selections && selections.length > 0) {
                    var toToggle = [];
                    var _loop_1 = function (selection) {
                        var lineNumber = selection.selectionStartLineNumber;
                        if (_this.hiddenRangeModel.isHidden(lineNumber)) {
                            toToggle.push.apply(toToggle, foldingModel.getAllRegionsAtLine(lineNumber, function (r) { return r.isCollapsed && lineNumber > r.startLineNumber; }));
                        }
                    };
                    for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
                        var selection = selections_1[_i];
                        _loop_1(selection);
                    }
                    if (toToggle.length) {
                        foldingModel.toggleCollapseState(toToggle);
                        _this.reveal(selections[0].getPosition());
                    }
                }
            }
        });
    };
    FoldingController.prototype.onEditorMouseDown = function (e) {
        this.mouseDownInfo = null;
        var range = e.target.range;
        if (!this.hiddenRangeModel || !range) {
            return;
        }
        if (!e.event.leftButton && !e.event.middleButton) {
            return;
        }
        var iconClicked = false;
        switch (e.target.type) {
            case MouseTargetType.GUTTER_LINE_DECORATIONS:
                var data = e.target.detail;
                var gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;
                // TODO@joao TODO@alex TODO@martin this is such that we don't collide with dirty diff
                if (gutterOffsetX <= 10) {
                    return;
                }
                iconClicked = true;
                break;
            case MouseTargetType.CONTENT_EMPTY: {
                if (this.hiddenRangeModel.hasRanges()) {
                    var data_1 = e.target.detail;
                    if (!data_1.isAfterLines) {
                        break;
                    }
                }
                return;
            }
            case MouseTargetType.CONTENT_TEXT: {
                if (this.hiddenRangeModel.hasRanges()) {
                    var model = this.editor.getModel();
                    if (model && range.startColumn === model.getLineMaxColumn(range.startLineNumber)) {
                        break;
                    }
                }
                return;
            }
            default:
                return;
        }
        this.mouseDownInfo = { lineNumber: range.startLineNumber, iconClicked: iconClicked };
    };
    FoldingController.prototype.onEditorMouseUp = function (e) {
        var _this = this;
        if (!this.mouseDownInfo) {
            return;
        }
        var lineNumber = this.mouseDownInfo.lineNumber;
        var iconClicked = this.mouseDownInfo.iconClicked;
        var range = e.target.range;
        if (!range || range.startLineNumber !== lineNumber) {
            return;
        }
        if (iconClicked) {
            if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
                return;
            }
        }
        else {
            var model = this.editor.getModel();
            if (range.startColumn !== model.getLineMaxColumn(lineNumber)) {
                return;
            }
        }
        this.getFoldingModel().then(function (foldingModel) {
            if (foldingModel) {
                var region = foldingModel.getRegionAtLine(lineNumber);
                if (region && region.startLineNumber === lineNumber) {
                    var isCollapsed_1 = region.isCollapsed;
                    if (iconClicked || isCollapsed_1) {
                        var toToggle = [region];
                        if (e.event.middleButton || e.event.shiftKey) {
                            toToggle.push.apply(toToggle, foldingModel.getRegionsInside(region, function (r) { return r.isCollapsed === isCollapsed_1; }));
                        }
                        foldingModel.toggleCollapseState(toToggle);
                        _this.reveal({ lineNumber: lineNumber, column: 1 });
                    }
                }
            }
        });
    };
    FoldingController.prototype.reveal = function (position) {
        this.editor.revealPositionInCenterIfOutsideViewport(position, 0 /* Smooth */);
    };
    FoldingController.MAX_FOLDING_REGIONS = 5000;
    return FoldingController;
}());
export { FoldingController };
var FoldingAction = /** @class */ (function (_super) {
    __extends(FoldingAction, _super);
    function FoldingAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FoldingAction.prototype.runEditorCommand = function (accessor, editor, args) {
        var _this = this;
        var foldingController = FoldingController.get(editor);
        if (!foldingController) {
            return;
        }
        var foldingModelPromise = foldingController.getFoldingModel();
        if (foldingModelPromise) {
            this.reportTelemetry(accessor, editor);
            return foldingModelPromise.then(function (foldingModel) {
                if (foldingModel) {
                    _this.invoke(foldingController, foldingModel, editor, args);
                    foldingController.reveal(editor.getSelection().getStartPosition());
                }
            });
        }
    };
    FoldingAction.prototype.getSelectedLines = function (editor) {
        var selections = editor.getSelections();
        return selections ? selections.map(function (s) { return s.startLineNumber; }) : [];
    };
    FoldingAction.prototype.getLineNumbers = function (args, editor) {
        if (args && args.selectionLines) {
            return args.selectionLines.map(function (l) { return l + 1; }); // to 0-bases line numbers
        }
        return this.getSelectedLines(editor);
    };
    FoldingAction.prototype.run = function (accessor, editor) {
    };
    return FoldingAction;
}(EditorAction));
function foldingArgumentsConstraint(args) {
    if (!types.isUndefined(args)) {
        if (!types.isObject(args)) {
            return false;
        }
        var foldingArgs = args;
        if (!types.isUndefined(foldingArgs.levels) && !types.isNumber(foldingArgs.levels)) {
            return false;
        }
        if (!types.isUndefined(foldingArgs.direction) && !types.isString(foldingArgs.direction)) {
            return false;
        }
        if (!types.isUndefined(foldingArgs.selectionLines) && (!types.isArray(foldingArgs.selectionLines) || !foldingArgs.selectionLines.every(types.isNumber))) {
            return false;
        }
    }
    return true;
}
var UnfoldAction = /** @class */ (function (_super) {
    __extends(UnfoldAction, _super);
    function UnfoldAction() {
        return _super.call(this, {
            id: 'editor.unfold',
            label: nls.localize('unfoldAction.label', "Unfold"),
            alias: 'Unfold',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 89 /* US_CLOSE_SQUARE_BRACKET */,
                mac: {
                    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 89 /* US_CLOSE_SQUARE_BRACKET */
                }
            },
            description: {
                description: 'Unfold the content in the editor',
                args: [
                    {
                        name: 'Unfold editor argument',
                        description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t* 'levels': Number of levels to unfold. If not set, defaults to 1.\n\t\t\t\t\t\t* 'direction': If 'up', unfold given number of levels up otherwise unfolds down\n\t\t\t\t\t\t* 'selectionLines': The start lines (0-based) of the editor selections to apply the unfold action to. If not set, the active selection(s) will be used.\n\t\t\t\t\t\t",
                        constraint: foldingArgumentsConstraint
                    }
                ]
            }
        }) || this;
    }
    UnfoldAction.prototype.invoke = function (foldingController, foldingModel, editor, args) {
        var levels = args && args.levels || 1;
        var lineNumbers = this.getLineNumbers(args, editor);
        if (args && args.direction === 'up') {
            setCollapseStateLevelsUp(foldingModel, false, levels, lineNumbers);
        }
        else {
            setCollapseStateLevelsDown(foldingModel, false, levels, lineNumbers);
        }
    };
    return UnfoldAction;
}(FoldingAction));
var UnFoldRecursivelyAction = /** @class */ (function (_super) {
    __extends(UnFoldRecursivelyAction, _super);
    function UnFoldRecursivelyAction() {
        return _super.call(this, {
            id: 'editor.unfoldRecursively',
            label: nls.localize('unFoldRecursivelyAction.label', "Unfold Recursively"),
            alias: 'Unfold Recursively',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 89 /* US_CLOSE_SQUARE_BRACKET */)
            }
        }) || this;
    }
    UnFoldRecursivelyAction.prototype.invoke = function (foldingController, foldingModel, editor, args) {
        setCollapseStateLevelsDown(foldingModel, false, Number.MAX_VALUE, this.getSelectedLines(editor));
    };
    return UnFoldRecursivelyAction;
}(FoldingAction));
var FoldAction = /** @class */ (function (_super) {
    __extends(FoldAction, _super);
    function FoldAction() {
        return _super.call(this, {
            id: 'editor.fold',
            label: nls.localize('foldAction.label', "Fold"),
            alias: 'Fold',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 87 /* US_OPEN_SQUARE_BRACKET */,
                mac: {
                    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 87 /* US_OPEN_SQUARE_BRACKET */
                }
            },
            description: {
                description: 'Fold the content in the editor',
                args: [
                    {
                        name: 'Fold editor argument',
                        description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t\t* 'levels': Number of levels to fold. Defaults to 1\n\t\t\t\t\t\t\t* 'direction': If 'up', folds given number of levels up otherwise folds down\n\t\t\t\t\t\t\t* 'selectionLines': The start lines (0-based) of the editor selections to apply the fold action to. If not set, the active selection(s) will be used.\n\t\t\t\t\t\t",
                        constraint: foldingArgumentsConstraint
                    }
                ]
            }
        }) || this;
    }
    FoldAction.prototype.invoke = function (foldingController, foldingModel, editor, args) {
        var levels = args && args.levels || 1;
        var lineNumbers = this.getLineNumbers(args, editor);
        if (args && args.direction === 'up') {
            setCollapseStateLevelsUp(foldingModel, true, levels, lineNumbers);
        }
        else {
            setCollapseStateLevelsDown(foldingModel, true, levels, lineNumbers);
        }
    };
    return FoldAction;
}(FoldingAction));
var FoldRecursivelyAction = /** @class */ (function (_super) {
    __extends(FoldRecursivelyAction, _super);
    function FoldRecursivelyAction() {
        return _super.call(this, {
            id: 'editor.foldRecursively',
            label: nls.localize('foldRecursivelyAction.label', "Fold Recursively"),
            alias: 'Fold Recursively',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 87 /* US_OPEN_SQUARE_BRACKET */)
            }
        }) || this;
    }
    FoldRecursivelyAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        var selectedLines = this.getSelectedLines(editor);
        setCollapseStateLevelsDown(foldingModel, true, Number.MAX_VALUE, selectedLines);
    };
    return FoldRecursivelyAction;
}(FoldingAction));
var FoldAllBlockCommentsAction = /** @class */ (function (_super) {
    __extends(FoldAllBlockCommentsAction, _super);
    function FoldAllBlockCommentsAction() {
        return _super.call(this, {
            id: 'editor.foldAllBlockComments',
            label: nls.localize('foldAllBlockComments.label', "Fold All Block Comments"),
            alias: 'Fold All Block Comments',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 85 /* US_SLASH */)
            }
        }) || this;
    }
    FoldAllBlockCommentsAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Comment.value, true);
        }
        else {
            var comments = LanguageConfigurationRegistry.getComments(editor.getModel().getLanguageIdentifier().id);
            if (comments && comments.blockCommentStartToken) {
                var regExp = new RegExp('^\\s*' + escapeRegExpCharacters(comments.blockCommentStartToken));
                setCollapseStateForMatchingLines(foldingModel, regExp, true);
            }
        }
    };
    return FoldAllBlockCommentsAction;
}(FoldingAction));
var FoldAllRegionsAction = /** @class */ (function (_super) {
    __extends(FoldAllRegionsAction, _super);
    function FoldAllRegionsAction() {
        return _super.call(this, {
            id: 'editor.foldAllMarkerRegions',
            label: nls.localize('foldAllMarkerRegions.label', "Fold All Regions"),
            alias: 'Fold All Regions',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 29 /* KEY_8 */)
            }
        }) || this;
    }
    FoldAllRegionsAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, true);
        }
        else {
            var foldingRules = LanguageConfigurationRegistry.getFoldingRules(editor.getModel().getLanguageIdentifier().id);
            if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
                var regExp = new RegExp(foldingRules.markers.start);
                setCollapseStateForMatchingLines(foldingModel, regExp, true);
            }
        }
    };
    return FoldAllRegionsAction;
}(FoldingAction));
var UnfoldAllRegionsAction = /** @class */ (function (_super) {
    __extends(UnfoldAllRegionsAction, _super);
    function UnfoldAllRegionsAction() {
        return _super.call(this, {
            id: 'editor.unfoldAllMarkerRegions',
            label: nls.localize('unfoldAllMarkerRegions.label', "Unfold All Regions"),
            alias: 'Unfold All Regions',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 30 /* KEY_9 */)
            }
        }) || this;
    }
    UnfoldAllRegionsAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        if (foldingModel.regions.hasTypes()) {
            setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, false);
        }
        else {
            var foldingRules = LanguageConfigurationRegistry.getFoldingRules(editor.getModel().getLanguageIdentifier().id);
            if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
                var regExp = new RegExp(foldingRules.markers.start);
                setCollapseStateForMatchingLines(foldingModel, regExp, false);
            }
        }
    };
    return UnfoldAllRegionsAction;
}(FoldingAction));
var FoldAllAction = /** @class */ (function (_super) {
    __extends(FoldAllAction, _super);
    function FoldAllAction() {
        return _super.call(this, {
            id: 'editor.foldAll',
            label: nls.localize('foldAllAction.label', "Fold All"),
            alias: 'Fold All',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 21 /* KEY_0 */)
            }
        }) || this;
    }
    FoldAllAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        setCollapseStateLevelsDown(foldingModel, true);
    };
    return FoldAllAction;
}(FoldingAction));
var UnfoldAllAction = /** @class */ (function (_super) {
    __extends(UnfoldAllAction, _super);
    function UnfoldAllAction() {
        return _super.call(this, {
            id: 'editor.unfoldAll',
            label: nls.localize('unfoldAllAction.label', "Unfold All"),
            alias: 'Unfold All',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 40 /* KEY_J */)
            }
        }) || this;
    }
    UnfoldAllAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        setCollapseStateLevelsDown(foldingModel, false);
    };
    return UnfoldAllAction;
}(FoldingAction));
var FoldLevelAction = /** @class */ (function (_super) {
    __extends(FoldLevelAction, _super);
    function FoldLevelAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FoldLevelAction.prototype.getFoldingLevel = function () {
        return parseInt(this.id.substr(FoldLevelAction.ID_PREFIX.length));
    };
    FoldLevelAction.prototype.invoke = function (foldingController, foldingModel, editor) {
        setCollapseStateAtLevel(foldingModel, this.getFoldingLevel(), true, this.getSelectedLines(editor));
    };
    FoldLevelAction.ID_PREFIX = 'editor.foldLevel';
    FoldLevelAction.ID = function (level) { return FoldLevelAction.ID_PREFIX + level; };
    return FoldLevelAction;
}(FoldingAction));
registerEditorContribution(FoldingController);
registerEditorAction(UnfoldAction);
registerEditorAction(UnFoldRecursivelyAction);
registerEditorAction(FoldAction);
registerEditorAction(FoldRecursivelyAction);
registerEditorAction(FoldAllAction);
registerEditorAction(UnfoldAllAction);
registerEditorAction(FoldAllBlockCommentsAction);
registerEditorAction(FoldAllRegionsAction);
registerEditorAction(UnfoldAllRegionsAction);
for (var i = 1; i <= 7; i++) {
    registerInstantiatedEditorAction(new FoldLevelAction({
        id: FoldLevelAction.ID(i),
        label: nls.localize('foldLevelAction.label', "Fold Level {0}", i),
        alias: "Fold Level " + i,
        precondition: null,
        kbOpts: {
            kbExpr: EditorContextKeys.editorTextFocus,
            primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | (21 /* KEY_0 */ + i))
        }
    }));
}
