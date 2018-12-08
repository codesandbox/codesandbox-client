/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { localize } from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { combinedDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IExtensionEnablementService, IExtensionGalleryService, IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IURLService } from '../../../../platform/url/common/url.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { IExtensionService } from '../common/extensions.js';
var FIVE_MINUTES = 5 * 60 * 1000;
var THIRTY_SECONDS = 30 * 1000;
var URL_TO_HANDLE = 'extensionUrlHandler.urlToHandle';
function isExtensionId(value) {
    return /^[a-z0-9][a-z0-9\-]*\.[a-z0-9][a-z0-9\-]*$/i.test(value);
}
export var IExtensionUrlHandler = createDecorator('inactiveExtensionUrlHandler');
/**
 * This class handles URLs which are directed towards inactive extensions.
 * If a URL is directed towards an inactive extension, it buffers it,
 * activates the extension and re-opens the URL once the extension registers
 * a URL handler. If the extension never registers a URL handler, the urls
 * will eventually be garbage collected.
 *
 * It also makes sure the user confirms opening URLs directed towards extensions.
 */
var ExtensionUrlHandler = /** @class */ (function () {
    function ExtensionUrlHandler(urlService, extensionService, dialogService, notificationService, extensionManagementService, extensionEnablementService, windowService, galleryService, storageService) {
        var _this = this;
        this.extensionService = extensionService;
        this.dialogService = dialogService;
        this.notificationService = notificationService;
        this.extensionManagementService = extensionManagementService;
        this.extensionEnablementService = extensionEnablementService;
        this.windowService = windowService;
        this.galleryService = galleryService;
        this.storageService = storageService;
        this.extensionHandlers = new Map();
        this.uriBuffer = new Map();
        var interval = setInterval(function () { return _this.garbageCollect(); }, THIRTY_SECONDS);
        var urlToHandleValue = this.storageService.get(URL_TO_HANDLE, 1 /* WORKSPACE */);
        if (urlToHandleValue) {
            this.storageService.remove(URL_TO_HANDLE, 1 /* WORKSPACE */);
            this.handleURL(URI.revive(JSON.parse(urlToHandleValue)), true);
        }
        this.disposable = combinedDisposable([
            urlService.registerHandler(this),
            toDisposable(function () { return clearInterval(interval); })
        ]);
    }
    ExtensionUrlHandler.prototype.handleURL = function (uri, confirmed) {
        var _this = this;
        if (!isExtensionId(uri.authority)) {
            return TPromise.as(false);
        }
        var extensionId = uri.authority;
        var wasHandlerAvailable = this.extensionHandlers.has(extensionId);
        return this.extensionService.getExtensions().then(function (extensions) {
            var extension = extensions.filter(function (e) { return e.id === extensionId; })[0];
            if (!extension) {
                return _this.handleUnhandledURL(uri, { id: extensionId }).then(function () { return false; });
            }
            var handleURL = function () {
                var handler = _this.extensionHandlers.get(extensionId);
                if (handler) {
                    if (!wasHandlerAvailable) {
                        // forward it directly
                        return handler.handleURL(uri);
                    }
                    // let the ExtensionUrlHandler instance handle this
                    return TPromise.as(false);
                }
                // collect URI for eventual extension activation
                var timestamp = new Date().getTime();
                var uris = _this.uriBuffer.get(extensionId);
                if (!uris) {
                    uris = [];
                    _this.uriBuffer.set(extensionId, uris);
                }
                uris.push({ timestamp: timestamp, uri: uri });
                // activate the extension
                return _this.extensionService.activateByEvent("onUri:" + extensionId)
                    .then(function () { return true; });
            };
            if (confirmed) {
                return handleURL();
            }
            return _this.dialogService.confirm({
                message: localize('confirmUrl', "Allow an extension to open this URL?", extensionId),
                detail: (extension.displayName || extension.name) + " (" + extensionId + ") wants to open a URL:\n\n" + uri.toString(),
                primaryButton: localize('open', "&&Open"),
                type: 'question'
            }).then(function (result) {
                if (!result.confirmed) {
                    return TPromise.as(true);
                }
                return handleURL();
            });
        });
    };
    ExtensionUrlHandler.prototype.registerExtensionHandler = function (extensionId, handler) {
        this.extensionHandlers.set(extensionId, handler);
        var uris = this.uriBuffer.get(extensionId) || [];
        for (var _i = 0, uris_1 = uris; _i < uris_1.length; _i++) {
            var uri = uris_1[_i].uri;
            handler.handleURL(uri);
        }
        this.uriBuffer.delete(extensionId);
    };
    ExtensionUrlHandler.prototype.unregisterExtensionHandler = function (extensionId) {
        this.extensionHandlers.delete(extensionId);
    };
    ExtensionUrlHandler.prototype.handleUnhandledURL = function (uri, extensionIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var installedExtensions, extension, enabled, galleryExtension_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.extensionManagementService.getInstalled()];
                    case 1:
                        installedExtensions = _a.sent();
                        extension = installedExtensions.filter(function (e) { return areSameExtensions(e.galleryIdentifier, extensionIdentifier); })[0];
                        if (!extension) return [3 /*break*/, 2];
                        enabled = this.extensionEnablementService.isEnabled(extension);
                        // Extension is not running. Reload the window to handle.
                        if (enabled) {
                            this.dialogService.confirm({
                                message: localize('reloadAndHandle', "Extension '{0}' is not loaded. Would you like to reload the window to load the extension and open the URL?", extension.manifest.displayName || extension.manifest.name),
                                detail: (extension.manifest.displayName || extension.manifest.name) + " (" + extensionIdentifier.id + ") wants to open a URL:\n\n" + uri.toString(),
                                primaryButton: localize('reloadAndOpen', "&&Reload Window and Open"),
                                type: 'question'
                            }).then(function (result) {
                                if (result.confirmed) {
                                    return _this.reloadAndHandle(uri);
                                }
                                return null;
                            });
                        }
                        // Extension is disabled. Enable the extension and reload the window to handle.
                        else {
                            this.dialogService.confirm({
                                message: localize('enableAndHandle', "Extension '{0}' is disabled. Would you like to enable the extension and reload the window to open the URL?", extension.manifest.displayName || extension.manifest.name),
                                detail: (extension.manifest.displayName || extension.manifest.name) + " (" + extensionIdentifier.id + ") wants to open a URL:\n\n" + uri.toString(),
                                primaryButton: localize('enableAndReload', "&&Enable and Open"),
                                type: 'question'
                            }).then(function (result) {
                                if (result.confirmed) {
                                    return _this.extensionEnablementService.setEnablement(extension, 2 /* Enabled */)
                                        .then(function () { return _this.reloadAndHandle(uri); });
                                }
                                return null;
                            });
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.galleryService.getExtension(extensionIdentifier)];
                    case 3:
                        galleryExtension_1 = _a.sent();
                        if (galleryExtension_1) {
                            // Install the Extension and reload the window to handle.
                            this.dialogService.confirm({
                                message: localize('installAndHandle', "Extension '{0}' is not installed. Would you like to install the extension and reload the window to open this URL?", galleryExtension_1.displayName || galleryExtension_1.name),
                                detail: (galleryExtension_1.displayName || galleryExtension_1.name) + " (" + extensionIdentifier.id + ") wants to open a URL:\n\n" + uri.toString(),
                                primaryButton: localize('install', "&&Install"),
                                type: 'question'
                            }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                var notificationHandle_1, reloadMessage, reloadActionLabel, e_1;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!result.confirmed) return [3 /*break*/, 4];
                                            notificationHandle_1 = this.notificationService.notify({ severity: Severity.Info, message: localize('Installing', "Installing Extension '{0}'...", galleryExtension_1.displayName || galleryExtension_1.name) });
                                            notificationHandle_1.progress.infinite();
                                            notificationHandle_1.onDidClose(function () { return notificationHandle_1 = null; });
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.extensionManagementService.installFromGallery(galleryExtension_1)];
                                        case 2:
                                            _a.sent();
                                            reloadMessage = localize('reload', "Would you like to reload the window and open the URL '{0}'?", uri.toString());
                                            reloadActionLabel = localize('Reload', "Reload Window and Open");
                                            if (notificationHandle_1) {
                                                notificationHandle_1.progress.done();
                                                notificationHandle_1.updateMessage(reloadMessage);
                                                notificationHandle_1.updateActions({
                                                    primary: [new Action('reloadWindow', reloadActionLabel, undefined, true, function () { return _this.reloadAndHandle(uri); })]
                                                });
                                            }
                                            else {
                                                this.notificationService.prompt(Severity.Info, reloadMessage, [{
                                                        label: reloadActionLabel,
                                                        run: function () { return _this.reloadAndHandle(uri); }
                                                    }], { sticky: true });
                                            }
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_1 = _a.sent();
                                            if (notificationHandle_1) {
                                                notificationHandle_1.progress.done();
                                                notificationHandle_1.updateSeverity(Severity.Error);
                                                notificationHandle_1.updateMessage(e_1);
                                            }
                                            else {
                                                this.notificationService.error(e_1);
                                            }
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExtensionUrlHandler.prototype.reloadAndHandle = function (url) {
        this.storageService.store(URL_TO_HANDLE, JSON.stringify(url.toJSON()), 1 /* WORKSPACE */);
        return this.windowService.reloadWindow();
    };
    // forget about all uris buffered more than 5 minutes ago
    ExtensionUrlHandler.prototype.garbageCollect = function () {
        var now = new Date().getTime();
        var uriBuffer = new Map();
        this.uriBuffer.forEach(function (uris, extensionId) {
            uris = uris.filter(function (_a) {
                var timestamp = _a.timestamp;
                return now - timestamp < FIVE_MINUTES;
            });
            if (uris.length > 0) {
                uriBuffer.set(extensionId, uris);
            }
        });
        this.uriBuffer = uriBuffer;
    };
    ExtensionUrlHandler.prototype.dispose = function () {
        this.disposable.dispose();
        this.extensionHandlers.clear();
        this.uriBuffer.clear();
    };
    ExtensionUrlHandler = __decorate([
        __param(0, IURLService),
        __param(1, IExtensionService),
        __param(2, IDialogService),
        __param(3, INotificationService),
        __param(4, IExtensionManagementService),
        __param(5, IExtensionEnablementService),
        __param(6, IWindowService),
        __param(7, IExtensionGalleryService),
        __param(8, IStorageService)
    ], ExtensionUrlHandler);
    return ExtensionUrlHandler;
}());
export { ExtensionUrlHandler };
