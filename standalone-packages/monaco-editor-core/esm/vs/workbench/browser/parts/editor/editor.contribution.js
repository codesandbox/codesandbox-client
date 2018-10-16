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
import { Registry } from '../../../../platform/registry/common/platform';
import * as nls from '../../../../nls';
import { URI } from '../../../../base/common/uri';
import { Extensions as QuickOpenExtensions, QuickOpenHandlerDescriptor } from '../../quickopen';
import { StatusbarItemDescriptor, Extensions as StatusExtensions } from '../statusbar/statusbar';
import { EditorDescriptor, Extensions as EditorExtensions } from '../../editor';
import { SideBySideEditorInput, Extensions as EditorInputExtensions, TextCompareEditorActiveContext } from '../../../common/editor';
import { TextResourceEditor } from './textResourceEditor';
import { SideBySideEditor } from './sideBySideEditor';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput';
import { UntitledEditorInput } from '../../../common/editor/untitledEditorInput';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { TextDiffEditor } from './textDiffEditor';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { BinaryResourceDiffEditor } from './binaryDiffEditor';
import { ChangeEncodingAction, ChangeEOLAction, ChangeModeAction, EditorStatus } from './editorStatus';
import { Extensions as ActionExtensions } from '../../../common/actions';
import { Scope, Extensions as ActionBarExtensions, ActionBarContributor } from '../../actions';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors';
import { KeyChord } from '../../../../base/common/keyCodes';
import { CloseEditorsInOtherGroupsAction, CloseAllEditorsAction, MoveGroupLeftAction, MoveGroupRightAction, SplitEditorAction, JoinTwoGroupsAction, OpenToSideFromQuickOpenAction, RevertAndCloseEditorAction, NavigateBetweenGroupsAction, FocusActiveGroupAction, FocusFirstGroupAction, ResetGroupSizesAction, MaximizeGroupAction, MinimizeOtherGroupsAction, FocusPreviousGroup, FocusNextGroup, toEditorQuickOpenEntry, CloseLeftEditorsInGroupAction, OpenNextEditor, OpenPreviousEditor, NavigateBackwardsAction, NavigateForwardAction, NavigateLastAction, ReopenClosedEditorAction, OpenPreviousRecentlyUsedEditorInGroupAction, OpenPreviousEditorFromHistoryAction, ShowAllEditorsAction, ClearEditorHistoryAction, MoveEditorRightInGroupAction, OpenNextEditorInGroup, OpenPreviousEditorInGroup, OpenNextRecentlyUsedEditorAction, OpenPreviousRecentlyUsedEditorAction, OpenNextRecentlyUsedEditorInGroupAction, MoveEditorToPreviousGroupAction, MoveEditorToNextGroupAction, MoveEditorToFirstGroupAction, MoveEditorLeftInGroupAction, ClearRecentFilesAction, OpenLastEditorInGroup, ShowEditorsInActiveGroupAction, MoveEditorToLastGroupAction, OpenFirstEditorInGroup, MoveGroupUpAction, MoveGroupDownAction, FocusLastGroupAction, SplitEditorLeftAction, SplitEditorRightAction, SplitEditorUpAction, SplitEditorDownAction, MoveEditorToLeftGroupAction, MoveEditorToRightGroupAction, MoveEditorToAboveGroupAction, MoveEditorToBelowGroupAction, CloseAllEditorGroupsAction, JoinAllGroupsAction, FocusLeftGroup, FocusAboveGroup, FocusRightGroup, FocusBelowGroup, EditorLayoutSingleAction, EditorLayoutTwoColumnsAction, EditorLayoutThreeColumnsAction, EditorLayoutTwoByTwoGridAction, EditorLayoutTwoRowsAction, EditorLayoutThreeRowsAction, EditorLayoutTwoColumnsBottomAction, EditorLayoutTwoRowsRightAction, NewEditorGroupLeftAction, NewEditorGroupRightAction, NewEditorGroupAboveAction, NewEditorGroupBelowAction, SplitEditorOrthogonalAction, CloseEditorInAllGroupsAction, NavigateToLastEditLocationAction } from './editorActions';
import * as editorCommands from './editorCommands';
import { IEditorService } from '../../../services/editor/common/editorService';
import { getQuickNavigateHandler, inQuickOpenContext } from '../quickopen/quickopen';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { isMacintosh } from '../../../../base/common/platform';
import { AllEditorsPicker, ActiveEditorGroupPicker } from './editorPicker';
import { Schemas } from '../../../../base/common/network';
import { registerEditorContribution } from '../../../../editor/browser/editorExtensions';
import { OpenWorkspaceButtonContribution } from './editorWidgets';
// Register String Editor
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(TextResourceEditor, TextResourceEditor.ID, nls.localize('textEditor', "Text Editor")), [
    new SyncDescriptor(UntitledEditorInput),
    new SyncDescriptor(ResourceEditorInput)
]);
// Register Text Diff Editor
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(TextDiffEditor, TextDiffEditor.ID, nls.localize('textDiffEditor', "Text Diff Editor")), [
    new SyncDescriptor(DiffEditorInput)
]);
// Register Binary Resource Diff Editor
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(BinaryResourceDiffEditor, BinaryResourceDiffEditor.ID, nls.localize('binaryDiffEditor', "Binary Diff Editor")), [
    new SyncDescriptor(DiffEditorInput)
]);
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(SideBySideEditor, SideBySideEditor.ID, nls.localize('sideBySideEditor', "Side by Side Editor")), [
    new SyncDescriptor(SideBySideEditorInput)
]);
// Register Editor Input Factory
var UntitledEditorInputFactory = /** @class */ (function () {
    function UntitledEditorInputFactory(textFileService) {
        this.textFileService = textFileService;
    }
    UntitledEditorInputFactory.prototype.serialize = function (editorInput) {
        if (!this.textFileService.isHotExitEnabled) {
            return null; // never restore untitled unless hot exit is enabled
        }
        var untitledEditorInput = editorInput;
        var resource = untitledEditorInput.getResource();
        if (untitledEditorInput.hasAssociatedFilePath) {
            resource = resource.with({ scheme: Schemas.file }); // untitled with associated file path use the file schema
        }
        var serialized = {
            resource: resource.toString(),
            resourceJSON: resource.toJSON(),
            modeId: untitledEditorInput.getModeId(),
            encoding: untitledEditorInput.getEncoding()
        };
        return JSON.stringify(serialized);
    };
    UntitledEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        return instantiationService.invokeFunction(function (accessor) {
            var deserialized = JSON.parse(serializedEditorInput);
            var resource = !!deserialized.resourceJSON ? URI.revive(deserialized.resourceJSON) : URI.parse(deserialized.resource);
            var filePath = resource.scheme === Schemas.file ? resource.fsPath : void 0;
            var language = deserialized.modeId;
            var encoding = deserialized.encoding;
            return accessor.get(IEditorService).createInput({ resource: resource, filePath: filePath, language: language, encoding: encoding });
        });
    };
    UntitledEditorInputFactory = __decorate([
        __param(0, ITextFileService)
    ], UntitledEditorInputFactory);
    return UntitledEditorInputFactory;
}());
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(UntitledEditorInput.ID, UntitledEditorInputFactory);
// Register Side by Side Editor Input Factory
var SideBySideEditorInputFactory = /** @class */ (function () {
    function SideBySideEditorInputFactory() {
    }
    SideBySideEditorInputFactory.prototype.serialize = function (editorInput) {
        var input = editorInput;
        if (input.details && input.master) {
            var registry_1 = Registry.as(EditorInputExtensions.EditorInputFactories);
            var detailsInputFactory = registry_1.getEditorInputFactory(input.details.getTypeId());
            var masterInputFactory = registry_1.getEditorInputFactory(input.master.getTypeId());
            if (detailsInputFactory && masterInputFactory) {
                var detailsSerialized = detailsInputFactory.serialize(input.details);
                var masterSerialized = masterInputFactory.serialize(input.master);
                if (detailsSerialized && masterSerialized) {
                    return JSON.stringify({
                        name: input.getName(),
                        description: input.getDescription(),
                        detailsSerialized: detailsSerialized,
                        masterSerialized: masterSerialized,
                        detailsTypeId: input.details.getTypeId(),
                        masterTypeId: input.master.getTypeId()
                    });
                }
            }
        }
        return null;
    };
    SideBySideEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        var deserialized = JSON.parse(serializedEditorInput);
        var registry = Registry.as(EditorInputExtensions.EditorInputFactories);
        var detailsInputFactory = registry.getEditorInputFactory(deserialized.detailsTypeId);
        var masterInputFactory = registry.getEditorInputFactory(deserialized.masterTypeId);
        if (detailsInputFactory && masterInputFactory) {
            var detailsInput = detailsInputFactory.deserialize(instantiationService, deserialized.detailsSerialized);
            var masterInput = masterInputFactory.deserialize(instantiationService, deserialized.masterSerialized);
            if (detailsInput && masterInput) {
                return new SideBySideEditorInput(deserialized.name, deserialized.description, detailsInput, masterInput);
            }
        }
        return null;
    };
    return SideBySideEditorInputFactory;
}());
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(SideBySideEditorInput.ID, SideBySideEditorInputFactory);
// Register Editor Contributions
registerEditorContribution(OpenWorkspaceButtonContribution);
// Register Editor Status
var statusBar = Registry.as(StatusExtensions.Statusbar);
statusBar.registerStatusbarItem(new StatusbarItemDescriptor(EditorStatus, 1 /* RIGHT */, 100 /* towards the left of the right hand side */));
// Register Status Actions
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ChangeModeAction, ChangeModeAction.ID, ChangeModeAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 43 /* KEY_M */) }), 'Change Language Mode');
registry.registerWorkbenchAction(new SyncActionDescriptor(ChangeEOLAction, ChangeEOLAction.ID, ChangeEOLAction.LABEL), 'Change End of Line Sequence');
registry.registerWorkbenchAction(new SyncActionDescriptor(ChangeEncodingAction, ChangeEncodingAction.ID, ChangeEncodingAction.LABEL), 'Change File Encoding');
var QuickOpenActionContributor = /** @class */ (function (_super) {
    __extends(QuickOpenActionContributor, _super);
    function QuickOpenActionContributor(instantiationService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        return _this;
    }
    QuickOpenActionContributor.prototype.hasActions = function (context) {
        var entry = this.getEntry(context);
        return !!entry;
    };
    QuickOpenActionContributor.prototype.getActions = function (context) {
        var actions = [];
        var entry = this.getEntry(context);
        if (entry) {
            if (!this.openToSideActionInstance) {
                this.openToSideActionInstance = this.instantiationService.createInstance(OpenToSideFromQuickOpenAction);
            }
            else {
                this.openToSideActionInstance.updateClass();
            }
            actions.push(this.openToSideActionInstance);
        }
        return actions;
    };
    QuickOpenActionContributor.prototype.getEntry = function (context) {
        if (!context || !context.element) {
            return null;
        }
        return toEditorQuickOpenEntry(context.element);
    };
    QuickOpenActionContributor = __decorate([
        __param(0, IInstantiationService)
    ], QuickOpenActionContributor);
    return QuickOpenActionContributor;
}(ActionBarContributor));
export { QuickOpenActionContributor };
var actionBarRegistry = Registry.as(ActionBarExtensions.Actionbar);
actionBarRegistry.registerActionBarContributor(Scope.VIEWER, QuickOpenActionContributor);
var editorPickerContextKey = 'inEditorsPicker';
var editorPickerContext = ContextKeyExpr.and(inQuickOpenContext, ContextKeyExpr.has(editorPickerContextKey));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(ActiveEditorGroupPicker, ActiveEditorGroupPicker.ID, editorCommands.NAVIGATE_IN_ACTIVE_GROUP_PREFIX, editorPickerContextKey, [
    {
        prefix: editorCommands.NAVIGATE_IN_ACTIVE_GROUP_PREFIX,
        needsEditor: false,
        description: nls.localize('groupOnePicker', "Show Editors in Active Group")
    }
]));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(AllEditorsPicker, AllEditorsPicker.ID, editorCommands.NAVIGATE_ALL_EDITORS_GROUP_PREFIX, editorPickerContextKey, [
    {
        prefix: editorCommands.NAVIGATE_ALL_EDITORS_GROUP_PREFIX,
        needsEditor: false,
        description: nls.localize('allEditorsPicker', "Show All Opened Editors")
    }
]));
// Register Editor Actions
var category = nls.localize('view', "View");
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenNextEditorInGroup, OpenNextEditorInGroup.ID, OpenNextEditorInGroup.LABEL), 'View: Open Next Editor in Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenPreviousEditorInGroup, OpenPreviousEditorInGroup.ID, OpenPreviousEditorInGroup.LABEL), 'View: Open Previous Editor in Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenLastEditorInGroup, OpenLastEditorInGroup.ID, OpenLastEditorInGroup.LABEL, { primary: 512 /* Alt */ | 21 /* KEY_0 */, secondary: [2048 /* CtrlCmd */ | 30 /* KEY_9 */], mac: { primary: 256 /* WinCtrl */ | 21 /* KEY_0 */, secondary: [2048 /* CtrlCmd */ | 30 /* KEY_9 */] } }), 'View: Open Last Editor in Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenFirstEditorInGroup, OpenFirstEditorInGroup.ID, OpenFirstEditorInGroup.LABEL), 'View: Open First Editor in Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenNextRecentlyUsedEditorAction, OpenNextRecentlyUsedEditorAction.ID, OpenNextRecentlyUsedEditorAction.LABEL), 'View: Open Next Recently Used Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenPreviousRecentlyUsedEditorAction, OpenPreviousRecentlyUsedEditorAction.ID, OpenPreviousRecentlyUsedEditorAction.LABEL), 'View: Open Previous Recently Used Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ShowAllEditorsAction, ShowAllEditorsAction.ID, ShowAllEditorsAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 46 /* KEY_P */), mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 2 /* Tab */ } }), 'View: Show All Editors', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ShowEditorsInActiveGroupAction, ShowEditorsInActiveGroupAction.ID, ShowEditorsInActiveGroupAction.LABEL), 'View: Show Editors in Active Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenNextEditor, OpenNextEditor.ID, OpenNextEditor.LABEL, { primary: 2048 /* CtrlCmd */ | 12 /* PageDown */, mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 17 /* RightArrow */, secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 89 /* US_CLOSE_SQUARE_BRACKET */] } }), 'View: Open Next Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenPreviousEditor, OpenPreviousEditor.ID, OpenPreviousEditor.LABEL, { primary: 2048 /* CtrlCmd */ | 11 /* PageUp */, mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 15 /* LeftArrow */, secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 87 /* US_OPEN_SQUARE_BRACKET */] } }), 'View: Open Previous Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ReopenClosedEditorAction, ReopenClosedEditorAction.ID, ReopenClosedEditorAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 50 /* KEY_T */ }), 'View: Reopen Closed Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ClearRecentFilesAction, ClearRecentFilesAction.ID, ClearRecentFilesAction.LABEL), 'File: Clear Recently Opened', nls.localize('file', "File"));
registry.registerWorkbenchAction(new SyncActionDescriptor(CloseAllEditorsAction, CloseAllEditorsAction.ID, CloseAllEditorsAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 53 /* KEY_W */) }), 'View: Close All Editors', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(CloseAllEditorGroupsAction, CloseAllEditorGroupsAction.ID, CloseAllEditorGroupsAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 1024 /* Shift */ | 53 /* KEY_W */) }), 'View: Close All Editor Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(CloseLeftEditorsInGroupAction, CloseLeftEditorsInGroupAction.ID, CloseLeftEditorsInGroupAction.LABEL), 'View: Close Editors in Group to the Left', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(CloseEditorsInOtherGroupsAction, CloseEditorsInOtherGroupsAction.ID, CloseEditorsInOtherGroupsAction.LABEL), 'View: Close Editors in Other Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(CloseEditorInAllGroupsAction, CloseEditorInAllGroupsAction.ID, CloseEditorInAllGroupsAction.LABEL), 'View: Close Editor in All Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorAction, SplitEditorAction.ID, SplitEditorAction.LABEL, { primary: 2048 /* CtrlCmd */ | 88 /* US_BACKSLASH */ }), 'View: Split Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorOrthogonalAction, SplitEditorOrthogonalAction.ID, SplitEditorOrthogonalAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 88 /* US_BACKSLASH */) }), 'View: Split Editor Orthogonal', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorLeftAction, SplitEditorLeftAction.ID, SplitEditorLeftAction.LABEL), 'View: Split Editor Left', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorRightAction, SplitEditorRightAction.ID, SplitEditorRightAction.LABEL), 'View: Split Editor Right', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorUpAction, SplitEditorUpAction.ID, SplitEditorUpAction.LABEL), 'Split Editor Up', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(SplitEditorDownAction, SplitEditorDownAction.ID, SplitEditorDownAction.LABEL), 'View: Split Editor Down', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(JoinTwoGroupsAction, JoinTwoGroupsAction.ID, JoinTwoGroupsAction.LABEL), 'View: Join Editors of Two Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(JoinAllGroupsAction, JoinAllGroupsAction.ID, JoinAllGroupsAction.LABEL), 'View: Join Editors of All Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NavigateBetweenGroupsAction, NavigateBetweenGroupsAction.ID, NavigateBetweenGroupsAction.LABEL), 'View: Navigate Between Editor Groups', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ResetGroupSizesAction, ResetGroupSizesAction.ID, ResetGroupSizesAction.LABEL), 'View: Reset Editor Group Sizes', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MaximizeGroupAction, MaximizeGroupAction.ID, MaximizeGroupAction.LABEL), 'View: Maximize Editor Group and Hide Sidebar', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MinimizeOtherGroupsAction, MinimizeOtherGroupsAction.ID, MinimizeOtherGroupsAction.LABEL), 'View: Maximize Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorLeftInGroupAction, MoveEditorLeftInGroupAction.ID, MoveEditorLeftInGroupAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 11 /* PageUp */, mac: { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 1024 /* Shift */ | 15 /* LeftArrow */) } }), 'View: Move Editor Left', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorRightInGroupAction, MoveEditorRightInGroupAction.ID, MoveEditorRightInGroupAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 12 /* PageDown */, mac: { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 1024 /* Shift */ | 17 /* RightArrow */) } }), 'View: Move Editor Right', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveGroupLeftAction, MoveGroupLeftAction.ID, MoveGroupLeftAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 15 /* LeftArrow */) }), 'View: Move Editor Group Left', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveGroupRightAction, MoveGroupRightAction.ID, MoveGroupRightAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 17 /* RightArrow */) }), 'View: Move Editor Group Right', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveGroupUpAction, MoveGroupUpAction.ID, MoveGroupUpAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 16 /* UpArrow */) }), 'View: Move Editor Group Up', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveGroupDownAction, MoveGroupDownAction.ID, MoveGroupDownAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 18 /* DownArrow */) }), 'View: Move Editor Group Down', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToPreviousGroupAction, MoveEditorToPreviousGroupAction.ID, MoveEditorToPreviousGroupAction.LABEL, { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 15 /* LeftArrow */, mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 15 /* LeftArrow */ } }), 'View: Move Editor into Previous Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToNextGroupAction, MoveEditorToNextGroupAction.ID, MoveEditorToNextGroupAction.LABEL, { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 17 /* RightArrow */, mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 17 /* RightArrow */ } }), 'View: Move Editor into Next Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToFirstGroupAction, MoveEditorToFirstGroupAction.ID, MoveEditorToFirstGroupAction.LABEL, { primary: 1024 /* Shift */ | 512 /* Alt */ | 22 /* KEY_1 */, mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 22 /* KEY_1 */ } }), 'View: Move Editor into First Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToLastGroupAction, MoveEditorToLastGroupAction.ID, MoveEditorToLastGroupAction.LABEL, { primary: 1024 /* Shift */ | 512 /* Alt */ | 30 /* KEY_9 */, mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 30 /* KEY_9 */ } }), 'View: Move Editor into Last Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToLeftGroupAction, MoveEditorToLeftGroupAction.ID, MoveEditorToLeftGroupAction.LABEL), 'View: Move Editor into Left Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToRightGroupAction, MoveEditorToRightGroupAction.ID, MoveEditorToRightGroupAction.LABEL), 'View: Move Editor into Right Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToAboveGroupAction, MoveEditorToAboveGroupAction.ID, MoveEditorToAboveGroupAction.LABEL), 'View: Move Editor into Above Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(MoveEditorToBelowGroupAction, MoveEditorToBelowGroupAction.ID, MoveEditorToBelowGroupAction.LABEL), 'View: Move Editor into Below Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusActiveGroupAction, FocusActiveGroupAction.ID, FocusActiveGroupAction.LABEL), 'View: Focus Active Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusFirstGroupAction, FocusFirstGroupAction.ID, FocusFirstGroupAction.LABEL, { primary: 2048 /* CtrlCmd */ | 22 /* KEY_1 */ }), 'View: Focus First Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusLastGroupAction, FocusLastGroupAction.ID, FocusLastGroupAction.LABEL), 'View: Focus Last Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusPreviousGroup, FocusPreviousGroup.ID, FocusPreviousGroup.LABEL), 'View: Focus Previous Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusNextGroup, FocusNextGroup.ID, FocusNextGroup.LABEL), 'View: Focus Next Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusLeftGroup, FocusLeftGroup.ID, FocusLeftGroup.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 15 /* LeftArrow */) }), 'View: Focus Left Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusRightGroup, FocusRightGroup.ID, FocusRightGroup.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 17 /* RightArrow */) }), 'View: Focus Right Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusAboveGroup, FocusAboveGroup.ID, FocusAboveGroup.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 16 /* UpArrow */) }), 'View: Focus Above Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusBelowGroup, FocusBelowGroup.ID, FocusBelowGroup.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 18 /* DownArrow */) }), 'View: Focus Below Editor Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NewEditorGroupLeftAction, NewEditorGroupLeftAction.ID, NewEditorGroupLeftAction.LABEL), 'View: New Editor Group to the Left', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NewEditorGroupRightAction, NewEditorGroupRightAction.ID, NewEditorGroupRightAction.LABEL), 'View: New Editor Group to the Right', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NewEditorGroupAboveAction, NewEditorGroupAboveAction.ID, NewEditorGroupAboveAction.LABEL), 'View: New Editor Group Above', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NewEditorGroupBelowAction, NewEditorGroupBelowAction.ID, NewEditorGroupBelowAction.LABEL), 'View: New Editor Group Below', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(NavigateForwardAction, NavigateForwardAction.ID, NavigateForwardAction.LABEL, { primary: null, win: { primary: 512 /* Alt */ | 17 /* RightArrow */ }, mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 83 /* US_MINUS */ }, linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 83 /* US_MINUS */ } }), 'Go Forward');
registry.registerWorkbenchAction(new SyncActionDescriptor(NavigateBackwardsAction, NavigateBackwardsAction.ID, NavigateBackwardsAction.LABEL, { primary: null, win: { primary: 512 /* Alt */ | 15 /* LeftArrow */ }, mac: { primary: 256 /* WinCtrl */ | 83 /* US_MINUS */ }, linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 83 /* US_MINUS */ } }), 'Go Back');
registry.registerWorkbenchAction(new SyncActionDescriptor(NavigateToLastEditLocationAction, NavigateToLastEditLocationAction.ID, NavigateToLastEditLocationAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 47 /* KEY_Q */) }), 'Go to Last Edit Location');
registry.registerWorkbenchAction(new SyncActionDescriptor(NavigateLastAction, NavigateLastAction.ID, NavigateLastAction.LABEL), 'Go Last');
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenPreviousEditorFromHistoryAction, OpenPreviousEditorFromHistoryAction.ID, OpenPreviousEditorFromHistoryAction.LABEL), 'Open Previous Editor from History');
registry.registerWorkbenchAction(new SyncActionDescriptor(ClearEditorHistoryAction, ClearEditorHistoryAction.ID, ClearEditorHistoryAction.LABEL), 'Clear Editor History');
registry.registerWorkbenchAction(new SyncActionDescriptor(RevertAndCloseEditorAction, RevertAndCloseEditorAction.ID, RevertAndCloseEditorAction.LABEL), 'View: Revert and Close Editor', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutSingleAction, EditorLayoutSingleAction.ID, EditorLayoutSingleAction.LABEL), 'View: Single Column Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutTwoColumnsAction, EditorLayoutTwoColumnsAction.ID, EditorLayoutTwoColumnsAction.LABEL), 'View: Two Columns Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutThreeColumnsAction, EditorLayoutThreeColumnsAction.ID, EditorLayoutThreeColumnsAction.LABEL), 'View: Three Columns Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutTwoRowsAction, EditorLayoutTwoRowsAction.ID, EditorLayoutTwoRowsAction.LABEL), 'View: Two Rows Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutThreeRowsAction, EditorLayoutThreeRowsAction.ID, EditorLayoutThreeRowsAction.LABEL), 'View: Three Rows Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutTwoByTwoGridAction, EditorLayoutTwoByTwoGridAction.ID, EditorLayoutTwoByTwoGridAction.LABEL), 'View: Grid Editor Layout (2x2)', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutTwoRowsRightAction, EditorLayoutTwoRowsRightAction.ID, EditorLayoutTwoRowsRightAction.LABEL), 'View: Two Rows Right Editor Layout', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(EditorLayoutTwoColumnsBottomAction, EditorLayoutTwoColumnsBottomAction.ID, EditorLayoutTwoColumnsBottomAction.LABEL), 'View: Two Columns Bottom Editor Layout', category);
// Register Editor Picker Actions including quick navigate support
var openNextEditorKeybinding = { primary: 2048 /* CtrlCmd */ | 2 /* Tab */, mac: { primary: 256 /* WinCtrl */ | 2 /* Tab */ } };
var openPreviousEditorKeybinding = { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 2 /* Tab */, mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 2 /* Tab */ } };
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenNextRecentlyUsedEditorInGroupAction, OpenNextRecentlyUsedEditorInGroupAction.ID, OpenNextRecentlyUsedEditorInGroupAction.LABEL, openNextEditorKeybinding), 'View: Open Next Recently Used Editor in Group', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenPreviousRecentlyUsedEditorInGroupAction, OpenPreviousRecentlyUsedEditorInGroupAction.ID, OpenPreviousRecentlyUsedEditorInGroupAction.LABEL, openPreviousEditorKeybinding), 'View: Open Previous Recently Used Editor in Group', category);
var quickOpenNavigateNextInEditorPickerId = 'workbench.action.quickOpenNavigateNextInEditorPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigateNextInEditorPickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigateNextInEditorPickerId, true),
    when: editorPickerContext,
    primary: openNextEditorKeybinding.primary,
    mac: openNextEditorKeybinding.mac
});
var quickOpenNavigatePreviousInEditorPickerId = 'workbench.action.quickOpenNavigatePreviousInEditorPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigatePreviousInEditorPickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigatePreviousInEditorPickerId, false),
    when: editorPickerContext,
    primary: openPreviousEditorKeybinding.primary,
    mac: openPreviousEditorKeybinding.mac
});
// Editor Commands
editorCommands.setup();
// Touch Bar
if (isMacintosh) {
    MenuRegistry.appendMenuItem(MenuId.TouchBarContext, {
        command: { id: NavigateBackwardsAction.ID, title: NavigateBackwardsAction.LABEL, iconLocation: { dark: URI.parse(require.toUrl('vs/workbench/browser/parts/editor/media/back-tb.png')) } },
        group: 'navigation'
    });
    MenuRegistry.appendMenuItem(MenuId.TouchBarContext, {
        command: { id: NavigateForwardAction.ID, title: NavigateForwardAction.LABEL, iconLocation: { dark: URI.parse(require.toUrl('vs/workbench/browser/parts/editor/media/forward-tb.png')) } },
        group: 'navigation'
    });
}
// Empty Editor Group Context Menu
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: editorCommands.SPLIT_EDITOR_UP, title: nls.localize('splitUp', "Split Up") }, group: '2_split', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: editorCommands.SPLIT_EDITOR_DOWN, title: nls.localize('splitDown', "Split Down") }, group: '2_split', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: editorCommands.SPLIT_EDITOR_LEFT, title: nls.localize('splitLeft', "Split Left") }, group: '2_split', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: editorCommands.SPLIT_EDITOR_RIGHT, title: nls.localize('splitRight', "Split Right") }, group: '2_split', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: editorCommands.CLOSE_EDITOR_GROUP_COMMAND_ID, title: nls.localize('close', "Close") }, group: '3_close', order: 10, when: ContextKeyExpr.has('multipleEditorGroups') });
// Editor Title Context Menu
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.CLOSE_EDITOR_COMMAND_ID, title: nls.localize('close', "Close") }, group: '1_close', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID, title: nls.localize('closeOthers', "Close Others") }, group: '1_close', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID, title: nls.localize('closeRight', "Close to the Right") }, group: '1_close', order: 30, when: ContextKeyExpr.has('config.workbench.editor.showTabs') });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.CLOSE_SAVED_EDITORS_COMMAND_ID, title: nls.localize('closeAllSaved', "Close Saved") }, group: '1_close', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: nls.localize('closeAll', "Close All") }, group: '1_close', order: 50 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.KEEP_EDITOR_COMMAND_ID, title: nls.localize('keepOpen', "Keep Open") }, group: '3_preview', order: 10, when: ContextKeyExpr.has('config.workbench.editor.enablePreview') });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.SPLIT_EDITOR_UP, title: nls.localize('splitUp', "Split Up") }, group: '5_split', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.SPLIT_EDITOR_DOWN, title: nls.localize('splitDown', "Split Down") }, group: '5_split', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.SPLIT_EDITOR_LEFT, title: nls.localize('splitLeft', "Split Left") }, group: '5_split', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: editorCommands.SPLIT_EDITOR_RIGHT, title: nls.localize('splitRight', "Split Right") }, group: '5_split', order: 40 });
// Editor Title Menu
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: editorCommands.TOGGLE_DIFF_SIDE_BY_SIDE, title: nls.localize('toggleSideBySideView', "Toggle Side By Side View") }, group: '1_diff', order: 10, when: ContextKeyExpr.has('isInDiffEditor') });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: editorCommands.SHOW_EDITORS_IN_GROUP, title: nls.localize('showOpenedEditors', "Show Opened Editors") }, group: '3_open', order: 10, when: ContextKeyExpr.has('config.workbench.editor.showTabs') });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: editorCommands.CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: nls.localize('closeAll', "Close All") }, group: '5_close', order: 10, when: ContextKeyExpr.has('config.workbench.editor.showTabs') });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: editorCommands.CLOSE_SAVED_EDITORS_COMMAND_ID, title: nls.localize('closeAllSaved', "Close Saved") }, group: '5_close', order: 20, when: ContextKeyExpr.has('config.workbench.editor.showTabs') });
function appendEditorToolItem(primary, when, order, alternative) {
    var item = {
        command: {
            id: primary.id,
            title: primary.title,
            iconLocation: {
                dark: URI.parse(require.toUrl("vs/workbench/browser/parts/editor/media/" + primary.iconDark)),
                light: URI.parse(require.toUrl("vs/workbench/browser/parts/editor/media/" + primary.iconLight))
            }
        },
        group: 'navigation',
        when: when,
        order: order
    };
    if (alternative) {
        item.alt = {
            id: alternative.id,
            title: alternative.title,
            iconLocation: {
                dark: URI.parse(require.toUrl("vs/workbench/browser/parts/editor/media/" + alternative.iconDark)),
                light: URI.parse(require.toUrl("vs/workbench/browser/parts/editor/media/" + alternative.iconLight))
            }
        };
    }
    MenuRegistry.appendMenuItem(MenuId.EditorTitle, item);
}
// Editor Title Menu: Split Editor
appendEditorToolItem({
    id: SplitEditorAction.ID,
    title: nls.localize('splitEditorRight', "Split Editor Right"),
    iconDark: 'split-editor-horizontal-inverse.svg',
    iconLight: 'split-editor-horizontal.svg'
}, ContextKeyExpr.not('splitEditorsVertically'), 100000, // towards the end
{
    id: editorCommands.SPLIT_EDITOR_DOWN,
    title: nls.localize('splitEditorDown', "Split Editor Down"),
    iconDark: 'split-editor-vertical-inverse.svg',
    iconLight: 'split-editor-vertical.svg'
});
appendEditorToolItem({
    id: SplitEditorAction.ID,
    title: nls.localize('splitEditorDown', "Split Editor Down"),
    iconDark: 'split-editor-vertical-inverse.svg',
    iconLight: 'split-editor-vertical.svg'
}, ContextKeyExpr.has('splitEditorsVertically'), 100000, // towards the end
{
    id: editorCommands.SPLIT_EDITOR_RIGHT,
    title: nls.localize('splitEditorRight', "Split Editor Right"),
    iconDark: 'split-editor-horizontal-inverse.svg',
    iconLight: 'split-editor-horizontal.svg'
});
// Editor Title Menu: Close Group (tabs disabled)
appendEditorToolItem({
    id: editorCommands.CLOSE_EDITOR_COMMAND_ID,
    title: nls.localize('close', "Close"),
    iconDark: 'close-big-inverse-alt.svg',
    iconLight: 'close-big-alt.svg'
}, ContextKeyExpr.and(ContextKeyExpr.not('config.workbench.editor.showTabs'), ContextKeyExpr.not('groupActiveEditorDirty')), 1000000, // towards the far end
{
    id: editorCommands.CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
    title: nls.localize('closeAll', "Close All"),
    iconDark: 'closeall-editors-inverse.svg',
    iconLight: 'closeall-editors.svg'
});
appendEditorToolItem({
    id: editorCommands.CLOSE_EDITOR_COMMAND_ID,
    title: nls.localize('close', "Close"),
    iconDark: 'close-dirty-inverse-alt.svg',
    iconLight: 'close-dirty-alt.svg'
}, ContextKeyExpr.and(ContextKeyExpr.not('config.workbench.editor.showTabs'), ContextKeyExpr.has('groupActiveEditorDirty')), 1000000, // towards the far end
{
    id: editorCommands.CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
    title: nls.localize('closeAll', "Close All"),
    iconDark: 'closeall-editors-inverse.svg',
    iconLight: 'closeall-editors.svg'
});
// Diff Editor Title Menu: Previous Change
appendEditorToolItem({
    id: editorCommands.GOTO_PREVIOUS_CHANGE,
    title: nls.localize('navigate.prev.label', "Previous Change"),
    iconDark: 'previous-diff-inverse.svg',
    iconLight: 'previous-diff.svg'
}, TextCompareEditorActiveContext, 10);
// Diff Editor Title Menu: Next Change
appendEditorToolItem({
    id: editorCommands.GOTO_NEXT_CHANGE,
    title: nls.localize('navigate.next.label', "Next Change"),
    iconDark: 'next-diff-inverse.svg',
    iconLight: 'next-diff.svg'
}, TextCompareEditorActiveContext, 11);
// Diff Editor Title Menu: Toggle Ignore Trim Whitespace (Enabled)
appendEditorToolItem({
    id: editorCommands.TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE,
    title: nls.localize('ignoreTrimWhitespace.label', "Ignore Trim Whitespace"),
    iconDark: 'paragraph-inverse.svg',
    iconLight: 'paragraph.svg'
}, ContextKeyExpr.and(TextCompareEditorActiveContext, ContextKeyExpr.notEquals('config.diffEditor.ignoreTrimWhitespace', true)), 20);
// Diff Editor Title Menu: Toggle Ignore Trim Whitespace (Disabled)
appendEditorToolItem({
    id: editorCommands.TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE,
    title: nls.localize('showTrimWhitespace.label', "Show Trim Whitespace"),
    iconDark: 'paragraph-disabled-inverse.svg',
    iconLight: 'paragraph-disabled.svg'
}, ContextKeyExpr.and(TextCompareEditorActiveContext, ContextKeyExpr.notEquals('config.diffEditor.ignoreTrimWhitespace', false)), 20);
// Editor Commands for Command Palette
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: editorCommands.KEEP_EDITOR_COMMAND_ID, title: { value: nls.localize('keepEditor', "Keep Editor"), original: 'View: Keep Editor' }, category: category }, when: ContextKeyExpr.has('config.workbench.editor.enablePreview') });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: editorCommands.CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: { value: nls.localize('closeEditorsInGroup', "Close All Editors in Group"), original: 'View: Close All Editors in Group' }, category: category } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: editorCommands.CLOSE_SAVED_EDITORS_COMMAND_ID, title: { value: nls.localize('closeSavedEditors', "Close Saved Editors in Group"), original: 'View: Close Saved Editors in Group' }, category: category } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: editorCommands.CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID, title: { value: nls.localize('closeOtherEditors', "Close Other Editors in Group"), original: 'View: Close Other Editors in Group' }, category: category } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: editorCommands.CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID, title: { value: nls.localize('closeRightEditors', "Close Editors to the Right in Group"), original: 'View: Close Editors to the Right in Group' }, category: category } });
// File menu
MenuRegistry.appendMenuItem(MenuId.MenubarRecentMenu, {
    group: '1_editor',
    command: {
        id: ReopenClosedEditorAction.ID,
        title: nls.localize({ key: 'miReopenClosedEditor', comment: ['&& denotes a mnemonic'] }, "&&Reopen Closed Editor")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarRecentMenu, {
    group: 'z_clear',
    command: {
        id: ClearRecentFilesAction.ID,
        title: nls.localize({ key: 'miClearRecentOpen', comment: ['&& denotes a mnemonic'] }, "&&Clear Recently Opened")
    },
    order: 1
});
// Layout menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '2_appearance',
    title: nls.localize({ key: 'miEditorLayout', comment: ['&& denotes a mnemonic'] }, "Editor &&Layout"),
    submenu: MenuId.MenubarLayoutMenu,
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '1_split',
    command: {
        id: editorCommands.SPLIT_EDITOR_UP,
        title: nls.localize({ key: 'miSplitEditorUp', comment: ['&& denotes a mnemonic'] }, "Split &&Up")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '1_split',
    command: {
        id: editorCommands.SPLIT_EDITOR_DOWN,
        title: nls.localize({ key: 'miSplitEditorDown', comment: ['&& denotes a mnemonic'] }, "Split &&Down")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '1_split',
    command: {
        id: editorCommands.SPLIT_EDITOR_LEFT,
        title: nls.localize({ key: 'miSplitEditorLeft', comment: ['&& denotes a mnemonic'] }, "Split &&Left")
    },
    order: 3
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '1_split',
    command: {
        id: editorCommands.SPLIT_EDITOR_RIGHT,
        title: nls.localize({ key: 'miSplitEditorRight', comment: ['&& denotes a mnemonic'] }, "Split &&Right")
    },
    order: 4
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutSingleAction.ID,
        title: nls.localize({ key: 'miSingleColumnEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Single")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutTwoColumnsAction.ID,
        title: nls.localize({ key: 'miTwoColumnsEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Two Columns")
    },
    order: 3
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutThreeColumnsAction.ID,
        title: nls.localize({ key: 'miThreeColumnsEditorLayout', comment: ['&& denotes a mnemonic'] }, "T&&hree Columns")
    },
    order: 4
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutTwoRowsAction.ID,
        title: nls.localize({ key: 'miTwoRowsEditorLayout', comment: ['&& denotes a mnemonic'] }, "T&&wo Rows")
    },
    order: 5
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutThreeRowsAction.ID,
        title: nls.localize({ key: 'miThreeRowsEditorLayout', comment: ['&& denotes a mnemonic'] }, "Three &&Rows")
    },
    order: 6
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutTwoByTwoGridAction.ID,
        title: nls.localize({ key: 'miTwoByTwoGridEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Grid (2x2)")
    },
    order: 7
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutTwoRowsRightAction.ID,
        title: nls.localize({ key: 'miTwoRowsRightEditorLayout', comment: ['&& denotes a mnemonic'] }, "Two R&&ows Right")
    },
    order: 8
});
MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
    group: '2_layouts',
    command: {
        id: EditorLayoutTwoColumnsBottomAction.ID,
        title: nls.localize({ key: 'miTwoColumnsBottomEditorLayout', comment: ['&& denotes a mnemonic'] }, "Two &&Columns Bottom")
    },
    order: 9
});
// Main Menu Bar Contributions:
// Forward/Back
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: '1_fwd_back',
    command: {
        id: 'workbench.action.navigateBack',
        title: nls.localize({ key: 'miBack', comment: ['&& denotes a mnemonic'] }, "&&Back"),
        precondition: ContextKeyExpr.has('canNavigateBack')
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: '1_fwd_back',
    command: {
        id: 'workbench.action.navigateForward',
        title: nls.localize({ key: 'miForward', comment: ['&& denotes a mnemonic'] }, "&&Forward"),
        precondition: ContextKeyExpr.has('canNavigateForward')
    },
    order: 2
});
// Switch Editor
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
    group: '1_any',
    command: {
        id: 'workbench.action.nextEditor',
        title: nls.localize({ key: 'miNextEditor', comment: ['&& denotes a mnemonic'] }, "&&Next Editor")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
    group: '1_any',
    command: {
        id: 'workbench.action.previousEditor',
        title: nls.localize({ key: 'miPreviousEditor', comment: ['&& denotes a mnemonic'] }, "&&Previous Editor")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
    group: '2_used',
    command: {
        id: 'workbench.action.openNextRecentlyUsedEditorInGroup',
        title: nls.localize({ key: 'miNextEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Next Used Editor in Group")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
    group: '2_used',
    command: {
        id: 'workbench.action.openPreviousRecentlyUsedEditorInGroup',
        title: nls.localize({ key: 'miPreviousEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Previous Used Editor in Group")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: '2_switch',
    title: nls.localize({ key: 'miSwitchEditor', comment: ['&& denotes a mnemonic'] }, "Switch &&Editor"),
    submenu: MenuId.MenubarSwitchEditorMenu,
    order: 1
});
// Switch Group
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '1_focus_index',
    command: {
        id: 'workbench.action.focusFirstEditorGroup',
        title: nls.localize({ key: 'miFocusFirstGroup', comment: ['&& denotes a mnemonic'] }, "Group &&1")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '1_focus_index',
    command: {
        id: 'workbench.action.focusSecondEditorGroup',
        title: nls.localize({ key: 'miFocusSecondGroup', comment: ['&& denotes a mnemonic'] }, "Group &&2")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '1_focus_index',
    command: {
        id: 'workbench.action.focusThirdEditorGroup',
        title: nls.localize({ key: 'miFocusThirdGroup', comment: ['&& denotes a mnemonic'] }, "Group &&3")
    },
    order: 3
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '1_focus_index',
    command: {
        id: 'workbench.action.focusFourthEditorGroup',
        title: nls.localize({ key: 'miFocusFourthGroup', comment: ['&& denotes a mnemonic'] }, "Group &&4")
    },
    order: 4
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '1_focus_index',
    command: {
        id: 'workbench.action.focusFifthEditorGroup',
        title: nls.localize({ key: 'miFocusFifthGroup', comment: ['&& denotes a mnemonic'] }, "Group &&5")
    },
    order: 5
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '2_next_prev',
    command: {
        id: 'workbench.action.focusNextGroup',
        title: nls.localize({ key: 'miNextGroup', comment: ['&& denotes a mnemonic'] }, "&&Next Group")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '2_next_prev',
    command: {
        id: 'workbench.action.focusPreviousGroup',
        title: nls.localize({ key: 'miPreviousGroup', comment: ['&& denotes a mnemonic'] }, "&&Previous Group")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '3_directional',
    command: {
        id: 'workbench.action.focusLeftGroup',
        title: nls.localize({ key: 'miFocusLeftGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Left")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '3_directional',
    command: {
        id: 'workbench.action.focusRightGroup',
        title: nls.localize({ key: 'miFocusRightGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Right")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '3_directional',
    command: {
        id: 'workbench.action.focusAboveGroup',
        title: nls.localize({ key: 'miFocusAboveGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Above")
    },
    order: 3
});
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
    group: '3_directional',
    command: {
        id: 'workbench.action.focusBelowGroup',
        title: nls.localize({ key: 'miFocusBelowGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Below")
    },
    order: 4
});
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: '2_switch',
    title: nls.localize({ key: 'miSwitchGroup', comment: ['&& denotes a mnemonic'] }, "Switch &&Group"),
    submenu: MenuId.MenubarSwitchGroupMenu,
    order: 2
});
