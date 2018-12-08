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
import * as arrays from '../base/common/arrays.js';
import { canceled } from '../base/common/errors.js';
import { Disposable, toDisposable, } from '../base/common/lifecycle.js';
import { keys, ResourceMap, values } from '../base/common/map.js';
import { Schemas } from '../base/common/network.js';
import * as objects from '../base/common/objects.js';
import { StopWatch } from '../base/common/stopwatch.js';
import { URI } from '../base/common/uri.js';
import { TPromise } from '../base/common/winjs.base.js';
import { IModelService } from '../editor/common/services/modelService.js';
import { IConfigurationService } from '../platform/configuration/common/configuration.js';
import { IEnvironmentService, } from '../platform/environment/common/environment.js';
import { ILogService } from '../platform/log/common/log.js';
import { deserializeSearchError, FileMatch, pathIncludedInQuery, SearchErrorCode, } from '../platform/search/common/search.js';
import { ITelemetryService } from '../platform/telemetry/common/telemetry.js';
import { IEditorService } from '../workbench/services/editor/common/editorService.js';
import { IExtensionService } from '../workbench/services/extensions/common/extensions.js';
import { addContextToEditorMatches, editorMatchesToTextSearchResults, } from '../workbench/services/search/common/searchHelpers.js';
import { IUntitledEditorService } from '../workbench/services/untitled/common/untitledEditorService.js';
import { ICodeSandboxService } from './services/codesandbox/common/codesandbox.js';
var CodeSandboxSearchService = /** @class */ (function (_super) {
    __extends(CodeSandboxSearchService, _super);
    function CodeSandboxSearchService(modelService, untitledEditorService, editorService, environmentService, telemetryService, configurationService, logService, extensionService, codesandboxService) {
        var _this = _super.call(this) || this;
        _this.modelService = modelService;
        _this.untitledEditorService = untitledEditorService;
        _this.editorService = editorService;
        _this.telemetryService = telemetryService;
        _this.configurationService = configurationService;
        _this.logService = logService;
        _this.extensionService = extensionService;
        _this.fileSearchProviders = new Map();
        _this.textSearchProviders = new Map();
        _this.fileIndexProviders = new Map();
        _this.diskSearch = new DiskSearch(codesandboxService);
        return _this;
    }
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
    CodeSandboxSearchService.prototype.extendQuery = function (query) {
        var configuration = this.configurationService.getValue();
        // Configuration: File Excludes
        if (!query.disregardExcludeSettings) {
            var fileExcludes = objects.deepClone(configuration &&
                configuration.files &&
                configuration.files.exclude);
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
    CodeSandboxSearchService.prototype.textSearch = function (query, token, onProgress) {
        var _this = this;
        // Get local results from dirty/untitled
        var localResults = this.getLocalResults(query);
        if (onProgress) {
            localResults
                .values()
                .filter(function (res) { return !!res; })
                .forEach(onProgress);
        }
        this.logService.trace('SearchService#search', JSON.stringify(query));
        var onProviderProgress = function (progress) {
            if (progress.resource) {
                // Match
                if (!localResults.has(progress.resource) && onProgress) {
                    // don't override local results
                    onProgress(progress);
                }
            }
            else if (onProgress) {
                // Progress
                onProgress(progress);
            }
            if (progress.message) {
                _this.logService.debug('SearchService#search', progress.message);
            }
        };
        return this.doSearch(query, token, onProviderProgress);
    };
    CodeSandboxSearchService.prototype.fileSearch = function (query, token) {
        return this.doSearch(query, token);
    };
    CodeSandboxSearchService.prototype.doSearch = function (query, token, onProgress) {
        var _this = this;
        var schemesInQuery = this.getSchemesInQuery(query);
        var providerActivations = [TPromise.wrap(null)];
        schemesInQuery.forEach(function (scheme) {
            return providerActivations.push(_this.extensionService.activateByEvent("onSearch:" + scheme));
        });
        providerActivations.push(this.extensionService.activateByEvent('onSearch:file'));
        var providerPromise = TPromise.join(providerActivations)
            .then(function () {
            return _this.extensionService.whenInstalledExtensionsRegistered();
        })
            .then(function () {
            // Cancel faster if search was canceled while waiting for extensions
            if (token && token.isCancellationRequested) {
                return TPromise.wrapError(canceled());
            }
            var progressCallback = function (item) {
                if (token && token.isCancellationRequested) {
                    return;
                }
                if (onProgress) {
                    onProgress(item);
                }
            };
            return _this.searchWithProviders(query, progressCallback, token);
        })
            .then(function (completes) {
            completes = completes.filter(function (c) { return !!c; });
            if (!completes.length) {
                return null;
            }
            return {
                limitHit: completes[0] && completes[0].limitHit,
                stats: completes[0].stats,
                results: arrays.flatten(completes.map(function (c) { return c.results; })),
            };
        }, function (errs) {
            if (!Array.isArray(errs)) {
                errs = [errs];
            }
            errs = errs.filter(function (e) { return !!e; });
            return TPromise.wrapError(errs[0]);
        });
        return new TPromise(function (resolve, reject) {
            if (token) {
                token.onCancellationRequested(function () {
                    reject(canceled());
                });
            }
            providerPromise.then(resolve, reject);
        });
    };
    CodeSandboxSearchService.prototype.getSchemesInQuery = function (query) {
        var schemes = new Set();
        if (query.folderQueries) {
            query.folderQueries.forEach(function (fq) { return schemes.add(fq.folder.scheme); });
        }
        if (query.extraFileResources) {
            query.extraFileResources.forEach(function (extraFile) {
                return schemes.add(extraFile.scheme);
            });
        }
        return schemes;
    };
    CodeSandboxSearchService.prototype.searchWithProviders = function (query, onProviderProgress, token) {
        var _this = this;
        var e2eSW = StopWatch.create(false);
        var diskSearchQueries = [];
        var searchPs = [];
        var fqs = this.groupFolderQueriesByScheme(query);
        keys(fqs).forEach(function (scheme) {
            var schemeFQs = fqs.get(scheme);
            var provider = query.type === 1 /* File */
                ? _this.fileSearchProviders.get(scheme) ||
                    _this.fileIndexProviders.get(scheme)
                : _this.textSearchProviders.get(scheme);
            if (!provider && scheme === 'file') {
                diskSearchQueries.push.apply(diskSearchQueries, schemeFQs);
            }
            else if (!provider) {
                throw new Error('No search provider registered for scheme: ' + scheme);
            }
            else {
                var oneSchemeQuery = __assign({}, query, {
                    folderQueries: schemeFQs,
                });
                searchPs.push(query.type === 1 /* File */
                    ? provider.fileSearch(oneSchemeQuery, token)
                    : provider.textSearch(oneSchemeQuery, onProviderProgress, token));
            }
        });
        var diskSearchExtraFileResources = query.extraFileResources &&
            query.extraFileResources.filter(function (res) { return res.scheme === Schemas.file; });
        if (diskSearchQueries.length || diskSearchExtraFileResources) {
            var diskSearchQuery = __assign({}, query, {
                folderQueries: diskSearchQueries,
            }, { extraFileResources: diskSearchExtraFileResources });
            searchPs.push(diskSearchQuery.type === 1 /* File */
                ? this.diskSearch.fileSearch(diskSearchQuery, token)
                : this.diskSearch.textSearch(diskSearchQuery, onProviderProgress, token));
        }
        return TPromise.join(searchPs).then(function (completes) {
            var endToEndTime = e2eSW.elapsed();
            _this.logService.trace("SearchService#search: " + endToEndTime + "ms");
            completes.forEach(function (complete) {
                _this.sendTelemetry(query, endToEndTime, complete);
            });
            return completes;
        }, function (errs) {
            var endToEndTime = e2eSW.elapsed();
            _this.logService.trace("SearchService#search: " + endToEndTime + "ms");
            errs = errs.filter(function (e) { return !!e; });
            var searchError = deserializeSearchError(errs[0] && errs[0].message);
            _this.sendTelemetry(query, endToEndTime, null, searchError);
            throw searchError;
        });
    };
    CodeSandboxSearchService.prototype.groupFolderQueriesByScheme = function (query) {
        var queries = new Map();
        query.folderQueries.forEach(function (fq) {
            var schemeFQs = queries.get(fq.folder.scheme) || [];
            schemeFQs.push(fq);
            queries.set(fq.folder.scheme, schemeFQs);
        });
        return queries;
    };
    CodeSandboxSearchService.prototype.sendTelemetry = function (query, endToEndTime, complete, err) {
        var fileSchemeOnly = query.folderQueries.every(function (fq) { return fq.folder.scheme === 'file'; });
        var otherSchemeOnly = query.folderQueries.every(function (fq) { return fq.folder.scheme !== 'file'; });
        var scheme = fileSchemeOnly
            ? 'file'
            : otherSchemeOnly
                ? 'other'
                : 'mixed';
        if (query.type === 1 /* File */ && complete && complete.stats) {
            var fileSearchStats = complete.stats;
            if (fileSearchStats.fromCache) {
                var cacheStats = fileSearchStats.detailStats;
                /* __GDPR__
                    "cachedSearchComplete" : {
                        "reason" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth"  },
                        "resultCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true  },
                        "workspaceFolderCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true  },
                        "type" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "endToEndTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "sortingTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "cacheWasResolved" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "cacheLookupTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "cacheFilterTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "cacheEntryCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "scheme" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
                    }
                 */
                this.telemetryService.publicLog('cachedSearchComplete', {
                    reason: query._reason,
                    resultCount: fileSearchStats.resultCount,
                    workspaceFolderCount: query.folderQueries.length,
                    type: fileSearchStats.type,
                    endToEndTime: endToEndTime,
                    sortingTime: fileSearchStats.sortingTime,
                    cacheWasResolved: cacheStats.cacheWasResolved,
                    cacheLookupTime: cacheStats.cacheLookupTime,
                    cacheFilterTime: cacheStats.cacheFilterTime,
                    cacheEntryCount: cacheStats.cacheEntryCount,
                    scheme: scheme,
                });
            }
            else {
                var searchEngineStats = fileSearchStats.detailStats;
                /* __GDPR__
                    "searchComplete" : {
                        "reason" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "resultCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "workspaceFolderCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "type" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "endToEndTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "sortingTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "traversal" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "fileWalkTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "directoriesWalked" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "filesWalked" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "cmdTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "cmdResultCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                        "scheme" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "useRipgrep" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
                    }
                 */
                this.telemetryService.publicLog('searchComplete', {
                    reason: query._reason,
                    resultCount: fileSearchStats.resultCount,
                    workspaceFolderCount: query.folderQueries.length,
                    type: fileSearchStats.type,
                    endToEndTime: endToEndTime,
                    sortingTime: fileSearchStats.sortingTime,
                    traversal: searchEngineStats.traversal,
                    fileWalkTime: searchEngineStats.fileWalkTime,
                    directoriesWalked: searchEngineStats.directoriesWalked,
                    filesWalked: searchEngineStats.filesWalked,
                    cmdTime: searchEngineStats.cmdTime,
                    cmdResultCount: searchEngineStats.cmdResultCount,
                    scheme: scheme,
                    useRipgrep: query.useRipgrep,
                });
            }
        }
        else if (query.type === 2 /* Text */) {
            var errorType = void 0;
            if (err) {
                errorType =
                    err.code === SearchErrorCode.regexParseError
                        ? 'regex'
                        : err.code === SearchErrorCode.unknownEncoding
                            ? 'encoding'
                            : err.code === SearchErrorCode.globParseError
                                ? 'glob'
                                : err.code === SearchErrorCode.invalidLiteral
                                    ? 'literal'
                                    : err.code === SearchErrorCode.other
                                        ? 'other'
                                        : 'unknown';
            }
            /* __GDPR__
                "textSearchComplete" : {
                    "reason" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "workspaceFolderCount" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "endToEndTime" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "scheme" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "error" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "useRipgrep" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "usePCRE2" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
                }
             */
            this.telemetryService.publicLog('textSearchComplete', {
                reason: query._reason,
                workspaceFolderCount: query.folderQueries.length,
                endToEndTime: endToEndTime,
                scheme: scheme,
                error: errorType,
                useRipgrep: query.useRipgrep,
                usePCRE2: !!query.usePCRE2,
            });
        }
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
                // Don't support other resource schemes than files for now
                // todo@remote
                // why is that? we should search for resources from other
                // schemes
                else if (resource.scheme !== Schemas.file) {
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
                    var fileMatch = new FileMatch(resource);
                    localResults.set(resource, fileMatch);
                    var textSearchResults = editorMatchesToTextSearchResults(matches, model, query.previewOptions);
                    fileMatch.results = addContextToEditorMatches(textSearchResults, model, query);
                }
                else {
                    localResults.set(resource, null);
                }
            });
        }
        return localResults;
    };
    CodeSandboxSearchService.prototype.matches = function (resource, query) {
        // includes
        if (query.includePattern) {
            if (resource.scheme !== Schemas.file) {
                return false; // if we match on file patterns, we have to ignore non file resources
            }
        }
        return pathIncludedInQuery(query, resource.fsPath);
    };
    CodeSandboxSearchService.prototype.clearCache = function (cacheKey) {
        var clearPs = [
            this.diskSearch
        ].concat(values(this.fileIndexProviders)).map(function (provider) { return provider && provider.clearCache(cacheKey); });
        return TPromise.join(clearPs).then(function () { });
    };
    CodeSandboxSearchService = __decorate([
        __param(0, IModelService),
        __param(1, IUntitledEditorService),
        __param(2, IEditorService),
        __param(3, IEnvironmentService),
        __param(4, ITelemetryService),
        __param(5, IConfigurationService),
        __param(6, ILogService),
        __param(7, IExtensionService),
        __param(8, ICodeSandboxService)
    ], CodeSandboxSearchService);
    return CodeSandboxSearchService;
}(Disposable));
export { CodeSandboxSearchService };
var DiskSearch = /** @class */ (function () {
    function DiskSearch(codesandboxService) {
        this.codesandboxService = codesandboxService;
    }
    DiskSearch.prototype.fileSearch = function (query, token) {
        var _this = this;
        var folderQueries = query.folderQueries || [];
        return new TPromise(function (re) {
            var files = _this.codesandboxService.getFilesByPath();
            re({
                results: Object.keys(files).map(function (p) { return ({
                    resource: URI.file(p),
                    results: []
                }); }),
                limitHit: false,
            });
        });
    };
    DiskSearch.prototype.textSearch = function (query, onProgress, token) {
        var folderQueries = query.folderQueries || [];
        return new TPromise(function (re) {
            re({
                results: [],
                limitHit: false,
            });
        });
    };
    DiskSearch.prototype.clearCache = function (cacheKey) {
        return new TPromise(function (r) { return r(undefined); });
    };
    return DiskSearch;
}());
export { DiskSearch };
