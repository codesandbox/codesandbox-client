import { TPromise } from '../base/common/winjs.base';
import { Emitter } from '../base/common/event';
var CodeSandboxWindowsService = /** @class */ (function () {
    function CodeSandboxWindowsService() {
        var _this = this;
        this._onWindowOpen = new Emitter();
        this._onWindowFocus = new Emitter();
        this._onWindowBlur = new Emitter();
        this._onWindowMaximize = new Emitter();
        this._onWindowUnmaximize = new Emitter();
        this.onWindowOpen = this._onWindowOpen.event;
        this.onWindowFocus = this._onWindowFocus.event;
        this.onWindowBlur = this._onWindowBlur.event;
        this.onWindowMaximize = this._onWindowMaximize
            .event;
        this.onWindowUnmaximize = this._onWindowUnmaximize
            .event;
        this.listenForFocus = function () {
            _this._onWindowFocus.fire(0);
        };
        this.listenForBlur = function () {
            _this._onWindowBlur.fire(0);
        };
        window.addEventListener('focus', this.listenForFocus);
        window.addEventListener('blur', this.listenForBlur);
    }
    CodeSandboxWindowsService.prototype.dispose = function () {
        window.removeEventListener('focus', this.listenForFocus);
        window.removeEventListener('blur', this.listenForBlur);
    };
    CodeSandboxWindowsService.prototype.pickFileFolderAndOpen = function (options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.pickFileAndOpen = function (options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.pickFolderAndOpen = function (options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.pickWorkspaceAndOpen = function (options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showMessageBox = function (windowId, options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showSaveDialog = function (windowId, options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showOpenDialog = function (windowId, options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.reloadWindow = function (windowId, args) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openDevTools = function (windowId, options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.toggleDevTools = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.closeWorkspace = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.enterWorkspace = function (windowId, path) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.createAndEnterWorkspace = function (windowId, folders, path) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.saveAndEnterWorkspace = function (windowId, path) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.toggleFullScreen = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.setRepresentedFilename = function (windowId, fileName) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.addRecentlyOpened = function (files) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.newWindowTab = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.removeFromRecentlyOpened = function (paths) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.clearRecentlyOpened = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.getRecentlyOpened = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.focusWindow = function (windowId) {
        return new TPromise(function (r) {
            window.focus();
            r(undefined);
        });
    };
    CodeSandboxWindowsService.prototype.closeWindow = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.isFocused = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.isMaximized = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.maximizeWindow = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.unmaximizeWindow = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.minimizeWindow = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.onWindowTitleDoubleClick = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.setDocumentEdited = function (windowId, flag) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.quit = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.relaunch = function (options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showPreviousWindowTab = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showNextWindowTab = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.moveWindowTabToNewWindow = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.mergeAllWindowTabs = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.toggleWindowTabsBar = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.updateTouchBar = function (windowId, items) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.whenSharedProcessReady = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.toggleSharedProcess = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openWindow = function (windowId, paths, options) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openNewWindow = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showWindow = function (windowId) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.getWindows = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.getWindowCount = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.log = function (severity) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.showItemInFolder = function (path) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.getActiveWindowId = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openExternal = function (url) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.startCrashReporter = function (config) {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openAccessibilityOptions = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    CodeSandboxWindowsService.prototype.openAboutDialog = function () {
        console.log('WindowService Called');
        throw new Error('Method not implemented.');
    };
    return CodeSandboxWindowsService;
}());
export { CodeSandboxWindowsService };
