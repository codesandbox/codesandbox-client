/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { matchesFuzzy } from './filters.js';
import { ltrim } from './strings.js';
var octiconStartMarker = '$(';
export function parseOcticons(text) {
    var firstOcticonIndex = text.indexOf(octiconStartMarker);
    if (firstOcticonIndex === -1) {
        return { text: text }; // return early if the word does not include an octicon
    }
    return doParseOcticons(text, firstOcticonIndex);
}
function doParseOcticons(text, firstOcticonIndex) {
    var octiconOffsets = [];
    var textWithoutOcticons = '';
    function appendChars(chars) {
        if (chars) {
            textWithoutOcticons += chars;
            for (var i = 0; i < chars.length; i++) {
                octiconOffsets.push(octiconsOffset); // make sure to fill in octicon offsets
            }
        }
    }
    var currentOcticonStart = -1;
    var currentOcticonValue = '';
    var octiconsOffset = 0;
    var char;
    var nextChar;
    var offset = firstOcticonIndex;
    var length = text.length;
    // Append all characters until the first octicon
    appendChars(text.substr(0, firstOcticonIndex));
    // example: $(file-symlink-file) my cool $(other-octicon) entry
    while (offset < length) {
        char = text[offset];
        nextChar = text[offset + 1];
        // beginning of octicon: some value $( <--
        if (char === octiconStartMarker[0] && nextChar === octiconStartMarker[1]) {
            currentOcticonStart = offset;
            // if we had a previous potential octicon value without
            // the closing ')', it was actually not an octicon and
            // so we have to add it to the actual value
            appendChars(currentOcticonValue);
            currentOcticonValue = octiconStartMarker;
            offset++; // jump over '('
        }
        // end of octicon: some value $(some-octicon) <--
        else if (char === ')' && currentOcticonStart !== -1) {
            var currentOcticonLength = offset - currentOcticonStart + 1; // +1 to include the closing ')'
            octiconsOffset += currentOcticonLength;
            currentOcticonStart = -1;
            currentOcticonValue = '';
        }
        // within octicon
        else if (currentOcticonStart !== -1) {
            currentOcticonValue += char;
        }
        // any value outside of octicons
        else {
            appendChars(char);
        }
        offset++;
    }
    // if we had a previous potential octicon value without
    // the closing ')', it was actually not an octicon and
    // so we have to add it to the actual value
    appendChars(currentOcticonValue);
    return { text: textWithoutOcticons, octiconOffsets: octiconOffsets };
}
export function matchesFuzzyOcticonAware(query, target, enableSeparateSubstringMatching) {
    if (enableSeparateSubstringMatching === void 0) { enableSeparateSubstringMatching = false; }
    var text = target.text, octiconOffsets = target.octiconOffsets;
    // Return early if there are no octicon markers in the word to match against
    if (!octiconOffsets || octiconOffsets.length === 0) {
        return matchesFuzzy(query, text, enableSeparateSubstringMatching);
    }
    // Trim the word to match against because it could have leading
    // whitespace now if the word started with an octicon
    var wordToMatchAgainstWithoutOcticonsTrimmed = ltrim(text, ' ');
    var leadingWhitespaceOffset = text.length - wordToMatchAgainstWithoutOcticonsTrimmed.length;
    // match on value without octicons
    var matches = matchesFuzzy(query, wordToMatchAgainstWithoutOcticonsTrimmed, enableSeparateSubstringMatching);
    // Map matches back to offsets with octicons and trimming
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            var octiconOffset = octiconOffsets[matches[i].start + leadingWhitespaceOffset] /* octicon offsets at index */ + leadingWhitespaceOffset /* overall leading whitespace offset */;
            matches[i].start += octiconOffset;
            matches[i].end += octiconOffset;
        }
    }
    return matches;
}
