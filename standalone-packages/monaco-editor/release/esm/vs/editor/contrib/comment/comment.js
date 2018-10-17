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
import { KeyChord } from '../../../base/common/keyCodes.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, EditorAction } from '../../browser/editorExtensions.js';
import { BlockCommentCommand } from './blockCommentCommand.js';
import { LineCommentCommand } from './lineCommentCommand.js';
var CommentLineAction = /** @class */ (function (_super) {
    __extends(CommentLineAction, _super);
    function CommentLineAction(type, opts) {
        var _this = _super.call(this, opts) || this;
        _this._type = type;
        return _this;
    }
    CommentLineAction.prototype.run = function (accessor, editor) {
        var model = editor.getModel();
        if (!model) {
            return;
        }
        var commands = [];
        var selections = editor.getSelections();
        var opts = model.getOptions();
        for (var i = 0; i < selections.length; i++) {
            commands.push(new LineCommentCommand(selections[i], opts.tabSize, this._type));
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return CommentLineAction;
}(EditorAction));
var ToggleCommentLineAction = /** @class */ (function (_super) {
    __extends(ToggleCommentLineAction, _super);
    function ToggleCommentLineAction() {
        return _super.call(this, 0 /* Toggle */, {
            id: 'editor.action.commentLine',
            label: nls.localize('comment.line', "Toggle Line Comment"),
            alias: 'Toggle Line Comment',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 85 /* US_SLASH */
            }
        }) || this;
    }
    return ToggleCommentLineAction;
}(CommentLineAction));
var AddLineCommentAction = /** @class */ (function (_super) {
    __extends(AddLineCommentAction, _super);
    function AddLineCommentAction() {
        return _super.call(this, 1 /* ForceAdd */, {
            id: 'editor.action.addCommentLine',
            label: nls.localize('comment.line.add', "Add Line Comment"),
            alias: 'Add Line Comment',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 33 /* KEY_C */)
            }
        }) || this;
    }
    return AddLineCommentAction;
}(CommentLineAction));
var RemoveLineCommentAction = /** @class */ (function (_super) {
    __extends(RemoveLineCommentAction, _super);
    function RemoveLineCommentAction() {
        return _super.call(this, 2 /* ForceRemove */, {
            id: 'editor.action.removeCommentLine',
            label: nls.localize('comment.line.remove', "Remove Line Comment"),
            alias: 'Remove Line Comment',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 51 /* KEY_U */)
            }
        }) || this;
    }
    return RemoveLineCommentAction;
}(CommentLineAction));
var BlockCommentAction = /** @class */ (function (_super) {
    __extends(BlockCommentAction, _super);
    function BlockCommentAction() {
        return _super.call(this, {
            id: 'editor.action.blockComment',
            label: nls.localize('comment.block', "Toggle Block Comment"),
            alias: 'Toggle Block Comment',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 31 /* KEY_A */,
                linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 31 /* KEY_A */ }
            }
        }) || this;
    }
    BlockCommentAction.prototype.run = function (accessor, editor) {
        var commands = [];
        var selections = editor.getSelections();
        for (var i = 0; i < selections.length; i++) {
            commands.push(new BlockCommentCommand(selections[i]));
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return BlockCommentAction;
}(EditorAction));
registerEditorAction(ToggleCommentLineAction);
registerEditorAction(AddLineCommentAction);
registerEditorAction(RemoveLineCommentAction);
registerEditorAction(BlockCommentAction);
