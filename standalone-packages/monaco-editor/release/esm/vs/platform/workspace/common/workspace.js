/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import URI from '../../../base/common/uri.js';
import * as paths from '../../../base/common/paths.js';
import * as resources from '../../../base/common/resources.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { TernarySearchTree } from '../../../base/common/map.js';
import { isRawFileWorkspaceFolder, isRawUriWorkspaceFolder } from '../../workspaces/common/workspaces.js';
import { coalesce, distinct } from '../../../base/common/arrays.js';
import { isLinux } from '../../../base/common/platform.js';
export var IWorkspaceContextService = createDecorator('contextService');
export var WorkbenchState;
(function (WorkbenchState) {
    WorkbenchState[WorkbenchState["EMPTY"] = 1] = "EMPTY";
    WorkbenchState[WorkbenchState["FOLDER"] = 2] = "FOLDER";
    WorkbenchState[WorkbenchState["WORKSPACE"] = 3] = "WORKSPACE";
})(WorkbenchState || (WorkbenchState = {}));
var Workspace = /** @class */ (function () {
    function Workspace(_id, _name, folders, _configuration, _ctime) {
        if (_name === void 0) { _name = ''; }
        if (folders === void 0) { folders = []; }
        if (_configuration === void 0) { _configuration = null; }
        this._id = _id;
        this._name = _name;
        this._configuration = _configuration;
        this._ctime = _ctime;
        this._foldersMap = TernarySearchTree.forPaths();
        this.folders = folders;
    }
    Workspace.prototype.update = function (workspace) {
        this._id = workspace.id;
        this._name = workspace.name;
        this._configuration = workspace.configuration;
        this._ctime = workspace.ctime;
        this.folders = workspace.folders;
    };
    Object.defineProperty(Workspace.prototype, "folders", {
        get: function () {
            return this._folders;
        },
        set: function (folders) {
            this._folders = folders;
            this.updateFoldersMap();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "ctime", {
        get: function () {
            return this._ctime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "configuration", {
        get: function () {
            return this._configuration;
        },
        set: function (configuration) {
            this._configuration = configuration;
        },
        enumerable: true,
        configurable: true
    });
    Workspace.prototype.getFolder = function (resource) {
        if (!resource) {
            return null;
        }
        return this._foldersMap.findSubstr(resource.toString());
    };
    Workspace.prototype.updateFoldersMap = function () {
        this._foldersMap = TernarySearchTree.forPaths();
        for (var _i = 0, _a = this.folders; _i < _a.length; _i++) {
            var folder = _a[_i];
            this._foldersMap.set(folder.uri.toString(), folder);
        }
    };
    Workspace.prototype.toJSON = function () {
        return { id: this.id, folders: this.folders, name: this.name, configuration: this.configuration };
    };
    return Workspace;
}());
export { Workspace };
var WorkspaceFolder = /** @class */ (function () {
    function WorkspaceFolder(data, raw) {
        this.raw = raw;
        this.uri = data.uri;
        this.index = data.index;
        this.name = data.name;
    }
    WorkspaceFolder.prototype.toResource = function (relativePath) {
        return this.uri.with({ path: paths.join(this.uri.path, relativePath) });
    };
    WorkspaceFolder.prototype.toJSON = function () {
        return { uri: this.uri, name: this.name, index: this.index };
    };
    return WorkspaceFolder;
}());
export { WorkspaceFolder };
export function toWorkspaceFolders(configuredFolders, relativeTo) {
    var workspaceFolders = parseWorkspaceFolders(configuredFolders, relativeTo);
    return ensureUnique(coalesce(workspaceFolders))
        .map(function (_a, index) {
        var uri = _a.uri, raw = _a.raw, name = _a.name;
        return new WorkspaceFolder({ uri: uri, name: name || resources.basenameOrAuthority(uri), index: index }, raw);
    });
}
function parseWorkspaceFolders(configuredFolders, relativeTo) {
    return configuredFolders.map(function (configuredFolder, index) {
        var uri;
        if (isRawFileWorkspaceFolder(configuredFolder)) {
            uri = toUri(configuredFolder.path, relativeTo);
        }
        else if (isRawUriWorkspaceFolder(configuredFolder)) {
            try {
                uri = URI.parse(configuredFolder.uri);
                // this makes sure all workspace folder are absolute
                if (uri.path[0] !== '/') {
                    uri = uri.with({ path: '/' + uri.path });
                }
            }
            catch (e) {
                console.warn(e);
                // ignore
            }
        }
        if (!uri) {
            return void 0;
        }
        return new WorkspaceFolder({ uri: uri, name: configuredFolder.name, index: index }, configuredFolder);
    });
}
function toUri(path, relativeTo) {
    if (path) {
        if (paths.isAbsolute(path)) {
            return URI.file(path);
        }
        if (relativeTo) {
            return relativeTo.with({ path: paths.join(relativeTo.path, path) });
        }
    }
    return null;
}
function ensureUnique(folders) {
    return distinct(folders, function (folder) { return isLinux ? folder.uri.toString() : folder.uri.toString().toLowerCase(); });
}
