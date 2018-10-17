/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createScanner as createJSONScanner } from '../../../../base/common/json.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
var SmartSnippetInserter = /** @class */ (function () {
    function SmartSnippetInserter() {
    }
    SmartSnippetInserter.hasOpenBrace = function (scanner) {
        while (scanner.scan() !== 16 /* EOF */) {
            var kind = scanner.getToken();
            if (kind === 1 /* OpenBraceToken */) {
                return true;
            }
        }
        return false;
    };
    SmartSnippetInserter.offsetToPosition = function (model, offset) {
        var offsetBeforeLine = 0;
        var eolLength = model.getEOL().length;
        var lineCount = model.getLineCount();
        for (var lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
            var lineTotalLength = model.getLineContent(lineNumber).length + eolLength;
            var offsetAfterLine = offsetBeforeLine + lineTotalLength;
            if (offsetAfterLine > offset) {
                return new Position(lineNumber, offset - offsetBeforeLine + 1);
            }
            offsetBeforeLine = offsetAfterLine;
        }
        return new Position(lineCount, model.getLineMaxColumn(lineCount));
    };
    SmartSnippetInserter.insertSnippet = function (model, _position) {
        var desiredPosition = model.getValueLengthInRange(new Range(1, 1, _position.lineNumber, _position.column));
        // <INVALID> [ <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT>, <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT> ] <INVALID>
        var State;
        (function (State) {
            State[State["INVALID"] = 0] = "INVALID";
            State[State["AFTER_OBJECT"] = 1] = "AFTER_OBJECT";
            State[State["BEFORE_OBJECT"] = 2] = "BEFORE_OBJECT";
        })(State || (State = {}));
        var currentState = State.INVALID;
        var lastValidPos = -1;
        var lastValidState = State.INVALID;
        var scanner = createJSONScanner(model.getValue());
        var arrayLevel = 0;
        var objLevel = 0;
        var checkRangeStatus = function (pos, state) {
            if (state !== State.INVALID && arrayLevel === 1 && objLevel === 0) {
                currentState = state;
                lastValidPos = pos;
                lastValidState = state;
            }
            else {
                if (currentState !== State.INVALID) {
                    currentState = State.INVALID;
                    lastValidPos = scanner.getTokenOffset();
                }
            }
        };
        while (scanner.scan() !== 16 /* EOF */) {
            var currentPos = scanner.getPosition();
            var kind = scanner.getToken();
            var goodKind = false;
            switch (kind) {
                case 3 /* OpenBracketToken */:
                    goodKind = true;
                    arrayLevel++;
                    checkRangeStatus(currentPos, State.BEFORE_OBJECT);
                    break;
                case 4 /* CloseBracketToken */:
                    goodKind = true;
                    arrayLevel--;
                    checkRangeStatus(currentPos, State.INVALID);
                    break;
                case 5 /* CommaToken */:
                    goodKind = true;
                    checkRangeStatus(currentPos, State.BEFORE_OBJECT);
                    break;
                case 1 /* OpenBraceToken */:
                    goodKind = true;
                    objLevel++;
                    checkRangeStatus(currentPos, State.INVALID);
                    break;
                case 2 /* CloseBraceToken */:
                    goodKind = true;
                    objLevel--;
                    checkRangeStatus(currentPos, State.AFTER_OBJECT);
                    break;
                case 15 /* Trivia */:
                case 14 /* LineBreakTrivia */:
                    goodKind = true;
            }
            if (currentPos >= desiredPosition && (currentState !== State.INVALID || lastValidPos !== -1)) {
                var acceptPosition = void 0;
                var acceptState = void 0;
                if (currentState !== State.INVALID) {
                    acceptPosition = (goodKind ? currentPos : scanner.getTokenOffset());
                    acceptState = currentState;
                }
                else {
                    acceptPosition = lastValidPos;
                    acceptState = lastValidState;
                }
                if (acceptState === State.AFTER_OBJECT) {
                    return {
                        position: this.offsetToPosition(model, acceptPosition),
                        prepend: ',',
                        append: ''
                    };
                }
                else {
                    scanner.setPosition(acceptPosition);
                    return {
                        position: this.offsetToPosition(model, acceptPosition),
                        prepend: '',
                        append: this.hasOpenBrace(scanner) ? ',' : ''
                    };
                }
            }
        }
        // no valid position found!
        var modelLineCount = model.getLineCount();
        return {
            position: new Position(modelLineCount, model.getLineMaxColumn(modelLineCount)),
            prepend: '\n[',
            append: ']'
        };
    };
    return SmartSnippetInserter;
}());
export { SmartSnippetInserter };
