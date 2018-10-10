/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './contextMenuHandler.css';
import { $ } from '../../../base/browser/builder';
import { combinedDisposable } from '../../../base/common/lifecycle';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent';
import { ActionRunner } from '../../../base/common/actions';
import { Menu } from '../../../base/browser/ui/menu/menu';
var ContextMenuHandler = /** @class */ (function () {
    function ContextMenuHandler(element, contextViewService, telemetryService, notificationService) {
        var _this = this;
        this.setContainer(element);
        this.contextViewService = contextViewService;
        this.telemetryService = telemetryService;
        this.notificationService = notificationService;
        this.actionRunner = new ActionRunner();
        this.menuContainerElement = null;
        this.toDispose = [];
        var hideViewOnRun = false;
        this.toDispose.push(this.actionRunner.onDidBeforeRun(function (e) {
            if (_this.telemetryService) {
                /* __GDPR__
                    "workbenchActionExecuted" : {
                        "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                _this.telemetryService.publicLog('workbenchActionExecuted', { id: e.action.id, from: 'contextMenu' });
            }
            hideViewOnRun = !!e.retainActionItem;
            if (!hideViewOnRun) {
                _this.contextViewService.hideContextView(false);
            }
        }));
        this.toDispose.push(this.actionRunner.onDidRun(function (e) {
            if (hideViewOnRun) {
                _this.contextViewService.hideContextView(false);
            }
            hideViewOnRun = false;
            if (e.error && _this.notificationService) {
                _this.notificationService.error(e.error);
            }
        }));
    }
    ContextMenuHandler.prototype.setContainer = function (container) {
        var _this = this;
        if (this.$el) {
            this.$el.off(['click', 'mousedown']);
            this.$el = null;
        }
        if (container) {
            this.$el = $(container);
            this.$el.on('mousedown', function (e) { return _this.onMouseDown(e); });
        }
    };
    ContextMenuHandler.prototype.showContextMenu = function (delegate) {
        var _this = this;
        delegate.getActions().done(function (actions) {
            if (!actions.length) {
                return; // Don't render an empty context menu
            }
            _this.contextViewService.showContextView({
                getAnchor: function () { return delegate.getAnchor(); },
                canRelayout: false,
                render: function (container) {
                    _this.menuContainerElement = container;
                    var className = delegate.getMenuClassName ? delegate.getMenuClassName() : '';
                    if (className) {
                        container.className += ' ' + className;
                    }
                    var menu = new Menu(container, actions, {
                        actionItemProvider: delegate.getActionItem,
                        context: delegate.getActionsContext ? delegate.getActionsContext() : null,
                        actionRunner: _this.actionRunner,
                        getKeyBinding: delegate.getKeyBinding
                    });
                    var listener1 = menu.onDidCancel(function () {
                        _this.contextViewService.hideContextView(true);
                    });
                    var listener2 = menu.onDidBlur(function () {
                        _this.contextViewService.hideContextView(true);
                    });
                    menu.focus();
                    return combinedDisposable([listener1, listener2, menu]);
                },
                onHide: function (didCancel) {
                    if (delegate.onHide) {
                        delegate.onHide(didCancel);
                    }
                    _this.menuContainerElement = null;
                }
            });
        });
    };
    ContextMenuHandler.prototype.onMouseDown = function (e) {
        if (!this.menuContainerElement) {
            return;
        }
        var event = new StandardMouseEvent(e);
        var element = event.target;
        while (element) {
            if (element === this.menuContainerElement) {
                return;
            }
            element = element.parentElement;
        }
        this.contextViewService.hideContextView();
    };
    ContextMenuHandler.prototype.dispose = function () {
        this.setContainer(null);
    };
    return ContextMenuHandler;
}());
export { ContextMenuHandler };
