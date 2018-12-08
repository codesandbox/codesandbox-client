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
import './media/activityaction.css';
import * as nls from '../../../../nls.js';
import * as DOM from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { EventType as TouchEventType } from '../../../../base/browser/touch.js';
import { Action } from '../../../../base/common/actions.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { SyncActionDescriptor } from '../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { activeContrastBorder, focusBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ActivityAction, ActivityActionItem, ToggleCompositePinnedAction } from '../compositeBarActions.js';
import { Extensions as ActionExtensions } from '../../../common/actions.js';
import { ACTIVITY_BAR_FOREGROUND } from '../../../common/theme.js';
import { IActivityService } from '../../../services/activity/common/activity.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
var ViewletActivityAction = /** @class */ (function (_super) {
    __extends(ViewletActivityAction, _super);
    function ViewletActivityAction(activity, viewletService, partService, telemetryService) {
        var _this = _super.call(this, activity) || this;
        _this.viewletService = viewletService;
        _this.partService = partService;
        _this.telemetryService = telemetryService;
        _this.lastRun = 0;
        return _this;
    }
    ViewletActivityAction.prototype.run = function (event) {
        var _this = this;
        if (event instanceof MouseEvent && event.button === 2) {
            return Promise.resolve(false); // do not run on right click
        }
        // prevent accident trigger on a doubleclick (to help nervous people)
        var now = Date.now();
        if (now > this.lastRun /* https://github.com/Microsoft/vscode/issues/25830 */ && now - this.lastRun < ViewletActivityAction.preventDoubleClickDelay) {
            return Promise.resolve(true);
        }
        this.lastRun = now;
        var sideBarVisible = this.partService.isVisible(1 /* SIDEBAR_PART */);
        var activeViewlet = this.viewletService.getActiveViewlet();
        // Hide sidebar if selected viewlet already visible
        if (sideBarVisible && activeViewlet && activeViewlet.getId() === this.activity.id) {
            this.logAction('hide');
            this.partService.setSideBarHidden(true);
            return Promise.resolve(null);
        }
        this.logAction('show');
        return this.viewletService.openViewlet(this.activity.id, true).then(function () { return _this.activate(); });
    };
    ViewletActivityAction.prototype.logAction = function (action) {
        /* __GDPR__
            "activityBarAction" : {
                "viewletId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "action": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.telemetryService.publicLog('activityBarAction', { viewletId: this.activity.id, action: action });
    };
    ViewletActivityAction.preventDoubleClickDelay = 300;
    ViewletActivityAction = __decorate([
        __param(1, IViewletService),
        __param(2, IPartService),
        __param(3, ITelemetryService)
    ], ViewletActivityAction);
    return ViewletActivityAction;
}(ActivityAction));
export { ViewletActivityAction };
var ToggleViewletAction = /** @class */ (function (_super) {
    __extends(ToggleViewletAction, _super);
    function ToggleViewletAction(_viewlet, partService, viewletService) {
        var _this = _super.call(this, _viewlet.id, _viewlet.name) || this;
        _this._viewlet = _viewlet;
        _this.partService = partService;
        _this.viewletService = viewletService;
        return _this;
    }
    ToggleViewletAction.prototype.run = function () {
        var sideBarVisible = this.partService.isVisible(1 /* SIDEBAR_PART */);
        var activeViewlet = this.viewletService.getActiveViewlet();
        // Hide sidebar if selected viewlet already visible
        if (sideBarVisible && activeViewlet && activeViewlet.getId() === this._viewlet.id) {
            this.partService.setSideBarHidden(true);
            return Promise.resolve(null);
        }
        return this.viewletService.openViewlet(this._viewlet.id, true);
    };
    ToggleViewletAction = __decorate([
        __param(1, IPartService),
        __param(2, IViewletService)
    ], ToggleViewletAction);
    return ToggleViewletAction;
}(Action));
export { ToggleViewletAction };
var GlobalActivityAction = /** @class */ (function (_super) {
    __extends(GlobalActivityAction, _super);
    function GlobalActivityAction(activity) {
        return _super.call(this, activity) || this;
    }
    return GlobalActivityAction;
}(ActivityAction));
export { GlobalActivityAction };
var GlobalActivityActionItem = /** @class */ (function (_super) {
    __extends(GlobalActivityActionItem, _super);
    function GlobalActivityActionItem(action, colors, themeService, contextMenuService) {
        var _this = _super.call(this, action, { draggable: false, colors: colors, icon: true }, themeService) || this;
        _this.contextMenuService = contextMenuService;
        return _this;
    }
    GlobalActivityActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        // Context menus are triggered on mouse down so that an item can be picked
        // and executed with releasing the mouse over it
        this._register(DOM.addDisposableListener(this.container, DOM.EventType.MOUSE_DOWN, function (e) {
            DOM.EventHelper.stop(e, true);
            var event = new StandardMouseEvent(e);
            _this.showContextMenu({ x: event.posx, y: event.posy });
        }));
        this._register(DOM.addDisposableListener(this.container, DOM.EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                DOM.EventHelper.stop(e, true);
                _this.showContextMenu(_this.container);
            }
        }));
        this._register(DOM.addDisposableListener(this.container, TouchEventType.Tap, function (e) {
            DOM.EventHelper.stop(e, true);
            var event = new StandardMouseEvent(e);
            _this.showContextMenu({ x: event.posx, y: event.posy });
        }));
    };
    GlobalActivityActionItem.prototype.showContextMenu = function (location) {
        var globalAction = this._action;
        var activity = globalAction.activity;
        var actions = activity.getActions();
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return location; },
            getActions: function () { return actions; },
            onHide: function () { return dispose(actions); }
        });
    };
    GlobalActivityActionItem = __decorate([
        __param(2, IThemeService),
        __param(3, IContextMenuService)
    ], GlobalActivityActionItem);
    return GlobalActivityActionItem;
}(ActivityActionItem));
export { GlobalActivityActionItem };
var PlaceHolderViewletActivityAction = /** @class */ (function (_super) {
    __extends(PlaceHolderViewletActivityAction, _super);
    function PlaceHolderViewletActivityAction(id, iconUrl, viewletService, partService, telemetryService) {
        var _this = _super.call(this, { id: id, name: id, cssClass: "extensionViewlet-placeholder-" + id.replace(/\./g, '-') }, viewletService, partService, telemetryService) || this;
        var iconClass = ".monaco-workbench > .activitybar .monaco-action-bar .action-label." + _this.class; // Generate Placeholder CSS to show the icon in the activity bar
        DOM.createCSSRule(iconClass, "-webkit-mask: url('" + (iconUrl || '') + "') no-repeat 50% 50%");
        return _this;
    }
    PlaceHolderViewletActivityAction.prototype.setActivity = function (activity) {
        this.activity = activity;
    };
    PlaceHolderViewletActivityAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPartService),
        __param(4, ITelemetryService)
    ], PlaceHolderViewletActivityAction);
    return PlaceHolderViewletActivityAction;
}(ViewletActivityAction));
export { PlaceHolderViewletActivityAction };
var PlaceHolderToggleCompositePinnedAction = /** @class */ (function (_super) {
    __extends(PlaceHolderToggleCompositePinnedAction, _super);
    function PlaceHolderToggleCompositePinnedAction(id, compositeBar) {
        return _super.call(this, { id: id, name: id, cssClass: void 0 }, compositeBar) || this;
    }
    PlaceHolderToggleCompositePinnedAction.prototype.setActivity = function (activity) {
        this.label = activity.name;
    };
    return PlaceHolderToggleCompositePinnedAction;
}(ToggleCompositePinnedAction));
export { PlaceHolderToggleCompositePinnedAction };
var SwitchSideBarViewAction = /** @class */ (function (_super) {
    __extends(SwitchSideBarViewAction, _super);
    function SwitchSideBarViewAction(id, name, viewletService, activityService) {
        var _this = _super.call(this, id, name) || this;
        _this.viewletService = viewletService;
        _this.activityService = activityService;
        return _this;
    }
    SwitchSideBarViewAction.prototype.run = function (offset) {
        var pinnedViewletIds = this.activityService.getPinnedViewletIds();
        var activeViewlet = this.viewletService.getActiveViewlet();
        if (!activeViewlet) {
            return TPromise.as(null);
        }
        var targetViewletId;
        for (var i = 0; i < pinnedViewletIds.length; i++) {
            if (pinnedViewletIds[i] === activeViewlet.getId()) {
                targetViewletId = pinnedViewletIds[(i + pinnedViewletIds.length + offset) % pinnedViewletIds.length];
                break;
            }
        }
        return this.viewletService.openViewlet(targetViewletId, true);
    };
    SwitchSideBarViewAction = __decorate([
        __param(2, IViewletService),
        __param(3, IActivityService)
    ], SwitchSideBarViewAction);
    return SwitchSideBarViewAction;
}(Action));
var PreviousSideBarViewAction = /** @class */ (function (_super) {
    __extends(PreviousSideBarViewAction, _super);
    function PreviousSideBarViewAction(id, name, viewletService, activityService) {
        return _super.call(this, id, name, viewletService, activityService) || this;
    }
    PreviousSideBarViewAction.prototype.run = function () {
        return _super.prototype.run.call(this, -1);
    };
    PreviousSideBarViewAction.ID = 'workbench.action.previousSideBarView';
    PreviousSideBarViewAction.LABEL = nls.localize('previousSideBarView', 'Previous Side Bar View');
    PreviousSideBarViewAction = __decorate([
        __param(2, IViewletService),
        __param(3, IActivityService)
    ], PreviousSideBarViewAction);
    return PreviousSideBarViewAction;
}(SwitchSideBarViewAction));
export { PreviousSideBarViewAction };
var NextSideBarViewAction = /** @class */ (function (_super) {
    __extends(NextSideBarViewAction, _super);
    function NextSideBarViewAction(id, name, viewletService, activityService) {
        return _super.call(this, id, name, viewletService, activityService) || this;
    }
    NextSideBarViewAction.prototype.run = function () {
        return _super.prototype.run.call(this, 1);
    };
    NextSideBarViewAction.ID = 'workbench.action.nextSideBarView';
    NextSideBarViewAction.LABEL = nls.localize('nextSideBarView', 'Next Side Bar View');
    NextSideBarViewAction = __decorate([
        __param(2, IViewletService),
        __param(3, IActivityService)
    ], NextSideBarViewAction);
    return NextSideBarViewAction;
}(SwitchSideBarViewAction));
export { NextSideBarViewAction };
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(PreviousSideBarViewAction, PreviousSideBarViewAction.ID, PreviousSideBarViewAction.LABEL), 'View: Open Previous Side Bar View', nls.localize('view', "View"));
registry.registerWorkbenchAction(new SyncActionDescriptor(NextSideBarViewAction, NextSideBarViewAction.ID, NextSideBarViewAction.LABEL), 'View: Open Next Side Bar View', nls.localize('view', "View"));
registerThemingParticipant(function (theme, collector) {
    var activeForegroundColor = theme.getColor(ACTIVITY_BAR_FOREGROUND);
    if (activeForegroundColor) {
        collector.addRule("\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active .action-label,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus .action-label,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover .action-label {\n\t\t\t\tbackground-color: " + activeForegroundColor + " !important;\n\t\t\t}\n\t\t");
    }
    // Styling with Outline color (e.g. high contrast theme)
    var outline = theme.getColor(activeContrastBorder);
    if (outline) {
        collector.addRule("\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:before {\n\t\t\t\tcontent: \"\";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 9px;\n\t\t\t\tleft: 9px;\n\t\t\t\theight: 32px;\n\t\t\t\twidth: 32px;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:hover:before {\n\t\t\t\toutline: 1px solid;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover:before {\n\t\t\t\toutline: 1px dashed;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus:before {\n\t\t\t\tborder-left-color: " + outline + ";\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover:before {\n\t\t\t\toutline-color: " + outline + ";\n\t\t\t}\n\t\t");
    }
    // Styling without outline color
    else {
        var focusBorderColor = theme.getColor(focusBorder);
        if (focusBorderColor) {
            collector.addRule("\n\t\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus:before {\n\t\t\t\t\t\tborder-left-color: " + focusBorderColor + ";\n\t\t\t\t\t}\n\t\t\t\t");
        }
    }
});
