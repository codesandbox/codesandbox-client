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
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { mixin } from '../../../../base/common/objects.js';
import { EditorInput } from '../../../common/editor.js';
import { QuickOpenEntryGroup } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { EditorQuickOpenEntry, EditorQuickOpenEntryGroup, QuickOpenAction } from '../../quickopen.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IWindowsService } from '../../../../platform/windows/common/windows.js';
import { CLOSE_EDITOR_COMMAND_ID, NAVIGATE_ALL_EDITORS_GROUP_PREFIX, MOVE_ACTIVE_EDITOR_COMMAND_ID, NAVIGATE_IN_ACTIVE_GROUP_PREFIX, SPLIT_EDITOR_LEFT, SPLIT_EDITOR_RIGHT, SPLIT_EDITOR_UP, SPLIT_EDITOR_DOWN, splitEditor, LAYOUT_EDITOR_GROUPS_COMMAND_ID, mergeAllGroups } from './editorCommands.js';
import { IEditorGroupsService, preferredSideBySideGroupDirection } from '../../../services/group/common/editorGroupsService.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { dispose } from '../../../../base/common/lifecycle.js';
var ExecuteCommandAction = /** @class */ (function (_super) {
    __extends(ExecuteCommandAction, _super);
    function ExecuteCommandAction(id, label, commandId, commandService, commandArgs) {
        var _this = _super.call(this, id, label) || this;
        _this.commandId = commandId;
        _this.commandService = commandService;
        _this.commandArgs = commandArgs;
        return _this;
    }
    ExecuteCommandAction.prototype.run = function () {
        return this.commandService.executeCommand(this.commandId, this.commandArgs);
    };
    return ExecuteCommandAction;
}(Action));
export { ExecuteCommandAction };
var BaseSplitEditorAction = /** @class */ (function (_super) {
    __extends(BaseSplitEditorAction, _super);
    function BaseSplitEditorAction(id, label, editorGroupService, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        _this.configurationService = configurationService;
        _this.toDispose = [];
        _this.direction = _this.getDirection();
        _this.registerListeners();
        return _this;
    }
    BaseSplitEditorAction.prototype.getDirection = function () {
        return preferredSideBySideGroupDirection(this.configurationService);
    };
    BaseSplitEditorAction.prototype.registerListeners = function () {
        var _this = this;
        this.toDispose.push(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('workbench.editor.openSideBySideDirection')) {
                _this.direction = preferredSideBySideGroupDirection(_this.configurationService);
            }
        }));
    };
    BaseSplitEditorAction.prototype.run = function (context) {
        splitEditor(this.editorGroupService, this.direction, context);
        return TPromise.as(true);
    };
    BaseSplitEditorAction.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.toDispose = dispose(this.toDispose);
    };
    return BaseSplitEditorAction;
}(Action));
export { BaseSplitEditorAction };
var SplitEditorAction = /** @class */ (function (_super) {
    __extends(SplitEditorAction, _super);
    function SplitEditorAction(id, label, editorGroupService, configurationService) {
        return _super.call(this, id, label, editorGroupService, configurationService) || this;
    }
    SplitEditorAction.ID = 'workbench.action.splitEditor';
    SplitEditorAction.LABEL = nls.localize('splitEditor', "Split Editor");
    SplitEditorAction = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IConfigurationService)
    ], SplitEditorAction);
    return SplitEditorAction;
}(BaseSplitEditorAction));
export { SplitEditorAction };
var SplitEditorOrthogonalAction = /** @class */ (function (_super) {
    __extends(SplitEditorOrthogonalAction, _super);
    function SplitEditorOrthogonalAction(id, label, editorGroupService, configurationService) {
        return _super.call(this, id, label, editorGroupService, configurationService) || this;
    }
    SplitEditorOrthogonalAction.prototype.getDirection = function () {
        var direction = preferredSideBySideGroupDirection(this.configurationService);
        return direction === 3 /* RIGHT */ ? 1 /* DOWN */ : 3 /* RIGHT */;
    };
    SplitEditorOrthogonalAction.ID = 'workbench.action.splitEditorOrthogonal';
    SplitEditorOrthogonalAction.LABEL = nls.localize('splitEditorOrthogonal', "Split Editor Orthogonal");
    SplitEditorOrthogonalAction = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IConfigurationService)
    ], SplitEditorOrthogonalAction);
    return SplitEditorOrthogonalAction;
}(BaseSplitEditorAction));
export { SplitEditorOrthogonalAction };
var SplitEditorLeftAction = /** @class */ (function (_super) {
    __extends(SplitEditorLeftAction, _super);
    function SplitEditorLeftAction(id, label, commandService) {
        return _super.call(this, id, label, SPLIT_EDITOR_LEFT, commandService) || this;
    }
    SplitEditorLeftAction.ID = SPLIT_EDITOR_LEFT;
    SplitEditorLeftAction.LABEL = nls.localize('splitEditorGroupLeft', "Split Editor Left");
    SplitEditorLeftAction = __decorate([
        __param(2, ICommandService)
    ], SplitEditorLeftAction);
    return SplitEditorLeftAction;
}(ExecuteCommandAction));
export { SplitEditorLeftAction };
var SplitEditorRightAction = /** @class */ (function (_super) {
    __extends(SplitEditorRightAction, _super);
    function SplitEditorRightAction(id, label, commandService) {
        return _super.call(this, id, label, SPLIT_EDITOR_RIGHT, commandService) || this;
    }
    SplitEditorRightAction.ID = SPLIT_EDITOR_RIGHT;
    SplitEditorRightAction.LABEL = nls.localize('splitEditorGroupRight', "Split Editor Right");
    SplitEditorRightAction = __decorate([
        __param(2, ICommandService)
    ], SplitEditorRightAction);
    return SplitEditorRightAction;
}(ExecuteCommandAction));
export { SplitEditorRightAction };
var SplitEditorUpAction = /** @class */ (function (_super) {
    __extends(SplitEditorUpAction, _super);
    function SplitEditorUpAction(id, label, commandService) {
        return _super.call(this, id, label, SPLIT_EDITOR_UP, commandService) || this;
    }
    SplitEditorUpAction.ID = SPLIT_EDITOR_UP;
    SplitEditorUpAction.LABEL = nls.localize('splitEditorGroupUp', "Split Editor Up");
    SplitEditorUpAction = __decorate([
        __param(2, ICommandService)
    ], SplitEditorUpAction);
    return SplitEditorUpAction;
}(ExecuteCommandAction));
export { SplitEditorUpAction };
var SplitEditorDownAction = /** @class */ (function (_super) {
    __extends(SplitEditorDownAction, _super);
    function SplitEditorDownAction(id, label, commandService) {
        return _super.call(this, id, label, SPLIT_EDITOR_DOWN, commandService) || this;
    }
    SplitEditorDownAction.ID = SPLIT_EDITOR_DOWN;
    SplitEditorDownAction.LABEL = nls.localize('splitEditorGroupDown', "Split Editor Down");
    SplitEditorDownAction = __decorate([
        __param(2, ICommandService)
    ], SplitEditorDownAction);
    return SplitEditorDownAction;
}(ExecuteCommandAction));
export { SplitEditorDownAction };
var JoinTwoGroupsAction = /** @class */ (function (_super) {
    __extends(JoinTwoGroupsAction, _super);
    function JoinTwoGroupsAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    JoinTwoGroupsAction.prototype.run = function (context) {
        var sourceGroup;
        if (context && typeof context.groupId === 'number') {
            sourceGroup = this.editorGroupService.getGroup(context.groupId);
        }
        else {
            sourceGroup = this.editorGroupService.activeGroup;
        }
        var targetGroupDirections = [3 /* RIGHT */, 1 /* DOWN */, 2 /* LEFT */, 0 /* UP */];
        for (var i = 0; i < targetGroupDirections.length; i++) {
            var targetGroup = this.editorGroupService.findGroup({ direction: targetGroupDirections[i] }, sourceGroup);
            if (targetGroup && sourceGroup !== targetGroup) {
                this.editorGroupService.mergeGroup(sourceGroup, targetGroup);
                return TPromise.as(true);
            }
        }
        return TPromise.as(true);
    };
    JoinTwoGroupsAction.ID = 'workbench.action.joinTwoGroups';
    JoinTwoGroupsAction.LABEL = nls.localize('joinTwoGroups', "Join Editor Group with Next Group");
    JoinTwoGroupsAction = __decorate([
        __param(2, IEditorGroupsService)
    ], JoinTwoGroupsAction);
    return JoinTwoGroupsAction;
}(Action));
export { JoinTwoGroupsAction };
var JoinAllGroupsAction = /** @class */ (function (_super) {
    __extends(JoinAllGroupsAction, _super);
    function JoinAllGroupsAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    JoinAllGroupsAction.prototype.run = function (context) {
        mergeAllGroups(this.editorGroupService);
        return TPromise.as(true);
    };
    JoinAllGroupsAction.ID = 'workbench.action.joinAllGroups';
    JoinAllGroupsAction.LABEL = nls.localize('joinAllGroups', "Join All Editor Groups");
    JoinAllGroupsAction = __decorate([
        __param(2, IEditorGroupsService)
    ], JoinAllGroupsAction);
    return JoinAllGroupsAction;
}(Action));
export { JoinAllGroupsAction };
var NavigateBetweenGroupsAction = /** @class */ (function (_super) {
    __extends(NavigateBetweenGroupsAction, _super);
    function NavigateBetweenGroupsAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    NavigateBetweenGroupsAction.prototype.run = function () {
        var nextGroup = this.editorGroupService.findGroup({ location: 2 /* NEXT */ }, this.editorGroupService.activeGroup, true);
        nextGroup.focus();
        return TPromise.as(true);
    };
    NavigateBetweenGroupsAction.ID = 'workbench.action.navigateEditorGroups';
    NavigateBetweenGroupsAction.LABEL = nls.localize('navigateEditorGroups', "Navigate Between Editor Groups");
    NavigateBetweenGroupsAction = __decorate([
        __param(2, IEditorGroupsService)
    ], NavigateBetweenGroupsAction);
    return NavigateBetweenGroupsAction;
}(Action));
export { NavigateBetweenGroupsAction };
var FocusActiveGroupAction = /** @class */ (function (_super) {
    __extends(FocusActiveGroupAction, _super);
    function FocusActiveGroupAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    FocusActiveGroupAction.prototype.run = function () {
        this.editorGroupService.activeGroup.focus();
        return TPromise.as(true);
    };
    FocusActiveGroupAction.ID = 'workbench.action.focusActiveEditorGroup';
    FocusActiveGroupAction.LABEL = nls.localize('focusActiveEditorGroup', "Focus Active Editor Group");
    FocusActiveGroupAction = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusActiveGroupAction);
    return FocusActiveGroupAction;
}(Action));
export { FocusActiveGroupAction };
var BaseFocusGroupAction = /** @class */ (function (_super) {
    __extends(BaseFocusGroupAction, _super);
    function BaseFocusGroupAction(id, label, scope, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.scope = scope;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    BaseFocusGroupAction.prototype.run = function () {
        var group = this.editorGroupService.findGroup(this.scope, this.editorGroupService.activeGroup, true);
        if (group) {
            group.focus();
        }
        return TPromise.as(true);
    };
    BaseFocusGroupAction = __decorate([
        __param(3, IEditorGroupsService)
    ], BaseFocusGroupAction);
    return BaseFocusGroupAction;
}(Action));
export { BaseFocusGroupAction };
var FocusFirstGroupAction = /** @class */ (function (_super) {
    __extends(FocusFirstGroupAction, _super);
    function FocusFirstGroupAction(id, label, editorGroupService) {
        return _super.call(this, id, label, { location: 0 /* FIRST */ }, editorGroupService) || this;
    }
    FocusFirstGroupAction.ID = 'workbench.action.focusFirstEditorGroup';
    FocusFirstGroupAction.LABEL = nls.localize('focusFirstEditorGroup', "Focus First Editor Group");
    FocusFirstGroupAction = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusFirstGroupAction);
    return FocusFirstGroupAction;
}(BaseFocusGroupAction));
export { FocusFirstGroupAction };
var FocusLastGroupAction = /** @class */ (function (_super) {
    __extends(FocusLastGroupAction, _super);
    function FocusLastGroupAction(id, label, editorGroupService) {
        return _super.call(this, id, label, { location: 1 /* LAST */ }, editorGroupService) || this;
    }
    FocusLastGroupAction.ID = 'workbench.action.focusLastEditorGroup';
    FocusLastGroupAction.LABEL = nls.localize('focusLastEditorGroup', "Focus Last Editor Group");
    FocusLastGroupAction = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusLastGroupAction);
    return FocusLastGroupAction;
}(BaseFocusGroupAction));
export { FocusLastGroupAction };
var FocusNextGroup = /** @class */ (function (_super) {
    __extends(FocusNextGroup, _super);
    function FocusNextGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { location: 2 /* NEXT */ }, editorGroupService) || this;
    }
    FocusNextGroup.ID = 'workbench.action.focusNextGroup';
    FocusNextGroup.LABEL = nls.localize('focusNextGroup', "Focus Next Editor Group");
    FocusNextGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusNextGroup);
    return FocusNextGroup;
}(BaseFocusGroupAction));
export { FocusNextGroup };
var FocusPreviousGroup = /** @class */ (function (_super) {
    __extends(FocusPreviousGroup, _super);
    function FocusPreviousGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { location: 3 /* PREVIOUS */ }, editorGroupService) || this;
    }
    FocusPreviousGroup.ID = 'workbench.action.focusPreviousGroup';
    FocusPreviousGroup.LABEL = nls.localize('focusPreviousGroup', "Focus Previous Editor Group");
    FocusPreviousGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusPreviousGroup);
    return FocusPreviousGroup;
}(BaseFocusGroupAction));
export { FocusPreviousGroup };
var FocusLeftGroup = /** @class */ (function (_super) {
    __extends(FocusLeftGroup, _super);
    function FocusLeftGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { direction: 2 /* LEFT */ }, editorGroupService) || this;
    }
    FocusLeftGroup.ID = 'workbench.action.focusLeftGroup';
    FocusLeftGroup.LABEL = nls.localize('focusLeftGroup', "Focus Left Editor Group");
    FocusLeftGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusLeftGroup);
    return FocusLeftGroup;
}(BaseFocusGroupAction));
export { FocusLeftGroup };
var FocusRightGroup = /** @class */ (function (_super) {
    __extends(FocusRightGroup, _super);
    function FocusRightGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { direction: 3 /* RIGHT */ }, editorGroupService) || this;
    }
    FocusRightGroup.ID = 'workbench.action.focusRightGroup';
    FocusRightGroup.LABEL = nls.localize('focusRightGroup', "Focus Right Editor Group");
    FocusRightGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusRightGroup);
    return FocusRightGroup;
}(BaseFocusGroupAction));
export { FocusRightGroup };
var FocusAboveGroup = /** @class */ (function (_super) {
    __extends(FocusAboveGroup, _super);
    function FocusAboveGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { direction: 0 /* UP */ }, editorGroupService) || this;
    }
    FocusAboveGroup.ID = 'workbench.action.focusAboveGroup';
    FocusAboveGroup.LABEL = nls.localize('focusAboveGroup', "Focus Above Editor Group");
    FocusAboveGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusAboveGroup);
    return FocusAboveGroup;
}(BaseFocusGroupAction));
export { FocusAboveGroup };
var FocusBelowGroup = /** @class */ (function (_super) {
    __extends(FocusBelowGroup, _super);
    function FocusBelowGroup(id, label, editorGroupService) {
        return _super.call(this, id, label, { direction: 1 /* DOWN */ }, editorGroupService) || this;
    }
    FocusBelowGroup.ID = 'workbench.action.focusBelowGroup';
    FocusBelowGroup.LABEL = nls.localize('focusBelowGroup', "Focus Below Editor Group");
    FocusBelowGroup = __decorate([
        __param(2, IEditorGroupsService)
    ], FocusBelowGroup);
    return FocusBelowGroup;
}(BaseFocusGroupAction));
export { FocusBelowGroup };
var OpenToSideFromQuickOpenAction = /** @class */ (function (_super) {
    __extends(OpenToSideFromQuickOpenAction, _super);
    function OpenToSideFromQuickOpenAction(editorService, configurationService) {
        var _this = _super.call(this, OpenToSideFromQuickOpenAction.OPEN_TO_SIDE_ID, OpenToSideFromQuickOpenAction.OPEN_TO_SIDE_LABEL) || this;
        _this.editorService = editorService;
        _this.configurationService = configurationService;
        _this.updateClass();
        return _this;
    }
    OpenToSideFromQuickOpenAction.prototype.updateClass = function () {
        var preferredDirection = preferredSideBySideGroupDirection(this.configurationService);
        this.class = (preferredDirection === 3 /* RIGHT */) ? 'quick-open-sidebyside-vertical' : 'quick-open-sidebyside-horizontal';
    };
    OpenToSideFromQuickOpenAction.prototype.run = function (context) {
        var entry = toEditorQuickOpenEntry(context);
        if (entry) {
            var input = entry.getInput();
            if (input instanceof EditorInput) {
                return this.editorService.openEditor(input, entry.getOptions(), SIDE_GROUP);
            }
            var resourceInput = input;
            resourceInput.options = mixin(resourceInput.options, entry.getOptions());
            return this.editorService.openEditor(resourceInput, SIDE_GROUP);
        }
        return TPromise.as(false);
    };
    OpenToSideFromQuickOpenAction.OPEN_TO_SIDE_ID = 'workbench.action.openToSide';
    OpenToSideFromQuickOpenAction.OPEN_TO_SIDE_LABEL = nls.localize('openToSide', "Open to the Side");
    OpenToSideFromQuickOpenAction = __decorate([
        __param(0, IEditorService),
        __param(1, IConfigurationService)
    ], OpenToSideFromQuickOpenAction);
    return OpenToSideFromQuickOpenAction;
}(Action));
export { OpenToSideFromQuickOpenAction };
export function toEditorQuickOpenEntry(element) {
    // QuickOpenEntryGroup
    if (element instanceof QuickOpenEntryGroup) {
        var group = element;
        if (group.getEntry()) {
            element = group.getEntry();
        }
    }
    // EditorQuickOpenEntry or EditorQuickOpenEntryGroup both implement IEditorQuickOpenEntry
    if (element instanceof EditorQuickOpenEntry || element instanceof EditorQuickOpenEntryGroup) {
        return element;
    }
    return null;
}
var CloseEditorAction = /** @class */ (function (_super) {
    __extends(CloseEditorAction, _super);
    function CloseEditorAction(id, label, commandService) {
        var _this = _super.call(this, id, label, 'close-editor-action') || this;
        _this.commandService = commandService;
        return _this;
    }
    CloseEditorAction.prototype.run = function (context) {
        return this.commandService.executeCommand(CLOSE_EDITOR_COMMAND_ID, void 0, context);
    };
    CloseEditorAction.ID = 'workbench.action.closeActiveEditor';
    CloseEditorAction.LABEL = nls.localize('closeEditor', "Close Editor");
    CloseEditorAction = __decorate([
        __param(2, ICommandService)
    ], CloseEditorAction);
    return CloseEditorAction;
}(Action));
export { CloseEditorAction };
var CloseOneEditorAction = /** @class */ (function (_super) {
    __extends(CloseOneEditorAction, _super);
    function CloseOneEditorAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label, 'close-editor-action') || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    CloseOneEditorAction.prototype.run = function (context) {
        var group;
        var editorIndex;
        if (context) {
            group = this.editorGroupService.getGroup(context.groupId);
            if (group) {
                editorIndex = context.editorIndex; // only allow editor at index if group is valid
            }
        }
        if (!group) {
            group = this.editorGroupService.activeGroup;
        }
        // Close specific editor in group
        if (typeof editorIndex === 'number') {
            var editorAtIndex = group.getEditor(editorIndex);
            if (editorAtIndex) {
                return group.closeEditor(editorAtIndex);
            }
        }
        // Otherwise close active editor in group
        if (group.activeEditor) {
            return group.closeEditor(group.activeEditor);
        }
        return TPromise.as(false);
    };
    CloseOneEditorAction.ID = 'workbench.action.closeActiveEditor';
    CloseOneEditorAction.LABEL = nls.localize('closeOneEditor', "Close");
    CloseOneEditorAction = __decorate([
        __param(2, IEditorGroupsService)
    ], CloseOneEditorAction);
    return CloseOneEditorAction;
}(Action));
export { CloseOneEditorAction };
var RevertAndCloseEditorAction = /** @class */ (function (_super) {
    __extends(RevertAndCloseEditorAction, _super);
    function RevertAndCloseEditorAction(id, label, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        return _this;
    }
    RevertAndCloseEditorAction.prototype.run = function () {
        var activeControl = this.editorService.activeControl;
        if (activeControl) {
            var editor_1 = activeControl.input;
            var group_1 = activeControl.group;
            // first try a normal revert where the contents of the editor are restored
            return editor_1.revert().then(function () { return group_1.closeEditor(editor_1); }, function (error) {
                // if that fails, since we are about to close the editor, we accept that
                // the editor cannot be reverted and instead do a soft revert that just
                // enables us to close the editor. With this, a user can always close a
                // dirty editor even when reverting fails.
                return editor_1.revert({ soft: true }).then(function () { return group_1.closeEditor(editor_1); });
            });
        }
        return TPromise.as(false);
    };
    RevertAndCloseEditorAction.ID = 'workbench.action.revertAndCloseActiveEditor';
    RevertAndCloseEditorAction.LABEL = nls.localize('revertAndCloseActiveEditor', "Revert and Close Editor");
    RevertAndCloseEditorAction = __decorate([
        __param(2, IEditorService)
    ], RevertAndCloseEditorAction);
    return RevertAndCloseEditorAction;
}(Action));
export { RevertAndCloseEditorAction };
var CloseLeftEditorsInGroupAction = /** @class */ (function (_super) {
    __extends(CloseLeftEditorsInGroupAction, _super);
    function CloseLeftEditorsInGroupAction(id, label, editorService, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    CloseLeftEditorsInGroupAction.prototype.run = function (context) {
        var _a = getTarget(this.editorService, this.editorGroupService, context), group = _a.group, editor = _a.editor;
        if (group && editor) {
            return group.closeEditors({ direction: 0 /* LEFT */, except: editor });
        }
        return TPromise.as(false);
    };
    CloseLeftEditorsInGroupAction.ID = 'workbench.action.closeEditorsToTheLeft';
    CloseLeftEditorsInGroupAction.LABEL = nls.localize('closeEditorsToTheLeft', "Close Editors to the Left in Group");
    CloseLeftEditorsInGroupAction = __decorate([
        __param(2, IEditorService),
        __param(3, IEditorGroupsService)
    ], CloseLeftEditorsInGroupAction);
    return CloseLeftEditorsInGroupAction;
}(Action));
export { CloseLeftEditorsInGroupAction };
function getTarget(editorService, editorGroupService, context) {
    if (context) {
        return { editor: context.editor, group: editorGroupService.getGroup(context.groupId) };
    }
    // Fallback to active group
    return { group: editorGroupService.activeGroup, editor: editorGroupService.activeGroup.activeEditor };
}
var BaseCloseAllAction = /** @class */ (function (_super) {
    __extends(BaseCloseAllAction, _super);
    function BaseCloseAllAction(id, label, clazz, textFileService, editorGroupService) {
        var _this = _super.call(this, id, label, clazz) || this;
        _this.textFileService = textFileService;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    Object.defineProperty(BaseCloseAllAction.prototype, "groupsToClose", {
        get: function () {
            var groupsToClose = [];
            // Close editors in reverse order of their grid appearance so that the editor
            // group that is the first (top-left) remains. This helps to keep view state
            // for editors around that have been opened in this visually first group.
            var groups = this.editorGroupService.getGroups(2 /* GRID_APPEARANCE */);
            for (var i = groups.length - 1; i >= 0; i--) {
                groupsToClose.push(groups[i]);
            }
            return groupsToClose;
        },
        enumerable: true,
        configurable: true
    });
    BaseCloseAllAction.prototype.run = function () {
        var _this = this;
        // Just close all if there are no or one dirty editor
        if (this.textFileService.getDirty().length < 2) {
            return this.doCloseAll();
        }
        // Otherwise ask for combined confirmation
        return this.textFileService.confirmSave().then(function (confirm) {
            if (confirm === 2 /* CANCEL */) {
                return void 0;
            }
            var saveOrRevertPromise;
            if (confirm === 1 /* DONT_SAVE */) {
                saveOrRevertPromise = _this.textFileService.revertAll(null, { soft: true }).then(function () { return true; });
            }
            else {
                saveOrRevertPromise = _this.textFileService.saveAll(true).then(function (res) { return res.results.every(function (r) { return r.success; }); });
            }
            return saveOrRevertPromise.then(function (success) {
                if (success) {
                    return _this.doCloseAll();
                }
                return void 0;
            });
        });
    };
    return BaseCloseAllAction;
}(Action));
export { BaseCloseAllAction };
var CloseAllEditorsAction = /** @class */ (function (_super) {
    __extends(CloseAllEditorsAction, _super);
    function CloseAllEditorsAction(id, label, textFileService, editorGroupService) {
        return _super.call(this, id, label, 'action-close-all-files', textFileService, editorGroupService) || this;
    }
    CloseAllEditorsAction.prototype.doCloseAll = function () {
        return Promise.all(this.groupsToClose.map(function (g) { return g.closeAllEditors(); }));
    };
    CloseAllEditorsAction.ID = 'workbench.action.closeAllEditors';
    CloseAllEditorsAction.LABEL = nls.localize('closeAllEditors', "Close All Editors");
    CloseAllEditorsAction = __decorate([
        __param(2, ITextFileService),
        __param(3, IEditorGroupsService)
    ], CloseAllEditorsAction);
    return CloseAllEditorsAction;
}(BaseCloseAllAction));
export { CloseAllEditorsAction };
var CloseAllEditorGroupsAction = /** @class */ (function (_super) {
    __extends(CloseAllEditorGroupsAction, _super);
    function CloseAllEditorGroupsAction(id, label, textFileService, editorGroupService) {
        return _super.call(this, id, label, void 0, textFileService, editorGroupService) || this;
    }
    CloseAllEditorGroupsAction.prototype.doCloseAll = function () {
        var _this = this;
        return Promise.all(this.groupsToClose.map(function (g) { return g.closeAllEditors(); })).then(function () {
            _this.groupsToClose.forEach(function (group) { return _this.editorGroupService.removeGroup(group); });
        });
    };
    CloseAllEditorGroupsAction.ID = 'workbench.action.closeAllGroups';
    CloseAllEditorGroupsAction.LABEL = nls.localize('closeAllGroups', "Close All Editor Groups");
    CloseAllEditorGroupsAction = __decorate([
        __param(2, ITextFileService),
        __param(3, IEditorGroupsService)
    ], CloseAllEditorGroupsAction);
    return CloseAllEditorGroupsAction;
}(BaseCloseAllAction));
export { CloseAllEditorGroupsAction };
var CloseEditorsInOtherGroupsAction = /** @class */ (function (_super) {
    __extends(CloseEditorsInOtherGroupsAction, _super);
    function CloseEditorsInOtherGroupsAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    CloseEditorsInOtherGroupsAction.prototype.run = function (context) {
        var groupToSkip = context ? this.editorGroupService.getGroup(context.groupId) : this.editorGroupService.activeGroup;
        return Promise.all(this.editorGroupService.getGroups(1 /* MOST_RECENTLY_ACTIVE */).map(function (g) {
            if (g.id === groupToSkip.id) {
                return TPromise.as(null);
            }
            return g.closeAllEditors();
        }));
    };
    CloseEditorsInOtherGroupsAction.ID = 'workbench.action.closeEditorsInOtherGroups';
    CloseEditorsInOtherGroupsAction.LABEL = nls.localize('closeEditorsInOtherGroups', "Close Editors in Other Groups");
    CloseEditorsInOtherGroupsAction = __decorate([
        __param(2, IEditorGroupsService)
    ], CloseEditorsInOtherGroupsAction);
    return CloseEditorsInOtherGroupsAction;
}(Action));
export { CloseEditorsInOtherGroupsAction };
var CloseEditorInAllGroupsAction = /** @class */ (function (_super) {
    __extends(CloseEditorInAllGroupsAction, _super);
    function CloseEditorInAllGroupsAction(id, label, editorGroupService, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        _this.editorService = editorService;
        return _this;
    }
    CloseEditorInAllGroupsAction.prototype.run = function () {
        var activeEditor = this.editorService.activeEditor;
        if (activeEditor) {
            return Promise.all(this.editorGroupService.getGroups(1 /* MOST_RECENTLY_ACTIVE */).map(function (g) { return g.closeEditor(activeEditor); }));
        }
        return TPromise.as(null);
    };
    CloseEditorInAllGroupsAction.ID = 'workbench.action.closeEditorInAllGroups';
    CloseEditorInAllGroupsAction.LABEL = nls.localize('closeEditorInAllGroups', "Close Editor in All Groups");
    CloseEditorInAllGroupsAction = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], CloseEditorInAllGroupsAction);
    return CloseEditorInAllGroupsAction;
}(Action));
export { CloseEditorInAllGroupsAction };
var BaseMoveGroupAction = /** @class */ (function (_super) {
    __extends(BaseMoveGroupAction, _super);
    function BaseMoveGroupAction(id, label, direction, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.direction = direction;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    BaseMoveGroupAction.prototype.run = function (context) {
        var sourceGroup;
        if (context && typeof context.groupId === 'number') {
            sourceGroup = this.editorGroupService.getGroup(context.groupId);
        }
        else {
            sourceGroup = this.editorGroupService.activeGroup;
        }
        var targetGroup = this.findTargetGroup(sourceGroup);
        if (targetGroup) {
            this.editorGroupService.moveGroup(sourceGroup, targetGroup, this.direction);
        }
        return TPromise.as(true);
    };
    BaseMoveGroupAction.prototype.findTargetGroup = function (sourceGroup) {
        var targetNeighbours = [this.direction];
        // Allow the target group to be in alternative locations to support more
        // scenarios of moving the group to the taret location.
        // Helps for https://github.com/Microsoft/vscode/issues/50741
        switch (this.direction) {
            case 2 /* LEFT */:
            case 3 /* RIGHT */:
                targetNeighbours.push(0 /* UP */, 1 /* DOWN */);
                break;
            case 0 /* UP */:
            case 1 /* DOWN */:
                targetNeighbours.push(2 /* LEFT */, 3 /* RIGHT */);
                break;
        }
        for (var i = 0; i < targetNeighbours.length; i++) {
            var targetNeighbour = this.editorGroupService.findGroup({ direction: targetNeighbours[i] }, sourceGroup);
            if (targetNeighbour) {
                return targetNeighbour;
            }
        }
        return void 0;
    };
    return BaseMoveGroupAction;
}(Action));
export { BaseMoveGroupAction };
var MoveGroupLeftAction = /** @class */ (function (_super) {
    __extends(MoveGroupLeftAction, _super);
    function MoveGroupLeftAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 2 /* LEFT */, editorGroupService) || this;
    }
    MoveGroupLeftAction.ID = 'workbench.action.moveActiveEditorGroupLeft';
    MoveGroupLeftAction.LABEL = nls.localize('moveActiveGroupLeft', "Move Editor Group Left");
    MoveGroupLeftAction = __decorate([
        __param(2, IEditorGroupsService)
    ], MoveGroupLeftAction);
    return MoveGroupLeftAction;
}(BaseMoveGroupAction));
export { MoveGroupLeftAction };
var MoveGroupRightAction = /** @class */ (function (_super) {
    __extends(MoveGroupRightAction, _super);
    function MoveGroupRightAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 3 /* RIGHT */, editorGroupService) || this;
    }
    MoveGroupRightAction.ID = 'workbench.action.moveActiveEditorGroupRight';
    MoveGroupRightAction.LABEL = nls.localize('moveActiveGroupRight', "Move Editor Group Right");
    MoveGroupRightAction = __decorate([
        __param(2, IEditorGroupsService)
    ], MoveGroupRightAction);
    return MoveGroupRightAction;
}(BaseMoveGroupAction));
export { MoveGroupRightAction };
var MoveGroupUpAction = /** @class */ (function (_super) {
    __extends(MoveGroupUpAction, _super);
    function MoveGroupUpAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 0 /* UP */, editorGroupService) || this;
    }
    MoveGroupUpAction.ID = 'workbench.action.moveActiveEditorGroupUp';
    MoveGroupUpAction.LABEL = nls.localize('moveActiveGroupUp', "Move Editor Group Up");
    MoveGroupUpAction = __decorate([
        __param(2, IEditorGroupsService)
    ], MoveGroupUpAction);
    return MoveGroupUpAction;
}(BaseMoveGroupAction));
export { MoveGroupUpAction };
var MoveGroupDownAction = /** @class */ (function (_super) {
    __extends(MoveGroupDownAction, _super);
    function MoveGroupDownAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 1 /* DOWN */, editorGroupService) || this;
    }
    MoveGroupDownAction.ID = 'workbench.action.moveActiveEditorGroupDown';
    MoveGroupDownAction.LABEL = nls.localize('moveActiveGroupDown', "Move Editor Group Down");
    MoveGroupDownAction = __decorate([
        __param(2, IEditorGroupsService)
    ], MoveGroupDownAction);
    return MoveGroupDownAction;
}(BaseMoveGroupAction));
export { MoveGroupDownAction };
var MinimizeOtherGroupsAction = /** @class */ (function (_super) {
    __extends(MinimizeOtherGroupsAction, _super);
    function MinimizeOtherGroupsAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    MinimizeOtherGroupsAction.prototype.run = function () {
        this.editorGroupService.arrangeGroups(0 /* MINIMIZE_OTHERS */);
        return TPromise.as(false);
    };
    MinimizeOtherGroupsAction.ID = 'workbench.action.minimizeOtherEditors';
    MinimizeOtherGroupsAction.LABEL = nls.localize('minimizeOtherEditorGroups', "Maximize Editor Group");
    MinimizeOtherGroupsAction = __decorate([
        __param(2, IEditorGroupsService)
    ], MinimizeOtherGroupsAction);
    return MinimizeOtherGroupsAction;
}(Action));
export { MinimizeOtherGroupsAction };
var ResetGroupSizesAction = /** @class */ (function (_super) {
    __extends(ResetGroupSizesAction, _super);
    function ResetGroupSizesAction(id, label, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    ResetGroupSizesAction.prototype.run = function () {
        this.editorGroupService.arrangeGroups(1 /* EVEN */);
        return TPromise.as(false);
    };
    ResetGroupSizesAction.ID = 'workbench.action.evenEditorWidths';
    ResetGroupSizesAction.LABEL = nls.localize('evenEditorGroups', "Reset Editor Group Sizes");
    ResetGroupSizesAction = __decorate([
        __param(2, IEditorGroupsService)
    ], ResetGroupSizesAction);
    return ResetGroupSizesAction;
}(Action));
export { ResetGroupSizesAction };
var MaximizeGroupAction = /** @class */ (function (_super) {
    __extends(MaximizeGroupAction, _super);
    function MaximizeGroupAction(id, label, editorService, editorGroupService, partService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.partService = partService;
        return _this;
    }
    MaximizeGroupAction.prototype.run = function () {
        if (this.editorService.activeEditor) {
            this.editorGroupService.arrangeGroups(0 /* MINIMIZE_OTHERS */);
            return this.partService.setSideBarHidden(true);
        }
        return TPromise.as(false);
    };
    MaximizeGroupAction.ID = 'workbench.action.maximizeEditor';
    MaximizeGroupAction.LABEL = nls.localize('maximizeEditor', "Maximize Editor Group and Hide Sidebar");
    MaximizeGroupAction = __decorate([
        __param(2, IEditorService),
        __param(3, IEditorGroupsService),
        __param(4, IPartService)
    ], MaximizeGroupAction);
    return MaximizeGroupAction;
}(Action));
export { MaximizeGroupAction };
var BaseNavigateEditorAction = /** @class */ (function (_super) {
    __extends(BaseNavigateEditorAction, _super);
    function BaseNavigateEditorAction(id, label, editorGroupService, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorGroupService = editorGroupService;
        _this.editorService = editorService;
        return _this;
    }
    BaseNavigateEditorAction.prototype.run = function () {
        var result = this.navigate();
        if (!result) {
            return TPromise.as(false);
        }
        var groupId = result.groupId, editor = result.editor;
        if (!editor) {
            return TPromise.as(false);
        }
        var group = this.editorGroupService.getGroup(groupId);
        return group.openEditor(editor);
    };
    return BaseNavigateEditorAction;
}(Action));
export { BaseNavigateEditorAction };
var OpenNextEditor = /** @class */ (function (_super) {
    __extends(OpenNextEditor, _super);
    function OpenNextEditor(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenNextEditor.prototype.navigate = function () {
        // Navigate in active group if possible
        var activeGroup = this.editorGroupService.activeGroup;
        var activeGroupEditors = activeGroup.getEditors(1 /* SEQUENTIAL */);
        var activeEditorIndex = activeGroupEditors.indexOf(activeGroup.activeEditor);
        if (activeEditorIndex + 1 < activeGroupEditors.length) {
            return { editor: activeGroupEditors[activeEditorIndex + 1], groupId: activeGroup.id };
        }
        // Otherwise try in next group
        var nextGroup = this.editorGroupService.findGroup({ location: 2 /* NEXT */ }, this.editorGroupService.activeGroup, true);
        if (nextGroup) {
            var previousGroupEditors = nextGroup.getEditors(1 /* SEQUENTIAL */);
            return { editor: previousGroupEditors[0], groupId: nextGroup.id };
        }
        return void 0;
    };
    OpenNextEditor.ID = 'workbench.action.nextEditor';
    OpenNextEditor.LABEL = nls.localize('openNextEditor', "Open Next Editor");
    OpenNextEditor = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenNextEditor);
    return OpenNextEditor;
}(BaseNavigateEditorAction));
export { OpenNextEditor };
var OpenPreviousEditor = /** @class */ (function (_super) {
    __extends(OpenPreviousEditor, _super);
    function OpenPreviousEditor(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenPreviousEditor.prototype.navigate = function () {
        // Navigate in active group if possible
        var activeGroup = this.editorGroupService.activeGroup;
        var activeGroupEditors = activeGroup.getEditors(1 /* SEQUENTIAL */);
        var activeEditorIndex = activeGroupEditors.indexOf(activeGroup.activeEditor);
        if (activeEditorIndex > 0) {
            return { editor: activeGroupEditors[activeEditorIndex - 1], groupId: activeGroup.id };
        }
        // Otherwise try in previous group
        var previousGroup = this.editorGroupService.findGroup({ location: 3 /* PREVIOUS */ }, this.editorGroupService.activeGroup, true);
        if (previousGroup) {
            var previousGroupEditors = previousGroup.getEditors(1 /* SEQUENTIAL */);
            return { editor: previousGroupEditors[previousGroupEditors.length - 1], groupId: previousGroup.id };
        }
        return void 0;
    };
    OpenPreviousEditor.ID = 'workbench.action.previousEditor';
    OpenPreviousEditor.LABEL = nls.localize('openPreviousEditor', "Open Previous Editor");
    OpenPreviousEditor = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenPreviousEditor);
    return OpenPreviousEditor;
}(BaseNavigateEditorAction));
export { OpenPreviousEditor };
var OpenNextEditorInGroup = /** @class */ (function (_super) {
    __extends(OpenNextEditorInGroup, _super);
    function OpenNextEditorInGroup(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenNextEditorInGroup.prototype.navigate = function () {
        var group = this.editorGroupService.activeGroup;
        var editors = group.getEditors(1 /* SEQUENTIAL */);
        var index = editors.indexOf(group.activeEditor);
        return { editor: index + 1 < editors.length ? editors[index + 1] : editors[0], groupId: group.id };
    };
    OpenNextEditorInGroup.ID = 'workbench.action.nextEditorInGroup';
    OpenNextEditorInGroup.LABEL = nls.localize('nextEditorInGroup', "Open Next Editor in Group");
    OpenNextEditorInGroup = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenNextEditorInGroup);
    return OpenNextEditorInGroup;
}(BaseNavigateEditorAction));
export { OpenNextEditorInGroup };
var OpenPreviousEditorInGroup = /** @class */ (function (_super) {
    __extends(OpenPreviousEditorInGroup, _super);
    function OpenPreviousEditorInGroup(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenPreviousEditorInGroup.prototype.navigate = function () {
        var group = this.editorGroupService.activeGroup;
        var editors = group.getEditors(1 /* SEQUENTIAL */);
        var index = editors.indexOf(group.activeEditor);
        return { editor: index > 0 ? editors[index - 1] : editors[editors.length - 1], groupId: group.id };
    };
    OpenPreviousEditorInGroup.ID = 'workbench.action.previousEditorInGroup';
    OpenPreviousEditorInGroup.LABEL = nls.localize('openPreviousEditorInGroup', "Open Previous Editor in Group");
    OpenPreviousEditorInGroup = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenPreviousEditorInGroup);
    return OpenPreviousEditorInGroup;
}(BaseNavigateEditorAction));
export { OpenPreviousEditorInGroup };
var OpenFirstEditorInGroup = /** @class */ (function (_super) {
    __extends(OpenFirstEditorInGroup, _super);
    function OpenFirstEditorInGroup(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenFirstEditorInGroup.prototype.navigate = function () {
        var group = this.editorGroupService.activeGroup;
        var editors = group.getEditors(1 /* SEQUENTIAL */);
        return { editor: editors[0], groupId: group.id };
    };
    OpenFirstEditorInGroup.ID = 'workbench.action.firstEditorInGroup';
    OpenFirstEditorInGroup.LABEL = nls.localize('firstEditorInGroup', "Open First Editor in Group");
    OpenFirstEditorInGroup = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenFirstEditorInGroup);
    return OpenFirstEditorInGroup;
}(BaseNavigateEditorAction));
export { OpenFirstEditorInGroup };
var OpenLastEditorInGroup = /** @class */ (function (_super) {
    __extends(OpenLastEditorInGroup, _super);
    function OpenLastEditorInGroup(id, label, editorGroupService, editorService) {
        return _super.call(this, id, label, editorGroupService, editorService) || this;
    }
    OpenLastEditorInGroup.prototype.navigate = function () {
        var group = this.editorGroupService.activeGroup;
        var editors = group.getEditors(1 /* SEQUENTIAL */);
        return { editor: editors[editors.length - 1], groupId: group.id };
    };
    OpenLastEditorInGroup.ID = 'workbench.action.lastEditorInGroup';
    OpenLastEditorInGroup.LABEL = nls.localize('lastEditorInGroup', "Open Last Editor in Group");
    OpenLastEditorInGroup = __decorate([
        __param(2, IEditorGroupsService),
        __param(3, IEditorService)
    ], OpenLastEditorInGroup);
    return OpenLastEditorInGroup;
}(BaseNavigateEditorAction));
export { OpenLastEditorInGroup };
var NavigateForwardAction = /** @class */ (function (_super) {
    __extends(NavigateForwardAction, _super);
    function NavigateForwardAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    NavigateForwardAction.prototype.run = function () {
        this.historyService.forward();
        return TPromise.as(null);
    };
    NavigateForwardAction.ID = 'workbench.action.navigateForward';
    NavigateForwardAction.LABEL = nls.localize('navigateNext', "Go Forward");
    NavigateForwardAction = __decorate([
        __param(2, IHistoryService)
    ], NavigateForwardAction);
    return NavigateForwardAction;
}(Action));
export { NavigateForwardAction };
var NavigateBackwardsAction = /** @class */ (function (_super) {
    __extends(NavigateBackwardsAction, _super);
    function NavigateBackwardsAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    NavigateBackwardsAction.prototype.run = function () {
        this.historyService.back();
        return TPromise.as(null);
    };
    NavigateBackwardsAction.ID = 'workbench.action.navigateBack';
    NavigateBackwardsAction.LABEL = nls.localize('navigatePrevious', "Go Back");
    NavigateBackwardsAction = __decorate([
        __param(2, IHistoryService)
    ], NavigateBackwardsAction);
    return NavigateBackwardsAction;
}(Action));
export { NavigateBackwardsAction };
var NavigateToLastEditLocationAction = /** @class */ (function (_super) {
    __extends(NavigateToLastEditLocationAction, _super);
    function NavigateToLastEditLocationAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    NavigateToLastEditLocationAction.prototype.run = function () {
        this.historyService.openLastEditLocation();
        return TPromise.as(null);
    };
    NavigateToLastEditLocationAction.ID = 'workbench.action.navigateToLastEditLocation';
    NavigateToLastEditLocationAction.LABEL = nls.localize('navigateToLastEditLocation', "Go to Last Edit Location");
    NavigateToLastEditLocationAction = __decorate([
        __param(2, IHistoryService)
    ], NavigateToLastEditLocationAction);
    return NavigateToLastEditLocationAction;
}(Action));
export { NavigateToLastEditLocationAction };
var NavigateLastAction = /** @class */ (function (_super) {
    __extends(NavigateLastAction, _super);
    function NavigateLastAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    NavigateLastAction.prototype.run = function () {
        this.historyService.last();
        return TPromise.as(null);
    };
    NavigateLastAction.ID = 'workbench.action.navigateLast';
    NavigateLastAction.LABEL = nls.localize('navigateLast', "Go Last");
    NavigateLastAction = __decorate([
        __param(2, IHistoryService)
    ], NavigateLastAction);
    return NavigateLastAction;
}(Action));
export { NavigateLastAction };
var ReopenClosedEditorAction = /** @class */ (function (_super) {
    __extends(ReopenClosedEditorAction, _super);
    function ReopenClosedEditorAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    ReopenClosedEditorAction.prototype.run = function () {
        this.historyService.reopenLastClosedEditor();
        return TPromise.as(false);
    };
    ReopenClosedEditorAction.ID = 'workbench.action.reopenClosedEditor';
    ReopenClosedEditorAction.LABEL = nls.localize('reopenClosedEditor', "Reopen Closed Editor");
    ReopenClosedEditorAction = __decorate([
        __param(2, IHistoryService)
    ], ReopenClosedEditorAction);
    return ReopenClosedEditorAction;
}(Action));
export { ReopenClosedEditorAction };
var ClearRecentFilesAction = /** @class */ (function (_super) {
    __extends(ClearRecentFilesAction, _super);
    function ClearRecentFilesAction(id, label, windowsService, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.windowsService = windowsService;
        _this.historyService = historyService;
        return _this;
    }
    ClearRecentFilesAction.prototype.run = function () {
        // Clear global recently opened
        this.windowsService.clearRecentlyOpened();
        // Clear workspace specific recently opened
        this.historyService.clearRecentlyOpened();
        return TPromise.as(false);
    };
    ClearRecentFilesAction.ID = 'workbench.action.clearRecentFiles';
    ClearRecentFilesAction.LABEL = nls.localize('clearRecentFiles', "Clear Recently Opened");
    ClearRecentFilesAction = __decorate([
        __param(2, IWindowsService),
        __param(3, IHistoryService)
    ], ClearRecentFilesAction);
    return ClearRecentFilesAction;
}(Action));
export { ClearRecentFilesAction };
var ShowEditorsInActiveGroupAction = /** @class */ (function (_super) {
    __extends(ShowEditorsInActiveGroupAction, _super);
    function ShowEditorsInActiveGroupAction(actionId, actionLabel, quickOpenService) {
        return _super.call(this, actionId, actionLabel, NAVIGATE_IN_ACTIVE_GROUP_PREFIX, quickOpenService) || this;
    }
    ShowEditorsInActiveGroupAction.ID = 'workbench.action.showEditorsInActiveGroup';
    ShowEditorsInActiveGroupAction.LABEL = nls.localize('showEditorsInActiveGroup', "Show Editors in Active Group");
    ShowEditorsInActiveGroupAction = __decorate([
        __param(2, IQuickOpenService)
    ], ShowEditorsInActiveGroupAction);
    return ShowEditorsInActiveGroupAction;
}(QuickOpenAction));
export { ShowEditorsInActiveGroupAction };
var ShowAllEditorsAction = /** @class */ (function (_super) {
    __extends(ShowAllEditorsAction, _super);
    function ShowAllEditorsAction(actionId, actionLabel, quickOpenService) {
        return _super.call(this, actionId, actionLabel, NAVIGATE_ALL_EDITORS_GROUP_PREFIX, quickOpenService) || this;
    }
    ShowAllEditorsAction.ID = 'workbench.action.showAllEditors';
    ShowAllEditorsAction.LABEL = nls.localize('showAllEditors', "Show All Editors");
    ShowAllEditorsAction = __decorate([
        __param(2, IQuickOpenService)
    ], ShowAllEditorsAction);
    return ShowAllEditorsAction;
}(QuickOpenAction));
export { ShowAllEditorsAction };
var BaseQuickOpenEditorInGroupAction = /** @class */ (function (_super) {
    __extends(BaseQuickOpenEditorInGroupAction, _super);
    function BaseQuickOpenEditorInGroupAction(id, label, quickOpenService, keybindingService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.keybindingService = keybindingService;
        return _this;
    }
    BaseQuickOpenEditorInGroupAction.prototype.run = function () {
        var keys = this.keybindingService.lookupKeybindings(this.id);
        this.quickOpenService.show(NAVIGATE_IN_ACTIVE_GROUP_PREFIX, { quickNavigateConfiguration: { keybindings: keys } });
        return TPromise.as(true);
    };
    BaseQuickOpenEditorInGroupAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IKeybindingService)
    ], BaseQuickOpenEditorInGroupAction);
    return BaseQuickOpenEditorInGroupAction;
}(Action));
export { BaseQuickOpenEditorInGroupAction };
var OpenPreviousRecentlyUsedEditorInGroupAction = /** @class */ (function (_super) {
    __extends(OpenPreviousRecentlyUsedEditorInGroupAction, _super);
    function OpenPreviousRecentlyUsedEditorInGroupAction(id, label, quickOpenService, keybindingService) {
        return _super.call(this, id, label, quickOpenService, keybindingService) || this;
    }
    OpenPreviousRecentlyUsedEditorInGroupAction.ID = 'workbench.action.openPreviousRecentlyUsedEditorInGroup';
    OpenPreviousRecentlyUsedEditorInGroupAction.LABEL = nls.localize('openPreviousRecentlyUsedEditorInGroup', "Open Previous Recently Used Editor in Group");
    OpenPreviousRecentlyUsedEditorInGroupAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IKeybindingService)
    ], OpenPreviousRecentlyUsedEditorInGroupAction);
    return OpenPreviousRecentlyUsedEditorInGroupAction;
}(BaseQuickOpenEditorInGroupAction));
export { OpenPreviousRecentlyUsedEditorInGroupAction };
var OpenNextRecentlyUsedEditorInGroupAction = /** @class */ (function (_super) {
    __extends(OpenNextRecentlyUsedEditorInGroupAction, _super);
    function OpenNextRecentlyUsedEditorInGroupAction(id, label, quickOpenService, keybindingService) {
        return _super.call(this, id, label, quickOpenService, keybindingService) || this;
    }
    OpenNextRecentlyUsedEditorInGroupAction.ID = 'workbench.action.openNextRecentlyUsedEditorInGroup';
    OpenNextRecentlyUsedEditorInGroupAction.LABEL = nls.localize('openNextRecentlyUsedEditorInGroup', "Open Next Recently Used Editor in Group");
    OpenNextRecentlyUsedEditorInGroupAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IKeybindingService)
    ], OpenNextRecentlyUsedEditorInGroupAction);
    return OpenNextRecentlyUsedEditorInGroupAction;
}(BaseQuickOpenEditorInGroupAction));
export { OpenNextRecentlyUsedEditorInGroupAction };
var OpenPreviousEditorFromHistoryAction = /** @class */ (function (_super) {
    __extends(OpenPreviousEditorFromHistoryAction, _super);
    function OpenPreviousEditorFromHistoryAction(id, label, quickOpenService, keybindingService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.keybindingService = keybindingService;
        return _this;
    }
    OpenPreviousEditorFromHistoryAction.prototype.run = function () {
        var keys = this.keybindingService.lookupKeybindings(this.id);
        this.quickOpenService.show(null, { quickNavigateConfiguration: { keybindings: keys } });
        return TPromise.as(true);
    };
    OpenPreviousEditorFromHistoryAction.ID = 'workbench.action.openPreviousEditorFromHistory';
    OpenPreviousEditorFromHistoryAction.LABEL = nls.localize('navigateEditorHistoryByInput', "Open Previous Editor from History");
    OpenPreviousEditorFromHistoryAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IKeybindingService)
    ], OpenPreviousEditorFromHistoryAction);
    return OpenPreviousEditorFromHistoryAction;
}(Action));
export { OpenPreviousEditorFromHistoryAction };
var OpenNextRecentlyUsedEditorAction = /** @class */ (function (_super) {
    __extends(OpenNextRecentlyUsedEditorAction, _super);
    function OpenNextRecentlyUsedEditorAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    OpenNextRecentlyUsedEditorAction.prototype.run = function () {
        this.historyService.forward(true);
        return TPromise.as(null);
    };
    OpenNextRecentlyUsedEditorAction.ID = 'workbench.action.openNextRecentlyUsedEditor';
    OpenNextRecentlyUsedEditorAction.LABEL = nls.localize('openNextRecentlyUsedEditor', "Open Next Recently Used Editor");
    OpenNextRecentlyUsedEditorAction = __decorate([
        __param(2, IHistoryService)
    ], OpenNextRecentlyUsedEditorAction);
    return OpenNextRecentlyUsedEditorAction;
}(Action));
export { OpenNextRecentlyUsedEditorAction };
var OpenPreviousRecentlyUsedEditorAction = /** @class */ (function (_super) {
    __extends(OpenPreviousRecentlyUsedEditorAction, _super);
    function OpenPreviousRecentlyUsedEditorAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    OpenPreviousRecentlyUsedEditorAction.prototype.run = function () {
        this.historyService.back(true);
        return TPromise.as(null);
    };
    OpenPreviousRecentlyUsedEditorAction.ID = 'workbench.action.openPreviousRecentlyUsedEditor';
    OpenPreviousRecentlyUsedEditorAction.LABEL = nls.localize('openPreviousRecentlyUsedEditor', "Open Previous Recently Used Editor");
    OpenPreviousRecentlyUsedEditorAction = __decorate([
        __param(2, IHistoryService)
    ], OpenPreviousRecentlyUsedEditorAction);
    return OpenPreviousRecentlyUsedEditorAction;
}(Action));
export { OpenPreviousRecentlyUsedEditorAction };
var ClearEditorHistoryAction = /** @class */ (function (_super) {
    __extends(ClearEditorHistoryAction, _super);
    function ClearEditorHistoryAction(id, label, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.historyService = historyService;
        return _this;
    }
    ClearEditorHistoryAction.prototype.run = function () {
        // Editor history
        this.historyService.clear();
        return TPromise.as(true);
    };
    ClearEditorHistoryAction.ID = 'workbench.action.clearEditorHistory';
    ClearEditorHistoryAction.LABEL = nls.localize('clearEditorHistory', "Clear Editor History");
    ClearEditorHistoryAction = __decorate([
        __param(2, IHistoryService)
    ], ClearEditorHistoryAction);
    return ClearEditorHistoryAction;
}(Action));
export { ClearEditorHistoryAction };
var MoveEditorLeftInGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorLeftInGroupAction, _super);
    function MoveEditorLeftInGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'left' }) || this;
    }
    MoveEditorLeftInGroupAction.ID = 'workbench.action.moveEditorLeftInGroup';
    MoveEditorLeftInGroupAction.LABEL = nls.localize('moveEditorLeft', "Move Editor Left");
    MoveEditorLeftInGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorLeftInGroupAction);
    return MoveEditorLeftInGroupAction;
}(ExecuteCommandAction));
export { MoveEditorLeftInGroupAction };
var MoveEditorRightInGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorRightInGroupAction, _super);
    function MoveEditorRightInGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'right' }) || this;
    }
    MoveEditorRightInGroupAction.ID = 'workbench.action.moveEditorRightInGroup';
    MoveEditorRightInGroupAction.LABEL = nls.localize('moveEditorRight', "Move Editor Right");
    MoveEditorRightInGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorRightInGroupAction);
    return MoveEditorRightInGroupAction;
}(ExecuteCommandAction));
export { MoveEditorRightInGroupAction };
var MoveEditorToPreviousGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToPreviousGroupAction, _super);
    function MoveEditorToPreviousGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'previous', by: 'group' }) || this;
    }
    MoveEditorToPreviousGroupAction.ID = 'workbench.action.moveEditorToPreviousGroup';
    MoveEditorToPreviousGroupAction.LABEL = nls.localize('moveEditorToPreviousGroup', "Move Editor into Previous Group");
    MoveEditorToPreviousGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToPreviousGroupAction);
    return MoveEditorToPreviousGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToPreviousGroupAction };
var MoveEditorToNextGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToNextGroupAction, _super);
    function MoveEditorToNextGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'next', by: 'group' }) || this;
    }
    MoveEditorToNextGroupAction.ID = 'workbench.action.moveEditorToNextGroup';
    MoveEditorToNextGroupAction.LABEL = nls.localize('moveEditorToNextGroup', "Move Editor into Next Group");
    MoveEditorToNextGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToNextGroupAction);
    return MoveEditorToNextGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToNextGroupAction };
var MoveEditorToAboveGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToAboveGroupAction, _super);
    function MoveEditorToAboveGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'up', by: 'group' }) || this;
    }
    MoveEditorToAboveGroupAction.ID = 'workbench.action.moveEditorToAboveGroup';
    MoveEditorToAboveGroupAction.LABEL = nls.localize('moveEditorToAboveGroup', "Move Editor into Above Group");
    MoveEditorToAboveGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToAboveGroupAction);
    return MoveEditorToAboveGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToAboveGroupAction };
var MoveEditorToBelowGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToBelowGroupAction, _super);
    function MoveEditorToBelowGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'down', by: 'group' }) || this;
    }
    MoveEditorToBelowGroupAction.ID = 'workbench.action.moveEditorToBelowGroup';
    MoveEditorToBelowGroupAction.LABEL = nls.localize('moveEditorToBelowGroup', "Move Editor into Below Group");
    MoveEditorToBelowGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToBelowGroupAction);
    return MoveEditorToBelowGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToBelowGroupAction };
var MoveEditorToLeftGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToLeftGroupAction, _super);
    function MoveEditorToLeftGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'left', by: 'group' }) || this;
    }
    MoveEditorToLeftGroupAction.ID = 'workbench.action.moveEditorToLeftGroup';
    MoveEditorToLeftGroupAction.LABEL = nls.localize('moveEditorToLeftGroup', "Move Editor into Left Group");
    MoveEditorToLeftGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToLeftGroupAction);
    return MoveEditorToLeftGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToLeftGroupAction };
var MoveEditorToRightGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToRightGroupAction, _super);
    function MoveEditorToRightGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'right', by: 'group' }) || this;
    }
    MoveEditorToRightGroupAction.ID = 'workbench.action.moveEditorToRightGroup';
    MoveEditorToRightGroupAction.LABEL = nls.localize('moveEditorToRightGroup', "Move Editor into Right Group");
    MoveEditorToRightGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToRightGroupAction);
    return MoveEditorToRightGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToRightGroupAction };
var MoveEditorToFirstGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToFirstGroupAction, _super);
    function MoveEditorToFirstGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'first', by: 'group' }) || this;
    }
    MoveEditorToFirstGroupAction.ID = 'workbench.action.moveEditorToFirstGroup';
    MoveEditorToFirstGroupAction.LABEL = nls.localize('moveEditorToFirstGroup', "Move Editor into First Group");
    MoveEditorToFirstGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToFirstGroupAction);
    return MoveEditorToFirstGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToFirstGroupAction };
var MoveEditorToLastGroupAction = /** @class */ (function (_super) {
    __extends(MoveEditorToLastGroupAction, _super);
    function MoveEditorToLastGroupAction(id, label, commandService) {
        return _super.call(this, id, label, MOVE_ACTIVE_EDITOR_COMMAND_ID, commandService, { to: 'last', by: 'group' }) || this;
    }
    MoveEditorToLastGroupAction.ID = 'workbench.action.moveEditorToLastGroup';
    MoveEditorToLastGroupAction.LABEL = nls.localize('moveEditorToLastGroup', "Move Editor into Last Group");
    MoveEditorToLastGroupAction = __decorate([
        __param(2, ICommandService)
    ], MoveEditorToLastGroupAction);
    return MoveEditorToLastGroupAction;
}(ExecuteCommandAction));
export { MoveEditorToLastGroupAction };
var EditorLayoutSingleAction = /** @class */ (function (_super) {
    __extends(EditorLayoutSingleAction, _super);
    function EditorLayoutSingleAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}] }) || this;
    }
    EditorLayoutSingleAction.ID = 'workbench.action.editorLayoutSingle';
    EditorLayoutSingleAction.LABEL = nls.localize('editorLayoutSingle', "Single Column Editor Layout");
    EditorLayoutSingleAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutSingleAction);
    return EditorLayoutSingleAction;
}(ExecuteCommandAction));
export { EditorLayoutSingleAction };
var EditorLayoutTwoColumnsAction = /** @class */ (function (_super) {
    __extends(EditorLayoutTwoColumnsAction, _super);
    function EditorLayoutTwoColumnsAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, {}], orientation: 0 /* HORIZONTAL */ }) || this;
    }
    EditorLayoutTwoColumnsAction.ID = 'workbench.action.editorLayoutTwoColumns';
    EditorLayoutTwoColumnsAction.LABEL = nls.localize('editorLayoutTwoColumns', "Two Columns Editor Layout");
    EditorLayoutTwoColumnsAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutTwoColumnsAction);
    return EditorLayoutTwoColumnsAction;
}(ExecuteCommandAction));
export { EditorLayoutTwoColumnsAction };
var EditorLayoutThreeColumnsAction = /** @class */ (function (_super) {
    __extends(EditorLayoutThreeColumnsAction, _super);
    function EditorLayoutThreeColumnsAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, {}, {}], orientation: 0 /* HORIZONTAL */ }) || this;
    }
    EditorLayoutThreeColumnsAction.ID = 'workbench.action.editorLayoutThreeColumns';
    EditorLayoutThreeColumnsAction.LABEL = nls.localize('editorLayoutThreeColumns', "Three Columns Editor Layout");
    EditorLayoutThreeColumnsAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutThreeColumnsAction);
    return EditorLayoutThreeColumnsAction;
}(ExecuteCommandAction));
export { EditorLayoutThreeColumnsAction };
var EditorLayoutTwoRowsAction = /** @class */ (function (_super) {
    __extends(EditorLayoutTwoRowsAction, _super);
    function EditorLayoutTwoRowsAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, {}], orientation: 1 /* VERTICAL */ }) || this;
    }
    EditorLayoutTwoRowsAction.ID = 'workbench.action.editorLayoutTwoRows';
    EditorLayoutTwoRowsAction.LABEL = nls.localize('editorLayoutTwoRows', "Two Rows Editor Layout");
    EditorLayoutTwoRowsAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutTwoRowsAction);
    return EditorLayoutTwoRowsAction;
}(ExecuteCommandAction));
export { EditorLayoutTwoRowsAction };
var EditorLayoutThreeRowsAction = /** @class */ (function (_super) {
    __extends(EditorLayoutThreeRowsAction, _super);
    function EditorLayoutThreeRowsAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, {}, {}], orientation: 1 /* VERTICAL */ }) || this;
    }
    EditorLayoutThreeRowsAction.ID = 'workbench.action.editorLayoutThreeRows';
    EditorLayoutThreeRowsAction.LABEL = nls.localize('editorLayoutThreeRows', "Three Rows Editor Layout");
    EditorLayoutThreeRowsAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutThreeRowsAction);
    return EditorLayoutThreeRowsAction;
}(ExecuteCommandAction));
export { EditorLayoutThreeRowsAction };
var EditorLayoutTwoByTwoGridAction = /** @class */ (function (_super) {
    __extends(EditorLayoutTwoByTwoGridAction, _super);
    function EditorLayoutTwoByTwoGridAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{ groups: [{}, {}] }, { groups: [{}, {}] }] }) || this;
    }
    EditorLayoutTwoByTwoGridAction.ID = 'workbench.action.editorLayoutTwoByTwoGrid';
    EditorLayoutTwoByTwoGridAction.LABEL = nls.localize('editorLayoutTwoByTwoGrid', "Grid Editor Layout (2x2)");
    EditorLayoutTwoByTwoGridAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutTwoByTwoGridAction);
    return EditorLayoutTwoByTwoGridAction;
}(ExecuteCommandAction));
export { EditorLayoutTwoByTwoGridAction };
var EditorLayoutTwoColumnsBottomAction = /** @class */ (function (_super) {
    __extends(EditorLayoutTwoColumnsBottomAction, _super);
    function EditorLayoutTwoColumnsBottomAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, { groups: [{}, {}] }], orientation: 1 /* VERTICAL */ }) || this;
    }
    EditorLayoutTwoColumnsBottomAction.ID = 'workbench.action.editorLayoutTwoColumnsBottom';
    EditorLayoutTwoColumnsBottomAction.LABEL = nls.localize('editorLayoutTwoColumnsBottom', "Two Columns Bottom Editor Layout");
    EditorLayoutTwoColumnsBottomAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutTwoColumnsBottomAction);
    return EditorLayoutTwoColumnsBottomAction;
}(ExecuteCommandAction));
export { EditorLayoutTwoColumnsBottomAction };
var EditorLayoutTwoRowsRightAction = /** @class */ (function (_super) {
    __extends(EditorLayoutTwoRowsRightAction, _super);
    function EditorLayoutTwoRowsRightAction(id, label, commandService) {
        return _super.call(this, id, label, LAYOUT_EDITOR_GROUPS_COMMAND_ID, commandService, { groups: [{}, { groups: [{}, {}] }], orientation: 0 /* HORIZONTAL */ }) || this;
    }
    EditorLayoutTwoRowsRightAction.ID = 'workbench.action.editorLayoutTwoRowsRight';
    EditorLayoutTwoRowsRightAction.LABEL = nls.localize('editorLayoutTwoRowsRight', "Two Rows Right Editor Layout");
    EditorLayoutTwoRowsRightAction = __decorate([
        __param(2, ICommandService)
    ], EditorLayoutTwoRowsRightAction);
    return EditorLayoutTwoRowsRightAction;
}(ExecuteCommandAction));
export { EditorLayoutTwoRowsRightAction };
var BaseCreateEditorGroupAction = /** @class */ (function (_super) {
    __extends(BaseCreateEditorGroupAction, _super);
    function BaseCreateEditorGroupAction(id, label, direction, editorGroupService) {
        var _this = _super.call(this, id, label) || this;
        _this.direction = direction;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    BaseCreateEditorGroupAction.prototype.run = function () {
        this.editorGroupService.addGroup(this.editorGroupService.activeGroup, this.direction, { activate: true });
        return TPromise.as(true);
    };
    return BaseCreateEditorGroupAction;
}(Action));
export { BaseCreateEditorGroupAction };
var NewEditorGroupLeftAction = /** @class */ (function (_super) {
    __extends(NewEditorGroupLeftAction, _super);
    function NewEditorGroupLeftAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 2 /* LEFT */, editorGroupService) || this;
    }
    NewEditorGroupLeftAction.ID = 'workbench.action.newGroupLeft';
    NewEditorGroupLeftAction.LABEL = nls.localize('newEditorLeft', "New Editor Group to the Left");
    NewEditorGroupLeftAction = __decorate([
        __param(2, IEditorGroupsService)
    ], NewEditorGroupLeftAction);
    return NewEditorGroupLeftAction;
}(BaseCreateEditorGroupAction));
export { NewEditorGroupLeftAction };
var NewEditorGroupRightAction = /** @class */ (function (_super) {
    __extends(NewEditorGroupRightAction, _super);
    function NewEditorGroupRightAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 3 /* RIGHT */, editorGroupService) || this;
    }
    NewEditorGroupRightAction.ID = 'workbench.action.newGroupRight';
    NewEditorGroupRightAction.LABEL = nls.localize('newEditorRight', "New Editor Group to the Right");
    NewEditorGroupRightAction = __decorate([
        __param(2, IEditorGroupsService)
    ], NewEditorGroupRightAction);
    return NewEditorGroupRightAction;
}(BaseCreateEditorGroupAction));
export { NewEditorGroupRightAction };
var NewEditorGroupAboveAction = /** @class */ (function (_super) {
    __extends(NewEditorGroupAboveAction, _super);
    function NewEditorGroupAboveAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 0 /* UP */, editorGroupService) || this;
    }
    NewEditorGroupAboveAction.ID = 'workbench.action.newGroupAbove';
    NewEditorGroupAboveAction.LABEL = nls.localize('newEditorAbove', "New Editor Group Above");
    NewEditorGroupAboveAction = __decorate([
        __param(2, IEditorGroupsService)
    ], NewEditorGroupAboveAction);
    return NewEditorGroupAboveAction;
}(BaseCreateEditorGroupAction));
export { NewEditorGroupAboveAction };
var NewEditorGroupBelowAction = /** @class */ (function (_super) {
    __extends(NewEditorGroupBelowAction, _super);
    function NewEditorGroupBelowAction(id, label, editorGroupService) {
        return _super.call(this, id, label, 1 /* DOWN */, editorGroupService) || this;
    }
    NewEditorGroupBelowAction.ID = 'workbench.action.newGroupBelow';
    NewEditorGroupBelowAction.LABEL = nls.localize('newEditorBelow', "New Editor Group Below");
    NewEditorGroupBelowAction = __decorate([
        __param(2, IEditorGroupsService)
    ], NewEditorGroupBelowAction);
    return NewEditorGroupBelowAction;
}(BaseCreateEditorGroupAction));
export { NewEditorGroupBelowAction };
