/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ContextView } from '../../../base/browser/ui/contextview/contextview.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ILogService } from '../../log/common/log.js';
var ContextViewService = /** @class */ (function () {
    function ContextViewService(container, telemetryService, logService) {
        this.logService = logService;
        this.contextView = new ContextView(container);
    }
    ContextViewService.prototype.dispose = function () {
        this.contextView.dispose();
    };
    // ContextView
    ContextViewService.prototype.setContainer = function (container) {
        this.logService.trace('ContextViewService#setContainer');
        this.contextView.setContainer(container);
    };
    ContextViewService.prototype.showContextView = function (delegate) {
        this.logService.trace('ContextViewService#showContextView');
        this.contextView.show(delegate);
    };
    ContextViewService.prototype.layout = function () {
        this.contextView.layout();
    };
    ContextViewService.prototype.hideContextView = function (data) {
        this.logService.trace('ContextViewService#hideContextView');
        this.contextView.hide(data);
    };
    ContextViewService = __decorate([
        __param(1, ITelemetryService),
        __param(2, ILogService)
    ], ContextViewService);
    return ContextViewService;
}());
export { ContextViewService };
