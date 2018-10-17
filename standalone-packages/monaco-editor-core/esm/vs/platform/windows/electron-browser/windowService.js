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
import { filterEvent, mapEvent, anyEvent } from '../../../base/common/event';
import { IWindowsService } from '../common/windows';
var WindowService = /** @class */ (function () {
    function WindowService(windowId, configuration, windowsService) {
        this.windowId = windowId;
        this.configuration = configuration;
        this.windowsService = windowsService;
        var onThisWindowFocus = mapEvent(filterEvent(windowsService.onWindowFocus, function (id) { return id === windowId; }), function (_) { return true; });
        var onThisWindowBlur = mapEvent(filterEvent(windowsService.onWindowBlur, function (id) { return id === windowId; }), function (_) { return false; });
        var onThisWindowMaximize = mapEvent(filterEvent(windowsService.onWindowMaximize, function (id) { return id === windowId; }), function (_) { return true; });
        var onThisWindowUnmaximize = mapEvent(filterEvent(windowsService.onWindowUnmaximize, function (id) { return id === windowId; }), function (_) { return false; });
        this.onDidChangeFocus = anyEvent(onThisWindowFocus, onThisWindowBlur);
        this.onDidChangeMaximize = anyEvent(onThisWindowMaximize, onThisWindowUnmaximize);
    }
    WindowService.prototype.getCurrentWindowId = function () {
        return this.windowId;
    };
    WindowService.prototype.getConfiguration = function () {
        return this.configuration;
    };
    WindowService.prototype.pickFileFolderAndOpen = function (options) {
        options.windowId = this.windowId;
        return this.windowsService.pickFileFolderAndOpen(options);
    };
    WindowService.prototype.pickFileAndOpen = function (options) {
        options.windowId = this.windowId;
        return this.windowsService.pickFileAndOpen(options);
    };
    WindowService.prototype.pickFolderAndOpen = function (options) {
        options.windowId = this.windowId;
        return this.windowsService.pickFolderAndOpen(options);
    };
    WindowService.prototype.pickWorkspaceAndOpen = function (options) {
        options.windowId = this.windowId;
        return this.windowsService.pickWorkspaceAndOpen(options);
    };
    WindowService.prototype.reloadWindow = function (args) {
        return this.windowsService.reloadWindow(this.windowId, args);
    };
    WindowService.prototype.openDevTools = function (options) {
        return this.windowsService.openDevTools(this.windowId, options);
    };
    WindowService.prototype.toggleDevTools = function () {
        return this.windowsService.toggleDevTools(this.windowId);
    };
    WindowService.prototype.closeWorkspace = function () {
        return this.windowsService.closeWorkspace(this.windowId);
    };
    WindowService.prototype.enterWorkspace = function (path) {
        return this.windowsService.enterWorkspace(this.windowId, path);
    };
    WindowService.prototype.createAndEnterWorkspace = function (folders, path) {
        return this.windowsService.createAndEnterWorkspace(this.windowId, folders, path);
    };
    WindowService.prototype.saveAndEnterWorkspace = function (path) {
        return this.windowsService.saveAndEnterWorkspace(this.windowId, path);
    };
    WindowService.prototype.openWindow = function (paths, options) {
        return this.windowsService.openWindow(this.windowId, paths, options);
    };
    WindowService.prototype.closeWindow = function () {
        return this.windowsService.closeWindow(this.windowId);
    };
    WindowService.prototype.toggleFullScreen = function () {
        return this.windowsService.toggleFullScreen(this.windowId);
    };
    WindowService.prototype.setRepresentedFilename = function (fileName) {
        return this.windowsService.setRepresentedFilename(this.windowId, fileName);
    };
    WindowService.prototype.getRecentlyOpened = function () {
        return this.windowsService.getRecentlyOpened(this.windowId);
    };
    WindowService.prototype.focusWindow = function () {
        return this.windowsService.focusWindow(this.windowId);
    };
    WindowService.prototype.isFocused = function () {
        return this.windowsService.isFocused(this.windowId);
    };
    WindowService.prototype.isMaximized = function () {
        return this.windowsService.isMaximized(this.windowId);
    };
    WindowService.prototype.maximizeWindow = function () {
        return this.windowsService.maximizeWindow(this.windowId);
    };
    WindowService.prototype.unmaximizeWindow = function () {
        return this.windowsService.unmaximizeWindow(this.windowId);
    };
    WindowService.prototype.minimizeWindow = function () {
        return this.windowsService.minimizeWindow(this.windowId);
    };
    WindowService.prototype.onWindowTitleDoubleClick = function () {
        return this.windowsService.onWindowTitleDoubleClick(this.windowId);
    };
    WindowService.prototype.setDocumentEdited = function (flag) {
        return this.windowsService.setDocumentEdited(this.windowId, flag);
    };
    WindowService.prototype.show = function () {
        return this.windowsService.showWindow(this.windowId);
    };
    WindowService.prototype.showMessageBox = function (options) {
        return this.windowsService.showMessageBox(this.windowId, options);
    };
    WindowService.prototype.showSaveDialog = function (options) {
        return this.windowsService.showSaveDialog(this.windowId, options);
    };
    WindowService.prototype.showOpenDialog = function (options) {
        return this.windowsService.showOpenDialog(this.windowId, options);
    };
    WindowService.prototype.updateTouchBar = function (items) {
        return this.windowsService.updateTouchBar(this.windowId, items);
    };
    WindowService = __decorate([
        __param(2, IWindowsService)
    ], WindowService);
    return WindowService;
}());
export { WindowService };
