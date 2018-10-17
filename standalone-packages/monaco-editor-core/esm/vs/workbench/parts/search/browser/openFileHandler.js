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
import { TPromise } from '../../../../base/common/winjs.base';
import * as errors from '../../../../base/common/errors';
import * as nls from '../../../../nls';
import * as paths from '../../../../base/common/paths';
import * as objects from '../../../../base/common/objects';
import { defaultGenerator } from '../../../../base/common/idGenerator';
import { URI } from '../../../../base/common/uri';
import * as resources from '../../../../base/common/resources';
import { IModeService } from '../../../../editor/common/services/modeService';
import { getIconClasses } from '../../../browser/labels';
import { IModelService } from '../../../../editor/common/services/modelService';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService';
import { QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel';
import { QuickOpenHandler, EditorQuickOpenEntry } from '../../../browser/quickopen';
import { QueryBuilder } from '../common/queryBuilder';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { ISearchService } from '../../../../platform/search/common/search';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
import { getOutOfWorkspaceEditorResources } from '../common/search';
import { IEditorService } from '../../../services/editor/common/editorService';
import { prepareQuery } from '../../../../base/parts/quickopen/common/quickOpenScorer';
import { IFileService } from '../../../../platform/files/common/files';
import { ILabelService } from '../../../../platform/label/common/label';
import { untildify } from '../../../../base/common/labels';
var FileQuickOpenModel = /** @class */ (function (_super) {
    __extends(FileQuickOpenModel, _super);
    function FileQuickOpenModel(entries, stats) {
        return _super.call(this, entries) || this;
    }
    return FileQuickOpenModel;
}(QuickOpenModel));
export { FileQuickOpenModel };
var FileEntry = /** @class */ (function (_super) {
    __extends(FileEntry, _super);
    function FileEntry(resource, name, description, icon, editorService, modeService, modelService, configurationService, contextService) {
        var _this = _super.call(this, editorService) || this;
        _this.resource = resource;
        _this.name = name;
        _this.description = description;
        _this.icon = icon;
        _this.modeService = modeService;
        _this.modelService = modelService;
        _this.configurationService = configurationService;
        return _this;
    }
    FileEntry.prototype.getLabel = function () {
        return this.name;
    };
    FileEntry.prototype.getLabelOptions = function () {
        return {
            extraClasses: getIconClasses(this.modelService, this.modeService, this.resource)
        };
    };
    FileEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, file picker", this.getLabel());
    };
    FileEntry.prototype.getDescription = function () {
        return this.description;
    };
    FileEntry.prototype.getIcon = function () {
        return this.icon;
    };
    FileEntry.prototype.getResource = function () {
        return this.resource;
    };
    FileEntry.prototype.setRange = function (range) {
        this.range = range;
    };
    FileEntry.prototype.mergeWithEditorHistory = function () {
        return true;
    };
    FileEntry.prototype.getInput = function () {
        var input = {
            resource: this.resource,
            options: {
                pinned: !this.configurationService.getValue().workbench.editor.enablePreviewFromQuickOpen
            }
        };
        if (this.range) {
            input.options.selection = this.range;
        }
        return input;
    };
    FileEntry = __decorate([
        __param(4, IEditorService),
        __param(5, IModeService),
        __param(6, IModelService),
        __param(7, IConfigurationService),
        __param(8, IWorkspaceContextService)
    ], FileEntry);
    return FileEntry;
}(EditorQuickOpenEntry));
export { FileEntry };
var OpenFileHandler = /** @class */ (function (_super) {
    __extends(OpenFileHandler, _super);
    function OpenFileHandler(editorService, instantiationService, themeService, contextService, searchService, environmentService, fileService, labelService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.instantiationService = instantiationService;
        _this.themeService = themeService;
        _this.contextService = contextService;
        _this.searchService = searchService;
        _this.environmentService = environmentService;
        _this.fileService = fileService;
        _this.labelService = labelService;
        _this.queryBuilder = _this.instantiationService.createInstance(QueryBuilder);
        return _this;
    }
    OpenFileHandler.prototype.setOptions = function (options) {
        this.options = options;
    };
    OpenFileHandler.prototype.getResults = function (searchValue, token, maxSortedResults) {
        var query = prepareQuery(searchValue);
        // Respond directly to empty search
        if (!query.value) {
            return TPromise.as(new FileQuickOpenModel([]));
        }
        // Untildify file pattern
        query.value = untildify(query.value, this.environmentService.userHome);
        // Do find results
        return this.doFindResults(query, token, this.cacheState.cacheKey, maxSortedResults);
    };
    OpenFileHandler.prototype.doFindResults = function (query, token, cacheKey, maxSortedResults) {
        var _this = this;
        var queryOptions = this.doResolveQueryOptions(query, cacheKey, maxSortedResults);
        var iconClass;
        if (this.options && this.options.forceUseIcons && !this.themeService.getFileIconTheme()) {
            iconClass = 'file'; // only use a generic file icon if we are forced to use an icon and have no icon theme set otherwise
        }
        return this.getAbsolutePathResult(query).then(function (result) {
            if (token.isCancellationRequested) {
                return TPromise.wrap({ results: [] });
            }
            // If the original search value is an existing file on disk, return it immediately and bypass the search service
            if (result) {
                return TPromise.wrap({ results: [{ resource: result }] });
            }
            return _this.searchService.search(_this.queryBuilder.file(_this.contextService.getWorkspace().folders.map(function (folder) { return folder.uri; }), queryOptions), token);
        }).then(function (complete) {
            var results = [];
            if (!token.isCancellationRequested) {
                for (var i = 0; i < complete.results.length; i++) {
                    var fileMatch = complete.results[i];
                    var label = paths.basename(fileMatch.resource.fsPath);
                    var description = _this.labelService.getUriLabel(resources.dirname(fileMatch.resource), { relative: true });
                    results.push(_this.instantiationService.createInstance(FileEntry, fileMatch.resource, label, description, iconClass));
                }
            }
            return new FileQuickOpenModel(results, complete.stats);
        });
    };
    OpenFileHandler.prototype.getAbsolutePathResult = function (query) {
        if (paths.isAbsolute(query.original)) {
            var resource_1 = URI.file(query.original);
            return this.fileService.resolveFile(resource_1).then(function (stat) { return stat.isDirectory ? void 0 : resource_1; }, function (error) { return void 0; });
        }
        return TPromise.as(null);
    };
    OpenFileHandler.prototype.doResolveQueryOptions = function (query, cacheKey, maxSortedResults) {
        var queryOptions = {
            extraFileResources: getOutOfWorkspaceEditorResources(this.editorService, this.contextService),
            filePattern: query.value,
            cacheKey: cacheKey
        };
        if (typeof maxSortedResults === 'number') {
            queryOptions.maxResults = maxSortedResults;
            queryOptions.sortByScore = true;
        }
        return queryOptions;
    };
    OpenFileHandler.prototype.hasShortResponseTime = function () {
        return this.isCacheLoaded;
    };
    OpenFileHandler.prototype.onOpen = function () {
        var _this = this;
        this.cacheState = new CacheState(function (cacheKey) { return _this.cacheQuery(cacheKey); }, function (query) { return _this.searchService.search(query); }, function (cacheKey) { return _this.searchService.clearCache(cacheKey); }, this.cacheState);
        this.cacheState.load();
    };
    OpenFileHandler.prototype.cacheQuery = function (cacheKey) {
        var options = {
            extraFileResources: getOutOfWorkspaceEditorResources(this.editorService, this.contextService),
            filePattern: '',
            cacheKey: cacheKey,
            maxResults: 0,
            sortByScore: true,
        };
        var folderResources = this.contextService.getWorkspace().folders.map(function (folder) { return folder.uri; });
        var query = this.queryBuilder.file(folderResources, options);
        return query;
    };
    Object.defineProperty(OpenFileHandler.prototype, "isCacheLoaded", {
        get: function () {
            return this.cacheState && this.cacheState.isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    OpenFileHandler.prototype.getGroupLabel = function () {
        return nls.localize('searchResults', "search results");
    };
    OpenFileHandler.prototype.getAutoFocus = function (searchValue) {
        return {
            autoFocusFirstEntry: true
        };
    };
    OpenFileHandler = __decorate([
        __param(0, IEditorService),
        __param(1, IInstantiationService),
        __param(2, IWorkbenchThemeService),
        __param(3, IWorkspaceContextService),
        __param(4, ISearchService),
        __param(5, IEnvironmentService),
        __param(6, IFileService),
        __param(7, ILabelService)
    ], OpenFileHandler);
    return OpenFileHandler;
}(QuickOpenHandler));
export { OpenFileHandler };
var LoadingPhase;
(function (LoadingPhase) {
    LoadingPhase[LoadingPhase["Created"] = 1] = "Created";
    LoadingPhase[LoadingPhase["Loading"] = 2] = "Loading";
    LoadingPhase[LoadingPhase["Loaded"] = 3] = "Loaded";
    LoadingPhase[LoadingPhase["Errored"] = 4] = "Errored";
    LoadingPhase[LoadingPhase["Disposed"] = 5] = "Disposed";
})(LoadingPhase || (LoadingPhase = {}));
/**
 * Exported for testing.
 */
var CacheState = /** @class */ (function () {
    function CacheState(cacheQuery, doLoad, doDispose, previous) {
        this.doLoad = doLoad;
        this.doDispose = doDispose;
        this.previous = previous;
        this._cacheKey = defaultGenerator.nextId();
        this.loadingPhase = LoadingPhase.Created;
        this.query = cacheQuery(this._cacheKey);
        if (this.previous) {
            var current = objects.assign({}, this.query, { cacheKey: null });
            var previous_1 = objects.assign({}, this.previous.query, { cacheKey: null });
            if (!objects.equals(current, previous_1)) {
                this.previous.dispose();
                this.previous = null;
            }
        }
    }
    Object.defineProperty(CacheState.prototype, "cacheKey", {
        get: function () {
            return this.loadingPhase === LoadingPhase.Loaded || !this.previous ? this._cacheKey : this.previous.cacheKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CacheState.prototype, "isLoaded", {
        get: function () {
            var isLoaded = this.loadingPhase === LoadingPhase.Loaded;
            return isLoaded || !this.previous ? isLoaded : this.previous.isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CacheState.prototype, "isUpdating", {
        get: function () {
            var isUpdating = this.loadingPhase === LoadingPhase.Loading;
            return isUpdating || !this.previous ? isUpdating : this.previous.isUpdating;
        },
        enumerable: true,
        configurable: true
    });
    CacheState.prototype.load = function () {
        var _this = this;
        if (this.isUpdating) {
            return;
        }
        this.loadingPhase = LoadingPhase.Loading;
        this.promise = this.doLoad(this.query)
            .then(function () {
            _this.loadingPhase = LoadingPhase.Loaded;
            if (_this.previous) {
                _this.previous.dispose();
                _this.previous = null;
            }
        }, function (err) {
            _this.loadingPhase = LoadingPhase.Errored;
            errors.onUnexpectedError(err);
        });
    };
    CacheState.prototype.dispose = function () {
        var _this = this;
        if (this.promise) {
            this.promise.then(null, function () { })
                .then(function () {
                _this.loadingPhase = LoadingPhase.Disposed;
                return _this.doDispose(_this._cacheKey);
            }).then(null, function (err) {
                errors.onUnexpectedError(err);
            });
        }
        else {
            this.loadingPhase = LoadingPhase.Disposed;
        }
        if (this.previous) {
            this.previous.dispose();
            this.previous = null;
        }
    };
    return CacheState;
}());
export { CacheState };
