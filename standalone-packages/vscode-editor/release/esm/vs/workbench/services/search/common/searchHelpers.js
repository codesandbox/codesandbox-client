/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Range } from '../../../../editor/common/core/range.js';
import { TextSearchMatch } from '../../../../platform/search/common/search.js';
function editorMatchToTextSearchResult(matches, model, previewOptions) {
    var firstLine = matches[0].range.startLineNumber;
    var lastLine = matches[matches.length - 1].range.endLineNumber;
    var lineTexts = [];
    var numLines = (previewOptions && matches.length === 1) ? previewOptions.matchLines : Number.MAX_VALUE;
    for (var i = firstLine; i <= lastLine && (i - firstLine) < numLines; i++) {
        lineTexts.push(model.getLineContent(i));
    }
    return new TextSearchMatch(lineTexts.join('\n') + '\n', matches.map(function (m) { return new Range(m.range.startLineNumber - 1, m.range.startColumn - 1, m.range.endLineNumber - 1, m.range.endColumn - 1); }), previewOptions);
}
/**
 * Combine a set of FindMatches into a set of TextSearchResults. They should be grouped by matches that start on the same line that the previous match ends on.
 */
export function editorMatchesToTextSearchResults(matches, model, previewOptions) {
    var previousEndLine = -1;
    var groupedMatches = [];
    var currentMatches = [];
    matches.forEach(function (match) {
        if (match.range.startLineNumber !== previousEndLine) {
            currentMatches = [];
            groupedMatches.push(currentMatches);
        }
        currentMatches.push(match);
        previousEndLine = match.range.endLineNumber;
    });
    return groupedMatches.map(function (sameLineMatches) {
        return editorMatchToTextSearchResult(sameLineMatches, model, previewOptions);
    });
}
export function addContextToEditorMatches(matches, model, query) {
    var results = [];
    var prevLine = -1;
    for (var i = 0; i < matches.length; i++) {
        var _a = getMatchStartEnd(matches[i]), matchStartLine = _a.start, matchEndLine = _a.end;
        if (typeof query.beforeContext === 'number' && query.beforeContext > 0) {
            var beforeContextStartLine = Math.max(prevLine + 1, matchStartLine - query.beforeContext);
            for (var b = beforeContextStartLine; b < matchStartLine; b++) {
                results.push({
                    text: model.getLineContent(b + 1),
                    lineNumber: b
                });
            }
        }
        results.push(matches[i]);
        var nextMatch = matches[i + 1];
        var nextMatchStartLine = nextMatch ? getMatchStartEnd(nextMatch).start : Number.MAX_VALUE;
        if (typeof query.afterContext === 'number' && query.afterContext > 0) {
            var afterContextToLine = Math.min(nextMatchStartLine - 1, matchEndLine + query.afterContext, model.getLineCount() - 1);
            for (var a = matchEndLine + 1; a <= afterContextToLine; a++) {
                results.push({
                    text: model.getLineContent(a + 1),
                    lineNumber: a
                });
            }
        }
        prevLine = matchEndLine;
    }
    return results;
}
function getMatchStartEnd(match) {
    var matchRanges = match.ranges;
    var matchStartLine = Array.isArray(matchRanges) ? matchRanges[0].startLineNumber : matchRanges.startLineNumber;
    var matchEndLine = Array.isArray(matchRanges) ? matchRanges[matchRanges.length - 1].endLineNumber : matchRanges.endLineNumber;
    return {
        start: matchStartLine,
        end: matchEndLine
    };
}
