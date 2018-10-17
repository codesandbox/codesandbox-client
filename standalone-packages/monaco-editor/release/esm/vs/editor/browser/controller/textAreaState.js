/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range } from '../../common/core/range.js';
import { Position } from '../../common/core/position.js';
import { EndOfLinePreference } from '../../common/model.js';
import * as strings from '../../../base/common/strings.js';
var TextAreaState = /** @class */ (function () {
    function TextAreaState(value, selectionStart, selectionEnd, selectionStartPosition, selectionEndPosition) {
        this.value = value;
        this.selectionStart = selectionStart;
        this.selectionEnd = selectionEnd;
        this.selectionStartPosition = selectionStartPosition;
        this.selectionEndPosition = selectionEndPosition;
    }
    TextAreaState.prototype.toString = function () {
        return '[ <' + this.value + '>, selectionStart: ' + this.selectionStart + ', selectionEnd: ' + this.selectionEnd + ']';
    };
    TextAreaState.readFromTextArea = function (textArea) {
        return new TextAreaState(textArea.getValue(), textArea.getSelectionStart(), textArea.getSelectionEnd(), null, null);
    };
    TextAreaState.prototype.collapseSelection = function () {
        return new TextAreaState(this.value, this.value.length, this.value.length, null, null);
    };
    TextAreaState.prototype.writeToTextArea = function (reason, textArea, select) {
        // console.log(Date.now() + ': writeToTextArea ' + reason + ': ' + this.toString());
        textArea.setValue(reason, this.value);
        if (select) {
            textArea.setSelectionRange(reason, this.selectionStart, this.selectionEnd);
        }
    };
    TextAreaState.prototype.deduceEditorPosition = function (offset) {
        if (offset <= this.selectionStart) {
            var str = this.value.substring(offset, this.selectionStart);
            return this._finishDeduceEditorPosition(this.selectionStartPosition, str, -1);
        }
        if (offset >= this.selectionEnd) {
            var str = this.value.substring(this.selectionEnd, offset);
            return this._finishDeduceEditorPosition(this.selectionEndPosition, str, 1);
        }
        var str1 = this.value.substring(this.selectionStart, offset);
        if (str1.indexOf(String.fromCharCode(8230)) === -1) {
            return this._finishDeduceEditorPosition(this.selectionStartPosition, str1, 1);
        }
        var str2 = this.value.substring(offset, this.selectionEnd);
        return this._finishDeduceEditorPosition(this.selectionEndPosition, str2, -1);
    };
    TextAreaState.prototype._finishDeduceEditorPosition = function (anchor, deltaText, signum) {
        var lineFeedCnt = 0;
        var lastLineFeedIndex = -1;
        while ((lastLineFeedIndex = deltaText.indexOf('\n', lastLineFeedIndex + 1)) !== -1) {
            lineFeedCnt++;
        }
        return [anchor, signum * deltaText.length, lineFeedCnt];
    };
    TextAreaState.selectedText = function (text) {
        return new TextAreaState(text, 0, text.length, null, null);
    };
    TextAreaState.deduceInput = function (previousState, currentState, couldBeEmojiInput, couldBeTypingAtOffset0) {
        if (!previousState) {
            // This is the EMPTY state
            return {
                text: '',
                replaceCharCnt: 0
            };
        }
        // console.log('------------------------deduceInput');
        // console.log('PREVIOUS STATE: ' + previousState.toString());
        // console.log('CURRENT STATE: ' + currentState.toString());
        var previousValue = previousState.value;
        var previousSelectionStart = previousState.selectionStart;
        var previousSelectionEnd = previousState.selectionEnd;
        var currentValue = currentState.value;
        var currentSelectionStart = currentState.selectionStart;
        var currentSelectionEnd = currentState.selectionEnd;
        if (couldBeTypingAtOffset0 && previousValue.length > 0 && previousSelectionStart === previousSelectionEnd && currentSelectionStart === currentSelectionEnd) {
            // See https://github.com/Microsoft/vscode/issues/42251
            // where typing always happens at offset 0 in the textarea
            // when using a custom title area in OSX and moving the window
            if (strings.endsWith(currentValue, previousValue)) {
                // Looks like something was typed at offset 0
                // ==> pretend we placed the cursor at offset 0 to begin with...
                previousSelectionStart = 0;
                previousSelectionEnd = 0;
            }
        }
        // Strip the previous suffix from the value (without interfering with the current selection)
        var previousSuffix = previousValue.substring(previousSelectionEnd);
        var currentSuffix = currentValue.substring(currentSelectionEnd);
        var suffixLength = strings.commonSuffixLength(previousSuffix, currentSuffix);
        currentValue = currentValue.substring(0, currentValue.length - suffixLength);
        previousValue = previousValue.substring(0, previousValue.length - suffixLength);
        var previousPrefix = previousValue.substring(0, previousSelectionStart);
        var currentPrefix = currentValue.substring(0, currentSelectionStart);
        var prefixLength = strings.commonPrefixLength(previousPrefix, currentPrefix);
        currentValue = currentValue.substring(prefixLength);
        previousValue = previousValue.substring(prefixLength);
        currentSelectionStart -= prefixLength;
        previousSelectionStart -= prefixLength;
        currentSelectionEnd -= prefixLength;
        previousSelectionEnd -= prefixLength;
        // console.log('AFTER DIFFING PREVIOUS STATE: <' + previousValue + '>, selectionStart: ' + previousSelectionStart + ', selectionEnd: ' + previousSelectionEnd);
        // console.log('AFTER DIFFING CURRENT STATE: <' + currentValue + '>, selectionStart: ' + currentSelectionStart + ', selectionEnd: ' + currentSelectionEnd);
        if (couldBeEmojiInput && currentSelectionStart === currentSelectionEnd && previousValue.length > 0) {
            // on OSX, emojis from the emoji picker are inserted at random locations
            // the only hints we can use is that the selection is immediately after the inserted emoji
            // and that none of the old text has been deleted
            var potentialEmojiInput = null;
            if (currentSelectionStart === currentValue.length) {
                // emoji potentially inserted "somewhere" after the previous selection => it should appear at the end of `currentValue`
                if (strings.startsWith(currentValue, previousValue)) {
                    // only if all of the old text is accounted for
                    potentialEmojiInput = currentValue.substring(previousValue.length);
                }
            }
            else {
                // emoji potentially inserted "somewhere" before the previous selection => it should appear at the start of `currentValue`
                if (strings.endsWith(currentValue, previousValue)) {
                    // only if all of the old text is accounted for
                    potentialEmojiInput = currentValue.substring(0, currentValue.length - previousValue.length);
                }
            }
            if (potentialEmojiInput !== null && potentialEmojiInput.length > 0) {
                // now we check that this is indeed an emoji
                // emojis can grow quite long, so a length check is of no help
                // e.g. 1F3F4 E0067 E0062 E0065 E006E E0067 E007F  ; fully-qualified     # 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
                // Oftentimes, emojis use Variation Selector-16 (U+FE0F), so that is a good hint
                // http://emojipedia.org/variation-selector-16/
                // > An invisible codepoint which specifies that the preceding character
                // > should be displayed with emoji presentation. Only required if the
                // > preceding character defaults to text presentation.
                if (/\uFE0F/.test(potentialEmojiInput) || strings.containsEmoji(potentialEmojiInput)) {
                    return {
                        text: potentialEmojiInput,
                        replaceCharCnt: 0
                    };
                }
            }
        }
        if (currentSelectionStart === currentSelectionEnd) {
            // composition accept case (noticed in FF + Japanese)
            // [blahblah] => blahblah|
            if (previousValue === currentValue
                && previousSelectionStart === 0
                && previousSelectionEnd === previousValue.length
                && currentSelectionStart === currentValue.length
                && currentValue.indexOf('\n') === -1) {
                if (strings.containsFullWidthCharacter(currentValue)) {
                    return {
                        text: '',
                        replaceCharCnt: 0
                    };
                }
            }
            // no current selection
            var replacePreviousCharacters_1 = (previousPrefix.length - prefixLength);
            // console.log('REMOVE PREVIOUS: ' + (previousPrefix.length - prefixLength) + ' chars');
            return {
                text: currentValue,
                replaceCharCnt: replacePreviousCharacters_1
            };
        }
        // there is a current selection => composition case
        var replacePreviousCharacters = previousSelectionEnd - previousSelectionStart;
        return {
            text: currentValue,
            replaceCharCnt: replacePreviousCharacters
        };
    };
    TextAreaState.EMPTY = new TextAreaState('', 0, 0, null, null);
    return TextAreaState;
}());
export { TextAreaState };
var PagedScreenReaderStrategy = /** @class */ (function () {
    function PagedScreenReaderStrategy() {
    }
    PagedScreenReaderStrategy._getPageOfLine = function (lineNumber) {
        return Math.floor((lineNumber - 1) / PagedScreenReaderStrategy._LINES_PER_PAGE);
    };
    PagedScreenReaderStrategy._getRangeForPage = function (page) {
        var offset = page * PagedScreenReaderStrategy._LINES_PER_PAGE;
        var startLineNumber = offset + 1;
        var endLineNumber = offset + PagedScreenReaderStrategy._LINES_PER_PAGE;
        return new Range(startLineNumber, 1, endLineNumber + 1, 1);
    };
    PagedScreenReaderStrategy.fromEditorSelection = function (previousState, model, selection, trimLongText) {
        var selectionStartPage = PagedScreenReaderStrategy._getPageOfLine(selection.startLineNumber);
        var selectionStartPageRange = PagedScreenReaderStrategy._getRangeForPage(selectionStartPage);
        var selectionEndPage = PagedScreenReaderStrategy._getPageOfLine(selection.endLineNumber);
        var selectionEndPageRange = PagedScreenReaderStrategy._getRangeForPage(selectionEndPage);
        var pretextRange = selectionStartPageRange.intersectRanges(new Range(1, 1, selection.startLineNumber, selection.startColumn));
        var pretext = model.getValueInRange(pretextRange, EndOfLinePreference.LF);
        var lastLine = model.getLineCount();
        var lastLineMaxColumn = model.getLineMaxColumn(lastLine);
        var posttextRange = selectionEndPageRange.intersectRanges(new Range(selection.endLineNumber, selection.endColumn, lastLine, lastLineMaxColumn));
        var posttext = model.getValueInRange(posttextRange, EndOfLinePreference.LF);
        var text = null;
        if (selectionStartPage === selectionEndPage || selectionStartPage + 1 === selectionEndPage) {
            // take full selection
            text = model.getValueInRange(selection, EndOfLinePreference.LF);
        }
        else {
            var selectionRange1 = selectionStartPageRange.intersectRanges(selection);
            var selectionRange2 = selectionEndPageRange.intersectRanges(selection);
            text = (model.getValueInRange(selectionRange1, EndOfLinePreference.LF)
                + String.fromCharCode(8230)
                + model.getValueInRange(selectionRange2, EndOfLinePreference.LF));
        }
        // Chromium handles very poorly text even of a few thousand chars
        // Cut text to avoid stalling the entire UI
        if (trimLongText) {
            var LIMIT_CHARS = 500;
            if (pretext.length > LIMIT_CHARS) {
                pretext = pretext.substring(pretext.length - LIMIT_CHARS, pretext.length);
            }
            if (posttext.length > LIMIT_CHARS) {
                posttext = posttext.substring(0, LIMIT_CHARS);
            }
            if (text.length > 2 * LIMIT_CHARS) {
                text = text.substring(0, LIMIT_CHARS) + String.fromCharCode(8230) + text.substring(text.length - LIMIT_CHARS, text.length);
            }
        }
        return new TextAreaState(pretext + text + posttext, pretext.length, pretext.length + text.length, new Position(selection.startLineNumber, selection.startColumn), new Position(selection.endLineNumber, selection.endColumn));
    };
    PagedScreenReaderStrategy._LINES_PER_PAGE = 10;
    return PagedScreenReaderStrategy;
}());
export { PagedScreenReaderStrategy };
