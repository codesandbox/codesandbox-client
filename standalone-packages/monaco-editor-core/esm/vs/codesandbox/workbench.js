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
import { Emitter } from '../base/common/event';
import { Disposable } from '../base/common/lifecycle';
import { ICodeSandboxService } from './services/codesandbox/common/codesandbox';
var CodeSandboxWorkbench = /** @class */ (function (_super) {
    __extends(CodeSandboxWorkbench, _super);
    function CodeSandboxWorkbench(codeSandboxService) {
        var _this = _super.call(this) || this;
        _this.codeSandboxService = codeSandboxService;
        //#region IPartService
        _this._onTitleBarVisibilityChange = _this._register(new Emitter());
        _this._onMenubarVisibilityChange = _this._register(new Emitter());
        return _this;
    }
    CodeSandboxWorkbench.prototype.getMenubarVisibility = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getWorkbenchElement = function () {
        return document.getElementById('workbench.main.container');
    };
    Object.defineProperty(CodeSandboxWorkbench.prototype, "onTitleBarVisibilityChange", {
        get: function () {
            return this._onTitleBarVisibilityChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxWorkbench.prototype, "onMenubarVisibilityChange", {
        get: function () {
            return this._onMenubarVisibilityChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxWorkbench.prototype, "onEditorLayout", {
        // get onEditorLayout(): Event<IDimension> { return this.editorPart.onDidLayout; }
        // private _onDidLayout: Emitter<IDimension> = this._register(new Emitter<IDimension>());
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    CodeSandboxWorkbench.prototype.layout = function (options) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.isCreated = function () {
        return true;
    };
    CodeSandboxWorkbench.prototype.hasFocus = function (part) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getContainer = function (part) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.isVisible = function (part) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.setActivityBarHidden = function (hidden) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getTitleBarOffset = function () {
        return 0;
    };
    CodeSandboxWorkbench.prototype.setSideBarHidden = function (hidden) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.setPanelHidden = function (hidden) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.toggleMaximizedPanel = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.isPanelMaximized = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getSideBarPosition = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getPanelPosition = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.setPanelPosition = function (position) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.getWorkbenchElementId = function () {
        return 'workbench.main.container';
    };
    CodeSandboxWorkbench.prototype.toggleZenMode = function () {
        this.codeSandboxService.runSignal('preferences.zenModeToggled', {});
    };
    CodeSandboxWorkbench.prototype.isEditorLayoutCentered = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.centerEditorLayout = function (active) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.resizePart = function (part, sizeChange) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWorkbench.prototype.initServices = function () { };
    CodeSandboxWorkbench = __decorate([
        __param(0, ICodeSandboxService)
    ], CodeSandboxWorkbench);
    return CodeSandboxWorkbench;
}(Disposable));
export { CodeSandboxWorkbench };
