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
import { Emitter } from '../../../../base/common/event.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ViewletExtensions } from '../../../browser/viewlet.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
var ActiveViewletContextId = 'activeViewlet';
export var ActiveViewletContext = new RawContextKey(ActiveViewletContextId, '');
var ViewletService = /** @class */ (function (_super) {
    __extends(ViewletService, _super);
    function ViewletService(sidebarPart, contextKeyService, extensionService) {
        var _this = _super.call(this) || this;
        _this.extensionService = extensionService;
        _this._onDidViewletEnable = new Emitter();
        _this.sidebarPart = sidebarPart;
        _this.viewletRegistry = Registry.as(ViewletExtensions.Viewlets);
        _this.activeViewletContextKey = ActiveViewletContext.bindTo(contextKeyService);
        _this._register(_this.onDidViewletOpen(_this._onDidViewletOpen, _this));
        _this._register(_this.onDidViewletClose(_this._onDidViewletClose, _this));
        return _this;
    }
    Object.defineProperty(ViewletService.prototype, "onDidViewletRegister", {
        get: function () { return this.viewletRegistry.onDidRegister; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewletService.prototype, "onDidViewletOpen", {
        get: function () { return this.sidebarPart.onDidViewletOpen; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewletService.prototype, "onDidViewletClose", {
        get: function () { return this.sidebarPart.onDidViewletClose; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewletService.prototype, "onDidViewletEnablementChange", {
        get: function () { return this._onDidViewletEnable.event; },
        enumerable: true,
        configurable: true
    });
    ViewletService.prototype._onDidViewletOpen = function (viewlet) {
        this.activeViewletContextKey.set(viewlet.getId());
    };
    ViewletService.prototype._onDidViewletClose = function (viewlet) {
        var id = viewlet.getId();
        if (this.activeViewletContextKey.get() === id) {
            this.activeViewletContextKey.reset();
        }
    };
    ViewletService.prototype.setViewletEnablement = function (id, enabled) {
        var descriptor = this.getAllViewlets().filter(function (desc) { return desc.id === id; }).pop();
        if (descriptor && descriptor.enabled !== enabled) {
            descriptor.enabled = enabled;
            this._onDidViewletEnable.fire({ id: id, enabled: enabled });
        }
    };
    ViewletService.prototype.openViewlet = function (id, focus) {
        var _this = this;
        if (this.getViewlet(id)) {
            return this.sidebarPart.openViewlet(id, focus);
        }
        return this.extensionService.whenInstalledExtensionsRegistered()
            .then(function () {
            if (_this.getViewlet(id)) {
                return _this.sidebarPart.openViewlet(id, focus);
            }
            return null;
        });
    };
    ViewletService.prototype.getActiveViewlet = function () {
        return this.sidebarPart.getActiveViewlet();
    };
    ViewletService.prototype.getViewlets = function () {
        return this.getAllViewlets()
            .filter(function (v) { return v.enabled; });
    };
    ViewletService.prototype.getAllViewlets = function () {
        return this.viewletRegistry.getViewlets()
            .sort(function (v1, v2) { return v1.order - v2.order; });
    };
    ViewletService.prototype.getDefaultViewletId = function () {
        return this.viewletRegistry.getDefaultViewletId();
    };
    ViewletService.prototype.getViewlet = function (id) {
        return this.getViewlets().filter(function (viewlet) { return viewlet.id === id; })[0];
    };
    ViewletService.prototype.getProgressIndicator = function (id) {
        return this.sidebarPart.getProgressIndicator(id);
    };
    ViewletService = __decorate([
        __param(1, IContextKeyService),
        __param(2, IExtensionService)
    ], ViewletService);
    return ViewletService;
}(Disposable));
export { ViewletService };
