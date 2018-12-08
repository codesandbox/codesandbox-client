/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import { join, relative } from '../../../../path.js';
import { delta as arrayDelta, mapArrayOrNot } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { TernarySearchTree } from '../../../base/common/map.js';
import { normalize } from '../../../base/common/paths.js';
import { isLinux } from '../../../base/common/platform.js';
import { basenameOrAuthority, dirname, isEqual } from '../../../base/common/resources.js';
import { compare } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { Severity } from '../../../platform/notification/common/notification.js';
import { resultIsMatch } from '../../../platform/search/common/search.js';
import { Workspace, WorkspaceFolder } from '../../../platform/workspace/common/workspace.js';
import { Range } from './extHostTypes.js';
import { MainContext } from './extHost.protocol.js';
function isFolderEqual(folderA, folderB) {
    return isEqual(folderA, folderB, !isLinux);
}
function compareWorkspaceFolderByUri(a, b) {
    return isFolderEqual(a.uri, b.uri) ? 0 : compare(a.uri.toString(), b.uri.toString());
}
function compareWorkspaceFolderByUriAndNameAndIndex(a, b) {
    if (a.index !== b.index) {
        return a.index < b.index ? -1 : 1;
    }
    return isFolderEqual(a.uri, b.uri) ? compare(a.name, b.name) : compare(a.uri.toString(), b.uri.toString());
}
function delta(oldFolders, newFolders, compare) {
    var oldSortedFolders = oldFolders.slice(0).sort(compare);
    var newSortedFolders = newFolders.slice(0).sort(compare);
    return arrayDelta(oldSortedFolders, newSortedFolders, compare);
}
var ExtHostWorkspaceImpl = /** @class */ (function (_super) {
    __extends(ExtHostWorkspaceImpl, _super);
    function ExtHostWorkspaceImpl(id, _name, folders) {
        var _this = _super.call(this, id, folders.map(function (f) { return new WorkspaceFolder(f); })) || this;
        _this._name = _name;
        _this._workspaceFolders = [];
        _this._structure = TernarySearchTree.forPaths();
        // setup the workspace folder data structure
        folders.forEach(function (folder) {
            _this._workspaceFolders.push(folder);
            _this._structure.set(folder.uri.toString(), folder);
        });
        return _this;
    }
    ExtHostWorkspaceImpl.toExtHostWorkspace = function (data, previousConfirmedWorkspace, previousUnconfirmedWorkspace) {
        if (!data) {
            return { workspace: null, added: [], removed: [] };
        }
        var id = data.id, name = data.name, folders = data.folders;
        var newWorkspaceFolders = [];
        // If we have an existing workspace, we try to find the folders that match our
        // data and update their properties. It could be that an extension stored them
        // for later use and we want to keep them "live" if they are still present.
        var oldWorkspace = previousConfirmedWorkspace;
        if (oldWorkspace) {
            folders.forEach(function (folderData, index) {
                var folderUri = URI.revive(folderData.uri);
                var existingFolder = ExtHostWorkspaceImpl._findFolder(previousUnconfirmedWorkspace || previousConfirmedWorkspace, folderUri);
                if (existingFolder) {
                    existingFolder.name = folderData.name;
                    existingFolder.index = folderData.index;
                    newWorkspaceFolders.push(existingFolder);
                }
                else {
                    newWorkspaceFolders.push({ uri: folderUri, name: folderData.name, index: index });
                }
            });
        }
        else {
            newWorkspaceFolders.push.apply(newWorkspaceFolders, folders.map(function (_a) {
                var uri = _a.uri, name = _a.name, index = _a.index;
                return ({ uri: URI.revive(uri), name: name, index: index });
            }));
        }
        // make sure to restore sort order based on index
        newWorkspaceFolders.sort(function (f1, f2) { return f1.index < f2.index ? -1 : 1; });
        var workspace = new ExtHostWorkspaceImpl(id, name, newWorkspaceFolders);
        var _a = delta(oldWorkspace ? oldWorkspace.workspaceFolders : [], workspace.workspaceFolders, compareWorkspaceFolderByUri), added = _a.added, removed = _a.removed;
        return { workspace: workspace, added: added, removed: removed };
    };
    ExtHostWorkspaceImpl._findFolder = function (workspace, folderUriToFind) {
        for (var i = 0; i < workspace.folders.length; i++) {
            var folder = workspace.workspaceFolders[i];
            if (isFolderEqual(folder.uri, folderUriToFind)) {
                return folder;
            }
        }
        return undefined;
    };
    Object.defineProperty(ExtHostWorkspaceImpl.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWorkspaceImpl.prototype, "workspaceFolders", {
        get: function () {
            return this._workspaceFolders.slice(0);
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWorkspaceImpl.prototype.getWorkspaceFolder = function (uri, resolveParent) {
        if (resolveParent && this._structure.get(uri.toString())) {
            // `uri` is a workspace folder so we check for its parent
            uri = dirname(uri);
        }
        return this._structure.findSubstr(uri.toString());
    };
    ExtHostWorkspaceImpl.prototype.resolveWorkspaceFolder = function (uri) {
        return this._structure.get(uri.toString());
    };
    return ExtHostWorkspaceImpl;
}(Workspace));
var ExtHostWorkspace = /** @class */ (function () {
    function ExtHostWorkspace(mainContext, data, _logService, _requestIdProvider) {
        this._logService = _logService;
        this._requestIdProvider = _requestIdProvider;
        this._onDidChangeWorkspace = new Emitter();
        this.onDidChangeWorkspace = this._onDidChangeWorkspace.event;
        this._activeSearchCallbacks = [];
        this._proxy = mainContext.getProxy(MainContext.MainThreadWorkspace);
        this._messageService = mainContext.getProxy(MainContext.MainThreadMessageService);
        this._confirmedWorkspace = ExtHostWorkspaceImpl.toExtHostWorkspace(data).workspace;
    }
    Object.defineProperty(ExtHostWorkspace.prototype, "workspace", {
        // --- workspace ---
        get: function () {
            return this._actualWorkspace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWorkspace.prototype, "name", {
        get: function () {
            return this._actualWorkspace ? this._actualWorkspace.name : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostWorkspace.prototype, "_actualWorkspace", {
        get: function () {
            return this._unconfirmedWorkspace || this._confirmedWorkspace;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostWorkspace.prototype.getWorkspaceFolders = function () {
        if (!this._actualWorkspace) {
            return undefined;
        }
        return this._actualWorkspace.workspaceFolders.slice(0);
    };
    ExtHostWorkspace.prototype.updateWorkspaceFolders = function (extension, index, deleteCount) {
        var _this = this;
        var workspaceFoldersToAdd = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            workspaceFoldersToAdd[_i - 3] = arguments[_i];
        }
        var validatedDistinctWorkspaceFoldersToAdd = [];
        if (Array.isArray(workspaceFoldersToAdd)) {
            workspaceFoldersToAdd.forEach(function (folderToAdd) {
                if (URI.isUri(folderToAdd.uri) && !validatedDistinctWorkspaceFoldersToAdd.some(function (f) { return isFolderEqual(f.uri, folderToAdd.uri); })) {
                    validatedDistinctWorkspaceFoldersToAdd.push({ uri: folderToAdd.uri, name: folderToAdd.name || basenameOrAuthority(folderToAdd.uri) });
                }
            });
        }
        if (!!this._unconfirmedWorkspace) {
            return false; // prevent accumulated calls without a confirmed workspace
        }
        if ([index, deleteCount].some(function (i) { return typeof i !== 'number' || i < 0; })) {
            return false; // validate numbers
        }
        if (deleteCount === 0 && validatedDistinctWorkspaceFoldersToAdd.length === 0) {
            return false; // nothing to delete or add
        }
        var currentWorkspaceFolders = this._actualWorkspace ? this._actualWorkspace.workspaceFolders : [];
        if (index + deleteCount > currentWorkspaceFolders.length) {
            return false; // cannot delete more than we have
        }
        // Simulate the updateWorkspaceFolders method on our data to do more validation
        var newWorkspaceFolders = currentWorkspaceFolders.slice(0);
        newWorkspaceFolders.splice.apply(newWorkspaceFolders, [index, deleteCount].concat(validatedDistinctWorkspaceFoldersToAdd.map(function (f) { return ({ uri: f.uri, name: f.name || basenameOrAuthority(f.uri), index: undefined }); })));
        var _loop_1 = function (i) {
            var folder = newWorkspaceFolders[i];
            if (newWorkspaceFolders.some(function (otherFolder, index) { return index !== i && isFolderEqual(folder.uri, otherFolder.uri); })) {
                return { value: false };
            }
        };
        for (var i = 0; i < newWorkspaceFolders.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        newWorkspaceFolders.forEach(function (f, index) { return f.index = index; }); // fix index
        var _a = delta(currentWorkspaceFolders, newWorkspaceFolders, compareWorkspaceFolderByUriAndNameAndIndex), added = _a.added, removed = _a.removed;
        if (added.length === 0 && removed.length === 0) {
            return false; // nothing actually changed
        }
        // Trigger on main side
        if (this._proxy) {
            var extName_1 = extension.displayName || extension.name;
            this._proxy.$updateWorkspaceFolders(extName_1, index, deleteCount, validatedDistinctWorkspaceFoldersToAdd).then(null, function (error) {
                // in case of an error, make sure to clear out the unconfirmed workspace
                // because we cannot expect the acknowledgement from the main side for this
                _this._unconfirmedWorkspace = undefined;
                // show error to user
                _this._messageService.$showMessage(Severity.Error, localize('updateerror', "Extension '{0}' failed to update workspace folders: {1}", extName_1, error.toString()), { extension: extension }, []);
            });
        }
        // Try to accept directly
        this.trySetWorkspaceFolders(newWorkspaceFolders);
        return true;
    };
    ExtHostWorkspace.prototype.getWorkspaceFolder = function (uri, resolveParent) {
        if (!this._actualWorkspace) {
            return undefined;
        }
        return this._actualWorkspace.getWorkspaceFolder(uri, resolveParent);
    };
    ExtHostWorkspace.prototype.resolveWorkspaceFolder = function (uri) {
        if (!this._actualWorkspace) {
            return undefined;
        }
        return this._actualWorkspace.resolveWorkspaceFolder(uri);
    };
    ExtHostWorkspace.prototype.getPath = function () {
        // this is legacy from the days before having
        // multi-root and we keep it only alive if there
        // is just one workspace folder.
        if (!this._actualWorkspace) {
            return undefined;
        }
        var folders = this._actualWorkspace.folders;
        if (folders.length === 0) {
            return undefined;
        }
        // #54483 @Joh Why are we still using fsPath?
        return folders[0].uri.fsPath;
    };
    ExtHostWorkspace.prototype.getRelativePath = function (pathOrUri, includeWorkspace) {
        var path;
        if (typeof pathOrUri === 'string') {
            path = pathOrUri;
        }
        else if (typeof pathOrUri !== 'undefined') {
            path = pathOrUri.fsPath;
        }
        if (!path) {
            return path;
        }
        var folder = this.getWorkspaceFolder(typeof pathOrUri === 'string' ? URI.file(pathOrUri) : pathOrUri, true);
        if (!folder) {
            return path;
        }
        if (typeof includeWorkspace === 'undefined') {
            includeWorkspace = this._actualWorkspace.folders.length > 1;
        }
        var result = relative(folder.uri.fsPath, path);
        if (includeWorkspace) {
            result = folder.name + "/" + result;
        }
        return normalize(result, true);
    };
    ExtHostWorkspace.prototype.trySetWorkspaceFolders = function (folders) {
        // Update directly here. The workspace is unconfirmed as long as we did not get an
        // acknowledgement from the main side (via $acceptWorkspaceData)
        if (this._actualWorkspace) {
            this._unconfirmedWorkspace = ExtHostWorkspaceImpl.toExtHostWorkspace({
                id: this._actualWorkspace.id,
                name: this._actualWorkspace.name,
                configuration: this._actualWorkspace.configuration,
                folders: folders
            }, this._actualWorkspace).workspace;
        }
    };
    ExtHostWorkspace.prototype.$acceptWorkspaceData = function (data) {
        var _a = ExtHostWorkspaceImpl.toExtHostWorkspace(data, this._confirmedWorkspace, this._unconfirmedWorkspace), workspace = _a.workspace, added = _a.added, removed = _a.removed;
        // Update our workspace object. We have a confirmed workspace, so we drop our
        // unconfirmed workspace.
        this._confirmedWorkspace = workspace;
        this._unconfirmedWorkspace = undefined;
        // Events
        this._onDidChangeWorkspace.fire(Object.freeze({
            added: added,
            removed: removed,
        }));
    };
    // --- search ---
    ExtHostWorkspace.prototype.findFiles = function (include, exclude, maxResults, extensionId, token) {
        if (token === void 0) { token = CancellationToken.None; }
        this._logService.trace("extHostWorkspace#findFiles: fileSearch, extension: " + extensionId + ", entryPoint: findFiles");
        var includePattern;
        var includeFolder;
        if (include) {
            if (typeof include === 'string') {
                includePattern = include;
            }
            else {
                includePattern = include.pattern;
                // include.base must be an absolute path
                includeFolder = include.baseFolder || URI.file(include.base);
            }
        }
        var excludePatternOrDisregardExcludes;
        if (exclude === null) {
            excludePatternOrDisregardExcludes = false;
        }
        else if (exclude) {
            if (typeof exclude === 'string') {
                excludePatternOrDisregardExcludes = exclude;
            }
            else {
                excludePatternOrDisregardExcludes = exclude.pattern;
            }
        }
        if (token && token.isCancellationRequested) {
            return Promise.resolve([]);
        }
        return this._proxy.$startFileSearch(includePattern, includeFolder, excludePatternOrDisregardExcludes, maxResults, token)
            .then(function (data) { return Array.isArray(data) ? data.map(URI.revive) : []; });
    };
    ExtHostWorkspace.prototype.findTextInFiles = function (query, options, callback, extensionId, token) {
        var _this = this;
        if (token === void 0) { token = CancellationToken.None; }
        this._logService.trace("extHostWorkspace#findTextInFiles: textSearch, extension: " + extensionId + ", entryPoint: findTextInFiles");
        var requestId = this._requestIdProvider.getNext();
        var globPatternToString = function (pattern) {
            if (typeof pattern === 'string') {
                return pattern;
            }
            return join(pattern.base, pattern.pattern);
        };
        var previewOptions = typeof options.previewOptions === 'undefined' ?
            {
                matchLines: 100,
                charsPerLine: 10000
            } :
            options.previewOptions;
        var queryOptions = {
            ignoreSymlinks: typeof options.followSymlinks === 'boolean' ? !options.followSymlinks : undefined,
            disregardIgnoreFiles: typeof options.useIgnoreFiles === 'boolean' ? !options.useIgnoreFiles : undefined,
            disregardGlobalIgnoreFiles: typeof options.useGlobalIgnoreFiles === 'boolean' ? !options.useGlobalIgnoreFiles : undefined,
            disregardExcludeSettings: options.exclude === null,
            fileEncoding: options.encoding,
            maxResults: options.maxResults,
            previewOptions: previewOptions,
            afterContext: options.afterContext,
            beforeContext: options.beforeContext,
            includePattern: options.include && globPatternToString(options.include),
            excludePattern: options.exclude && globPatternToString(options.exclude)
        };
        var isCanceled = false;
        this._activeSearchCallbacks[requestId] = function (p) {
            if (isCanceled) {
                return;
            }
            var uri = URI.revive(p.resource);
            p.results.forEach(function (result) {
                if (resultIsMatch(result)) {
                    callback({
                        uri: uri,
                        preview: {
                            text: result.preview.text,
                            matches: mapArrayOrNot(result.preview.matches, function (m) { return new Range(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn); })
                        },
                        ranges: mapArrayOrNot(result.ranges, function (r) { return new Range(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn); })
                    });
                }
                else {
                    callback({
                        uri: uri,
                        text: result.text,
                        lineNumber: result.lineNumber
                    });
                }
            });
        };
        if (token.isCancellationRequested) {
            return Promise.resolve(undefined);
        }
        return this._proxy.$startTextSearch(query, queryOptions, requestId, token).then(function (result) {
            delete _this._activeSearchCallbacks[requestId];
            return result;
        }, function (err) {
            delete _this._activeSearchCallbacks[requestId];
            return Promise.reject(err);
        });
    };
    ExtHostWorkspace.prototype.$handleTextSearchResult = function (result, requestId) {
        if (this._activeSearchCallbacks[requestId]) {
            this._activeSearchCallbacks[requestId](result);
        }
    };
    ExtHostWorkspace.prototype.saveAll = function (includeUntitled) {
        return this._proxy.$saveAll(includeUntitled);
    };
    ExtHostWorkspace.prototype.resolveProxy = function (url) {
        return this._proxy.$resolveProxy(url);
    };
    return ExtHostWorkspace;
}());
export { ExtHostWorkspace };
