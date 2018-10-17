/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as nls from '../../../nls.js';
import { first2, createCancelablePromise } from '../../../base/common/async.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { Range } from '../../common/core/range.js';
import { registerEditorContribution, EditorAction, registerEditorAction, registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { DocumentHighlightKind, DocumentHighlightProviderRegistry } from '../../common/modes.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { registerColor, editorSelectionHighlight, overviewRulerSelectionHighlightForeground, activeContrastBorder, editorSelectionHighlightBorder } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { CursorChangeReason } from '../../common/controller/cursorEvents.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { firstIndex, isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { TrackedRangeStickiness, OverviewRulerLane } from '../../common/model.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
export var editorWordHighlight = registerColor('editor.wordHighlightBackground', { dark: '#575757B8', light: '#57575740', hc: null }, nls.localize('wordHighlight', 'Background color of a symbol during read-access, like reading a variable. The color must not be opaque to not hide underlying decorations.'), true);
export var editorWordHighlightStrong = registerColor('editor.wordHighlightStrongBackground', { dark: '#004972B8', light: '#0e639c40', hc: null }, nls.localize('wordHighlightStrong', 'Background color of a symbol during write-access, like writing to a variable. The color must not be opaque to not hide underlying decorations.'), true);
export var editorWordHighlightBorder = registerColor('editor.wordHighlightBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('wordHighlightBorder', 'Border color of a symbol during read-access, like reading a variable.'));
export var editorWordHighlightStrongBorder = registerColor('editor.wordHighlightStrongBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('wordHighlightStrongBorder', 'Border color of a symbol during write-access, like writing to a variable.'));
export var overviewRulerWordHighlightForeground = registerColor('editorOverviewRuler.wordHighlightForeground', { dark: '#A0A0A0CC', light: '#A0A0A0CC', hc: '#A0A0A0CC' }, nls.localize('overviewRulerWordHighlightForeground', 'Overview ruler marker color for symbol highlights. The color must not be opaque to not hide underlying decorations.'), true);
export var overviewRulerWordHighlightStrongForeground = registerColor('editorOverviewRuler.wordHighlightStrongForeground', { dark: '#C0A0C0CC', light: '#C0A0C0CC', hc: '#C0A0C0CC' }, nls.localize('overviewRulerWordHighlightStrongForeground', 'Overview ruler marker color for write-access symbol highlights. The color must not be opaque to not hide underlying decorations.'), true);
export var ctxHasWordHighlights = new RawContextKey('hasWordHighlights', false);
export function getOccurrencesAtPosition(model, position, token) {
    if (token === void 0) { token = CancellationToken.None; }
    var orderedByScore = DocumentHighlightProviderRegistry.ordered(model);
    // in order of score ask the occurrences provider
    // until someone response with a good result
    // (good = none empty array)
    return first2(orderedByScore.map(function (provider) { return function () {
        return Promise.resolve(provider.provideDocumentHighlights(model, position, token))
            .then(undefined, onUnexpectedExternalError);
    }; }), function (result) { return !isFalsyOrEmpty(result); });
}
registerDefaultLanguageCommand('_executeDocumentHighlights', getOccurrencesAtPosition);
var WordHighlighter = /** @class */ (function () {
    function WordHighlighter(editor, contextKeyService) {
        var _this = this;
        this.workerRequestTokenId = 0;
        this.workerRequest = null;
        this.workerRequestCompleted = false;
        this.workerRequestValue = [];
        this.lastCursorPositionChangeTime = 0;
        this.renderDecorationsTimer = -1;
        this.editor = editor;
        this._hasWordHighlights = ctxHasWordHighlights.bindTo(contextKeyService);
        this._ignorePositionChangeEvent = false;
        this.occurrencesHighlight = this.editor.getConfiguration().contribInfo.occurrencesHighlight;
        this.model = this.editor.getModel();
        this.toUnhook = [];
        this.toUnhook.push(editor.onDidChangeCursorPosition(function (e) {
            if (_this._ignorePositionChangeEvent) {
                // We are changing the position => ignore this event
                return;
            }
            if (!_this.occurrencesHighlight) {
                // Early exit if nothing needs to be done!
                // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                return;
            }
            _this._onPositionChanged(e);
        }));
        this.toUnhook.push(editor.onDidChangeModel(function (e) {
            _this._stopAll();
            _this.model = _this.editor.getModel();
        }));
        this.toUnhook.push(editor.onDidChangeModelContent(function (e) {
            _this._stopAll();
        }));
        this.toUnhook.push(editor.onDidChangeConfiguration(function (e) {
            var newValue = _this.editor.getConfiguration().contribInfo.occurrencesHighlight;
            if (_this.occurrencesHighlight !== newValue) {
                _this.occurrencesHighlight = newValue;
                _this._stopAll();
            }
        }));
        this._lastWordRange = null;
        this._decorationIds = [];
        this.workerRequestTokenId = 0;
        this.workerRequest = null;
        this.workerRequestCompleted = false;
        this.lastCursorPositionChangeTime = 0;
        this.renderDecorationsTimer = -1;
    }
    WordHighlighter.prototype.hasDecorations = function () {
        return (this._decorationIds.length > 0);
    };
    WordHighlighter.prototype.restore = function () {
        if (!this.occurrencesHighlight) {
            return;
        }
        this._run();
    };
    WordHighlighter.prototype._getSortedHighlights = function () {
        var _this = this;
        return this._decorationIds
            .map(function (id) { return _this.model.getDecorationRange(id); })
            .sort(Range.compareRangesUsingStarts);
    };
    WordHighlighter.prototype.moveNext = function () {
        var _this = this;
        var highlights = this._getSortedHighlights();
        var index = firstIndex(highlights, function (range) { return range.containsPosition(_this.editor.getPosition()); });
        var newIndex = ((index + 1) % highlights.length);
        var dest = highlights[newIndex];
        try {
            this._ignorePositionChangeEvent = true;
            this.editor.setPosition(dest.getStartPosition());
            this.editor.revealRangeInCenterIfOutsideViewport(dest);
        }
        finally {
            this._ignorePositionChangeEvent = false;
        }
    };
    WordHighlighter.prototype.moveBack = function () {
        var _this = this;
        var highlights = this._getSortedHighlights();
        var index = firstIndex(highlights, function (range) { return range.containsPosition(_this.editor.getPosition()); });
        var newIndex = ((index - 1 + highlights.length) % highlights.length);
        var dest = highlights[newIndex];
        try {
            this._ignorePositionChangeEvent = true;
            this.editor.setPosition(dest.getStartPosition());
            this.editor.revealRangeInCenterIfOutsideViewport(dest);
        }
        finally {
            this._ignorePositionChangeEvent = false;
        }
    };
    WordHighlighter.prototype._removeDecorations = function () {
        if (this._decorationIds.length > 0) {
            // remove decorations
            this._decorationIds = this.editor.deltaDecorations(this._decorationIds, []);
            this._hasWordHighlights.set(false);
        }
    };
    WordHighlighter.prototype._stopAll = function () {
        this._lastWordRange = null;
        // Remove any existing decorations
        this._removeDecorations();
        // Cancel any renderDecorationsTimer
        if (this.renderDecorationsTimer !== -1) {
            clearTimeout(this.renderDecorationsTimer);
            this.renderDecorationsTimer = -1;
        }
        // Cancel any worker request
        if (this.workerRequest !== null) {
            this.workerRequest.cancel();
            this.workerRequest = null;
        }
        // Invalidate any worker request callback
        if (!this.workerRequestCompleted) {
            this.workerRequestTokenId++;
            this.workerRequestCompleted = true;
        }
    };
    WordHighlighter.prototype._onPositionChanged = function (e) {
        // disabled
        if (!this.occurrencesHighlight) {
            this._stopAll();
            return;
        }
        // ignore typing & other
        if (e.reason !== CursorChangeReason.Explicit) {
            this._stopAll();
            return;
        }
        this._run();
    };
    WordHighlighter.prototype._run = function () {
        var _this = this;
        // no providers for this model
        if (!DocumentHighlightProviderRegistry.has(this.model)) {
            this._stopAll();
            return;
        }
        var editorSelection = this.editor.getSelection();
        // ignore multiline selection
        if (editorSelection.startLineNumber !== editorSelection.endLineNumber) {
            this._stopAll();
            return;
        }
        var lineNumber = editorSelection.startLineNumber;
        var startColumn = editorSelection.startColumn;
        var endColumn = editorSelection.endColumn;
        var word = this.model.getWordAtPosition({
            lineNumber: lineNumber,
            column: startColumn
        });
        // The selection must be inside a word or surround one word at most
        if (!word || word.startColumn > startColumn || word.endColumn < endColumn) {
            this._stopAll();
            return;
        }
        // All the effort below is trying to achieve this:
        // - when cursor is moved to a word, trigger immediately a findOccurrences request
        // - 250ms later after the last cursor move event, render the occurrences
        // - no flickering!
        var currentWordRange = new Range(lineNumber, word.startColumn, lineNumber, word.endColumn);
        var workerRequestIsValid = this._lastWordRange && this._lastWordRange.equalsRange(currentWordRange);
        // Even if we are on a different word, if that word is in the decorations ranges, the request is still valid
        // (Same symbol)
        for (var i = 0, len = this._decorationIds.length; !workerRequestIsValid && i < len; i++) {
            var range = this.model.getDecorationRange(this._decorationIds[i]);
            if (range && range.startLineNumber === lineNumber) {
                if (range.startColumn <= startColumn && range.endColumn >= endColumn) {
                    workerRequestIsValid = true;
                }
            }
        }
        // There are 4 cases:
        // a) old workerRequest is valid & completed, renderDecorationsTimer fired
        // b) old workerRequest is valid & completed, renderDecorationsTimer not fired
        // c) old workerRequest is valid, but not completed
        // d) old workerRequest is not valid
        // For a) no action is needed
        // For c), member 'lastCursorPositionChangeTime' will be used when installing the timer so no action is needed
        this.lastCursorPositionChangeTime = (new Date()).getTime();
        if (workerRequestIsValid) {
            if (this.workerRequestCompleted && this.renderDecorationsTimer !== -1) {
                // case b)
                // Delay the firing of renderDecorationsTimer by an extra 250 ms
                clearTimeout(this.renderDecorationsTimer);
                this.renderDecorationsTimer = -1;
                this._beginRenderDecorations();
            }
        }
        else {
            // case d)
            // Stop all previous actions and start fresh
            this._stopAll();
            var myRequestId_1 = ++this.workerRequestTokenId;
            this.workerRequestCompleted = false;
            this.workerRequest = createCancelablePromise(function (token) { return getOccurrencesAtPosition(_this.model, _this.editor.getPosition(), token); });
            this.workerRequest.then(function (data) {
                if (myRequestId_1 === _this.workerRequestTokenId) {
                    _this.workerRequestCompleted = true;
                    _this.workerRequestValue = data || [];
                    _this._beginRenderDecorations();
                }
            });
        }
        this._lastWordRange = currentWordRange;
    };
    WordHighlighter.prototype._beginRenderDecorations = function () {
        var _this = this;
        var currentTime = (new Date()).getTime();
        var minimumRenderTime = this.lastCursorPositionChangeTime + 250;
        if (currentTime >= minimumRenderTime) {
            // Synchronous
            this.renderDecorationsTimer = -1;
            this.renderDecorations();
        }
        else {
            // Asynchronous
            this.renderDecorationsTimer = setTimeout(function () {
                _this.renderDecorations();
            }, (minimumRenderTime - currentTime));
        }
    };
    WordHighlighter.prototype.renderDecorations = function () {
        this.renderDecorationsTimer = -1;
        var decorations = [];
        for (var i = 0, len = this.workerRequestValue.length; i < len; i++) {
            var info = this.workerRequestValue[i];
            decorations.push({
                range: info.range,
                options: WordHighlighter._getDecorationOptions(info.kind)
            });
        }
        this._decorationIds = this.editor.deltaDecorations(this._decorationIds, decorations);
        this._hasWordHighlights.set(this.hasDecorations());
    };
    WordHighlighter._getDecorationOptions = function (kind) {
        if (kind === DocumentHighlightKind.Write) {
            return this._WRITE_OPTIONS;
        }
        else if (kind === DocumentHighlightKind.Text) {
            return this._TEXT_OPTIONS;
        }
        else {
            return this._REGULAR_OPTIONS;
        }
    };
    WordHighlighter.prototype.dispose = function () {
        this._stopAll();
        this.toUnhook = dispose(this.toUnhook);
    };
    WordHighlighter._WRITE_OPTIONS = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'wordHighlightStrong',
        overviewRuler: {
            color: themeColorFromId(overviewRulerWordHighlightStrongForeground),
            darkColor: themeColorFromId(overviewRulerWordHighlightStrongForeground),
            position: OverviewRulerLane.Center
        }
    });
    WordHighlighter._TEXT_OPTIONS = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'selectionHighlight',
        overviewRuler: {
            color: themeColorFromId(overviewRulerSelectionHighlightForeground),
            darkColor: themeColorFromId(overviewRulerSelectionHighlightForeground),
            position: OverviewRulerLane.Center
        }
    });
    WordHighlighter._REGULAR_OPTIONS = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'wordHighlight',
        overviewRuler: {
            color: themeColorFromId(overviewRulerWordHighlightForeground),
            darkColor: themeColorFromId(overviewRulerWordHighlightForeground),
            position: OverviewRulerLane.Center
        }
    });
    return WordHighlighter;
}());
var WordHighlighterContribution = /** @class */ (function () {
    function WordHighlighterContribution(editor, contextKeyService) {
        this.wordHighligher = new WordHighlighter(editor, contextKeyService);
    }
    WordHighlighterContribution.get = function (editor) {
        return editor.getContribution(WordHighlighterContribution.ID);
    };
    WordHighlighterContribution.prototype.getId = function () {
        return WordHighlighterContribution.ID;
    };
    WordHighlighterContribution.prototype.saveViewState = function () {
        if (this.wordHighligher.hasDecorations()) {
            return true;
        }
        return false;
    };
    WordHighlighterContribution.prototype.moveNext = function () {
        this.wordHighligher.moveNext();
    };
    WordHighlighterContribution.prototype.moveBack = function () {
        this.wordHighligher.moveBack();
    };
    WordHighlighterContribution.prototype.restoreViewState = function (state) {
        if (state) {
            this.wordHighligher.restore();
        }
    };
    WordHighlighterContribution.prototype.dispose = function () {
        this.wordHighligher.dispose();
    };
    WordHighlighterContribution.ID = 'editor.contrib.wordHighlighter';
    WordHighlighterContribution = __decorate([
        __param(1, IContextKeyService)
    ], WordHighlighterContribution);
    return WordHighlighterContribution;
}());
var WordHighlightNavigationAction = /** @class */ (function (_super) {
    __extends(WordHighlightNavigationAction, _super);
    function WordHighlightNavigationAction(next, opts) {
        var _this = _super.call(this, opts) || this;
        _this._isNext = next;
        return _this;
    }
    WordHighlightNavigationAction.prototype.run = function (accessor, editor) {
        var controller = WordHighlighterContribution.get(editor);
        if (!controller) {
            return;
        }
        if (this._isNext) {
            controller.moveNext();
        }
        else {
            controller.moveBack();
        }
    };
    return WordHighlightNavigationAction;
}(EditorAction));
var NextWordHighlightAction = /** @class */ (function (_super) {
    __extends(NextWordHighlightAction, _super);
    function NextWordHighlightAction() {
        return _super.call(this, true, {
            id: 'editor.action.wordHighlight.next',
            label: nls.localize('wordHighlight.next.label', "Go to Next Symbol Highlight"),
            alias: 'Go to Next Symbol Highlight',
            precondition: ctxHasWordHighlights,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 65 /* F7 */
            }
        }) || this;
    }
    return NextWordHighlightAction;
}(WordHighlightNavigationAction));
var PrevWordHighlightAction = /** @class */ (function (_super) {
    __extends(PrevWordHighlightAction, _super);
    function PrevWordHighlightAction() {
        return _super.call(this, false, {
            id: 'editor.action.wordHighlight.prev',
            label: nls.localize('wordHighlight.previous.label', "Go to Previous Symbol Highlight"),
            alias: 'Go to Previous Symbol Highlight',
            precondition: ctxHasWordHighlights,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 65 /* F7 */
            }
        }) || this;
    }
    return PrevWordHighlightAction;
}(WordHighlightNavigationAction));
registerEditorContribution(WordHighlighterContribution);
registerEditorAction(NextWordHighlightAction);
registerEditorAction(PrevWordHighlightAction);
registerThemingParticipant(function (theme, collector) {
    var selectionHighlight = theme.getColor(editorSelectionHighlight);
    if (selectionHighlight) {
        collector.addRule(".monaco-editor .focused .selectionHighlight { background-color: " + selectionHighlight + "; }");
        collector.addRule(".monaco-editor .selectionHighlight { background-color: " + selectionHighlight.transparent(0.5) + "; }");
    }
    var wordHighlight = theme.getColor(editorWordHighlight);
    if (wordHighlight) {
        collector.addRule(".monaco-editor .wordHighlight { background-color: " + wordHighlight + "; }");
    }
    var wordHighlightStrong = theme.getColor(editorWordHighlightStrong);
    if (wordHighlightStrong) {
        collector.addRule(".monaco-editor .wordHighlightStrong { background-color: " + wordHighlightStrong + "; }");
    }
    var selectionHighlightBorder = theme.getColor(editorSelectionHighlightBorder);
    if (selectionHighlightBorder) {
        collector.addRule(".monaco-editor .selectionHighlight { border: 1px " + (theme.type === 'hc' ? 'dotted' : 'solid') + " " + selectionHighlightBorder + "; box-sizing: border-box; }");
    }
    var wordHighlightBorder = theme.getColor(editorWordHighlightBorder);
    if (wordHighlightBorder) {
        collector.addRule(".monaco-editor .wordHighlight { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + wordHighlightBorder + "; box-sizing: border-box; }");
    }
    var wordHighlightStrongBorder = theme.getColor(editorWordHighlightStrongBorder);
    if (wordHighlightStrongBorder) {
        collector.addRule(".monaco-editor .wordHighlightStrong { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + wordHighlightStrongBorder + "; box-sizing: border-box; }");
    }
});
