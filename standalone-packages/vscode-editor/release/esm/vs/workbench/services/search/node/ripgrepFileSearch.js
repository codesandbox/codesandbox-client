/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as cp from '../../../../../child_process.js';
import * as path from '../../../../../path.js';
import { normalizeNFD } from '../../../../base/common/normalization.js';
import * as objects from '../../../../base/common/objects.js';
import * as paths from '../../../../base/common/paths.js';
import { isMacintosh as isMac } from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { anchorGlob } from './ripgrepSearchUtils.js';
import { rgPath } from '../../../../../vscode-ripgrep.js';
// If vscode-ripgrep is in an .asar file, then the binary is unpacked.
var rgDiskPath = rgPath.replace(/\bnode_modules\.asar\b/, 'node_modules.asar.unpacked');
export function spawnRipgrepCmd(config, folderQuery, includePattern, excludePattern) {
    var rgArgs = getRgArgs(config, folderQuery, includePattern, excludePattern);
    var cwd = folderQuery.folder.fsPath;
    return {
        cmd: cp.spawn(rgDiskPath, rgArgs.args, { cwd: cwd }),
        siblingClauses: rgArgs.siblingClauses,
        rgArgs: rgArgs,
        cwd: cwd
    };
}
function getRgArgs(config, folderQuery, includePattern, excludePattern) {
    var args = ['--files', '--hidden', '--case-sensitive'];
    // includePattern can't have siblingClauses
    foldersToIncludeGlobs([folderQuery], includePattern, false).forEach(function (globArg) {
        var inclusion = anchorGlob(globArg);
        args.push('-g', inclusion);
        if (isMac) {
            var normalized = normalizeNFD(inclusion);
            if (normalized !== inclusion) {
                args.push('-g', normalized);
            }
        }
    });
    var siblingClauses;
    var rgGlobs = foldersToRgExcludeGlobs([folderQuery], excludePattern, undefined, false);
    rgGlobs.globArgs.forEach(function (globArg) {
        var exclusion = "!" + anchorGlob(globArg);
        args.push('-g', exclusion);
        if (isMac) {
            var normalized = normalizeNFD(exclusion);
            if (normalized !== exclusion) {
                args.push('-g', normalized);
            }
        }
    });
    siblingClauses = rgGlobs.siblingClauses;
    if (folderQuery.disregardIgnoreFiles !== false) {
        // Don't use .gitignore or .ignore
        args.push('--no-ignore');
    }
    else {
        args.push('--no-ignore-parent');
    }
    // Follow symlinks
    if (!folderQuery.ignoreSymlinks) {
        args.push('--follow');
    }
    if (config.exists) {
        args.push('--quiet');
    }
    args.push('--no-config');
    if (folderQuery.disregardGlobalIgnoreFiles) {
        args.push('--no-ignore-global');
    }
    return { args: args, siblingClauses: siblingClauses };
}
export function foldersToRgExcludeGlobs(folderQueries, globalExclude, excludesToSkip, absoluteGlobs) {
    if (absoluteGlobs === void 0) { absoluteGlobs = true; }
    var globArgs = [];
    var siblingClauses = {};
    folderQueries.forEach(function (folderQuery) {
        var totalExcludePattern = objects.assign({}, folderQuery.excludePattern || {}, globalExclude || {});
        var result = globExprsToRgGlobs(totalExcludePattern, absoluteGlobs ? folderQuery.folder.fsPath : undefined, excludesToSkip);
        globArgs.push.apply(globArgs, result.globArgs);
        if (result.siblingClauses) {
            siblingClauses = objects.assign(siblingClauses, result.siblingClauses);
        }
    });
    return { globArgs: globArgs, siblingClauses: siblingClauses };
}
export function foldersToIncludeGlobs(folderQueries, globalInclude, absoluteGlobs) {
    if (absoluteGlobs === void 0) { absoluteGlobs = true; }
    var globArgs = [];
    folderQueries.forEach(function (folderQuery) {
        var totalIncludePattern = objects.assign({}, globalInclude || {}, folderQuery.includePattern || {});
        var result = globExprsToRgGlobs(totalIncludePattern, absoluteGlobs ? folderQuery.folder.fsPath : undefined);
        globArgs.push.apply(globArgs, result.globArgs);
    });
    return globArgs;
}
function globExprsToRgGlobs(patterns, folder, excludesToSkip) {
    var globArgs = [];
    var siblingClauses = null;
    Object.keys(patterns)
        .forEach(function (key) {
        if (excludesToSkip && excludesToSkip.has(key)) {
            return;
        }
        if (!key) {
            return;
        }
        var value = patterns[key];
        key = trimTrailingSlash(folder ? getAbsoluteGlob(folder, key) : key);
        // glob.ts requires forward slashes, but a UNC path still must start with \\
        // #38165 and #38151
        if (strings.startsWith(key, '\\\\')) {
            key = '\\\\' + key.substr(2).replace(/\\/g, '/');
        }
        else {
            key = key.replace(/\\/g, '/');
        }
        if (typeof value === 'boolean' && value) {
            if (strings.startsWith(key, '\\\\')) {
                // Absolute globs UNC paths don't work properly, see #58758
                key += '**';
            }
            globArgs.push(fixDriveC(key));
        }
        else if (value && value.when) {
            if (!siblingClauses) {
                siblingClauses = {};
            }
            siblingClauses[key] = value;
        }
    });
    return { globArgs: globArgs, siblingClauses: siblingClauses };
}
/**
 * Resolves a glob like "node_modules/**" in "/foo/bar" to "/foo/bar/node_modules/**".
 * Special cases C:/foo paths to write the glob like /foo instead - see https://github.com/BurntSushi/ripgrep/issues/530.
 *
 * Exported for testing
 */
export function getAbsoluteGlob(folder, key) {
    return paths.isAbsolute(key) ?
        key :
        path.join(folder, key);
}
function trimTrailingSlash(str) {
    str = strings.rtrim(str, '\\');
    return strings.rtrim(str, '/');
}
export function fixDriveC(path) {
    var root = paths.getRoot(path);
    return root.toLowerCase() === 'c:/' ?
        path.replace(/^c:[/\\]/i, '/') :
        path;
}
