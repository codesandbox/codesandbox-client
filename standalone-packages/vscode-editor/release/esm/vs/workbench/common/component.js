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
import { Memento } from './memento.js';
import { Themable } from './theme.js';
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(id, themeService, storageService) {
        var _this = _super.call(this, themeService) || this;
        _this.id = id;
        _this.memento = new Memento(_this.id, storageService);
        _this._register(storageService.onWillSaveState(function () {
            // Ask the component to persist state into the memento
            _this.saveState();
            // Then save the memento into storage
            _this.memento.saveMemento();
        }));
        return _this;
    }
    Component.prototype.getId = function () {
        return this.id;
    };
    Component.prototype.getMemento = function (scope) {
        return this.memento.getMemento(scope);
    };
    Component.prototype.saveState = function () {
        // Subclasses to implement for storing state
    };
    return Component;
}(Themable));
export { Component };
