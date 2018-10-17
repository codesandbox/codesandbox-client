/**
 * A service that enables to search for files or with in files.
 */
var CodeSandboxService = /** @class */ (function () {
    function CodeSandboxService(controller) {
        this.controller = controller;
    }
    CodeSandboxService.prototype.getController = function () {
        return this.controller;
    };
    CodeSandboxService.prototype.runSignal = function (signal, payload) {
        return this.controller.getSignal(signal)(payload);
    };
    CodeSandboxService.prototype.getThemes = function () {
        return this.controller.getState('editor.themes');
    };
    CodeSandboxService.prototype.getCurrentTheme = function () {
        return this.controller.getState('preferences.settings.editorTheme');
    };
    CodeSandboxService.prototype.getFilesByPath = function () {
        var files = {};
        var csbFiles = this.controller.getState('editor.modulesByPath');
        Object.keys(csbFiles).forEach(function (path) {
            files["/sandbox" + path] = csbFiles[path];
        });
        return files;
    };
    CodeSandboxService.prototype.openPreviewExternally = function () {
        // @ts-ignore
        if (typeof window.openNewWindow === 'function') {
            // @ts-ignore
            window.openNewWindow();
        }
    };
    return CodeSandboxService;
}());
export { CodeSandboxService };
