/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TrackedRangeStickiness } from '../../common/model.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
var FoldingDecorationProvider = /** @class */ (function () {
    function FoldingDecorationProvider(editor) {
        this.editor = editor;
        this.autoHideFoldingControls = true;
    }
    FoldingDecorationProvider.prototype.getDecorationOption = function (isCollapsed) {
        if (isCollapsed) {
            return FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION;
        }
        else if (this.autoHideFoldingControls) {
            return FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION;
        }
        else {
            return FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION;
        }
    };
    FoldingDecorationProvider.prototype.deltaDecorations = function (oldDecorations, newDecorations) {
        return this.editor.deltaDecorations(oldDecorations, newDecorations);
    };
    FoldingDecorationProvider.prototype.changeDecorations = function (callback) {
        return this.editor.changeDecorations(callback);
    };
    FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        afterContentClassName: 'inline-folded',
        linesDecorationsClassName: 'folding collapsed'
    });
    FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        linesDecorationsClassName: 'folding'
    });
    FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        linesDecorationsClassName: 'folding alwaysShowFoldIcons'
    });
    return FoldingDecorationProvider;
}());
export { FoldingDecorationProvider };
