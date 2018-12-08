/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Describes what to do with the indentation when pressing Enter.
 */
export var IndentAction;
(function (IndentAction) {
    /**
     * Insert new line and copy the previous line's indentation.
     */
    IndentAction[IndentAction["None"] = 0] = "None";
    /**
     * Insert new line and indent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    /**
     * Insert two new lines:
     *  - the first one indented which will hold the cursor
     *  - the second one at the same indentation level
     */
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    /**
     * Insert new line and outdent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction || (IndentAction = {}));
/**
 * @internal
 */
var StandardAutoClosingPairConditional = /** @class */ (function () {
    function StandardAutoClosingPairConditional(source) {
        this.open = source.open;
        this.close = source.close;
        // initially allowed in all tokens
        this._standardTokenMask = 0;
        if (Array.isArray(source.notIn)) {
            for (var i = 0, len = source.notIn.length; i < len; i++) {
                var notIn = source.notIn[i];
                switch (notIn) {
                    case 'string':
                        this._standardTokenMask |= 2 /* String */;
                        break;
                    case 'comment':
                        this._standardTokenMask |= 1 /* Comment */;
                        break;
                    case 'regex':
                        this._standardTokenMask |= 4 /* RegEx */;
                        break;
                }
            }
        }
    }
    StandardAutoClosingPairConditional.prototype.isOK = function (standardToken) {
        return (this._standardTokenMask & standardToken) === 0;
    };
    return StandardAutoClosingPairConditional;
}());
export { StandardAutoClosingPairConditional };
