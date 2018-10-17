/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../../base/common/uri.js';
import * as paths from '../../../../base/common/paths.js';
import * as resources from '../../../../base/common/resources.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { isLinux } from '../../../../base/common/platform.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { toResource } from '../../../common/editor.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { rtrim, startsWithIgnoreCase, startsWith, equalsIgnoreCase } from '../../../../base/common/strings.js';
var Model = /** @class */ (function () {
    function Model(contextService) {
        var _this = this;
        this.contextService = contextService;
        var setRoots = function () { return _this._roots = _this.contextService.getWorkspace().folders
            .map(function (folder) { return new ExplorerItem(folder.uri, undefined, false, false, true, folder.name); }); };
        this._listener = this.contextService.onDidChangeWorkspaceFolders(function () { return setRoots(); });
        setRoots();
    }
    Object.defineProperty(Model.prototype, "roots", {
        get: function () {
            return this._roots;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an array of child stat from this stat that matches with the provided path.
     * Starts matching from the first root.
     * Will return empty array in case the FileStat does not exist.
     */
    Model.prototype.findAll = function (resource) {
        return this.roots.map(function (root) { return root.find(resource); }).filter(function (stat) { return !!stat; });
    };
    /**
     * Returns a FileStat that matches the passed resource.
     * In case multiple FileStat are matching the resource (same folder opened multiple times) returns the FileStat that has the closest root.
     * Will return null in case the FileStat does not exist.
     */
    Model.prototype.findClosest = function (resource) {
        var folder = this.contextService.getWorkspaceFolder(resource);
        if (folder) {
            var root = this.roots.filter(function (r) { return r.resource.toString() === folder.uri.toString(); }).pop();
            if (root) {
                return root.find(resource);
            }
        }
        return null;
    };
    Model.prototype.dispose = function () {
        this._listener = dispose(this._listener);
    };
    Model = __decorate([
        __param(0, IWorkspaceContextService)
    ], Model);
    return Model;
}());
export { Model };
var ExplorerItem = /** @class */ (function () {
    function ExplorerItem(resource, root, isSymbolicLink, isReadonly, isDirectory, name, mtime, etag, isError) {
        if (name === void 0) { name = resources.basenameOrAuthority(resource); }
        this.root = root;
        this.resource = resource;
        this._name = name;
        this.isDirectory = !!isDirectory;
        this._isSymbolicLink = !!isSymbolicLink;
        this._isReadonly = !!isReadonly;
        this.etag = etag;
        this.mtime = mtime;
        this._isError = !!isError;
        if (!this.root) {
            this.root = this;
        }
        this.isDirectoryResolved = false;
    }
    Object.defineProperty(ExplorerItem.prototype, "isSymbolicLink", {
        get: function () {
            return this._isSymbolicLink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerItem.prototype, "isDirectory", {
        get: function () {
            return this._isDirectory;
        },
        set: function (value) {
            if (value !== this._isDirectory) {
                this._isDirectory = value;
                if (this._isDirectory) {
                    this.children = new Map();
                }
                else {
                    this.children = undefined;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerItem.prototype, "isReadonly", {
        get: function () {
            return this._isReadonly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerItem.prototype, "isError", {
        get: function () {
            return this._isError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerItem.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    ExplorerItem.prototype.updateName = function (value) {
        // Re-add to parent since the parent has a name map to children and the name might have changed
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this._name = value;
        if (this.parent) {
            this.parent.addChild(this);
        }
    };
    ExplorerItem.prototype.getId = function () {
        return this.resource.toString();
    };
    Object.defineProperty(ExplorerItem.prototype, "isRoot", {
        get: function () {
            return this === this.root;
        },
        enumerable: true,
        configurable: true
    });
    ExplorerItem.create = function (raw, root, resolveTo, isError) {
        if (isError === void 0) { isError = false; }
        var stat = new ExplorerItem(raw.resource, root, raw.isSymbolicLink, raw.isReadonly, raw.isDirectory, raw.name, raw.mtime, raw.etag, isError);
        // Recursively add children if present
        if (stat.isDirectory) {
            // isDirectoryResolved is a very important indicator in the stat model that tells if the folder was fully resolved
            // the folder is fully resolved if either it has a list of children or the client requested this by using the resolveTo
            // array of resource path to resolve.
            stat.isDirectoryResolved = !!raw.children || (!!resolveTo && resolveTo.some(function (r) {
                return resources.isEqualOrParent(r, stat.resource);
            }));
            // Recurse into children
            if (raw.children) {
                for (var i = 0, len = raw.children.length; i < len; i++) {
                    var child = ExplorerItem.create(raw.children[i], root, resolveTo);
                    child.parent = stat;
                    stat.addChild(child);
                }
            }
        }
        return stat;
    };
    /**
     * Merges the stat which was resolved from the disk with the local stat by copying over properties
     * and children. The merge will only consider resolved stat elements to avoid overwriting data which
     * exists locally.
     */
    ExplorerItem.mergeLocalWithDisk = function (disk, local) {
        if (disk.resource.toString() !== local.resource.toString()) {
            return; // Merging only supported for stats with the same resource
        }
        // Stop merging when a folder is not resolved to avoid loosing local data
        var mergingDirectories = disk.isDirectory || local.isDirectory;
        if (mergingDirectories && local.isDirectoryResolved && !disk.isDirectoryResolved) {
            return;
        }
        // Properties
        local.resource = disk.resource;
        local.updateName(disk.name);
        local.isDirectory = disk.isDirectory;
        local.mtime = disk.mtime;
        local.isDirectoryResolved = disk.isDirectoryResolved;
        local._isSymbolicLink = disk.isSymbolicLink;
        local._isReadonly = disk.isReadonly;
        local._isError = disk.isError;
        // Merge Children if resolved
        if (mergingDirectories && disk.isDirectoryResolved) {
            // Map resource => stat
            var oldLocalChildren_1 = new ResourceMap();
            if (local.children) {
                local.children.forEach(function (child) {
                    oldLocalChildren_1.set(child.resource, child);
                });
            }
            // Clear current children
            local.children = new Map();
            // Merge received children
            disk.children.forEach(function (diskChild) {
                var formerLocalChild = oldLocalChildren_1.get(diskChild.resource);
                // Existing child: merge
                if (formerLocalChild) {
                    ExplorerItem.mergeLocalWithDisk(diskChild, formerLocalChild);
                    formerLocalChild.parent = local;
                    local.addChild(formerLocalChild);
                }
                // New child: add
                else {
                    diskChild.parent = local;
                    local.addChild(diskChild);
                }
            });
        }
    };
    /**
     * Adds a child element to this folder.
     */
    ExplorerItem.prototype.addChild = function (child) {
        if (!this.children) {
            this.isDirectory = true;
        }
        // Inherit some parent properties to child
        child.parent = this;
        child.updateResource(false);
        this.children.set(this.getPlatformAwareName(child.name), child);
    };
    ExplorerItem.prototype.getChild = function (name) {
        if (!this.children) {
            return undefined;
        }
        return this.children.get(this.getPlatformAwareName(name));
    };
    /**
     * Only use this method if you need all the children since it converts a map to an array
     */
    ExplorerItem.prototype.getChildrenArray = function () {
        if (!this.children) {
            return undefined;
        }
        var items = [];
        this.children.forEach(function (child) {
            items.push(child);
        });
        return items;
    };
    ExplorerItem.prototype.getChildrenCount = function () {
        if (!this.children) {
            return 0;
        }
        return this.children.size;
    };
    /**
     * Removes a child element from this folder.
     */
    ExplorerItem.prototype.removeChild = function (child) {
        this.children.delete(this.getPlatformAwareName(child.name));
    };
    ExplorerItem.prototype.getPlatformAwareName = function (name) {
        return (isLinux || !name) ? name : name.toLowerCase();
    };
    /**
     * Moves this element under a new parent element.
     */
    ExplorerItem.prototype.move = function (newParent, fnBetweenStates, fnDone) {
        var _this = this;
        if (!fnBetweenStates) {
            fnBetweenStates = function (cb) { cb(); };
        }
        this.parent.removeChild(this);
        fnBetweenStates(function () {
            newParent.removeChild(_this); // make sure to remove any previous version of the file if any
            newParent.addChild(_this);
            _this.updateResource(true);
            if (fnDone) {
                fnDone();
            }
        });
    };
    ExplorerItem.prototype.updateResource = function (recursive) {
        this.resource = resources.joinPath(this.parent.resource, this.name);
        if (recursive) {
            if (this.isDirectory && this.children) {
                this.children.forEach(function (child) {
                    child.updateResource(true);
                });
            }
        }
    };
    /**
     * Tells this stat that it was renamed. This requires changes to all children of this stat (if any)
     * so that the path property can be updated properly.
     */
    ExplorerItem.prototype.rename = function (renamedStat) {
        // Merge a subset of Properties that can change on rename
        this.updateName(renamedStat.name);
        this.mtime = renamedStat.mtime;
        // Update Paths including children
        this.updateResource(true);
    };
    /**
     * Returns a child stat from this stat that matches with the provided path.
     * Will return "null" in case the child does not exist.
     */
    ExplorerItem.prototype.find = function (resource) {
        // Return if path found
        // For performance reasons try to do the comparison as fast as possible
        if (resource && this.resource.scheme === resource.scheme && equalsIgnoreCase(this.resource.authority, resource.authority) &&
            (resources.hasToIgnoreCase(resource) ? startsWithIgnoreCase(resource.path, this.resource.path) : startsWith(resource.path, this.resource.path))) {
            return this.findByPath(rtrim(resource.path, paths.sep), this.resource.path.length);
        }
        return null; //Unable to find
    };
    ExplorerItem.prototype.findByPath = function (path, index) {
        if (paths.isEqual(rtrim(this.resource.path, paths.sep), path, !isLinux)) {
            return this;
        }
        if (this.children) {
            // Ignore separtor to more easily deduct the next name to search
            while (index < path.length && path[index] === paths.sep) {
                index++;
            }
            var indexOfNextSep = path.indexOf(paths.sep, index);
            if (indexOfNextSep === -1) {
                // If there is no separator take the remainder of the path
                indexOfNextSep = path.length;
            }
            // The name to search is between two separators
            var name_1 = path.substring(index, indexOfNextSep);
            var child = this.children.get(this.getPlatformAwareName(name_1));
            if (child) {
                // We found a child with the given name, search inside it
                return child.findByPath(path, indexOfNextSep);
            }
        }
        return null;
    };
    return ExplorerItem;
}());
export { ExplorerItem };
/* A helper that can be used to show a placeholder when creating a new stat */
var NewStatPlaceholder = /** @class */ (function (_super) {
    __extends(NewStatPlaceholder, _super);
    function NewStatPlaceholder(isDirectory, root) {
        var _this = _super.call(this, URI.file(''), root, false, false, false, NewStatPlaceholder.NAME) || this;
        _this.id = NewStatPlaceholder.ID++;
        _this.isDirectoryResolved = isDirectory;
        _this.directoryPlaceholder = isDirectory;
        return _this;
    }
    NewStatPlaceholder.prototype.destroy = function () {
        this.parent.removeChild(this);
        this.isDirectoryResolved = void 0;
        this.isDirectory = void 0;
        this.mtime = void 0;
    };
    NewStatPlaceholder.prototype.getId = function () {
        return "new-stat-placeholder:" + this.id + ":" + this.parent.resource.toString();
    };
    NewStatPlaceholder.prototype.isDirectoryPlaceholder = function () {
        return this.directoryPlaceholder;
    };
    NewStatPlaceholder.prototype.addChild = function (child) {
        throw new Error('Can\'t perform operations in NewStatPlaceholder.');
    };
    NewStatPlaceholder.prototype.removeChild = function (child) {
        throw new Error('Can\'t perform operations in NewStatPlaceholder.');
    };
    NewStatPlaceholder.prototype.move = function (newParent) {
        throw new Error('Can\'t perform operations in NewStatPlaceholder.');
    };
    NewStatPlaceholder.prototype.rename = function (renamedStat) {
        throw new Error('Can\'t perform operations in NewStatPlaceholder.');
    };
    NewStatPlaceholder.prototype.find = function (resource) {
        return null;
    };
    NewStatPlaceholder.addNewStatPlaceholder = function (parent, isDirectory) {
        var child = new NewStatPlaceholder(isDirectory, parent.root);
        // Inherit some parent properties to child
        child.parent = parent;
        parent.addChild(child);
        return child;
    };
    NewStatPlaceholder.NAME = '';
    NewStatPlaceholder.ID = 0;
    return NewStatPlaceholder;
}(ExplorerItem));
export { NewStatPlaceholder };
var OpenEditor = /** @class */ (function () {
    function OpenEditor(_editor, _group) {
        this._editor = _editor;
        this._group = _group;
        // noop
    }
    Object.defineProperty(OpenEditor.prototype, "editor", {
        get: function () {
            return this._editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenEditor.prototype, "editorIndex", {
        get: function () {
            return this._group.getIndexOfEditor(this.editor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenEditor.prototype, "group", {
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenEditor.prototype, "groupId", {
        get: function () {
            return this._group.id;
        },
        enumerable: true,
        configurable: true
    });
    OpenEditor.prototype.getId = function () {
        return "openeditor:" + this.groupId + ":" + this.editorIndex + ":" + this.editor.getName() + ":" + this.editor.getDescription();
    };
    OpenEditor.prototype.isPreview = function () {
        return this._group.previewEditor === this.editor;
    };
    OpenEditor.prototype.isUntitled = function () {
        return !!toResource(this.editor, { supportSideBySide: true, filter: Schemas.untitled });
    };
    OpenEditor.prototype.isDirty = function () {
        return this.editor.isDirty();
    };
    OpenEditor.prototype.getResource = function () {
        return toResource(this.editor, { supportSideBySide: true });
    };
    return OpenEditor;
}());
export { OpenEditor };
