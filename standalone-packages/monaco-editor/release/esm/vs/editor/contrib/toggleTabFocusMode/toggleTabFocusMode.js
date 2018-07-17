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
import { registerEditorAction, EditorAction } from '../../browser/editorExtensions.js';
import { TabFocus } from '../../common/config/commonEditorConfig.js';
var ToggleTabFocusModeAction = /** @class */ (function (_super) {
    __extends(ToggleTabFocusModeAction, _super);
    function ToggleTabFocusModeAction() {
        return _super.call(this, {
            id: ToggleTabFocusModeAction.ID,
            label: nls.localize({ key: 'toggle.tabMovesFocus', comment: ['Turn on/off use of tab key for moving focus around VS Code'] }, "Toggle Tab Key Moves Focus"),
            alias: 'Toggle Tab Key Moves Focus',
            precondition: null,
            kbOpts: {
                kbExpr: null,
                primary: 2048 /* CtrlCmd */ | 43 /* KEY_M */,
                mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 43 /* KEY_M */ }
            }
        }) || this;
    }
    ToggleTabFocusModeAction.prototype.run = function (accessor, editor) {
        var oldValue = TabFocus.getTabFocusMode();
        TabFocus.setTabFocusMode(!oldValue);
    };
    ToggleTabFocusModeAction.ID = 'editor.action.toggleTabFocusMode';
    return ToggleTabFocusModeAction;
}(EditorAction));
export { ToggleTabFocusModeAction };
registerEditorAction(ToggleTabFocusModeAction);
