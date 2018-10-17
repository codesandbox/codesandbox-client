/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var CodeSandboxExtensionGalleryService = /** @class */ (function () {
    function CodeSandboxExtensionGalleryService() {
    }
    CodeSandboxExtensionGalleryService.prototype.getExtension = function (id, version) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxExtensionGalleryService.prototype.isEnabled = function () {
        return false;
    };
    CodeSandboxExtensionGalleryService.prototype.reportStatistic = function (publisher, name, version, type) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxExtensionGalleryService.prototype.query = function (options) {
        throw new Error('query not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.download = function (extension, operation) {
        throw new Error('	download not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.getReadme = function (extension) {
        throw new Error('	getReadme not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.getManifest = function (extension) {
        throw new Error('	getManifest not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.getChangelog = function (extension) {
        throw new Error('	getChangelog not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.getCoreTranslation = function (extension, languageId) {
        throw new Error('getCoreTranslation not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.loadCompatibleVersion = function (extension) {
        throw new Error('loadCompatibleVersion not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.loadAllDependencies = function (dependencies) {
        throw new Error('loadAllDependencies not implemented');
    };
    CodeSandboxExtensionGalleryService.prototype.getExtensionsReport = function () {
        throw new Error('getExtensionsReport not implemented');
    };
    return CodeSandboxExtensionGalleryService;
}());
export { CodeSandboxExtensionGalleryService };
