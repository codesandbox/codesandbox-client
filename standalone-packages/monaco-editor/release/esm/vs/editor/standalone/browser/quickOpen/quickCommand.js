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
import * as nls from '../../../../nls.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { QuickOpenEntryGroup, QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { Mode } from '../../../../base/parts/quickopen/common/quickOpen.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { BaseEditorQuickOpenAction } from './editorQuickOpen.js';
import { registerEditorAction } from '../../../browser/editorExtensions.js';
import * as browser from '../../../../base/browser/browser.js';
var EditorActionCommandEntry = /** @class */ (function (_super) {
    __extends(EditorActionCommandEntry, _super);
    function EditorActionCommandEntry(key, highlights, action, editor) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.setHighlights(highlights);
        _this.action = action;
        _this.editor = editor;
        return _this;
    }
    EditorActionCommandEntry.prototype.getLabel = function () {
        return this.action.label;
    };
    EditorActionCommandEntry.prototype.getAriaLabel = function () {
        return nls.localize('ariaLabelEntry', "{0}, commands", this.getLabel());
    };
    EditorActionCommandEntry.prototype.getGroupLabel = function () {
        return this.key;
    };
    EditorActionCommandEntry.prototype.run = function (mode, context) {
        var _this = this;
        if (mode === Mode.OPEN) {
            // Use a timeout to give the quick open widget a chance to close itself first
            TPromise.timeout(50).done(function () {
                // Some actions are enabled only when editor has focus
                _this.editor.focus();
                try {
                    var promise = _this.action.run() || TPromise.as(null);
                    promise.done(null, onUnexpectedError);
                }
                catch (error) {
                    onUnexpectedError(error);
                }
            }, onUnexpectedError);
            return true;
        }
        return false;
    };
    return EditorActionCommandEntry;
}(QuickOpenEntryGroup));
export { EditorActionCommandEntry };
var QuickCommandAction = /** @class */ (function (_super) {
    __extends(QuickCommandAction, _super);
    function QuickCommandAction() {
        return _super.call(this, nls.localize('quickCommandActionInput', "Type the name of an action you want to execute"), {
            id: 'editor.action.quickCommand',
            label: nls.localize('QuickCommandAction.label', "Command Palette"),
            alias: 'Command Palette',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: (browser.isIE ? 512 /* Alt */ | 59 /* F1 */ : 59 /* F1 */)
            },
            menuOpts: {}
        }) || this;
    }
    QuickCommandAction.prototype.run = function (accessor, editor) {
        var _this = this;
        var keybindingService = accessor.get(IKeybindingService);
        this._show(this.getController(editor), {
            getModel: function (value) {
                return new QuickOpenModel(_this._editorActionsToEntries(keybindingService, editor, value));
            },
            getAutoFocus: function (searchValue) {
                return {
                    autoFocusFirstEntry: true,
                    autoFocusPrefixMatch: searchValue
                };
            }
        });
    };
    QuickCommandAction.prototype._sort = function (elementA, elementB) {
        var elementAName = elementA.getLabel().toLowerCase();
        var elementBName = elementB.getLabel().toLowerCase();
        return elementAName.localeCompare(elementBName);
    };
    QuickCommandAction.prototype._editorActionsToEntries = function (keybindingService, editor, searchValue) {
        var actions = editor.getSupportedActions();
        var entries = [];
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            var keybind = keybindingService.lookupKeybinding(action.id);
            if (action.label) {
                var highlights = matchesFuzzy(searchValue, action.label);
                if (highlights) {
                    entries.push(new EditorActionCommandEntry(keybind ? keybind.getLabel() : '', highlights, action, editor));
                }
            }
        }
        // Sort by name
        entries = entries.sort(this._sort);
        return entries;
    };
    return QuickCommandAction;
}(BaseEditorQuickOpenAction));
export { QuickCommandAction };
registerEditorAction(QuickCommandAction);
