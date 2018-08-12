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
import './gotoLine.css';
import * as nls from '../../../../nls.js';
import { QuickOpenEntry, QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { Mode } from '../../../../base/parts/quickopen/common/quickOpen.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { isCodeEditor } from '../../../browser/editorBrowser.js';
import { BaseEditorQuickOpenAction } from './editorQuickOpen.js';
import { registerEditorAction } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
var GotoLineEntry = /** @class */ (function (_super) {
    __extends(GotoLineEntry, _super);
    function GotoLineEntry(line, editor, decorator) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.decorator = decorator;
        _this._parseResult = _this._parseInput(line);
        return _this;
    }
    GotoLineEntry.prototype._parseInput = function (line) {
        var numbers = line.split(',').map(function (part) { return parseInt(part, 10); }).filter(function (part) { return !isNaN(part); }), position;
        if (numbers.length === 0) {
            position = new Position(-1, -1);
        }
        else if (numbers.length === 1) {
            position = new Position(numbers[0], 1);
        }
        else {
            position = new Position(numbers[0], numbers[1]);
        }
        var model;
        if (isCodeEditor(this.editor)) {
            model = this.editor.getModel();
        }
        else {
            model = this.editor.getModel().modified;
        }
        var isValid = model.validatePosition(position).equals(position), label;
        if (isValid) {
            if (position.column && position.column > 1) {
                label = nls.localize('gotoLineLabelValidLineAndColumn', "Go to line {0} and character {1}", position.lineNumber, position.column);
            }
            else {
                label = nls.localize('gotoLineLabelValidLine', "Go to line {0}", position.lineNumber, position.column);
            }
        }
        else if (position.lineNumber < 1 || position.lineNumber > model.getLineCount()) {
            label = nls.localize('gotoLineLabelEmptyWithLineLimit', "Type a line number between 1 and {0} to navigate to", model.getLineCount());
        }
        else {
            label = nls.localize('gotoLineLabelEmptyWithLineAndColumnLimit', "Type a character between 1 and {0} to navigate to", model.getLineMaxColumn(position.lineNumber));
        }
        return {
            position: position,
            isValid: isValid,
            label: label
        };
    };
    GotoLineEntry.prototype.getLabel = function () {
        return this._parseResult.label;
    };
    GotoLineEntry.prototype.getAriaLabel = function () {
        return nls.localize('gotoLineAriaLabel', "Go to line {0}", this._parseResult.label);
    };
    GotoLineEntry.prototype.run = function (mode, context) {
        if (mode === Mode.OPEN) {
            return this.runOpen();
        }
        return this.runPreview();
    };
    GotoLineEntry.prototype.runOpen = function () {
        // No-op if range is not valid
        if (!this._parseResult.isValid) {
            return false;
        }
        // Apply selection and focus
        var range = this.toSelection();
        this.editor.setSelection(range);
        this.editor.revealRangeInCenter(range, 0 /* Smooth */);
        this.editor.focus();
        return true;
    };
    GotoLineEntry.prototype.runPreview = function () {
        // No-op if range is not valid
        if (!this._parseResult.isValid) {
            this.decorator.clearDecorations();
            return false;
        }
        // Select Line Position
        var range = this.toSelection();
        this.editor.revealRangeInCenter(range, 0 /* Smooth */);
        // Decorate if possible
        this.decorator.decorateLine(range, this.editor);
        return false;
    };
    GotoLineEntry.prototype.toSelection = function () {
        return new Range(this._parseResult.position.lineNumber, this._parseResult.position.column, this._parseResult.position.lineNumber, this._parseResult.position.column);
    };
    return GotoLineEntry;
}(QuickOpenEntry));
export { GotoLineEntry };
var GotoLineAction = /** @class */ (function (_super) {
    __extends(GotoLineAction, _super);
    function GotoLineAction() {
        return _super.call(this, nls.localize('gotoLineActionInput', "Type a line number, followed by an optional colon and a character number to navigate to"), {
            id: 'editor.action.gotoLine',
            label: nls.localize('GotoLineAction.label', "Go to Line..."),
            alias: 'Go to Line...',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 2048 /* CtrlCmd */ | 37 /* KEY_G */,
                mac: { primary: 256 /* WinCtrl */ | 37 /* KEY_G */ }
            }
        }) || this;
    }
    GotoLineAction.prototype.run = function (accessor, editor) {
        var _this = this;
        this._show(this.getController(editor), {
            getModel: function (value) {
                return new QuickOpenModel([new GotoLineEntry(value, editor, _this.getController(editor))]);
            },
            getAutoFocus: function (searchValue) {
                return {
                    autoFocusFirstEntry: searchValue.length > 0
                };
            }
        });
    };
    return GotoLineAction;
}(BaseEditorQuickOpenAction));
export { GotoLineAction };
registerEditorAction(GotoLineAction);
