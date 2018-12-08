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
import './media/activitybarpart.css';
import * as nls from '../../../../nls.js';
import { illegalArgument } from '../../../../base/common/errors.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { GlobalActivityExtensions } from '../../../common/activity.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Part } from '../../part.js';
import { GlobalActivityActionItem, GlobalActivityAction, ViewletActivityAction, ToggleViewletAction, PlaceHolderToggleCompositePinnedAction, PlaceHolderViewletActivityAction } from './activitybarActions.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { ToggleActivityBarVisibilityAction } from '../../actions/toggleActivityBarVisibility.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ACTIVITY_BAR_BACKGROUND, ACTIVITY_BAR_BORDER, ACTIVITY_BAR_FOREGROUND, ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND, ACTIVITY_BAR_DRAG_AND_DROP_BACKGROUND, ACTIVITY_BAR_INACTIVE_FOREGROUND } from '../../../common/theme.js';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { CompositeBar } from '../compositeBar.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { scheduleAtNextAnimationFrame, Dimension, addClass } from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { ToggleCompositePinnedAction } from '../compositeBarActions.js';
var ActivitybarPart = /** @class */ (function (_super) {
    __extends(ActivitybarPart, _super);
    function ActivitybarPart(id, viewletService, instantiationService, partService, themeService, lifecycleService, storageService, extensionService) {
        var _this = _super.call(this, id, { hasTitle: false }, themeService, storageService) || this;
        _this.viewletService = viewletService;
        _this.instantiationService = instantiationService;
        _this.partService = partService;
        _this.lifecycleService = lifecycleService;
        _this.storageService = storageService;
        _this.extensionService = extensionService;
        _this.globalActivityIdToActions = Object.create(null);
        _this.placeholderComposites = [];
        _this.compositeActions = Object.create(null);
        _this.compositeBar = _this._register(_this.instantiationService.createInstance(CompositeBar, {
            icon: true,
            storageId: ActivitybarPart.PINNED_VIEWLETS,
            orientation: 2 /* VERTICAL */,
            openComposite: function (compositeId) { return _this.viewletService.openViewlet(compositeId, true); },
            getActivityAction: function (compositeId) { return _this.getCompositeActions(compositeId).activityAction; },
            getCompositePinnedAction: function (compositeId) { return _this.getCompositeActions(compositeId).pinnedAction; },
            getOnCompositeClickAction: function (compositeId) { return _this.instantiationService.createInstance(ToggleViewletAction, _this.viewletService.getViewlet(compositeId)); },
            getContextMenuActions: function () { return [_this.instantiationService.createInstance(ToggleActivityBarVisibilityAction, ToggleActivityBarVisibilityAction.ID, nls.localize('hideActivitBar', "Hide Activity Bar"))]; },
            getDefaultCompositeId: function () { return _this.viewletService.getDefaultViewletId(); },
            hidePart: function () { return _this.partService.setSideBarHidden(true); },
            compositeSize: 50,
            colors: function (theme) { return _this.getActivitybarItemColors(theme); },
            overflowActionSize: ActivitybarPart.ACTION_HEIGHT
        }));
        var previousState = _this.storageService.get(ActivitybarPart.PLACEHOLDER_VIEWLETS, 0 /* GLOBAL */, '[]');
        _this.placeholderComposites = JSON.parse(previousState);
        _this.placeholderComposites.forEach(function (s) {
            if (typeof s.iconUrl === 'object') {
                s.iconUrl = URI.revive(s.iconUrl);
            }
            else {
                s.iconUrl = void 0;
            }
        });
        _this.registerListeners();
        _this.updateCompositebar();
        return _this;
    }
    ActivitybarPart.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.viewletService.onDidViewletRegister(function () { return _this.updateCompositebar(); }));
        // Activate viewlet action on opening of a viewlet
        this._register(this.viewletService.onDidViewletOpen(function (viewlet) { return _this.compositeBar.activateComposite(viewlet.getId()); }));
        // Deactivate viewlet action on close
        this._register(this.viewletService.onDidViewletClose(function (viewlet) { return _this.compositeBar.deactivateComposite(viewlet.getId()); }));
        this._register(this.viewletService.onDidViewletEnablementChange(function (_a) {
            var id = _a.id, enabled = _a.enabled;
            if (enabled) {
                _this.compositeBar.addComposite(_this.viewletService.getViewlet(id));
            }
            else {
                _this.removeComposite(id, true);
            }
        }));
        this._register(this.extensionService.onDidRegisterExtensions(function () { return _this.onDidRegisterExtensions(); }));
    };
    ActivitybarPart.prototype.onDidRegisterExtensions = function () {
        this.removeNotExistingComposites();
        this.updateCompositebar();
    };
    ActivitybarPart.prototype.showActivity = function (viewletOrActionId, badge, clazz, priority) {
        if (this.viewletService.getViewlet(viewletOrActionId)) {
            return this.compositeBar.showActivity(viewletOrActionId, badge, clazz, priority);
        }
        return this.showGlobalActivity(viewletOrActionId, badge, clazz);
    };
    ActivitybarPart.prototype.showGlobalActivity = function (globalActivityId, badge, clazz) {
        if (!badge) {
            throw illegalArgument('badge');
        }
        var action = this.globalActivityIdToActions[globalActivityId];
        if (!action) {
            throw illegalArgument('globalActivityId');
        }
        action.setBadge(badge, clazz);
        return toDisposable(function () { return action.setBadge(undefined); });
    };
    ActivitybarPart.prototype.createContentArea = function (parent) {
        var content = document.createElement('div');
        addClass(content, 'content');
        parent.appendChild(content);
        // Top Actionbar with action items for each viewlet action
        this.compositeBar.create(content);
        // Top Actionbar with action items for each viewlet action
        var globalActivities = document.createElement('div');
        addClass(globalActivities, 'global-activity');
        content.appendChild(globalActivities);
        this.createGlobalActivityActionBar(globalActivities);
        // TODO@Ben: workaround for https://github.com/Microsoft/vscode/issues/45700
        // It looks like there are rendering glitches on macOS with Chrome 61 when
        // using --webkit-mask with a background color that is different from the image
        // The workaround is to promote the element onto its own drawing layer. We do
        // this only after the workbench has loaded because otherwise there is ugly flicker.
        if (isMacintosh) {
            this.lifecycleService.when(3 /* Running */).then(function () {
                scheduleAtNextAnimationFrame(function () {
                    scheduleAtNextAnimationFrame(function () {
                        registerThemingParticipant(function (theme, collector) {
                            var activityBarForeground = theme.getColor(ACTIVITY_BAR_FOREGROUND);
                            if (activityBarForeground && !activityBarForeground.equals(Color.white)) {
                                // only apply this workaround if the color is different from the image one (white)
                                collector.addRule('.monaco-workbench .activitybar > .content .monaco-action-bar .action-label { will-change: transform; }');
                            }
                        });
                    });
                });
            });
        }
        return content;
    };
    ActivitybarPart.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
        // Part container
        var container = this.getContainer();
        var background = this.getColor(ACTIVITY_BAR_BACKGROUND);
        container.style.backgroundColor = background;
        var borderColor = this.getColor(ACTIVITY_BAR_BORDER) || this.getColor(contrastBorder);
        var isPositionLeft = this.partService.getSideBarPosition() === 0 /* LEFT */;
        container.style.boxSizing = borderColor && isPositionLeft ? 'border-box' : null;
        container.style.borderRightWidth = borderColor && isPositionLeft ? '1px' : null;
        container.style.borderRightStyle = borderColor && isPositionLeft ? 'solid' : null;
        container.style.borderRightColor = isPositionLeft ? borderColor : null;
        container.style.borderLeftWidth = borderColor && !isPositionLeft ? '1px' : null;
        container.style.borderLeftStyle = borderColor && !isPositionLeft ? 'solid' : null;
        container.style.borderLeftColor = !isPositionLeft ? borderColor : null;
    };
    ActivitybarPart.prototype.getActivitybarItemColors = function (theme) {
        return {
            activeForegroundColor: theme.getColor(ACTIVITY_BAR_FOREGROUND),
            inactiveForegroundColor: theme.getColor(ACTIVITY_BAR_INACTIVE_FOREGROUND),
            badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
            badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
            dragAndDropBackground: theme.getColor(ACTIVITY_BAR_DRAG_AND_DROP_BACKGROUND),
            activeBackgroundColor: null, inactiveBackgroundColor: null, activeBorderBottomColor: null,
        };
    };
    ActivitybarPart.prototype.createGlobalActivityActionBar = function (container) {
        var _this = this;
        var activityRegistry = Registry.as(GlobalActivityExtensions);
        var descriptors = activityRegistry.getActivities();
        var actions = descriptors
            .map(function (d) { return _this.instantiationService.createInstance(d); })
            .map(function (a) { return new GlobalActivityAction(a); });
        this.globalActionBar = this._register(new ActionBar(container, {
            actionItemProvider: function (a) { return _this.instantiationService.createInstance(GlobalActivityActionItem, a, function (theme) { return _this.getActivitybarItemColors(theme); }); },
            orientation: 2 /* VERTICAL */,
            ariaLabel: nls.localize('globalActions', "Global Actions"),
            animated: false
        }));
        actions.forEach(function (a) {
            _this.globalActivityIdToActions[a.id] = a;
            _this.globalActionBar.push(a);
        });
    };
    ActivitybarPart.prototype.getCompositeActions = function (compositeId) {
        var compositeActions = this.compositeActions[compositeId];
        if (!compositeActions) {
            var viewlet = this.viewletService.getViewlet(compositeId);
            if (viewlet) {
                compositeActions = {
                    activityAction: this.instantiationService.createInstance(ViewletActivityAction, viewlet),
                    pinnedAction: new ToggleCompositePinnedAction(viewlet, this.compositeBar)
                };
            }
            else {
                var placeHolderComposite = this.placeholderComposites.filter(function (c) { return c.id === compositeId; })[0];
                compositeActions = {
                    activityAction: this.instantiationService.createInstance(PlaceHolderViewletActivityAction, compositeId, placeHolderComposite && placeHolderComposite.iconUrl),
                    pinnedAction: new PlaceHolderToggleCompositePinnedAction(compositeId, this.compositeBar)
                };
            }
            this.compositeActions[compositeId] = compositeActions;
        }
        return compositeActions;
    };
    ActivitybarPart.prototype.updateCompositebar = function () {
        var viewlets = this.viewletService.getViewlets();
        var _loop_1 = function (viewlet) {
            this_1.compositeBar.addComposite(viewlet);
            // Pin it by default if it is new => it does not has a placeholder
            if (this_1.placeholderComposites.every(function (c) { return c.id !== viewlet.id; })) {
                this_1.compositeBar.pin(viewlet.id);
            }
            this_1.enableCompositeActions(viewlet);
            var activeViewlet = this_1.viewletService.getActiveViewlet();
            if (activeViewlet && activeViewlet.getId() === viewlet.id) {
                this_1.compositeBar.activateComposite(viewlet.id);
            }
        };
        var this_1 = this;
        for (var _i = 0, viewlets_1 = viewlets; _i < viewlets_1.length; _i++) {
            var viewlet = viewlets_1[_i];
            _loop_1(viewlet);
        }
    };
    ActivitybarPart.prototype.removeNotExistingComposites = function () {
        var viewlets = this.viewletService.getAllViewlets();
        var _loop_2 = function (id) {
            if (viewlets.every(function (viewlet) { return viewlet.id !== id; })) {
                this_2.removeComposite(id, false);
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.compositeBar.getComposites(); _i < _a.length; _i++) {
            var id = _a[_i].id;
            _loop_2(id);
        }
    };
    ActivitybarPart.prototype.removeComposite = function (compositeId, hide) {
        if (hide) {
            this.compositeBar.hideComposite(compositeId);
        }
        else {
            this.compositeBar.removeComposite(compositeId);
        }
        var compositeActions = this.compositeActions[compositeId];
        if (compositeActions) {
            compositeActions.activityAction.dispose();
            compositeActions.pinnedAction.dispose();
            delete this.compositeActions[compositeId];
        }
    };
    ActivitybarPart.prototype.enableCompositeActions = function (viewlet) {
        var _a = this.getCompositeActions(viewlet.id), activityAction = _a.activityAction, pinnedAction = _a.pinnedAction;
        if (activityAction instanceof PlaceHolderViewletActivityAction) {
            activityAction.setActivity(viewlet);
        }
        if (pinnedAction instanceof PlaceHolderToggleCompositePinnedAction) {
            pinnedAction.setActivity(viewlet);
        }
    };
    ActivitybarPart.prototype.getPinnedViewletIds = function () {
        var _this = this;
        var pinnedCompositeIds = this.compositeBar.getPinnedComposites().map(function (v) { return v.id; });
        return this.viewletService.getViewlets()
            .filter(function (v) { return _this.compositeBar.isPinned(v.id); })
            .sort(function (v1, v2) { return pinnedCompositeIds.indexOf(v1.id) - pinnedCompositeIds.indexOf(v2.id); })
            .map(function (v) { return v.id; });
    };
    ActivitybarPart.prototype.layout = function (dimension) {
        if (!this.partService.isVisible(0 /* ACTIVITYBAR_PART */)) {
            return [dimension];
        }
        // Pass to super
        var sizes = _super.prototype.layout.call(this, dimension);
        this.dimension = sizes[1];
        var availableHeight = this.dimension.height;
        if (this.globalActionBar) {
            // adjust height for global actions showing
            availableHeight -= (this.globalActionBar.items.length * ActivitybarPart.ACTION_HEIGHT);
        }
        this.compositeBar.layout(new Dimension(dimension.width, availableHeight));
        return sizes;
    };
    ActivitybarPart.prototype.saveState = function () {
        var state = this.viewletService.getAllViewlets().map(function (_a) {
            var id = _a.id, iconUrl = _a.iconUrl;
            return ({ id: id, iconUrl: iconUrl });
        });
        this.storageService.store(ActivitybarPart.PLACEHOLDER_VIEWLETS, JSON.stringify(state), 0 /* GLOBAL */);
        _super.prototype.saveState.call(this);
    };
    ActivitybarPart.ACTION_HEIGHT = 50;
    ActivitybarPart.PINNED_VIEWLETS = 'workbench.activity.pinnedViewlets';
    ActivitybarPart.PLACEHOLDER_VIEWLETS = 'workbench.activity.placeholderViewlets';
    ActivitybarPart = __decorate([
        __param(1, IViewletService),
        __param(2, IInstantiationService),
        __param(3, IPartService),
        __param(4, IThemeService),
        __param(5, ILifecycleService),
        __param(6, IStorageService),
        __param(7, IExtensionService)
    ], ActivitybarPart);
    return ActivitybarPart;
}(Part));
export { ActivitybarPart };
