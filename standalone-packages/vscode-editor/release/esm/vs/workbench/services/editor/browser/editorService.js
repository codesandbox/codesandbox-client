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
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Extensions as EditorExtensions, EditorInput, SideBySideEditorInput, isEditorInputWithOptions, EditorOptions, TextEditorOptions, toResource } from '../../../common/editor.js';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput.js';
import { DataUriEditorInput } from '../../../common/editor/dataUriEditorInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IUntitledEditorService } from '../../untitled/common/untitledEditorService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { Schemas } from '../../../../base/common/network.js';
import { once, Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { basename } from '../../../../base/common/paths.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { localize } from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { IEditorGroupsService, preferredSideBySideGroupDirection } from '../../group/common/editorGroupsService.js';
import { SIDE_GROUP } from '../common/editorService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Disposable, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
var EditorService = /** @class */ (function (_super) {
    __extends(EditorService, _super);
    function EditorService(editorGroupService, untitledEditorService, instantiationService, labelService, fileService, configurationService) {
        var _this = _super.call(this) || this;
        _this.editorGroupService = editorGroupService;
        _this.untitledEditorService = untitledEditorService;
        _this.instantiationService = instantiationService;
        _this.labelService = labelService;
        _this.fileService = fileService;
        _this.configurationService = configurationService;
        //#region events
        _this._onDidActiveEditorChange = _this._register(new Emitter());
        _this._onDidVisibleEditorsChange = _this._register(new Emitter());
        _this._onDidCloseEditor = _this._register(new Emitter());
        _this._onDidOpenEditorFail = _this._register(new Emitter());
        _this.openEditorHandlers = [];
        _this.fileInputFactory = Registry.as(EditorExtensions.EditorInputFactories).getFileInputFactory();
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(EditorService.prototype, "onDidActiveEditorChange", {
        get: function () { return this._onDidActiveEditorChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "onDidVisibleEditorsChange", {
        get: function () { return this._onDidVisibleEditorsChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "onDidCloseEditor", {
        get: function () { return this._onDidCloseEditor.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "onDidOpenEditorFail", {
        get: function () { return this._onDidOpenEditorFail.event; },
        enumerable: true,
        configurable: true
    });
    EditorService.prototype.registerListeners = function () {
        var _this = this;
        this.editorGroupService.whenRestored.then(function () { return _this.onEditorsRestored(); });
        this.editorGroupService.onDidActiveGroupChange(function (group) { return _this.handleActiveEditorChange(group); });
        this.editorGroupService.onDidAddGroup(function (group) { return _this.registerGroupListeners(group); });
    };
    EditorService.prototype.onEditorsRestored = function () {
        var _this = this;
        // Register listeners to each opened group
        this.editorGroupService.groups.forEach(function (group) { return _this.registerGroupListeners(group); });
        // Fire initial set of editor events if there is an active editor
        if (this.activeEditor) {
            this.doEmitActiveEditorChangeEvent();
            this._onDidVisibleEditorsChange.fire();
        }
    };
    EditorService.prototype.handleActiveEditorChange = function (group) {
        if (group !== this.editorGroupService.activeGroup) {
            return; // ignore if not the active group
        }
        if (!this.lastActiveEditor && !group.activeEditor) {
            return; // ignore if we still have no active editor
        }
        if (this.lastActiveGroupId === group.id && this.lastActiveEditor === group.activeEditor) {
            return; // ignore if the editor actually did not change
        }
        this.doEmitActiveEditorChangeEvent();
    };
    EditorService.prototype.doEmitActiveEditorChangeEvent = function () {
        var activeGroup = this.editorGroupService.activeGroup;
        this.lastActiveGroupId = activeGroup.id;
        this.lastActiveEditor = activeGroup.activeEditor;
        this._onDidActiveEditorChange.fire();
    };
    EditorService.prototype.registerGroupListeners = function (group) {
        var _this = this;
        var groupDisposeables = [];
        groupDisposeables.push(group.onDidGroupChange(function (e) {
            if (e.kind === 5 /* EDITOR_ACTIVE */) {
                _this.handleActiveEditorChange(group);
                _this._onDidVisibleEditorsChange.fire();
            }
        }));
        groupDisposeables.push(group.onDidCloseEditor(function (event) {
            _this._onDidCloseEditor.fire(event);
        }));
        groupDisposeables.push(group.onWillOpenEditor(function (event) {
            _this.onGroupWillOpenEditor(group, event);
        }));
        groupDisposeables.push(group.onDidOpenEditorFail(function (editor) {
            _this._onDidOpenEditorFail.fire({ editor: editor, groupId: group.id });
        }));
        once(group.onWillDispose)(function () {
            dispose(groupDisposeables);
        });
    };
    EditorService.prototype.onGroupWillOpenEditor = function (group, event) {
        var _loop_1 = function (i) {
            var handler = this_1.openEditorHandlers[i];
            var result = handler(event.editor, event.options, group);
            if (result && result.override) {
                event.prevent((function () { return result.override; }));
                return "break";
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.openEditorHandlers.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    Object.defineProperty(EditorService.prototype, "activeControl", {
        get: function () {
            var activeGroup = this.editorGroupService.activeGroup;
            return activeGroup ? activeGroup.activeControl : void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "activeTextEditorWidget", {
        get: function () {
            var activeControl = this.activeControl;
            if (activeControl) {
                var activeControlWidget = activeControl.getControl();
                if (isCodeEditor(activeControlWidget) || isDiffEditor(activeControlWidget)) {
                    return activeControlWidget;
                }
            }
            return void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "editors", {
        get: function () {
            var editors = [];
            this.editorGroupService.groups.forEach(function (group) {
                editors.push.apply(editors, group.editors);
            });
            return editors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "activeEditor", {
        get: function () {
            var activeGroup = this.editorGroupService.activeGroup;
            return activeGroup ? activeGroup.activeEditor : void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "visibleControls", {
        get: function () {
            return coalesce(this.editorGroupService.groups.map(function (group) { return group.activeControl; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "visibleTextEditorWidgets", {
        get: function () {
            return this.visibleControls.map(function (control) { return control.getControl(); }).filter(function (widget) { return isCodeEditor(widget) || isDiffEditor(widget); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorService.prototype, "visibleEditors", {
        get: function () {
            return coalesce(this.editorGroupService.groups.map(function (group) { return group.activeEditor; }));
        },
        enumerable: true,
        configurable: true
    });
    //#region preventOpenEditor()
    EditorService.prototype.overrideOpenEditor = function (handler) {
        var _this = this;
        this.openEditorHandlers.push(handler);
        return toDisposable(function () {
            var index = _this.openEditorHandlers.indexOf(handler);
            if (index >= 0) {
                _this.openEditorHandlers.splice(index, 1);
            }
        });
    };
    EditorService.prototype.openEditor = function (editor, optionsOrGroup, group) {
        // Typed Editor Support
        if (editor instanceof EditorInput) {
            var editorOptions = this.toOptions(optionsOrGroup);
            var targetGroup = this.findTargetGroup(editor, editorOptions, group);
            return this.doOpenEditor(targetGroup, editor, editorOptions);
        }
        // Untyped Text Editor Support
        var textInput = editor;
        var typedInput = this.createInput(textInput);
        if (typedInput) {
            var editorOptions = TextEditorOptions.from(textInput);
            var targetGroup = this.findTargetGroup(typedInput, editorOptions, optionsOrGroup);
            return this.doOpenEditor(targetGroup, typedInput, editorOptions);
        }
        return TPromise.wrap(null);
    };
    EditorService.prototype.doOpenEditor = function (group, editor, options) {
        return group.openEditor(editor, options).then(function () { return group.activeControl; });
    };
    EditorService.prototype.findTargetGroup = function (input, options, group) {
        var targetGroup;
        // Group: Instance of Group
        if (group && typeof group !== 'number') {
            return group;
        }
        // Group: Side by Side
        if (group === SIDE_GROUP) {
            targetGroup = this.findSideBySideGroup();
        }
        // Group: Specific Group
        else if (typeof group === 'number' && group >= 0) {
            targetGroup = this.editorGroupService.getGroup(group);
        }
        // Group: Unspecified without a specific index to open
        else if (!options || typeof options.index !== 'number') {
            var groupsByLastActive = this.editorGroupService.getGroups(1 /* MOST_RECENTLY_ACTIVE */);
            // Respect option to reveal an editor if it is already visible in any group
            if (options && options.revealIfVisible) {
                for (var i = 0; i < groupsByLastActive.length; i++) {
                    var group_1 = groupsByLastActive[i];
                    if (input.matches(group_1.activeEditor)) {
                        targetGroup = group_1;
                        break;
                    }
                }
            }
            // Respect option to reveal an editor if it is open (not necessarily visible)
            if ((options && options.revealIfOpened) || this.configurationService.getValue('workbench.editor.revealIfOpen')) {
                for (var i = 0; i < groupsByLastActive.length; i++) {
                    var group_2 = groupsByLastActive[i];
                    if (group_2.isOpened(input)) {
                        targetGroup = group_2;
                        break;
                    }
                }
            }
        }
        // Fallback to active group if target not valid
        if (!targetGroup) {
            targetGroup = this.editorGroupService.activeGroup;
        }
        return targetGroup;
    };
    EditorService.prototype.findSideBySideGroup = function () {
        var direction = preferredSideBySideGroupDirection(this.configurationService);
        var neighbourGroup = this.editorGroupService.findGroup({ direction: direction });
        if (!neighbourGroup) {
            neighbourGroup = this.editorGroupService.addGroup(this.editorGroupService.activeGroup, direction);
        }
        return neighbourGroup;
    };
    EditorService.prototype.toOptions = function (options) {
        if (!options || options instanceof EditorOptions) {
            return options;
        }
        var textOptions = options;
        if (!!textOptions.selection) {
            return TextEditorOptions.create(options);
        }
        return EditorOptions.create(options);
    };
    EditorService.prototype.openEditors = function (editors, group) {
        var _this = this;
        // Convert to typed editors and options
        var typedEditors = [];
        editors.forEach(function (editor) {
            if (isEditorInputWithOptions(editor)) {
                typedEditors.push(editor);
            }
            else {
                typedEditors.push({ editor: _this.createInput(editor), options: TextEditorOptions.from(editor) });
            }
        });
        // Find target groups to open
        var mapGroupToEditors = new Map();
        if (group === SIDE_GROUP) {
            mapGroupToEditors.set(this.findSideBySideGroup(), typedEditors);
        }
        else {
            typedEditors.forEach(function (typedEditor) {
                var targetGroup = _this.findTargetGroup(typedEditor.editor, typedEditor.options, group);
                var targetGroupEditors = mapGroupToEditors.get(targetGroup);
                if (!targetGroupEditors) {
                    targetGroupEditors = [];
                    mapGroupToEditors.set(targetGroup, targetGroupEditors);
                }
                targetGroupEditors.push(typedEditor);
            });
        }
        // Open in targets
        var result = [];
        mapGroupToEditors.forEach(function (editorsWithOptions, group) {
            result.push((group.openEditors(editorsWithOptions)).then(function () { return group.activeControl; }));
        });
        return TPromise.join(result);
    };
    //#endregion
    //#region isOpen()
    EditorService.prototype.isOpen = function (editor, group) {
        return !!this.doGetOpened(editor);
    };
    //#endregion
    //#region getOpend()
    EditorService.prototype.getOpened = function (editor, group) {
        return this.doGetOpened(editor);
    };
    EditorService.prototype.doGetOpened = function (editor, group) {
        if (!(editor instanceof EditorInput)) {
            var resourceInput = editor;
            if (!resourceInput.resource) {
                return void 0; // we need a resource at least
            }
        }
        var groups = [];
        if (typeof group === 'number') {
            groups.push(this.editorGroupService.getGroup(group));
        }
        else if (group) {
            groups.push(group);
        }
        else {
            groups = this.editorGroupService.groups.slice();
        }
        // For each editor group
        for (var i = 0; i < groups.length; i++) {
            var group_3 = groups[i];
            // Typed editor
            if (editor instanceof EditorInput) {
                if (group_3.isOpened(editor)) {
                    return editor;
                }
            }
            // Resource editor
            else {
                for (var j = 0; j < group_3.editors.length; j++) {
                    var editorInGroup = group_3.editors[j];
                    var resource = toResource(editorInGroup, { supportSideBySide: true });
                    if (!resource) {
                        continue; // need a resource to compare with
                    }
                    var resourceInput = editor;
                    if (resource.toString() === resourceInput.resource.toString()) {
                        return editorInGroup;
                    }
                }
            }
        }
        return void 0;
    };
    EditorService.prototype.replaceEditors = function (editors, group) {
        var _this = this;
        var typedEditors = [];
        editors.forEach(function (replaceEditorArg) {
            if (replaceEditorArg.editor instanceof EditorInput) {
                typedEditors.push(replaceEditorArg);
            }
            else {
                var editor = replaceEditorArg.editor;
                var typedEditor = _this.createInput(editor);
                var replacementEditor = _this.createInput(replaceEditorArg.replacement);
                typedEditors.push({
                    editor: typedEditor,
                    replacement: replacementEditor,
                    options: _this.toOptions(editor.options)
                });
            }
        });
        var targetGroup = typeof group === 'number' ? this.editorGroupService.getGroup(group) : group;
        return targetGroup.replaceEditors(typedEditors);
    };
    //#endregion
    //#region invokeWithinEditorContext()
    EditorService.prototype.invokeWithinEditorContext = function (fn) {
        var activeTextEditorWidget = this.activeTextEditorWidget;
        if (isCodeEditor(activeTextEditorWidget)) {
            return activeTextEditorWidget.invokeWithinContext(fn);
        }
        var activeGroup = this.editorGroupService.activeGroup;
        if (activeGroup) {
            return activeGroup.invokeWithinContext(fn);
        }
        return this.instantiationService.invokeFunction(fn);
    };
    //#endregion
    //#region createInput()
    EditorService.prototype.createInput = function (input) {
        // Typed Editor Input Support (EditorInput)
        if (input instanceof EditorInput) {
            return input;
        }
        // Typed Editor Input Support (IEditorInputWithOptions)
        var editorInputWithOptions = input;
        if (editorInputWithOptions.editor instanceof EditorInput) {
            return editorInputWithOptions.editor;
        }
        // Side by Side Support
        var resourceSideBySideInput = input;
        if (resourceSideBySideInput.masterResource && resourceSideBySideInput.detailResource) {
            var masterInput = this.createInput({ resource: resourceSideBySideInput.masterResource, forceFile: resourceSideBySideInput.forceFile });
            var detailInput = this.createInput({ resource: resourceSideBySideInput.detailResource, forceFile: resourceSideBySideInput.forceFile });
            return new SideBySideEditorInput(resourceSideBySideInput.label || masterInput.getName(), typeof resourceSideBySideInput.description === 'string' ? resourceSideBySideInput.description : masterInput.getDescription(), detailInput, masterInput);
        }
        // Diff Editor Support
        var resourceDiffInput = input;
        if (resourceDiffInput.leftResource && resourceDiffInput.rightResource) {
            var leftInput = this.createInput({ resource: resourceDiffInput.leftResource, forceFile: resourceDiffInput.forceFile });
            var rightInput = this.createInput({ resource: resourceDiffInput.rightResource, forceFile: resourceDiffInput.forceFile });
            var label = resourceDiffInput.label || localize('compareLabels', "{0} ↔ {1}", this.toDiffLabel(leftInput), this.toDiffLabel(rightInput));
            return new DiffEditorInput(label, resourceDiffInput.description, leftInput, rightInput);
        }
        // Untitled file support
        var untitledInput = input;
        if (!untitledInput.resource || typeof untitledInput.filePath === 'string' || (untitledInput.resource instanceof URI && untitledInput.resource.scheme === Schemas.untitled)) {
            return this.untitledEditorService.createOrGet(untitledInput.filePath ? URI.file(untitledInput.filePath) : untitledInput.resource, untitledInput.language, untitledInput.contents, untitledInput.encoding);
        }
        // Resource Editor Support
        var resourceInput = input;
        if (resourceInput.resource instanceof URI) {
            var label = resourceInput.label;
            if (!label && resourceInput.resource.scheme !== Schemas.data) {
                label = basename(resourceInput.resource.fsPath); // derive the label from the path (but not for data URIs)
            }
            return this.createOrGet(resourceInput.resource, this.instantiationService, label, resourceInput.description, resourceInput.encoding, resourceInput.forceFile);
        }
        return null;
    };
    EditorService.prototype.createOrGet = function (resource, instantiationService, label, description, encoding, forceFile) {
        if (EditorService.CACHE.has(resource)) {
            var input_1 = EditorService.CACHE.get(resource);
            if (input_1 instanceof ResourceEditorInput) {
                input_1.setName(label);
                input_1.setDescription(description);
            }
            else if (!(input_1 instanceof DataUriEditorInput)) {
                input_1.setPreferredEncoding(encoding);
            }
            return input_1;
        }
        var input;
        // File
        if (forceFile /* fix for https://github.com/Microsoft/vscode/issues/48275 */ || this.fileService.canHandleResource(resource)) {
            input = this.fileInputFactory.createFileInput(resource, encoding, instantiationService);
        }
        // Data URI
        else if (resource.scheme === Schemas.data) {
            input = instantiationService.createInstance(DataUriEditorInput, label, description, resource);
        }
        // Resource
        else {
            input = instantiationService.createInstance(ResourceEditorInput, label, description, resource);
        }
        EditorService.CACHE.set(resource, input);
        once(input.onDispose)(function () {
            EditorService.CACHE.delete(resource);
        });
        return input;
    };
    EditorService.prototype.toDiffLabel = function (input) {
        var res = input.getResource();
        // Do not try to extract any paths from simple untitled editors
        if (res.scheme === Schemas.untitled && !this.untitledEditorService.hasAssociatedFilePath(res)) {
            return input.getName();
        }
        // Otherwise: for diff labels prefer to see the path as part of the label
        return this.labelService.getUriLabel(res, { relative: true });
    };
    EditorService.CACHE = new ResourceMap();
    EditorService = __decorate([
        __param(0, IEditorGroupsService),
        __param(1, IUntitledEditorService),
        __param(2, IInstantiationService),
        __param(3, ILabelService),
        __param(4, IFileService),
        __param(5, IConfigurationService)
    ], EditorService);
    return EditorService;
}(Disposable));
export { EditorService };
/**
 * The delegating workbench editor service can be used to override the behaviour of the openEditor()
 * method by providing a IEditorOpenHandler.
 */
var DelegatingEditorService = /** @class */ (function (_super) {
    __extends(DelegatingEditorService, _super);
    function DelegatingEditorService(editorGroupService, untitledEditorService, instantiationService, labelService, fileService, configurationService) {
        return _super.call(this, editorGroupService, untitledEditorService, instantiationService, labelService, fileService, configurationService) || this;
    }
    DelegatingEditorService.prototype.setEditorOpenHandler = function (handler) {
        this.editorOpenHandler = handler;
    };
    DelegatingEditorService.prototype.doOpenEditor = function (group, editor, options) {
        var _this = this;
        var handleOpen = this.editorOpenHandler ? this.editorOpenHandler(group, editor, options) : TPromise.as(void 0);
        return handleOpen.then(function (control) {
            if (control) {
                return TPromise.as(control); // the opening was handled, so return early
            }
            return _super.prototype.doOpenEditor.call(_this, group, editor, options);
        });
    };
    DelegatingEditorService = __decorate([
        __param(0, IEditorGroupsService),
        __param(1, IUntitledEditorService),
        __param(2, IInstantiationService),
        __param(3, ILabelService),
        __param(4, IFileService),
        __param(5, IConfigurationService)
    ], DelegatingEditorService);
    return DelegatingEditorService;
}(EditorService));
export { DelegatingEditorService };
