/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from '../../../base/common/event.js';
import { Range } from '../../common/core/range.js';
function effectiveOptionValue(override, value) {
    if (override === 1 /* True */) {
        return true;
    }
    if (override === 2 /* False */) {
        return false;
    }
    return value;
}
var FindReplaceState = /** @class */ (function () {
    function FindReplaceState() {
        this._searchString = '';
        this._replaceString = '';
        this._isRevealed = false;
        this._isReplaceRevealed = false;
        this._isRegex = false;
        this._isRegexOverride = 0 /* NotSet */;
        this._wholeWord = false;
        this._wholeWordOverride = 0 /* NotSet */;
        this._matchCase = false;
        this._matchCaseOverride = 0 /* NotSet */;
        this._searchScope = null;
        this._matchesPosition = 0;
        this._matchesCount = 0;
        this._currentMatch = null;
        this._onFindReplaceStateChange = new Emitter();
    }
    Object.defineProperty(FindReplaceState.prototype, "searchString", {
        get: function () { return this._searchString; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "replaceString", {
        get: function () { return this._replaceString; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "isRevealed", {
        get: function () { return this._isRevealed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "isReplaceRevealed", {
        get: function () { return this._isReplaceRevealed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "isRegex", {
        get: function () { return effectiveOptionValue(this._isRegexOverride, this._isRegex); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "wholeWord", {
        get: function () { return effectiveOptionValue(this._wholeWordOverride, this._wholeWord); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "matchCase", {
        get: function () { return effectiveOptionValue(this._matchCaseOverride, this._matchCase); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "actualIsRegex", {
        get: function () { return this._isRegex; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "actualWholeWord", {
        get: function () { return this._wholeWord; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "actualMatchCase", {
        get: function () { return this._matchCase; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "searchScope", {
        get: function () { return this._searchScope; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "matchesPosition", {
        get: function () { return this._matchesPosition; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "matchesCount", {
        get: function () { return this._matchesCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "currentMatch", {
        get: function () { return this._currentMatch; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindReplaceState.prototype, "onFindReplaceStateChange", {
        get: function () { return this._onFindReplaceStateChange.event; },
        enumerable: true,
        configurable: true
    });
    FindReplaceState.prototype.dispose = function () {
    };
    FindReplaceState.prototype.changeMatchInfo = function (matchesPosition, matchesCount, currentMatch) {
        var changeEvent = {
            moveCursor: false,
            updateHistory: false,
            searchString: false,
            replaceString: false,
            isRevealed: false,
            isReplaceRevealed: false,
            isRegex: false,
            wholeWord: false,
            matchCase: false,
            searchScope: false,
            matchesPosition: false,
            matchesCount: false,
            currentMatch: false
        };
        var somethingChanged = false;
        if (matchesCount === 0) {
            matchesPosition = 0;
        }
        if (matchesPosition > matchesCount) {
            matchesPosition = matchesCount;
        }
        if (this._matchesPosition !== matchesPosition) {
            this._matchesPosition = matchesPosition;
            changeEvent.matchesPosition = true;
            somethingChanged = true;
        }
        if (this._matchesCount !== matchesCount) {
            this._matchesCount = matchesCount;
            changeEvent.matchesCount = true;
            somethingChanged = true;
        }
        if (typeof currentMatch !== 'undefined') {
            if (!Range.equalsRange(this._currentMatch, currentMatch)) {
                this._currentMatch = currentMatch;
                changeEvent.currentMatch = true;
                somethingChanged = true;
            }
        }
        if (somethingChanged) {
            this._onFindReplaceStateChange.fire(changeEvent);
        }
    };
    FindReplaceState.prototype.change = function (newState, moveCursor, updateHistory) {
        if (updateHistory === void 0) { updateHistory = true; }
        var changeEvent = {
            moveCursor: moveCursor,
            updateHistory: updateHistory,
            searchString: false,
            replaceString: false,
            isRevealed: false,
            isReplaceRevealed: false,
            isRegex: false,
            wholeWord: false,
            matchCase: false,
            searchScope: false,
            matchesPosition: false,
            matchesCount: false,
            currentMatch: false
        };
        var somethingChanged = false;
        var oldEffectiveIsRegex = this.isRegex;
        var oldEffectiveWholeWords = this.wholeWord;
        var oldEffectiveMatchCase = this.matchCase;
        if (typeof newState.searchString !== 'undefined') {
            if (this._searchString !== newState.searchString) {
                this._searchString = newState.searchString;
                changeEvent.searchString = true;
                somethingChanged = true;
            }
        }
        if (typeof newState.replaceString !== 'undefined') {
            if (this._replaceString !== newState.replaceString) {
                this._replaceString = newState.replaceString;
                changeEvent.replaceString = true;
                somethingChanged = true;
            }
        }
        if (typeof newState.isRevealed !== 'undefined') {
            if (this._isRevealed !== newState.isRevealed) {
                this._isRevealed = newState.isRevealed;
                changeEvent.isRevealed = true;
                somethingChanged = true;
            }
        }
        if (typeof newState.isReplaceRevealed !== 'undefined') {
            if (this._isReplaceRevealed !== newState.isReplaceRevealed) {
                this._isReplaceRevealed = newState.isReplaceRevealed;
                changeEvent.isReplaceRevealed = true;
                somethingChanged = true;
            }
        }
        if (typeof newState.isRegex !== 'undefined') {
            this._isRegex = newState.isRegex;
        }
        if (typeof newState.wholeWord !== 'undefined') {
            this._wholeWord = newState.wholeWord;
        }
        if (typeof newState.matchCase !== 'undefined') {
            this._matchCase = newState.matchCase;
        }
        if (typeof newState.searchScope !== 'undefined') {
            if (!Range.equalsRange(this._searchScope, newState.searchScope)) {
                this._searchScope = newState.searchScope;
                changeEvent.searchScope = true;
                somethingChanged = true;
            }
        }
        // Overrides get set when they explicitly come in and get reset anytime something else changes
        this._isRegexOverride = (typeof newState.isRegexOverride !== 'undefined' ? newState.isRegexOverride : 0 /* NotSet */);
        this._wholeWordOverride = (typeof newState.wholeWordOverride !== 'undefined' ? newState.wholeWordOverride : 0 /* NotSet */);
        this._matchCaseOverride = (typeof newState.matchCaseOverride !== 'undefined' ? newState.matchCaseOverride : 0 /* NotSet */);
        if (oldEffectiveIsRegex !== this.isRegex) {
            somethingChanged = true;
            changeEvent.isRegex = true;
        }
        if (oldEffectiveWholeWords !== this.wholeWord) {
            somethingChanged = true;
            changeEvent.wholeWord = true;
        }
        if (oldEffectiveMatchCase !== this.matchCase) {
            somethingChanged = true;
            changeEvent.matchCase = true;
        }
        if (somethingChanged) {
            this._onFindReplaceStateChange.fire(changeEvent);
        }
    };
    return FindReplaceState;
}());
export { FindReplaceState };
