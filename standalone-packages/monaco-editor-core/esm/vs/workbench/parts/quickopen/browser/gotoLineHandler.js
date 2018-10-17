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
import { TPromise } from '../../../../base/common/winjs.base';
import * as nls from '../../../../nls';
import * as types from '../../../../base/common/types';
import { QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, EditorQuickOpenEntry, QuickOpenAction } from '../../../browser/quickopen';
import { OverviewRulerLane } from '../../../../editor/common/model';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { overviewRulerRangeHighlight } from '../../../../editor/common/view/editorColorRegistry';
import { themeColorFromId } from '../../../../platform/theme/common/themeService';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser';
import { once } from '../../../../base/common/event';
export var GOTO_LINE_PREFIX = ':';
var GotoLineAction = /** @class */ (function (_super) {
    __extends(GotoLineAction, _super);
    function GotoLineAction(actionId, actionLabel, _quickOpenService, editorService) {
        var _this = _super.call(this, actionId, actionLabel, GOTO_LINE_PREFIX, _quickOpenService) || this;
        _this._quickOpenService = _quickOpenService;
        _this.editorService = editorService;
        return _this;
    }
    GotoLineAction.prototype.run = function () {
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (isDiffEditor(activeTextEditorWidget)) {
            activeTextEditorWidget = activeTextEditorWidget.getModifiedEditor();
        }
        var restoreOptions = null;
        if (isCodeEditor(activeTextEditorWidget)) {
            var config = activeTextEditorWidget.getConfiguration();
            if (config.viewInfo.renderLineNumbers === 2 /* Relative */) {
                activeTextEditorWidget.updateOptions({
                    lineNumbers: 'on'
                });
                restoreOptions = {
                    lineNumbers: 'relative'
                };
            }
        }
        var result = _super.prototype.run.call(this);
        if (restoreOptions) {
            once(this._quickOpenService.onHide)(function () {
                activeTextEditorWidget.updateOptions(restoreOptions);
            });
        }
        return result;
    };
    GotoLineAction.ID = 'workbench.action.gotoLine';
    GotoLineAction.LABEL = nls.localize('gotoLine', "Go to Line...");
    GotoLineAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IEditorService)
    ], GotoLineAction);
    return GotoLineAction;
}(QuickOpenAction));
export { GotoLineAction };
var GotoLineEntry = /** @class */ (function (_super) {
    __extends(GotoLineEntry, _super);
    function GotoLineEntry(line, editorService, handler) {
        var _this = _super.call(this, editorService) || this;
        _this.parseInput(line);
        _this.handler = handler;
        return _this;
    }
    GotoLineEntry.prototype.parseInput = function (line) {
        var numbers = line.split(/,|:|#/).map(function (part) { return parseInt(part, 10); }).filter(function (part) { return !isNaN(part); });
        this.line = numbers[0];
        this.column = numbers[1];
    };
    GotoLineEntry.prototype.getLabel = function () {
        // Inform user about valid range if input is invalid
        var maxLineNumber = this.getMaxLineNumber();
        if (this.invalidRange(maxLineNumber)) {
            if (maxLineNumber > 0) {
                return nls.localize('gotoLineLabelEmptyWithLimit', "Type a line number between 1 and {0} to navigate to", maxLineNumber);
            }
            return nls.localize('gotoLineLabelEmpty', "Type a line number to navigate to");
        }
        // Input valid, indicate action
        return this.column ? nls.localize('gotoLineColumnLabel', "Go to line {0} and character {1}", this.line, this.column) : nls.localize('gotoLineLabel', "Go to line {0}", this.line);
    };
    GotoLineEntry.prototype.invalidRange = function (maxLineNumber) {
        if (maxLineNumber === void 0) { maxLineNumber = this.getMaxLineNumber(); }
        return !this.line || !types.isNumber(this.line) || (maxLineNumber > 0 && types.isNumber(this.line) && this.line > maxLineNumber);
    };
    GotoLineEntry.prototype.getMaxLineNumber = function () {
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        var model = activeTextEditorWidget.getModel();
        if (model && model.modified && model.original) {
            model = model.modified; // Support for diff editor models
        }
        return model && types.isFunction(model.getLineCount) ? model.getLineCount() : -1;
    };
    GotoLineEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            return this.runOpen(context);
        }
        return this.runPreview();
    };
    GotoLineEntry.prototype.getInput = function () {
        return this.editorService.activeEditor;
    };
    GotoLineEntry.prototype.getOptions = function (pinned) {
        return {
            selection: this.toSelection(),
            pinned: pinned
        };
    };
    GotoLineEntry.prototype.runOpen = function (context) {
        // No-op if range is not valid
        if (this.invalidRange()) {
            return false;
        }
        // Check for sideBySide use
        var sideBySide = context.keymods.ctrlCmd;
        if (sideBySide) {
            this.editorService.openEditor(this.getInput(), this.getOptions(context.keymods.alt), SIDE_GROUP);
        }
        // Apply selection and focus
        var range = this.toSelection();
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            activeTextEditorWidget.setSelection(range);
            activeTextEditorWidget.revealRangeInCenter(range, 0 /* Smooth */);
        }
        return true;
    };
    GotoLineEntry.prototype.runPreview = function () {
        // No-op if range is not valid
        if (this.invalidRange()) {
            this.handler.clearDecorations();
            return false;
        }
        // Select Line Position
        var range = this.toSelection();
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            activeTextEditorWidget.revealRangeInCenter(range, 0 /* Smooth */);
            // Decorate if possible
            if (types.isFunction(activeTextEditorWidget.changeDecorations)) {
                this.handler.decorateOutline(range, activeTextEditorWidget, this.editorService.activeControl.group);
            }
        }
        return false;
    };
    GotoLineEntry.prototype.toSelection = function () {
        return {
            startLineNumber: this.line,
            startColumn: this.column || 1,
            endLineNumber: this.line,
            endColumn: this.column || 1
        };
    };
    return GotoLineEntry;
}(EditorQuickOpenEntry));
var GotoLineHandler = /** @class */ (function (_super) {
    __extends(GotoLineHandler, _super);
    function GotoLineHandler(editorService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        return _this;
    }
    GotoLineHandler.prototype.getAriaLabel = function () {
        return nls.localize('gotoLineHandlerAriaLabel', "Type a line number to navigate to.");
    };
    GotoLineHandler.prototype.getResults = function (searchValue, token) {
        searchValue = searchValue.trim();
        // Remember view state to be able to restore on cancel
        if (!this.lastKnownEditorViewState) {
            var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
            this.lastKnownEditorViewState = activeTextEditorWidget.saveViewState();
        }
        return TPromise.as(new QuickOpenModel([new GotoLineEntry(searchValue, this.editorService, this)]));
    };
    GotoLineHandler.prototype.canRun = function () {
        var canRun = !!this.editorService.activeTextEditorWidget;
        return canRun ? true : nls.localize('cannotRunGotoLine', "Open a text file first to go to a line");
    };
    GotoLineHandler.prototype.decorateOutline = function (range, editor, group) {
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
                    range: range,
                    options: {
                        className: 'rangeHighlight',
                        isWholeLine: true
                    }
                },
                // lineDecoration at index 1
                {
                    range: range,
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
    GotoLineHandler.prototype.clearDecorations = function () {
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
    GotoLineHandler.prototype.onClose = function (canceled) {
        // Clear Highlight Decorations if present
        this.clearDecorations();
        // Restore selection if canceled
        if (canceled && this.lastKnownEditorViewState) {
            var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
            if (activeTextEditorWidget) {
                activeTextEditorWidget.restoreViewState(this.lastKnownEditorViewState);
            }
        }
        this.lastKnownEditorViewState = null;
    };
    GotoLineHandler.prototype.getAutoFocus = function (searchValue) {
        return {
            autoFocusFirstEntry: searchValue.trim().length > 0
        };
    };
    GotoLineHandler.ID = 'workbench.picker.line';
    GotoLineHandler = __decorate([
        __param(0, IEditorService)
    ], GotoLineHandler);
    return GotoLineHandler;
}(QuickOpenHandler));
export { GotoLineHandler };
