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
import { localize } from '../../../nls.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { IExtensionManagementService, isIExtensionIdentifier } from './extensionManagement.js';
import { getIdFromLocalExtensionId, areSameExtensions } from './extensionManagementUtil.js';
import { IWorkspaceContextService } from '../../workspace/common/workspace.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
var DISABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/disabled';
var ENABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/enabled';
var ExtensionEnablementService = /** @class */ (function () {
    function ExtensionEnablementService(storageService, contextService, environmentService, extensionManagementService) {
        this.storageService = storageService;
        this.contextService = contextService;
        this.environmentService = environmentService;
        this.extensionManagementService = extensionManagementService;
        this.disposables = [];
        this._onEnablementChanged = new Emitter();
        this.onEnablementChanged = this._onEnablementChanged.event;
        extensionManagementService.onDidUninstallExtension(this._onDidUninstallExtension, this, this.disposables);
    }
    Object.defineProperty(ExtensionEnablementService.prototype, "hasWorkspace", {
        get: function () {
            return this.contextService.getWorkbenchState() !== 1 /* EMPTY */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionEnablementService.prototype, "allUserExtensionsDisabled", {
        get: function () {
            return this.environmentService.disableExtensions === true;
        },
        enumerable: true,
        configurable: true
    });
    ExtensionEnablementService.prototype.getDisabledExtensions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, _loop_1, _i, _a, e, workspaceEnabledExtensions_1, allInstalledExtensions, _loop_2, this_1, _b, allInstalledExtensions_1, installedExtension;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = this._getDisabledExtensions(0 /* GLOBAL */);
                        if (this.hasWorkspace) {
                            _loop_1 = function (e) {
                                if (!result.some(function (r) { return areSameExtensions(r, e); })) {
                                    result.push(e);
                                }
                            };
                            for (_i = 0, _a = this._getDisabledExtensions(1 /* WORKSPACE */); _i < _a.length; _i++) {
                                e = _a[_i];
                                _loop_1(e);
                            }
                            workspaceEnabledExtensions_1 = this._getEnabledExtensions(1 /* WORKSPACE */);
                            if (workspaceEnabledExtensions_1.length) {
                                result = result.filter(function (r) { return !workspaceEnabledExtensions_1.some(function (e) { return areSameExtensions(e, r); }); });
                            }
                        }
                        if (!this.environmentService.disableExtensions) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.extensionManagementService.getInstalled()];
                    case 1:
                        allInstalledExtensions = _c.sent();
                        _loop_2 = function (installedExtension) {
                            if (this_1._isExtensionDisabledInEnvironment(installedExtension)) {
                                if (!result.some(function (r) { return areSameExtensions(r, installedExtension.galleryIdentifier); })) {
                                    result.push(installedExtension.galleryIdentifier);
                                }
                            }
                        };
                        this_1 = this;
                        for (_b = 0, allInstalledExtensions_1 = allInstalledExtensions; _b < allInstalledExtensions_1.length; _b++) {
                            installedExtension = allInstalledExtensions_1[_b];
                            _loop_2(installedExtension);
                        }
                        _c.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
    ExtensionEnablementService.prototype.getEnablementState = function (extension) {
        if (this._isExtensionDisabledInEnvironment(extension)) {
            return 0 /* Disabled */;
        }
        var identifier = extension.galleryIdentifier;
        if (this.hasWorkspace) {
            if (this._getEnabledExtensions(1 /* WORKSPACE */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
                return 3 /* WorkspaceEnabled */;
            }
            if (this._getDisabledExtensions(1 /* WORKSPACE */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
                return 1 /* WorkspaceDisabled */;
            }
        }
        if (this._getDisabledExtensions(0 /* GLOBAL */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
            return 0 /* Disabled */;
        }
        return 2 /* Enabled */;
    };
    ExtensionEnablementService.prototype.canChangeEnablement = function (extension) {
        if (extension.manifest && extension.manifest.contributes && extension.manifest.contributes.localizations && extension.manifest.contributes.localizations.length) {
            return false;
        }
        if (extension.type === 1 /* User */ && this.environmentService.disableExtensions) {
            return false;
        }
        return true;
    };
    ExtensionEnablementService.prototype.setEnablement = function (arg, newState) {
        var identifier;
        if (isIExtensionIdentifier(arg)) {
            identifier = arg;
        }
        else {
            if (!this.canChangeEnablement(arg)) {
                return TPromise.wrap(false);
            }
            identifier = arg.galleryIdentifier;
        }
        var workspace = newState === 1 /* WorkspaceDisabled */ || newState === 3 /* WorkspaceEnabled */;
        if (workspace && !this.hasWorkspace) {
            return TPromise.wrapError(new Error(localize('noWorkspace', "No workspace.")));
        }
        var currentState = this._getEnablementState(identifier);
        if (currentState === newState) {
            return TPromise.as(false);
        }
        switch (newState) {
            case 2 /* Enabled */:
                this._enableExtension(identifier);
                break;
            case 0 /* Disabled */:
                this._disableExtension(identifier);
                break;
            case 3 /* WorkspaceEnabled */:
                this._enableExtensionInWorkspace(identifier);
                break;
            case 1 /* WorkspaceDisabled */:
                this._disableExtensionInWorkspace(identifier);
                break;
        }
        this._onEnablementChanged.fire(identifier);
        return TPromise.as(true);
    };
    ExtensionEnablementService.prototype.isEnabled = function (extension) {
        var enablementState = this.getEnablementState(extension);
        return enablementState === 3 /* WorkspaceEnabled */ || enablementState === 2 /* Enabled */;
    };
    ExtensionEnablementService.prototype._isExtensionDisabledInEnvironment = function (extension) {
        if (this.allUserExtensionsDisabled) {
            return extension.type === 1 /* User */;
        }
        var disabledExtensions = this.environmentService.disableExtensions;
        if (Array.isArray(disabledExtensions)) {
            return disabledExtensions.some(function (id) { return areSameExtensions({ id: id }, extension.galleryIdentifier); });
        }
        return false;
    };
    ExtensionEnablementService.prototype._getEnablementState = function (identifier) {
        if (this.hasWorkspace) {
            if (this._getEnabledExtensions(1 /* WORKSPACE */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
                return 3 /* WorkspaceEnabled */;
            }
            if (this._getDisabledExtensions(1 /* WORKSPACE */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
                return 1 /* WorkspaceDisabled */;
            }
        }
        if (this._getDisabledExtensions(0 /* GLOBAL */).filter(function (e) { return areSameExtensions(e, identifier); })[0]) {
            return 0 /* Disabled */;
        }
        return 2 /* Enabled */;
    };
    ExtensionEnablementService.prototype._enableExtension = function (identifier) {
        this._removeFromDisabledExtensions(identifier, 1 /* WORKSPACE */);
        this._removeFromEnabledExtensions(identifier, 1 /* WORKSPACE */);
        this._removeFromDisabledExtensions(identifier, 0 /* GLOBAL */);
    };
    ExtensionEnablementService.prototype._disableExtension = function (identifier) {
        this._removeFromDisabledExtensions(identifier, 1 /* WORKSPACE */);
        this._removeFromEnabledExtensions(identifier, 1 /* WORKSPACE */);
        this._addToDisabledExtensions(identifier, 0 /* GLOBAL */);
    };
    ExtensionEnablementService.prototype._enableExtensionInWorkspace = function (identifier) {
        this._removeFromDisabledExtensions(identifier, 1 /* WORKSPACE */);
        this._addToEnabledExtensions(identifier, 1 /* WORKSPACE */);
    };
    ExtensionEnablementService.prototype._disableExtensionInWorkspace = function (identifier) {
        this._addToDisabledExtensions(identifier, 1 /* WORKSPACE */);
        this._removeFromEnabledExtensions(identifier, 1 /* WORKSPACE */);
    };
    ExtensionEnablementService.prototype._addToDisabledExtensions = function (identifier, scope) {
        if (scope === 1 /* WORKSPACE */ && !this.hasWorkspace) {
            return TPromise.wrap(false);
        }
        var disabledExtensions = this._getDisabledExtensions(scope);
        if (disabledExtensions.every(function (e) { return !areSameExtensions(e, identifier); })) {
            disabledExtensions.push(identifier);
            this._setDisabledExtensions(disabledExtensions, scope, identifier);
            return TPromise.wrap(true);
        }
        return TPromise.wrap(false);
    };
    ExtensionEnablementService.prototype._removeFromDisabledExtensions = function (identifier, scope) {
        if (scope === 1 /* WORKSPACE */ && !this.hasWorkspace) {
            return false;
        }
        var disabledExtensions = this._getDisabledExtensions(scope);
        for (var index = 0; index < disabledExtensions.length; index++) {
            var disabledExtension = disabledExtensions[index];
            if (areSameExtensions(disabledExtension, identifier)) {
                disabledExtensions.splice(index, 1);
                this._setDisabledExtensions(disabledExtensions, scope, identifier);
                return true;
            }
        }
        return false;
    };
    ExtensionEnablementService.prototype._addToEnabledExtensions = function (identifier, scope) {
        if (scope === 1 /* WORKSPACE */ && !this.hasWorkspace) {
            return false;
        }
        var enabledExtensions = this._getEnabledExtensions(scope);
        if (enabledExtensions.every(function (e) { return !areSameExtensions(e, identifier); })) {
            enabledExtensions.push(identifier);
            this._setEnabledExtensions(enabledExtensions, scope, identifier);
            return true;
        }
        return false;
    };
    ExtensionEnablementService.prototype._removeFromEnabledExtensions = function (identifier, scope) {
        if (scope === 1 /* WORKSPACE */ && !this.hasWorkspace) {
            return false;
        }
        var enabledExtensions = this._getEnabledExtensions(scope);
        for (var index = 0; index < enabledExtensions.length; index++) {
            var disabledExtension = enabledExtensions[index];
            if (areSameExtensions(disabledExtension, identifier)) {
                enabledExtensions.splice(index, 1);
                this._setEnabledExtensions(enabledExtensions, scope, identifier);
                return true;
            }
        }
        return false;
    };
    ExtensionEnablementService.prototype._getEnabledExtensions = function (scope) {
        return this._getExtensions(ENABLED_EXTENSIONS_STORAGE_PATH, scope);
    };
    ExtensionEnablementService.prototype._setEnabledExtensions = function (enabledExtensions, scope, extension) {
        this._setExtensions(ENABLED_EXTENSIONS_STORAGE_PATH, enabledExtensions, scope, extension);
    };
    ExtensionEnablementService.prototype._getDisabledExtensions = function (scope) {
        return this._getExtensions(DISABLED_EXTENSIONS_STORAGE_PATH, scope);
    };
    ExtensionEnablementService.prototype._setDisabledExtensions = function (disabledExtensions, scope, extension) {
        this._setExtensions(DISABLED_EXTENSIONS_STORAGE_PATH, disabledExtensions, scope, extension);
    };
    ExtensionEnablementService.prototype._getExtensions = function (storageId, scope) {
        if (scope === 1 /* WORKSPACE */ && !this.hasWorkspace) {
            return [];
        }
        var value = this.storageService.get(storageId, scope, '');
        return value ? JSON.parse(value) : [];
    };
    ExtensionEnablementService.prototype._setExtensions = function (storageId, extensions, scope, extension) {
        if (extensions.length) {
            this.storageService.store(storageId, JSON.stringify(extensions.map(function (_a) {
                var id = _a.id, uuid = _a.uuid;
                return ({ id: id, uuid: uuid });
            })), scope);
        }
        else {
            this.storageService.remove(storageId, scope);
        }
    };
    ExtensionEnablementService.prototype._onDidUninstallExtension = function (_a) {
        var identifier = _a.identifier, error = _a.error;
        if (!error) {
            var id = getIdFromLocalExtensionId(identifier.id);
            if (id) {
                var extension = { id: id, uuid: identifier.uuid };
                this._removeFromDisabledExtensions(extension, 1 /* WORKSPACE */);
                this._removeFromEnabledExtensions(extension, 1 /* WORKSPACE */);
                this._removeFromDisabledExtensions(extension, 0 /* GLOBAL */);
            }
        }
    };
    ExtensionEnablementService.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    ExtensionEnablementService = __decorate([
        __param(0, IStorageService),
        __param(1, IWorkspaceContextService),
        __param(2, IEnvironmentService),
        __param(3, IExtensionManagementService)
    ], ExtensionEnablementService);
    return ExtensionEnablementService;
}());
export { ExtensionEnablementService };
