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
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../common/winjs.base.js';
import * as types from '../../../common/types.js';
import { IconLabel } from '../../../browser/ui/iconLabel/iconLabel.js';
import { compareAnything } from '../../../common/comparers.js';
import { ActionBar } from '../../../browser/ui/actionbar/actionbar.js';
import { HighlightedLabel } from '../../../browser/ui/highlightedlabel/highlightedLabel.js';
import * as DOM from '../../../browser/dom.js';
import { KeybindingLabel } from '../../../browser/ui/keybindingLabel/keybindingLabel.js';
import { OS } from '../../../common/platform.js';
var IDS = 0;
var QuickOpenItemAccessorClass = /** @class */ (function () {
    function QuickOpenItemAccessorClass() {
    }
    QuickOpenItemAccessorClass.prototype.getItemLabel = function (entry) {
        return entry.getLabel();
    };
    QuickOpenItemAccessorClass.prototype.getItemDescription = function (entry) {
        return entry.getDescription();
    };
    QuickOpenItemAccessorClass.prototype.getItemPath = function (entry) {
        var resource = entry.getResource();
        return resource ? resource.fsPath : void 0;
    };
    return QuickOpenItemAccessorClass;
}());
export { QuickOpenItemAccessorClass };
export var QuickOpenItemAccessor = new QuickOpenItemAccessorClass();
var QuickOpenEntry = /** @class */ (function () {
    function QuickOpenEntry(highlights) {
        if (highlights === void 0) { highlights = []; }
        this.id = (IDS++).toString();
        this.labelHighlights = highlights;
        this.descriptionHighlights = [];
    }
    /**
     * A unique identifier for the entry
     */
    QuickOpenEntry.prototype.getId = function () {
        return this.id;
    };
    /**
     * The label of the entry to identify it from others in the list
     */
    QuickOpenEntry.prototype.getLabel = function () {
        return null;
    };
    /**
     * The options for the label to use for this entry
     */
    QuickOpenEntry.prototype.getLabelOptions = function () {
        return null;
    };
    /**
     * The label of the entry to use when a screen reader wants to read about the entry
     */
    QuickOpenEntry.prototype.getAriaLabel = function () {
        return this.getLabel();
    };
    /**
     * Detail information about the entry that is optional and can be shown below the label
     */
    QuickOpenEntry.prototype.getDetail = function () {
        return null;
    };
    /**
     * The icon of the entry to identify it from others in the list
     */
    QuickOpenEntry.prototype.getIcon = function () {
        return null;
    };
    /**
     * A secondary description that is optional and can be shown right to the label
     */
    QuickOpenEntry.prototype.getDescription = function () {
        return null;
    };
    /**
     * A tooltip to show when hovering over the entry.
     */
    QuickOpenEntry.prototype.getTooltip = function () {
        return null;
    };
    /**
     * A tooltip to show when hovering over the description portion of the entry.
     */
    QuickOpenEntry.prototype.getDescriptionTooltip = function () {
        return null;
    };
    /**
     * An optional keybinding to show for an entry.
     */
    QuickOpenEntry.prototype.getKeybinding = function () {
        return null;
    };
    /**
     * A resource for this entry. Resource URIs can be used to compare different kinds of entries and group
     * them together.
     */
    QuickOpenEntry.prototype.getResource = function () {
        return null;
    };
    /**
     * Allows to reuse the same model while filtering. Hidden entries will not show up in the viewer.
     */
    QuickOpenEntry.prototype.isHidden = function () {
        return this.hidden;
    };
    /**
     * Allows to reuse the same model while filtering. Hidden entries will not show up in the viewer.
     */
    QuickOpenEntry.prototype.setHidden = function (hidden) {
        this.hidden = hidden;
    };
    /**
     * Allows to set highlight ranges that should show up for the entry label and optionally description if set.
     */
    QuickOpenEntry.prototype.setHighlights = function (labelHighlights, descriptionHighlights, detailHighlights) {
        this.labelHighlights = labelHighlights;
        this.descriptionHighlights = descriptionHighlights;
        this.detailHighlights = detailHighlights;
    };
    /**
     * Allows to return highlight ranges that should show up for the entry label and description.
     */
    QuickOpenEntry.prototype.getHighlights = function () {
        return [this.labelHighlights, this.descriptionHighlights, this.detailHighlights];
    };
    /**
     * Called when the entry is selected for opening. Returns a boolean value indicating if an action was performed or not.
     * The mode parameter gives an indication if the element is previewed (using arrow keys) or opened.
     *
     * The context parameter provides additional context information how the run was triggered.
     */
    QuickOpenEntry.prototype.run = function (mode, context) {
        return false;
    };
    /**
     * Determines if this quick open entry should merge with the editor history in quick open. If set to true
     * and the resource of this entry is the same as the resource for an editor history, it will not show up
     * because it is considered to be a duplicate of an editor history.
     */
    QuickOpenEntry.prototype.mergeWithEditorHistory = function () {
        return false;
    };
    return QuickOpenEntry;
}());
export { QuickOpenEntry };
var QuickOpenEntryGroup = /** @class */ (function (_super) {
    __extends(QuickOpenEntryGroup, _super);
    function QuickOpenEntryGroup(entry, groupLabel, withBorder) {
        var _this = _super.call(this) || this;
        _this.entry = entry;
        _this.groupLabel = groupLabel;
        _this.withBorder = withBorder;
        return _this;
    }
    /**
     * The label of the group or null if none.
     */
    QuickOpenEntryGroup.prototype.getGroupLabel = function () {
        return this.groupLabel;
    };
    QuickOpenEntryGroup.prototype.setGroupLabel = function (groupLabel) {
        this.groupLabel = groupLabel;
    };
    /**
     * Whether to show a border on top of the group entry or not.
     */
    QuickOpenEntryGroup.prototype.showBorder = function () {
        return this.withBorder;
    };
    QuickOpenEntryGroup.prototype.setShowBorder = function (showBorder) {
        this.withBorder = showBorder;
    };
    QuickOpenEntryGroup.prototype.getLabel = function () {
        return this.entry ? this.entry.getLabel() : _super.prototype.getLabel.call(this);
    };
    QuickOpenEntryGroup.prototype.getLabelOptions = function () {
        return this.entry ? this.entry.getLabelOptions() : _super.prototype.getLabelOptions.call(this);
    };
    QuickOpenEntryGroup.prototype.getAriaLabel = function () {
        return this.entry ? this.entry.getAriaLabel() : _super.prototype.getAriaLabel.call(this);
    };
    QuickOpenEntryGroup.prototype.getDetail = function () {
        return this.entry ? this.entry.getDetail() : _super.prototype.getDetail.call(this);
    };
    QuickOpenEntryGroup.prototype.getResource = function () {
        return this.entry ? this.entry.getResource() : _super.prototype.getResource.call(this);
    };
    QuickOpenEntryGroup.prototype.getIcon = function () {
        return this.entry ? this.entry.getIcon() : _super.prototype.getIcon.call(this);
    };
    QuickOpenEntryGroup.prototype.getDescription = function () {
        return this.entry ? this.entry.getDescription() : _super.prototype.getDescription.call(this);
    };
    QuickOpenEntryGroup.prototype.getEntry = function () {
        return this.entry;
    };
    QuickOpenEntryGroup.prototype.getHighlights = function () {
        return this.entry ? this.entry.getHighlights() : _super.prototype.getHighlights.call(this);
    };
    QuickOpenEntryGroup.prototype.isHidden = function () {
        return this.entry ? this.entry.isHidden() : _super.prototype.isHidden.call(this);
    };
    QuickOpenEntryGroup.prototype.setHighlights = function (labelHighlights, descriptionHighlights, detailHighlights) {
        this.entry ? this.entry.setHighlights(labelHighlights, descriptionHighlights, detailHighlights) : _super.prototype.setHighlights.call(this, labelHighlights, descriptionHighlights, detailHighlights);
    };
    QuickOpenEntryGroup.prototype.setHidden = function (hidden) {
        this.entry ? this.entry.setHidden(hidden) : _super.prototype.setHidden.call(this, hidden);
    };
    QuickOpenEntryGroup.prototype.run = function (mode, context) {
        return this.entry ? this.entry.run(mode, context) : _super.prototype.run.call(this, mode, context);
    };
    return QuickOpenEntryGroup;
}(QuickOpenEntry));
export { QuickOpenEntryGroup };
var NoActionProvider = /** @class */ (function () {
    function NoActionProvider() {
    }
    NoActionProvider.prototype.hasActions = function (tree, element) {
        return false;
    };
    NoActionProvider.prototype.getActions = function (tree, element) {
        return TPromise.as(null);
    };
    NoActionProvider.prototype.hasSecondaryActions = function (tree, element) {
        return false;
    };
    NoActionProvider.prototype.getSecondaryActions = function (tree, element) {
        return TPromise.as(null);
    };
    NoActionProvider.prototype.getActionItem = function (tree, element, action) {
        return null;
    };
    return NoActionProvider;
}());
var templateEntry = 'quickOpenEntry';
var templateEntryGroup = 'quickOpenEntryGroup';
var Renderer = /** @class */ (function () {
    function Renderer(actionProvider, actionRunner) {
        if (actionProvider === void 0) { actionProvider = new NoActionProvider(); }
        if (actionRunner === void 0) { actionRunner = null; }
        this.actionProvider = actionProvider;
        this.actionRunner = actionRunner;
    }
    Renderer.prototype.getHeight = function (entry) {
        if (entry.getDetail()) {
            return 44;
        }
        return 22;
    };
    Renderer.prototype.getTemplateId = function (entry) {
        if (entry instanceof QuickOpenEntryGroup) {
            return templateEntryGroup;
        }
        return templateEntry;
    };
    Renderer.prototype.renderTemplate = function (templateId, container, styles) {
        var entryContainer = document.createElement('div');
        DOM.addClass(entryContainer, 'sub-content');
        container.appendChild(entryContainer);
        // Entry
        var row1 = DOM.$('.quick-open-row');
        var row2 = DOM.$('.quick-open-row');
        var entry = DOM.$('.quick-open-entry', null, row1, row2);
        entryContainer.appendChild(entry);
        // Icon
        var icon = document.createElement('span');
        row1.appendChild(icon);
        // Label
        var label = new IconLabel(row1, { supportHighlights: true, supportDescriptionHighlights: true });
        // Keybinding
        var keybindingContainer = document.createElement('span');
        row1.appendChild(keybindingContainer);
        DOM.addClass(keybindingContainer, 'quick-open-entry-keybinding');
        var keybinding = new KeybindingLabel(keybindingContainer, OS);
        // Detail
        var detailContainer = document.createElement('div');
        row2.appendChild(detailContainer);
        DOM.addClass(detailContainer, 'quick-open-entry-meta');
        var detail = new HighlightedLabel(detailContainer);
        // Entry Group
        var group;
        if (templateId === templateEntryGroup) {
            group = document.createElement('div');
            DOM.addClass(group, 'results-group');
            container.appendChild(group);
        }
        // Actions
        DOM.addClass(container, 'actions');
        var actionBarContainer = document.createElement('div');
        DOM.addClass(actionBarContainer, 'primary-action-bar');
        container.appendChild(actionBarContainer);
        var actionBar = new ActionBar(actionBarContainer, {
            actionRunner: this.actionRunner
        });
        return {
            container: container,
            entry: entry,
            icon: icon,
            label: label,
            detail: detail,
            keybinding: keybinding,
            group: group,
            actionBar: actionBar
        };
    };
    Renderer.prototype.renderElement = function (entry, templateId, data, styles) {
        // Action Bar
        if (this.actionProvider.hasActions(null, entry)) {
            DOM.addClass(data.container, 'has-actions');
        }
        else {
            DOM.removeClass(data.container, 'has-actions');
        }
        data.actionBar.context = entry; // make sure the context is the current element
        this.actionProvider.getActions(null, entry).then(function (actions) {
            if (data.actionBar.isEmpty() && actions && actions.length > 0) {
                data.actionBar.push(actions, { icon: true, label: false });
            }
            else if (!data.actionBar.isEmpty() && (!actions || actions.length === 0)) {
                data.actionBar.clear();
            }
        });
        // Entry group class
        if (entry instanceof QuickOpenEntryGroup && entry.getGroupLabel()) {
            DOM.addClass(data.container, 'has-group-label');
        }
        else {
            DOM.removeClass(data.container, 'has-group-label');
        }
        // Entry group
        if (entry instanceof QuickOpenEntryGroup) {
            var group = entry;
            var groupData = data;
            // Border
            if (group.showBorder()) {
                DOM.addClass(groupData.container, 'results-group-separator');
                groupData.container.style.borderTopColor = styles.pickerGroupBorder.toString();
            }
            else {
                DOM.removeClass(groupData.container, 'results-group-separator');
                groupData.container.style.borderTopColor = null;
            }
            // Group Label
            var groupLabel = group.getGroupLabel() || '';
            groupData.group.textContent = groupLabel;
            groupData.group.style.color = styles.pickerGroupForeground.toString();
        }
        // Normal Entry
        if (entry instanceof QuickOpenEntry) {
            var _a = entry.getHighlights(), labelHighlights = _a[0], descriptionHighlights = _a[1], detailHighlights = _a[2];
            // Icon
            var iconClass = entry.getIcon() ? ('quick-open-entry-icon ' + entry.getIcon()) : '';
            data.icon.className = iconClass;
            // Label
            var options = entry.getLabelOptions() || Object.create(null);
            options.matches = labelHighlights || [];
            options.title = entry.getTooltip();
            options.descriptionTitle = entry.getDescriptionTooltip() || entry.getDescription(); // tooltip over description because it could overflow
            options.descriptionMatches = descriptionHighlights || [];
            data.label.setValue(entry.getLabel(), entry.getDescription(), options);
            // Meta
            data.detail.set(entry.getDetail(), detailHighlights);
            // Keybinding
            data.keybinding.set(entry.getKeybinding(), null);
        }
    };
    Renderer.prototype.disposeTemplate = function (templateId, templateData) {
        var data = templateData;
        data.actionBar.dispose();
        data.actionBar = null;
        data.container = null;
        data.entry = null;
        data.keybinding.dispose();
        data.keybinding = null;
        data.detail.dispose();
        data.detail = null;
        data.group = null;
        data.icon = null;
        data.label.dispose();
        data.label = null;
    };
    return Renderer;
}());
var QuickOpenModel = /** @class */ (function () {
    function QuickOpenModel(entries, actionProvider) {
        if (entries === void 0) { entries = []; }
        if (actionProvider === void 0) { actionProvider = new NoActionProvider(); }
        this._entries = entries;
        this._dataSource = this;
        this._renderer = new Renderer(actionProvider);
        this._filter = this;
        this._runner = this;
        this._accessibilityProvider = this;
    }
    Object.defineProperty(QuickOpenModel.prototype, "entries", {
        get: function () { return this._entries; },
        set: function (entries) {
            this._entries = entries;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenModel.prototype, "dataSource", {
        get: function () { return this._dataSource; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenModel.prototype, "renderer", {
        get: function () { return this._renderer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenModel.prototype, "filter", {
        get: function () { return this._filter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenModel.prototype, "runner", {
        get: function () { return this._runner; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenModel.prototype, "accessibilityProvider", {
        get: function () { return this._accessibilityProvider; },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds entries that should show up in the quick open viewer.
     */
    QuickOpenModel.prototype.addEntries = function (entries) {
        if (types.isArray(entries)) {
            this._entries = this._entries.concat(entries);
        }
    };
    /**
     * Set the entries that should show up in the quick open viewer.
     */
    QuickOpenModel.prototype.setEntries = function (entries) {
        if (types.isArray(entries)) {
            this._entries = entries;
        }
    };
    /**
     * Get the entries that should show up in the quick open viewer.
     *
     * @visibleOnly optional parameter to only return visible entries
     */
    QuickOpenModel.prototype.getEntries = function (visibleOnly) {
        if (visibleOnly) {
            return this._entries.filter(function (e) { return !e.isHidden(); });
        }
        return this._entries;
    };
    QuickOpenModel.prototype.getId = function (entry) {
        return entry.getId();
    };
    QuickOpenModel.prototype.getLabel = function (entry) {
        return entry.getLabel();
    };
    QuickOpenModel.prototype.getAriaLabel = function (entry) {
        var ariaLabel = entry.getAriaLabel();
        if (ariaLabel) {
            return nls.localize('quickOpenAriaLabelEntry', "{0}, picker", entry.getAriaLabel());
        }
        return nls.localize('quickOpenAriaLabel', "picker");
    };
    QuickOpenModel.prototype.isVisible = function (entry) {
        return !entry.isHidden();
    };
    QuickOpenModel.prototype.run = function (entry, mode, context) {
        return entry.run(mode, context);
    };
    return QuickOpenModel;
}());
export { QuickOpenModel };
/**
 * A good default sort implementation for quick open entries respecting highlight information
 * as well as associated resources.
 */
export function compareEntries(elementA, elementB, lookFor) {
    // Give matches with label highlights higher priority over
    // those with only description highlights
    var labelHighlightsA = elementA.getHighlights()[0] || [];
    var labelHighlightsB = elementB.getHighlights()[0] || [];
    if (labelHighlightsA.length && !labelHighlightsB.length) {
        return -1;
    }
    if (!labelHighlightsA.length && labelHighlightsB.length) {
        return 1;
    }
    // Fallback to the full path if labels are identical and we have associated resources
    var nameA = elementA.getLabel();
    var nameB = elementB.getLabel();
    if (nameA === nameB) {
        var resourceA = elementA.getResource();
        var resourceB = elementB.getResource();
        if (resourceA && resourceB) {
            nameA = resourceA.fsPath;
            nameB = resourceB.fsPath;
        }
    }
    return compareAnything(nameA, nameB, lookFor);
}
