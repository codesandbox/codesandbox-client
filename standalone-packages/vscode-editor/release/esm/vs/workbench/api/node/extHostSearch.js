/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import { toDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import * as extfs from '../../../base/node/extfs.js';
import { FileIndexSearchManager } from './extHostSearch.fileIndex.js';
import { FileSearchManager } from '../../services/search/node/fileSearchManager.js';
import { SearchService } from '../../services/search/node/rawSearchService.js';
import { RipgrepSearchProvider } from '../../services/search/node/ripgrepSearchProvider.js';
import { OutputChannel } from '../../services/search/node/ripgrepSearchUtils.js';
import { isSerializedFileMatch } from '../../services/search/node/search.js';
import { TextSearchManager } from '../../services/search/node/textSearchManager.js';
import { MainContext } from './extHost.protocol.js';
var ExtHostSearch = /** @class */ (function () {
    function ExtHostSearch(mainContext, _schemeTransformer, _logService, configService, _extfs) {
        if (_extfs === void 0) { _extfs = extfs; }
        this._schemeTransformer = _schemeTransformer;
        this._logService = _logService;
        this._extfs = _extfs;
        this._textSearchProvider = new Map();
        this._textSearchUsedSchemes = new Set();
        this._fileSearchProvider = new Map();
        this._fileSearchUsedSchemes = new Set();
        this._fileIndexProvider = new Map();
        this._fileIndexUsedSchemes = new Set();
        this._handlePool = 0;
        this._proxy = mainContext.getProxy(MainContext.MainThreadSearch);
        this._fileSearchManager = new FileSearchManager();
        this._fileIndexSearchManager = new FileIndexSearchManager();
        registerEHProviders(this, _logService, configService);
    }
    ExtHostSearch.prototype._transformScheme = function (scheme) {
        if (this._schemeTransformer) {
            return this._schemeTransformer.transformOutgoing(scheme);
        }
        return scheme;
    };
    ExtHostSearch.prototype.registerTextSearchProvider = function (scheme, provider) {
        var _this = this;
        if (this._textSearchUsedSchemes.has(scheme)) {
            throw new Error("a provider for the scheme '" + scheme + "' is already registered");
        }
        this._textSearchUsedSchemes.add(scheme);
        var handle = this._handlePool++;
        this._textSearchProvider.set(handle, provider);
        this._proxy.$registerTextSearchProvider(handle, this._transformScheme(scheme));
        return toDisposable(function () {
            _this._textSearchUsedSchemes.delete(scheme);
            _this._textSearchProvider.delete(handle);
            _this._proxy.$unregisterProvider(handle);
        });
    };
    ExtHostSearch.prototype.registerFileSearchProvider = function (scheme, provider) {
        var _this = this;
        if (this._fileSearchUsedSchemes.has(scheme)) {
            throw new Error("a provider for the scheme '" + scheme + "' is already registered");
        }
        this._fileSearchUsedSchemes.add(scheme);
        var handle = this._handlePool++;
        this._fileSearchProvider.set(handle, provider);
        this._proxy.$registerFileSearchProvider(handle, this._transformScheme(scheme));
        return toDisposable(function () {
            _this._fileSearchUsedSchemes.delete(scheme);
            _this._fileSearchProvider.delete(handle);
            _this._proxy.$unregisterProvider(handle);
        });
    };
    ExtHostSearch.prototype.registerInternalFileSearchProvider = function (scheme, provider) {
        var _this = this;
        var handle = this._handlePool++;
        this._internalFileSearchProvider = provider;
        this._internalFileSearchHandle = handle;
        this._proxy.$registerFileSearchProvider(handle, this._transformScheme(scheme));
        return toDisposable(function () {
            _this._internalFileSearchProvider = null;
            _this._proxy.$unregisterProvider(handle);
        });
    };
    ExtHostSearch.prototype.registerFileIndexProvider = function (scheme, provider) {
        var _this = this;
        if (this._fileIndexUsedSchemes.has(scheme)) {
            throw new Error("a provider for the scheme '" + scheme + "' is already registered");
        }
        this._fileIndexUsedSchemes.add(scheme);
        var handle = this._handlePool++;
        this._fileIndexProvider.set(handle, provider);
        this._proxy.$registerFileIndexProvider(handle, this._transformScheme(scheme));
        return toDisposable(function () {
            _this._fileIndexUsedSchemes.delete(scheme);
            _this._fileSearchProvider.delete(handle);
            _this._proxy.$unregisterProvider(handle); // TODO@roblou - unregisterFileIndexProvider
        });
    };
    ExtHostSearch.prototype.$provideFileSearchResults = function (handle, session, rawQuery, token) {
        var _this = this;
        var query = reviveQuery(rawQuery);
        if (handle === this._internalFileSearchHandle) {
            return this.doInternalFileSearch(handle, session, query, token);
        }
        else {
            var provider = this._fileSearchProvider.get(handle);
            if (provider) {
                return this._fileSearchManager.fileSearch(query, provider, function (batch) {
                    _this._proxy.$handleFileMatch(handle, session, batch.map(function (p) { return p.resource; }));
                }, token);
            }
            else {
                var indexProvider = this._fileIndexProvider.get(handle);
                return this._fileIndexSearchManager.fileSearch(query, indexProvider, function (batch) {
                    _this._proxy.$handleFileMatch(handle, session, batch.map(function (p) { return p.resource; }));
                }, token);
            }
        }
    };
    ExtHostSearch.prototype.doInternalFileSearch = function (handle, session, rawQuery, token) {
        var _this = this;
        var onResult = function (ev) {
            if (isSerializedFileMatch(ev)) {
                ev = [ev];
            }
            if (Array.isArray(ev)) {
                _this._proxy.$handleFileMatch(handle, session, ev.map(function (m) { return URI.file(m.path); }));
                return;
            }
            if (ev.message) {
                _this._logService.debug('ExtHostSearch', ev.message);
            }
        };
        return this._internalFileSearchProvider.doFileSearch(rawQuery, onResult, token);
    };
    ExtHostSearch.prototype.$clearCache = function (cacheKey) {
        if (this._internalFileSearchProvider) {
            this._internalFileSearchProvider.clearCache(cacheKey);
        }
        // Actually called once per provider.
        // Only relevant to file index search.
        return this._fileIndexSearchManager.clearCache(cacheKey);
    };
    ExtHostSearch.prototype.$provideTextSearchResults = function (handle, session, rawQuery, token) {
        var _this = this;
        var provider = this._textSearchProvider.get(handle);
        if (!provider.provideTextSearchResults) {
            return Promise.resolve(undefined);
        }
        var query = reviveQuery(rawQuery);
        var engine = new TextSearchManager(query, provider, this._extfs);
        return engine.search(function (progress) { return _this._proxy.$handleTextMatch(handle, session, progress); }, token);
    };
    return ExtHostSearch;
}());
export { ExtHostSearch };
function registerEHProviders(extHostSearch, logService, configService) {
    if (configService.getConfiguration('searchRipgrep').enable || configService.getConfiguration('search').runInExtensionHost) {
        var outputChannel = new OutputChannel(logService);
        extHostSearch.registerTextSearchProvider('file', new RipgrepSearchProvider(outputChannel));
        extHostSearch.registerInternalFileSearchProvider('file', new SearchService());
    }
}
function reviveQuery(rawQuery) {
    return __assign({}, rawQuery, {
        folderQueries: rawQuery.folderQueries && rawQuery.folderQueries.map(reviveFolderQuery),
        extraFileResources: rawQuery.extraFileResources && rawQuery.extraFileResources.map(function (components) { return URI.revive(components); })
    });
}
function reviveFolderQuery(rawFolderQuery) {
    return __assign({}, rawFolderQuery, { folder: URI.revive(rawFolderQuery.folder) });
}
