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
import { localize } from '../../../../nls';
import * as Objects from '../../../../base/common/objects';
import * as Strings from '../../../../base/common/strings';
import * as Assert from '../../../../base/common/assert';
import * as Paths from '../../../../base/common/paths';
import * as Types from '../../../../base/common/types';
import * as UUID from '../../../../base/common/uuid';
import * as Platform from '../../../../base/common/platform';
import Severity from '../../../../base/common/severity';
import { URI } from '../../../../base/common/uri';
import { TPromise } from '../../../../base/common/winjs.base';
import { ValidationStatus, Parser } from '../../../../base/common/parsers';
import { MarkerSeverity } from '../../../../platform/markers/common/markers';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry';
export var FileLocationKind;
(function (FileLocationKind) {
    FileLocationKind[FileLocationKind["Auto"] = 0] = "Auto";
    FileLocationKind[FileLocationKind["Relative"] = 1] = "Relative";
    FileLocationKind[FileLocationKind["Absolute"] = 2] = "Absolute";
})(FileLocationKind || (FileLocationKind = {}));
(function (FileLocationKind) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'absolute') {
            return FileLocationKind.Absolute;
        }
        else if (value === 'relative') {
            return FileLocationKind.Relative;
        }
        else {
            return undefined;
        }
    }
    FileLocationKind.fromString = fromString;
})(FileLocationKind || (FileLocationKind = {}));
export var ProblemLocationKind;
(function (ProblemLocationKind) {
    ProblemLocationKind[ProblemLocationKind["File"] = 0] = "File";
    ProblemLocationKind[ProblemLocationKind["Location"] = 1] = "Location";
})(ProblemLocationKind || (ProblemLocationKind = {}));
(function (ProblemLocationKind) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'file') {
            return ProblemLocationKind.File;
        }
        else if (value === 'location') {
            return ProblemLocationKind.Location;
        }
        else {
            return undefined;
        }
    }
    ProblemLocationKind.fromString = fromString;
})(ProblemLocationKind || (ProblemLocationKind = {}));
export var ApplyToKind;
(function (ApplyToKind) {
    ApplyToKind[ApplyToKind["allDocuments"] = 0] = "allDocuments";
    ApplyToKind[ApplyToKind["openDocuments"] = 1] = "openDocuments";
    ApplyToKind[ApplyToKind["closedDocuments"] = 2] = "closedDocuments";
})(ApplyToKind || (ApplyToKind = {}));
(function (ApplyToKind) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'alldocuments') {
            return ApplyToKind.allDocuments;
        }
        else if (value === 'opendocuments') {
            return ApplyToKind.openDocuments;
        }
        else if (value === 'closeddocuments') {
            return ApplyToKind.closedDocuments;
        }
        else {
            return undefined;
        }
    }
    ApplyToKind.fromString = fromString;
})(ApplyToKind || (ApplyToKind = {}));
export function isNamedProblemMatcher(value) {
    return value && Types.isString(value.name) ? true : false;
}
export function getResource(filename, matcher) {
    var kind = matcher.fileLocation;
    var fullPath;
    if (kind === FileLocationKind.Absolute) {
        fullPath = filename;
    }
    else if (kind === FileLocationKind.Relative) {
        fullPath = Paths.join(matcher.filePrefix, filename);
    }
    fullPath = fullPath.replace(/\\/g, '/');
    if (fullPath[0] !== '/') {
        fullPath = '/' + fullPath;
    }
    if (matcher.uriProvider !== void 0) {
        return matcher.uriProvider(fullPath);
    }
    else {
        return URI.file(fullPath);
    }
}
export function createLineMatcher(matcher) {
    var pattern = matcher.pattern;
    if (Types.isArray(pattern)) {
        return new MultiLineMatcher(matcher);
    }
    else {
        return new SingleLineMatcher(matcher);
    }
}
var endOfLine = Platform.OS === 1 /* Windows */ ? '\r\n' : '\n';
var AbstractLineMatcher = /** @class */ (function () {
    function AbstractLineMatcher(matcher) {
        this.matcher = matcher;
    }
    AbstractLineMatcher.prototype.handle = function (lines, start) {
        if (start === void 0) { start = 0; }
        return { match: null, continue: false };
    };
    AbstractLineMatcher.prototype.next = function (line) {
        return null;
    };
    AbstractLineMatcher.prototype.fillProblemData = function (data, pattern, matches) {
        this.fillProperty(data, 'file', pattern, matches, true);
        this.appendProperty(data, 'message', pattern, matches, true);
        this.fillProperty(data, 'code', pattern, matches, true);
        this.fillProperty(data, 'severity', pattern, matches, true);
        this.fillProperty(data, 'location', pattern, matches, true);
        this.fillProperty(data, 'line', pattern, matches);
        this.fillProperty(data, 'character', pattern, matches);
        this.fillProperty(data, 'endLine', pattern, matches);
        this.fillProperty(data, 'endCharacter', pattern, matches);
    };
    AbstractLineMatcher.prototype.appendProperty = function (data, property, pattern, matches, trim) {
        if (trim === void 0) { trim = false; }
        if (Types.isUndefined(data[property])) {
            this.fillProperty(data, property, pattern, matches, trim);
        }
        else if (!Types.isUndefined(pattern[property]) && pattern[property] < matches.length) {
            var value = matches[pattern[property]];
            if (trim) {
                value = Strings.trim(value);
            }
            data[property] += endOfLine + value;
        }
    };
    AbstractLineMatcher.prototype.fillProperty = function (data, property, pattern, matches, trim) {
        if (trim === void 0) { trim = false; }
        if (Types.isUndefined(data[property]) && !Types.isUndefined(pattern[property]) && pattern[property] < matches.length) {
            var value = matches[pattern[property]];
            if (value !== void 0) {
                if (trim) {
                    value = Strings.trim(value);
                }
                data[property] = value;
            }
        }
    };
    AbstractLineMatcher.prototype.getMarkerMatch = function (data) {
        try {
            var location_1 = this.getLocation(data);
            if (data.file && location_1 && data.message) {
                var marker = {
                    severity: this.getSeverity(data),
                    startLineNumber: location_1.startLineNumber,
                    startColumn: location_1.startCharacter,
                    endLineNumber: location_1.startLineNumber,
                    endColumn: location_1.endCharacter,
                    message: data.message
                };
                if (data.code !== void 0) {
                    marker.code = data.code;
                }
                if (this.matcher.source !== void 0) {
                    marker.source = this.matcher.source;
                }
                return {
                    description: this.matcher,
                    resource: this.getResource(data.file),
                    marker: marker
                };
            }
        }
        catch (err) {
            console.error("Failed to convert problem data into match: " + JSON.stringify(data));
        }
        return undefined;
    };
    AbstractLineMatcher.prototype.getResource = function (filename) {
        return getResource(filename, this.matcher);
    };
    AbstractLineMatcher.prototype.getLocation = function (data) {
        if (data.kind === ProblemLocationKind.File) {
            return this.createLocation(0, 0, 0, 0);
        }
        if (data.location) {
            return this.parseLocationInfo(data.location);
        }
        if (!data.line) {
            return null;
        }
        var startLine = parseInt(data.line);
        var startColumn = data.character ? parseInt(data.character) : undefined;
        var endLine = data.endLine ? parseInt(data.endLine) : undefined;
        var endColumn = data.endCharacter ? parseInt(data.endCharacter) : undefined;
        return this.createLocation(startLine, startColumn, endLine, endColumn);
    };
    AbstractLineMatcher.prototype.parseLocationInfo = function (value) {
        if (!value || !value.match(/(\d+|\d+,\d+|\d+,\d+,\d+,\d+)/)) {
            return null;
        }
        var parts = value.split(',');
        var startLine = parseInt(parts[0]);
        var startColumn = parts.length > 1 ? parseInt(parts[1]) : undefined;
        if (parts.length > 3) {
            return this.createLocation(startLine, startColumn, parseInt(parts[2]), parseInt(parts[3]));
        }
        else {
            return this.createLocation(startLine, startColumn, undefined, undefined);
        }
    };
    AbstractLineMatcher.prototype.createLocation = function (startLine, startColumn, endLine, endColumn) {
        if (startLine && startColumn && endColumn) {
            return { startLineNumber: startLine, startCharacter: startColumn, endLineNumber: endLine || startLine, endCharacter: endColumn };
        }
        if (startLine && startColumn) {
            return { startLineNumber: startLine, startCharacter: startColumn, endLineNumber: startLine, endCharacter: startColumn };
        }
        return { startLineNumber: startLine, startCharacter: 1, endLineNumber: startLine, endCharacter: Number.MAX_VALUE };
    };
    AbstractLineMatcher.prototype.getSeverity = function (data) {
        var result = null;
        if (data.severity) {
            var value = data.severity;
            if (value) {
                result = Severity.fromValue(value);
                if (result === Severity.Ignore) {
                    if (value === 'E') {
                        result = Severity.Error;
                    }
                    else if (value === 'W') {
                        result = Severity.Warning;
                    }
                    else if (value === 'I') {
                        result = Severity.Info;
                    }
                    else if (Strings.equalsIgnoreCase(value, 'hint')) {
                        result = Severity.Info;
                    }
                    else if (Strings.equalsIgnoreCase(value, 'note')) {
                        result = Severity.Info;
                    }
                }
            }
        }
        if (result === null || result === Severity.Ignore) {
            result = this.matcher.severity || Severity.Error;
        }
        return MarkerSeverity.fromSeverity(result);
    };
    return AbstractLineMatcher;
}());
var SingleLineMatcher = /** @class */ (function (_super) {
    __extends(SingleLineMatcher, _super);
    function SingleLineMatcher(matcher) {
        var _this = _super.call(this, matcher) || this;
        _this.pattern = matcher.pattern;
        return _this;
    }
    Object.defineProperty(SingleLineMatcher.prototype, "matchLength", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    SingleLineMatcher.prototype.handle = function (lines, start) {
        if (start === void 0) { start = 0; }
        Assert.ok(lines.length - start === 1);
        var data = Object.create(null);
        if (this.pattern.kind !== void 0) {
            data.kind = this.pattern.kind;
        }
        var matches = this.pattern.regexp.exec(lines[start]);
        if (matches) {
            this.fillProblemData(data, this.pattern, matches);
            var match = this.getMarkerMatch(data);
            if (match) {
                return { match: match, continue: false };
            }
        }
        return { match: null, continue: false };
    };
    SingleLineMatcher.prototype.next = function (line) {
        return null;
    };
    return SingleLineMatcher;
}(AbstractLineMatcher));
var MultiLineMatcher = /** @class */ (function (_super) {
    __extends(MultiLineMatcher, _super);
    function MultiLineMatcher(matcher) {
        var _this = _super.call(this, matcher) || this;
        _this.patterns = matcher.pattern;
        return _this;
    }
    Object.defineProperty(MultiLineMatcher.prototype, "matchLength", {
        get: function () {
            return this.patterns.length;
        },
        enumerable: true,
        configurable: true
    });
    MultiLineMatcher.prototype.handle = function (lines, start) {
        if (start === void 0) { start = 0; }
        Assert.ok(lines.length - start === this.patterns.length);
        this.data = Object.create(null);
        var data = this.data;
        data.kind = this.patterns[0].kind;
        for (var i = 0; i < this.patterns.length; i++) {
            var pattern = this.patterns[i];
            var matches = pattern.regexp.exec(lines[i + start]);
            if (!matches) {
                return { match: null, continue: false };
            }
            else {
                // Only the last pattern can loop
                if (pattern.loop && i === this.patterns.length - 1) {
                    data = Objects.deepClone(data);
                }
                this.fillProblemData(data, pattern, matches);
            }
        }
        var loop = this.patterns[this.patterns.length - 1].loop;
        if (!loop) {
            this.data = null;
        }
        return { match: this.getMarkerMatch(data), continue: loop };
    };
    MultiLineMatcher.prototype.next = function (line) {
        var pattern = this.patterns[this.patterns.length - 1];
        Assert.ok(pattern.loop === true && this.data !== null);
        var matches = pattern.regexp.exec(line);
        if (!matches) {
            this.data = null;
            return null;
        }
        var data = Objects.deepClone(this.data);
        this.fillProblemData(data, pattern, matches);
        return this.getMarkerMatch(data);
    };
    return MultiLineMatcher;
}(AbstractLineMatcher));
export var Config;
(function (Config) {
    var NamedProblemPattern;
    (function (NamedProblemPattern) {
        function is(value) {
            var candidate = value;
            return candidate && Types.isString(candidate.name);
        }
        NamedProblemPattern.is = is;
    })(NamedProblemPattern = Config.NamedProblemPattern || (Config.NamedProblemPattern = {}));
    var MultiLineProblemPattern;
    (function (MultiLineProblemPattern) {
        function is(value) {
            return value && Types.isArray(value);
        }
        MultiLineProblemPattern.is = is;
    })(MultiLineProblemPattern = Config.MultiLineProblemPattern || (Config.MultiLineProblemPattern = {}));
    var NamedMultiLineProblemPattern;
    (function (NamedMultiLineProblemPattern) {
        function is(value) {
            var candidate = value;
            return candidate && Types.isString(candidate.name) && Types.isArray(candidate.patterns);
        }
        NamedMultiLineProblemPattern.is = is;
    })(NamedMultiLineProblemPattern = Config.NamedMultiLineProblemPattern || (Config.NamedMultiLineProblemPattern = {}));
    function isNamedProblemMatcher(value) {
        return Types.isString(value.name);
    }
    Config.isNamedProblemMatcher = isNamedProblemMatcher;
})(Config || (Config = {}));
var ProblemPatternParser = /** @class */ (function (_super) {
    __extends(ProblemPatternParser, _super);
    function ProblemPatternParser(logger) {
        return _super.call(this, logger) || this;
    }
    ProblemPatternParser.prototype.parse = function (value) {
        if (Config.NamedMultiLineProblemPattern.is(value)) {
            return this.createNamedMultiLineProblemPattern(value);
        }
        else if (Config.MultiLineProblemPattern.is(value)) {
            return this.createMultiLineProblemPattern(value);
        }
        else if (Config.NamedProblemPattern.is(value)) {
            var result = this.createSingleProblemPattern(value);
            result.name = value.name;
            return result;
        }
        else if (value) {
            return this.createSingleProblemPattern(value);
        }
        else {
            return null;
        }
    };
    ProblemPatternParser.prototype.createSingleProblemPattern = function (value) {
        var result = this.doCreateSingleProblemPattern(value, true);
        if (result.kind === undefined) {
            result.kind = ProblemLocationKind.Location;
        }
        return this.validateProblemPattern([result]) ? result : null;
    };
    ProblemPatternParser.prototype.createNamedMultiLineProblemPattern = function (value) {
        var result = {
            name: value.name,
            label: value.label ? value.label : value.name,
            patterns: this.createMultiLineProblemPattern(value.patterns)
        };
        return result.patterns ? result : null;
    };
    ProblemPatternParser.prototype.createMultiLineProblemPattern = function (values) {
        var result = [];
        for (var i = 0; i < values.length; i++) {
            var pattern = this.doCreateSingleProblemPattern(values[i], false);
            if (i < values.length - 1) {
                if (!Types.isUndefined(pattern.loop) && pattern.loop) {
                    pattern.loop = false;
                    this.error(localize('ProblemPatternParser.loopProperty.notLast', 'The loop property is only supported on the last line matcher.'));
                }
            }
            result.push(pattern);
        }
        if (result[0].kind === undefined) {
            result[0].kind = ProblemLocationKind.Location;
        }
        return this.validateProblemPattern(result) ? result : null;
    };
    ProblemPatternParser.prototype.doCreateSingleProblemPattern = function (value, setDefaults) {
        var result = {
            regexp: this.createRegularExpression(value.regexp),
        };
        if (value.kind) {
            result.kind = ProblemLocationKind.fromString(value.kind);
        }
        function copyProperty(result, source, resultKey, sourceKey) {
            var value = source[sourceKey];
            if (typeof value === 'number') {
                result[resultKey] = value;
            }
        }
        copyProperty(result, value, 'file', 'file');
        copyProperty(result, value, 'location', 'location');
        copyProperty(result, value, 'line', 'line');
        copyProperty(result, value, 'character', 'column');
        copyProperty(result, value, 'endLine', 'endLine');
        copyProperty(result, value, 'endCharacter', 'endColumn');
        copyProperty(result, value, 'severity', 'severity');
        copyProperty(result, value, 'code', 'code');
        copyProperty(result, value, 'message', 'message');
        if (value.loop === true || value.loop === false) {
            result.loop = value.loop;
        }
        if (setDefaults) {
            if (result.location || result.kind === ProblemLocationKind.File) {
                var defaultValue = {
                    file: 1,
                    message: 0
                };
                result = Objects.mixin(result, defaultValue, false);
            }
            else {
                var defaultValue = {
                    file: 1,
                    line: 2,
                    character: 3,
                    message: 0
                };
                result = Objects.mixin(result, defaultValue, false);
            }
        }
        return result;
    };
    ProblemPatternParser.prototype.validateProblemPattern = function (values) {
        var _this = this;
        var file, message, location, line;
        var regexp = 0;
        var locationKind = (values[0].kind === undefined) ? ProblemLocationKind.Location : values[0].kind;
        values.forEach(function (pattern, i) {
            if (i !== 0 && pattern.kind) {
                _this.error(localize('ProblemPatternParser.problemPattern.kindProperty.notFirst', 'The problem pattern is invalid. The kind property must be provided only in the first element'));
            }
            file = file || !Types.isUndefined(pattern.file);
            message = message || !Types.isUndefined(pattern.message);
            location = location || !Types.isUndefined(pattern.location);
            line = line || !Types.isUndefined(pattern.line);
            if (pattern.regexp) {
                regexp++;
            }
        });
        if (regexp !== values.length) {
            this.error(localize('ProblemPatternParser.problemPattern.missingRegExp', 'The problem pattern is missing a regular expression.'));
            return false;
        }
        if (!(file && message)) {
            this.error(localize('ProblemPatternParser.problemPattern.missingProperty', 'The problem pattern is invalid. It must have at least have a file and a message.'));
            return false;
        }
        if (locationKind === ProblemLocationKind.Location && !(location || line)) {
            this.error(localize('ProblemPatternParser.problemPattern.missingLocation', 'The problem pattern is invalid. It must either have kind: "file" or have a line or location match group.'));
            return false;
        }
        return true;
    };
    ProblemPatternParser.prototype.createRegularExpression = function (value) {
        var result = null;
        if (!value) {
            return result;
        }
        try {
            result = new RegExp(value);
        }
        catch (err) {
            this.error(localize('ProblemPatternParser.invalidRegexp', 'Error: The string {0} is not a valid regular expression.\n', value));
        }
        return result;
    };
    return ProblemPatternParser;
}(Parser));
export { ProblemPatternParser };
var ExtensionRegistryReporter = /** @class */ (function () {
    function ExtensionRegistryReporter(_collector, _validationStatus) {
        if (_validationStatus === void 0) { _validationStatus = new ValidationStatus(); }
        this._collector = _collector;
        this._validationStatus = _validationStatus;
    }
    ExtensionRegistryReporter.prototype.info = function (message) {
        this._validationStatus.state = 1 /* Info */;
        this._collector.info(message);
    };
    ExtensionRegistryReporter.prototype.warn = function (message) {
        this._validationStatus.state = 2 /* Warning */;
        this._collector.warn(message);
    };
    ExtensionRegistryReporter.prototype.error = function (message) {
        this._validationStatus.state = 3 /* Error */;
        this._collector.error(message);
    };
    ExtensionRegistryReporter.prototype.fatal = function (message) {
        this._validationStatus.state = 4 /* Fatal */;
        this._collector.error(message);
    };
    Object.defineProperty(ExtensionRegistryReporter.prototype, "status", {
        get: function () {
            return this._validationStatus;
        },
        enumerable: true,
        configurable: true
    });
    return ExtensionRegistryReporter;
}());
export { ExtensionRegistryReporter };
export var Schemas;
(function (Schemas) {
    Schemas.ProblemPattern = {
        default: {
            regexp: '^([^\\\\s].*)\\\\((\\\\d+,\\\\d+)\\\\):\\\\s*(.*)$',
            file: 1,
            location: 2,
            message: 3
        },
        type: 'object',
        additionalProperties: false,
        properties: {
            regexp: {
                type: 'string',
                description: localize('ProblemPatternSchema.regexp', 'The regular expression to find an error, warning or info in the output.')
            },
            kind: {
                type: 'string',
                description: localize('ProblemPatternSchema.kind', 'whether the pattern matches a location (file and line) or only a file.')
            },
            file: {
                type: 'integer',
                description: localize('ProblemPatternSchema.file', 'The match group index of the filename. If omitted 1 is used.')
            },
            location: {
                type: 'integer',
                description: localize('ProblemPatternSchema.location', 'The match group index of the problem\'s location. Valid location patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn). If omitted (line,column) is assumed.')
            },
            line: {
                type: 'integer',
                description: localize('ProblemPatternSchema.line', 'The match group index of the problem\'s line. Defaults to 2')
            },
            column: {
                type: 'integer',
                description: localize('ProblemPatternSchema.column', 'The match group index of the problem\'s line character. Defaults to 3')
            },
            endLine: {
                type: 'integer',
                description: localize('ProblemPatternSchema.endLine', 'The match group index of the problem\'s end line. Defaults to undefined')
            },
            endColumn: {
                type: 'integer',
                description: localize('ProblemPatternSchema.endColumn', 'The match group index of the problem\'s end line character. Defaults to undefined')
            },
            severity: {
                type: 'integer',
                description: localize('ProblemPatternSchema.severity', 'The match group index of the problem\'s severity. Defaults to undefined')
            },
            code: {
                type: 'integer',
                description: localize('ProblemPatternSchema.code', 'The match group index of the problem\'s code. Defaults to undefined')
            },
            message: {
                type: 'integer',
                description: localize('ProblemPatternSchema.message', 'The match group index of the message. If omitted it defaults to 4 if location is specified. Otherwise it defaults to 5.')
            },
            loop: {
                type: 'boolean',
                description: localize('ProblemPatternSchema.loop', 'In a multi line matcher loop indicated whether this pattern is executed in a loop as long as it matches. Can only specified on a last pattern in a multi line pattern.')
            }
        }
    };
    Schemas.NamedProblemPattern = Objects.deepClone(Schemas.ProblemPattern);
    Schemas.NamedProblemPattern.properties = Objects.deepClone(Schemas.NamedProblemPattern.properties);
    Schemas.NamedProblemPattern.properties['name'] = {
        type: 'string',
        description: localize('NamedProblemPatternSchema.name', 'The name of the problem pattern.')
    };
    Schemas.MultiLineProblemPattern = {
        type: 'array',
        items: Schemas.ProblemPattern
    };
    Schemas.NamedMultiLineProblemPattern = {
        type: 'object',
        additionalProperties: false,
        properties: {
            name: {
                type: 'string',
                description: localize('NamedMultiLineProblemPatternSchema.name', 'The name of the problem multi line problem pattern.')
            },
            patterns: {
                type: 'array',
                description: localize('NamedMultiLineProblemPatternSchema.patterns', 'The actual patterns.'),
                items: Schemas.ProblemPattern
            }
        }
    };
})(Schemas || (Schemas = {}));
var problemPatternExtPoint = ExtensionsRegistry.registerExtensionPoint('problemPatterns', [], {
    description: localize('ProblemPatternExtPoint', 'Contributes problem patterns'),
    type: 'array',
    items: {
        anyOf: [
            Schemas.NamedProblemPattern,
            Schemas.NamedMultiLineProblemPattern
        ]
    }
});
var ProblemPatternRegistryImpl = /** @class */ (function () {
    function ProblemPatternRegistryImpl() {
        var _this = this;
        this.patterns = Object.create(null);
        this.fillDefaults();
        this.readyPromise = new TPromise(function (resolve, reject) {
            problemPatternExtPoint.setHandler(function (extensions) {
                // We get all statically know extension during startup in one batch
                try {
                    extensions.forEach(function (extension) {
                        var problemPatterns = extension.value;
                        var parser = new ProblemPatternParser(new ExtensionRegistryReporter(extension.collector));
                        for (var _i = 0, problemPatterns_1 = problemPatterns; _i < problemPatterns_1.length; _i++) {
                            var pattern = problemPatterns_1[_i];
                            if (Config.NamedMultiLineProblemPattern.is(pattern)) {
                                var result = parser.parse(pattern);
                                if (parser.problemReporter.status.state < 3 /* Error */) {
                                    _this.add(result.name, result.patterns);
                                }
                                else {
                                    extension.collector.error(localize('ProblemPatternRegistry.error', 'Invalid problem pattern. The pattern will be ignored.'));
                                    extension.collector.error(JSON.stringify(pattern, undefined, 4));
                                }
                            }
                            else if (Config.NamedProblemPattern.is(pattern)) {
                                var result = parser.parse(pattern);
                                if (parser.problemReporter.status.state < 3 /* Error */) {
                                    _this.add(pattern.name, result);
                                }
                                else {
                                    extension.collector.error(localize('ProblemPatternRegistry.error', 'Invalid problem pattern. The pattern will be ignored.'));
                                    extension.collector.error(JSON.stringify(pattern, undefined, 4));
                                }
                            }
                            parser.reset();
                        }
                    });
                }
                catch (error) {
                    // Do nothing
                }
                resolve(undefined);
            });
        });
    }
    ProblemPatternRegistryImpl.prototype.onReady = function () {
        return this.readyPromise;
    };
    ProblemPatternRegistryImpl.prototype.add = function (key, value) {
        this.patterns[key] = value;
    };
    ProblemPatternRegistryImpl.prototype.get = function (key) {
        return this.patterns[key];
    };
    ProblemPatternRegistryImpl.prototype.fillDefaults = function () {
        this.add('msCompile', {
            regexp: /^(?:\s+\d+\>)?([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\)\s*:\s+(error|warning|info)\s+(\w{1,2}\d+)\s*:\s*(.*)$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('gulp-tsc', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(\d+)\s+(.*)$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            location: 2,
            code: 3,
            message: 4
        });
        this.add('cpp', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(C\d+)\s*:\s*(.*)$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('csc', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(CS\d+)\s*:\s*(.*)$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('vb', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(BC\d+)\s*:\s*(.*)$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('lessCompile', {
            regexp: /^\s*(.*) in file (.*) line no. (\d+)$/,
            kind: ProblemLocationKind.Location,
            message: 1,
            file: 2,
            line: 3
        });
        this.add('jshint', {
            regexp: /^(.*):\s+line\s+(\d+),\s+col\s+(\d+),\s(.+?)(?:\s+\((\w)(\d+)\))?$/,
            kind: ProblemLocationKind.Location,
            file: 1,
            line: 2,
            character: 3,
            message: 4,
            severity: 5,
            code: 6
        });
        this.add('jshint-stylish', [
            {
                regexp: /^(.+)$/,
                kind: ProblemLocationKind.Location,
                file: 1
            },
            {
                regexp: /^\s+line\s+(\d+)\s+col\s+(\d+)\s+(.+?)(?:\s+\((\w)(\d+)\))?$/,
                line: 1,
                character: 2,
                message: 3,
                severity: 4,
                code: 5,
                loop: true
            }
        ]);
        this.add('eslint-compact', {
            regexp: /^(.+):\sline\s(\d+),\scol\s(\d+),\s(Error|Warning|Info)\s-\s(.+)\s\((.+)\)$/,
            file: 1,
            kind: ProblemLocationKind.Location,
            line: 2,
            character: 3,
            severity: 4,
            message: 5,
            code: 6
        });
        this.add('eslint-stylish', [
            {
                regexp: /^([^\s].*)$/,
                kind: ProblemLocationKind.Location,
                file: 1
            },
            {
                regexp: /^\s+(\d+):(\d+)\s+(error|warning|info)\s+(.+?)(?:\s\s+(.*))?$/,
                line: 1,
                character: 2,
                severity: 3,
                message: 4,
                code: 5,
                loop: true
            }
        ]);
        this.add('go', {
            regexp: /^([^:]*: )?((.:)?[^:]*):(\d+)(:(\d+))?: (.*)$/,
            kind: ProblemLocationKind.Location,
            file: 2,
            line: 4,
            character: 6,
            message: 7
        });
    };
    return ProblemPatternRegistryImpl;
}());
export var ProblemPatternRegistry = new ProblemPatternRegistryImpl();
var ProblemMatcherParser = /** @class */ (function (_super) {
    __extends(ProblemMatcherParser, _super);
    function ProblemMatcherParser(logger) {
        return _super.call(this, logger) || this;
    }
    ProblemMatcherParser.prototype.parse = function (json) {
        var result = this.createProblemMatcher(json);
        if (!this.checkProblemMatcherValid(json, result)) {
            return null;
        }
        this.addWatchingMatcher(json, result);
        return result;
    };
    ProblemMatcherParser.prototype.checkProblemMatcherValid = function (externalProblemMatcher, problemMatcher) {
        if (!problemMatcher) {
            this.error(localize('ProblemMatcherParser.noProblemMatcher', 'Error: the description can\'t be converted into a problem matcher:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
            return false;
        }
        if (!problemMatcher.pattern) {
            this.error(localize('ProblemMatcherParser.noProblemPattern', 'Error: the description doesn\'t define a valid problem pattern:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
            return false;
        }
        if (!problemMatcher.owner) {
            this.error(localize('ProblemMatcherParser.noOwner', 'Error: the description doesn\'t define an owner:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
            return false;
        }
        if (Types.isUndefined(problemMatcher.fileLocation)) {
            this.error(localize('ProblemMatcherParser.noFileLocation', 'Error: the description doesn\'t define a file location:\n{0}\n', JSON.stringify(externalProblemMatcher, null, 4)));
            return false;
        }
        return true;
    };
    ProblemMatcherParser.prototype.createProblemMatcher = function (description) {
        var result = null;
        var owner = description.owner ? description.owner : UUID.generateUuid();
        var source = Types.isString(description.source) ? description.source : undefined;
        var applyTo = Types.isString(description.applyTo) ? ApplyToKind.fromString(description.applyTo) : ApplyToKind.allDocuments;
        if (!applyTo) {
            applyTo = ApplyToKind.allDocuments;
        }
        var fileLocation = undefined;
        var filePrefix = undefined;
        var kind;
        if (Types.isUndefined(description.fileLocation)) {
            fileLocation = FileLocationKind.Relative;
            filePrefix = '${workspaceFolder}';
        }
        else if (Types.isString(description.fileLocation)) {
            kind = FileLocationKind.fromString(description.fileLocation);
            if (kind) {
                fileLocation = kind;
                if (kind === FileLocationKind.Relative) {
                    filePrefix = '${workspaceFolder}';
                }
            }
        }
        else if (Types.isStringArray(description.fileLocation)) {
            var values = description.fileLocation;
            if (values.length > 0) {
                kind = FileLocationKind.fromString(values[0]);
                if (values.length === 1 && kind === FileLocationKind.Absolute) {
                    fileLocation = kind;
                }
                else if (values.length === 2 && kind === FileLocationKind.Relative && values[1]) {
                    fileLocation = kind;
                    filePrefix = values[1];
                }
            }
        }
        var pattern = description.pattern ? this.createProblemPattern(description.pattern) : undefined;
        var severity = description.severity ? Severity.fromValue(description.severity) : undefined;
        if (severity === Severity.Ignore) {
            this.info(localize('ProblemMatcherParser.unknownSeverity', 'Info: unknown severity {0}. Valid values are error, warning and info.\n', description.severity));
            severity = Severity.Error;
        }
        if (Types.isString(description.base)) {
            var variableName = description.base;
            if (variableName.length > 1 && variableName[0] === '$') {
                var base = ProblemMatcherRegistry.get(variableName.substring(1));
                if (base) {
                    result = Objects.deepClone(base);
                    if (description.owner) {
                        result.owner = owner;
                    }
                    if (source) {
                        result.source = source;
                    }
                    if (fileLocation) {
                        result.fileLocation = fileLocation;
                    }
                    if (filePrefix) {
                        result.filePrefix = filePrefix;
                    }
                    if (description.pattern) {
                        result.pattern = pattern;
                    }
                    if (description.severity) {
                        result.severity = severity;
                    }
                }
            }
        }
        else if (fileLocation) {
            result = {
                owner: owner,
                applyTo: applyTo,
                fileLocation: fileLocation,
                pattern: pattern,
            };
            if (source) {
                result.source = source;
            }
            if (filePrefix) {
                result.filePrefix = filePrefix;
            }
            if (severity) {
                result.severity = severity;
            }
        }
        if (Config.isNamedProblemMatcher(description)) {
            result.name = description.name;
            result.label = Types.isString(description.label) ? description.label : description.name;
        }
        return result;
    };
    ProblemMatcherParser.prototype.createProblemPattern = function (value) {
        if (Types.isString(value)) {
            var variableName = value;
            if (variableName.length > 1 && variableName[0] === '$') {
                var result = ProblemPatternRegistry.get(variableName.substring(1));
                if (!result) {
                    this.error(localize('ProblemMatcherParser.noDefinedPatter', 'Error: the pattern with the identifier {0} doesn\'t exist.', variableName));
                }
                return result;
            }
            else {
                if (variableName.length === 0) {
                    this.error(localize('ProblemMatcherParser.noIdentifier', 'Error: the pattern property refers to an empty identifier.'));
                }
                else {
                    this.error(localize('ProblemMatcherParser.noValidIdentifier', 'Error: the pattern property {0} is not a valid pattern variable name.', variableName));
                }
            }
        }
        else if (value) {
            var problemPatternParser = new ProblemPatternParser(this.problemReporter);
            if (Array.isArray(value)) {
                return problemPatternParser.parse(value);
            }
            else {
                return problemPatternParser.parse(value);
            }
        }
        return null;
    };
    ProblemMatcherParser.prototype.addWatchingMatcher = function (external, internal) {
        var oldBegins = this.createRegularExpression(external.watchedTaskBeginsRegExp);
        var oldEnds = this.createRegularExpression(external.watchedTaskEndsRegExp);
        if (oldBegins && oldEnds) {
            internal.watching = {
                activeOnStart: false,
                beginsPattern: { regexp: oldBegins },
                endsPattern: { regexp: oldEnds }
            };
            return;
        }
        var backgroundMonitor = external.background || external.watching;
        if (Types.isUndefinedOrNull(backgroundMonitor)) {
            return;
        }
        var begins = this.createWatchingPattern(backgroundMonitor.beginsPattern);
        var ends = this.createWatchingPattern(backgroundMonitor.endsPattern);
        if (begins && ends) {
            internal.watching = {
                activeOnStart: Types.isBoolean(backgroundMonitor.activeOnStart) ? backgroundMonitor.activeOnStart : false,
                beginsPattern: begins,
                endsPattern: ends
            };
            return;
        }
        if (begins || ends) {
            this.error(localize('ProblemMatcherParser.problemPattern.watchingMatcher', 'A problem matcher must define both a begin pattern and an end pattern for watching.'));
        }
    };
    ProblemMatcherParser.prototype.createWatchingPattern = function (external) {
        if (Types.isUndefinedOrNull(external)) {
            return null;
        }
        var regexp;
        var file;
        if (Types.isString(external)) {
            regexp = this.createRegularExpression(external);
        }
        else {
            regexp = this.createRegularExpression(external.regexp);
            if (Types.isNumber(external.file)) {
                file = external.file;
            }
        }
        if (!regexp) {
            return null;
        }
        return file ? { regexp: regexp, file: file } : { regexp: regexp, file: 1 };
    };
    ProblemMatcherParser.prototype.createRegularExpression = function (value) {
        var result = null;
        if (!value) {
            return result;
        }
        try {
            result = new RegExp(value);
        }
        catch (err) {
            this.error(localize('ProblemMatcherParser.invalidRegexp', 'Error: The string {0} is not a valid regular expression.\n', value));
        }
        return result;
    };
    return ProblemMatcherParser;
}(Parser));
export { ProblemMatcherParser };
(function (Schemas) {
    Schemas.WatchingPattern = {
        type: 'object',
        additionalProperties: false,
        properties: {
            regexp: {
                type: 'string',
                description: localize('WatchingPatternSchema.regexp', 'The regular expression to detect the begin or end of a background task.')
            },
            file: {
                type: 'integer',
                description: localize('WatchingPatternSchema.file', 'The match group index of the filename. Can be omitted.')
            },
        }
    };
    Schemas.PatternType = {
        anyOf: [
            {
                type: 'string',
                description: localize('PatternTypeSchema.name', 'The name of a contributed or predefined pattern')
            },
            Schemas.ProblemPattern,
            Schemas.MultiLineProblemPattern
        ],
        description: localize('PatternTypeSchema.description', 'A problem pattern or the name of a contributed or predefined problem pattern. Can be omitted if base is specified.')
    };
    Schemas.ProblemMatcher = {
        type: 'object',
        additionalProperties: false,
        properties: {
            base: {
                type: 'string',
                description: localize('ProblemMatcherSchema.base', 'The name of a base problem matcher to use.')
            },
            owner: {
                type: 'string',
                description: localize('ProblemMatcherSchema.owner', 'The owner of the problem inside Code. Can be omitted if base is specified. Defaults to \'external\' if omitted and base is not specified.')
            },
            source: {
                type: 'string',
                description: localize('ProblemMatcherSchema.source', 'A human-readable string describing the source of this diagnostic, e.g. \'typescript\' or \'super lint\'.')
            },
            severity: {
                type: 'string',
                enum: ['error', 'warning', 'info'],
                description: localize('ProblemMatcherSchema.severity', 'The default severity for captures problems. Is used if the pattern doesn\'t define a match group for severity.')
            },
            applyTo: {
                type: 'string',
                enum: ['allDocuments', 'openDocuments', 'closedDocuments'],
                description: localize('ProblemMatcherSchema.applyTo', 'Controls if a problem reported on a text document is applied only to open, closed or all documents.')
            },
            pattern: Schemas.PatternType,
            fileLocation: {
                oneOf: [
                    {
                        type: 'string',
                        enum: ['absolute', 'relative']
                    },
                    {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                ],
                description: localize('ProblemMatcherSchema.fileLocation', 'Defines how file names reported in a problem pattern should be interpreted.')
            },
            background: {
                type: 'object',
                additionalProperties: false,
                description: localize('ProblemMatcherSchema.background', 'Patterns to track the begin and end of a matcher active on a background task.'),
                properties: {
                    activeOnStart: {
                        type: 'boolean',
                        description: localize('ProblemMatcherSchema.background.activeOnStart', 'If set to true the background monitor is in active mode when the task starts. This is equals of issuing a line that matches the beginPattern')
                    },
                    beginsPattern: {
                        oneOf: [
                            {
                                type: 'string'
                            },
                            Schemas.WatchingPattern
                        ],
                        description: localize('ProblemMatcherSchema.background.beginsPattern', 'If matched in the output the start of a background task is signaled.')
                    },
                    endsPattern: {
                        oneOf: [
                            {
                                type: 'string'
                            },
                            Schemas.WatchingPattern
                        ],
                        description: localize('ProblemMatcherSchema.background.endsPattern', 'If matched in the output the end of a background task is signaled.')
                    }
                }
            },
            watching: {
                type: 'object',
                additionalProperties: false,
                deprecationMessage: localize('ProblemMatcherSchema.watching.deprecated', 'The watching property is deprecated. Use background instead.'),
                description: localize('ProblemMatcherSchema.watching', 'Patterns to track the begin and end of a watching matcher.'),
                properties: {
                    activeOnStart: {
                        type: 'boolean',
                        description: localize('ProblemMatcherSchema.watching.activeOnStart', 'If set to true the watcher is in active mode when the task starts. This is equals of issuing a line that matches the beginPattern')
                    },
                    beginsPattern: {
                        oneOf: [
                            {
                                type: 'string'
                            },
                            Schemas.WatchingPattern
                        ],
                        description: localize('ProblemMatcherSchema.watching.beginsPattern', 'If matched in the output the start of a watching task is signaled.')
                    },
                    endsPattern: {
                        oneOf: [
                            {
                                type: 'string'
                            },
                            Schemas.WatchingPattern
                        ],
                        description: localize('ProblemMatcherSchema.watching.endsPattern', 'If matched in the output the end of a watching task is signaled.')
                    }
                }
            }
        }
    };
    Schemas.LegacyProblemMatcher = Objects.deepClone(Schemas.ProblemMatcher);
    Schemas.LegacyProblemMatcher.properties = Objects.deepClone(Schemas.LegacyProblemMatcher.properties);
    Schemas.LegacyProblemMatcher.properties['watchedTaskBeginsRegExp'] = {
        type: 'string',
        deprecationMessage: localize('LegacyProblemMatcherSchema.watchedBegin.deprecated', 'This property is deprecated. Use the watching property instead.'),
        description: localize('LegacyProblemMatcherSchema.watchedBegin', 'A regular expression signaling that a watched tasks begins executing triggered through file watching.')
    };
    Schemas.LegacyProblemMatcher.properties['watchedTaskEndsRegExp'] = {
        type: 'string',
        deprecationMessage: localize('LegacyProblemMatcherSchema.watchedEnd.deprecated', 'This property is deprecated. Use the watching property instead.'),
        description: localize('LegacyProblemMatcherSchema.watchedEnd', 'A regular expression signaling that a watched tasks ends executing.')
    };
    Schemas.NamedProblemMatcher = Objects.deepClone(Schemas.ProblemMatcher);
    Schemas.NamedProblemMatcher.properties = Objects.deepClone(Schemas.NamedProblemMatcher.properties);
    Schemas.NamedProblemMatcher.properties.name = {
        type: 'string',
        description: localize('NamedProblemMatcherSchema.name', 'The name of the problem matcher used to refer to it.')
    };
    Schemas.NamedProblemMatcher.properties.label = {
        type: 'string',
        description: localize('NamedProblemMatcherSchema.label', 'A human readable label of the problem matcher.')
    };
})(Schemas || (Schemas = {}));
var problemMatchersExtPoint = ExtensionsRegistry.registerExtensionPoint('problemMatchers', [problemPatternExtPoint], {
    description: localize('ProblemMatcherExtPoint', 'Contributes problem matchers'),
    type: 'array',
    items: Schemas.NamedProblemMatcher
});
var ProblemMatcherRegistryImpl = /** @class */ (function () {
    function ProblemMatcherRegistryImpl() {
        var _this = this;
        this.matchers = Object.create(null);
        this.fillDefaults();
        this.readyPromise = new TPromise(function (resolve, reject) {
            problemMatchersExtPoint.setHandler(function (extensions) {
                try {
                    extensions.forEach(function (extension) {
                        var problemMatchers = extension.value;
                        var parser = new ProblemMatcherParser(new ExtensionRegistryReporter(extension.collector));
                        for (var _i = 0, problemMatchers_1 = problemMatchers; _i < problemMatchers_1.length; _i++) {
                            var matcher_1 = problemMatchers_1[_i];
                            var result = parser.parse(matcher_1);
                            if (result && isNamedProblemMatcher(result)) {
                                _this.add(result);
                            }
                        }
                    });
                }
                catch (error) {
                }
                var matcher = _this.get('tsc-watch');
                if (matcher) {
                    matcher.tscWatch = true;
                }
                resolve(undefined);
            });
        });
    }
    ProblemMatcherRegistryImpl.prototype.onReady = function () {
        ProblemPatternRegistry.onReady();
        return this.readyPromise;
    };
    ProblemMatcherRegistryImpl.prototype.add = function (matcher) {
        this.matchers[matcher.name] = matcher;
    };
    ProblemMatcherRegistryImpl.prototype.get = function (name) {
        return this.matchers[name];
    };
    ProblemMatcherRegistryImpl.prototype.keys = function () {
        return Object.keys(this.matchers);
    };
    ProblemMatcherRegistryImpl.prototype.fillDefaults = function () {
        this.add({
            name: 'msCompile',
            label: localize('msCompile', 'Microsoft compiler problems'),
            owner: 'msCompile',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            pattern: ProblemPatternRegistry.get('msCompile')
        });
        this.add({
            name: 'lessCompile',
            label: localize('lessCompile', 'Less problems'),
            deprecated: true,
            owner: 'lessCompile',
            source: 'less',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            pattern: ProblemPatternRegistry.get('lessCompile'),
            severity: Severity.Error
        });
        this.add({
            name: 'gulp-tsc',
            label: localize('gulp-tsc', 'Gulp TSC Problems'),
            owner: 'typescript',
            source: 'ts',
            applyTo: ApplyToKind.closedDocuments,
            fileLocation: FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: ProblemPatternRegistry.get('gulp-tsc')
        });
        this.add({
            name: 'jshint',
            label: localize('jshint', 'JSHint problems'),
            owner: 'jshint',
            source: 'jshint',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            pattern: ProblemPatternRegistry.get('jshint')
        });
        this.add({
            name: 'jshint-stylish',
            label: localize('jshint-stylish', 'JSHint stylish problems'),
            owner: 'jshint',
            source: 'jshint',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            pattern: ProblemPatternRegistry.get('jshint-stylish')
        });
        this.add({
            name: 'eslint-compact',
            label: localize('eslint-compact', 'ESLint compact problems'),
            owner: 'eslint',
            source: 'eslint',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            filePrefix: '${workspaceFolder}',
            pattern: ProblemPatternRegistry.get('eslint-compact')
        });
        this.add({
            name: 'eslint-stylish',
            label: localize('eslint-stylish', 'ESLint stylish problems'),
            owner: 'eslint',
            source: 'eslint',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Absolute,
            pattern: ProblemPatternRegistry.get('eslint-stylish')
        });
        this.add({
            name: 'go',
            label: localize('go', 'Go problems'),
            owner: 'go',
            source: 'go',
            applyTo: ApplyToKind.allDocuments,
            fileLocation: FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: ProblemPatternRegistry.get('go')
        });
    };
    return ProblemMatcherRegistryImpl;
}());
export var ProblemMatcherRegistry = new ProblemMatcherRegistryImpl();
