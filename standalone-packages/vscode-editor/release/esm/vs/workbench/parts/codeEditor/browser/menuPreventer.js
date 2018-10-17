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
import { Disposable } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
/**
 * Prevents the top-level menu from showing up when doing Alt + Click in the editor
 */
var MenuPreventer = /** @class */ (function (_super) {
    __extends(MenuPreventer, _super);
    function MenuPreventer(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._altListeningMouse = false;
        _this._altMouseTriggered = false;
        // A global crossover handler to prevent menu bar from showing up
        // When <alt> is hold, we will listen to mouse events and prevent
        // the release event up <alt> if the mouse is triggered.
        _this._register(_this._editor.onMouseDown(function (e) {
            if (_this._altListeningMouse) {
                _this._altMouseTriggered = true;
            }
        }));
        _this._register(_this._editor.onKeyDown(function (e) {
            if (e.equals(512 /* Alt */)) {
                if (!_this._altListeningMouse) {
                    _this._altMouseTriggered = false;
                }
                _this._altListeningMouse = true;
            }
        }));
        _this._register(_this._editor.onKeyUp(function (e) {
            if (e.equals(512 /* Alt */)) {
                if (_this._altMouseTriggered) {
                    e.preventDefault();
                }
                _this._altListeningMouse = false;
                _this._altMouseTriggered = false;
            }
        }));
        return _this;
    }
    MenuPreventer.prototype.getId = function () {
        return MenuPreventer.ID;
    };
    MenuPreventer.ID = 'editor.contrib.menuPreventer';
    return MenuPreventer;
}(Disposable));
export { MenuPreventer };
registerEditorContribution(MenuPreventer);
