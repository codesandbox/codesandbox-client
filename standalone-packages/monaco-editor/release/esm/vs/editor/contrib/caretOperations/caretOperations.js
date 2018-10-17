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
import * as nls from '../../../nls.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, EditorAction } from '../../browser/editorExtensions.js';
import { MoveCaretCommand } from './moveCaretCommand.js';
var MoveCaretAction = /** @class */ (function (_super) {
    __extends(MoveCaretAction, _super);
    function MoveCaretAction(left, opts) {
        var _this = _super.call(this, opts) || this;
        _this.left = left;
        return _this;
    }
    MoveCaretAction.prototype.run = function (accessor, editor) {
        var commands = [];
        var selections = editor.getSelections();
        for (var i = 0; i < selections.length; i++) {
            commands.push(new MoveCaretCommand(selections[i], this.left));
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return MoveCaretAction;
}(EditorAction));
var MoveCaretLeftAction = /** @class */ (function (_super) {
    __extends(MoveCaretLeftAction, _super);
    function MoveCaretLeftAction() {
        return _super.call(this, true, {
            id: 'editor.action.moveCarretLeftAction',
            label: nls.localize('caret.moveLeft', "Move Caret Left"),
            alias: 'Move Caret Left',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return MoveCaretLeftAction;
}(MoveCaretAction));
var MoveCaretRightAction = /** @class */ (function (_super) {
    __extends(MoveCaretRightAction, _super);
    function MoveCaretRightAction() {
        return _super.call(this, false, {
            id: 'editor.action.moveCarretRightAction',
            label: nls.localize('caret.moveRight', "Move Caret Right"),
            alias: 'Move Caret Right',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return MoveCaretRightAction;
}(MoveCaretAction));
registerEditorAction(MoveCaretLeftAction);
registerEditorAction(MoveCaretRightAction);
