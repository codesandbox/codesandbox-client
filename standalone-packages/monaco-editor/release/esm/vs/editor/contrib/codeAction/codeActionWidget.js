/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getDomNodePagePosition } from '../../../base/browser/dom.js';
import { Action } from '../../../base/common/actions.js';
import { always } from '../../../base/common/async.js';
import { canceled } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { Position } from '../../common/core/position.js';
var CodeActionContextMenu = /** @class */ (function () {
    function CodeActionContextMenu(_editor, _contextMenuService, _onApplyCodeAction) {
        this._editor = _editor;
        this._contextMenuService = _contextMenuService;
        this._onApplyCodeAction = _onApplyCodeAction;
        this._onDidExecuteCodeAction = new Emitter();
        this.onDidExecuteCodeAction = this._onDidExecuteCodeAction.event;
    }
    CodeActionContextMenu.prototype.show = function (fixes, at) {
        var _this = this;
        var actions = fixes.then(function (value) {
            return value.map(function (action) {
                return new Action(action.command ? action.command.id : action.title, action.title, undefined, true, function () {
                    return always(_this._onApplyCodeAction(action), function () { return _this._onDidExecuteCodeAction.fire(undefined); });
                });
            });
        }).then(function (actions) {
            if (!_this._editor.getDomNode()) {
                // cancel when editor went off-dom
                return TPromise.wrapError(canceled());
            }
            return actions;
        });
        this._contextMenuService.showContextMenu({
            getAnchor: function () {
                if (Position.isIPosition(at)) {
                    at = _this._toCoords(at);
                }
                return at;
            },
            getActions: function () { return TPromise.wrap(actions); },
            onHide: function () {
                _this._visible = false;
                _this._editor.focus();
            },
            autoSelectFirstItem: true
        });
    };
    Object.defineProperty(CodeActionContextMenu.prototype, "isVisible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    CodeActionContextMenu.prototype._toCoords = function (position) {
        this._editor.revealPosition(position, 1 /* Immediate */);
        this._editor.render();
        // Translate to absolute editor position
        var cursorCoords = this._editor.getScrolledVisiblePosition(this._editor.getPosition());
        var editorCoords = getDomNodePagePosition(this._editor.getDomNode());
        var x = editorCoords.left + cursorCoords.left;
        var y = editorCoords.top + cursorCoords.top + cursorCoords.height;
        return { x: x, y: y };
    };
    return CodeActionContextMenu;
}());
export { CodeActionContextMenu };
