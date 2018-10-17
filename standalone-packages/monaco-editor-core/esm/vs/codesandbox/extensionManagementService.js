import { Emitter } from '../base/common/event';
var CodeSandboxExtensionManagementService = /** @class */ (function () {
    function CodeSandboxExtensionManagementService() {
        this._onInstallExtension = new Emitter();
        this.onInstallExtension = this
            ._onInstallExtension.event;
        this._onDidInstallExtension = new Emitter();
        this.onDidInstallExtension = this
            ._onDidInstallExtension.event;
        this._onUninstallExtension = new Emitter();
        this.onUninstallExtension = this
            ._onUninstallExtension.event;
        this._onDidUninstallExtension = new Emitter();
        this.onDidUninstallExtension = this
            ._onDidUninstallExtension.event;
    }
    CodeSandboxExtensionManagementService.prototype.zip = function (extension) {
        throw new Error('zip not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.unzip = function (zipLocation, type) {
        throw new Error('unzip not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.install = function (vsix) {
        throw new Error('install not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.installFromGallery = function (extension) {
        throw new Error('installFromGallery not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.uninstall = function (extension, force) {
        throw new Error('uninstall not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.reinstallFromGallery = function (extension) {
        throw new Error('reinstallFromGallery not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.getInstalled = function (type) {
        return new Promise(function () { return []; });
    };
    CodeSandboxExtensionManagementService.prototype.getExtensionsReport = function () {
        throw new Error('getExtensionsReport not implemented');
    };
    CodeSandboxExtensionManagementService.prototype.updateMetadata = function (local, metadata) {
        throw new Error('updateMetadata not implemented');
    };
    return CodeSandboxExtensionManagementService;
}());
export { CodeSandboxExtensionManagementService };
