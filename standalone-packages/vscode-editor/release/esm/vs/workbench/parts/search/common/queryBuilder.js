/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls.js';
import * as arrays from '../../../../base/common/arrays.js';
import * as objects from '../../../../base/common/objects.js';
import * as collections from '../../../../base/common/collections.js';
import * as strings from '../../../../base/common/strings.js';
import * as glob from '../../../../base/common/glob.js';
import * as paths from '../../../../base/common/paths.js';
import * as resources from '../../../../base/common/resources.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { untildify } from '../../../../base/common/labels.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { getExcludes, pathIncludedInQuery } from '../../../../platform/search/common/search.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
var QueryBuilder = /** @class */ (function () {
    function QueryBuilder(configurationService, workspaceContextService, environmentService) {
        this.configurationService = configurationService;
        this.workspaceContextService = workspaceContextService;
        this.environmentService = environmentService;
    }
    QueryBuilder.prototype.text = function (contentPattern, folderResources, options) {
        return this.query(2 /* Text */, contentPattern, folderResources, options);
    };
    QueryBuilder.prototype.file = function (folderResources, options) {
        return this.query(1 /* File */, null, folderResources, options);
    };
    QueryBuilder.prototype.query = function (type, contentPattern, folderResources, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var _a = this.parseSearchPaths(options.includePattern), searchPaths = _a.searchPaths, includePattern = _a.pattern;
        var excludePattern = this.parseExcludePattern(options.excludePattern);
        // Build folderQueries from searchPaths, if given, otherwise folderResources
        var folderQueries = folderResources && folderResources.map(function (uri) { return _this.getFolderQueryForRoot(uri, type === 1 /* File */, options); });
        if (searchPaths && searchPaths.length) {
            var allRootExcludes = folderQueries && this.mergeExcludesFromFolderQueries(folderQueries);
            folderQueries = searchPaths.map(function (searchPath) { return _this.getFolderQueryForSearchPath(searchPath); });
            if (allRootExcludes) {
                excludePattern = objects.mixin(excludePattern || Object.create(null), allRootExcludes);
            }
        }
        // TODO@rob - see #37998
        var useIgnoreFiles = !folderResources || folderResources.every(function (folder) {
            var folderConfig = _this.configurationService.getValue({ resource: folder });
            return folderConfig.search.useIgnoreFiles;
        });
        var useRipgrep = !folderResources || folderResources.every(function (folder) {
            var folderConfig = _this.configurationService.getValue({ resource: folder });
            return folderConfig.search.useRipgrep;
        });
        var ignoreSymlinks = !this.configurationService.getValue().search.followSymlinks;
        if (contentPattern) {
            this.resolveSmartCaseToCaseSensitive(contentPattern);
            contentPattern.wordSeparators = this.configurationService.getValue().editor.wordSeparators;
        }
        var query = {
            type: type,
            folderQueries: folderQueries,
            usingSearchPaths: !!(searchPaths && searchPaths.length),
            extraFileResources: options.extraFileResources,
            filePattern: options.filePattern
                ? options.filePattern.trim()
                : options.filePattern,
            excludePattern: excludePattern,
            includePattern: includePattern,
            maxResults: options.maxResults,
            sortByScore: options.sortByScore,
            cacheKey: options.cacheKey,
            contentPattern: contentPattern,
            useRipgrep: useRipgrep,
            disregardIgnoreFiles: options.disregardIgnoreFiles || !useIgnoreFiles,
            disregardExcludeSettings: options.disregardExcludeSettings,
            ignoreSymlinks: ignoreSymlinks,
            previewOptions: options.previewOptions,
            exists: options.exists
        };
        // Filter extraFileResources against global include/exclude patterns - they are already expected to not belong to a workspace
        var extraFileResources = options.extraFileResources && options.extraFileResources.filter(function (extraFile) { return pathIncludedInQuery(query, extraFile.fsPath); });
        query.extraFileResources = extraFileResources && extraFileResources.length ? extraFileResources : undefined;
        return query;
    };
    /**
     * Fix the isCaseSensitive flag based on the query and the isSmartCase flag, for search providers that don't support smart case natively.
     */
    QueryBuilder.prototype.resolveSmartCaseToCaseSensitive = function (contentPattern) {
        if (contentPattern.isSmartCase) {
            if (contentPattern.isRegExp) {
                // Consider it case sensitive if it contains an unescaped capital letter
                if (strings.containsUppercaseCharacter(contentPattern.pattern, true)) {
                    contentPattern.isCaseSensitive = true;
                }
            }
            else if (strings.containsUppercaseCharacter(contentPattern.pattern)) {
                contentPattern.isCaseSensitive = true;
            }
        }
    };
    /**
     * Take the includePattern as seen in the search viewlet, and split into components that look like searchPaths, and
     * glob patterns. Glob patterns are expanded from 'foo/bar' to '{foo/bar/**, **\/foo/bar}.
     *
     * Public for test.
     */
    QueryBuilder.prototype.parseSearchPaths = function (pattern) {
        var _this = this;
        var isSearchPath = function (segment) {
            // A segment is a search path if it is an absolute path or starts with ./, ../, .\, or ..\
            return paths.isAbsolute(segment) || /^\.\.?[\/\\]/.test(segment);
        };
        var segments = splitGlobPattern(pattern)
            .map(function (segment) { return untildify(segment, _this.environmentService.userHome); });
        var groups = collections.groupBy(segments, function (segment) { return isSearchPath(segment) ? 'searchPaths' : 'exprSegments'; });
        var expandedExprSegments = (groups.exprSegments || [])
            .map(function (p) {
            if (p[0] === '.') {
                p = '*' + p; // convert ".js" to "*.js"
            }
            return expandGlobalGlob(p);
        });
        var exprSegments = arrays.flatten(expandedExprSegments);
        var result = {};
        var searchPaths = this.expandSearchPathPatterns(groups.searchPaths);
        if (searchPaths && searchPaths.length) {
            result.searchPaths = searchPaths;
        }
        var includePattern = patternListToIExpression(exprSegments);
        if (includePattern) {
            result.pattern = includePattern;
        }
        return result;
    };
    /**
     * Takes the input from the excludePattern as seen in the searchView. Runs the same algorithm as parseSearchPaths,
     * but the result is a single IExpression that encapsulates all the exclude patterns.
     */
    QueryBuilder.prototype.parseExcludePattern = function (pattern) {
        var result = this.parseSearchPaths(pattern);
        var excludeExpression = glob.getEmptyExpression();
        if (result.pattern) {
            excludeExpression = objects.mixin(excludeExpression, result.pattern);
        }
        if (result.searchPaths) {
            result.searchPaths.forEach(function (searchPath) {
                var excludeFsPath = searchPath.searchPath.fsPath;
                var excludePath = searchPath.pattern ?
                    paths.join(excludeFsPath, searchPath.pattern) :
                    excludeFsPath;
                excludeExpression[excludePath] = true;
            });
        }
        return Object.keys(excludeExpression).length ? excludeExpression : undefined;
    };
    QueryBuilder.prototype.mergeExcludesFromFolderQueries = function (folderQueries) {
        var _this = this;
        var mergedExcludes = folderQueries.reduce(function (merged, fq) {
            if (fq.excludePattern) {
                objects.mixin(merged, _this.getAbsoluteIExpression(fq.excludePattern, fq.folder.fsPath));
            }
            return merged;
        }, Object.create(null));
        // Don't return an empty IExpression
        return Object.keys(mergedExcludes).length ? mergedExcludes : undefined;
    };
    QueryBuilder.prototype.getAbsoluteIExpression = function (expr, root) {
        return Object.keys(expr)
            .reduce(function (absExpr, key) {
            if (expr[key] && !paths.isAbsolute(key)) {
                var absPattern = paths.join(root, key);
                absExpr[absPattern] = expr[key];
            }
            return absExpr;
        }, Object.create(null));
    };
    QueryBuilder.prototype.getExcludesForFolder = function (folderConfig, options) {
        return options.disregardExcludeSettings ?
            undefined :
            getExcludes(folderConfig);
    };
    /**
     * Split search paths (./ or absolute paths in the includePatterns) into absolute paths and globs applied to those paths
     */
    QueryBuilder.prototype.expandSearchPathPatterns = function (searchPaths) {
        var _this = this;
        if (this.workspaceContextService.getWorkbenchState() === 1 /* EMPTY */ || !searchPaths || !searchPaths.length) {
            // No workspace => ignore search paths
            return [];
        }
        var searchPathPatterns = arrays.flatten(searchPaths.map(function (searchPath) {
            // 1 open folder => just resolve the search paths to absolute paths
            var _a = splitGlobFromPath(searchPath), pathPortion = _a.pathPortion, globPortion = _a.globPortion;
            var pathPortions = _this.expandAbsoluteSearchPaths(pathPortion);
            return pathPortions.map(function (searchPath) {
                return {
                    searchPath: searchPath,
                    pattern: globPortion
                };
            });
        }));
        return searchPathPatterns.filter(arrays.uniqueFilter(function (searchPathPattern) { return searchPathPattern.searchPath.toString(); }));
    };
    /**
     * Takes a searchPath like `./a/foo` and expands it to absolute paths for all the workspaces it matches.
     */
    QueryBuilder.prototype.expandAbsoluteSearchPaths = function (searchPath) {
        if (paths.isAbsolute(searchPath)) {
            // Currently only local resources can be searched for with absolute search paths
            return [uri.file(paths.normalize(searchPath))];
        }
        if (this.workspaceContextService.getWorkbenchState() === 2 /* FOLDER */) {
            var workspaceUri = this.workspaceContextService.getWorkspace().folders[0].uri;
            return [resources.joinPath(workspaceUri, searchPath)];
        }
        else if (searchPath === './') {
            return []; // ./ or ./**/foo makes sense for single-folder but not multi-folder workspaces
        }
        else {
            var relativeSearchPathMatch_1 = searchPath.match(/\.[\/\\]([^\/\\]+)([\/\\].+)?/);
            if (relativeSearchPathMatch_1) {
                var searchPathRoot_1 = relativeSearchPathMatch_1[1];
                var matchingRoots = this.workspaceContextService.getWorkspace().folders.filter(function (folder) { return folder.name === searchPathRoot_1; });
                if (matchingRoots.length) {
                    return matchingRoots.map(function (root) {
                        return relativeSearchPathMatch_1[2] ?
                            resources.joinPath(root.uri, relativeSearchPathMatch_1[2]) :
                            root.uri;
                    });
                }
                else {
                    // No root folder with name
                    var searchPathNotFoundError = nls.localize('search.noWorkspaceWithName', "No folder in workspace with name: {0}", searchPathRoot_1);
                    throw new Error(searchPathNotFoundError);
                }
            }
            else {
                // Malformed ./ search path, ignore
            }
        }
        return [];
    };
    QueryBuilder.prototype.getFolderQueryForSearchPath = function (searchPath) {
        var folder = searchPath.searchPath;
        var folderConfig = this.configurationService.getValue({ resource: folder });
        return {
            folder: folder,
            includePattern: searchPath.pattern && patternListToIExpression([searchPath.pattern]),
            fileEncoding: folderConfig.files && folderConfig.files.encoding
        };
    };
    QueryBuilder.prototype.getFolderQueryForRoot = function (folder, perFolderUseIgnoreFiles, options) {
        var folderConfig = this.configurationService.getValue({ resource: folder });
        return {
            folder: folder,
            excludePattern: this.getExcludesForFolder(folderConfig, options),
            fileEncoding: folderConfig.files && folderConfig.files.encoding,
            disregardIgnoreFiles: perFolderUseIgnoreFiles ? !folderConfig.search.useIgnoreFiles : undefined
        };
    };
    QueryBuilder = __decorate([
        __param(0, IConfigurationService),
        __param(1, IWorkspaceContextService),
        __param(2, IEnvironmentService)
    ], QueryBuilder);
    return QueryBuilder;
}());
export { QueryBuilder };
function splitGlobFromPath(searchPath) {
    var globCharMatch = searchPath.match(/[\*\{\}\(\)\[\]\?]/);
    if (globCharMatch) {
        var globCharIdx = globCharMatch.index;
        var lastSlashMatch = searchPath.substr(0, globCharIdx).match(/[/|\\][^/\\]*$/);
        if (lastSlashMatch) {
            var pathPortion = searchPath.substr(0, lastSlashMatch.index);
            if (!pathPortion.match(/[/\\]/)) {
                // If the last slash was the only slash, then we now have '' or 'C:'. Append a slash.
                pathPortion += '/';
            }
            return {
                pathPortion: pathPortion,
                globPortion: searchPath.substr(lastSlashMatch.index + 1)
            };
        }
    }
    // No glob char, or malformed
    return {
        pathPortion: searchPath
    };
}
function patternListToIExpression(patterns) {
    return patterns.length ?
        patterns.reduce(function (glob, cur) { glob[cur] = true; return glob; }, Object.create(null)) :
        undefined;
}
function splitGlobPattern(pattern) {
    return glob.splitGlobAware(pattern, ',')
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return !!s.length; });
}
/**
 * Note - we used {} here previously but ripgrep can't handle nested {} patterns. See https://github.com/Microsoft/vscode/issues/32761
 */
function expandGlobalGlob(pattern) {
    var patterns = [
        "**/" + pattern + "/**",
        "**/" + pattern
    ];
    return patterns.map(function (p) { return p.replace(/\*\*\/\*\*/g, '**'); });
}
