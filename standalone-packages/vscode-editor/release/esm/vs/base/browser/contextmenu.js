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
import { SubmenuAction } from './ui/menu/menu.js';
var ContextSubMenu = /** @class */ (function (_super) {
    __extends(ContextSubMenu, _super);
    function ContextSubMenu(label, entries) {
        var _this = _super.call(this, label, entries, 'contextsubmenu') || this;
        _this.entries = entries;
        return _this;
    }
    return ContextSubMenu;
}(SubmenuAction));
export { ContextSubMenu };
