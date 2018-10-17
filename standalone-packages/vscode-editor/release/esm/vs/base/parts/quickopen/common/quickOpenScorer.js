/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { compareAnything } from '../../../common/comparers.js';
import { matchesPrefix, createMatches, matchesCamelCase, isUpper } from '../../../common/filters.js';
import { nativeSep } from '../../../common/paths.js';
import { isWindows, isLinux } from '../../../common/platform.js';
import { stripWildcards, equalsIgnoreCase } from '../../../common/strings.js';
var NO_MATCH = 0;
var NO_SCORE = [NO_MATCH, []];
// const DEBUG = false;
// const DEBUG_MATRIX = false;
export function score(target, query, queryLower, fuzzy) {
    if (!target || !query) {
        return NO_SCORE; // return early if target or query are undefined
    }
    var targetLength = target.length;
    var queryLength = query.length;
    if (targetLength < queryLength) {
        return NO_SCORE; // impossible for query to be contained in target
    }
    // if (DEBUG) {
    // 	console.group(`Target: ${target}, Query: ${query}`);
    // }
    var targetLower = target.toLowerCase();
    // When not searching fuzzy, we require the query to be contained fully
    // in the target string contiguously.
    if (!fuzzy) {
        var indexOfQueryInTarget = targetLower.indexOf(queryLower);
        if (indexOfQueryInTarget === -1) {
            // if (DEBUG) {
            // 	console.log(`Characters not matching consecutively ${queryLower} within ${targetLower}`);
            // }
            return NO_SCORE;
        }
    }
    var res = doScore(query, queryLower, queryLength, target, targetLower, targetLength);
    // if (DEBUG) {
    // 	console.log(`%cFinal Score: ${res[0]}`, 'font-weight: bold');
    // 	console.groupEnd();
    // }
    return res;
}
function doScore(query, queryLower, queryLength, target, targetLower, targetLength) {
    var scores = [];
    var matches = [];
    //
    // Build Scorer Matrix:
    //
    // The matrix is composed of query q and target t. For each index we score
    // q[i] with t[i] and compare that with the previous score. If the score is
    // equal or larger, we keep the match. In addition to the score, we also keep
    // the length of the consecutive matches to use as boost for the score.
    //
    //      t   a   r   g   e   t
    //  q
    //  u
    //  e
    //  r
    //  y
    //
    for (var queryIndex_1 = 0; queryIndex_1 < queryLength; queryIndex_1++) {
        for (var targetIndex_1 = 0; targetIndex_1 < targetLength; targetIndex_1++) {
            var currentIndex = queryIndex_1 * targetLength + targetIndex_1;
            var leftIndex = currentIndex - 1;
            var diagIndex = (queryIndex_1 - 1) * targetLength + targetIndex_1 - 1;
            var leftScore = targetIndex_1 > 0 ? scores[leftIndex] : 0;
            var diagScore = queryIndex_1 > 0 && targetIndex_1 > 0 ? scores[diagIndex] : 0;
            var matchesSequenceLength = queryIndex_1 > 0 && targetIndex_1 > 0 ? matches[diagIndex] : 0;
            // If we are not matching on the first query character any more, we only produce a
            // score if we had a score previously for the last query index (by looking at the diagScore).
            // This makes sure that the query always matches in sequence on the target. For example
            // given a target of "ede" and a query of "de", we would otherwise produce a wrong high score
            // for query[1] ("e") matching on target[0] ("e") because of the "beginning of word" boost.
            var score_1 = void 0;
            if (!diagScore && queryIndex_1 > 0) {
                score_1 = 0;
            }
            else {
                score_1 = computeCharScore(query, queryLower, queryIndex_1, target, targetLower, targetIndex_1, matchesSequenceLength);
            }
            // We have a score and its equal or larger than the left score
            // Match: sequence continues growing from previous diag value
            // Score: increases by diag score value
            if (score_1 && diagScore + score_1 >= leftScore) {
                matches[currentIndex] = matchesSequenceLength + 1;
                scores[currentIndex] = diagScore + score_1;
            }
            // We either have no score or the score is lower than the left score
            // Match: reset to 0
            // Score: pick up from left hand side
            else {
                matches[currentIndex] = NO_MATCH;
                scores[currentIndex] = leftScore;
            }
        }
    }
    // Restore Positions (starting from bottom right of matrix)
    var positions = [];
    var queryIndex = queryLength - 1;
    var targetIndex = targetLength - 1;
    while (queryIndex >= 0 && targetIndex >= 0) {
        var currentIndex = queryIndex * targetLength + targetIndex;
        var match = matches[currentIndex];
        if (match === NO_MATCH) {
            targetIndex--; // go left
        }
        else {
            positions.push(targetIndex);
            // go up and left
            queryIndex--;
            targetIndex--;
        }
    }
    // Print matrix
    // if (DEBUG_MATRIX) {
    // printMatrix(query, target, matches, scores);
    // }
    return [scores[queryLength * targetLength - 1], positions.reverse()];
}
function computeCharScore(query, queryLower, queryIndex, target, targetLower, targetIndex, matchesSequenceLength) {
    var score = 0;
    if (queryLower[queryIndex] !== targetLower[targetIndex]) {
        return score; // no match of characters
    }
    // Character match bonus
    score += 1;
    // if (DEBUG) {
    // 	console.groupCollapsed(`%cCharacter match bonus: +1 (char: ${queryLower[queryIndex]} at index ${targetIndex}, total score: ${score})`, 'font-weight: normal');
    // }
    // Consecutive match bonus
    if (matchesSequenceLength > 0) {
        score += (matchesSequenceLength * 5);
        // if (DEBUG) {
        // 	console.log('Consecutive match bonus: ' + (matchesSequenceLength * 5));
        // }
    }
    // Same case bonus
    if (query[queryIndex] === target[targetIndex]) {
        score += 1;
        // if (DEBUG) {
        // 	console.log('Same case bonus: +1');
        // }
    }
    // Start of word bonus
    if (targetIndex === 0) {
        score += 8;
        // if (DEBUG) {
        // 	console.log('Start of word bonus: +8');
        // }
    }
    else {
        // After separator bonus
        var separatorBonus = scoreSeparatorAtPos(target.charCodeAt(targetIndex - 1));
        if (separatorBonus) {
            score += separatorBonus;
            // if (DEBUG) {
            // 	console.log('After separtor bonus: +4');
            // }
        }
        // Inside word upper case bonus (camel case)
        else if (isUpper(target.charCodeAt(targetIndex))) {
            score += 1;
            // if (DEBUG) {
            // 	console.log('Inside word upper case bonus: +1');
            // }
        }
    }
    // if (DEBUG) {
    // 	console.groupEnd();
    // }
    return score;
}
function scoreSeparatorAtPos(charCode) {
    switch (charCode) {
        case 47 /* Slash */:
        case 92 /* Backslash */:
            return 5; // prefer path separators...
        case 95 /* Underline */:
        case 45 /* Dash */:
        case 46 /* Period */:
        case 32 /* Space */:
        case 39 /* SingleQuote */:
        case 34 /* DoubleQuote */:
        case 58 /* Colon */:
            return 4; // ...over other separators
        default:
            return 0;
    }
}
var NO_ITEM_SCORE = Object.freeze({ score: 0 });
var PATH_IDENTITY_SCORE = 1 << 18;
var LABEL_PREFIX_SCORE = 1 << 17;
var LABEL_CAMELCASE_SCORE = 1 << 16;
var LABEL_SCORE_THRESHOLD = 1 << 15;
/**
 * Helper function to prepare a search value for scoring in quick open by removing unwanted characters.
 */
export function prepareQuery(original) {
    var lowercase;
    var containsPathSeparator;
    var value;
    if (original) {
        value = stripWildcards(original).replace(/\s/g, ''); // get rid of all wildcards and whitespace
        if (isWindows) {
            value = value.replace(/\//g, nativeSep); // Help Windows users to search for paths when using slash
        }
        lowercase = value.toLowerCase();
        containsPathSeparator = value.indexOf(nativeSep) >= 0;
    }
    return { original: original, value: value, lowercase: lowercase, containsPathSeparator: containsPathSeparator };
}
export function scoreItem(item, query, fuzzy, accessor, cache) {
    if (!item || !query.value) {
        return NO_ITEM_SCORE; // we need an item and query to score on at least
    }
    var label = accessor.getItemLabel(item);
    if (!label) {
        return NO_ITEM_SCORE; // we need a label at least
    }
    var description = accessor.getItemDescription(item);
    var cacheHash;
    if (description) {
        cacheHash = "" + label + description + query.value + fuzzy;
    }
    else {
        cacheHash = "" + label + query.value + fuzzy;
    }
    var cached = cache[cacheHash];
    if (cached) {
        return cached;
    }
    var itemScore = doScoreItem(label, description, accessor.getItemPath(item), query, fuzzy);
    cache[cacheHash] = itemScore;
    return itemScore;
}
function doScoreItem(label, description, path, query, fuzzy) {
    // 1.) treat identity matches on full path highest
    if (path && isLinux ? query.original === path : equalsIgnoreCase(query.original, path)) {
        return { score: PATH_IDENTITY_SCORE, labelMatch: [{ start: 0, end: label.length }], descriptionMatch: description ? [{ start: 0, end: description.length }] : void 0 };
    }
    // We only consider label matches if the query is not including file path separators
    var preferLabelMatches = !path || !query.containsPathSeparator;
    if (preferLabelMatches) {
        // 2.) treat prefix matches on the label second highest
        var prefixLabelMatch = matchesPrefix(query.value, label);
        if (prefixLabelMatch) {
            return { score: LABEL_PREFIX_SCORE, labelMatch: prefixLabelMatch };
        }
        // 3.) treat camelcase matches on the label third highest
        var camelcaseLabelMatch = matchesCamelCase(query.value, label);
        if (camelcaseLabelMatch) {
            return { score: LABEL_CAMELCASE_SCORE, labelMatch: camelcaseLabelMatch };
        }
        // 4.) prefer scores on the label if any
        var _a = score(label, query.value, query.lowercase, fuzzy), labelScore = _a[0], labelPositions = _a[1];
        if (labelScore) {
            return { score: labelScore + LABEL_SCORE_THRESHOLD, labelMatch: createMatches(labelPositions) };
        }
    }
    // 5.) finally compute description + label scores if we have a description
    if (description) {
        var descriptionPrefix = description;
        if (!!path) {
            descriptionPrefix = "" + description + nativeSep; // assume this is a file path
        }
        var descriptionPrefixLength_1 = descriptionPrefix.length;
        var descriptionAndLabel = "" + descriptionPrefix + label;
        var _b = score(descriptionAndLabel, query.value, query.lowercase, fuzzy), labelDescriptionScore = _b[0], labelDescriptionPositions = _b[1];
        if (labelDescriptionScore) {
            var labelDescriptionMatches = createMatches(labelDescriptionPositions);
            var labelMatch_1 = [];
            var descriptionMatch_1 = [];
            // We have to split the matches back onto the label and description portions
            labelDescriptionMatches.forEach(function (h) {
                // Match overlaps label and description part, we need to split it up
                if (h.start < descriptionPrefixLength_1 && h.end > descriptionPrefixLength_1) {
                    labelMatch_1.push({ start: 0, end: h.end - descriptionPrefixLength_1 });
                    descriptionMatch_1.push({ start: h.start, end: descriptionPrefixLength_1 });
                }
                // Match on label part
                else if (h.start >= descriptionPrefixLength_1) {
                    labelMatch_1.push({ start: h.start - descriptionPrefixLength_1, end: h.end - descriptionPrefixLength_1 });
                }
                // Match on description part
                else {
                    descriptionMatch_1.push(h);
                }
            });
            return { score: labelDescriptionScore, labelMatch: labelMatch_1, descriptionMatch: descriptionMatch_1 };
        }
    }
    return NO_ITEM_SCORE;
}
export function compareItemsByScore(itemA, itemB, query, fuzzy, accessor, cache, fallbackComparer) {
    if (fallbackComparer === void 0) { fallbackComparer = fallbackCompare; }
    var itemScoreA = scoreItem(itemA, query, fuzzy, accessor, cache);
    var itemScoreB = scoreItem(itemB, query, fuzzy, accessor, cache);
    var scoreA = itemScoreA.score;
    var scoreB = itemScoreB.score;
    // 1.) prefer identity matches
    if (scoreA === PATH_IDENTITY_SCORE || scoreB === PATH_IDENTITY_SCORE) {
        if (scoreA !== scoreB) {
            return scoreA === PATH_IDENTITY_SCORE ? -1 : 1;
        }
    }
    // 2.) prefer label prefix matches
    if (scoreA === LABEL_PREFIX_SCORE || scoreB === LABEL_PREFIX_SCORE) {
        if (scoreA !== scoreB) {
            return scoreA === LABEL_PREFIX_SCORE ? -1 : 1;
        }
        var labelA = accessor.getItemLabel(itemA);
        var labelB = accessor.getItemLabel(itemB);
        // prefer shorter names when both match on label prefix
        if (labelA.length !== labelB.length) {
            return labelA.length - labelB.length;
        }
    }
    // 3.) prefer camelcase matches
    if (scoreA === LABEL_CAMELCASE_SCORE || scoreB === LABEL_CAMELCASE_SCORE) {
        if (scoreA !== scoreB) {
            return scoreA === LABEL_CAMELCASE_SCORE ? -1 : 1;
        }
        var labelA = accessor.getItemLabel(itemA);
        var labelB = accessor.getItemLabel(itemB);
        // prefer more compact camel case matches over longer
        var comparedByMatchLength = compareByMatchLength(itemScoreA.labelMatch, itemScoreB.labelMatch);
        if (comparedByMatchLength !== 0) {
            return comparedByMatchLength;
        }
        // prefer shorter names when both match on label camelcase
        if (labelA.length !== labelB.length) {
            return labelA.length - labelB.length;
        }
    }
    // 4.) prefer label scores
    if (scoreA > LABEL_SCORE_THRESHOLD || scoreB > LABEL_SCORE_THRESHOLD) {
        if (scoreB < LABEL_SCORE_THRESHOLD) {
            return -1;
        }
        if (scoreA < LABEL_SCORE_THRESHOLD) {
            return 1;
        }
    }
    // 5.) compare by score
    if (scoreA !== scoreB) {
        return scoreA > scoreB ? -1 : 1;
    }
    // 6.) scores are identical, prefer more compact matches (label and description)
    var itemAMatchDistance = computeLabelAndDescriptionMatchDistance(itemA, itemScoreA, accessor);
    var itemBMatchDistance = computeLabelAndDescriptionMatchDistance(itemB, itemScoreB, accessor);
    if (itemAMatchDistance && itemBMatchDistance && itemAMatchDistance !== itemBMatchDistance) {
        return itemBMatchDistance > itemAMatchDistance ? -1 : 1;
    }
    // 7.) at this point, scores are identical and match compactness as well
    // for both items so we start to use the fallback compare
    return fallbackComparer(itemA, itemB, query, accessor);
}
function computeLabelAndDescriptionMatchDistance(item, score, accessor) {
    var hasLabelMatches = (score.labelMatch && score.labelMatch.length);
    var hasDescriptionMatches = (score.descriptionMatch && score.descriptionMatch.length);
    var matchStart = -1;
    var matchEnd = -1;
    // If we have description matches, the start is first of description match
    if (hasDescriptionMatches) {
        matchStart = score.descriptionMatch[0].start;
    }
    // Otherwise, the start is the first label match
    else if (hasLabelMatches) {
        matchStart = score.labelMatch[0].start;
    }
    // If we have label match, the end is the last label match
    // If we had a description match, we add the length of the description
    // as offset to the end to indicate this.
    if (hasLabelMatches) {
        matchEnd = score.labelMatch[score.labelMatch.length - 1].end;
        if (hasDescriptionMatches) {
            var itemDescription = accessor.getItemDescription(item);
            if (itemDescription) {
                matchEnd += itemDescription.length;
            }
        }
    }
    // If we have just a description match, the end is the last description match
    else if (hasDescriptionMatches) {
        matchEnd = score.descriptionMatch[score.descriptionMatch.length - 1].end;
    }
    return matchEnd - matchStart;
}
function compareByMatchLength(matchesA, matchesB) {
    if ((!matchesA && !matchesB) || (!matchesA.length && !matchesB.length)) {
        return 0; // make sure to not cause bad comparing when matches are not provided
    }
    if (!matchesB || !matchesB.length) {
        return -1;
    }
    if (!matchesA || !matchesA.length) {
        return 1;
    }
    // Compute match length of A (first to last match)
    var matchStartA = matchesA[0].start;
    var matchEndA = matchesA[matchesA.length - 1].end;
    var matchLengthA = matchEndA - matchStartA;
    // Compute match length of B (first to last match)
    var matchStartB = matchesB[0].start;
    var matchEndB = matchesB[matchesB.length - 1].end;
    var matchLengthB = matchEndB - matchStartB;
    // Prefer shorter match length
    return matchLengthA === matchLengthB ? 0 : matchLengthB < matchLengthA ? 1 : -1;
}
export function fallbackCompare(itemA, itemB, query, accessor) {
    // check for label + description length and prefer shorter
    var labelA = accessor.getItemLabel(itemA);
    var labelB = accessor.getItemLabel(itemB);
    var descriptionA = accessor.getItemDescription(itemA);
    var descriptionB = accessor.getItemDescription(itemB);
    var labelDescriptionALength = labelA.length + (descriptionA ? descriptionA.length : 0);
    var labelDescriptionBLength = labelB.length + (descriptionB ? descriptionB.length : 0);
    if (labelDescriptionALength !== labelDescriptionBLength) {
        return labelDescriptionALength - labelDescriptionBLength;
    }
    // check for path length and prefer shorter
    var pathA = accessor.getItemPath(itemA);
    var pathB = accessor.getItemPath(itemB);
    if (pathA && pathB && pathA.length !== pathB.length) {
        return pathA.length - pathB.length;
    }
    // 7.) finally we have equal scores and equal length, we fallback to comparer
    // compare by label
    if (labelA !== labelB) {
        return compareAnything(labelA, labelB, query.value);
    }
    // compare by description
    if (descriptionA && descriptionB && descriptionA !== descriptionB) {
        return compareAnything(descriptionA, descriptionB, query.value);
    }
    // compare by path
    if (pathA && pathB && pathA !== pathB) {
        return compareAnything(pathA, pathB, query.value);
    }
    // equal
    return 0;
}
