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
import { isPromiseCanceledError } from '../../../base/common/errors.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { areSameExtensions } from '../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { ISearchService } from '../../../platform/search/common/search.js';
import { IStatusbarService } from '../../../platform/statusbar/common/statusbar.js';
import { IWindowService } from '../../../platform/windows/common/windows.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { QueryBuilder } from '../../parts/search/common/queryBuilder.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { IWorkspaceEditingService } from '../../services/workspace/common/workspaceEditing.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
var MainThreadWorkspace = /** @class */ (function () {
    function MainThreadWorkspace(extHostContext, _searchService, _contextService, _textFileService, _configurationService, _workspaceEditingService, _statusbarService, _windowService, _instantiationService, _labelService) {
        this._searchService = _searchService;
        this._contextService = _contextService;
        this._textFileService = _textFileService;
        this._configurationService = _configurationService;
        this._workspaceEditingService = _workspaceEditingService;
        this._statusbarService = _statusbarService;
        this._windowService = _windowService;
        this._instantiationService = _instantiationService;
        this._labelService = _labelService;
        this._toDispose = [];
        this._activeCancelTokens = Object.create(null);
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostWorkspace);
        this._contextService.onDidChangeWorkspaceFolders(this._onDidChangeWorkspace, this, this._toDispose);
        this._contextService.onDidChangeWorkbenchState(this._onDidChangeWorkspace, this, this._toDispose);
    }
    MainThreadWorkspace.prototype.dispose = function () {
        dispose(this._toDispose);
        for (var requestId in this._activeCancelTokens) {
            var tokenSource = this._activeCancelTokens[requestId];
            tokenSource.cancel();
        }
    };
    // --- workspace ---
    MainThreadWorkspace.prototype.$updateWorkspaceFolders = function (extensionName, index, deleteCount, foldersToAdd) {
        var workspaceFoldersToAdd = foldersToAdd.map(function (f) { return ({ uri: URI.revive(f.uri), name: f.name }); });
        // Indicate in status message
        this._statusbarService.setStatusMessage(this.getStatusMessage(extensionName, workspaceFoldersToAdd.length, deleteCount), 10 * 1000 /* 10s */);
        return this._workspaceEditingService.updateFolders(index, deleteCount, workspaceFoldersToAdd, true);
    };
    MainThreadWorkspace.prototype.getStatusMessage = function (extensionName, addCount, removeCount) {
        var message;
        var wantsToAdd = addCount > 0;
        var wantsToDelete = removeCount > 0;
        // Add Folders
        if (wantsToAdd && !wantsToDelete) {
            if (addCount === 1) {
                message = localize('folderStatusMessageAddSingleFolder', "Extension '{0}' added 1 folder to the workspace", extensionName);
            }
            else {
                message = localize('folderStatusMessageAddMultipleFolders', "Extension '{0}' added {1} folders to the workspace", extensionName, addCount);
            }
        }
        // Delete Folders
        else if (wantsToDelete && !wantsToAdd) {
            if (removeCount === 1) {
                message = localize('folderStatusMessageRemoveSingleFolder', "Extension '{0}' removed 1 folder from the workspace", extensionName);
            }
            else {
                message = localize('folderStatusMessageRemoveMultipleFolders', "Extension '{0}' removed {1} folders from the workspace", extensionName, removeCount);
            }
        }
        // Change Folders
        else {
            message = localize('folderStatusChangeFolder', "Extension '{0}' changed folders of the workspace", extensionName);
        }
        return message;
    };
    MainThreadWorkspace.prototype._onDidChangeWorkspace = function () {
        var workspace = this._contextService.getWorkbenchState() === 1 /* EMPTY */ ? null : this._contextService.getWorkspace();
        this._proxy.$acceptWorkspaceData(workspace ? {
            configuration: workspace.configuration,
            folders: workspace.folders,
            id: workspace.id,
            name: this._labelService.getWorkspaceLabel(workspace)
        } : null);
    };
    // --- search ---
    MainThreadWorkspace.prototype.$startFileSearch = function (includePattern, _includeFolder, excludePatternOrDisregardExcludes, maxResults, token) {
        var _this = this;
        var _a, _b;
        var includeFolder = URI.revive(_includeFolder);
        var workspace = this._contextService.getWorkspace();
        if (!workspace.folders.length) {
            return undefined;
        }
        var folderQueries;
        if (includeFolder) {
            folderQueries = [{ folder: includeFolder }]; // if base provided, only search in that folder
        }
        else {
            folderQueries = workspace.folders.map(function (folder) { return ({ folder: folder.uri }); }); // absolute pattern: search across all folders
        }
        if (!folderQueries) {
            return undefined; // invalid query parameters
        }
        var useRipgrep = folderQueries.every(function (folderQuery) {
            var folderConfig = _this._configurationService.getValue({ resource: folderQuery.folder });
            return folderConfig.search.useRipgrep;
        });
        var ignoreSymlinks = folderQueries.every(function (folderQuery) {
            var folderConfig = _this._configurationService.getValue({ resource: folderQuery.folder });
            return !folderConfig.search.followSymlinks;
        });
        // TODO replace wth QueryBuilder
        folderQueries.forEach(function (fq) {
            fq.ignoreSymlinks = ignoreSymlinks;
        });
        var query = {
            folderQueries: folderQueries,
            type: 1 /* File */,
            maxResults: maxResults,
            disregardExcludeSettings: excludePatternOrDisregardExcludes === false,
            useRipgrep: useRipgrep,
            _reason: 'startFileSearch'
        };
        if (typeof includePattern === 'string') {
            query.includePattern = (_a = {}, _a[includePattern] = true, _a);
        }
        if (typeof excludePatternOrDisregardExcludes === 'string') {
            query.excludePattern = (_b = {}, _b[excludePatternOrDisregardExcludes] = true, _b);
        }
        this._searchService.extendQuery(query);
        return this._searchService.fileSearch(query, token).then(function (result) {
            return result.results.map(function (m) { return m.resource; });
        }, function (err) {
            if (!isPromiseCanceledError(err)) {
                return Promise.reject(err);
            }
            return undefined;
        });
    };
    MainThreadWorkspace.prototype.$startTextSearch = function (pattern, options, requestId, token) {
        var _this = this;
        var workspace = this._contextService.getWorkspace();
        var folders = workspace.folders.map(function (folder) { return folder.uri; });
        var queryBuilder = this._instantiationService.createInstance(QueryBuilder);
        var query = queryBuilder.text(pattern, folders, options);
        query._reason = 'startTextSearch';
        var onProgress = function (p) {
            if (p.results) {
                _this._proxy.$handleTextSearchResult(p, requestId);
            }
        };
        var search = this._searchService.textSearch(query, token, onProgress).then(function (result) {
            return { limitHit: result.limitHit };
        }, function (err) {
            if (!isPromiseCanceledError(err)) {
                return Promise.reject(err);
            }
            return undefined;
        });
        return search;
    };
    MainThreadWorkspace.prototype.$checkExists = function (includes, token) {
        var queryBuilder = this._instantiationService.createInstance(QueryBuilder);
        var folders = this._contextService.getWorkspace().folders.map(function (folder) { return folder.uri; });
        var query = queryBuilder.file(folders, {
            _reason: 'checkExists',
            includePattern: includes.join(', '),
            exists: true
        });
        return this._searchService.fileSearch(query, token).then(function (result) {
            return result.limitHit;
        }, function (err) {
            if (!isPromiseCanceledError(err)) {
                return Promise.reject(err);
            }
            return undefined;
        });
    };
    // --- save & edit resources ---
    MainThreadWorkspace.prototype.$saveAll = function (includeUntitled) {
        return this._textFileService.saveAll(includeUntitled).then(function (result) {
            return result.results.every(function (each) { return each.success === true; });
        });
    };
    MainThreadWorkspace.prototype.$resolveProxy = function (url) {
        return this._windowService.resolveProxy(url);
    };
    MainThreadWorkspace = __decorate([
        extHostNamedCustomer(MainContext.MainThreadWorkspace),
        __param(1, ISearchService),
        __param(2, IWorkspaceContextService),
        __param(3, ITextFileService),
        __param(4, IConfigurationService),
        __param(5, IWorkspaceEditingService),
        __param(6, IStatusbarService),
        __param(7, IWindowService),
        __param(8, IInstantiationService),
        __param(9, ILabelService)
    ], MainThreadWorkspace);
    return MainThreadWorkspace;
}());
export { MainThreadWorkspace };
CommandsRegistry.registerCommand('_workbench.enterWorkspace', function (accessor, workspace, disableExtensions) {
    return __awaiter(this, void 0, void 0, function () {
        var workspaceEditingService, extensionService, windowService, runningExtensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workspaceEditingService = accessor.get(IWorkspaceEditingService);
                    extensionService = accessor.get(IExtensionService);
                    windowService = accessor.get(IWindowService);
                    if (!(disableExtensions && disableExtensions.length)) return [3 /*break*/, 2];
                    return [4 /*yield*/, extensionService.getExtensions()];
                case 1:
                    runningExtensions = _a.sent();
                    // If requested extension to disable is running, then reload window with given workspace
                    if (disableExtensions && runningExtensions.some(function (runningExtension) { return disableExtensions.some(function (id) { return areSameExtensions({ id: id }, { id: runningExtension.id }); }); })) {
                        return [2 /*return*/, windowService.openWindow([URI.file(workspace.fsPath)], { args: { _: [], 'disable-extension': disableExtensions } })];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, workspaceEditingService.enterWorkspace(workspace.fsPath)];
            }
        });
    });
});
