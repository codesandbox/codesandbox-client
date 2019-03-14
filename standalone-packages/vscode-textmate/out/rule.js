/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var HAS_BACK_REFERENCES = /\\(\d+)/;
var BACK_REFERENCING_END = /\\(\d+)/g;
var Rule = /** @class */ (function () {
    function Rule($location, id, name, contentName) {
        this.$location = $location;
        this.id = id;
        this._name = name || null;
        this._nameIsCapturing = utils_1.RegexSource.hasCaptures(this._name);
        this._contentName = contentName || null;
        this._contentNameIsCapturing = utils_1.RegexSource.hasCaptures(this._contentName);
    }
    Object.defineProperty(Rule.prototype, "debugName", {
        get: function () {
            return this.constructor.name + "#" + this.id + " @ " + utils_1.basename(this.$location.filename) + ":" + this.$location.line;
        },
        enumerable: true,
        configurable: true
    });
    Rule.prototype.getName = function (lineText, captureIndices) {
        if (!this._nameIsCapturing) {
            return this._name;
        }
        return utils_1.RegexSource.replaceCaptures(this._name, lineText, captureIndices);
    };
    Rule.prototype.getContentName = function (lineText, captureIndices) {
        if (!this._contentNameIsCapturing) {
            return this._contentName;
        }
        return utils_1.RegexSource.replaceCaptures(this._contentName, lineText, captureIndices);
    };
    Rule.prototype.collectPatternsRecursive = function (grammar, out, isFirst) {
        throw new Error('Implement me!');
    };
    Rule.prototype.compile = function (grammar, endRegexSource, allowA, allowG) {
        throw new Error('Implement me!');
    };
    return Rule;
}());
exports.Rule = Rule;
var CaptureRule = /** @class */ (function (_super) {
    __extends(CaptureRule, _super);
    function CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId) {
        var _this = _super.call(this, $location, id, name, contentName) || this;
        _this.retokenizeCapturedWithRuleId = retokenizeCapturedWithRuleId;
        return _this;
    }
    return CaptureRule;
}(Rule));
exports.CaptureRule = CaptureRule;
var RegExpSource = /** @class */ (function () {
    function RegExpSource(regExpSource, ruleId, handleAnchors) {
        if (handleAnchors === void 0) { handleAnchors = true; }
        if (handleAnchors) {
            this._handleAnchors(regExpSource);
        }
        else {
            this.source = regExpSource;
            this.hasAnchor = false;
        }
        if (this.hasAnchor) {
            this._anchorCache = this._buildAnchorCache();
        }
        this.ruleId = ruleId;
        this.hasBackReferences = HAS_BACK_REFERENCES.test(this.source);
        // console.log('input: ' + regExpSource + ' => ' + this.source + ', ' + this.hasAnchor);
    }
    RegExpSource.prototype.clone = function () {
        return new RegExpSource(this.source, this.ruleId, true);
    };
    RegExpSource.prototype.setSource = function (newSource) {
        if (this.source === newSource) {
            return;
        }
        this.source = newSource;
        if (this.hasAnchor) {
            this._anchorCache = this._buildAnchorCache();
        }
    };
    RegExpSource.prototype._handleAnchors = function (regExpSource) {
        if (regExpSource) {
            var pos = void 0, len = void 0, ch = void 0, nextCh = void 0, lastPushedPos = 0, output = [];
            var hasAnchor = false;
            for (pos = 0, len = regExpSource.length; pos < len; pos++) {
                ch = regExpSource.charAt(pos);
                if (ch === '\\') {
                    if (pos + 1 < len) {
                        nextCh = regExpSource.charAt(pos + 1);
                        if (nextCh === 'z') {
                            output.push(regExpSource.substring(lastPushedPos, pos));
                            output.push('$(?!\\n)(?<!\\n)');
                            lastPushedPos = pos + 2;
                        }
                        else if (nextCh === 'A' || nextCh === 'G') {
                            hasAnchor = true;
                        }
                        pos++;
                    }
                }
            }
            this.hasAnchor = hasAnchor;
            if (lastPushedPos === 0) {
                // No \z hit
                this.source = regExpSource;
            }
            else {
                output.push(regExpSource.substring(lastPushedPos, len));
                this.source = output.join('');
            }
        }
        else {
            this.hasAnchor = false;
            this.source = regExpSource;
        }
    };
    RegExpSource.prototype.resolveBackReferences = function (lineText, captureIndices) {
        var capturedValues = captureIndices.map(function (capture) {
            return lineText.substring(capture.start, capture.end);
        });
        BACK_REFERENCING_END.lastIndex = 0;
        return this.source.replace(BACK_REFERENCING_END, function (match, g1) {
            return escapeRegExpCharacters(capturedValues[parseInt(g1, 10)] || '');
        });
    };
    RegExpSource.prototype._buildAnchorCache = function () {
        var A0_G0_result = [];
        var A0_G1_result = [];
        var A1_G0_result = [];
        var A1_G1_result = [];
        var pos, len, ch, nextCh;
        for (pos = 0, len = this.source.length; pos < len; pos++) {
            ch = this.source.charAt(pos);
            A0_G0_result[pos] = ch;
            A0_G1_result[pos] = ch;
            A1_G0_result[pos] = ch;
            A1_G1_result[pos] = ch;
            if (ch === '\\') {
                if (pos + 1 < len) {
                    nextCh = this.source.charAt(pos + 1);
                    if (nextCh === 'A') {
                        A0_G0_result[pos + 1] = '\uFFFF';
                        A0_G1_result[pos + 1] = '\uFFFF';
                        A1_G0_result[pos + 1] = 'A';
                        A1_G1_result[pos + 1] = 'A';
                    }
                    else if (nextCh === 'G') {
                        A0_G0_result[pos + 1] = '\uFFFF';
                        A0_G1_result[pos + 1] = 'G';
                        A1_G0_result[pos + 1] = '\uFFFF';
                        A1_G1_result[pos + 1] = 'G';
                    }
                    else {
                        A0_G0_result[pos + 1] = nextCh;
                        A0_G1_result[pos + 1] = nextCh;
                        A1_G0_result[pos + 1] = nextCh;
                        A1_G1_result[pos + 1] = nextCh;
                    }
                    pos++;
                }
            }
        }
        return {
            A0_G0: A0_G0_result.join(''),
            A0_G1: A0_G1_result.join(''),
            A1_G0: A1_G0_result.join(''),
            A1_G1: A1_G1_result.join('')
        };
    };
    RegExpSource.prototype.resolveAnchors = function (allowA, allowG) {
        if (!this.hasAnchor) {
            return this.source;
        }
        if (allowA) {
            if (allowG) {
                return this._anchorCache.A1_G1;
            }
            else {
                return this._anchorCache.A1_G0;
            }
        }
        else {
            if (allowG) {
                return this._anchorCache.A0_G1;
            }
            else {
                return this._anchorCache.A0_G0;
            }
        }
    };
    return RegExpSource;
}());
exports.RegExpSource = RegExpSource;
var RegExpSourceList = /** @class */ (function () {
    function RegExpSourceList() {
        this._items = [];
        this._hasAnchors = false;
        this._cached = null;
        this._cachedSources = null;
        this._anchorCache = {
            A0_G0: null,
            A0_G1: null,
            A1_G0: null,
            A1_G1: null
        };
    }
    RegExpSourceList.prototype.push = function (item) {
        this._items.push(item);
        this._hasAnchors = this._hasAnchors || item.hasAnchor;
    };
    RegExpSourceList.prototype.unshift = function (item) {
        this._items.unshift(item);
        this._hasAnchors = this._hasAnchors || item.hasAnchor;
    };
    RegExpSourceList.prototype.length = function () {
        return this._items.length;
    };
    RegExpSourceList.prototype.setSource = function (index, newSource) {
        if (this._items[index].source !== newSource) {
            // bust the cache
            this._cached = null;
            this._anchorCache.A0_G0 = null;
            this._anchorCache.A0_G1 = null;
            this._anchorCache.A1_G0 = null;
            this._anchorCache.A1_G1 = null;
            this._items[index].setSource(newSource);
        }
    };
    RegExpSourceList.prototype.compile = function (onigLib, allowA, allowG) {
        if (!this._hasAnchors) {
            if (!this._cached) {
                var regExps = this._items.map(function (e) { return e.source; });
                this._cached = {
                    scanner: onigLib.createOnigScanner(regExps),
                    rules: this._items.map(function (e) { return e.ruleId; }),
                    debugRegExps: regExps
                };
            }
            return this._cached;
        }
        else {
            this._anchorCache = {
                A0_G0: this._anchorCache.A0_G0 || (allowA === false && allowG === false ? this._resolveAnchors(onigLib, allowA, allowG) : null),
                A0_G1: this._anchorCache.A0_G1 || (allowA === false && allowG === true ? this._resolveAnchors(onigLib, allowA, allowG) : null),
                A1_G0: this._anchorCache.A1_G0 || (allowA === true && allowG === false ? this._resolveAnchors(onigLib, allowA, allowG) : null),
                A1_G1: this._anchorCache.A1_G1 || (allowA === true && allowG === true ? this._resolveAnchors(onigLib, allowA, allowG) : null),
            };
            if (allowA) {
                if (allowG) {
                    return this._anchorCache.A1_G1;
                }
                else {
                    return this._anchorCache.A1_G0;
                }
            }
            else {
                if (allowG) {
                    return this._anchorCache.A0_G1;
                }
                else {
                    return this._anchorCache.A0_G0;
                }
            }
        }
    };
    RegExpSourceList.prototype._resolveAnchors = function (onigLib, allowA, allowG) {
        var regExps = this._items.map(function (e) { return e.resolveAnchors(allowA, allowG); });
        return {
            scanner: onigLib.createOnigScanner(regExps),
            rules: this._items.map(function (e) { return e.ruleId; }),
            debugRegExps: regExps
        };
    };
    return RegExpSourceList;
}());
exports.RegExpSourceList = RegExpSourceList;
var MatchRule = /** @class */ (function (_super) {
    __extends(MatchRule, _super);
    function MatchRule($location, id, name, match, captures) {
        var _this = _super.call(this, $location, id, name, null) || this;
        _this._match = new RegExpSource(match, _this.id);
        _this.captures = captures;
        _this._cachedCompiledPatterns = null;
        return _this;
    }
    Object.defineProperty(MatchRule.prototype, "debugMatchRegExp", {
        get: function () {
            return "" + this._match.source;
        },
        enumerable: true,
        configurable: true
    });
    MatchRule.prototype.collectPatternsRecursive = function (grammar, out, isFirst) {
        out.push(this._match);
    };
    MatchRule.prototype.compile = function (grammar, endRegexSource, allowA, allowG) {
        if (!this._cachedCompiledPatterns) {
            this._cachedCompiledPatterns = new RegExpSourceList();
            this.collectPatternsRecursive(grammar, this._cachedCompiledPatterns, true);
        }
        return this._cachedCompiledPatterns.compile(grammar, allowA, allowG);
    };
    return MatchRule;
}(Rule));
exports.MatchRule = MatchRule;
var IncludeOnlyRule = /** @class */ (function (_super) {
    __extends(IncludeOnlyRule, _super);
    function IncludeOnlyRule($location, id, name, contentName, patterns) {
        var _this = _super.call(this, $location, id, name, contentName) || this;
        _this.patterns = patterns.patterns;
        _this.hasMissingPatterns = patterns.hasMissingPatterns;
        _this._cachedCompiledPatterns = null;
        return _this;
    }
    IncludeOnlyRule.prototype.collectPatternsRecursive = function (grammar, out, isFirst) {
        var i, len, rule;
        for (i = 0, len = this.patterns.length; i < len; i++) {
            rule = grammar.getRule(this.patterns[i]);
            rule.collectPatternsRecursive(grammar, out, false);
        }
    };
    IncludeOnlyRule.prototype.compile = function (grammar, endRegexSource, allowA, allowG) {
        if (!this._cachedCompiledPatterns) {
            this._cachedCompiledPatterns = new RegExpSourceList();
            this.collectPatternsRecursive(grammar, this._cachedCompiledPatterns, true);
        }
        return this._cachedCompiledPatterns.compile(grammar, allowA, allowG);
    };
    return IncludeOnlyRule;
}(Rule));
exports.IncludeOnlyRule = IncludeOnlyRule;
function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&');
}
var BeginEndRule = /** @class */ (function (_super) {
    __extends(BeginEndRule, _super);
    function BeginEndRule($location, id, name, contentName, begin, beginCaptures, end, endCaptures, applyEndPatternLast, patterns) {
        var _this = _super.call(this, $location, id, name, contentName) || this;
        _this._begin = new RegExpSource(begin, _this.id);
        _this.beginCaptures = beginCaptures;
        _this._end = new RegExpSource(end, -1);
        _this.endHasBackReferences = _this._end.hasBackReferences;
        _this.endCaptures = endCaptures;
        _this.applyEndPatternLast = applyEndPatternLast || false;
        _this.patterns = patterns.patterns;
        _this.hasMissingPatterns = patterns.hasMissingPatterns;
        _this._cachedCompiledPatterns = null;
        return _this;
    }
    Object.defineProperty(BeginEndRule.prototype, "debugBeginRegExp", {
        get: function () {
            return "" + this._begin.source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BeginEndRule.prototype, "debugEndRegExp", {
        get: function () {
            return "" + this._end.source;
        },
        enumerable: true,
        configurable: true
    });
    BeginEndRule.prototype.getEndWithResolvedBackReferences = function (lineText, captureIndices) {
        return this._end.resolveBackReferences(lineText, captureIndices);
    };
    BeginEndRule.prototype.collectPatternsRecursive = function (grammar, out, isFirst) {
        if (isFirst) {
            var i = void 0, len = void 0, rule = void 0;
            for (i = 0, len = this.patterns.length; i < len; i++) {
                rule = grammar.getRule(this.patterns[i]);
                rule.collectPatternsRecursive(grammar, out, false);
            }
        }
        else {
            out.push(this._begin);
        }
    };
    BeginEndRule.prototype.compile = function (grammar, endRegexSource, allowA, allowG) {
        var precompiled = this._precompile(grammar);
        if (this._end.hasBackReferences) {
            if (this.applyEndPatternLast) {
                precompiled.setSource(precompiled.length() - 1, endRegexSource);
            }
            else {
                precompiled.setSource(0, endRegexSource);
            }
        }
        return this._cachedCompiledPatterns.compile(grammar, allowA, allowG);
    };
    BeginEndRule.prototype._precompile = function (grammar) {
        if (!this._cachedCompiledPatterns) {
            this._cachedCompiledPatterns = new RegExpSourceList();
            this.collectPatternsRecursive(grammar, this._cachedCompiledPatterns, true);
            if (this.applyEndPatternLast) {
                this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end);
            }
            else {
                this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
            }
        }
        return this._cachedCompiledPatterns;
    };
    return BeginEndRule;
}(Rule));
exports.BeginEndRule = BeginEndRule;
var BeginWhileRule = /** @class */ (function (_super) {
    __extends(BeginWhileRule, _super);
    function BeginWhileRule($location, id, name, contentName, begin, beginCaptures, _while, whileCaptures, patterns) {
        var _this = _super.call(this, $location, id, name, contentName) || this;
        _this._begin = new RegExpSource(begin, _this.id);
        _this.beginCaptures = beginCaptures;
        _this.whileCaptures = whileCaptures;
        _this._while = new RegExpSource(_while, -2);
        _this.whileHasBackReferences = _this._while.hasBackReferences;
        _this.patterns = patterns.patterns;
        _this.hasMissingPatterns = patterns.hasMissingPatterns;
        _this._cachedCompiledPatterns = null;
        _this._cachedCompiledWhilePatterns = null;
        return _this;
    }
    BeginWhileRule.prototype.getWhileWithResolvedBackReferences = function (lineText, captureIndices) {
        return this._while.resolveBackReferences(lineText, captureIndices);
    };
    BeginWhileRule.prototype.collectPatternsRecursive = function (grammar, out, isFirst) {
        if (isFirst) {
            var i = void 0, len = void 0, rule = void 0;
            for (i = 0, len = this.patterns.length; i < len; i++) {
                rule = grammar.getRule(this.patterns[i]);
                rule.collectPatternsRecursive(grammar, out, false);
            }
        }
        else {
            out.push(this._begin);
        }
    };
    BeginWhileRule.prototype.compile = function (grammar, endRegexSource, allowA, allowG) {
        this._precompile(grammar);
        return this._cachedCompiledPatterns.compile(grammar, allowA, allowG);
    };
    BeginWhileRule.prototype._precompile = function (grammar) {
        if (!this._cachedCompiledPatterns) {
            this._cachedCompiledPatterns = new RegExpSourceList();
            this.collectPatternsRecursive(grammar, this._cachedCompiledPatterns, true);
        }
    };
    BeginWhileRule.prototype.compileWhile = function (grammar, endRegexSource, allowA, allowG) {
        this._precompileWhile(grammar);
        if (this._while.hasBackReferences) {
            this._cachedCompiledWhilePatterns.setSource(0, endRegexSource);
        }
        return this._cachedCompiledWhilePatterns.compile(grammar, allowA, allowG);
    };
    BeginWhileRule.prototype._precompileWhile = function (grammar) {
        if (!this._cachedCompiledWhilePatterns) {
            this._cachedCompiledWhilePatterns = new RegExpSourceList();
            this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while);
        }
    };
    return BeginWhileRule;
}(Rule));
exports.BeginWhileRule = BeginWhileRule;
var RuleFactory = /** @class */ (function () {
    function RuleFactory() {
    }
    RuleFactory.createCaptureRule = function (helper, $location, name, contentName, retokenizeCapturedWithRuleId) {
        return helper.registerRule(function (id) {
            return new CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId);
        });
    };
    RuleFactory.getCompiledRuleId = function (desc, helper, repository) {
        if (!desc.id) {
            helper.registerRule(function (id) {
                desc.id = id;
                if (desc.match) {
                    return new MatchRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.match, RuleFactory._compileCaptures(desc.captures, helper, repository));
                }
                if (!desc.begin) {
                    if (desc.repository) {
                        repository = utils_1.mergeObjects({}, repository, desc.repository);
                    }
                    return new IncludeOnlyRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, RuleFactory._compilePatterns(desc.patterns, helper, repository));
                }
                if (desc.while) {
                    return new BeginWhileRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, desc.begin, RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository), desc.while, RuleFactory._compileCaptures(desc.whileCaptures || desc.captures, helper, repository), RuleFactory._compilePatterns(desc.patterns, helper, repository));
                }
                return new BeginEndRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, desc.begin, RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository), desc.end, RuleFactory._compileCaptures(desc.endCaptures || desc.captures, helper, repository), desc.applyEndPatternLast, RuleFactory._compilePatterns(desc.patterns, helper, repository));
            });
        }
        return desc.id;
    };
    RuleFactory._compileCaptures = function (captures, helper, repository) {
        var r = [], numericCaptureId, maximumCaptureId, i, captureId;
        if (captures) {
            // Find the maximum capture id
            maximumCaptureId = 0;
            for (captureId in captures) {
                if (captureId === '$vscodeTextmateLocation') {
                    continue;
                }
                numericCaptureId = parseInt(captureId, 10);
                if (numericCaptureId > maximumCaptureId) {
                    maximumCaptureId = numericCaptureId;
                }
            }
            // Initialize result
            for (i = 0; i <= maximumCaptureId; i++) {
                r[i] = null;
            }
            // Fill out result
            for (captureId in captures) {
                if (captureId === '$vscodeTextmateLocation') {
                    continue;
                }
                numericCaptureId = parseInt(captureId, 10);
                var retokenizeCapturedWithRuleId = 0;
                if (captures[captureId].patterns) {
                    retokenizeCapturedWithRuleId = RuleFactory.getCompiledRuleId(captures[captureId], helper, repository);
                }
                r[numericCaptureId] = RuleFactory.createCaptureRule(helper, captures[captureId].$vscodeTextmateLocation, captures[captureId].name, captures[captureId].contentName, retokenizeCapturedWithRuleId);
            }
        }
        return r;
    };
    RuleFactory._compilePatterns = function (patterns, helper, repository) {
        var r = [], pattern, i, len, patternId, externalGrammar, rule, skipRule;
        if (patterns) {
            for (i = 0, len = patterns.length; i < len; i++) {
                pattern = patterns[i];
                patternId = -1;
                if (pattern.include) {
                    if (pattern.include.charAt(0) === '#') {
                        // Local include found in `repository`
                        var localIncludedRule = repository[pattern.include.substr(1)];
                        if (localIncludedRule) {
                            patternId = RuleFactory.getCompiledRuleId(localIncludedRule, helper, repository);
                        }
                        else {
                            // console.warn('CANNOT find rule for scopeName: ' + pattern.include + ', I am: ', repository['$base'].name);
                        }
                    }
                    else if (pattern.include === '$base' || pattern.include === '$self') {
                        // Special include also found in `repository`
                        patternId = RuleFactory.getCompiledRuleId(repository[pattern.include], helper, repository);
                    }
                    else {
                        var externalGrammarName = null, externalGrammarInclude = null, sharpIndex = pattern.include.indexOf('#');
                        if (sharpIndex >= 0) {
                            externalGrammarName = pattern.include.substring(0, sharpIndex);
                            externalGrammarInclude = pattern.include.substring(sharpIndex + 1);
                        }
                        else {
                            externalGrammarName = pattern.include;
                        }
                        // External include
                        externalGrammar = helper.getExternalGrammar(externalGrammarName, repository);
                        if (externalGrammar) {
                            if (externalGrammarInclude) {
                                var externalIncludedRule = externalGrammar.repository[externalGrammarInclude];
                                if (externalIncludedRule) {
                                    patternId = RuleFactory.getCompiledRuleId(externalIncludedRule, helper, externalGrammar.repository);
                                }
                                else {
                                    // console.warn('CANNOT find rule for scopeName: ' + pattern.include + ', I am: ', repository['$base'].name);
                                }
                            }
                            else {
                                patternId = RuleFactory.getCompiledRuleId(externalGrammar.repository.$self, helper, externalGrammar.repository);
                            }
                        }
                        else {
                            // console.warn('CANNOT find grammar for scopeName: ' + pattern.include + ', I am: ', repository['$base'].name);
                        }
                    }
                }
                else {
                    patternId = RuleFactory.getCompiledRuleId(pattern, helper, repository);
                }
                if (patternId !== -1) {
                    rule = helper.getRule(patternId);
                    skipRule = false;
                    if (rule instanceof IncludeOnlyRule || rule instanceof BeginEndRule || rule instanceof BeginWhileRule) {
                        if (rule.hasMissingPatterns && rule.patterns.length === 0) {
                            skipRule = true;
                        }
                    }
                    if (skipRule) {
                        // console.log('REMOVING RULE ENTIRELY DUE TO EMPTY PATTERNS THAT ARE MISSING');
                        continue;
                    }
                    r.push(patternId);
                }
            }
        }
        return {
            patterns: r,
            hasMissingPatterns: ((patterns ? patterns.length : 0) !== r.length)
        };
    };
    return RuleFactory;
}());
exports.RuleFactory = RuleFactory;
//# sourceMappingURL=rule.js.map