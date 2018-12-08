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
import * as cp from '../../../../../child_process.js';
import { EventEmitter } from '../../../../../events.js';
import * as path from '../../../../../path.js';
import { StringDecoder } from '../../../../../string_decoder.js';
import { createRegExp, startsWith, startsWithUTF8BOM, stripUTF8BOM } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { SearchError, SearchErrorCode, serializeSearchError } from '../../../../platform/search/common/search.js';
import { rgPath } from '../../../../../vscode-ripgrep.js';
import { anchorGlob, createTextSearchResult, Range } from './ripgrepSearchUtils.js';
// If vscode-ripgrep is in an .asar file, then the binary is unpacked.
var rgDiskPath = rgPath.replace(/\bnode_modules\.asar\b/, 'node_modules.asar.unpacked');
var RipgrepTextSearchEngine = /** @class */ (function () {
    function RipgrepTextSearchEngine(outputChannel) {
        this.outputChannel = outputChannel;
    }
    RipgrepTextSearchEngine.prototype.provideTextSearchResults = function (query, options, progress, token) {
        var _this = this;
        this.outputChannel.appendLine("provideTextSearchResults " + query.pattern + ", " + JSON.stringify(__assign({}, options, {
            folder: options.folder.toString()
        })));
        return new Promise(function (resolve, reject) {
            token.onCancellationRequested(function () { return cancel(); });
            var rgArgs = getRgArgs(query, options);
            var cwd = options.folder.fsPath;
            var escapedArgs = rgArgs
                .map(function (arg) { return arg.match(/^-/) ? arg : "'" + arg + "'"; })
                .join(' ');
            _this.outputChannel.appendLine("rg " + escapedArgs + "\n - cwd: " + cwd);
            var rgProc = cp.spawn(rgDiskPath, rgArgs, { cwd: cwd });
            rgProc.on('error', function (e) {
                console.error(e);
                _this.outputChannel.appendLine('Error: ' + (e && e.message));
                reject(serializeSearchError(new SearchError(e && e.message, SearchErrorCode.rgProcessError)));
            });
            var gotResult = false;
            var ripgrepParser = new RipgrepParser(options.maxResults, cwd, options.previewOptions);
            ripgrepParser.on('result', function (match) {
                gotResult = true;
                progress.report(match);
            });
            var isDone = false;
            var cancel = function () {
                isDone = true;
                if (rgProc) {
                    rgProc.kill();
                }
                if (ripgrepParser) {
                    ripgrepParser.cancel();
                }
            };
            var limitHit = false;
            ripgrepParser.on('hitLimit', function () {
                limitHit = true;
                cancel();
            });
            rgProc.stdout.on('data', function (data) {
                ripgrepParser.handleData(data);
            });
            var gotData = false;
            rgProc.stdout.once('data', function () { return gotData = true; });
            var stderr = '';
            rgProc.stderr.on('data', function (data) {
                var message = data.toString();
                _this.outputChannel.appendLine(message);
                stderr += message;
            });
            rgProc.on('close', function () {
                _this.outputChannel.appendLine(gotData ? 'Got data from stdout' : 'No data from stdout');
                _this.outputChannel.appendLine(gotResult ? 'Got result from parser' : 'No result from parser');
                _this.outputChannel.appendLine('');
                if (isDone) {
                    resolve({ limitHit: limitHit });
                }
                else {
                    // Trigger last result
                    ripgrepParser.flush();
                    rgProc = null;
                    var searchError = void 0;
                    if (stderr && !gotData && (searchError = rgErrorMsgForDisplay(stderr))) {
                        reject(serializeSearchError(new SearchError(searchError.message, searchError.code)));
                    }
                    else {
                        resolve({ limitHit: limitHit });
                    }
                }
            });
        });
    };
    return RipgrepTextSearchEngine;
}());
export { RipgrepTextSearchEngine };
/**
 * Read the first line of stderr and return an error for display or undefined, based on a whitelist.
 * Ripgrep produces stderr output which is not from a fatal error, and we only want the search to be
 * "failed" when a fatal error was produced.
 */
export function rgErrorMsgForDisplay(msg) {
    var firstLine = msg.split('\n')[0].trim();
    if (startsWith(firstLine, 'regex parse error')) {
        return new SearchError('Regex parse error', SearchErrorCode.regexParseError);
    }
    var match = firstLine.match(/grep config error: unknown encoding: (.*)/);
    if (match) {
        return new SearchError("Unknown encoding: " + match[1], SearchErrorCode.unknownEncoding);
    }
    if (startsWith(firstLine, 'error parsing glob')) {
        // Uppercase first letter
        return new SearchError(firstLine.charAt(0).toUpperCase() + firstLine.substr(1), SearchErrorCode.globParseError);
    }
    if (startsWith(firstLine, 'the literal')) {
        // Uppercase first letter
        return new SearchError(firstLine.charAt(0).toUpperCase() + firstLine.substr(1), SearchErrorCode.invalidLiteral);
    }
    return undefined;
}
var RipgrepParser = /** @class */ (function (_super) {
    __extends(RipgrepParser, _super);
    function RipgrepParser(maxResults, rootFolder, previewOptions) {
        var _this = _super.call(this) || this;
        _this.maxResults = maxResults;
        _this.rootFolder = rootFolder;
        _this.previewOptions = previewOptions;
        _this.remainder = '';
        _this.isDone = false;
        _this.hitLimit = false;
        _this.numResults = 0;
        _this.stringDecoder = new StringDecoder();
        return _this;
    }
    RipgrepParser.prototype.cancel = function () {
        this.isDone = true;
    };
    RipgrepParser.prototype.flush = function () {
        this.handleDecodedData(this.stringDecoder.end());
    };
    RipgrepParser.prototype.handleData = function (data) {
        var dataStr = typeof data === 'string' ? data : this.stringDecoder.write(data);
        this.handleDecodedData(dataStr);
    };
    RipgrepParser.prototype.handleDecodedData = function (decodedData) {
        // If the previous data chunk didn't end in a newline, prepend it to this chunk
        var dataStr = this.remainder ?
            this.remainder + decodedData :
            decodedData;
        var dataLines = dataStr.split(/\r\n|\n/);
        this.remainder = dataLines[dataLines.length - 1] ? dataLines.pop() : '';
        for (var l = 0; l < dataLines.length; l++) {
            var line = dataLines[l];
            if (line) { // Empty line at the end of each chunk
                this.handleLine(line);
            }
        }
    };
    RipgrepParser.prototype.handleLine = function (outputLine) {
        var _this = this;
        if (this.isDone) {
            return;
        }
        var parsedLine;
        try {
            parsedLine = JSON.parse(outputLine);
        }
        catch (e) {
            throw new Error("malformed line from rg: " + outputLine);
        }
        if (parsedLine.type === 'match') {
            var matchPath = bytesOrTextToString(parsedLine.data.path);
            var uri = URI.file(path.join(this.rootFolder, matchPath));
            var result = this.createTextSearchMatch(parsedLine.data, uri);
            this.onResult(result);
            if (this.hitLimit) {
                this.cancel();
                this.emit('hitLimit');
            }
        }
        else if (parsedLine.type === 'context') {
            var contextPath = bytesOrTextToString(parsedLine.data.path);
            var uri = URI.file(path.join(this.rootFolder, contextPath));
            var result = this.createTextSearchContext(parsedLine.data, uri);
            result.forEach(function (r) { return _this.onResult(r); });
        }
    };
    RipgrepParser.prototype.createTextSearchMatch = function (data, uri) {
        var _this = this;
        var lineNumber = data.line_number - 1;
        var fullText = bytesOrTextToString(data.lines);
        var fullTextBytes = Buffer.from(fullText);
        var prevMatchEnd = 0;
        var prevMatchEndCol = 0;
        var prevMatchEndLine = lineNumber;
        var ranges = data.submatches.map(function (match, i) {
            if (_this.hitLimit) {
                return null;
            }
            _this.numResults++;
            if (_this.numResults >= _this.maxResults) {
                // Finish the line, then report the result below
                _this.hitLimit = true;
            }
            var matchText = bytesOrTextToString(match.match);
            var inBetweenChars = fullTextBytes.slice(prevMatchEnd, match.start).toString().length;
            var startCol = prevMatchEndCol + inBetweenChars;
            var stats = getNumLinesAndLastNewlineLength(matchText);
            var startLineNumber = prevMatchEndLine;
            var endLineNumber = stats.numLines + startLineNumber;
            var endCol = stats.numLines > 0 ?
                stats.lastLineLength :
                stats.lastLineLength + startCol;
            if (lineNumber === 0 && i === 0 && startsWithUTF8BOM(matchText)) {
                matchText = stripUTF8BOM(matchText);
                startCol -= 3;
                endCol -= 3;
            }
            prevMatchEnd = match.end;
            prevMatchEndCol = endCol;
            prevMatchEndLine = endLineNumber;
            return new Range(startLineNumber, startCol, endLineNumber, endCol);
        })
            .filter(function (r) { return !!r; });
        return createTextSearchResult(uri, fullText, ranges, this.previewOptions);
    };
    RipgrepParser.prototype.createTextSearchContext = function (data, uri) {
        var text = bytesOrTextToString(data.lines);
        var startLine = data.line_number;
        return text
            .replace(/\r?\n$/, '')
            .split('\n')
            .map(function (line, i) {
            return {
                text: line,
                uri: uri,
                lineNumber: startLine + i
            };
        });
    };
    RipgrepParser.prototype.onResult = function (match) {
        this.emit('result', match);
    };
    return RipgrepParser;
}(EventEmitter));
export { RipgrepParser };
function bytesOrTextToString(obj) {
    return obj.bytes ?
        Buffer.from(obj.bytes, 'base64').toString() :
        obj.text;
}
function getNumLinesAndLastNewlineLength(text) {
    var re = /\n/g;
    var numLines = 0;
    var lastNewlineIdx = -1;
    var match;
    while (match = re.exec(text)) {
        numLines++;
        lastNewlineIdx = match.index;
    }
    var lastLineLength = lastNewlineIdx >= 0 ?
        text.length - lastNewlineIdx - 1 :
        text.length;
    return { numLines: numLines, lastLineLength: lastLineLength };
}
function getRgArgs(query, options) {
    var args = ['--hidden'];
    args.push(query.isCaseSensitive ? '--case-sensitive' : '--ignore-case');
    options.includes
        .map(anchorGlob)
        .forEach(function (globArg) { return args.push('-g', globArg); });
    options.excludes
        .map(anchorGlob)
        .forEach(function (rgGlob) { return args.push('-g', "!" + rgGlob); });
    if (options.maxFileSize) {
        args.push('--max-filesize', options.maxFileSize + '');
    }
    if (options.useIgnoreFiles) {
        args.push('--no-ignore-parent');
    }
    else {
        // Don't use .gitignore or .ignore
        args.push('--no-ignore');
    }
    if (options.followSymlinks) {
        args.push('--follow');
    }
    if (options.encoding && options.encoding !== 'utf8') {
        args.push('--encoding', options.encoding);
    }
    var pattern = query.pattern;
    // Ripgrep handles -- as a -- arg separator. Only --.
    // - is ok, --- is ok, --some-flag is also ok. Need to special case.
    if (pattern === '--') {
        query.isRegExp = true;
        pattern = '\\-\\-';
    }
    if (options.usePCRE2) {
        args.push('--pcre2');
        if (query.isRegExp) {
            pattern = unicodeEscapesToPCRE2(pattern);
        }
    }
    var searchPatternAfterDoubleDashes;
    if (query.isWordMatch) {
        var regexp = createRegExp(pattern, !!query.isRegExp, { wholeWord: query.isWordMatch });
        var regexpStr = regexp.source.replace(/\\\//g, '/'); // RegExp.source arbitrarily returns escaped slashes. Search and destroy.
        args.push('--regexp', regexpStr);
    }
    else if (query.isRegExp) {
        var fixedRegexpQuery = fixRegexEndingPattern(query.pattern);
        fixedRegexpQuery = fixRegexNewline(fixedRegexpQuery);
        fixedRegexpQuery = fixRegexCRMatchingNonWordClass(fixedRegexpQuery, !!query.isMultiline);
        fixedRegexpQuery = fixRegexCRMatchingWhitespaceClass(fixedRegexpQuery, !!query.isMultiline);
        args.push('--regexp', fixedRegexpQuery);
    }
    else {
        searchPatternAfterDoubleDashes = pattern;
        args.push('--fixed-strings');
    }
    args.push('--no-config');
    if (!options.useGlobalIgnoreFiles) {
        args.push('--no-ignore-global');
    }
    args.push('--json');
    if (query.isMultiline) {
        args.push('--multiline');
    }
    if (options.beforeContext) {
        args.push('--before-context', options.beforeContext + '');
    }
    if (options.afterContext) {
        args.push('--after-context', options.afterContext + '');
    }
    // Folder to search
    args.push('--');
    if (searchPatternAfterDoubleDashes) {
        // Put the query after --, in case the query starts with a dash
        args.push(searchPatternAfterDoubleDashes);
    }
    args.push('.');
    return args;
}
export function unicodeEscapesToPCRE2(pattern) {
    var reg = /((?:[^\\]|^)(?:\\\\)*)\\u([a-z0-9]{4})(?!\d)/g;
    // Replace an unescaped $ at the end of the pattern with \r?$
    // Match $ preceeded by none or even number of literal \
    while (pattern.match(reg)) {
        pattern = pattern.replace(reg, "$1\\x{$2}");
    }
    return pattern;
}
export function fixRegexEndingPattern(pattern) {
    // Replace an unescaped $ at the end of the pattern with \r?$
    // Match $ preceeded by none or even number of literal \
    return pattern.match(/([^\\]|^)(\\\\)*\$$/) ?
        pattern.replace(/\$$/, '\\r?$') :
        pattern;
}
export function fixRegexNewline(pattern) {
    // Replace an unescaped $ at the end of the pattern with \r?$
    // Match $ preceeded by none or even number of literal \
    return pattern.replace(/([^\\]|^)(\\\\)*\\n/g, '$1$2\\r?\\n');
}
export function fixRegexCRMatchingWhitespaceClass(pattern, isMultiline) {
    return isMultiline ?
        pattern.replace(/([^\\]|^)((?:\\\\)*)\\s/g, '$1$2(\\r?\\n|[^\\S\\r])') :
        pattern.replace(/([^\\]|^)((?:\\\\)*)\\s/g, '$1$2[ \\t\\f]');
}
export function fixRegexCRMatchingNonWordClass(pattern, isMultiline) {
    return isMultiline ?
        pattern.replace(/([^\\]|^)((?:\\\\)*)\\W/g, '$1$2(\\r?\\n|[^\\w\\r])') :
        pattern.replace(/([^\\]|^)((?:\\\\)*)\\W/g, '$1$2[^\\w\\r]');
}
