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
import { Emitter } from '../base/common/event';
import { TPromise } from '../base/common/winjs.base';
import { Disposable } from '../base/common/lifecycle';
var CodeSandboxExtensionService = /** @class */ (function (_super) {
    __extends(CodeSandboxExtensionService, _super);
    function CodeSandboxExtensionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onDidRegisterExtensions = _this._register(new Emitter());
        _this.onDidRegisterExtensions = _this
            ._onDidRegisterExtensions.event;
        _this._onDidChangeExtensionsStatus = _this._register(new Emitter());
        _this.onDidChangeExtensionsStatus = _this
            ._onDidChangeExtensionsStatus.event;
        return _this;
    }
    CodeSandboxExtensionService.prototype.getInspectPort = function () {
        throw new Error('Method not implemented.');
    };
    /**
       * Send an activation event and activate interested extensions.
       */
    CodeSandboxExtensionService.prototype.activateByEvent = function (activationEvent) {
        return new TPromise(function (r) { return r(null); });
    };
    /**
       * An promise that resolves when the installed extensions are registered after
       * their extension points got handled.
       */
    CodeSandboxExtensionService.prototype.whenInstalledExtensionsRegistered = function () {
        return new TPromise(function (r) { return r(true); });
    };
    /**
       * Return all registered extensions
       */
    CodeSandboxExtensionService.prototype.getExtensions = function () {
        return new TPromise(function (r) { return r([]); });
    };
    /**
       * Read all contributions to an extension point.
       */
    CodeSandboxExtensionService.prototype.readExtensionPointContributions = function (extPoint) {
        return new TPromise(function (r) { return r([]); });
    };
    /**
       * Get information about extensions status.
       */
    CodeSandboxExtensionService.prototype.getExtensionsStatus = function () {
        return {};
    };
    /**
       * Check if the extension host can be profiled.
       */
    CodeSandboxExtensionService.prototype.canProfileExtensionHost = function () {
        return false;
    };
    /**
       * Begin an extension host process profile session.
       */
    CodeSandboxExtensionService.prototype.startExtensionHostProfile = function () {
        return new TPromise(function (r) { return r(null); });
    };
    /**
       * Restarts the extension host.
       */
    CodeSandboxExtensionService.prototype.restartExtensionHost = function () { };
    /**
       * Starts the extension host.
       */
    CodeSandboxExtensionService.prototype.startExtensionHost = function () { };
    /**
       * Stops the extension host.
       */
    CodeSandboxExtensionService.prototype.stopExtensionHost = function () { };
    return CodeSandboxExtensionService;
}(Disposable));
export { CodeSandboxExtensionService };
