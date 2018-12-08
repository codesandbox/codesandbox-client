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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './media/statusbarpart.css';
import * as nls from '../../../../nls.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { OcticonLabel } from '../../../../base/browser/ui/octiconLabel/octiconLabel.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Part } from '../../part.js';
import { Extensions } from './statusbar.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { Action } from '../../../../base/common/actions.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { STATUS_BAR_BACKGROUND, STATUS_BAR_FOREGROUND, STATUS_BAR_NO_FOLDER_BACKGROUND, STATUS_BAR_ITEM_HOVER_BACKGROUND, STATUS_BAR_ITEM_ACTIVE_BACKGROUND, STATUS_BAR_PROMINENT_ITEM_BACKGROUND, STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND, STATUS_BAR_BORDER, STATUS_BAR_NO_FOLDER_FOREGROUND, STATUS_BAR_NO_FOLDER_BORDER } from '../../../common/theme.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { isThemeColor } from '../../../../editor/common/editorCommon.js';
import { Color } from '../../../../base/common/color.js';
import { addClass, EventHelper, createStyleSheet, addDisposableListener } from '../../../../base/browser/dom.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
var StatusbarPart = /** @class */ (function (_super) {
    __extends(StatusbarPart, _super);
    function StatusbarPart(id, instantiationService, themeService, contextService, storageService) {
        var _this = _super.call(this, id, { hasTitle: false }, themeService, storageService) || this;
        _this.instantiationService = instantiationService;
        _this.contextService = contextService;
        _this.registerListeners();
        return _this;
    }
    StatusbarPart.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.contextService.onDidChangeWorkbenchState(function () { return _this.updateStyles(); }));
    };
    StatusbarPart.prototype.addEntry = function (entry, alignment, priority) {
        if (priority === void 0) { priority = 0; }
        // Render entry in status bar
        var el = this.doCreateStatusItem(alignment, priority, entry.showBeak ? 'has-beak' : void 0);
        var item = this.instantiationService.createInstance(StatusBarEntryItem, entry);
        var toDispose = item.render(el);
        // Insert according to priority
        var container = this.statusItemsContainer;
        var neighbours = this.getEntries(alignment);
        var inserted = false;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            var nPriority = Number(neighbour.getAttribute(StatusbarPart.PRIORITY_PROP));
            if (alignment === 0 /* LEFT */ && nPriority < priority ||
                alignment === 1 /* RIGHT */ && nPriority > priority) {
                container.insertBefore(el, neighbour);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            container.appendChild(el);
        }
        return toDisposable(function () {
            el.remove();
            if (toDispose) {
                toDispose.dispose();
            }
        });
    };
    StatusbarPart.prototype.getEntries = function (alignment) {
        var entries = [];
        var container = this.statusItemsContainer;
        var children = container.children;
        for (var i = 0; i < children.length; i++) {
            var childElement = children.item(i);
            if (Number(childElement.getAttribute(StatusbarPart.ALIGNMENT_PROP)) === alignment) {
                entries.push(childElement);
            }
        }
        return entries;
    };
    StatusbarPart.prototype.createContentArea = function (parent) {
        this.statusItemsContainer = parent;
        // Fill in initial items that were contributed from the registry
        var registry = Registry.as(Extensions.Statusbar);
        var descriptors = registry.items.slice().sort(function (a, b) {
            if (a.alignment === b.alignment) {
                if (a.alignment === 0 /* LEFT */) {
                    return b.priority - a.priority;
                }
                else {
                    return a.priority - b.priority;
                }
            }
            else if (a.alignment === 0 /* LEFT */) {
                return 1;
            }
            else if (a.alignment === 1 /* RIGHT */) {
                return -1;
            }
            else {
                return 0;
            }
        });
        for (var _i = 0, descriptors_1 = descriptors; _i < descriptors_1.length; _i++) {
            var descriptor = descriptors_1[_i];
            var item = this.instantiationService.createInstance(descriptor.syncDescriptor);
            var el = this.doCreateStatusItem(descriptor.alignment, descriptor.priority);
            this._register(item.render(el));
            this.statusItemsContainer.appendChild(el);
        }
        return this.statusItemsContainer;
    };
    StatusbarPart.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
        var container = this.getContainer();
        // Background colors
        var backgroundColor = this.getColor(this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ? STATUS_BAR_BACKGROUND : STATUS_BAR_NO_FOLDER_BACKGROUND);
        container.style.backgroundColor = backgroundColor;
        container.style.color = this.getColor(this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ? STATUS_BAR_FOREGROUND : STATUS_BAR_NO_FOLDER_FOREGROUND);
        // Border color
        var borderColor = this.getColor(this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ? STATUS_BAR_BORDER : STATUS_BAR_NO_FOLDER_BORDER) || this.getColor(contrastBorder);
        container.style.borderTopWidth = borderColor ? '1px' : null;
        container.style.borderTopStyle = borderColor ? 'solid' : null;
        container.style.borderTopColor = borderColor;
        // Notification Beak
        if (!this.styleElement) {
            this.styleElement = createStyleSheet(container);
        }
        this.styleElement.innerHTML = ".monaco-workbench > .part.statusbar > .statusbar-item.has-beak:before { border-bottom-color: " + backgroundColor + "; }";
    };
    StatusbarPart.prototype.doCreateStatusItem = function (alignment, priority, extraClass) {
        if (priority === void 0) { priority = 0; }
        var el = document.createElement('div');
        addClass(el, 'statusbar-item');
        if (extraClass) {
            addClass(el, extraClass);
        }
        if (alignment === 1 /* RIGHT */) {
            addClass(el, 'right');
        }
        else {
            addClass(el, 'left');
        }
        el.setAttribute(StatusbarPart.PRIORITY_PROP, String(priority));
        el.setAttribute(StatusbarPart.ALIGNMENT_PROP, String(alignment));
        return el;
    };
    StatusbarPart.prototype.setStatusMessage = function (message, autoDisposeAfter, delayBy) {
        var _this = this;
        if (autoDisposeAfter === void 0) { autoDisposeAfter = -1; }
        if (delayBy === void 0) { delayBy = 0; }
        if (this.statusMsgDispose) {
            this.statusMsgDispose.dispose(); // dismiss any previous
        }
        // Create new
        var statusDispose;
        var showHandle = setTimeout(function () {
            statusDispose = _this.addEntry({ text: message }, 0 /* LEFT */, -Number.MAX_VALUE /* far right on left hand side */);
            showHandle = null;
        }, delayBy);
        var hideHandle;
        // Dispose function takes care of timeouts and actual entry
        var dispose = {
            dispose: function () {
                if (showHandle) {
                    clearTimeout(showHandle);
                }
                if (hideHandle) {
                    clearTimeout(hideHandle);
                }
                if (statusDispose) {
                    statusDispose.dispose();
                }
            }
        };
        this.statusMsgDispose = dispose;
        if (typeof autoDisposeAfter === 'number' && autoDisposeAfter > 0) {
            hideHandle = setTimeout(function () { return dispose.dispose(); }, autoDisposeAfter);
        }
        return dispose;
    };
    StatusbarPart.PRIORITY_PROP = 'statusbar-entry-priority';
    StatusbarPart.ALIGNMENT_PROP = 'statusbar-entry-alignment';
    StatusbarPart = __decorate([
        __param(1, IInstantiationService),
        __param(2, IThemeService),
        __param(3, IWorkspaceContextService),
        __param(4, IStorageService)
    ], StatusbarPart);
    return StatusbarPart;
}(Part));
export { StatusbarPart };
var manageExtensionAction;
var StatusBarEntryItem = /** @class */ (function () {
    function StatusBarEntryItem(entry, commandService, instantiationService, notificationService, telemetryService, contextMenuService, editorService, themeService) {
        this.entry = entry;
        this.commandService = commandService;
        this.instantiationService = instantiationService;
        this.notificationService = notificationService;
        this.telemetryService = telemetryService;
        this.contextMenuService = contextMenuService;
        this.editorService = editorService;
        this.themeService = themeService;
        this.entry = entry;
        if (!manageExtensionAction) {
            manageExtensionAction = this.instantiationService.createInstance(ManageExtensionAction);
        }
    }
    StatusBarEntryItem.prototype.render = function (el) {
        var _this = this;
        var toDispose = [];
        addClass(el, 'statusbar-entry');
        // Text Container
        var textContainer;
        if (this.entry.command) {
            textContainer = document.createElement('a');
            toDispose.push(addDisposableListener(textContainer, 'click', function () { return _this.executeCommand(_this.entry.command, _this.entry.arguments); }));
        }
        else {
            textContainer = document.createElement('span');
        }
        // Label
        new OcticonLabel(textContainer).text = this.entry.text;
        // Tooltip
        if (this.entry.tooltip) {
            textContainer.title = this.entry.tooltip;
        }
        // Color
        var color = this.entry.color;
        if (color) {
            if (isThemeColor(color)) {
                var colorId_1 = color.id;
                color = (this.themeService.getTheme().getColor(colorId_1) || Color.transparent).toString();
                toDispose.push(this.themeService.onThemeChange(function (theme) {
                    var colorValue = (_this.themeService.getTheme().getColor(colorId_1) || Color.transparent).toString();
                    textContainer.style.color = colorValue;
                }));
            }
            textContainer.style.color = color;
        }
        // Context Menu
        if (this.entry.extensionId) {
            toDispose.push(addDisposableListener(textContainer, 'contextmenu', function (e) {
                EventHelper.stop(e, true);
                _this.contextMenuService.showContextMenu({
                    getAnchor: function () { return el; },
                    getActionsContext: function () { return _this.entry.extensionId; },
                    getActions: function () { return [manageExtensionAction]; }
                });
            }));
        }
        el.appendChild(textContainer);
        return {
            dispose: function () {
                toDispose = dispose(toDispose);
            }
        };
    };
    StatusBarEntryItem.prototype.executeCommand = function (id, args) {
        var _this = this;
        var _a;
        args = args || [];
        // Maintain old behaviour of always focusing the editor here
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (activeTextEditorWidget) {
            activeTextEditorWidget.focus();
        }
        /* __GDPR__
            "workbenchActionExecuted" : {
                "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.telemetryService.publicLog('workbenchActionExecuted', { id: id, from: 'status bar' });
        (_a = this.commandService).executeCommand.apply(_a, [id].concat(args)).then(undefined, function (err) { return _this.notificationService.error(toErrorMessage(err)); });
    };
    StatusBarEntryItem = __decorate([
        __param(1, ICommandService),
        __param(2, IInstantiationService),
        __param(3, INotificationService),
        __param(4, ITelemetryService),
        __param(5, IContextMenuService),
        __param(6, IEditorService),
        __param(7, IThemeService)
    ], StatusBarEntryItem);
    return StatusBarEntryItem;
}());
var ManageExtensionAction = /** @class */ (function (_super) {
    __extends(ManageExtensionAction, _super);
    function ManageExtensionAction(commandService) {
        var _this = _super.call(this, 'statusbar.manage.extension', nls.localize('manageExtension', "Manage Extension")) || this;
        _this.commandService = commandService;
        return _this;
    }
    ManageExtensionAction.prototype.run = function (extensionId) {
        return this.commandService.executeCommand('_extensions.manage', extensionId);
    };
    ManageExtensionAction = __decorate([
        __param(0, ICommandService)
    ], ManageExtensionAction);
    return ManageExtensionAction;
}(Action));
registerThemingParticipant(function (theme, collector) {
    var statusBarItemHoverBackground = theme.getColor(STATUS_BAR_ITEM_HOVER_BACKGROUND);
    if (statusBarItemHoverBackground) {
        collector.addRule(".monaco-workbench > .part.statusbar > .statusbar-item a:hover { background-color: " + statusBarItemHoverBackground + "; }");
    }
    var statusBarItemActiveBackground = theme.getColor(STATUS_BAR_ITEM_ACTIVE_BACKGROUND);
    if (statusBarItemActiveBackground) {
        collector.addRule(".monaco-workbench > .part.statusbar > .statusbar-item a:active { background-color: " + statusBarItemActiveBackground + "; }");
    }
    var statusBarProminentItemBackground = theme.getColor(STATUS_BAR_PROMINENT_ITEM_BACKGROUND);
    if (statusBarProminentItemBackground) {
        collector.addRule(".monaco-workbench > .part.statusbar > .statusbar-item .status-bar-info { background-color: " + statusBarProminentItemBackground + "; }");
    }
    var statusBarProminentItemHoverBackground = theme.getColor(STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND);
    if (statusBarProminentItemHoverBackground) {
        collector.addRule(".monaco-workbench > .part.statusbar > .statusbar-item a.status-bar-info:hover { background-color: " + statusBarProminentItemHoverBackground + "; }");
    }
});
