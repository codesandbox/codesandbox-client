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
import './findWidget.css';
import * as nls from '../../../nls';
import { onUnexpectedError } from '../../../base/common/errors';
import * as platform from '../../../base/common/platform';
import * as strings from '../../../base/common/strings';
import { Delayer } from '../../../base/common/async';
import * as dom from '../../../base/browser/dom';
import { Widget } from '../../../base/browser/ui/widget';
import { Sash, Orientation } from '../../../base/browser/ui/sash/sash';
import { OverlayWidgetPositionPreference } from '../../browser/editorBrowser';
import { FIND_IDS, MATCHES_LIMIT, CONTEXT_FIND_INPUT_FOCUSED, CONTEXT_REPLACE_INPUT_FOCUSED } from './findModel';
import { Range } from '../../common/core/range';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService';
import { editorFindRangeHighlight, editorFindMatch, editorFindMatchHighlight, contrastBorder, inputBackground, editorWidgetBackground, inputActiveOptionBorder, widgetShadow, inputForeground, inputBorder, inputValidationInfoBackground, inputValidationInfoBorder, inputValidationWarningBackground, inputValidationWarningBorder, inputValidationErrorBackground, inputValidationErrorBorder, errorForeground, editorWidgetBorder, editorFindMatchBorder, editorFindMatchHighlightBorder, editorFindRangeHighlightBorder, editorWidgetResizeBorder } from '../../../platform/theme/common/colorRegistry';
import { ContextScopedFindInput, ContextScopedHistoryInputBox } from '../../../platform/widget/browser/contextScopedHistoryWidget';
var NLS_FIND_INPUT_LABEL = nls.localize('label.find', "Find");
var NLS_FIND_INPUT_PLACEHOLDER = nls.localize('placeholder.find', "Find");
var NLS_PREVIOUS_MATCH_BTN_LABEL = nls.localize('label.previousMatchButton', "Previous match");
var NLS_NEXT_MATCH_BTN_LABEL = nls.localize('label.nextMatchButton', "Next match");
var NLS_TOGGLE_SELECTION_FIND_TITLE = nls.localize('label.toggleSelectionFind', "Find in selection");
var NLS_CLOSE_BTN_LABEL = nls.localize('label.closeButton', "Close");
var NLS_REPLACE_INPUT_LABEL = nls.localize('label.replace', "Replace");
var NLS_REPLACE_INPUT_PLACEHOLDER = nls.localize('placeholder.replace', "Replace");
var NLS_REPLACE_BTN_LABEL = nls.localize('label.replaceButton', "Replace");
var NLS_REPLACE_ALL_BTN_LABEL = nls.localize('label.replaceAllButton', "Replace All");
var NLS_TOGGLE_REPLACE_MODE_BTN_LABEL = nls.localize('label.toggleReplaceButton', "Toggle Replace mode");
var NLS_MATCHES_COUNT_LIMIT_TITLE = nls.localize('title.matchesCountLimit', "Only the first {0} results are highlighted, but all find operations work on the entire text.", MATCHES_LIMIT);
var NLS_MATCHES_LOCATION = nls.localize('label.matchesLocation', "{0} of {1}");
var NLS_NO_RESULTS = nls.localize('label.noResults', "No Results");
var FIND_WIDGET_INITIAL_WIDTH = 411;
var PART_WIDTH = 275;
var FIND_INPUT_AREA_WIDTH = PART_WIDTH - 54;
var REPLACE_INPUT_AREA_WIDTH = FIND_INPUT_AREA_WIDTH;
var MAX_MATCHES_COUNT_WIDTH = 69;
var FIND_ALL_CONTROLS_WIDTH = 17 /** Find Input margin-left */ + (MAX_MATCHES_COUNT_WIDTH + 3 + 1) /** Match Results */ + 23 /** Button */ * 4 + 2 /** sash */;
var FIND_INPUT_AREA_HEIGHT = 34; // The height of Find Widget when Replace Input is not visible.
var FIND_REPLACE_AREA_HEIGHT = 64; // The height of Find Widget when Replace Input is  visible.
var FindWidgetViewZone = /** @class */ (function () {
    function FindWidgetViewZone(afterLineNumber) {
        this.afterLineNumber = afterLineNumber;
        this.heightInPx = FIND_INPUT_AREA_HEIGHT;
        this.suppressMouseDown = false;
        this.domNode = document.createElement('div');
        this.domNode.className = 'dock-find-viewzone';
    }
    return FindWidgetViewZone;
}());
export { FindWidgetViewZone };
var FindWidget = /** @class */ (function (_super) {
    __extends(FindWidget, _super);
    function FindWidget(codeEditor, controller, state, contextViewProvider, keybindingService, contextKeyService, themeService) {
        var _this = _super.call(this) || this;
        _this._codeEditor = codeEditor;
        _this._controller = controller;
        _this._state = state;
        _this._contextViewProvider = contextViewProvider;
        _this._keybindingService = keybindingService;
        _this._contextKeyService = contextKeyService;
        _this._isVisible = false;
        _this._isReplaceVisible = false;
        _this._updateHistoryDelayer = new Delayer(500);
        _this._register(_this._state.onFindReplaceStateChange(function (e) { return _this._onStateChanged(e); }));
        _this._buildDomNode();
        _this._updateButtons();
        _this._tryUpdateWidgetWidth();
        _this._register(_this._codeEditor.onDidChangeConfiguration(function (e) {
            if (e.readOnly) {
                if (_this._codeEditor.getConfiguration().readOnly) {
                    // Hide replace part if editor becomes read only
                    _this._state.change({ isReplaceRevealed: false }, false);
                }
                _this._updateButtons();
            }
            if (e.layoutInfo) {
                _this._tryUpdateWidgetWidth();
            }
        }));
        _this._register(_this._codeEditor.onDidChangeCursorSelection(function () {
            if (_this._isVisible) {
                _this._updateToggleSelectionFindButton();
            }
        }));
        _this._register(_this._codeEditor.onDidFocusEditorWidget(function () {
            if (_this._isVisible) {
                var globalBufferTerm = _this._controller.getGlobalBufferTerm();
                if (globalBufferTerm && globalBufferTerm !== _this._state.searchString) {
                    _this._state.change({ searchString: globalBufferTerm }, true);
                    _this._findInput.select();
                }
            }
        }));
        _this._findInputFocused = CONTEXT_FIND_INPUT_FOCUSED.bindTo(contextKeyService);
        _this._findFocusTracker = _this._register(dom.trackFocus(_this._findInput.inputBox.inputElement));
        _this._register(_this._findFocusTracker.onDidFocus(function () {
            _this._findInputFocused.set(true);
            _this._updateSearchScope();
        }));
        _this._register(_this._findFocusTracker.onDidBlur(function () {
            _this._findInputFocused.set(false);
        }));
        _this._replaceInputFocused = CONTEXT_REPLACE_INPUT_FOCUSED.bindTo(contextKeyService);
        _this._replaceFocusTracker = _this._register(dom.trackFocus(_this._replaceInputBox.inputElement));
        _this._register(_this._replaceFocusTracker.onDidFocus(function () {
            _this._replaceInputFocused.set(true);
            _this._updateSearchScope();
        }));
        _this._register(_this._replaceFocusTracker.onDidBlur(function () {
            _this._replaceInputFocused.set(false);
        }));
        _this._codeEditor.addOverlayWidget(_this);
        _this._viewZone = new FindWidgetViewZone(0); // Put it before the first line then users can scroll beyond the first line.
        _this._applyTheme(themeService.getTheme());
        _this._register(themeService.onThemeChange(_this._applyTheme.bind(_this)));
        _this._register(_this._codeEditor.onDidChangeModel(function (e) {
            if (!_this._isVisible) {
                return;
            }
            if (_this._viewZoneId === undefined) {
                return;
            }
            _this._codeEditor.changeViewZones(function (accessor) {
                accessor.removeZone(_this._viewZoneId);
                _this._viewZoneId = undefined;
            });
        }));
        _this._register(_this._codeEditor.onDidScrollChange(function (e) {
            if (e.scrollTopChanged) {
                _this._layoutViewZone();
                return;
            }
            // for other scroll changes, layout the viewzone in next tick to avoid ruining current rendering.
            setTimeout(function () {
                _this._layoutViewZone();
            }, 0);
        }));
        return _this;
    }
    // ----- IOverlayWidget API
    FindWidget.prototype.getId = function () {
        return FindWidget.ID;
    };
    FindWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    FindWidget.prototype.getPosition = function () {
        if (this._isVisible) {
            return {
                preference: OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
            };
        }
        return null;
    };
    // ----- React to state changes
    FindWidget.prototype._onStateChanged = function (e) {
        if (e.searchString) {
            this._findInput.setValue(this._state.searchString);
            this._updateButtons();
        }
        if (e.replaceString) {
            this._replaceInputBox.value = this._state.replaceString;
        }
        if (e.isRevealed) {
            if (this._state.isRevealed) {
                this._reveal(true);
            }
            else {
                this._hide(true);
            }
        }
        if (e.isReplaceRevealed) {
            if (this._state.isReplaceRevealed) {
                if (!this._codeEditor.getConfiguration().readOnly && !this._isReplaceVisible) {
                    this._isReplaceVisible = true;
                    this._replaceInputBox.width = this._findInput.inputBox.width;
                    this._updateButtons();
                }
            }
            else {
                if (this._isReplaceVisible) {
                    this._isReplaceVisible = false;
                    this._updateButtons();
                }
            }
        }
        if (e.isRegex) {
            this._findInput.setRegex(this._state.isRegex);
        }
        if (e.wholeWord) {
            this._findInput.setWholeWords(this._state.wholeWord);
        }
        if (e.matchCase) {
            this._findInput.setCaseSensitive(this._state.matchCase);
        }
        if (e.searchScope) {
            if (this._state.searchScope) {
                this._toggleSelectionFind.checked = true;
            }
            else {
                this._toggleSelectionFind.checked = false;
            }
            this._updateToggleSelectionFindButton();
        }
        if (e.searchString || e.matchesCount || e.matchesPosition) {
            var showRedOutline = (this._state.searchString.length > 0 && this._state.matchesCount === 0);
            dom.toggleClass(this._domNode, 'no-results', showRedOutline);
            this._updateMatchesCount();
        }
        if (e.searchString || e.currentMatch) {
            this._layoutViewZone();
        }
        if (e.updateHistory) {
            this._delayedUpdateHistory();
        }
    };
    FindWidget.prototype._delayedUpdateHistory = function () {
        this._updateHistoryDelayer.trigger(this._updateHistory.bind(this));
    };
    FindWidget.prototype._updateHistory = function () {
        if (this._state.searchString) {
            this._findInput.inputBox.addToHistory();
        }
        if (this._state.replaceString) {
            this._replaceInputBox.addToHistory();
        }
    };
    FindWidget.prototype._updateMatchesCount = function () {
        this._matchesCount.style.minWidth = MAX_MATCHES_COUNT_WIDTH + 'px';
        if (this._state.matchesCount >= MATCHES_LIMIT) {
            this._matchesCount.title = NLS_MATCHES_COUNT_LIMIT_TITLE;
        }
        else {
            this._matchesCount.title = '';
        }
        // remove previous content
        if (this._matchesCount.firstChild) {
            this._matchesCount.removeChild(this._matchesCount.firstChild);
        }
        var label;
        if (this._state.matchesCount > 0) {
            var matchesCount = String(this._state.matchesCount);
            if (this._state.matchesCount >= MATCHES_LIMIT) {
                matchesCount += '+';
            }
            var matchesPosition = String(this._state.matchesPosition);
            if (matchesPosition === '0') {
                matchesPosition = '?';
            }
            label = strings.format(NLS_MATCHES_LOCATION, matchesPosition, matchesCount);
        }
        else {
            label = NLS_NO_RESULTS;
        }
        this._matchesCount.appendChild(document.createTextNode(label));
        MAX_MATCHES_COUNT_WIDTH = Math.max(MAX_MATCHES_COUNT_WIDTH, this._matchesCount.clientWidth);
    };
    // ----- actions
    /**
     * If 'selection find' is ON we should not disable the button (its function is to cancel 'selection find').
     * If 'selection find' is OFF we enable the button only if there is a selection.
     */
    FindWidget.prototype._updateToggleSelectionFindButton = function () {
        var selection = this._codeEditor.getSelection();
        var isSelection = selection ? (selection.startLineNumber !== selection.endLineNumber || selection.startColumn !== selection.endColumn) : false;
        var isChecked = this._toggleSelectionFind.checked;
        this._toggleSelectionFind.setEnabled(this._isVisible && (isChecked || isSelection));
    };
    FindWidget.prototype._updateButtons = function () {
        this._findInput.setEnabled(this._isVisible);
        this._replaceInputBox.setEnabled(this._isVisible && this._isReplaceVisible);
        this._updateToggleSelectionFindButton();
        this._closeBtn.setEnabled(this._isVisible);
        var findInputIsNonEmpty = (this._state.searchString.length > 0);
        this._prevBtn.setEnabled(this._isVisible && findInputIsNonEmpty);
        this._nextBtn.setEnabled(this._isVisible && findInputIsNonEmpty);
        this._replaceBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);
        this._replaceAllBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);
        dom.toggleClass(this._domNode, 'replaceToggled', this._isReplaceVisible);
        this._toggleReplaceBtn.toggleClass('collapse', !this._isReplaceVisible);
        this._toggleReplaceBtn.toggleClass('expand', this._isReplaceVisible);
        this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);
        var canReplace = !this._codeEditor.getConfiguration().readOnly;
        this._toggleReplaceBtn.setEnabled(this._isVisible && canReplace);
    };
    FindWidget.prototype._reveal = function (animate) {
        var _this = this;
        if (!this._isVisible) {
            this._isVisible = true;
            var selection = this._codeEditor.getSelection();
            var isSelection = selection ? (selection.startLineNumber !== selection.endLineNumber || selection.startColumn !== selection.endColumn) : false;
            if (isSelection && this._codeEditor.getConfiguration().contribInfo.find.autoFindInSelection) {
                this._toggleSelectionFind.checked = true;
            }
            else {
                this._toggleSelectionFind.checked = false;
            }
            this._tryUpdateWidgetWidth();
            this._updateButtons();
            setTimeout(function () {
                dom.addClass(_this._domNode, 'visible');
                _this._domNode.setAttribute('aria-hidden', 'false');
            }, 0);
            this._codeEditor.layoutOverlayWidget(this);
            var adjustEditorScrollTop = true;
            if (this._codeEditor.getConfiguration().contribInfo.find.seedSearchStringFromSelection && selection) {
                var editorCoords = dom.getDomNodePagePosition(this._codeEditor.getDomNode());
                var startCoords = this._codeEditor.getScrolledVisiblePosition(selection.getStartPosition());
                var startLeft = editorCoords.left + startCoords.left;
                var startTop = startCoords.top;
                if (startTop < this._viewZone.heightInPx) {
                    if (selection.endLineNumber > selection.startLineNumber) {
                        adjustEditorScrollTop = false;
                    }
                    var leftOfFindWidget = dom.getTopLeftOffset(this._domNode).left;
                    if (startLeft > leftOfFindWidget) {
                        adjustEditorScrollTop = false;
                    }
                    var endCoords = this._codeEditor.getScrolledVisiblePosition(selection.getEndPosition());
                    var endLeft = editorCoords.left + endCoords.left;
                    if (endLeft > leftOfFindWidget) {
                        adjustEditorScrollTop = false;
                    }
                }
            }
            this._showViewZone(adjustEditorScrollTop);
        }
    };
    FindWidget.prototype._hide = function (focusTheEditor) {
        var _this = this;
        if (this._isVisible) {
            this._isVisible = false;
            this._updateButtons();
            dom.removeClass(this._domNode, 'visible');
            this._domNode.setAttribute('aria-hidden', 'true');
            if (focusTheEditor) {
                this._codeEditor.focus();
            }
            this._codeEditor.layoutOverlayWidget(this);
            this._codeEditor.changeViewZones(function (accessor) {
                if (_this._viewZoneId !== undefined) {
                    accessor.removeZone(_this._viewZoneId);
                    _this._viewZoneId = undefined;
                    _this._codeEditor.setScrollTop(_this._codeEditor.getScrollTop() - _this._viewZone.heightInPx);
                }
            });
        }
    };
    FindWidget.prototype._layoutViewZone = function () {
        var _this = this;
        if (!this._isVisible) {
            return;
        }
        if (this._viewZoneId !== undefined) {
            return;
        }
        this._codeEditor.changeViewZones(function (accessor) {
            if (_this._state.isReplaceRevealed) {
                _this._viewZone.heightInPx = FIND_REPLACE_AREA_HEIGHT;
            }
            else {
                _this._viewZone.heightInPx = FIND_INPUT_AREA_HEIGHT;
            }
            _this._viewZoneId = accessor.addZone(_this._viewZone);
            // scroll top adjust to make sure the editor doesn't scroll when adding viewzone at the beginning.
            _this._codeEditor.setScrollTop(_this._codeEditor.getScrollTop() + _this._viewZone.heightInPx);
        });
    };
    FindWidget.prototype._showViewZone = function (adjustScroll) {
        var _this = this;
        if (adjustScroll === void 0) { adjustScroll = true; }
        if (!this._isVisible) {
            return;
        }
        this._codeEditor.changeViewZones(function (accessor) {
            var scrollAdjustment = FIND_INPUT_AREA_HEIGHT;
            if (_this._viewZoneId !== undefined) {
                if (_this._state.isReplaceRevealed) {
                    _this._viewZone.heightInPx = FIND_REPLACE_AREA_HEIGHT;
                    scrollAdjustment = FIND_REPLACE_AREA_HEIGHT - FIND_INPUT_AREA_HEIGHT;
                }
                else {
                    _this._viewZone.heightInPx = FIND_INPUT_AREA_HEIGHT;
                    scrollAdjustment = FIND_INPUT_AREA_HEIGHT - FIND_REPLACE_AREA_HEIGHT;
                }
                accessor.removeZone(_this._viewZoneId);
            }
            else {
                _this._viewZone.heightInPx = FIND_INPUT_AREA_HEIGHT;
            }
            _this._viewZoneId = accessor.addZone(_this._viewZone);
            if (adjustScroll) {
                _this._codeEditor.setScrollTop(_this._codeEditor.getScrollTop() + scrollAdjustment);
            }
        });
    };
    FindWidget.prototype._applyTheme = function (theme) {
        var inputStyles = {
            inputActiveOptionBorder: theme.getColor(inputActiveOptionBorder),
            inputBackground: theme.getColor(inputBackground),
            inputForeground: theme.getColor(inputForeground),
            inputBorder: theme.getColor(inputBorder),
            inputValidationInfoBackground: theme.getColor(inputValidationInfoBackground),
            inputValidationInfoBorder: theme.getColor(inputValidationInfoBorder),
            inputValidationWarningBackground: theme.getColor(inputValidationWarningBackground),
            inputValidationWarningBorder: theme.getColor(inputValidationWarningBorder),
            inputValidationErrorBackground: theme.getColor(inputValidationErrorBackground),
            inputValidationErrorBorder: theme.getColor(inputValidationErrorBorder)
        };
        this._findInput.style(inputStyles);
        this._replaceInputBox.style(inputStyles);
    };
    FindWidget.prototype._tryUpdateWidgetWidth = function () {
        if (!this._isVisible) {
            return;
        }
        var editorWidth = this._codeEditor.getConfiguration().layoutInfo.width;
        var minimapWidth = this._codeEditor.getConfiguration().layoutInfo.minimapWidth;
        var collapsedFindWidget = false;
        var reducedFindWidget = false;
        var narrowFindWidget = false;
        if (this._resized) {
            var widgetWidth = dom.getTotalWidth(this._domNode);
            if (widgetWidth > FIND_WIDGET_INITIAL_WIDTH) {
                // as the widget is resized by users, we may need to change the max width of the widget as the editor width changes.
                this._domNode.style.maxWidth = editorWidth - 28 - minimapWidth - 15 + "px";
                this._replaceInputBox.inputElement.style.width = dom.getTotalWidth(this._findInput.inputBox.inputElement) + "px";
                return;
            }
        }
        if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth >= editorWidth) {
            reducedFindWidget = true;
        }
        if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth - MAX_MATCHES_COUNT_WIDTH >= editorWidth) {
            narrowFindWidget = true;
        }
        if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth - MAX_MATCHES_COUNT_WIDTH >= editorWidth + 50) {
            collapsedFindWidget = true;
        }
        dom.toggleClass(this._domNode, 'collapsed-find-widget', collapsedFindWidget);
        dom.toggleClass(this._domNode, 'narrow-find-widget', narrowFindWidget);
        dom.toggleClass(this._domNode, 'reduced-find-widget', reducedFindWidget);
        if (!narrowFindWidget && !collapsedFindWidget) {
            // the minimal left offset of findwidget is 15px.
            this._domNode.style.maxWidth = editorWidth - 28 - minimapWidth - 15 + "px";
        }
        if (this._resized) {
            var findInputWidth = dom.getTotalWidth(this._findInput.inputBox.inputElement);
            if (findInputWidth > 0) {
                this._replaceInputBox.inputElement.style.width = findInputWidth + "px";
            }
        }
    };
    // ----- Public
    FindWidget.prototype.focusFindInput = function () {
        this._findInput.select();
        // Edge browser requires focus() in addition to select()
        this._findInput.focus();
    };
    FindWidget.prototype.focusReplaceInput = function () {
        this._replaceInputBox.select();
        // Edge browser requires focus() in addition to select()
        this._replaceInputBox.focus();
    };
    FindWidget.prototype.highlightFindOptions = function () {
        this._findInput.highlightFindOptions();
    };
    FindWidget.prototype._updateSearchScope = function () {
        if (this._toggleSelectionFind.checked) {
            var selection = this._codeEditor.getSelection();
            if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
                selection = selection.setEndPosition(selection.endLineNumber - 1, 1);
            }
            var currentMatch = this._state.currentMatch;
            if (selection.startLineNumber !== selection.endLineNumber) {
                if (!Range.equalsRange(selection, currentMatch)) {
                    // Reseed find scope
                    this._state.change({ searchScope: selection }, true);
                }
            }
        }
    };
    FindWidget.prototype._onFindInputMouseDown = function (e) {
        // on linux, middle key does pasting.
        if (e.middleButton) {
            e.stopPropagation();
        }
    };
    FindWidget.prototype._onFindInputKeyDown = function (e) {
        if (e.equals(3 /* Enter */)) {
            this._codeEditor.getAction(FIND_IDS.NextMatchFindAction).run().done(null, onUnexpectedError);
            e.preventDefault();
            return;
        }
        if (e.equals(1024 /* Shift */ | 3 /* Enter */)) {
            this._codeEditor.getAction(FIND_IDS.PreviousMatchFindAction).run().done(null, onUnexpectedError);
            e.preventDefault();
            return;
        }
        if (e.equals(2 /* Tab */)) {
            if (this._isReplaceVisible) {
                this._replaceInputBox.focus();
            }
            else {
                this._findInput.focusOnCaseSensitive();
            }
            e.preventDefault();
            return;
        }
        if (e.equals(2048 /* CtrlCmd */ | 18 /* DownArrow */)) {
            this._codeEditor.focus();
            e.preventDefault();
            return;
        }
    };
    FindWidget.prototype._onReplaceInputKeyDown = function (e) {
        if (e.equals(3 /* Enter */)) {
            this._controller.replace();
            e.preventDefault();
            return;
        }
        if (e.equals(2048 /* CtrlCmd */ | 3 /* Enter */)) {
            this._controller.replaceAll();
            e.preventDefault();
            return;
        }
        if (e.equals(2 /* Tab */)) {
            this._findInput.focusOnCaseSensitive();
            e.preventDefault();
            return;
        }
        if (e.equals(1024 /* Shift */ | 2 /* Tab */)) {
            this._findInput.focus();
            e.preventDefault();
            return;
        }
        if (e.equals(2048 /* CtrlCmd */ | 18 /* DownArrow */)) {
            this._codeEditor.focus();
            e.preventDefault();
            return;
        }
    };
    // ----- sash
    FindWidget.prototype.getHorizontalSashTop = function (sash) {
        return 0;
    };
    FindWidget.prototype.getHorizontalSashLeft = function (sash) {
        return 0;
    };
    FindWidget.prototype.getHorizontalSashWidth = function (sash) {
        return 500;
    };
    // ----- initialization
    FindWidget.prototype._keybindingLabelFor = function (actionId) {
        var kb = this._keybindingService.lookupKeybinding(actionId);
        if (!kb) {
            return '';
        }
        return " (" + kb.getLabel() + ")";
    };
    FindWidget.prototype._buildFindPart = function () {
        var _this = this;
        // Find input
        this._findInput = this._register(new ContextScopedFindInput(null, this._contextViewProvider, {
            width: FIND_INPUT_AREA_WIDTH,
            label: NLS_FIND_INPUT_LABEL,
            placeholder: NLS_FIND_INPUT_PLACEHOLDER,
            appendCaseSensitiveLabel: this._keybindingLabelFor(FIND_IDS.ToggleCaseSensitiveCommand),
            appendWholeWordsLabel: this._keybindingLabelFor(FIND_IDS.ToggleWholeWordCommand),
            appendRegexLabel: this._keybindingLabelFor(FIND_IDS.ToggleRegexCommand),
            validation: function (value) {
                if (value.length === 0) {
                    return null;
                }
                if (!_this._findInput.getRegex()) {
                    return null;
                }
                try {
                    /* tslint:disable:no-unused-expression */
                    new RegExp(value);
                    /* tslint:enable:no-unused-expression */
                    return null;
                }
                catch (e) {
                    return { content: e.message };
                }
            }
        }, this._contextKeyService));
        this._findInput.setRegex(!!this._state.isRegex);
        this._findInput.setCaseSensitive(!!this._state.matchCase);
        this._findInput.setWholeWords(!!this._state.wholeWord);
        this._register(this._findInput.onKeyDown(function (e) { return _this._onFindInputKeyDown(e); }));
        this._register(this._findInput.inputBox.onDidChange(function () {
            _this._state.change({ searchString: _this._findInput.getValue() }, true);
        }));
        this._register(this._findInput.onDidOptionChange(function () {
            _this._state.change({
                isRegex: _this._findInput.getRegex(),
                wholeWord: _this._findInput.getWholeWords(),
                matchCase: _this._findInput.getCaseSensitive()
            }, true);
        }));
        this._register(this._findInput.onCaseSensitiveKeyDown(function (e) {
            if (e.equals(1024 /* Shift */ | 2 /* Tab */)) {
                if (_this._isReplaceVisible) {
                    _this._replaceInputBox.focus();
                    e.preventDefault();
                }
            }
        }));
        if (platform.isLinux) {
            this._register(this._findInput.onMouseDown(function (e) { return _this._onFindInputMouseDown(e); }));
        }
        this._matchesCount = document.createElement('div');
        this._matchesCount.className = 'matchesCount';
        this._updateMatchesCount();
        // Previous button
        this._prevBtn = this._register(new SimpleButton({
            label: NLS_PREVIOUS_MATCH_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.PreviousMatchFindAction),
            className: 'previous',
            onTrigger: function () {
                _this._codeEditor.getAction(FIND_IDS.PreviousMatchFindAction).run().done(null, onUnexpectedError);
            }
        }));
        // Next button
        this._nextBtn = this._register(new SimpleButton({
            label: NLS_NEXT_MATCH_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.NextMatchFindAction),
            className: 'next',
            onTrigger: function () {
                _this._codeEditor.getAction(FIND_IDS.NextMatchFindAction).run().done(null, onUnexpectedError);
            }
        }));
        var findPart = document.createElement('div');
        findPart.className = 'find-part';
        findPart.appendChild(this._findInput.domNode);
        findPart.appendChild(this._matchesCount);
        findPart.appendChild(this._prevBtn.domNode);
        findPart.appendChild(this._nextBtn.domNode);
        // Toggle selection button
        this._toggleSelectionFind = this._register(new SimpleCheckbox({
            parent: findPart,
            title: NLS_TOGGLE_SELECTION_FIND_TITLE + this._keybindingLabelFor(FIND_IDS.ToggleSearchScopeCommand),
            onChange: function () {
                if (_this._toggleSelectionFind.checked) {
                    var selection = _this._codeEditor.getSelection();
                    if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
                        selection = selection.setEndPosition(selection.endLineNumber - 1, 1);
                    }
                    if (!selection.isEmpty()) {
                        _this._state.change({ searchScope: selection }, true);
                    }
                }
                else {
                    _this._state.change({ searchScope: null }, true);
                }
            }
        }));
        // Close button
        this._closeBtn = this._register(new SimpleButton({
            label: NLS_CLOSE_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.CloseFindWidgetCommand),
            className: 'close-fw',
            onTrigger: function () {
                _this._state.change({ isRevealed: false, searchScope: null }, false);
            },
            onKeyDown: function (e) {
                if (e.equals(2 /* Tab */)) {
                    if (_this._isReplaceVisible) {
                        if (_this._replaceBtn.isEnabled()) {
                            _this._replaceBtn.focus();
                        }
                        else {
                            _this._codeEditor.focus();
                        }
                        e.preventDefault();
                    }
                }
            }
        }));
        findPart.appendChild(this._closeBtn.domNode);
        return findPart;
    };
    FindWidget.prototype._buildReplacePart = function () {
        var _this = this;
        // Replace input
        var replaceInput = document.createElement('div');
        replaceInput.className = 'replace-input';
        replaceInput.style.width = REPLACE_INPUT_AREA_WIDTH + 'px';
        this._replaceInputBox = this._register(new ContextScopedHistoryInputBox(replaceInput, null, {
            ariaLabel: NLS_REPLACE_INPUT_LABEL,
            placeholder: NLS_REPLACE_INPUT_PLACEHOLDER,
            history: []
        }, this._contextKeyService));
        this._register(dom.addStandardDisposableListener(this._replaceInputBox.inputElement, 'keydown', function (e) { return _this._onReplaceInputKeyDown(e); }));
        this._register(dom.addStandardDisposableListener(this._replaceInputBox.inputElement, 'input', function (e) {
            _this._state.change({ replaceString: _this._replaceInputBox.value }, false);
        }));
        // Replace one button
        this._replaceBtn = this._register(new SimpleButton({
            label: NLS_REPLACE_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.ReplaceOneAction),
            className: 'replace',
            onTrigger: function () {
                _this._controller.replace();
            },
            onKeyDown: function (e) {
                if (e.equals(1024 /* Shift */ | 2 /* Tab */)) {
                    _this._closeBtn.focus();
                    e.preventDefault();
                }
            }
        }));
        // Replace all button
        this._replaceAllBtn = this._register(new SimpleButton({
            label: NLS_REPLACE_ALL_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.ReplaceAllAction),
            className: 'replace-all',
            onTrigger: function () {
                _this._controller.replaceAll();
            }
        }));
        var replacePart = document.createElement('div');
        replacePart.className = 'replace-part';
        replacePart.appendChild(replaceInput);
        replacePart.appendChild(this._replaceBtn.domNode);
        replacePart.appendChild(this._replaceAllBtn.domNode);
        return replacePart;
    };
    FindWidget.prototype._buildDomNode = function () {
        var _this = this;
        // Find part
        var findPart = this._buildFindPart();
        // Replace part
        var replacePart = this._buildReplacePart();
        // Toggle replace button
        this._toggleReplaceBtn = this._register(new SimpleButton({
            label: NLS_TOGGLE_REPLACE_MODE_BTN_LABEL,
            className: 'toggle left',
            onTrigger: function () {
                _this._state.change({ isReplaceRevealed: !_this._isReplaceVisible }, false);
                if (_this._isReplaceVisible) {
                    _this._replaceInputBox.width = _this._findInput.inputBox.width;
                }
                _this._showViewZone();
            }
        }));
        this._toggleReplaceBtn.toggleClass('expand', this._isReplaceVisible);
        this._toggleReplaceBtn.toggleClass('collapse', !this._isReplaceVisible);
        this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);
        // Widget
        this._domNode = document.createElement('div');
        this._domNode.className = 'editor-widget find-widget';
        this._domNode.setAttribute('aria-hidden', 'true');
        // We need to set this explicitly, otherwise on IE11, the width inheritence of flex doesn't work.
        this._domNode.style.width = FIND_WIDGET_INITIAL_WIDTH + "px";
        this._domNode.appendChild(this._toggleReplaceBtn.domNode);
        this._domNode.appendChild(findPart);
        this._domNode.appendChild(replacePart);
        this._buildSash();
    };
    FindWidget.prototype._buildSash = function () {
        var _this = this;
        this._resizeSash = new Sash(this._domNode, this, { orientation: Orientation.VERTICAL });
        this._resized = false;
        var originalWidth = FIND_WIDGET_INITIAL_WIDTH;
        this._register(this._resizeSash.onDidStart(function (e) {
            originalWidth = dom.getTotalWidth(_this._domNode);
        }));
        this._register(this._resizeSash.onDidChange(function (evt) {
            _this._resized = true;
            var width = originalWidth + evt.startX - evt.currentX;
            if (width < FIND_WIDGET_INITIAL_WIDTH) {
                // narrow down the find widget should be handled by CSS.
                return;
            }
            var inputBoxWidth = width - FIND_ALL_CONTROLS_WIDTH;
            var maxWidth = parseFloat(dom.getComputedStyle(_this._domNode).maxWidth) || 0;
            if (width > maxWidth) {
                return;
            }
            _this._domNode.style.width = width + "px";
            if (_this._isReplaceVisible) {
                _this._replaceInputBox.width = inputBoxWidth;
            }
        }));
    };
    FindWidget.ID = 'editor.contrib.findWidget';
    return FindWidget;
}(Widget));
export { FindWidget };
var SimpleCheckbox = /** @class */ (function (_super) {
    __extends(SimpleCheckbox, _super);
    function SimpleCheckbox(opts) {
        var _this = _super.call(this) || this;
        _this._opts = opts;
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'monaco-checkbox';
        _this._domNode.title = _this._opts.title;
        _this._domNode.tabIndex = 0;
        _this._checkbox = document.createElement('input');
        _this._checkbox.type = 'checkbox';
        _this._checkbox.className = 'checkbox';
        _this._checkbox.id = 'checkbox-' + SimpleCheckbox._COUNTER++;
        _this._checkbox.tabIndex = -1;
        _this._label = document.createElement('label');
        _this._label.className = 'label';
        // Connect the label and the checkbox. Checkbox will get checked when the label receives a click.
        _this._label.htmlFor = _this._checkbox.id;
        _this._label.tabIndex = -1;
        _this._domNode.appendChild(_this._checkbox);
        _this._domNode.appendChild(_this._label);
        _this._opts.parent.appendChild(_this._domNode);
        _this.onchange(_this._checkbox, function (e) {
            _this._opts.onChange();
        });
        return _this;
    }
    Object.defineProperty(SimpleCheckbox.prototype, "domNode", {
        get: function () {
            return this._domNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleCheckbox.prototype, "checked", {
        get: function () {
            return this._checkbox.checked;
        },
        set: function (newValue) {
            this._checkbox.checked = newValue;
        },
        enumerable: true,
        configurable: true
    });
    SimpleCheckbox.prototype.focus = function () {
        this._checkbox.focus();
    };
    SimpleCheckbox.prototype.enable = function () {
        this._checkbox.removeAttribute('disabled');
    };
    SimpleCheckbox.prototype.disable = function () {
        this._checkbox.disabled = true;
    };
    SimpleCheckbox.prototype.setEnabled = function (enabled) {
        if (enabled) {
            this.enable();
            this.domNode.tabIndex = 0;
        }
        else {
            this.disable();
            this.domNode.tabIndex = -1;
        }
    };
    SimpleCheckbox._COUNTER = 0;
    return SimpleCheckbox;
}(Widget));
var SimpleButton = /** @class */ (function (_super) {
    __extends(SimpleButton, _super);
    function SimpleButton(opts) {
        var _this = _super.call(this) || this;
        _this._opts = opts;
        _this._domNode = document.createElement('div');
        _this._domNode.title = _this._opts.label;
        _this._domNode.tabIndex = 0;
        _this._domNode.className = 'button ' + _this._opts.className;
        _this._domNode.setAttribute('role', 'button');
        _this._domNode.setAttribute('aria-label', _this._opts.label);
        _this.onclick(_this._domNode, function (e) {
            _this._opts.onTrigger();
            e.preventDefault();
        });
        _this.onkeydown(_this._domNode, function (e) {
            if (e.equals(10 /* Space */) || e.equals(3 /* Enter */)) {
                _this._opts.onTrigger();
                e.preventDefault();
                return;
            }
            if (_this._opts.onKeyDown) {
                _this._opts.onKeyDown(e);
            }
        });
        return _this;
    }
    Object.defineProperty(SimpleButton.prototype, "domNode", {
        get: function () {
            return this._domNode;
        },
        enumerable: true,
        configurable: true
    });
    SimpleButton.prototype.isEnabled = function () {
        return (this._domNode.tabIndex >= 0);
    };
    SimpleButton.prototype.focus = function () {
        this._domNode.focus();
    };
    SimpleButton.prototype.setEnabled = function (enabled) {
        dom.toggleClass(this._domNode, 'disabled', !enabled);
        this._domNode.setAttribute('aria-disabled', String(!enabled));
        this._domNode.tabIndex = enabled ? 0 : -1;
    };
    SimpleButton.prototype.setExpanded = function (expanded) {
        this._domNode.setAttribute('aria-expanded', String(!!expanded));
    };
    SimpleButton.prototype.toggleClass = function (className, shouldHaveIt) {
        dom.toggleClass(this._domNode, className, shouldHaveIt);
    };
    return SimpleButton;
}(Widget));
export { SimpleButton };
// theming
registerThemingParticipant(function (theme, collector) {
    var addBackgroundColorRule = function (selector, color) {
        if (color) {
            collector.addRule(".monaco-editor " + selector + " { background-color: " + color + "; }");
        }
    };
    addBackgroundColorRule('.findMatch', theme.getColor(editorFindMatchHighlight));
    addBackgroundColorRule('.currentFindMatch', theme.getColor(editorFindMatch));
    addBackgroundColorRule('.findScope', theme.getColor(editorFindRangeHighlight));
    var widgetBackground = theme.getColor(editorWidgetBackground);
    addBackgroundColorRule('.find-widget', widgetBackground);
    var widgetShadowColor = theme.getColor(widgetShadow);
    if (widgetShadowColor) {
        collector.addRule(".monaco-editor .find-widget { box-shadow: 0 2px 8px " + widgetShadowColor + "; }");
    }
    var findMatchHighlightBorder = theme.getColor(editorFindMatchHighlightBorder);
    if (findMatchHighlightBorder) {
        collector.addRule(".monaco-editor .findMatch { border: 1px " + (theme.type === 'hc' ? 'dotted' : 'solid') + " " + findMatchHighlightBorder + "; box-sizing: border-box; }");
    }
    var findMatchBorder = theme.getColor(editorFindMatchBorder);
    if (findMatchBorder) {
        collector.addRule(".monaco-editor .currentFindMatch { border: 2px solid " + findMatchBorder + "; padding: 1px; box-sizing: border-box; }");
    }
    var findRangeHighlightBorder = theme.getColor(editorFindRangeHighlightBorder);
    if (findRangeHighlightBorder) {
        collector.addRule(".monaco-editor .findScope { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + findRangeHighlightBorder + "; }");
    }
    var hcBorder = theme.getColor(contrastBorder);
    if (hcBorder) {
        collector.addRule(".monaco-editor .find-widget { border: 2px solid " + hcBorder + "; }");
    }
    var error = theme.getColor(errorForeground);
    if (error) {
        collector.addRule(".monaco-editor .find-widget.no-results .matchesCount { color: " + error + "; }");
    }
    var resizeBorderBackground = theme.getColor(editorWidgetResizeBorder);
    if (resizeBorderBackground) {
        collector.addRule(".monaco-editor .find-widget .monaco-sash { background-color: " + resizeBorderBackground + "; width: 3px !important; margin-left: -4px;}");
    }
    else {
        var border = theme.getColor(editorWidgetBorder);
        if (border) {
            collector.addRule(".monaco-editor .find-widget .monaco-sash { background-color: " + border + "; width: 3px !important; margin-left: -4px;}");
        }
    }
});
