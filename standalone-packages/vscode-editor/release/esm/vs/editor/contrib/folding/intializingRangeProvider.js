/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { sanitizeRanges } from './syntaxRangeProvider.js';
export var ID_INIT_PROVIDER = 'init';
var InitializingRangeProvider = /** @class */ (function () {
    function InitializingRangeProvider(editorModel, initialRanges, onTimeout, timeoutTime) {
        this.editorModel = editorModel;
        this.id = ID_INIT_PROVIDER;
        if (initialRanges.length) {
            var toDecorationRange = function (range) {
                return {
                    range: {
                        startLineNumber: range.startLineNumber,
                        startColumn: 0,
                        endLineNumber: range.endLineNumber,
                        endColumn: editorModel.getLineLength(range.endLineNumber)
                    },
                    options: {
                        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */
                    }
                };
            };
            this.decorationIds = editorModel.deltaDecorations([], initialRanges.map(toDecorationRange));
            this.timeout = setTimeout(onTimeout, timeoutTime);
        }
    }
    InitializingRangeProvider.prototype.dispose = function () {
        if (this.decorationIds) {
            this.editorModel.deltaDecorations(this.decorationIds, []);
            this.decorationIds = void 0;
        }
        if (typeof this.timeout === 'number') {
            clearTimeout(this.timeout);
            this.timeout = void 0;
        }
    };
    InitializingRangeProvider.prototype.compute = function (cancelationToken) {
        var foldingRangeData = [];
        if (this.decorationIds) {
            for (var _i = 0, _a = this.decorationIds; _i < _a.length; _i++) {
                var id = _a[_i];
                var range = this.editorModel.getDecorationRange(id);
                if (range) {
                    foldingRangeData.push({ start: range.startLineNumber, end: range.endLineNumber, rank: 1 });
                }
            }
        }
        return Promise.resolve(sanitizeRanges(foldingRangeData, Number.MAX_VALUE));
    };
    return InitializingRangeProvider;
}());
export { InitializingRangeProvider };
