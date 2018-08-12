/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as modes from '../../../common/modes.js';
import * as monarchCommon from './monarchCommon.js';
import { Token, TokenizationResult, TokenizationResult2 } from '../../../common/core/token.js';
import { NULL_STATE, NULL_MODE_ID } from '../../../common/modes/nullMode.js';
var CACHE_STACK_DEPTH = 5;
/**
 * Reuse the same stack elements up to a certain depth.
 */
var MonarchStackElementFactory = /** @class */ (function () {
    function MonarchStackElementFactory(maxCacheDepth) {
        this._maxCacheDepth = maxCacheDepth;
        this._entries = Object.create(null);
    }
    MonarchStackElementFactory.create = function (parent, state) {
        return this._INSTANCE.create(parent, state);
    };
    MonarchStackElementFactory.prototype.create = function (parent, state) {
        if (parent !== null && parent.depth >= this._maxCacheDepth) {
            // no caching above a certain depth
            return new MonarchStackElement(parent, state);
        }
        var stackElementId = MonarchStackElement.getStackElementId(parent);
        if (stackElementId.length > 0) {
            stackElementId += '|';
        }
        stackElementId += state;
        var result = this._entries[stackElementId];
        if (result) {
            return result;
        }
        result = new MonarchStackElement(parent, state);
        this._entries[stackElementId] = result;
        return result;
    };
    MonarchStackElementFactory._INSTANCE = new MonarchStackElementFactory(CACHE_STACK_DEPTH);
    return MonarchStackElementFactory;
}());
var MonarchStackElement = /** @class */ (function () {
    function MonarchStackElement(parent, state) {
        this.parent = parent;
        this.state = state;
        this.depth = (this.parent ? this.parent.depth : 0) + 1;
    }
    MonarchStackElement.getStackElementId = function (element) {
        var result = '';
        while (element !== null) {
            if (result.length > 0) {
                result += '|';
            }
            result += element.state;
            element = element.parent;
        }
        return result;
    };
    MonarchStackElement._equals = function (a, b) {
        while (a !== null && b !== null) {
            if (a === b) {
                return true;
            }
            if (a.state !== b.state) {
                return false;
            }
            a = a.parent;
            b = b.parent;
        }
        if (a === null && b === null) {
            return true;
        }
        return false;
    };
    MonarchStackElement.prototype.equals = function (other) {
        return MonarchStackElement._equals(this, other);
    };
    MonarchStackElement.prototype.push = function (state) {
        return MonarchStackElementFactory.create(this, state);
    };
    MonarchStackElement.prototype.pop = function () {
        return this.parent;
    };
    MonarchStackElement.prototype.popall = function () {
        var result = this;
        while (result.parent) {
            result = result.parent;
        }
        return result;
    };
    MonarchStackElement.prototype.switchTo = function (state) {
        return MonarchStackElementFactory.create(this.parent, state);
    };
    return MonarchStackElement;
}());
var EmbeddedModeData = /** @class */ (function () {
    function EmbeddedModeData(modeId, state) {
        this.modeId = modeId;
        this.state = state;
    }
    EmbeddedModeData.prototype.equals = function (other) {
        return (this.modeId === other.modeId
            && this.state.equals(other.state));
    };
    EmbeddedModeData.prototype.clone = function () {
        var stateClone = this.state.clone();
        // save an object
        if (stateClone === this.state) {
            return this;
        }
        return new EmbeddedModeData(this.modeId, this.state);
    };
    return EmbeddedModeData;
}());
/**
 * Reuse the same line states up to a certain depth.
 */
var MonarchLineStateFactory = /** @class */ (function () {
    function MonarchLineStateFactory(maxCacheDepth) {
        this._maxCacheDepth = maxCacheDepth;
        this._entries = Object.create(null);
    }
    MonarchLineStateFactory.create = function (stack, embeddedModeData) {
        return this._INSTANCE.create(stack, embeddedModeData);
    };
    MonarchLineStateFactory.prototype.create = function (stack, embeddedModeData) {
        if (embeddedModeData !== null) {
            // no caching when embedding
            return new MonarchLineState(stack, embeddedModeData);
        }
        if (stack !== null && stack.depth >= this._maxCacheDepth) {
            // no caching above a certain depth
            return new MonarchLineState(stack, embeddedModeData);
        }
        var stackElementId = MonarchStackElement.getStackElementId(stack);
        var result = this._entries[stackElementId];
        if (result) {
            return result;
        }
        result = new MonarchLineState(stack, null);
        this._entries[stackElementId] = result;
        return result;
    };
    MonarchLineStateFactory._INSTANCE = new MonarchLineStateFactory(CACHE_STACK_DEPTH);
    return MonarchLineStateFactory;
}());
var MonarchLineState = /** @class */ (function () {
    function MonarchLineState(stack, embeddedModeData) {
        this.stack = stack;
        this.embeddedModeData = embeddedModeData;
    }
    MonarchLineState.prototype.clone = function () {
        var embeddedModeDataClone = this.embeddedModeData ? this.embeddedModeData.clone() : null;
        // save an object
        if (embeddedModeDataClone === this.embeddedModeData) {
            return this;
        }
        return MonarchLineStateFactory.create(this.stack, this.embeddedModeData);
    };
    MonarchLineState.prototype.equals = function (other) {
        if (!(other instanceof MonarchLineState)) {
            return false;
        }
        if (!this.stack.equals(other.stack)) {
            return false;
        }
        if (this.embeddedModeData === null && other.embeddedModeData === null) {
            return true;
        }
        if (this.embeddedModeData === null || other.embeddedModeData === null) {
            return false;
        }
        return this.embeddedModeData.equals(other.embeddedModeData);
    };
    return MonarchLineState;
}());
var hasOwnProperty = Object.hasOwnProperty;
var MonarchClassicTokensCollector = /** @class */ (function () {
    function MonarchClassicTokensCollector() {
        this._tokens = [];
        this._language = null;
        this._lastTokenType = null;
        this._lastTokenLanguage = null;
    }
    MonarchClassicTokensCollector.prototype.enterMode = function (startOffset, modeId) {
        this._language = modeId;
    };
    MonarchClassicTokensCollector.prototype.emit = function (startOffset, type) {
        if (this._lastTokenType === type && this._lastTokenLanguage === this._language) {
            return;
        }
        this._lastTokenType = type;
        this._lastTokenLanguage = this._language;
        this._tokens.push(new Token(startOffset, type, this._language));
    };
    MonarchClassicTokensCollector.prototype.nestedModeTokenize = function (embeddedModeLine, embeddedModeData, offsetDelta) {
        var nestedModeId = embeddedModeData.modeId;
        var embeddedModeState = embeddedModeData.state;
        var nestedModeTokenizationSupport = modes.TokenizationRegistry.get(nestedModeId);
        if (!nestedModeTokenizationSupport) {
            this.enterMode(offsetDelta, nestedModeId);
            this.emit(offsetDelta, '');
            return embeddedModeState;
        }
        var nestedResult = nestedModeTokenizationSupport.tokenize(embeddedModeLine, embeddedModeState, offsetDelta);
        this._tokens = this._tokens.concat(nestedResult.tokens);
        this._lastTokenType = null;
        this._lastTokenLanguage = null;
        this._language = null;
        return nestedResult.endState;
    };
    MonarchClassicTokensCollector.prototype.finalize = function (endState) {
        return new TokenizationResult(this._tokens, endState);
    };
    return MonarchClassicTokensCollector;
}());
var MonarchModernTokensCollector = /** @class */ (function () {
    function MonarchModernTokensCollector(modeService, theme) {
        this._modeService = modeService;
        this._theme = theme;
        this._prependTokens = null;
        this._tokens = [];
        this._currentLanguageId = 0 /* Null */;
        this._lastTokenMetadata = 0;
    }
    MonarchModernTokensCollector.prototype.enterMode = function (startOffset, modeId) {
        this._currentLanguageId = this._modeService.getLanguageIdentifier(modeId).id;
    };
    MonarchModernTokensCollector.prototype.emit = function (startOffset, type) {
        var metadata = this._theme.match(this._currentLanguageId, type);
        if (this._lastTokenMetadata === metadata) {
            return;
        }
        this._lastTokenMetadata = metadata;
        this._tokens.push(startOffset);
        this._tokens.push(metadata);
    };
    MonarchModernTokensCollector._merge = function (a, b, c) {
        var aLen = (a !== null ? a.length : 0);
        var bLen = b.length;
        var cLen = (c !== null ? c.length : 0);
        if (aLen === 0 && bLen === 0 && cLen === 0) {
            return new Uint32Array(0);
        }
        if (aLen === 0 && bLen === 0) {
            return c;
        }
        if (bLen === 0 && cLen === 0) {
            return a;
        }
        var result = new Uint32Array(aLen + bLen + cLen);
        if (a !== null) {
            result.set(a);
        }
        for (var i = 0; i < bLen; i++) {
            result[aLen + i] = b[i];
        }
        if (c !== null) {
            result.set(c, aLen + bLen);
        }
        return result;
    };
    MonarchModernTokensCollector.prototype.nestedModeTokenize = function (embeddedModeLine, embeddedModeData, offsetDelta) {
        var nestedModeId = embeddedModeData.modeId;
        var embeddedModeState = embeddedModeData.state;
        var nestedModeTokenizationSupport = modes.TokenizationRegistry.get(nestedModeId);
        if (!nestedModeTokenizationSupport) {
            this.enterMode(offsetDelta, nestedModeId);
            this.emit(offsetDelta, '');
            return embeddedModeState;
        }
        var nestedResult = nestedModeTokenizationSupport.tokenize2(embeddedModeLine, embeddedModeState, offsetDelta);
        this._prependTokens = MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, nestedResult.tokens);
        this._tokens = [];
        this._currentLanguageId = 0;
        this._lastTokenMetadata = 0;
        return nestedResult.endState;
    };
    MonarchModernTokensCollector.prototype.finalize = function (endState) {
        return new TokenizationResult2(MonarchModernTokensCollector._merge(this._prependTokens, this._tokens, null), endState);
    };
    return MonarchModernTokensCollector;
}());
var MonarchTokenizer = /** @class */ (function () {
    function MonarchTokenizer(modeService, standaloneThemeService, modeId, lexer) {
        var _this = this;
        this._modeService = modeService;
        this._standaloneThemeService = standaloneThemeService;
        this._modeId = modeId;
        this._lexer = lexer;
        this._embeddedModes = Object.create(null);
        // Set up listening for embedded modes
        var emitting = false;
        this._tokenizationRegistryListener = modes.TokenizationRegistry.onDidChange(function (e) {
            if (emitting) {
                return;
            }
            var isOneOfMyEmbeddedModes = false;
            for (var i = 0, len = e.changedLanguages.length; i < len; i++) {
                var language = e.changedLanguages[i];
                if (_this._embeddedModes[language]) {
                    isOneOfMyEmbeddedModes = true;
                    break;
                }
            }
            if (isOneOfMyEmbeddedModes) {
                emitting = true;
                modes.TokenizationRegistry.fire([_this._modeId]);
                emitting = false;
            }
        });
    }
    MonarchTokenizer.prototype.dispose = function () {
        this._tokenizationRegistryListener.dispose();
    };
    MonarchTokenizer.prototype.getInitialState = function () {
        var rootState = MonarchStackElementFactory.create(null, this._lexer.start);
        return MonarchLineStateFactory.create(rootState, null);
    };
    MonarchTokenizer.prototype.tokenize = function (line, lineState, offsetDelta) {
        var tokensCollector = new MonarchClassicTokensCollector();
        var endLineState = this._tokenize(line, lineState, offsetDelta, tokensCollector);
        return tokensCollector.finalize(endLineState);
    };
    MonarchTokenizer.prototype.tokenize2 = function (line, lineState, offsetDelta) {
        var tokensCollector = new MonarchModernTokensCollector(this._modeService, this._standaloneThemeService.getTheme().tokenTheme);
        var endLineState = this._tokenize(line, lineState, offsetDelta, tokensCollector);
        return tokensCollector.finalize(endLineState);
    };
    MonarchTokenizer.prototype._tokenize = function (line, lineState, offsetDelta, collector) {
        if (lineState.embeddedModeData) {
            return this._nestedTokenize(line, lineState, offsetDelta, collector);
        }
        else {
            return this._myTokenize(line, lineState, offsetDelta, collector);
        }
    };
    MonarchTokenizer.prototype._findLeavingNestedModeOffset = function (line, state) {
        var rules = this._lexer.tokenizer[state.stack.state];
        if (!rules) {
            rules = monarchCommon.findRules(this._lexer, state.stack.state); // do parent matching
            if (!rules) {
                monarchCommon.throwError(this._lexer, 'tokenizer state is not defined: ' + state.stack.state);
            }
        }
        var popOffset = -1;
        var hasEmbeddedPopRule = false;
        for (var idx in rules) {
            if (!hasOwnProperty.call(rules, idx)) {
                continue;
            }
            var rule = rules[idx];
            if (!monarchCommon.isIAction(rule.action) || rule.action.nextEmbedded !== '@pop') {
                continue;
            }
            hasEmbeddedPopRule = true;
            var regex = rule.regex;
            var regexSource = rule.regex.source;
            if (regexSource.substr(0, 4) === '^(?:' && regexSource.substr(regexSource.length - 1, 1) === ')') {
                regex = new RegExp(regexSource.substr(4, regexSource.length - 5), regex.ignoreCase ? 'i' : '');
            }
            var result = line.search(regex);
            if (result === -1) {
                continue;
            }
            if (popOffset === -1 || result < popOffset) {
                popOffset = result;
            }
        }
        if (!hasEmbeddedPopRule) {
            monarchCommon.throwError(this._lexer, 'no rule containing nextEmbedded: "@pop" in tokenizer embedded state: ' + state.stack.state);
        }
        return popOffset;
    };
    MonarchTokenizer.prototype._nestedTokenize = function (line, lineState, offsetDelta, tokensCollector) {
        var popOffset = this._findLeavingNestedModeOffset(line, lineState);
        if (popOffset === -1) {
            // tokenization will not leave nested mode
            var nestedEndState = tokensCollector.nestedModeTokenize(line, lineState.embeddedModeData, offsetDelta);
            return MonarchLineStateFactory.create(lineState.stack, new EmbeddedModeData(lineState.embeddedModeData.modeId, nestedEndState));
        }
        var nestedModeLine = line.substring(0, popOffset);
        if (nestedModeLine.length > 0) {
            // tokenize with the nested mode
            tokensCollector.nestedModeTokenize(nestedModeLine, lineState.embeddedModeData, offsetDelta);
        }
        var restOfTheLine = line.substring(popOffset);
        return this._myTokenize(restOfTheLine, lineState, offsetDelta + popOffset, tokensCollector);
    };
    MonarchTokenizer.prototype._myTokenize = function (line, lineState, offsetDelta, tokensCollector) {
        tokensCollector.enterMode(offsetDelta, this._modeId);
        var lineLength = line.length;
        var embeddedModeData = lineState.embeddedModeData;
        var stack = lineState.stack;
        var pos = 0;
        // regular expression group matching
        // these never need cloning or equality since they are only used within a line match
        var groupActions = null;
        var groupMatches = null;
        var groupMatched = null;
        var groupRule = null;
        while (pos < lineLength) {
            var pos0 = pos;
            var stackLen0 = stack.depth;
            var groupLen0 = groupActions ? groupActions.length : 0;
            var state = stack.state;
            var matches = null;
            var matched = null;
            var action = null;
            var rule = null;
            var enteringEmbeddedMode = null;
            // check if we need to process group matches first
            if (groupActions) {
                matches = groupMatches;
                matched = groupMatched.shift();
                action = groupActions.shift();
                rule = groupRule;
                // cleanup if necessary
                if (groupActions.length === 0) {
                    groupActions = null;
                    groupMatches = null;
                    groupMatched = null;
                    groupRule = null;
                }
            }
            else {
                // otherwise we match on the token stream
                if (pos >= lineLength) {
                    // nothing to do
                    break;
                }
                // get the rules for this state
                var rules = this._lexer.tokenizer[state];
                if (!rules) {
                    rules = monarchCommon.findRules(this._lexer, state); // do parent matching
                    if (!rules) {
                        monarchCommon.throwError(this._lexer, 'tokenizer state is not defined: ' + state);
                    }
                }
                // try each rule until we match
                var restOfLine = line.substr(pos);
                for (var idx in rules) {
                    if (hasOwnProperty.call(rules, idx)) {
                        var rule_1 = rules[idx];
                        if (pos === 0 || !rule_1.matchOnlyAtLineStart) {
                            matches = restOfLine.match(rule_1.regex);
                            if (matches) {
                                matched = matches[0];
                                action = rule_1.action;
                                break;
                            }
                        }
                    }
                }
            }
            // We matched 'rule' with 'matches' and 'action'
            if (!matches) {
                matches = [''];
                matched = '';
            }
            if (!action) {
                // bad: we didn't match anything, and there is no action to take
                // we need to advance the stream or we get progress trouble
                if (pos < lineLength) {
                    matches = [line.charAt(pos)];
                    matched = matches[0];
                }
                action = this._lexer.defaultToken;
            }
            // advance stream
            pos += matched.length;
            // maybe call action function (used for 'cases')
            while (monarchCommon.isFuzzyAction(action) && monarchCommon.isIAction(action) && action.test) {
                action = action.test(matched, matches, state, pos === lineLength);
            }
            var result = null;
            // set the result: either a string or an array of actions
            if (typeof action === 'string' || Array.isArray(action)) {
                result = action;
            }
            else if (action.group) {
                result = action.group;
            }
            else if (action.token !== null && action.token !== undefined) {
                // do $n replacements?
                if (action.tokenSubst) {
                    result = monarchCommon.substituteMatches(this._lexer, action.token, matched, matches, state);
                }
                else {
                    result = action.token;
                }
                // enter embedded mode?
                if (action.nextEmbedded) {
                    if (action.nextEmbedded === '@pop') {
                        if (!embeddedModeData) {
                            monarchCommon.throwError(this._lexer, 'cannot pop embedded mode if not inside one');
                        }
                        embeddedModeData = null;
                    }
                    else if (embeddedModeData) {
                        monarchCommon.throwError(this._lexer, 'cannot enter embedded mode from within an embedded mode');
                    }
                    else {
                        enteringEmbeddedMode = monarchCommon.substituteMatches(this._lexer, action.nextEmbedded, matched, matches, state);
                    }
                }
                // state transformations
                if (action.goBack) { // back up the stream..
                    pos = Math.max(0, pos - action.goBack);
                }
                if (action.switchTo && typeof action.switchTo === 'string') {
                    var nextState = monarchCommon.substituteMatches(this._lexer, action.switchTo, matched, matches, state); // switch state without a push...
                    if (nextState[0] === '@') {
                        nextState = nextState.substr(1); // peel off starting '@'
                    }
                    if (!monarchCommon.findRules(this._lexer, nextState)) {
                        monarchCommon.throwError(this._lexer, 'trying to switch to a state \'' + nextState + '\' that is undefined in rule: ' + rule.name);
                    }
                    else {
                        stack = stack.switchTo(nextState);
                    }
                }
                else if (action.transform && typeof action.transform === 'function') {
                    monarchCommon.throwError(this._lexer, 'action.transform not supported');
                }
                else if (action.next) {
                    if (action.next === '@push') {
                        if (stack.depth >= this._lexer.maxStack) {
                            monarchCommon.throwError(this._lexer, 'maximum tokenizer stack size reached: [' +
                                stack.state + ',' + stack.parent.state + ',...]');
                        }
                        else {
                            stack = stack.push(state);
                        }
                    }
                    else if (action.next === '@pop') {
                        if (stack.depth <= 1) {
                            monarchCommon.throwError(this._lexer, 'trying to pop an empty stack in rule: ' + rule.name);
                        }
                        else {
                            stack = stack.pop();
                        }
                    }
                    else if (action.next === '@popall') {
                        stack = stack.popall();
                    }
                    else {
                        var nextState = monarchCommon.substituteMatches(this._lexer, action.next, matched, matches, state);
                        if (nextState[0] === '@') {
                            nextState = nextState.substr(1); // peel off starting '@'
                        }
                        if (!monarchCommon.findRules(this._lexer, nextState)) {
                            monarchCommon.throwError(this._lexer, 'trying to set a next state \'' + nextState + '\' that is undefined in rule: ' + rule.name);
                        }
                        else {
                            stack = stack.push(nextState);
                        }
                    }
                }
                if (action.log && typeof (action.log) === 'string') {
                    monarchCommon.log(this._lexer, this._lexer.languageId + ': ' + monarchCommon.substituteMatches(this._lexer, action.log, matched, matches, state));
                }
            }
            // check result
            if (result === null) {
                monarchCommon.throwError(this._lexer, 'lexer rule has no well-defined action in rule: ' + rule.name);
            }
            // is the result a group match?
            if (Array.isArray(result)) {
                if (groupActions && groupActions.length > 0) {
                    monarchCommon.throwError(this._lexer, 'groups cannot be nested: ' + rule.name);
                }
                if (matches.length !== result.length + 1) {
                    monarchCommon.throwError(this._lexer, 'matched number of groups does not match the number of actions in rule: ' + rule.name);
                }
                var totalLen = 0;
                for (var i = 1; i < matches.length; i++) {
                    totalLen += matches[i].length;
                }
                if (totalLen !== matched.length) {
                    monarchCommon.throwError(this._lexer, 'with groups, all characters should be matched in consecutive groups in rule: ' + rule.name);
                }
                groupMatches = matches;
                groupMatched = matches.slice(1);
                groupActions = result.slice(0);
                groupRule = rule;
                pos -= matched.length;
                // call recursively to initiate first result match
                continue;
            }
            else {
                // regular result
                // check for '@rematch'
                if (result === '@rematch') {
                    pos -= matched.length;
                    matched = ''; // better set the next state too..
                    matches = null;
                    result = '';
                }
                // check progress
                if (matched.length === 0) {
                    if (stackLen0 !== stack.depth || state !== stack.state || (!groupActions ? 0 : groupActions.length) !== groupLen0) {
                        continue;
                    }
                    else {
                        monarchCommon.throwError(this._lexer, 'no progress in tokenizer in rule: ' + rule.name);
                        pos = lineLength; // must make progress or editor loops
                    }
                }
                // return the result (and check for brace matching)
                // todo: for efficiency we could pre-sanitize tokenPostfix and substitutions
                var tokenType = null;
                if (monarchCommon.isString(result) && result.indexOf('@brackets') === 0) {
                    var rest = result.substr('@brackets'.length);
                    var bracket = findBracket(this._lexer, matched);
                    if (!bracket) {
                        monarchCommon.throwError(this._lexer, '@brackets token returned but no bracket defined as: ' + matched);
                        bracket = { token: '', bracketType: 0 /* None */ };
                    }
                    tokenType = monarchCommon.sanitize(bracket.token + rest);
                }
                else {
                    var token = (result === '' ? '' : result + this._lexer.tokenPostfix);
                    tokenType = monarchCommon.sanitize(token);
                }
                tokensCollector.emit(pos0 + offsetDelta, tokenType);
            }
            if (enteringEmbeddedMode !== null) {
                // substitute language alias to known modes to support syntax highlighting
                var enteringEmbeddedModeId = this._modeService.getModeIdForLanguageName(enteringEmbeddedMode);
                if (enteringEmbeddedModeId) {
                    enteringEmbeddedMode = enteringEmbeddedModeId;
                }
                var embeddedModeData_1 = this._getNestedEmbeddedModeData(enteringEmbeddedMode);
                if (pos < lineLength) {
                    // there is content from the embedded mode on this line
                    var restOfLine = line.substr(pos);
                    return this._nestedTokenize(restOfLine, MonarchLineStateFactory.create(stack, embeddedModeData_1), offsetDelta + pos, tokensCollector);
                }
                else {
                    return MonarchLineStateFactory.create(stack, embeddedModeData_1);
                }
            }
        }
        return MonarchLineStateFactory.create(stack, embeddedModeData);
    };
    MonarchTokenizer.prototype._getNestedEmbeddedModeData = function (mimetypeOrModeId) {
        var nestedMode = this._locateMode(mimetypeOrModeId);
        if (nestedMode) {
            var tokenizationSupport = modes.TokenizationRegistry.get(nestedMode.getId());
            if (tokenizationSupport) {
                return new EmbeddedModeData(nestedMode.getId(), tokenizationSupport.getInitialState());
            }
        }
        var nestedModeId = nestedMode ? nestedMode.getId() : NULL_MODE_ID;
        return new EmbeddedModeData(nestedModeId, NULL_STATE);
    };
    MonarchTokenizer.prototype._locateMode = function (mimetypeOrModeId) {
        if (!mimetypeOrModeId || !this._modeService.isRegisteredMode(mimetypeOrModeId)) {
            return null;
        }
        var modeId = this._modeService.getModeId(mimetypeOrModeId);
        // Fire mode loading event
        this._modeService.getOrCreateMode(modeId);
        var mode = this._modeService.getMode(modeId);
        if (mode) {
            // Re-emit tokenizationSupport change events from all modes that I ever embedded
            this._embeddedModes[modeId] = true;
            return mode;
        }
        this._embeddedModes[modeId] = true;
        return null;
    };
    return MonarchTokenizer;
}());
/**
 * Searches for a bracket in the 'brackets' attribute that matches the input.
 */
function findBracket(lexer, matched) {
    if (!matched) {
        return null;
    }
    matched = monarchCommon.fixCase(lexer, matched);
    var brackets = lexer.brackets;
    for (var i = 0; i < brackets.length; i++) {
        var bracket = brackets[i];
        if (bracket.open === matched) {
            return { token: bracket.token, bracketType: 1 /* Open */ };
        }
        else if (bracket.close === matched) {
            return { token: bracket.token, bracketType: -1 /* Close */ };
        }
    }
    return null;
}
export function createTokenizationSupport(modeService, standaloneThemeService, modeId, lexer) {
    return new MonarchTokenizer(modeService, standaloneThemeService, modeId, lexer);
}
