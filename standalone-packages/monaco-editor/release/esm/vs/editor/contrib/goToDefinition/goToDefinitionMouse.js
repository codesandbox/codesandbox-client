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
import './goToDefinitionMouse.css';
import * as nls from '../../../nls.js';
import { Throttler } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { IModeService } from '../../common/services/modeService.js';
import { Range } from '../../common/core/range.js';
import { DefinitionProviderRegistry } from '../../common/modes.js';
import { MouseTargetType } from '../../browser/editorBrowser.js';
import { registerEditorContribution } from '../../browser/editorExtensions.js';
import { getDefinitionsAtPosition } from './goToDefinition.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { ITextModelService } from '../../common/services/resolverService.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { editorActiveLinkForeground } from '../../../platform/theme/common/colorRegistry.js';
import { EditorState } from '../../browser/core/editorState.js';
import { DefinitionAction, DefinitionActionConfig } from './goToDefinitionCommands.js';
import { ClickLinkGesture } from './clickLinkGesture.js';
import { Position } from '../../common/core/position.js';
var GotoDefinitionWithMouseEditorContribution = /** @class */ (function () {
    function GotoDefinitionWithMouseEditorContribution(editor, textModelResolverService, modeService) {
        var _this = this;
        this.textModelResolverService = textModelResolverService;
        this.modeService = modeService;
        this.toUnhook = [];
        this.decorations = [];
        this.editor = editor;
        this.throttler = new Throttler();
        var linkGesture = new ClickLinkGesture(editor);
        this.toUnhook.push(linkGesture);
        this.toUnhook.push(linkGesture.onMouseMoveOrRelevantKeyDown(function (_a) {
            var mouseEvent = _a[0], keyboardEvent = _a[1];
            _this.startFindDefinition(mouseEvent, keyboardEvent);
        }));
        this.toUnhook.push(linkGesture.onExecute(function (mouseEvent) {
            if (_this.isEnabled(mouseEvent)) {
                _this.gotoDefinition(mouseEvent.target, mouseEvent.hasSideBySideModifier).done(function () {
                    _this.removeDecorations();
                }, function (error) {
                    _this.removeDecorations();
                    onUnexpectedError(error);
                });
            }
        }));
        this.toUnhook.push(linkGesture.onCancel(function () {
            _this.removeDecorations();
            _this.currentWordUnderMouse = null;
        }));
    }
    GotoDefinitionWithMouseEditorContribution.prototype.startFindDefinition = function (mouseEvent, withKey) {
        var _this = this;
        if (!this.isEnabled(mouseEvent, withKey)) {
            this.currentWordUnderMouse = null;
            this.removeDecorations();
            return;
        }
        // Find word at mouse position
        var position = mouseEvent.target.position;
        var word = position ? this.editor.getModel().getWordAtPosition(position) : null;
        if (!word) {
            this.currentWordUnderMouse = null;
            this.removeDecorations();
            return;
        }
        // Return early if word at position is still the same
        if (this.currentWordUnderMouse && this.currentWordUnderMouse.startColumn === word.startColumn && this.currentWordUnderMouse.endColumn === word.endColumn && this.currentWordUnderMouse.word === word.word) {
            return;
        }
        this.currentWordUnderMouse = word;
        // Find definition and decorate word if found
        var state = new EditorState(this.editor, 4 /* Position */ | 1 /* Value */ | 2 /* Selection */ | 8 /* Scroll */);
        this.throttler.queue(function () {
            return state.validate(_this.editor)
                ? _this.findDefinition(mouseEvent.target)
                : TPromise.wrap(null);
        }).then(function (results) {
            if (!results || !results.length || !state.validate(_this.editor)) {
                _this.removeDecorations();
                return;
            }
            // Multiple results
            if (results.length > 1) {
                _this.addDecoration(new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn), new MarkdownString().appendText(nls.localize('multipleResults', "Click to show {0} definitions.", results.length)));
            }
            // Single result
            else {
                var result_1 = results[0];
                if (!result_1.uri) {
                    return;
                }
                _this.textModelResolverService.createModelReference(result_1.uri).then(function (ref) {
                    if (!ref.object || !ref.object.textEditorModel) {
                        ref.dispose();
                        return;
                    }
                    var textEditorModel = ref.object.textEditorModel;
                    var startLineNumber = result_1.range.startLineNumber;
                    if (textEditorModel.getLineMaxColumn(startLineNumber) === 0) {
                        ref.dispose();
                        return;
                    }
                    var previewValue = _this.getPreviewValue(textEditorModel, startLineNumber);
                    var wordRange;
                    if (result_1.origin) {
                        wordRange = Range.lift(result_1.origin);
                    }
                    else {
                        wordRange = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
                    }
                    _this.addDecoration(wordRange, new MarkdownString().appendCodeblock(_this.modeService.getModeIdByFilenameOrFirstLine(textEditorModel.uri.fsPath), previewValue));
                    ref.dispose();
                });
            }
        }).done(undefined, onUnexpectedError);
    };
    GotoDefinitionWithMouseEditorContribution.prototype.getPreviewValue = function (textEditorModel, startLineNumber) {
        var rangeToUse = this.getPreviewRangeBasedOnBrackets(textEditorModel, startLineNumber);
        var numberOfLinesInRange = rangeToUse.endLineNumber - rangeToUse.startLineNumber;
        if (numberOfLinesInRange >= GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES) {
            rangeToUse = this.getPreviewRangeBasedOnIndentation(textEditorModel, startLineNumber);
        }
        var previewValue = this.stripIndentationFromPreviewRange(textEditorModel, startLineNumber, rangeToUse);
        return previewValue;
    };
    GotoDefinitionWithMouseEditorContribution.prototype.stripIndentationFromPreviewRange = function (textEditorModel, startLineNumber, previewRange) {
        var startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
        var minIndent = startIndent;
        for (var endLineNumber = startLineNumber + 1; endLineNumber < previewRange.endLineNumber; endLineNumber++) {
            var endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);
            minIndent = Math.min(minIndent, endIndent);
        }
        var previewValue = textEditorModel.getValueInRange(previewRange).replace(new RegExp("^\\s{" + (minIndent - 1) + "}", 'gm'), '').trim();
        return previewValue;
    };
    GotoDefinitionWithMouseEditorContribution.prototype.getPreviewRangeBasedOnIndentation = function (textEditorModel, startLineNumber) {
        var startIndent = textEditorModel.getLineFirstNonWhitespaceColumn(startLineNumber);
        var maxLineNumber = Math.min(textEditorModel.getLineCount(), startLineNumber + GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES);
        var endLineNumber = startLineNumber + 1;
        for (; endLineNumber < maxLineNumber; endLineNumber++) {
            var endIndent = textEditorModel.getLineFirstNonWhitespaceColumn(endLineNumber);
            if (startIndent === endIndent) {
                break;
            }
        }
        return new Range(startLineNumber, 1, endLineNumber + 1, 1);
    };
    GotoDefinitionWithMouseEditorContribution.prototype.getPreviewRangeBasedOnBrackets = function (textEditorModel, startLineNumber) {
        var maxLineNumber = Math.min(textEditorModel.getLineCount(), startLineNumber + GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES);
        var brackets = [];
        var ignoreFirstEmpty = true;
        var currentBracket = textEditorModel.findNextBracket(new Position(startLineNumber, 1));
        while (currentBracket !== null) {
            if (brackets.length === 0) {
                brackets.push(currentBracket);
            }
            else {
                var lastBracket = brackets[brackets.length - 1];
                if (lastBracket.open === currentBracket.open && lastBracket.isOpen && !currentBracket.isOpen) {
                    brackets.pop();
                }
                else {
                    brackets.push(currentBracket);
                }
                if (brackets.length === 0) {
                    if (ignoreFirstEmpty) {
                        ignoreFirstEmpty = false;
                    }
                    else {
                        return new Range(startLineNumber, 1, currentBracket.range.endLineNumber + 1, 1);
                    }
                }
            }
            var maxColumn = textEditorModel.getLineMaxColumn(startLineNumber);
            var nextLineNumber = currentBracket.range.endLineNumber;
            var nextColumn = currentBracket.range.endColumn;
            if (maxColumn === currentBracket.range.endColumn) {
                nextLineNumber++;
                nextColumn = 1;
            }
            if (nextLineNumber > maxLineNumber) {
                return new Range(startLineNumber, 1, maxLineNumber + 1, 1);
            }
            currentBracket = textEditorModel.findNextBracket(new Position(nextLineNumber, nextColumn));
        }
        return new Range(startLineNumber, 1, maxLineNumber + 1, 1);
    };
    GotoDefinitionWithMouseEditorContribution.prototype.addDecoration = function (range, hoverMessage) {
        var newDecorations = {
            range: range,
            options: {
                inlineClassName: 'goto-definition-link',
                hoverMessage: hoverMessage
            }
        };
        this.decorations = this.editor.deltaDecorations(this.decorations, [newDecorations]);
    };
    GotoDefinitionWithMouseEditorContribution.prototype.removeDecorations = function () {
        if (this.decorations.length > 0) {
            this.decorations = this.editor.deltaDecorations(this.decorations, []);
        }
    };
    GotoDefinitionWithMouseEditorContribution.prototype.isEnabled = function (mouseEvent, withKey) {
        return this.editor.getModel() &&
            mouseEvent.isNoneOrSingleMouseDown &&
            mouseEvent.target.type === MouseTargetType.CONTENT_TEXT &&
            (mouseEvent.hasTriggerModifier || (withKey && withKey.keyCodeIsTriggerKey)) &&
            DefinitionProviderRegistry.has(this.editor.getModel());
    };
    GotoDefinitionWithMouseEditorContribution.prototype.findDefinition = function (target) {
        var model = this.editor.getModel();
        if (!model) {
            return TPromise.as(null);
        }
        return getDefinitionsAtPosition(model, target.position);
    };
    GotoDefinitionWithMouseEditorContribution.prototype.gotoDefinition = function (target, sideBySide) {
        var _this = this;
        this.editor.setPosition(target.position);
        var action = new DefinitionAction(new DefinitionActionConfig(sideBySide, false, true, false), { alias: undefined, label: undefined, id: undefined, precondition: undefined });
        return this.editor.invokeWithinContext(function (accessor) { return action.run(accessor, _this.editor); });
    };
    GotoDefinitionWithMouseEditorContribution.prototype.getId = function () {
        return GotoDefinitionWithMouseEditorContribution.ID;
    };
    GotoDefinitionWithMouseEditorContribution.prototype.dispose = function () {
        this.toUnhook = dispose(this.toUnhook);
    };
    GotoDefinitionWithMouseEditorContribution.ID = 'editor.contrib.gotodefinitionwithmouse';
    GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES = 8;
    GotoDefinitionWithMouseEditorContribution = __decorate([
        __param(1, ITextModelService),
        __param(2, IModeService)
    ], GotoDefinitionWithMouseEditorContribution);
    return GotoDefinitionWithMouseEditorContribution;
}());
registerEditorContribution(GotoDefinitionWithMouseEditorContribution);
registerThemingParticipant(function (theme, collector) {
    var activeLinkForeground = theme.getColor(editorActiveLinkForeground);
    if (activeLinkForeground) {
        collector.addRule(".monaco-editor .goto-definition-link { color: " + activeLinkForeground + " !important; }");
    }
});
