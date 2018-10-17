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
import { Disposable, toDisposable, } from '../base/common/lifecycle.js';
import { TPromise } from '../base/common/winjs.base.js';
import { Schemas } from '../base/common/network.js';
import * as objects from '../base/common/objects.js';
import * as strings from '../base/common/strings.js';
import { FileMatch, pathIncludedInQuery, } from '../platform/search/common/search.js';
import { IModelService } from '../editor/common/services/modelService.js';
import { IUntitledEditorService } from '../workbench/services/untitled/common/untitledEditorService.js';
import { IEnvironmentService } from '../platform/environment/common/environment.js';
import { IConfigurationService } from '../platform/configuration/common/configuration.js';
import { ResourceMap, values } from '../base/common/map.js';
import { ICodeSandboxService } from './services/codesandbox/common/codesandbox.js';
import { URI } from '../base/common/uri.js';
import { editorMatchToTextSearchResult } from '../workbench/parts/search/common/searchModel.js';
import { IEditorService } from '../workbench/services/editor/common/editorService.js';
/**
 * A service that enables to search for files or with in files.
 */
var CodeSandboxSearchService = /** @class */ (function (_super) {
    __extends(CodeSandboxSearchService, _super);
    function CodeSandboxSearchService(codesandboxService, modelService, editorService, untitledEditorService, environmentService, configurationService) {
        var _this = _super.call(this) || this;
        _this.codesandboxService = codesandboxService;
        _this.modelService = modelService;
        _this.editorService = editorService;
        _this.untitledEditorService = untitledEditorService;
        _this.configurationService = configurationService;
        _this.fileSearchProviders = new Map();
        _this.textSearchProviders = new Map();
        _this.fileIndexProviders = new Map();
        _this.diskSearch = new DiskSearch();
        return _this;
    }
    CodeSandboxSearchService.prototype.search = function (query) {
        var localResults = this.getLocalResults(query);
        var modulesByPath = this.codesandboxService.getFilesByPath();
        return new TPromise(function (r) {
            return r({
                results: Object.keys(modulesByPath).map(function (p) { return ({
                    resource: URI.file(p),
                }); }),
            });
        });
    };
    CodeSandboxSearchService.prototype.extendQuery = function (query) {
        var configuration = this.configurationService.getValue();
        // Configuration: Encoding
        if (!query.fileEncoding) {
            var fileEncoding = configuration && configuration.files && configuration.files.encoding;
            query.fileEncoding = fileEncoding;
        }
        // Configuration: File Excludes
        if (!query.disregardExcludeSettings) {
            var fileExcludes = objects.deepClone(configuration && configuration.files && configuration.files.exclude);
            if (fileExcludes) {
                if (!query.excludePattern) {
                    query.excludePattern = fileExcludes;
                }
                else {
                    objects.mixin(query.excludePattern, fileExcludes, false /* no overwrite */);
                }
            }
        }
    };
    CodeSandboxSearchService.prototype.clearCache = function (cacheKey) {
        var clearPs = [this.diskSearch].concat(values(this.fileIndexProviders)).map(function (provider) { return provider && provider.clearCache(cacheKey); });
        return TPromise.join(clearPs).then(function () { });
    };
    CodeSandboxSearchService.prototype.registerSearchResultProvider = function (scheme, type, provider) {
        var list;
        if (type === 0 /* file */) {
            list = this.fileSearchProviders;
        }
        else if (type === 2 /* text */) {
            list = this.textSearchProviders;
        }
        else if (type === 1 /* fileIndex */) {
            list = this.fileIndexProviders;
        }
        list.set(scheme, provider);
        return toDisposable(function () {
            list.delete(scheme);
        });
    };
    CodeSandboxSearchService.prototype.getLocalResults = function (query) {
        var _this = this;
        var localResults = new ResourceMap();
        if (query.type === 2 /* Text */) {
            var models = this.modelService.getModels();
            models.forEach(function (model) {
                var resource = model.uri;
                if (!resource) {
                    return;
                }
                if (!_this.editorService.isOpen({ resource: resource })) {
                    return;
                }
                // Support untitled files
                if (resource.scheme === Schemas.untitled) {
                    if (!_this.untitledEditorService.exists(resource)) {
                        return;
                    }
                }
                else if (resource.scheme !== Schemas.file) {
                    // Don't support other resource schemes than files for now
                    // todo@remote
                    // why is that? we should search for resources from other
                    // schemes
                    return;
                }
                if (!_this.matches(resource, query)) {
                    return; // respect user filters
                }
                // Use editor API to find matches
                var matches = model.findMatches(query.contentPattern.pattern, false, query.contentPattern.isRegExp, query.contentPattern.isCaseSensitive, query.contentPattern.isWordMatch
                    ? query.contentPattern.wordSeparators
                    : null, false, query.maxResults);
                if (matches.length) {
                    var fileMatch_1 = new FileMatch(resource);
                    localResults.set(resource, fileMatch_1);
                    matches.forEach(function (match) {
                        fileMatch_1.matches.push(editorMatchToTextSearchResult(match, model, query.previewOptions));
                    });
                }
                else {
                    localResults.set(resource, null);
                }
            });
        }
        return localResults;
    };
    CodeSandboxSearchService.prototype.matches = function (resource, query) {
        // file pattern
        if (query.filePattern) {
            if (resource.scheme !== Schemas.file) {
                return false; // if we match on file pattern, we have to ignore non file resources
            }
            if (!strings.fuzzyContains(resource.fsPath, strings.stripWildcards(query.filePattern).toLowerCase())) {
                return false;
            }
        }
        // includes
        if (query.includePattern) {
            if (resource.scheme !== Schemas.file) {
                return false; // if we match on file patterns, we have to ignore non file resources
            }
        }
        return pathIncludedInQuery(query, resource.fsPath);
    };
    CodeSandboxSearchService = __decorate([
        __param(0, ICodeSandboxService),
        __param(1, IModelService),
        __param(2, IEditorService),
        __param(3, IUntitledEditorService),
        __param(4, IEnvironmentService),
        __param(5, IConfigurationService)
    ], CodeSandboxSearchService);
    return CodeSandboxSearchService;
}(Disposable));
export { CodeSandboxSearchService };
var DiskSearch = /** @class */ (function () {
    function DiskSearch() {
    }
    DiskSearch.prototype.search = function (query, onProgress) {
        var folderQueries = query.folderQueries || [];
        return new TPromise(function (re) {
            re({
                results: [],
                limitHit: false,
            });
        });
        // return TPromise.join(folderQueries.map(q => q.folder.scheme === Schemas.file && fs.exists(q.folder.fsPath)))
        // 	.then(exists => {
        // 		const existingFolders = folderQueries.filter((q, index) => exists[index]);
        // 		const rawSearch = this.rawSearchQuery(query, existingFolders);
        // 		let event: Event<ISerializedSearchProgressItem | ISerializedSearchComplete>;
        // 		if (query.type === QueryType.File) {
        // 			event = this.raw.fileSearch(rawSearch);
        // 		} else {
        // 			event = this.raw.textSearch(rawSearch);
        // 		}
        // 		return DiskSearch.collectResultsFromEvent(event, onProgress);
        // 	});
    };
    DiskSearch.prototype.clearCache = function (cacheKey) {
        return new TPromise(function (r) { return r(undefined); });
    };
    return DiskSearch;
}());
export { DiskSearch };
