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
import { TPromise } from '../../../../base/common/winjs.base.js';
import { distinct, top } from '../../../../base/common/arrays.js';
import * as strings from '../../../../base/common/strings.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { or, matchesContiguousSubString, matchesPrefix, matchesCamelCase, matchesWords } from '../../../../base/common/filters.js';
import { IWorkspaceConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { asJson } from '../../../../base/node/request.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IExtensionManagementService, IExtensionEnablementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { canceled } from '../../../../base/common/errors.js';
var PreferencesSearchService = /** @class */ (function (_super) {
    __extends(PreferencesSearchService, _super);
    function PreferencesSearchService(configurationService, environmentService, instantiationService, extensionManagementService, extensionEnablementService) {
        var _this = _super.call(this) || this;
        _this.configurationService = configurationService;
        _this.environmentService = environmentService;
        _this.instantiationService = instantiationService;
        _this.extensionManagementService = extensionManagementService;
        _this.extensionEnablementService = extensionEnablementService;
        // This request goes to the shared process but results won't change during a window's lifetime, so cache the results.
        _this._installedExtensions = _this.extensionManagementService.getInstalled(1 /* User */).then(function (exts) {
            // Filter to enabled extensions that have settings
            return exts
                .filter(function (ext) { return _this.extensionEnablementService.isEnabled(ext); })
                .filter(function (ext) { return ext.manifest && ext.manifest.contributes && ext.manifest.contributes.configuration; })
                .filter(function (ext) { return !!ext.identifier.uuid; });
        });
        return _this;
    }
    Object.defineProperty(PreferencesSearchService.prototype, "remoteSearchAllowed", {
        get: function () {
            var workbenchSettings = this.configurationService.getValue().workbench.settings;
            return false;
            if (!workbenchSettings.enableNaturalLanguageSearch) {
                return false;
            }
            return !!this._endpoint.urlBase;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesSearchService.prototype, "_endpoint", {
        get: function () {
            var workbenchSettings = this.configurationService.getValue().workbench.settings;
            if (workbenchSettings.naturalLanguageSearchEndpoint) {
                return {
                    urlBase: workbenchSettings.naturalLanguageSearchEndpoint,
                    key: workbenchSettings.naturalLanguageSearchKey
                };
            }
            else {
                return {
                    urlBase: this.environmentService.settingsSearchUrl
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    PreferencesSearchService.prototype.getRemoteSearchProvider = function (filter, newExtensionsOnly) {
        if (newExtensionsOnly === void 0) { newExtensionsOnly = false; }
        var opts = {
            filter: filter,
            newExtensionsOnly: newExtensionsOnly,
            endpoint: this._endpoint
        };
        return this.remoteSearchAllowed && this.instantiationService.createInstance(RemoteSearchProvider, opts, this._installedExtensions);
    };
    PreferencesSearchService.prototype.getLocalSearchProvider = function (filter) {
        return this.instantiationService.createInstance(LocalSearchProvider, filter);
    };
    PreferencesSearchService = __decorate([
        __param(0, IWorkspaceConfigurationService),
        __param(1, IEnvironmentService),
        __param(2, IInstantiationService),
        __param(3, IExtensionManagementService),
        __param(4, IExtensionEnablementService)
    ], PreferencesSearchService);
    return PreferencesSearchService;
}(Disposable));
export { PreferencesSearchService };
var LocalSearchProvider = /** @class */ (function () {
    function LocalSearchProvider(_filter) {
        this._filter = _filter;
        // Remove " and : which are likely to be copypasted as part of a setting name.
        // Leave other special characters which the user might want to search for.
        this._filter = this._filter
            .replace(/[":]/g, ' ')
            .replace(/  /g, ' ')
            .trim();
    }
    LocalSearchProvider.prototype.searchModel = function (preferencesModel, token) {
        var _this = this;
        if (!this._filter) {
            return TPromise.wrap(null);
        }
        var orderedScore = LocalSearchProvider.START_SCORE; // Sort is not stable
        var settingMatcher = function (setting) {
            var matches = new SettingMatches(_this._filter, setting, true, true, function (filter, setting) { return preferencesModel.findValueMatches(filter, setting); }).matches;
            var score = _this._filter === setting.key ?
                LocalSearchProvider.EXACT_MATCH_SCORE :
                orderedScore--;
            return matches && matches.length ?
                {
                    matches: matches,
                    score: score
                } :
                null;
        };
        var filterMatches = preferencesModel.filterSettings(this._filter, this.getGroupFilter(this._filter), settingMatcher);
        if (filterMatches[0] && filterMatches[0].score === LocalSearchProvider.EXACT_MATCH_SCORE) {
            return TPromise.wrap({
                filterMatches: filterMatches.slice(0, 1),
                exactMatch: true
            });
        }
        else {
            return TPromise.wrap({
                filterMatches: filterMatches
            });
        }
    };
    LocalSearchProvider.prototype.getGroupFilter = function (filter) {
        var regex = strings.createRegExp(filter, false, { global: true });
        return function (group) {
            return regex.test(group.title);
        };
    };
    LocalSearchProvider.EXACT_MATCH_SCORE = 10000;
    LocalSearchProvider.START_SCORE = 1000;
    return LocalSearchProvider;
}());
export { LocalSearchProvider };
var RemoteSearchProvider = /** @class */ (function () {
    function RemoteSearchProvider(options, installedExtensions, environmentService, 
    // @IRequestService private requestService: IRequestService,
    logService) {
        this.options = options;
        this.installedExtensions = installedExtensions;
        this.environmentService = environmentService;
        this.logService = logService;
        this._remoteSearchP = this.options.filter ?
            TPromise.wrap(this.getSettingsForFilter(this.options.filter)) :
            TPromise.wrap(null);
    }
    RemoteSearchProvider.prototype.searchModel = function (preferencesModel, token) {
        var _this = this;
        return this._remoteSearchP.then(function (remoteResult) {
            if (!remoteResult) {
                return null;
            }
            if (token && token.isCancellationRequested) {
                throw canceled();
            }
            var resultKeys = Object.keys(remoteResult.scoredResults);
            var highScoreKey = top(resultKeys, function (a, b) { return remoteResult.scoredResults[b].score - remoteResult.scoredResults[a].score; }, 1)[0];
            var highScore = highScoreKey ? remoteResult.scoredResults[highScoreKey].score : 0;
            var minScore = highScore / 5;
            if (_this.options.newExtensionsOnly) {
                return _this.installedExtensions.then(function (installedExtensions) {
                    var newExtsMinScore = Math.max(RemoteSearchProvider.NEW_EXTENSIONS_MIN_SCORE, minScore);
                    var passingScoreKeys = resultKeys
                        .filter(function (k) {
                        var result = remoteResult.scoredResults[k];
                        var resultExtId = (result.extensionPublisher + '.' + result.extensionName).toLowerCase();
                        return !installedExtensions.some(function (ext) { return ext.galleryIdentifier.id.toLowerCase() === resultExtId; });
                    })
                        .filter(function (k) { return remoteResult.scoredResults[k].score >= newExtsMinScore; });
                    var filterMatches = passingScoreKeys.map(function (k) {
                        var remoteSetting = remoteResult.scoredResults[k];
                        var setting = remoteSettingToISetting(remoteSetting);
                        return {
                            setting: setting,
                            score: remoteSetting.score,
                            matches: [] // TODO
                        };
                    });
                    return {
                        filterMatches: filterMatches,
                        metadata: remoteResult
                    };
                });
            }
            else {
                var settingMatcher = _this.getRemoteSettingMatcher(remoteResult.scoredResults, minScore, preferencesModel);
                var filterMatches = preferencesModel.filterSettings(_this.options.filter, function (group) { return null; }, settingMatcher);
                return {
                    filterMatches: filterMatches,
                    metadata: remoteResult
                };
            }
        });
    };
    RemoteSearchProvider.prototype.getSettingsForFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var allRequestDetails, i, details;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allRequestDetails = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < RemoteSearchProvider.MAX_REQUESTS)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prepareRequest(filter, i)];
                    case 2:
                        details = _a.sent();
                        allRequestDetails.push(details);
                        if (!details.hasMoreFilters) {
                            return [3 /*break*/, 4];
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, TPromise.join(allRequestDetails.map(function (details) { return _this.getSettingsFromBing(details); })).then(function (allResponses) {
                            // Merge all IFilterMetadata
                            var metadata = allResponses[0];
                            metadata.requestCount = 1;
                            for (var _i = 0, _a = allResponses.slice(1); _i < _a.length; _i++) {
                                var response = _a[_i];
                                metadata.requestCount++;
                                metadata.scoredResults = __assign({}, metadata.scoredResults, response.scoredResults);
                            }
                            return metadata;
                        })];
                }
            });
        });
    };
    RemoteSearchProvider.prototype.getSettingsFromBing = function (details) {
        this.logService.debug("Searching settings via " + details.url);
        if (details.body) {
            this.logService.debug("Body: " + details.body);
        }
        var requestType = details.body ? 'post' : 'get';
        var start = Date.now();
        return this.requestService.request({
            type: requestType,
            url: details.url,
            data: details.body,
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json; charset=utf-8',
                'api-key': this.options.endpoint.key
            },
            timeout: 5000
        }, CancellationToken.None).then(function (context) {
            if (context.res.statusCode >= 300) {
                throw new Error(details + " returned status code: " + context.res.statusCode);
            }
            return asJson(context);
        }).then(function (result) {
            var timestamp = Date.now();
            var duration = timestamp - start;
            var remoteSettings = (result.value || [])
                .map(function (r) {
                var _a;
                var key = JSON.parse(r.setting || r.Setting);
                var packageId = r['packageid'];
                var id = getSettingKey(key, packageId);
                var value = r['value'];
                var defaultValue = value ? JSON.parse(value) : value;
                var packageName = r['packagename'];
                var extensionName;
                var extensionPublisher;
                if (packageName && packageName.indexOf('##') >= 0) {
                    _a = packageName.split('##'), extensionPublisher = _a[0], extensionName = _a[1];
                }
                return {
                    key: key,
                    id: id,
                    defaultValue: defaultValue,
                    score: r['@search.score'],
                    description: JSON.parse(r['details']),
                    packageId: packageId,
                    extensionName: extensionName,
                    extensionPublisher: extensionPublisher
                };
            });
            var scoredResults = Object.create(null);
            remoteSettings.forEach(function (s) {
                scoredResults[s.id] = s;
            });
            return {
                requestUrl: details.url,
                requestBody: details.body,
                duration: duration,
                timestamp: timestamp,
                scoredResults: scoredResults,
                context: result['@odata.context'],
                extensions: details.extensions
            };
        });
    };
    RemoteSearchProvider.prototype.getRemoteSettingMatcher = function (scoredResults, minScore, preferencesModel) {
        var _this = this;
        return function (setting, group) {
            var remoteSetting = scoredResults[getSettingKey(setting.key, group.id)] || // extension setting
                scoredResults[getSettingKey(setting.key, 'core')] || // core setting
                scoredResults[getSettingKey(setting.key)]; // core setting from original prod endpoint
            if (remoteSetting && remoteSetting.score >= minScore) {
                var settingMatches = new SettingMatches(_this.options.filter, setting, false, true, function (filter, setting) { return preferencesModel.findValueMatches(filter, setting); }).matches;
                return { matches: settingMatches, score: remoteSetting.score };
            }
            return null;
        };
    };
    RemoteSearchProvider.prototype.prepareRequest = function (query, filterPage) {
        if (filterPage === void 0) { filterPage = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var verbatimQuery, boost, boostedQuery, encodedQuery, url, extensions, filters, filterStr, hasMoreFilters, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        verbatimQuery = query;
                        query = escapeSpecialChars(query);
                        boost = 10;
                        boostedQuery = "(" + query + ")^" + boost;
                        // Appending Fuzzy after each word.
                        query = query.replace(/\ +/g, '~ ') + '~';
                        encodedQuery = encodeURIComponent(boostedQuery + ' || ' + query);
                        url = "" + this.options.endpoint.urlBase;
                        if (this.options.endpoint.key) {
                            url += API_VERSION + "&" + QUERY_TYPE;
                        }
                        return [4 /*yield*/, this.installedExtensions];
                    case 1:
                        extensions = _a.sent();
                        filters = this.options.newExtensionsOnly ?
                            ["diminish eq 'latest'"] :
                            this.getVersionFilters(extensions, this.environmentService.settingsSearchBuildId);
                        filterStr = filters
                            .slice(filterPage * RemoteSearchProvider.MAX_REQUEST_FILTERS, (filterPage + 1) * RemoteSearchProvider.MAX_REQUEST_FILTERS)
                            .join(' or ');
                        hasMoreFilters = filters.length > (filterPage + 1) * RemoteSearchProvider.MAX_REQUEST_FILTERS;
                        body = JSON.stringify({
                            query: encodedQuery,
                            filters: encodeURIComponent(filterStr),
                            rawQuery: encodeURIComponent(verbatimQuery)
                        });
                        return [2 /*return*/, {
                                url: url,
                                body: body,
                                hasMoreFilters: hasMoreFilters,
                                extensions: extensions
                            }];
                }
            });
        });
    };
    RemoteSearchProvider.prototype.getVersionFilters = function (exts, buildNumber) {
        var _this = this;
        // Only search extensions that contribute settings
        var filters = exts
            .filter(function (ext) { return ext.manifest.contributes && ext.manifest.contributes.configuration; })
            .map(function (ext) { return _this.getExtensionFilter(ext); });
        if (buildNumber) {
            filters.push("(packageid eq 'core' and startbuildno le '" + buildNumber + "' and endbuildno ge '" + buildNumber + "')");
        }
        return filters;
    };
    RemoteSearchProvider.prototype.getExtensionFilter = function (ext) {
        var uuid = ext.identifier.uuid;
        var versionString = ext.manifest.version
            .split('.')
            .map(function (versionPart) { return strings.pad(versionPart, 10); })
            .join('');
        return "(packageid eq '" + uuid + "' and startbuildno le '" + versionString + "' and endbuildno ge '" + versionString + "')";
    };
    // Must keep extension filter size under 8kb. 42 filters puts us there.
    RemoteSearchProvider.MAX_REQUEST_FILTERS = 42;
    RemoteSearchProvider.MAX_REQUESTS = 10;
    RemoteSearchProvider.NEW_EXTENSIONS_MIN_SCORE = 1;
    RemoteSearchProvider = __decorate([
        __param(2, IEnvironmentService),
        __param(3, ILogService)
    ], RemoteSearchProvider);
    return RemoteSearchProvider;
}());
function getSettingKey(name, packageId) {
    return packageId ?
        packageId + '##' + name :
        name;
}
var API_VERSION = 'api-version=2016-09-01-Preview';
var QUERY_TYPE = 'querytype=full';
function escapeSpecialChars(query) {
    return query.replace(/\./g, ' ')
        .replace(/[\\/+\-&|!"~*?:(){}\[\]\^]/g, '\\$&')
        .replace(/  /g, ' ') // collapse spaces
        .trim();
}
function remoteSettingToISetting(remoteSetting) {
    return {
        description: remoteSetting.description.split('\n'),
        descriptionIsMarkdown: false,
        descriptionRanges: null,
        key: remoteSetting.key,
        keyRange: null,
        value: remoteSetting.defaultValue,
        range: null,
        valueRange: null,
        overrides: [],
        extensionName: remoteSetting.extensionName,
        extensionPublisher: remoteSetting.extensionPublisher
    };
}
var SettingMatches = /** @class */ (function () {
    function SettingMatches(searchString, setting, requireFullQueryMatch, searchDescription, valuesMatcher) {
        this.requireFullQueryMatch = requireFullQueryMatch;
        this.searchDescription = searchDescription;
        this.valuesMatcher = valuesMatcher;
        this.descriptionMatchingWords = new Map();
        this.keyMatchingWords = new Map();
        this.valueMatchingWords = new Map();
        this.matches = distinct(this._findMatchesInSetting(searchString, setting), function (match) { return match.startLineNumber + "_" + match.startColumn + "_" + match.endLineNumber + "_" + match.endColumn + "_"; });
    }
    SettingMatches.prototype._findMatchesInSetting = function (searchString, setting) {
        var result = this._doFindMatchesInSetting(searchString, setting);
        if (setting.overrides && setting.overrides.length) {
            for (var _i = 0, _a = setting.overrides; _i < _a.length; _i++) {
                var subSetting = _a[_i];
                var subSettingMatches = new SettingMatches(searchString, subSetting, this.requireFullQueryMatch, this.searchDescription, this.valuesMatcher);
                var words = searchString.split(' ');
                var descriptionRanges = this.getRangesForWords(words, this.descriptionMatchingWords, [subSettingMatches.descriptionMatchingWords, subSettingMatches.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                var keyRanges = this.getRangesForWords(words, this.keyMatchingWords, [subSettingMatches.descriptionMatchingWords, subSettingMatches.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                var subSettingKeyRanges = this.getRangesForWords(words, subSettingMatches.keyMatchingWords, [this.descriptionMatchingWords, this.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                var subSettinValueRanges = this.getRangesForWords(words, subSettingMatches.valueMatchingWords, [this.descriptionMatchingWords, this.keyMatchingWords, subSettingMatches.keyMatchingWords]);
                result.push.apply(result, descriptionRanges.concat(keyRanges, subSettingKeyRanges, subSettinValueRanges));
                result.push.apply(result, subSettingMatches.matches);
            }
        }
        return result;
    };
    SettingMatches.prototype._doFindMatchesInSetting = function (searchString, setting) {
        var _this = this;
        var registry = Registry.as(Extensions.Configuration).getConfigurationProperties();
        var schema = registry[setting.key];
        var words = searchString.split(' ');
        var settingKeyAsWords = setting.key.split('.').join(' ');
        var _loop_1 = function (word) {
            if (this_1.searchDescription) {
                var _loop_3 = function (lineIndex) {
                    var descriptionMatches = matchesWords(word, setting.description[lineIndex], true);
                    if (descriptionMatches) {
                        this_1.descriptionMatchingWords.set(word, descriptionMatches.map(function (match) { return _this.toDescriptionRange(setting, match, lineIndex); }));
                    }
                };
                for (var lineIndex = 0; lineIndex < setting.description.length; lineIndex++) {
                    _loop_3(lineIndex);
                }
            }
            var keyMatches_1 = or(matchesWords, matchesCamelCase)(word, settingKeyAsWords);
            if (keyMatches_1) {
                this_1.keyMatchingWords.set(word, keyMatches_1.map(function (match) { return _this.toKeyRange(setting, match); }));
            }
            var valueMatches = typeof setting.value === 'string' ? matchesContiguousSubString(word, setting.value) : null;
            if (valueMatches) {
                this_1.valueMatchingWords.set(word, valueMatches.map(function (match) { return _this.toValueRange(setting, match); }));
            }
            else if (schema && schema.enum && schema.enum.some(function (enumValue) { return typeof enumValue === 'string' && !!matchesContiguousSubString(word, enumValue); })) {
                this_1.valueMatchingWords.set(word, []);
            }
        };
        var this_1 = this;
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            _loop_1(word);
        }
        var descriptionRanges = [];
        if (this.searchDescription) {
            var _loop_2 = function (lineIndex) {
                var matches = or(matchesContiguousSubString)(searchString, setting.description[lineIndex] || '') || [];
                descriptionRanges.push.apply(descriptionRanges, matches.map(function (match) { return _this.toDescriptionRange(setting, match, lineIndex); }));
            };
            for (var lineIndex = 0; lineIndex < setting.description.length; lineIndex++) {
                _loop_2(lineIndex);
            }
            if (descriptionRanges.length === 0) {
                descriptionRanges.push.apply(descriptionRanges, this.getRangesForWords(words, this.descriptionMatchingWords, [this.keyMatchingWords, this.valueMatchingWords]));
            }
        }
        var keyMatches = or(matchesPrefix, matchesContiguousSubString)(searchString, setting.key);
        var keyRanges = keyMatches ? keyMatches.map(function (match) { return _this.toKeyRange(setting, match); }) : this.getRangesForWords(words, this.keyMatchingWords, [this.descriptionMatchingWords, this.valueMatchingWords]);
        var valueRanges = [];
        if (setting.value && typeof setting.value === 'string') {
            var valueMatches = or(matchesPrefix, matchesContiguousSubString)(searchString, setting.value);
            valueRanges = valueMatches ? valueMatches.map(function (match) { return _this.toValueRange(setting, match); }) : this.getRangesForWords(words, this.valueMatchingWords, [this.keyMatchingWords, this.descriptionMatchingWords]);
        }
        else {
            valueRanges = this.valuesMatcher ? this.valuesMatcher(searchString, setting) : [];
        }
        return descriptionRanges.concat(keyRanges, valueRanges);
    };
    SettingMatches.prototype.getRangesForWords = function (words, from, others) {
        var result = [];
        var _loop_4 = function (word) {
            var ranges = from.get(word);
            if (ranges) {
                result.push.apply(result, ranges);
            }
            else if (this_2.requireFullQueryMatch && others.every(function (o) { return !o.has(word); })) {
                return { value: [] };
            }
        };
        var this_2 = this;
        for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
            var word = words_2[_i];
            var state_1 = _loop_4(word);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return result;
    };
    SettingMatches.prototype.toKeyRange = function (setting, match) {
        if (!setting.keyRange) {
            // No source range? Return fake range, don't care
            return {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0,
            };
        }
        return {
            startLineNumber: setting.keyRange.startLineNumber,
            startColumn: setting.keyRange.startColumn + match.start,
            endLineNumber: setting.keyRange.startLineNumber,
            endColumn: setting.keyRange.startColumn + match.end
        };
    };
    SettingMatches.prototype.toDescriptionRange = function (setting, match, lineIndex) {
        if (!setting.keyRange) {
            // No source range? Return fake range, don't care
            return {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0,
            };
        }
        return {
            startLineNumber: setting.descriptionRanges[lineIndex].startLineNumber,
            startColumn: setting.descriptionRanges[lineIndex].startColumn + match.start,
            endLineNumber: setting.descriptionRanges[lineIndex].endLineNumber,
            endColumn: setting.descriptionRanges[lineIndex].startColumn + match.end
        };
    };
    SettingMatches.prototype.toValueRange = function (setting, match) {
        if (!setting.keyRange) {
            // No source range? Return fake range, don't care
            return {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0,
            };
        }
        return {
            startLineNumber: setting.valueRange.startLineNumber,
            startColumn: setting.valueRange.startColumn + match.start + 1,
            endLineNumber: setting.valueRange.startLineNumber,
            endColumn: setting.valueRange.startColumn + match.end + 1
        };
    };
    return SettingMatches;
}());
