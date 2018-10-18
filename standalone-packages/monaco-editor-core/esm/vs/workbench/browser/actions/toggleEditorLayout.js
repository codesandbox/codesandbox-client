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
import './media/actions.css';
import * as nls from '../../../nls';
import { Registry } from '../../../platform/registry/common/platform';
import { Action } from '../../../base/common/actions';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../platform/actions/common/actions';
import { Extensions } from '../../common/actions';
import { dispose } from '../../../base/common/lifecycle';
import { CommandsRegistry } from '../../../platform/commands/common/commands';
import { IEditorGroupsService } from '../../services/group/common/editorGroupsService';
var ToggleEditorLayoutAction = /** @class */ (function (_super) {
    __extends(ToggleEditorLayoutAction, _super);
    function ToggleEditorLayoutAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        _this.toDispose = [];
        _this.class = 'flip-editor-layout';
        _this.updateEnablement();
        _this.registerListeners();
        return _this;
    }
    ToggleEditorLayoutAction.prototype.registerListeners = function () {
        var _this = this;
        this.toDispose.push(this.editorGroupService.onDidAddGroup(function () { return _this.updateEnablement(); }));
        this.toDispose.push(this.editorGroupService.onDidRemoveGroup(function () { return _this.updateEnablement(); }));
    };
    ToggleEditorLayoutAction.prototype.updateEnablement = function () {
        this.enabled = this.editorGroupService.count > 1;
    };
    ToggleEditorLayoutAction.prototype.run = function () {
        var newOrientation = (this.editorGroupService.orientation === 1 /* VERTICAL */) ? 0 /* HORIZONTAL */ : 1 /* VERTICAL */;
        this.editorGroupService.setGroupOrientation(newOrientation);
        return Promise.resolve(null);
    };
    ToggleEditorLayoutAction.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
        _super.prototype.dispose.call(this);
    };
    ToggleEditorLayoutAction.ID = 'workbench.action.toggleEditorGroupLayout';
    ToggleEditorLayoutAction.LABEL = nls.localize('flipLayout', "Toggle Vertical/Horizontal Editor Layout");
    ToggleEditorLayoutAction = __decorate([
        __param(2, IEditorGroupsService)
    ], ToggleEditorLayoutAction);
    return ToggleEditorLayoutAction;
}(Action));
export { ToggleEditorLayoutAction };
CommandsRegistry.registerCommand('_workbench.editor.setGroupOrientation', function (accessor, args) {
    var editorGroupService = accessor.get(IEditorGroupsService);
    var orientation = args[0];
    editorGroupService.setGroupOrientation(orientation);
    return Promise.resolve(null);
});
var registry = Registry.as(Extensions.WorkbenchActions);
var group = nls.localize('view', "View");
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleEditorLayoutAction, ToggleEditorLayoutAction.ID, ToggleEditorLayoutAction.LABEL, { primary: 1024 /* Shift */ | 512 /* Alt */ | 21 /* KEY_0 */, mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 21 /* KEY_0 */ } }), 'View: Flip Editor Group Layout', group);
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: 'z_flip',
    command: {
        id: ToggleEditorLayoutAction.ID,
        title: nls.localize({ key: 'miToggleEditorLayout', comment: ['&& denotes a mnemonic'] }, "Flip &&Layout")
    },
    order: 1
});
