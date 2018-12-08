/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as childProcess from '../../../../../child_process.js';
import * as fs from '../../../../../fs.js';
import * as path from '../../../../../path.js';
import { StringDecoder } from '../../../../../string_decoder.js';
import * as arrays from '../../../../base/common/arrays.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as glob from '../../../../base/common/glob.js';
import * as normalization from '../../../../base/common/normalization.js';
import * as objects from '../../../../base/common/objects.js';
import { isEqualOrParent } from '../../../../base/common/paths.js';
import * as platform from '../../../../base/common/platform.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import * as strings from '../../../../base/common/strings.js';
import * as types from '../../../../base/common/types.js';
import * as extfs from '../../../../base/node/extfs.js';
import * as flow from '../../../../base/node/flow.js';
import { spawnRipgrepCmd } from './ripgrepFileSearch.js';
var Traversal;
(function (Traversal) {
    Traversal[Traversal["Node"] = 1] = "Node";
    Traversal[Traversal["MacFind"] = 2] = "MacFind";
    Traversal[Traversal["LinuxFind"] = 3] = "LinuxFind";
    Traversal[Traversal["Ripgrep"] = 4] = "Ripgrep";
})(Traversal || (Traversal = {}));
var killCmds = new Set();
process.on('exit', function () {
    killCmds.forEach(function (cmd) { return cmd(); });
});
var FileWalker = /** @class */ (function () {
    function FileWalker(config, maxFileSize) {
        var _this = this;
        this.config = config;
        this.useRipgrep = config.useRipgrep !== false;
        this.filePattern = config.filePattern;
        this.includePattern = config.includePattern && glob.parse(config.includePattern);
        this.maxResults = config.maxResults || null;
        this.exists = config.exists;
        this.maxFilesize = maxFileSize || null;
        this.walkedPaths = Object.create(null);
        this.resultCount = 0;
        this.isLimitHit = false;
        this.directoriesWalked = 0;
        this.filesWalked = 0;
        this.traversal = Traversal.Node;
        this.errors = [];
        if (this.filePattern) {
            this.normalizedFilePatternLowercase = strings.stripWildcards(this.filePattern).toLowerCase();
        }
        this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
        this.folderExcludePatterns = new Map();
        config.folderQueries.forEach(function (folderQuery) {
            var folderExcludeExpression = objects.assign({}, folderQuery.excludePattern || {}, _this.config.excludePattern || {});
            // Add excludes for other root folders
            var fqPath = folderQuery.folder.fsPath;
            config.folderQueries
                .map(function (rootFolderQuery) { return rootFolderQuery.folder.fsPath; })
                .filter(function (rootFolder) { return rootFolder !== fqPath; })
                .forEach(function (otherRootFolder) {
                // Exclude nested root folders
                if (isEqualOrParent(otherRootFolder, fqPath)) {
                    folderExcludeExpression[path.relative(fqPath, otherRootFolder)] = true;
                }
            });
            _this.folderExcludePatterns.set(fqPath, new AbsoluteAndRelativeParsedExpression(folderExcludeExpression, fqPath));
        });
    }
    FileWalker.prototype.cancel = function () {
        this.isCanceled = true;
    };
    FileWalker.prototype.walk = function (folderQueries, extraFiles, onResult, onMessage, done) {
        var _this = this;
        this.fileWalkSW = StopWatch.create(false);
        // Support that the file pattern is a full path to a file that exists
        if (this.isCanceled) {
            return done(null, this.isLimitHit);
        }
        // For each extra file
        if (extraFiles) {
            extraFiles.forEach(function (extraFilePath) {
                var basename = path.basename(extraFilePath.fsPath);
                if (_this.globalExcludePattern && _this.globalExcludePattern(extraFilePath.fsPath, basename)) {
                    return; // excluded
                }
                // File: Check for match on file pattern and include pattern
                _this.matchFile(onResult, { relativePath: extraFilePath.fsPath /* no workspace relative path */, basename: basename });
            });
        }
        var traverse = this.nodeJSTraversal;
        if (!this.maxFilesize) {
            if (this.useRipgrep) {
                this.traversal = Traversal.Ripgrep;
                traverse = this.cmdTraversal;
            }
            else if (platform.isMacintosh) {
                this.traversal = Traversal.MacFind;
                traverse = this.cmdTraversal;
            }
            else if (platform.isLinux) {
                this.traversal = Traversal.LinuxFind;
                traverse = this.cmdTraversal;
            }
        }
        var isNodeTraversal = traverse === this.nodeJSTraversal;
        if (!isNodeTraversal) {
            this.cmdSW = StopWatch.create(false);
        }
        // For each root folder
        flow.parallel(folderQueries, function (folderQuery, rootFolderDone) {
            _this.call(traverse, _this, folderQuery, onResult, onMessage, function (err) {
                if (err) {
                    var errorMessage = toErrorMessage(err);
                    console.error(errorMessage);
                    _this.errors.push(errorMessage);
                    rootFolderDone(err, undefined);
                }
                else {
                    rootFolderDone(undefined, undefined);
                }
            });
        }, function (errors, result) {
            _this.fileWalkSW.stop();
            var err = errors ? errors.filter(function (e) { return !!e; })[0] : null;
            done(err, _this.isLimitHit);
        });
    };
    FileWalker.prototype.call = function (fun, that) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        try {
            fun.apply(that, args);
        }
        catch (e) {
            args[args.length - 1](e);
        }
    };
    FileWalker.prototype.cmdTraversal = function (folderQuery, onResult, onMessage, cb) {
        var _this = this;
        var rootFolder = folderQuery.folder.fsPath;
        var isMac = platform.isMacintosh;
        var cmd;
        var killCmd = function () { return cmd && cmd.kill(); };
        killCmds.add(killCmd);
        var done = function (err) {
            killCmds.delete(killCmd);
            done = function () { };
            cb(err);
        };
        var leftover = '';
        var first = true;
        var tree = this.initDirectoryTree();
        var useRipgrep = this.useRipgrep;
        var noSiblingsClauses;
        if (useRipgrep) {
            var ripgrep = spawnRipgrepCmd(this.config, folderQuery, this.config.includePattern, this.folderExcludePatterns.get(folderQuery.folder.fsPath).expression);
            cmd = ripgrep.cmd;
            noSiblingsClauses = !Object.keys(ripgrep.siblingClauses).length;
            var escapedArgs = ripgrep.rgArgs.args
                .map(function (arg) { return arg.match(/^-/) ? arg : "'" + arg + "'"; })
                .join(' ');
            var rgCmd = "rg " + escapedArgs + "\n - cwd: " + ripgrep.cwd;
            if (ripgrep.rgArgs.siblingClauses) {
                rgCmd += "\n - Sibling clauses: " + JSON.stringify(ripgrep.rgArgs.siblingClauses);
            }
            onMessage({ message: rgCmd });
        }
        else {
            cmd = this.spawnFindCmd(folderQuery);
        }
        this.cmdResultCount = 0;
        this.collectStdout(cmd, 'utf8', useRipgrep, onMessage, function (err, stdout, last) {
            if (err) {
                done(err);
                return;
            }
            if (_this.isLimitHit) {
                done();
                return;
            }
            // Mac: uses NFD unicode form on disk, but we want NFC
            var normalized = leftover + (isMac ? normalization.normalizeNFC(stdout) : stdout);
            var relativeFiles = normalized.split(useRipgrep ? '\n' : '\n./');
            if (!useRipgrep && first && normalized.length >= 2) {
                first = false;
                relativeFiles[0] = relativeFiles[0].trim().substr(2);
            }
            if (last) {
                var n = relativeFiles.length;
                relativeFiles[n - 1] = relativeFiles[n - 1].trim();
                if (!relativeFiles[n - 1]) {
                    relativeFiles.pop();
                }
            }
            else {
                leftover = relativeFiles.pop();
            }
            if (relativeFiles.length && relativeFiles[0].indexOf('\n') !== -1) {
                done(new Error('Splitting up files failed'));
                return;
            }
            _this.cmdResultCount += relativeFiles.length;
            if (useRipgrep && noSiblingsClauses) {
                for (var _i = 0, relativeFiles_1 = relativeFiles; _i < relativeFiles_1.length; _i++) {
                    var relativePath = relativeFiles_1[_i];
                    var basename = path.basename(relativePath);
                    _this.matchFile(onResult, { base: rootFolder, relativePath: relativePath, basename: basename });
                    if (_this.isLimitHit) {
                        killCmd();
                        break;
                    }
                }
                if (last || _this.isLimitHit) {
                    done();
                }
                return;
            }
            // TODO: Optimize siblings clauses with ripgrep here.
            _this.addDirectoryEntries(tree, rootFolder, relativeFiles, onResult);
            if (last) {
                _this.matchDirectoryTree(tree, rootFolder, onResult);
                done();
            }
        });
    };
    /**
     * Public for testing.
     */
    FileWalker.prototype.spawnFindCmd = function (folderQuery) {
        var excludePattern = this.folderExcludePatterns.get(folderQuery.folder.fsPath);
        var basenames = excludePattern.getBasenameTerms();
        var pathTerms = excludePattern.getPathTerms();
        var args = ['-L', '.'];
        if (basenames.length || pathTerms.length) {
            args.push('-not', '(', '(');
            for (var _i = 0, basenames_1 = basenames; _i < basenames_1.length; _i++) {
                var basename = basenames_1[_i];
                args.push('-name', basename);
                args.push('-o');
            }
            for (var _a = 0, pathTerms_1 = pathTerms; _a < pathTerms_1.length; _a++) {
                var path_1 = pathTerms_1[_a];
                args.push('-path', path_1);
                args.push('-o');
            }
            args.pop();
            args.push(')', '-prune', ')');
        }
        args.push('-type', 'f');
        return childProcess.spawn('find', args, { cwd: folderQuery.folder.fsPath });
    };
    /**
     * Public for testing.
     */
    FileWalker.prototype.readStdout = function (cmd, encoding, isRipgrep, cb) {
        var all = '';
        this.collectStdout(cmd, encoding, isRipgrep, function () { }, function (err, stdout, last) {
            if (err) {
                cb(err);
                return;
            }
            all += stdout;
            if (last) {
                cb(null, all);
            }
        });
    };
    FileWalker.prototype.collectStdout = function (cmd, encoding, isRipgrep, onMessage, cb) {
        var _this = this;
        var onData = function (err, stdout, last) {
            if (err || last) {
                onData = function () { };
                if (_this.cmdSW) {
                    _this.cmdSW.stop();
                }
            }
            cb(err, stdout, last);
        };
        var gotData = false;
        if (cmd.stdout) {
            // Should be non-null, but #38195
            this.forwardData(cmd.stdout, encoding, onData);
            cmd.stdout.once('data', function () { return gotData = true; });
        }
        else {
            onMessage({ message: 'stdout is null' });
        }
        var stderr;
        if (cmd.stderr) {
            // Should be non-null, but #38195
            stderr = this.collectData(cmd.stderr);
        }
        else {
            onMessage({ message: 'stderr is null' });
        }
        cmd.on('error', function (err) {
            onData(err);
        });
        cmd.on('close', function (code) {
            // ripgrep returns code=1 when no results are found
            var stderrText;
            if (isRipgrep ? (!gotData && (stderrText = _this.decodeData(stderr, encoding)) && rgErrorMsgForDisplay(stderrText)) : code !== 0) {
                onData(new Error("command failed with error code " + code + ": " + _this.decodeData(stderr, encoding)));
            }
            else {
                if (isRipgrep && _this.exists && code === 0) {
                    _this.isLimitHit = true;
                }
                onData(null, '', true);
            }
        });
    };
    FileWalker.prototype.forwardData = function (stream, encoding, cb) {
        var decoder = new StringDecoder(encoding);
        stream.on('data', function (data) {
            cb(null, decoder.write(data));
        });
        return decoder;
    };
    FileWalker.prototype.collectData = function (stream) {
        var buffers = [];
        stream.on('data', function (data) {
            buffers.push(data);
        });
        return buffers;
    };
    FileWalker.prototype.decodeData = function (buffers, encoding) {
        var decoder = new StringDecoder(encoding);
        return buffers.map(function (buffer) { return decoder.write(buffer); }).join('');
    };
    FileWalker.prototype.initDirectoryTree = function () {
        var tree = {
            rootEntries: [],
            pathToEntries: Object.create(null)
        };
        tree.pathToEntries['.'] = tree.rootEntries;
        return tree;
    };
    FileWalker.prototype.addDirectoryEntries = function (_a, base, relativeFiles, onResult) {
        var pathToEntries = _a.pathToEntries;
        // Support relative paths to files from a root resource (ignores excludes)
        if (relativeFiles.indexOf(this.filePattern) !== -1) {
            var basename = path.basename(this.filePattern);
            this.matchFile(onResult, { base: base, relativePath: this.filePattern, basename: basename });
        }
        function add(relativePath) {
            var basename = path.basename(relativePath);
            var dirname = path.dirname(relativePath);
            var entries = pathToEntries[dirname];
            if (!entries) {
                entries = pathToEntries[dirname] = [];
                add(dirname);
            }
            entries.push({
                base: base,
                relativePath: relativePath,
                basename: basename
            });
        }
        relativeFiles.forEach(add);
    };
    FileWalker.prototype.matchDirectoryTree = function (_a, rootFolder, onResult) {
        var rootEntries = _a.rootEntries, pathToEntries = _a.pathToEntries;
        var self = this;
        var excludePattern = this.folderExcludePatterns.get(rootFolder);
        var filePattern = this.filePattern;
        function matchDirectory(entries) {
            self.directoriesWalked++;
            var hasSibling = glob.hasSiblingFn(function () { return entries.map(function (entry) { return entry.basename; }); });
            for (var i = 0, n = entries.length; i < n; i++) {
                var entry = entries[i];
                var relativePath = entry.relativePath, basename = entry.basename;
                // Check exclude pattern
                // If the user searches for the exact file name, we adjust the glob matching
                // to ignore filtering by siblings because the user seems to know what she
                // is searching for and we want to include the result in that case anyway
                if (excludePattern.test(relativePath, basename, filePattern !== basename ? hasSibling : undefined)) {
                    continue;
                }
                var sub = pathToEntries[relativePath];
                if (sub) {
                    matchDirectory(sub);
                }
                else {
                    self.filesWalked++;
                    if (relativePath === filePattern) {
                        continue; // ignore file if its path matches with the file pattern because that is already matched above
                    }
                    self.matchFile(onResult, entry);
                }
                if (self.isLimitHit) {
                    break;
                }
            }
        }
        matchDirectory(rootEntries);
    };
    FileWalker.prototype.nodeJSTraversal = function (folderQuery, onResult, onMessage, done) {
        var _this = this;
        this.directoriesWalked++;
        extfs.readdir(folderQuery.folder.fsPath, function (error, files) {
            if (error || _this.isCanceled || _this.isLimitHit) {
                return done();
            }
            if (_this.isCanceled || _this.isLimitHit) {
                return done();
            }
            return _this.doWalk(folderQuery, '', files, onResult, done);
        });
    };
    FileWalker.prototype.getStats = function () {
        return {
            cmdTime: this.cmdSW && this.cmdSW.elapsed(),
            fileWalkTime: this.fileWalkSW.elapsed(),
            traversal: Traversal[this.traversal],
            directoriesWalked: this.directoriesWalked,
            filesWalked: this.filesWalked,
            cmdResultCount: this.cmdResultCount
        };
    };
    FileWalker.prototype.doWalk = function (folderQuery, relativeParentPath, files, onResult, done) {
        var _this = this;
        var rootFolder = folderQuery.folder;
        // Execute tasks on each file in parallel to optimize throughput
        var hasSibling = glob.hasSiblingFn(function () { return files; });
        flow.parallel(files, function (file, clb) {
            // Check canceled
            if (_this.isCanceled || _this.isLimitHit) {
                return clb(null, undefined);
            }
            // Check exclude pattern
            // If the user searches for the exact file name, we adjust the glob matching
            // to ignore filtering by siblings because the user seems to know what she
            // is searching for and we want to include the result in that case anyway
            var currentRelativePath = relativeParentPath ? [relativeParentPath, file].join(path.sep) : file;
            if (_this.folderExcludePatterns.get(folderQuery.folder.fsPath).test(currentRelativePath, file, _this.config.filePattern !== file ? hasSibling : undefined)) {
                return clb(null, undefined);
            }
            // Use lstat to detect links
            var currentAbsolutePath = [rootFolder.fsPath, currentRelativePath].join(path.sep);
            fs.lstat(currentAbsolutePath, function (error, lstat) {
                if (error || _this.isCanceled || _this.isLimitHit) {
                    return clb(null, undefined);
                }
                // If the path is a link, we must instead use fs.stat() to find out if the
                // link is a directory or not because lstat will always return the stat of
                // the link which is always a file.
                _this.statLinkIfNeeded(currentAbsolutePath, lstat, function (error, stat) {
                    if (error || _this.isCanceled || _this.isLimitHit) {
                        return clb(null, undefined);
                    }
                    // Directory: Follow directories
                    if (stat.isDirectory()) {
                        _this.directoriesWalked++;
                        // to really prevent loops with links we need to resolve the real path of them
                        return _this.realPathIfNeeded(currentAbsolutePath, lstat, function (error, realpath) {
                            if (error || _this.isCanceled || _this.isLimitHit) {
                                return clb(null, undefined);
                            }
                            if (_this.walkedPaths[realpath]) {
                                return clb(null, undefined); // escape when there are cycles (can happen with symlinks)
                            }
                            _this.walkedPaths[realpath] = true; // remember as walked
                            // Continue walking
                            return extfs.readdir(currentAbsolutePath, function (error, children) {
                                if (error || _this.isCanceled || _this.isLimitHit) {
                                    return clb(null, undefined);
                                }
                                _this.doWalk(folderQuery, currentRelativePath, children, onResult, function (err) { return clb(err, undefined); });
                            });
                        });
                    }
                    // File: Check for match on file pattern and include pattern
                    else {
                        _this.filesWalked++;
                        if (currentRelativePath === _this.filePattern) {
                            return clb(null, undefined); // ignore file if its path matches with the file pattern because checkFilePatternRelativeMatch() takes care of those
                        }
                        if (_this.maxFilesize && types.isNumber(stat.size) && stat.size > _this.maxFilesize) {
                            return clb(null, undefined); // ignore file if max file size is hit
                        }
                        _this.matchFile(onResult, { base: rootFolder.fsPath, relativePath: currentRelativePath, basename: file, size: stat.size });
                    }
                    // Unwind
                    return clb(null, undefined);
                });
            });
        }, function (error) {
            if (error) {
                error = arrays.coalesce(error); // find any error by removing null values first
            }
            return done(error && error.length > 0 ? error[0] : null);
        });
    };
    FileWalker.prototype.matchFile = function (onResult, candidate) {
        if (this.isFilePatternMatch(candidate.relativePath) && (!this.includePattern || this.includePattern(candidate.relativePath, candidate.basename))) {
            this.resultCount++;
            if (this.exists || (this.maxResults && this.resultCount > this.maxResults)) {
                this.isLimitHit = true;
            }
            if (!this.isLimitHit) {
                onResult(candidate);
            }
        }
    };
    FileWalker.prototype.isFilePatternMatch = function (path) {
        // Check for search pattern
        if (this.filePattern) {
            if (this.filePattern === '*') {
                return true; // support the all-matching wildcard
            }
            return strings.fuzzyContains(path, this.normalizedFilePatternLowercase);
        }
        // No patterns means we match all
        return true;
    };
    FileWalker.prototype.statLinkIfNeeded = function (path, lstat, clb) {
        if (lstat.isSymbolicLink()) {
            return fs.stat(path, clb); // stat the target the link points to
        }
        return clb(null, lstat); // not a link, so the stat is already ok for us
    };
    FileWalker.prototype.realPathIfNeeded = function (path, lstat, clb) {
        if (lstat.isSymbolicLink()) {
            return fs.realpath(path, function (error, realpath) {
                if (error) {
                    return clb(error);
                }
                return clb(null, realpath);
            });
        }
        return clb(null, path);
    };
    return FileWalker;
}());
export { FileWalker };
var Engine = /** @class */ (function () {
    function Engine(config) {
        this.folderQueries = config.folderQueries;
        this.extraFiles = config.extraFileResources;
        this.walker = new FileWalker(config);
    }
    Engine.prototype.search = function (onResult, onProgress, done) {
        var _this = this;
        this.walker.walk(this.folderQueries, this.extraFiles, onResult, onProgress, function (err, isLimitHit) {
            done(err, {
                limitHit: isLimitHit,
                stats: _this.walker.getStats()
            });
        });
    };
    Engine.prototype.cancel = function () {
        this.walker.cancel();
    };
    return Engine;
}());
export { Engine };
/**
 * This class exists to provide one interface on top of two ParsedExpressions, one for absolute expressions and one for relative expressions.
 * The absolute and relative expressions don't "have" to be kept separate, but this keeps us from having to path.join every single
 * file searched, it's only used for a text search with a searchPath
 */
var AbsoluteAndRelativeParsedExpression = /** @class */ (function () {
    function AbsoluteAndRelativeParsedExpression(expression, root) {
        this.expression = expression;
        this.root = root;
        this.init(expression);
    }
    /**
     * Split the IExpression into its absolute and relative components, and glob.parse them separately.
     */
    AbsoluteAndRelativeParsedExpression.prototype.init = function (expr) {
        var absoluteGlobExpr;
        var relativeGlobExpr;
        Object.keys(expr)
            .filter(function (key) { return expr[key]; })
            .forEach(function (key) {
            if (path.isAbsolute(key)) {
                absoluteGlobExpr = absoluteGlobExpr || glob.getEmptyExpression();
                absoluteGlobExpr[key] = expr[key];
            }
            else {
                relativeGlobExpr = relativeGlobExpr || glob.getEmptyExpression();
                relativeGlobExpr[key] = expr[key];
            }
        });
        this.absoluteParsedExpr = absoluteGlobExpr && glob.parse(absoluteGlobExpr, { trimForExclusions: true });
        this.relativeParsedExpr = relativeGlobExpr && glob.parse(relativeGlobExpr, { trimForExclusions: true });
    };
    AbsoluteAndRelativeParsedExpression.prototype.test = function (_path, basename, hasSibling) {
        return (this.relativeParsedExpr && this.relativeParsedExpr(_path, basename, hasSibling)) ||
            (this.absoluteParsedExpr && this.absoluteParsedExpr(path.join(this.root, _path), basename, hasSibling));
    };
    AbsoluteAndRelativeParsedExpression.prototype.getBasenameTerms = function () {
        var basenameTerms = [];
        if (this.absoluteParsedExpr) {
            basenameTerms.push.apply(basenameTerms, glob.getBasenameTerms(this.absoluteParsedExpr));
        }
        if (this.relativeParsedExpr) {
            basenameTerms.push.apply(basenameTerms, glob.getBasenameTerms(this.relativeParsedExpr));
        }
        return basenameTerms;
    };
    AbsoluteAndRelativeParsedExpression.prototype.getPathTerms = function () {
        var pathTerms = [];
        if (this.absoluteParsedExpr) {
            pathTerms.push.apply(pathTerms, glob.getPathTerms(this.absoluteParsedExpr));
        }
        if (this.relativeParsedExpr) {
            pathTerms.push.apply(pathTerms, glob.getPathTerms(this.relativeParsedExpr));
        }
        return pathTerms;
    };
    return AbsoluteAndRelativeParsedExpression;
}());
export function rgErrorMsgForDisplay(msg) {
    var lines = msg.trim().split('\n');
    var firstLine = lines[0].trim();
    if (strings.startsWith(firstLine, 'Error parsing regex')) {
        return firstLine;
    }
    if (strings.startsWith(firstLine, 'regex parse error')) {
        return strings.uppercaseFirstLetter(lines[lines.length - 1].trim());
    }
    if (strings.startsWith(firstLine, 'error parsing glob') ||
        strings.startsWith(firstLine, 'unsupported encoding')) {
        // Uppercase first letter
        return firstLine.charAt(0).toUpperCase() + firstLine.substr(1);
    }
    if (firstLine === "Literal '\\n' not allowed.") {
        // I won't localize this because none of the Ripgrep error messages are localized
        return "Literal '\\n' currently not supported";
    }
    if (strings.startsWith(firstLine, 'Literal ')) {
        // Other unsupported chars
        return firstLine;
    }
    return undefined;
}
