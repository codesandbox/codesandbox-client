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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import * as fs from '../../fs';
import * as extfs from '../base/node/extfs';
import { URI } from '../base/common/uri';
import { FileOperationError, } from '../platform/files/common/files';
import { TPromise } from '../base/common/winjs.base';
import { Disposable } from '../base/common/lifecycle';
import { Emitter } from '../base/common/event';
import { ICodeSandboxService } from './services/codesandbox/common/codesandbox';
import { basename } from '../../path';
import { Schemas } from '../base/common/network';
import { join } from '../base/common/paths';
import { normalize, toFileChangesEvent, } from '../workbench/services/files/node/watcher/common';
import { ResourceMap } from '../base/common/map';
import { ThrottledDelayer } from '../base/common/async';
import { ILifecycleService, } from '../platform/lifecycle/common/lifecycle';
var generateRandomCallbackID = function () {
    return 'cb-' + Math.floor(Math.random() * 10000);
};
var createStreamFromString = function (value) { return ({
    on: function (e, cb) {
        if (e === 'data') {
            cb(value);
        }
        if (e === 'end') {
            cb();
        }
    },
}); };
var createFileFromModule = function (p, m) {
    return m
        ? {
            isDirectory: false,
            resource: URI.file(p),
            etag: undefined,
            mtime: new Date(m.updatedAt).getTime(),
            name: basename(p),
        }
        : {
            isDirectory: true,
            resource: URI.file(p),
            etag: undefined,
            mtime: new Date().getTime(),
            name: p,
        };
};
function doFsStat(resource) {
    var _this = this;
    return new TPromise(function (resolve, reject) {
        fs.stat(resource.fsPath, function (err, stat) { return __awaiter(_this, void 0, void 0, function () {
            var children, childrenFolders, resolvedChildren;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            return [2 /*return*/, reject(err)];
                        }
                        children = [];
                        if (stat.isDirectory()) {
                            childrenFolders = fs.readdirSync(resource.fsPath);
                            childrenFolders.forEach(function (p) {
                                var joinedFolder = join(resource.fsPath, p);
                                children.push(URI.file(joinedFolder));
                            });
                        }
                        return [4 /*yield*/, Promise.all(children.map(doFsStat))];
                    case 1:
                        resolvedChildren = _a.sent();
                        return [2 /*return*/, resolve({
                                isDirectory: stat.isDirectory(),
                                mtime: stat.mtime.getTime(),
                                size: stat.size,
                                resource: resource,
                                name: basename(resource.fsPath),
                                etag: undefined,
                                children: resolvedChildren,
                            })];
                }
            });
        }); });
    });
}
var CodeSandboxFileService = /** @class */ (function (_super) {
    __extends(CodeSandboxFileService, _super);
    function CodeSandboxFileService(codesandboxService, lifecycleService) {
        var _this = _super.call(this) || this;
        _this.codesandboxService = codesandboxService;
        _this.lifecycleService = lifecycleService;
        _this._onFileChanges = _this._register(new Emitter());
        _this._onAfterOperation = _this._register(new Emitter());
        _this._onDidChangeFileSystemProviderRegistrations = _this._register(new Emitter());
        _this.activeFileChangesWatchers = new ResourceMap();
        _this.fileChangesWatchDelayer = new ThrottledDelayer(CodeSandboxFileService.FS_EVENT_DELAY);
        _this.undeliveredRawFileChangesEvents = [];
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(CodeSandboxFileService.prototype, "onFileChanges", {
        get: function () {
            return this._onFileChanges.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxFileService.prototype, "onAfterOperation", {
        get: function () {
            return this._onAfterOperation.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxFileService.prototype, "onDidChangeFileSystemProviderRegistrations", {
        get: function () {
            return this._onDidChangeFileSystemProviderRegistrations.event;
        },
        enumerable: true,
        configurable: true
    });
    CodeSandboxFileService.prototype.registerListeners = function () {
        // Wait until we are fully running before starting file watchers
        this.lifecycleService.when(3 /* Running */).then(function () {
            // this.setupFileWatching();
        });
        // Lifecycle
        this.lifecycleService.onShutdown(this.dispose, this);
    };
    CodeSandboxFileService.prototype.registerProvider = function (scheme, provider) {
        throw new Error('Method not implemented.');
    };
    CodeSandboxFileService.prototype.canHandleResource = function (resource) {
        return resource.scheme === Schemas.file;
    };
    CodeSandboxFileService.prototype.resolveFile = function (resource, options) {
        return doFsStat(resource);
    };
    CodeSandboxFileService.prototype.resolveFiles = function (toResolve) {
        throw new Error('resolveFiles not implemented.');
    };
    CodeSandboxFileService.prototype.existsFile = function (resource) {
        return new TPromise(function (r) {
            fs.stat(resource.fsPath, function (err, stats) {
                if (err) {
                    r(false);
                    return;
                }
                r(true);
            });
        });
    };
    CodeSandboxFileService.prototype.resolveContent = function (resource, options) {
        return new TPromise(function (resolve, reject) {
            fs.stat(resource.fsPath, function (err, stat) {
                if (err) {
                    // Wrap file not found errors
                    if (err.code === 'ENOENT') {
                        return reject(new FileOperationError("File not found (" + resource.toString(true) + ")", 2 /* FILE_NOT_FOUND */, options));
                    }
                    return reject(err);
                }
                fs.readFile(resource.fsPath, function (err, data) {
                    resolve({
                        encoding: 'utf8',
                        value: data.toString(),
                        name: basename(resource.fsPath),
                        resource: URI.file(resource.fsPath),
                        etag: undefined,
                        isReadonly: false,
                        mtime: stat.mtime.getTime(),
                    });
                });
            });
        });
    };
    CodeSandboxFileService.prototype.resolveStreamContent = function (resource, options) {
        return this.resolveContent(resource, options).then(function (syncValue) {
            var asyncValue = __assign({}, syncValue, { value: createStreamFromString(syncValue.value) });
            return asyncValue;
        });
    };
    CodeSandboxFileService.prototype.updateContent = function (resource, value, options) {
        var _this = this;
        if (resource.fsPath.indexOf('/vscode/') === 0) {
            // @ts-ignore
            var strValue_1 = value.read ? value.read() : value;
            return new TPromise(function (resolve, reject) {
                fs.writeFile(resource.fsPath, strValue_1, function (err) {
                    if (err) {
                        reject(err);
                    }
                    fs.stat(resource.fsPath, function (err, stats) {
                        resolve({
                            isDirectory: stats.isDirectory(),
                            resource: URI.file(resource.fsPath),
                            etag: undefined,
                            mtime: stats.mtime.getTime(),
                            name: basename(resource.fsPath),
                        });
                    });
                });
            });
        }
        var module = this.codesandboxService.getFilesByPath()[resource.fsPath];
        //@ts-ignore
        var code = value.read ? value.read() : value;
        var cbID = generateRandomCallbackID();
        fs.writeFileSync(resource.fsPath, code);
        return new TPromise(function (resolve, reject) {
            var _a;
            window.cbs = window.cbs || {};
            window.cbs[cbID] = function (err, data) {
                if (err) {
                    return reject(null);
                }
                var module = _this.codesandboxService.getFilesByPath()[resource.fsPath];
                resolve(createFileFromModule(resource.fsPath, module));
            };
            if (module) {
                _this.codesandboxService.runSignal('editor.codeSaved', {
                    cbID: cbID,
                    code: code,
                    moduleShortid: module.shortid,
                });
            }
            else {
                _this.codesandboxService.runSignal('files.createModulesByPath', {
                    cbID: cbID,
                    files: (_a = {},
                        _a[resource.fsPath.replace(/^\/sandbox/, '')] = {
                            isBinary: false,
                            content: code,
                        },
                        _a),
                });
            }
        });
    };
    CodeSandboxFileService.prototype.moveFile = function (source, target, overwrite) {
        throw new Error('moveFile not implemented.');
    };
    CodeSandboxFileService.prototype.copyFile = function (source, target, overwrite) {
        throw new Error('copyFile not implemented.');
    };
    CodeSandboxFileService.prototype.createFile = function (resource, content, options) {
        throw new Error('createFile not implemented.');
    };
    CodeSandboxFileService.prototype.createFolder = function (resource) {
        if (resource.fsPath.indexOf('/vscode') === 0) {
            try {
                fs.mkdirSync(resource.fsPath);
            }
            catch (e) {
                // ignore
            }
            return doFsStat(resource);
        }
        throw new Error('createFolder not implemented.');
    };
    CodeSandboxFileService.prototype.del = function (resource, options) {
        throw new Error('del not implemented.');
    };
    CodeSandboxFileService.prototype.watchFileChanges = function (resource) {
        var _this = this;
        if (!(resource && resource.scheme === Schemas.file)) {
            return;
        }
        // Check for existing watcher first
        var entry = this.activeFileChangesWatchers.get(resource);
        if (entry) {
            entry.count += 1;
            return;
        }
        // Create or get watcher for provided path
        var fsPath = resource.fsPath;
        var fsName = basename(resource.fsPath);
        var watcherDisposable = extfs.watch(fsPath, function (eventType, filename) {
            var renamedOrDeleted = (filename && filename !== fsName) || eventType === 'rename';
            // The file was either deleted or renamed. Many tools apply changes to files in an
            // atomic way ("Atomic Save") by first renaming the file to a temporary name and then
            // renaming it back to the original name. Our watcher will detect this as a rename
            // and then stops to work on Mac and Linux because the watcher is applied to the
            // inode and not the name. The fix is to detect this case and trying to watch the file
            // again after a certain delay.
            // In addition, we send out a delete event if after a timeout we detect that the file
            // does indeed not exist anymore.
            if (renamedOrDeleted) {
                // Very important to dispose the watcher which now points to a stale inode
                watcherDisposable.dispose();
                _this.activeFileChangesWatchers.delete(resource);
                // Wait a bit and try to install watcher again, assuming that the file was renamed quickly ("Atomic Save")
                setTimeout(function () {
                    _this.existsFile(resource).then(function (exists) {
                        // File still exists, so reapply the watcher
                        if (exists) {
                            _this.watchFileChanges(resource);
                        }
                        else {
                            // File seems to be really gone, so emit a deleted event
                            _this.onRawFileChange({
                                type: 2 /* DELETED */,
                                path: fsPath,
                            });
                        }
                    });
                }, CodeSandboxFileService.FS_REWATCH_DELAY);
            }
            // Handle raw file change
            _this.onRawFileChange({
                type: 0 /* UPDATED */,
                path: fsPath,
            });
        }, function (error) { return new Error(error); });
        // Remember in map
        this.activeFileChangesWatchers.set(resource, {
            count: 1,
            unwatch: function () { return watcherDisposable.dispose(); },
        });
    };
    CodeSandboxFileService.prototype.onRawFileChange = function (event) {
        var _this = this;
        // add to bucket of undelivered events
        this.undeliveredRawFileChangesEvents.push(event);
        // handle emit through delayer to accommodate for bulk changes
        this.fileChangesWatchDelayer.trigger(function () {
            var buffer = _this.undeliveredRawFileChangesEvents;
            _this.undeliveredRawFileChangesEvents = [];
            // Normalize
            var normalizedEvents = normalize(buffer);
            // Emit
            _this._onFileChanges.fire(toFileChangesEvent(normalizedEvents));
            return TPromise.as(null);
        });
    };
    CodeSandboxFileService.prototype.unwatchFileChanges = function (resource) {
        var watcher = this.activeFileChangesWatchers.get(resource);
        if (watcher && --watcher.count === 0) {
            watcher.unwatch();
            this.activeFileChangesWatchers.delete(resource);
        }
    };
    CodeSandboxFileService.FS_EVENT_DELAY = 50; // aggregate and only emit events when changes have stopped for this duration (in ms)
    CodeSandboxFileService.FS_REWATCH_DELAY = 300; // delay to rewatch a file that was renamed or deleted (in ms)
    CodeSandboxFileService = __decorate([
        __param(0, ICodeSandboxService),
        __param(1, ILifecycleService)
    ], CodeSandboxFileService);
    return CodeSandboxFileService;
}(Disposable));
export { CodeSandboxFileService };
