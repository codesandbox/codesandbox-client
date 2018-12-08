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
import { ContextView } from '../../../base/browser/ui/contextview/contextview.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ILogService } from '../../log/common/log.js';
import { Disposable } from '../../../base/common/lifecycle.js';
var ContextViewService = /** @class */ (function (_super) {
    __extends(ContextViewService, _super);
    function ContextViewService(container, telemetryService, logService) {
        var _this = _super.call(this) || this;
        _this.logService = logService;
        _this.contextView = _this._register(new ContextView(container));
        return _this;
    }
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
}(Disposable));
export { ContextViewService };
