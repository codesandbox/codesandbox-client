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
import './editor.contribution.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { Part } from '../../part.js';
import { Dimension, isAncestor, toggleClass, addClass, $ } from '../../../../base/browser/dom.js';
import { Event, Emitter, once, Relay, anyEvent } from '../../../../base/common/event.js';
import { contrastBorder, editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { SerializableGrid, isGridBranchNode, createSerializedGrid } from '../../../../base/browser/ui/grid/grid.js';
import { values } from '../../../../base/common/map.js';
import { EDITOR_GROUP_BORDER, EDITOR_PANE_BACKGROUND } from '../../../common/theme.js';
import { distinct } from '../../../../base/common/arrays.js';
import { getEditorPartOptions, impactsEditorPartOptions } from './editor.js';
import { EditorGroupView } from './editorGroupView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { assign } from '../../../../base/common/objects.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { isSerializedEditorGroup } from '../../../common/editor/editorGroup.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { always } from '../../../../base/common/async.js';
import { EditorDropTarget } from './editorDropTarget.js';
import { localize } from '../../../../nls.js';
import { Color } from '../../../../base/common/color.js';
import { CenteredViewLayout } from '../../../../base/browser/ui/centered/centeredViewLayout.js';
import { orthogonal } from '../../../../base/browser/ui/grid/gridview.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
var GridWidgetView = /** @class */ (function () {
    function GridWidgetView() {
        this.element = $('.grid-view-container');
        this._onDidChange = new Relay();
        this.onDidChange = this._onDidChange.event;
    }
    Object.defineProperty(GridWidgetView.prototype, "minimumWidth", {
        get: function () { return this.gridWidget ? this.gridWidget.minimumWidth : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridWidgetView.prototype, "maximumWidth", {
        get: function () { return this.gridWidget ? this.gridWidget.maximumWidth : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridWidgetView.prototype, "minimumHeight", {
        get: function () { return this.gridWidget ? this.gridWidget.minimumHeight : 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridWidgetView.prototype, "maximumHeight", {
        get: function () { return this.gridWidget ? this.gridWidget.maximumHeight : Number.POSITIVE_INFINITY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridWidgetView.prototype, "gridWidget", {
        get: function () {
            return this._gridWidget;
        },
        set: function (grid) {
            this.element.innerHTML = '';
            if (grid) {
                this.element.appendChild(grid.element);
                this._onDidChange.input = grid.onDidChange;
            }
            else {
                this._onDidChange.input = Event.None;
            }
            this._gridWidget = grid;
        },
        enumerable: true,
        configurable: true
    });
    GridWidgetView.prototype.layout = function (width, height) {
        if (this.gridWidget) {
            this.gridWidget.layout(width, height);
        }
    };
    GridWidgetView.prototype.dispose = function () {
        this._onDidChange.dispose();
    };
    return GridWidgetView;
}());
var EditorPart = /** @class */ (function (_super) {
    __extends(EditorPart, _super);
    function EditorPart(id, restorePreviousState, instantiationService, themeService, configurationService, storageService) {
        var _this = _super.call(this, id, { hasTitle: false }, themeService) || this;
        _this.restorePreviousState = restorePreviousState;
        _this.instantiationService = instantiationService;
        _this.configurationService = configurationService;
        _this.storageService = storageService;
        //#region Events
        _this._onDidLayout = _this._register(new Emitter());
        _this._onDidActiveGroupChange = _this._register(new Emitter());
        _this._onDidAddGroup = _this._register(new Emitter());
        _this._onDidRemoveGroup = _this._register(new Emitter());
        _this._onDidMoveGroup = _this._register(new Emitter());
        _this.onDidSetGridWidget = _this._register(new Emitter());
        _this._onDidSizeConstraintsChange = _this._register(new Relay());
        _this._onDidPreferredSizeChange = _this._register(new Emitter());
        _this.groupViews = new Map();
        _this.mostRecentActiveGroups = [];
        //#region IEditorGroupsAccessor
        _this.enforcedPartOptions = [];
        _this._onDidEditorPartOptionsChange = _this._register(new Emitter());
        _this.gridWidgetView = new GridWidgetView();
        _this._partOptions = getEditorPartOptions(_this.configurationService.getValue());
        _this.memento = _this.getMemento(_this.storageService, 1 /* WORKSPACE */);
        _this.globalMemento = _this.getMemento(_this.storageService, 0 /* GLOBAL */);
        _this._whenRestored = new TPromise(function (resolve) {
            _this.whenRestoredComplete = resolve;
        });
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(EditorPart.prototype, "onDidLayout", {
        get: function () { return this._onDidLayout.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidActiveGroupChange", {
        get: function () { return this._onDidActiveGroupChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidAddGroup", {
        get: function () { return this._onDidAddGroup.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidRemoveGroup", {
        get: function () { return this._onDidRemoveGroup.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidMoveGroup", {
        get: function () { return this._onDidMoveGroup.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidSizeConstraintsChange", {
        get: function () { return anyEvent(this.onDidSetGridWidget.event, this._onDidSizeConstraintsChange.event); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidPreferredSizeChange", {
        get: function () { return this._onDidPreferredSizeChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "onDidEditorPartOptionsChange", {
        get: function () { return this._onDidEditorPartOptionsChange.event; },
        enumerable: true,
        configurable: true
    });
    EditorPart.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationUpdated(e); }));
    };
    EditorPart.prototype.onConfigurationUpdated = function (event) {
        if (impactsEditorPartOptions(event)) {
            this.handleChangedPartOptions();
        }
    };
    EditorPart.prototype.handleChangedPartOptions = function () {
        var oldPartOptions = this._partOptions;
        var newPartOptions = getEditorPartOptions(this.configurationService.getValue());
        this.enforcedPartOptions.forEach(function (enforcedPartOptions) {
            assign(newPartOptions, enforcedPartOptions); // check for overrides
        });
        this._partOptions = newPartOptions;
        this._onDidEditorPartOptionsChange.fire({ oldPartOptions: oldPartOptions, newPartOptions: newPartOptions });
    };
    Object.defineProperty(EditorPart.prototype, "partOptions", {
        get: function () {
            return this._partOptions;
        },
        enumerable: true,
        configurable: true
    });
    EditorPart.prototype.enforcePartOptions = function (options) {
        var _this = this;
        this.enforcedPartOptions.push(options);
        this.handleChangedPartOptions();
        return toDisposable(function () {
            _this.enforcedPartOptions.splice(_this.enforcedPartOptions.indexOf(options), 1);
            _this.handleChangedPartOptions();
        });
    };
    Object.defineProperty(EditorPart.prototype, "activeGroup", {
        //#endregion
        //#region IEditorGroupsService
        get: function () {
            return this._activeGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "groups", {
        get: function () {
            return values(this.groupViews);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "count", {
        get: function () {
            return this.groupViews.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "orientation", {
        get: function () {
            if (!this.gridWidget) {
                return void 0; // we have not been created yet
            }
            return this.gridWidget.orientation === 0 /* VERTICAL */ ? 1 /* VERTICAL */ : 0 /* HORIZONTAL */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "whenRestored", {
        get: function () {
            return this._whenRestored;
        },
        enumerable: true,
        configurable: true
    });
    EditorPart.prototype.getGroups = function (order) {
        var _this = this;
        if (order === void 0) { order = 0 /* CREATION_TIME */; }
        switch (order) {
            case 0 /* CREATION_TIME */:
                return this.groups;
            case 1 /* MOST_RECENTLY_ACTIVE */:
                var mostRecentActive = this.mostRecentActiveGroups.map(function (groupId) { return _this.getGroup(groupId); });
                // there can be groups that got never active, even though they exist. in this case
                // make sure to ust append them at the end so that all groups are returned properly
                return distinct(mostRecentActive.concat(this.groups));
            case 2 /* GRID_APPEARANCE */:
                var views = [];
                if (this.gridWidget) {
                    this.fillGridNodes(views, this.gridWidget.getViews());
                }
                return views;
        }
    };
    EditorPart.prototype.fillGridNodes = function (target, node) {
        var _this = this;
        if (isGridBranchNode(node)) {
            node.children.forEach(function (child) { return _this.fillGridNodes(target, child); });
        }
        else {
            target.push(node.view);
        }
    };
    EditorPart.prototype.getGroup = function (identifier) {
        return this.groupViews.get(identifier);
    };
    EditorPart.prototype.findGroup = function (scope, source, wrap) {
        if (source === void 0) { source = this.activeGroup; }
        // by direction
        if (typeof scope.direction === 'number') {
            return this.doFindGroupByDirection(scope.direction, source, wrap);
        }
        // by location
        return this.doFindGroupByLocation(scope.location, source, wrap);
    };
    EditorPart.prototype.doFindGroupByDirection = function (direction, source, wrap) {
        var _this = this;
        var sourceGroupView = this.assertGroupView(source);
        // Find neighbours and sort by our MRU list
        var neighbours = this.gridWidget.getNeighborViews(sourceGroupView, this.toGridViewDirection(direction), wrap);
        neighbours.sort((function (n1, n2) { return _this.mostRecentActiveGroups.indexOf(n1.id) - _this.mostRecentActiveGroups.indexOf(n2.id); }));
        return neighbours[0];
    };
    EditorPart.prototype.doFindGroupByLocation = function (location, source, wrap) {
        var sourceGroupView = this.assertGroupView(source);
        var groups = this.getGroups(2 /* GRID_APPEARANCE */);
        var index = groups.indexOf(sourceGroupView);
        switch (location) {
            case 0 /* FIRST */:
                return groups[0];
            case 1 /* LAST */:
                return groups[groups.length - 1];
            case 2 /* NEXT */:
                var nextGroup = groups[index + 1];
                if (!nextGroup && wrap) {
                    nextGroup = this.doFindGroupByLocation(0 /* FIRST */, source);
                }
                return nextGroup;
            case 3 /* PREVIOUS */:
                var previousGroup = groups[index - 1];
                if (!previousGroup && wrap) {
                    previousGroup = this.doFindGroupByLocation(1 /* LAST */, source);
                }
                return previousGroup;
        }
    };
    EditorPart.prototype.activateGroup = function (group) {
        var groupView = this.assertGroupView(group);
        this.doSetGroupActive(groupView);
        return groupView;
    };
    EditorPart.prototype.getSize = function (group) {
        var groupView = this.assertGroupView(group);
        return this.gridWidget.getViewSize(groupView);
    };
    EditorPart.prototype.setSize = function (group, size) {
        var groupView = this.assertGroupView(group);
        this.gridWidget.resizeView(groupView, size);
    };
    EditorPart.prototype.arrangeGroups = function (arrangement) {
        if (this.count < 2) {
            return; // require at least 2 groups to show
        }
        if (!this.gridWidget) {
            return; // we have not been created yet
        }
        // Even all group sizes
        if (arrangement === 1 /* EVEN */) {
            this.gridWidget.distributeViewSizes();
        }
        // Maximize the current active group
        else {
            this.gridWidget.maximizeViewSize(this.activeGroup);
        }
    };
    EditorPart.prototype.setGroupOrientation = function (orientation) {
        if (!this.gridWidget) {
            return; // we have not been created yet
        }
        var newOrientation = (orientation === 0 /* HORIZONTAL */) ? 1 /* HORIZONTAL */ : 0 /* VERTICAL */;
        if (this.gridWidget.orientation !== newOrientation) {
            this.gridWidget.orientation = newOrientation;
            // Mark preferred size as changed
            this.resetPreferredSize();
        }
    };
    EditorPart.prototype.applyLayout = function (layout) {
        var _this = this;
        var gridHasFocus = isAncestor(document.activeElement, this.container);
        // Determine how many groups we need overall
        var layoutGroupsCount = 0;
        function countGroups(groups) {
            groups.forEach(function (group) {
                if (Array.isArray(group.groups)) {
                    countGroups(group.groups);
                }
                else {
                    layoutGroupsCount++;
                }
            });
        }
        countGroups(layout.groups);
        // If we currently have too many groups, merge them into the last one
        var currentGroupViews = this.getGroups(2 /* GRID_APPEARANCE */);
        if (layoutGroupsCount < currentGroupViews.length) {
            var lastGroupInLayout_1 = currentGroupViews[layoutGroupsCount - 1];
            currentGroupViews.forEach(function (group, index) {
                if (index >= layoutGroupsCount) {
                    _this.mergeGroup(group, lastGroupInLayout_1);
                }
            });
            currentGroupViews = this.getGroups(2 /* GRID_APPEARANCE */);
        }
        var activeGroup = this.activeGroup;
        // Prepare grid descriptor to create new grid from
        var gridDescriptor = createSerializedGrid({
            orientation: this.toGridViewOrientation(layout.orientation, this.isTwoDimensionalGrid() ?
                this.gridWidget.orientation : // preserve original orientation for 2-dimensional grids
                orthogonal(this.gridWidget.orientation) // otherwise flip (fix https://github.com/Microsoft/vscode/issues/52975)
            ),
            groups: layout.groups
        });
        // Recreate gridwidget with descriptor
        this.doCreateGridControlWithState(gridDescriptor, activeGroup.id, currentGroupViews);
        // Layout
        this.doLayout(this.dimension);
        // Update container
        this.updateContainer();
        // Mark preferred size as changed
        this.resetPreferredSize();
        // Events for groups that got added
        this.getGroups(2 /* GRID_APPEARANCE */).forEach(function (groupView) {
            if (currentGroupViews.indexOf(groupView) === -1) {
                _this._onDidAddGroup.fire(groupView);
            }
        });
        // Update labels
        this.updateGroupLabels();
        // Restore focus as needed
        if (gridHasFocus) {
            this._activeGroup.focus();
        }
    };
    EditorPart.prototype.isTwoDimensionalGrid = function () {
        var views = this.gridWidget.getViews();
        if (isGridBranchNode(views)) {
            // the grid is 2-dimensional if any children
            // of the grid is a branch node
            return views.children.some(function (child) { return isGridBranchNode(child); });
        }
        return false;
    };
    EditorPart.prototype.addGroup = function (location, direction, options) {
        var locationView = this.assertGroupView(location);
        var group = this.doAddGroup(locationView, direction);
        if (options && options.activate) {
            this.doSetGroupActive(group);
        }
        return group;
    };
    EditorPart.prototype.doAddGroup = function (locationView, direction, groupToCopy) {
        var newGroupView = this.doCreateGroupView(groupToCopy);
        // Add to grid widget
        this.gridWidget.addView(newGroupView, "distribute" /* Distribute */, locationView, this.toGridViewDirection(direction));
        // Update container
        this.updateContainer();
        // Mark preferred size as changed
        this.resetPreferredSize();
        // Event
        this._onDidAddGroup.fire(newGroupView);
        // Update labels
        this.updateGroupLabels();
        return newGroupView;
    };
    EditorPart.prototype.doCreateGroupView = function (from) {
        var _this = this;
        // Label: just use the number of existing groups as label
        var label = this.getGroupLabel(this.count + 1);
        // Create group view
        var groupView;
        if (from instanceof EditorGroupView) {
            groupView = EditorGroupView.createCopy(from, this, label, this.instantiationService);
        }
        else if (isSerializedEditorGroup(from)) {
            groupView = EditorGroupView.createFromSerialized(from, this, label, this.instantiationService);
        }
        else {
            groupView = EditorGroupView.createNew(this, label, this.instantiationService);
        }
        // Keep in map
        this.groupViews.set(groupView.id, groupView);
        // Track focus
        var groupDisposables = [];
        groupDisposables.push(groupView.onDidFocus(function () {
            _this.doSetGroupActive(groupView);
        }));
        // Track editor change
        groupDisposables.push(groupView.onDidGroupChange(function (e) {
            if (e.kind === 5 /* EDITOR_ACTIVE */) {
                _this.updateContainer();
            }
        }));
        // Track dispose
        once(groupView.onWillDispose)(function () {
            groupDisposables = dispose(groupDisposables);
            _this.groupViews.delete(groupView.id);
            _this.doUpdateMostRecentActive(groupView);
        });
        return groupView;
    };
    EditorPart.prototype.doSetGroupActive = function (group) {
        if (this._activeGroup === group) {
            return; // return if this is already the active group
        }
        var previousActiveGroup = this._activeGroup;
        this._activeGroup = group;
        // Update list of most recently active groups
        this.doUpdateMostRecentActive(group, true);
        // Mark previous one as inactive
        if (previousActiveGroup) {
            previousActiveGroup.setActive(false);
        }
        // Mark group as new active
        group.setActive(true);
        // Maximize the group if it is currently minimized
        if (this.gridWidget) {
            var viewSize = this.gridWidget.getViewSize2(group);
            if (viewSize.width === group.minimumWidth || viewSize.height === group.minimumHeight) {
                this.arrangeGroups(0 /* MINIMIZE_OTHERS */);
            }
        }
        // Event
        this._onDidActiveGroupChange.fire(group);
    };
    EditorPart.prototype.doUpdateMostRecentActive = function (group, makeMostRecentlyActive) {
        var index = this.mostRecentActiveGroups.indexOf(group.id);
        // Remove from MRU list
        if (index !== -1) {
            this.mostRecentActiveGroups.splice(index, 1);
        }
        // Add to front as needed
        if (makeMostRecentlyActive) {
            this.mostRecentActiveGroups.unshift(group.id);
        }
    };
    EditorPart.prototype.toGridViewDirection = function (direction) {
        switch (direction) {
            case 0 /* UP */: return 0 /* Up */;
            case 1 /* DOWN */: return 1 /* Down */;
            case 2 /* LEFT */: return 2 /* Left */;
            case 3 /* RIGHT */: return 3 /* Right */;
        }
    };
    EditorPart.prototype.toGridViewOrientation = function (orientation, fallback) {
        if (typeof orientation === 'number') {
            return orientation === 0 /* HORIZONTAL */ ? 1 /* HORIZONTAL */ : 0 /* VERTICAL */;
        }
        return fallback;
    };
    EditorPart.prototype.removeGroup = function (group) {
        var groupView = this.assertGroupView(group);
        if (this.groupViews.size === 1) {
            return; // Cannot remove the last root group
        }
        // Remove empty group
        if (groupView.isEmpty()) {
            return this.doRemoveEmptyGroup(groupView);
        }
        // Remove group with editors
        this.doRemoveGroupWithEditors(groupView);
    };
    EditorPart.prototype.doRemoveGroupWithEditors = function (groupView) {
        var mostRecentlyActiveGroups = this.getGroups(1 /* MOST_RECENTLY_ACTIVE */);
        var lastActiveGroup;
        if (this._activeGroup === groupView) {
            lastActiveGroup = mostRecentlyActiveGroups[1];
        }
        else {
            lastActiveGroup = mostRecentlyActiveGroups[0];
        }
        // Removing a group with editors should merge these editors into the
        // last active group and then remove this group.
        this.mergeGroup(groupView, lastActiveGroup);
    };
    EditorPart.prototype.doRemoveEmptyGroup = function (groupView) {
        var gridHasFocus = isAncestor(document.activeElement, this.container);
        // Activate next group if the removed one was active
        if (this._activeGroup === groupView) {
            var mostRecentlyActiveGroups = this.getGroups(1 /* MOST_RECENTLY_ACTIVE */);
            var nextActiveGroup = mostRecentlyActiveGroups[1]; // [0] will be the current group we are about to dispose
            this.activateGroup(nextActiveGroup);
        }
        // Remove from grid widget & dispose
        this.gridWidget.removeView(groupView, "distribute" /* Distribute */);
        groupView.dispose();
        // Restore focus if we had it previously (we run this after gridWidget.removeView() is called
        // because removing a view can mean to reparent it and thus focus would be removed otherwise)
        if (gridHasFocus) {
            this._activeGroup.focus();
        }
        // Update labels
        this.updateGroupLabels();
        // Update container
        this.updateContainer();
        // Mark preferred size as changed
        this.resetPreferredSize();
        // Event
        this._onDidRemoveGroup.fire(groupView);
    };
    EditorPart.prototype.moveGroup = function (group, location, direction) {
        var sourceView = this.assertGroupView(group);
        var targetView = this.assertGroupView(location);
        if (sourceView.id === targetView.id) {
            throw new Error('Cannot move group into its own');
        }
        var groupHasFocus = isAncestor(document.activeElement, sourceView.element);
        // Move through grid widget API
        this.gridWidget.moveView(sourceView, "distribute" /* Distribute */, targetView, this.toGridViewDirection(direction));
        // Restore focus if we had it previously (we run this after gridWidget.removeView() is called
        // because removing a view can mean to reparent it and thus focus would be removed otherwise)
        if (groupHasFocus) {
            sourceView.focus();
        }
        // Event
        this._onDidMoveGroup.fire(sourceView);
        return sourceView;
    };
    EditorPart.prototype.copyGroup = function (group, location, direction) {
        var groupView = this.assertGroupView(group);
        var locationView = this.assertGroupView(location);
        var groupHasFocus = isAncestor(document.activeElement, groupView.element);
        // Copy the group view
        var copiedGroupView = this.doAddGroup(locationView, direction, groupView);
        // Restore focus if we had it
        if (groupHasFocus) {
            copiedGroupView.focus();
        }
        return copiedGroupView;
    };
    EditorPart.prototype.mergeGroup = function (group, target, options) {
        var _this = this;
        var sourceView = this.assertGroupView(group);
        var targetView = this.assertGroupView(target);
        // Move/Copy editors over into target
        var index = (options && typeof options.index === 'number') ? options.index : targetView.count;
        sourceView.editors.forEach(function (editor) {
            var inactive = !sourceView.isActive(editor) || _this._activeGroup !== sourceView;
            var copyOptions = { index: index, inactive: inactive, preserveFocus: inactive };
            if (options && options.mode === 0 /* COPY_EDITORS */) {
                sourceView.copyEditor(editor, targetView, copyOptions);
            }
            else {
                sourceView.moveEditor(editor, targetView, copyOptions);
            }
            index++;
        });
        // Remove source if the view is now empty and not already removed
        if (sourceView.isEmpty() && !sourceView.disposed /* could have been disposed already via workbench.editor.closeEmptyGroups setting */) {
            this.removeGroup(sourceView);
        }
        return targetView;
    };
    EditorPart.prototype.assertGroupView = function (group) {
        if (typeof group === 'number') {
            group = this.getGroup(group);
        }
        if (!group) {
            throw new Error('Invalid editor group provided!');
        }
        return group;
    };
    Object.defineProperty(EditorPart.prototype, "minimumWidth", {
        //#endregion
        //#region Part
        get: function () { return this.centeredLayoutWidget.minimumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "maximumWidth", {
        get: function () { return this.centeredLayoutWidget.maximumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "minimumHeight", {
        get: function () { return this.centeredLayoutWidget.minimumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "maximumHeight", {
        get: function () { return this.centeredLayoutWidget.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorPart.prototype, "preferredSize", {
        get: function () {
            if (!this._preferredSize) {
                this._preferredSize = new Dimension(this.gridWidget.minimumWidth, this.gridWidget.minimumHeight);
            }
            return this._preferredSize;
        },
        enumerable: true,
        configurable: true
    });
    EditorPart.prototype.resetPreferredSize = function () {
        // Reset (will be computed upon next access)
        this._preferredSize = void 0;
        // Event
        this._onDidPreferredSizeChange.fire();
    };
    Object.defineProperty(EditorPart.prototype, "gridSeparatorBorder", {
        get: function () {
            return this.theme.getColor(EDITOR_GROUP_BORDER) || this.theme.getColor(contrastBorder) || Color.transparent;
        },
        enumerable: true,
        configurable: true
    });
    EditorPart.prototype.updateStyles = function () {
        this.container.style.backgroundColor = this.getColor(editorBackground);
        var separatorBorderStyle = { separatorBorder: this.gridSeparatorBorder, background: this.theme.getColor(EDITOR_PANE_BACKGROUND) || Color.transparent };
        this.gridWidget.style(separatorBorderStyle);
        this.centeredLayoutWidget.styles(separatorBorderStyle);
    };
    EditorPart.prototype.createContentArea = function (parent) {
        // Container
        this.container = document.createElement('div');
        addClass(this.container, 'content');
        parent.appendChild(this.container);
        // Grid control with center layout
        this.doCreateGridControl();
        this.centeredLayoutWidget = this._register(new CenteredViewLayout(this.container, this.gridWidgetView, this.globalMemento[EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY]));
        // Drop support
        this._register(this.instantiationService.createInstance(EditorDropTarget, this, this.container));
        return this.container;
    };
    EditorPart.prototype.centerLayout = function (active) {
        this.centeredLayoutWidget.activate(active);
    };
    EditorPart.prototype.isLayoutCentered = function () {
        return this.centeredLayoutWidget.isActive();
    };
    EditorPart.prototype.doCreateGridControl = function () {
        var _this = this;
        // Grid Widget (with previous UI state)
        if (this.restorePreviousState) {
            this.doCreateGridControlWithPreviousState();
        }
        // Grid Widget (no previous UI state or failed to restore)
        if (!this.gridWidget) {
            var initialGroup = this.doCreateGroupView();
            this.doSetGridWidget(new SerializableGrid(initialGroup));
            // Ensure a group is active
            this.doSetGroupActive(initialGroup);
        }
        // Signal restored
        always(TPromise.join(this.groups.map(function (group) { return group.whenRestored; })), function () { return _this.whenRestoredComplete(void 0); });
        // Update container
        this.updateContainer();
    };
    EditorPart.prototype.doCreateGridControlWithPreviousState = function () {
        var uiState = this.memento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY];
        if (uiState && uiState.serializedGrid) {
            try {
                // MRU
                this.mostRecentActiveGroups = uiState.mostRecentActiveGroups;
                // Grid Widget
                this.doCreateGridControlWithState(uiState.serializedGrid, uiState.activeGroup);
                // Ensure last active group has focus
                this._activeGroup.focus();
            }
            catch (error) {
                this.handleGridRestoreError(error, uiState);
            }
        }
    };
    EditorPart.prototype.handleGridRestoreError = function (error, state) {
        // Log error
        onUnexpectedError(new Error("Error restoring editor grid widget: " + error + " (with state: " + JSON.stringify(state) + ")"));
        // Clear any state we have from the failing restore
        if (this.gridWidget) {
            this.doSetGridWidget();
        }
        this.groupViews.forEach(function (group) { return group.dispose(); });
        this.groupViews.clear();
        this._activeGroup = void 0;
        this.mostRecentActiveGroups = [];
    };
    EditorPart.prototype.doCreateGridControlWithState = function (serializedGrid, activeGroupId, editorGroupViewsToReuse) {
        var _this = this;
        // Determine group views to reuse if any
        var reuseGroupViews;
        if (editorGroupViewsToReuse) {
            reuseGroupViews = editorGroupViewsToReuse.slice(0); // do not modify original array
        }
        else {
            reuseGroupViews = [];
        }
        // Create new
        var groupViews = [];
        var gridWidget = SerializableGrid.deserialize(serializedGrid, {
            fromJSON: function (serializedEditorGroup) {
                var groupView;
                if (reuseGroupViews.length > 0) {
                    groupView = reuseGroupViews.shift();
                }
                else {
                    groupView = _this.doCreateGroupView(serializedEditorGroup);
                }
                groupViews.push(groupView);
                if (groupView.id === activeGroupId) {
                    _this.doSetGroupActive(groupView);
                }
                return groupView;
            }
        }, { styles: { separatorBorder: this.gridSeparatorBorder } });
        // If the active group was not found when restoring the grid
        // make sure to make at least one group active. We always need
        // an active group.
        if (!this._activeGroup) {
            this.doSetGroupActive(groupViews[0]);
        }
        // Validate MRU group views matches grid widget state
        if (this.mostRecentActiveGroups.some(function (groupId) { return !_this.getGroup(groupId); })) {
            this.mostRecentActiveGroups = groupViews.map(function (group) { return group.id; });
        }
        // Set it
        this.doSetGridWidget(gridWidget);
    };
    EditorPart.prototype.doSetGridWidget = function (gridWidget) {
        if (this.gridWidget) {
            this.gridWidget.dispose();
        }
        this.gridWidget = gridWidget;
        this.gridWidgetView.gridWidget = gridWidget;
        if (gridWidget) {
            this._onDidSizeConstraintsChange.input = gridWidget.onDidChange;
        }
        this.onDidSetGridWidget.fire();
    };
    EditorPart.prototype.updateContainer = function () {
        toggleClass(this.container, 'empty', this.isEmpty());
    };
    EditorPart.prototype.updateGroupLabels = function () {
        var _this = this;
        // Since our labels are created using the index of the
        // group, adding/removing a group might produce gaps.
        // So we iterate over all groups and reassign the label
        // based on the index.
        this.getGroups(2 /* GRID_APPEARANCE */).forEach(function (group, index) {
            group.setLabel(_this.getGroupLabel(index + 1));
        });
    };
    EditorPart.prototype.getGroupLabel = function (index) {
        return localize('groupLabel', "Group {0}", index);
    };
    EditorPart.prototype.isEmpty = function () {
        return this.groupViews.size === 1 && this._activeGroup.isEmpty();
    };
    EditorPart.prototype.layout = function (dimension) {
        var sizes = _super.prototype.layout.call(this, dimension);
        this.doLayout(sizes[1]);
        return sizes;
    };
    EditorPart.prototype.doLayout = function (dimension) {
        this.dimension = dimension;
        // Layout Grid
        this.centeredLayoutWidget.layout(this.dimension.width, this.dimension.height);
        // Event
        this._onDidLayout.fire(dimension);
    };
    EditorPart.prototype.shutdown = function () {
        // Persist grid UI state
        if (this.gridWidget) {
            var uiState = {
                serializedGrid: this.gridWidget.serialize(),
                activeGroup: this._activeGroup.id,
                mostRecentActiveGroups: this.mostRecentActiveGroups
            };
            if (this.isEmpty()) {
                delete this.memento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY];
            }
            else {
                this.memento[EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY] = uiState;
            }
        }
        // Persist centered view state
        this.globalMemento[EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY] = this.centeredLayoutWidget.state;
        // Forward to all groups
        this.groupViews.forEach(function (group) { return group.shutdown(); });
        _super.prototype.shutdown.call(this);
    };
    EditorPart.prototype.dispose = function () {
        // Forward to all groups
        this.groupViews.forEach(function (group) { return group.dispose(); });
        this.groupViews.clear();
        // Grid widget
        if (this.gridWidget) {
            this.gridWidget.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    EditorPart.EDITOR_PART_UI_STATE_STORAGE_KEY = 'editorpart.state';
    EditorPart.EDITOR_PART_CENTERED_VIEW_STORAGE_KEY = 'editorpart.centeredview';
    EditorPart = __decorate([
        __param(2, IInstantiationService),
        __param(3, IThemeService),
        __param(4, IConfigurationService),
        __param(5, IStorageService)
    ], EditorPart);
    return EditorPart;
}(Part));
export { EditorPart };
