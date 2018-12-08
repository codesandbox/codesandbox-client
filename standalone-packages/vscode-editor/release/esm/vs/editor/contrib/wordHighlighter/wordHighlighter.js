/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as nls from '../../../nls.js';
import * as arrays from '../../../base/common/arrays.js';
import { createCancelablePromise, first, timeout } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../base/common/errors.js';
import { Disposable, dispose } from '../../../base/common/lifecycle.js';
import { EditorAction, registerDefaultLanguageCommand, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { Range } from '../../common/core/range.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { OverviewRulerLane } from '../../common/model.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { DocumentHighlightKind, DocumentHighlightProviderRegistry } from '../../common/modes.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { activeContrastBorder, editorSelectionHighlight, editorSelectionHighlightBorder, overviewRulerSelectionHighlightForeground, registerColor } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../platform/theme/common/themeService.js';
export var editorWordHighlight = registerColor('editor.wordHighlightBackground', { dark: '#575757B8', light: '#57575740', hc: null }, nls.localize('wordHighlight', 'Background color of a symbol during read-access, like reading a variable. The color must not be opaque to not hide underlying decorations.'), true);
export var editorWordHighlightStrong = registerColor('editor.wordHighlightStrongBackground', { dark: '#004972B8', light: '#0e639c40', hc: null }, nls.localize('wordHighlightStrong', 'Background color of a symbol during write-access, like writing to a variable. The color must not be opaque to not hide underlying decorations.'), true);
export var editorWordHighlightBorder = registerColor('editor.wordHighlightBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('wordHighlightBorder', 'Border color of a symbol during read-access, like reading a variable.'));
export var editorWordHighlightStrongBorder = registerColor('editor.wordHighlightStrongBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('wordHighlightStrongBorder', 'Border color of a symbol during write-access, like writing to a variable.'));
export var overviewRulerWordHighlightForeground = registerColor('editorOverviewRuler.wordHighlightForeground', { dark: '#A0A0A0CC', light: '#A0A0A0CC', hc: '#A0A0A0CC' }, nls.localize('overviewRulerWordHighlightForeground', 'Overview ruler marker color for symbol highlights. The color must not be opaque to not hide underlying decorations.'), true);
export var overviewRulerWordHighlightStrongForeground = registerColor('editorOverviewRuler.wordHighlightStrongForeground', { dark: '#C0A0C0CC', light: '#C0A0C0CC', hc: '#C0A0C0CC' }, nls.localize('overviewRulerWordHighlightStrongForeground', 'Overview ruler marker color for write-access symbol highlights. The color must not be opaque to not hide underlying decorations.'), true);
export var ctxHasWordHighlights = new RawContextKey('hasWordHighlights', false);
export function getOccurrencesAtPosition(model, position, token) {
    var orderedByScore = DocumentHighlightProviderRegistry.ordered(model);
    // in order of score ask the occurrences provider
    // until someone response with a good result
    // (good = none empty array)
    return first(orderedByScore.map(function (provider) { return function () {
        return Promise.resolve(provider.provideDocumentHighlights(model, position, token))
            .then(undefined, onUnexpectedExternalError);
    }; }), function (result) { return !arrays.isFalsyOrEmpty(result); });
}
var OccurenceAtPositionRequest = /** @class */ (function () {
    function OccurenceAtPositionRequest(model, selection, wordSeparators) {
        var _this = this;
        this._wordRange = this._getCurrentWordRange(model, selection);
        this.result = createCancelablePromise(function (token) { return _this._compute(model, selection, wordSeparators, token); });
    }
    OccurenceAtPositionRequest.prototype._getCurrentWordRange = function (model, selection) {
        var word = model.getWordAtPosition(selection.getPosition());
        if (word) {
            return new Range(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
        }
        return null;
    };
    OccurenceAtPositionRequest.prototype.isValid = function (model, selection, decorationIds) {
        var lineNumber = selection.startLineNumber;
        var startColumn = selection.startColumn;
        var endColumn = selection.endColumn;
        var currentWordRange = this._getCurrentWordRange(model, selection);
        var requestIsValid = Boolean(this._wordRange && this._wordRange.equalsRange(currentWordRange));
        // Even if we are on a different word, if that word is in the decorations ranges, the request is still valid
        // (Same symbol)
        for (var i = 0, len = decorationIds.length; !requestIsValid && i < len; i++) {
            var range = model.getDecorationRange(decorationIds[i]);
            if (range && range.startLineNumber === lineNumber) {
                if (range.startColumn <= startColumn && range.endColumn >= endColumn) {
                    requestIsValid = true;
                }
            }
        }
        return requestIsValid;
    };
    OccurenceAtPositionRequest.prototype.cancel = function () {
        this.result.cancel();
    };
    return OccurenceAtPositionRequest;
}());
var SemanticOccurenceAtPositionRequest = /** @class */ (function (_super) {
    __extends(SemanticOccurenceAtPositionRequest, _super);
    function SemanticOccurenceAtPositionRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SemanticOccurenceAtPositionRequest.prototype._compute = function (model, selection, wordSeparators, token) {
        return getOccurrencesAtPosition(model, selection.getPosition(), token);
    };
    return SemanticOccurenceAtPositionRequest;
}(OccurenceAtPositionRequest));
var TextualOccurenceAtPositionRequest = /** @class */ (function (_super) {
    __extends(TextualOccurenceAtPositionRequest, _super);
    function TextualOccurenceAtPositionRequest(model, selection, wordSeparators) {
        var _this = _super.call(this, model, selection, wordSeparators) || this;
        _this._selectionIsEmpty = selection.isEmpty();
        return _this;
    }
    TextualOccurenceAtPositionRequest.prototype._compute = function (model, selection, wordSeparators, token) {
        return timeout(250, token).then(function () {
            if (!selection.isEmpty()) {
                return [];
            }
            var word = model.getWordAtPosition(selection.getPosition());
            if (!word) {
                return [];
            }
            var matches = model.findMatches(word.word, true, false, true, wordSeparators, false);
            return matches.map(function (m) {
                return {
                    range: m.range,
                    kind: DocumentHighlightKind.Text
                };
            });
        });
    };
    TextualOccurenceAtPositionRequest.prototype.isValid = function (model, selection, decorationIds) {
        var currentSelectionIsEmpty = selection.isEmpty();
        if (this._selectionIsEmpty !== currentSelectionIsEmpty) {
            return false;
        }
        return _super.prototype.isValid.call(this, model, selection, decorationIds);
    };
    return TextualOccurenceAtPositionRequest;
}(OccurenceAtPositionRequest));
function computeOccurencesAtPosition(model, selection, wordSeparators) {
    if (DocumentHighlightProviderRegistry.has(model)) {
        return new SemanticOccurenceAtPositionRequest(model, selection, wordSeparators);
    }
    return new TextualOccurenceAtPositionRequest(model, selection, wordSeparators);
}
registerDefaultLanguageCommand('_executeDocumentHighlights', function (model, position) { return getOccurrencesAtPosition(model, position, CancellationToken.None); });
var WordHighlighter = /** @class */ (function () {
    function WordHighlighter(editor, contextKeyService) {
        var _this = this;
        this.workerRequestTokenId = 0;
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
        return arrays.coalesce(this._decorationIds
            .map(function (id) { return _this.model.getDecorationRange(id); })
            .sort(Range.compareRangesUsingStarts));
    };
    WordHighlighter.prototype.moveNext = function () {
        var _this = this;
        var highlights = this._getSortedHighlights();
        var index = arrays.firstIndex(highlights, function (range) { return range.containsPosition(_this.editor.getPosition()); });
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
        var index = arrays.firstIndex(highlights, function (range) { return range.containsPosition(_this.editor.getPosition()); });
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
        if (e.reason !== 3 /* Explicit */) {
            this._stopAll();
            return;
        }
        this._run();
    };
    WordHighlighter.prototype._run = function () {
        var _this = this;
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
        var workerRequestIsValid = (this.workerRequest && this.workerRequest.isValid(this.model, editorSelection, this._decorationIds));
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
            this.workerRequest = computeOccurencesAtPosition(this.model, this.editor.getSelection(), this.editor.getConfiguration().wordSeparators);
            this.workerRequest.result.then(function (data) {
                if (myRequestId_1 === _this.workerRequestTokenId) {
                    _this.workerRequestCompleted = true;
                    _this.workerRequestValue = data || [];
                    _this._beginRenderDecorations();
                }
            }, onUnexpectedError);
        }
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
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'wordHighlightStrong',
        overviewRuler: {
            color: themeColorFromId(overviewRulerWordHighlightStrongForeground),
            position: OverviewRulerLane.Center
        }
    });
    WordHighlighter._TEXT_OPTIONS = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'selectionHighlight',
        overviewRuler: {
            color: themeColorFromId(overviewRulerSelectionHighlightForeground),
            position: OverviewRulerLane.Center
        }
    });
    WordHighlighter._REGULAR_OPTIONS = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'wordHighlight',
        overviewRuler: {
            color: themeColorFromId(overviewRulerWordHighlightForeground),
            position: OverviewRulerLane.Center
        }
    });
    return WordHighlighter;
}());
var WordHighlighterContribution = /** @class */ (function (_super) {
    __extends(WordHighlighterContribution, _super);
    function WordHighlighterContribution(editor, contextKeyService) {
        var _this = _super.call(this) || this;
        var createWordHighlighterIfPossible = function () {
            if (editor.hasModel()) {
                _this.wordHighligher = new WordHighlighter(editor, contextKeyService);
            }
        };
        _this._register(editor.onDidChangeModel(function (e) {
            if (_this.wordHighligher) {
                _this.wordHighligher.dispose();
                _this.wordHighligher = null;
            }
            createWordHighlighterIfPossible();
        }));
        createWordHighlighterIfPossible();
        return _this;
    }
    WordHighlighterContribution.get = function (editor) {
        return editor.getContribution(WordHighlighterContribution.ID);
    };
    WordHighlighterContribution.prototype.getId = function () {
        return WordHighlighterContribution.ID;
    };
    WordHighlighterContribution.prototype.saveViewState = function () {
        if (this.wordHighligher && this.wordHighligher.hasDecorations()) {
            return true;
        }
        return false;
    };
    WordHighlighterContribution.prototype.moveNext = function () {
        if (this.wordHighligher) {
            this.wordHighligher.moveNext();
        }
    };
    WordHighlighterContribution.prototype.moveBack = function () {
        if (this.wordHighligher) {
            this.wordHighligher.moveBack();
        }
    };
    WordHighlighterContribution.prototype.restoreViewState = function (state) {
        if (this.wordHighligher && state) {
            this.wordHighligher.restore();
        }
    };
    WordHighlighterContribution.prototype.dispose = function () {
        if (this.wordHighligher) {
            this.wordHighligher.dispose();
            this.wordHighligher = null;
        }
        _super.prototype.dispose.call(this);
    };
    WordHighlighterContribution.ID = 'editor.contrib.wordHighlighter';
    WordHighlighterContribution = __decorate([
        __param(1, IContextKeyService)
    ], WordHighlighterContribution);
    return WordHighlighterContribution;
}(Disposable));
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
                primary: 65 /* F7 */,
                weight: 100 /* EditorContrib */
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
                primary: 1024 /* Shift */ | 65 /* F7 */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    return PrevWordHighlightAction;
}(WordHighlightNavigationAction));
var TriggerWordHighlightAction = /** @class */ (function (_super) {
    __extends(TriggerWordHighlightAction, _super);
    function TriggerWordHighlightAction() {
        return _super.call(this, {
            id: 'editor.action.wordHighlight.trigger',
            label: nls.localize('wordHighlight.trigger.label', "Trigger Symbol Highlight"),
            alias: 'Trigger Symbol Highlight',
            precondition: ctxHasWordHighlights.toNegated(),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 0,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    TriggerWordHighlightAction.prototype.run = function (accessor, editor, args) {
        var controller = WordHighlighterContribution.get(editor);
        if (!controller) {
            return;
        }
        controller.restoreViewState(true);
    };
    return TriggerWordHighlightAction;
}(EditorAction));
registerEditorContribution(WordHighlighterContribution);
registerEditorAction(NextWordHighlightAction);
registerEditorAction(PrevWordHighlightAction);
registerEditorAction(TriggerWordHighlightAction);
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
