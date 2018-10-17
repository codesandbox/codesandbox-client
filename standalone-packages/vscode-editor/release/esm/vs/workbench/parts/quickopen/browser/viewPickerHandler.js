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
import { QuickOpenModel, QuickOpenEntryGroup } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { QuickOpenHandler, QuickOpenAction } from '../../../browser/quickopen.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import { IOutputService } from '../../output/common/output.js';
import { ITerminalService } from '../../terminal/common/terminal.js';
import { IPanelService } from '../../../services/panel/common/panelService.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { Action } from '../../../../base/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { fuzzyContains, stripWildcards } from '../../../../base/common/strings.js';
import { matchesFuzzy } from '../../../../base/common/filters.js';
import { ViewsRegistry, IViewsService, Extensions as ViewContainerExtensions } from '../../../common/views.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
export var VIEW_PICKER_PREFIX = 'view ';
var ViewEntry = /** @class */ (function (_super) {
    __extends(ViewEntry, _super);
    function ViewEntry(label, category, open) {
        var _this = _super.call(this) || this;
        _this.label = label;
        _this.category = category;
        _this.open = open;
        return _this;
    }
    ViewEntry.prototype.getLabel = function () {
        return this.label;
    };
    ViewEntry.prototype.getCategory = function () {
        return this.category;
    };
    ViewEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, view picker", this.getLabel());
    };
    ViewEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            return this.runOpen(context);
        }
        return _super.prototype.run.call(this, mode, context);
    };
    ViewEntry.prototype.runOpen = function (context) {
        var _this = this;
        setTimeout(function () {
            _this.open();
        }, 0);
        return true;
    };
    return ViewEntry;
}(QuickOpenEntryGroup));
export { ViewEntry };
var ViewPickerHandler = /** @class */ (function (_super) {
    __extends(ViewPickerHandler, _super);
    function ViewPickerHandler(viewletService, viewsService, outputService, terminalService, panelService, contextKeyService) {
        var _this = _super.call(this) || this;
        _this.viewletService = viewletService;
        _this.viewsService = viewsService;
        _this.outputService = outputService;
        _this.terminalService = terminalService;
        _this.panelService = panelService;
        _this.contextKeyService = contextKeyService;
        return _this;
    }
    ViewPickerHandler.prototype.getResults = function (searchValue, token) {
        searchValue = searchValue.trim();
        var normalizedSearchValueLowercase = stripWildcards(searchValue).toLowerCase();
        var viewEntries = this.getViewEntries();
        var entries = viewEntries.filter(function (e) {
            if (!searchValue) {
                return true;
            }
            var highlights = matchesFuzzy(normalizedSearchValueLowercase, e.getLabel(), true);
            if (highlights) {
                e.setHighlights(highlights);
            }
            if (!highlights && !fuzzyContains(e.getCategory(), normalizedSearchValueLowercase)) {
                return false;
            }
            return true;
        });
        var lastCategory;
        entries.forEach(function (e, index) {
            if (lastCategory !== e.getCategory()) {
                lastCategory = e.getCategory();
                e.setShowBorder(index > 0);
                e.setGroupLabel(lastCategory);
            }
            else {
                e.setShowBorder(false);
                e.setGroupLabel(void 0);
            }
        });
        return TPromise.as(new QuickOpenModel(entries));
    };
    ViewPickerHandler.prototype.getViewEntries = function () {
        var _this = this;
        var viewEntries = [];
        var getViewEntriesForViewlet = function (viewlet, viewContainer) {
            var views = ViewsRegistry.getViews(viewContainer);
            var result = [];
            if (views.length) {
                var _loop_1 = function (view) {
                    if (_this.contextKeyService.contextMatchesRules(view.when)) {
                        result.push(new ViewEntry(view.name, viewlet.name, function () { return _this.viewsService.openView(view.id, true); }));
                    }
                };
                for (var _i = 0, views_1 = views; _i < views_1.length; _i++) {
                    var view = views_1[_i];
                    _loop_1(view);
                }
            }
            return result;
        };
        // Viewlets
        var viewlets = this.viewletService.getViewlets();
        viewlets.forEach(function (viewlet, index) { return viewEntries.push(new ViewEntry(viewlet.name, nls.localize('views', "Views"), function () { return _this.viewletService.openViewlet(viewlet.id, true); })); });
        // Panels
        var panels = this.panelService.getPanels();
        panels.forEach(function (panel, index) { return viewEntries.push(new ViewEntry(panel.name, nls.localize('panels', "Panels"), function () { return _this.panelService.openPanel(panel.id, true); })); });
        // Viewlet Views
        viewlets.forEach(function (viewlet, index) {
            var viewContainer = Registry.as(ViewContainerExtensions.ViewContainersRegistry).get(viewlet.id);
            if (viewContainer) {
                var viewEntriesForViewlet = getViewEntriesForViewlet(viewlet, viewContainer);
                viewEntries.push.apply(viewEntries, viewEntriesForViewlet);
            }
        });
        // Terminals
        var terminalsCategory = nls.localize('terminals', "Terminal");
        this.terminalService.terminalTabs.forEach(function (tab, tabIndex) {
            tab.terminalInstances.forEach(function (terminal, terminalIndex) {
                var index = tabIndex + 1 + "." + (terminalIndex + 1);
                var entry = new ViewEntry(nls.localize('terminalTitle', "{0}: {1}", index, terminal.title), terminalsCategory, function () {
                    _this.terminalService.showPanel(true).then(function () {
                        _this.terminalService.setActiveInstance(terminal);
                    });
                });
                viewEntries.push(entry);
            });
        });
        // Output Channels
        var channels = this.outputService.getChannelDescriptors();
        channels.forEach(function (channel, index) {
            var outputCategory = nls.localize('channels', "Output");
            var entry = new ViewEntry(channel.label, outputCategory, function () { return _this.outputService.showChannel(channel.id); });
            viewEntries.push(entry);
        });
        return viewEntries;
    };
    ViewPickerHandler.prototype.getAutoFocus = function (searchValue, context) {
        return {
            autoFocusFirstEntry: !!searchValue || !!context.quickNavigateConfiguration
        };
    };
    ViewPickerHandler.ID = 'workbench.picker.views';
    ViewPickerHandler = __decorate([
        __param(0, IViewletService),
        __param(1, IViewsService),
        __param(2, IOutputService),
        __param(3, ITerminalService),
        __param(4, IPanelService),
        __param(5, IContextKeyService)
    ], ViewPickerHandler);
    return ViewPickerHandler;
}(QuickOpenHandler));
export { ViewPickerHandler };
var OpenViewPickerAction = /** @class */ (function (_super) {
    __extends(OpenViewPickerAction, _super);
    function OpenViewPickerAction(id, label, quickOpenService) {
        return _super.call(this, id, label, VIEW_PICKER_PREFIX, quickOpenService) || this;
    }
    OpenViewPickerAction.ID = 'workbench.action.openView';
    OpenViewPickerAction.LABEL = nls.localize('openView', "Open View");
    OpenViewPickerAction = __decorate([
        __param(2, IQuickOpenService)
    ], OpenViewPickerAction);
    return OpenViewPickerAction;
}(QuickOpenAction));
export { OpenViewPickerAction };
var QuickOpenViewPickerAction = /** @class */ (function (_super) {
    __extends(QuickOpenViewPickerAction, _super);
    function QuickOpenViewPickerAction(id, label, quickOpenService, keybindingService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.keybindingService = keybindingService;
        return _this;
    }
    QuickOpenViewPickerAction.prototype.run = function () {
        var keys = this.keybindingService.lookupKeybindings(this.id);
        this.quickOpenService.show(VIEW_PICKER_PREFIX, { quickNavigateConfiguration: { keybindings: keys } });
        return TPromise.as(true);
    };
    QuickOpenViewPickerAction.ID = 'workbench.action.quickOpenView';
    QuickOpenViewPickerAction.LABEL = nls.localize('quickOpenView', "Quick Open View");
    QuickOpenViewPickerAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IKeybindingService)
    ], QuickOpenViewPickerAction);
    return QuickOpenViewPickerAction;
}(Action));
export { QuickOpenViewPickerAction };
