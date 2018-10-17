/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as nls from '../../../nls';
import * as platform from '../../../base/common/platform';
import { ScrollbarVisibility } from '../../../base/common/scrollable';
import { USUAL_WORD_SEPARATORS } from '../model/wordHelper';
import * as arrays from '../../../base/common/arrays';
import * as objects from '../../../base/common/objects';
export var RenderMinimap;
(function (RenderMinimap) {
    RenderMinimap[RenderMinimap["None"] = 0] = "None";
    RenderMinimap[RenderMinimap["Small"] = 1] = "Small";
    RenderMinimap[RenderMinimap["Large"] = 2] = "Large";
    RenderMinimap[RenderMinimap["SmallBlocks"] = 3] = "SmallBlocks";
    RenderMinimap[RenderMinimap["LargeBlocks"] = 4] = "LargeBlocks";
})(RenderMinimap || (RenderMinimap = {}));
/**
 * Describes how to indent wrapped lines.
 */
export var WrappingIndent;
(function (WrappingIndent) {
    /**
     * No indentation => wrapped lines begin at column 1.
     */
    WrappingIndent[WrappingIndent["None"] = 0] = "None";
    /**
     * Same => wrapped lines get the same indentation as the parent.
     */
    WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
    /**
     * Indent => wrapped lines get +1 indentation toward the parent.
     */
    WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    /**
     * DeepIndent => wrapped lines get +2 indentation toward the parent.
     */
    WrappingIndent[WrappingIndent["DeepIndent"] = 3] = "DeepIndent";
})(WrappingIndent || (WrappingIndent = {}));
/**
 * The kind of animation in which the editor's cursor should be rendered.
 */
export var TextEditorCursorBlinkingStyle;
(function (TextEditorCursorBlinkingStyle) {
    /**
     * Hidden
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Hidden"] = 0] = "Hidden";
    /**
     * Blinking
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Blink"] = 1] = "Blink";
    /**
     * Blinking with smooth fading
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Smooth"] = 2] = "Smooth";
    /**
     * Blinking with prolonged filled state and smooth fading
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Phase"] = 3] = "Phase";
    /**
     * Expand collapse animation on the y axis
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Expand"] = 4] = "Expand";
    /**
     * No-Blinking
     */
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Solid"] = 5] = "Solid";
})(TextEditorCursorBlinkingStyle || (TextEditorCursorBlinkingStyle = {}));
/**
 * @internal
 */
export function blinkingStyleToString(blinkingStyle) {
    if (blinkingStyle === TextEditorCursorBlinkingStyle.Blink) {
        return 'blink';
    }
    else if (blinkingStyle === TextEditorCursorBlinkingStyle.Expand) {
        return 'expand';
    }
    else if (blinkingStyle === TextEditorCursorBlinkingStyle.Phase) {
        return 'phase';
    }
    else if (blinkingStyle === TextEditorCursorBlinkingStyle.Smooth) {
        return 'smooth';
    }
    else if (blinkingStyle === TextEditorCursorBlinkingStyle.Solid) {
        return 'solid';
    }
    else {
        throw new Error('blinkingStyleToString: Unknown blinkingStyle');
    }
}
/**
 * The style in which the editor's cursor should be rendered.
 */
export var TextEditorCursorStyle;
(function (TextEditorCursorStyle) {
    /**
     * As a vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    /**
     * As a block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    /**
     * As a horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    /**
     * As a thin vertical line (sitting between two characters).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    /**
     * As an outlined block (sitting on top of a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    /**
     * As a thin horizontal line (sitting under a character).
     */
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (TextEditorCursorStyle = {}));
/**
 * @internal
 */
export function cursorStyleToString(cursorStyle) {
    if (cursorStyle === TextEditorCursorStyle.Line) {
        return 'line';
    }
    else if (cursorStyle === TextEditorCursorStyle.Block) {
        return 'block';
    }
    else if (cursorStyle === TextEditorCursorStyle.Underline) {
        return 'underline';
    }
    else if (cursorStyle === TextEditorCursorStyle.LineThin) {
        return 'line-thin';
    }
    else if (cursorStyle === TextEditorCursorStyle.BlockOutline) {
        return 'block-outline';
    }
    else if (cursorStyle === TextEditorCursorStyle.UnderlineThin) {
        return 'underline-thin';
    }
    else {
        throw new Error('cursorStyleToString: Unknown cursorStyle');
    }
}
function _cursorStyleFromString(cursorStyle, defaultValue) {
    if (typeof cursorStyle !== 'string') {
        return defaultValue;
    }
    if (cursorStyle === 'line') {
        return TextEditorCursorStyle.Line;
    }
    else if (cursorStyle === 'block') {
        return TextEditorCursorStyle.Block;
    }
    else if (cursorStyle === 'underline') {
        return TextEditorCursorStyle.Underline;
    }
    else if (cursorStyle === 'line-thin') {
        return TextEditorCursorStyle.LineThin;
    }
    else if (cursorStyle === 'block-outline') {
        return TextEditorCursorStyle.BlockOutline;
    }
    else if (cursorStyle === 'underline-thin') {
        return TextEditorCursorStyle.UnderlineThin;
    }
    return TextEditorCursorStyle.Line;
}
/**
 * Internal configuration options (transformed or computed) for the editor.
 */
var InternalEditorOptions = /** @class */ (function () {
    /**
     * @internal
     */
    function InternalEditorOptions(source) {
        this.canUseLayerHinting = source.canUseLayerHinting;
        this.pixelRatio = source.pixelRatio;
        this.editorClassName = source.editorClassName;
        this.lineHeight = source.lineHeight | 0;
        this.readOnly = source.readOnly;
        this.accessibilitySupport = source.accessibilitySupport;
        this.multiCursorModifier = source.multiCursorModifier;
        this.multiCursorMergeOverlapping = source.multiCursorMergeOverlapping;
        this.wordSeparators = source.wordSeparators;
        this.autoClosingBrackets = source.autoClosingBrackets;
        this.autoClosingQuotes = source.autoClosingQuotes;
        this.autoSurround = source.autoSurround;
        this.autoIndent = source.autoIndent;
        this.useTabStops = source.useTabStops;
        this.tabFocusMode = source.tabFocusMode;
        this.dragAndDrop = source.dragAndDrop;
        this.emptySelectionClipboard = source.emptySelectionClipboard;
        this.copyWithSyntaxHighlighting = source.copyWithSyntaxHighlighting;
        this.layoutInfo = source.layoutInfo;
        this.fontInfo = source.fontInfo;
        this.viewInfo = source.viewInfo;
        this.wrappingInfo = source.wrappingInfo;
        this.contribInfo = source.contribInfo;
        this.showUnused = source.showUnused;
    }
    /**
     * @internal
     */
    InternalEditorOptions.prototype.equals = function (other) {
        return (this.canUseLayerHinting === other.canUseLayerHinting
            && this.pixelRatio === other.pixelRatio
            && this.editorClassName === other.editorClassName
            && this.lineHeight === other.lineHeight
            && this.readOnly === other.readOnly
            && this.accessibilitySupport === other.accessibilitySupport
            && this.multiCursorModifier === other.multiCursorModifier
            && this.multiCursorMergeOverlapping === other.multiCursorMergeOverlapping
            && this.wordSeparators === other.wordSeparators
            && this.autoClosingBrackets === other.autoClosingBrackets
            && this.autoClosingQuotes === other.autoClosingQuotes
            && this.autoSurround === other.autoSurround
            && this.autoIndent === other.autoIndent
            && this.useTabStops === other.useTabStops
            && this.tabFocusMode === other.tabFocusMode
            && this.dragAndDrop === other.dragAndDrop
            && this.showUnused === other.showUnused
            && this.emptySelectionClipboard === other.emptySelectionClipboard
            && this.copyWithSyntaxHighlighting === other.copyWithSyntaxHighlighting
            && InternalEditorOptions._equalsLayoutInfo(this.layoutInfo, other.layoutInfo)
            && this.fontInfo.equals(other.fontInfo)
            && InternalEditorOptions._equalsViewOptions(this.viewInfo, other.viewInfo)
            && InternalEditorOptions._equalsWrappingInfo(this.wrappingInfo, other.wrappingInfo)
            && InternalEditorOptions._equalsContribOptions(this.contribInfo, other.contribInfo));
    };
    /**
     * @internal
     */
    InternalEditorOptions.prototype.createChangeEvent = function (newOpts) {
        return {
            canUseLayerHinting: (this.canUseLayerHinting !== newOpts.canUseLayerHinting),
            pixelRatio: (this.pixelRatio !== newOpts.pixelRatio),
            editorClassName: (this.editorClassName !== newOpts.editorClassName),
            lineHeight: (this.lineHeight !== newOpts.lineHeight),
            readOnly: (this.readOnly !== newOpts.readOnly),
            accessibilitySupport: (this.accessibilitySupport !== newOpts.accessibilitySupport),
            multiCursorModifier: (this.multiCursorModifier !== newOpts.multiCursorModifier),
            multiCursorMergeOverlapping: (this.multiCursorMergeOverlapping !== newOpts.multiCursorMergeOverlapping),
            wordSeparators: (this.wordSeparators !== newOpts.wordSeparators),
            autoClosingBrackets: (this.autoClosingBrackets !== newOpts.autoClosingBrackets),
            autoClosingQuotes: (this.autoClosingQuotes !== newOpts.autoClosingQuotes),
            autoSurround: (this.autoSurround !== newOpts.autoSurround),
            autoIndent: (this.autoIndent !== newOpts.autoIndent),
            useTabStops: (this.useTabStops !== newOpts.useTabStops),
            tabFocusMode: (this.tabFocusMode !== newOpts.tabFocusMode),
            dragAndDrop: (this.dragAndDrop !== newOpts.dragAndDrop),
            emptySelectionClipboard: (this.emptySelectionClipboard !== newOpts.emptySelectionClipboard),
            copyWithSyntaxHighlighting: (this.copyWithSyntaxHighlighting !== newOpts.copyWithSyntaxHighlighting),
            layoutInfo: (!InternalEditorOptions._equalsLayoutInfo(this.layoutInfo, newOpts.layoutInfo)),
            fontInfo: (!this.fontInfo.equals(newOpts.fontInfo)),
            viewInfo: (!InternalEditorOptions._equalsViewOptions(this.viewInfo, newOpts.viewInfo)),
            wrappingInfo: (!InternalEditorOptions._equalsWrappingInfo(this.wrappingInfo, newOpts.wrappingInfo)),
            contribInfo: (!InternalEditorOptions._equalsContribOptions(this.contribInfo, newOpts.contribInfo))
        };
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsLayoutInfo = function (a, b) {
        return (a.width === b.width
            && a.height === b.height
            && a.glyphMarginLeft === b.glyphMarginLeft
            && a.glyphMarginWidth === b.glyphMarginWidth
            && a.glyphMarginHeight === b.glyphMarginHeight
            && a.lineNumbersLeft === b.lineNumbersLeft
            && a.lineNumbersWidth === b.lineNumbersWidth
            && a.lineNumbersHeight === b.lineNumbersHeight
            && a.decorationsLeft === b.decorationsLeft
            && a.decorationsWidth === b.decorationsWidth
            && a.decorationsHeight === b.decorationsHeight
            && a.contentLeft === b.contentLeft
            && a.contentWidth === b.contentWidth
            && a.contentHeight === b.contentHeight
            && a.renderMinimap === b.renderMinimap
            && a.minimapLeft === b.minimapLeft
            && a.minimapWidth === b.minimapWidth
            && a.viewportColumn === b.viewportColumn
            && a.verticalScrollbarWidth === b.verticalScrollbarWidth
            && a.horizontalScrollbarHeight === b.horizontalScrollbarHeight
            && this._equalsOverviewRuler(a.overviewRuler, b.overviewRuler));
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsOverviewRuler = function (a, b) {
        return (a.width === b.width
            && a.height === b.height
            && a.top === b.top
            && a.right === b.right);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsViewOptions = function (a, b) {
        return (a.extraEditorClassName === b.extraEditorClassName
            && a.disableMonospaceOptimizations === b.disableMonospaceOptimizations
            && arrays.equals(a.rulers, b.rulers)
            && a.ariaLabel === b.ariaLabel
            && a.renderLineNumbers === b.renderLineNumbers
            && a.renderCustomLineNumbers === b.renderCustomLineNumbers
            && a.selectOnLineNumbers === b.selectOnLineNumbers
            && a.glyphMargin === b.glyphMargin
            && a.revealHorizontalRightPadding === b.revealHorizontalRightPadding
            && a.roundedSelection === b.roundedSelection
            && a.overviewRulerLanes === b.overviewRulerLanes
            && a.overviewRulerBorder === b.overviewRulerBorder
            && a.cursorBlinking === b.cursorBlinking
            && a.mouseWheelZoom === b.mouseWheelZoom
            && a.cursorStyle === b.cursorStyle
            && a.cursorWidth === b.cursorWidth
            && a.hideCursorInOverviewRuler === b.hideCursorInOverviewRuler
            && a.scrollBeyondLastLine === b.scrollBeyondLastLine
            && a.scrollBeyondLastColumn === b.scrollBeyondLastColumn
            && a.smoothScrolling === b.smoothScrolling
            && a.stopRenderingLineAfter === b.stopRenderingLineAfter
            && a.renderWhitespace === b.renderWhitespace
            && a.renderControlCharacters === b.renderControlCharacters
            && a.fontLigatures === b.fontLigatures
            && a.renderIndentGuides === b.renderIndentGuides
            && a.highlightActiveIndentGuide === b.highlightActiveIndentGuide
            && a.renderLineHighlight === b.renderLineHighlight
            && this._equalsScrollbarOptions(a.scrollbar, b.scrollbar)
            && this._equalsMinimapOptions(a.minimap, b.minimap)
            && a.fixedOverflowWidgets === b.fixedOverflowWidgets);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsScrollbarOptions = function (a, b) {
        return (a.arrowSize === b.arrowSize
            && a.vertical === b.vertical
            && a.horizontal === b.horizontal
            && a.useShadows === b.useShadows
            && a.verticalHasArrows === b.verticalHasArrows
            && a.horizontalHasArrows === b.horizontalHasArrows
            && a.handleMouseWheel === b.handleMouseWheel
            && a.horizontalScrollbarSize === b.horizontalScrollbarSize
            && a.horizontalSliderSize === b.horizontalSliderSize
            && a.verticalScrollbarSize === b.verticalScrollbarSize
            && a.verticalSliderSize === b.verticalSliderSize
            && a.mouseWheelScrollSensitivity === b.mouseWheelScrollSensitivity);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsMinimapOptions = function (a, b) {
        return (a.enabled === b.enabled
            && a.side === b.side
            && a.showSlider === b.showSlider
            && a.renderCharacters === b.renderCharacters
            && a.maxColumn === b.maxColumn);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalFindOptions = function (a, b) {
        return (a.seedSearchStringFromSelection === b.seedSearchStringFromSelection
            && a.autoFindInSelection === b.autoFindInSelection
            && a.globalFindClipboard === b.globalFindClipboard);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsParameterHintOptions = function (a, b) {
        return (a.enabled === b.enabled
            && a.cycle === b.cycle);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsHoverOptions = function (a, b) {
        return (a.enabled === b.enabled
            && a.delay === b.delay
            && a.sticky === b.sticky);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsSuggestOptions = function (a, b) {
        if (a === b) {
            return true;
        }
        else if (!a || !b) {
            return false;
        }
        else {
            return a.filterGraceful === b.filterGraceful
                && a.snippets === b.snippets
                && a.snippetsPreventQuickSuggestions === b.snippetsPreventQuickSuggestions
                && a.localityBonus === b.localityBonus;
        }
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsWrappingInfo = function (a, b) {
        return (a.inDiffEditor === b.inDiffEditor
            && a.isDominatedByLongLines === b.isDominatedByLongLines
            && a.isWordWrapMinified === b.isWordWrapMinified
            && a.isViewportWrapping === b.isViewportWrapping
            && a.wrappingColumn === b.wrappingColumn
            && a.wrappingIndent === b.wrappingIndent
            && a.wordWrapBreakBeforeCharacters === b.wordWrapBreakBeforeCharacters
            && a.wordWrapBreakAfterCharacters === b.wordWrapBreakAfterCharacters
            && a.wordWrapBreakObtrusiveCharacters === b.wordWrapBreakObtrusiveCharacters);
    };
    /**
     * @internal
     */
    InternalEditorOptions._equalsContribOptions = function (a, b) {
        return (a.selectionClipboard === b.selectionClipboard
            && this._equalsHoverOptions(a.hover, b.hover)
            && a.links === b.links
            && a.contextmenu === b.contextmenu
            && InternalEditorOptions._equalsQuickSuggestions(a.quickSuggestions, b.quickSuggestions)
            && a.quickSuggestionsDelay === b.quickSuggestionsDelay
            && this._equalsParameterHintOptions(a.parameterHints, b.parameterHints)
            && a.iconsInSuggestions === b.iconsInSuggestions
            && a.formatOnType === b.formatOnType
            && a.formatOnPaste === b.formatOnPaste
            && a.suggestOnTriggerCharacters === b.suggestOnTriggerCharacters
            && a.acceptSuggestionOnEnter === b.acceptSuggestionOnEnter
            && a.acceptSuggestionOnCommitCharacter === b.acceptSuggestionOnCommitCharacter
            && a.wordBasedSuggestions === b.wordBasedSuggestions
            && a.suggestSelection === b.suggestSelection
            && a.suggestFontSize === b.suggestFontSize
            && a.suggestLineHeight === b.suggestLineHeight
            && a.tabCompletion === b.tabCompletion
            && this._equalsSuggestOptions(a.suggest, b.suggest)
            && a.selectionHighlight === b.selectionHighlight
            && a.occurrencesHighlight === b.occurrencesHighlight
            && a.codeLens === b.codeLens
            && a.folding === b.folding
            && a.foldingStrategy === b.foldingStrategy
            && a.showFoldingControls === b.showFoldingControls
            && a.matchBrackets === b.matchBrackets
            && this._equalFindOptions(a.find, b.find)
            && a.colorDecorators === b.colorDecorators
            && objects.equals(a.codeActionsOnSave, b.codeActionsOnSave)
            && a.codeActionsOnSaveTimeout === b.codeActionsOnSaveTimeout
            && a.lightbulbEnabled === b.lightbulbEnabled);
    };
    InternalEditorOptions._equalsQuickSuggestions = function (a, b) {
        if (typeof a === 'boolean') {
            if (typeof b !== 'boolean') {
                return false;
            }
            return a === b;
        }
        if (typeof b === 'boolean') {
            return false;
        }
        return (a.comments === b.comments
            && a.other === b.other
            && a.strings === b.strings);
    };
    return InternalEditorOptions;
}());
export { InternalEditorOptions };
function _boolean(value, defaultValue) {
    if (typeof value === 'undefined') {
        return defaultValue;
    }
    if (value === 'false') {
        // treat the string 'false' as false
        return false;
    }
    return Boolean(value);
}
function _booleanMap(value, defaultValue) {
    if (!value) {
        return defaultValue;
    }
    var out = Object.create(null);
    for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
        var k = _a[_i];
        var v = value[k];
        if (typeof v === 'boolean') {
            out[k] = v;
        }
    }
    return out;
}
function _string(value, defaultValue) {
    if (typeof value !== 'string') {
        return defaultValue;
    }
    return value;
}
function _stringSet(value, defaultValue, allowedValues) {
    if (typeof value !== 'string') {
        return defaultValue;
    }
    if (allowedValues.indexOf(value) === -1) {
        return defaultValue;
    }
    return value;
}
function _clampedInt(value, defaultValue, minimum, maximum) {
    var r;
    if (typeof value === 'undefined') {
        r = defaultValue;
    }
    else {
        r = parseInt(value, 10);
        if (isNaN(r)) {
            r = defaultValue;
        }
    }
    r = Math.max(minimum, r);
    r = Math.min(maximum, r);
    return r | 0;
}
function _float(value, defaultValue) {
    var r = parseFloat(value);
    if (isNaN(r)) {
        r = defaultValue;
    }
    return r;
}
function _wrappingIndentFromString(wrappingIndent, defaultValue) {
    if (typeof wrappingIndent !== 'string') {
        return defaultValue;
    }
    if (wrappingIndent === 'same') {
        return WrappingIndent.Same;
    }
    else if (wrappingIndent === 'indent') {
        return WrappingIndent.Indent;
    }
    else if (wrappingIndent === 'deepIndent') {
        return WrappingIndent.DeepIndent;
    }
    else {
        return WrappingIndent.None;
    }
}
function _cursorBlinkingStyleFromString(cursorBlinkingStyle, defaultValue) {
    if (typeof cursorBlinkingStyle !== 'string') {
        return defaultValue;
    }
    switch (cursorBlinkingStyle) {
        case 'blink':
            return TextEditorCursorBlinkingStyle.Blink;
        case 'smooth':
            return TextEditorCursorBlinkingStyle.Smooth;
        case 'phase':
            return TextEditorCursorBlinkingStyle.Phase;
        case 'expand':
            return TextEditorCursorBlinkingStyle.Expand;
        case 'visible': // maintain compatibility
        case 'solid':
            return TextEditorCursorBlinkingStyle.Solid;
    }
    return TextEditorCursorBlinkingStyle.Blink;
}
function _scrollbarVisibilityFromString(visibility, defaultValue) {
    if (typeof visibility !== 'string') {
        return defaultValue;
    }
    switch (visibility) {
        case 'hidden':
            return ScrollbarVisibility.Hidden;
        case 'visible':
            return ScrollbarVisibility.Visible;
        default:
            return ScrollbarVisibility.Auto;
    }
}
/**
 * @internal
 */
var EditorOptionsValidator = /** @class */ (function () {
    function EditorOptionsValidator() {
    }
    /**
     * Validate raw editor options.
     * i.e. since they can be defined by the user, they might be invalid.
     */
    EditorOptionsValidator.validate = function (opts, defaults) {
        var wordWrap = opts.wordWrap;
        {
            // Compatibility with old true or false values
            if (wordWrap === true) {
                wordWrap = 'on';
            }
            else if (wordWrap === false) {
                wordWrap = 'off';
            }
            wordWrap = _stringSet(wordWrap, defaults.wordWrap, ['off', 'on', 'wordWrapColumn', 'bounded']);
        }
        var viewInfo = this._sanitizeViewInfo(opts, defaults.viewInfo);
        var contribInfo = this._sanitizeContribInfo(opts, defaults.contribInfo);
        var configuredMulticursorModifier;
        if (typeof opts.multiCursorModifier === 'string') {
            if (opts.multiCursorModifier === 'ctrlCmd') {
                configuredMulticursorModifier = platform.isMacintosh ? 'metaKey' : 'ctrlKey';
            }
            else {
                configuredMulticursorModifier = 'altKey';
            }
        }
        var multiCursorModifier = _stringSet(configuredMulticursorModifier, defaults.multiCursorModifier, ['altKey', 'metaKey', 'ctrlKey']);
        var autoClosingBrackets;
        var autoClosingQuotes;
        var autoSurround;
        if (typeof opts.autoClosingBrackets === 'boolean' && opts.autoClosingBrackets === false) {
            // backwards compatibility: disable all on boolean false
            autoClosingBrackets = 'never';
            autoClosingQuotes = 'never';
            autoSurround = 'never';
        }
        else {
            autoClosingBrackets = _stringSet(opts.autoClosingBrackets, defaults.autoClosingBrackets, ['always', 'languageDefined', 'beforeWhitespace', 'never']);
            autoClosingQuotes = _stringSet(opts.autoClosingQuotes, defaults.autoClosingQuotes, ['always', 'languageDefined', 'beforeWhitespace', 'never']);
            autoSurround = _stringSet(opts.autoSurround, defaults.autoSurround, ['languageDefined', 'brackets', 'quotes', 'never']);
        }
        return {
            inDiffEditor: _boolean(opts.inDiffEditor, defaults.inDiffEditor),
            wordSeparators: _string(opts.wordSeparators, defaults.wordSeparators),
            lineNumbersMinChars: _clampedInt(opts.lineNumbersMinChars, defaults.lineNumbersMinChars, 1, 10),
            lineDecorationsWidth: (typeof opts.lineDecorationsWidth === 'undefined' ? defaults.lineDecorationsWidth : opts.lineDecorationsWidth),
            readOnly: _boolean(opts.readOnly, defaults.readOnly),
            mouseStyle: _stringSet(opts.mouseStyle, defaults.mouseStyle, ['text', 'default', 'copy']),
            disableLayerHinting: _boolean(opts.disableLayerHinting, defaults.disableLayerHinting),
            automaticLayout: _boolean(opts.automaticLayout, defaults.automaticLayout),
            wordWrap: wordWrap,
            wordWrapColumn: _clampedInt(opts.wordWrapColumn, defaults.wordWrapColumn, 1, 1073741824 /* MAX_SAFE_SMALL_INTEGER */),
            wordWrapMinified: _boolean(opts.wordWrapMinified, defaults.wordWrapMinified),
            wrappingIndent: _wrappingIndentFromString(opts.wrappingIndent, defaults.wrappingIndent),
            wordWrapBreakBeforeCharacters: _string(opts.wordWrapBreakBeforeCharacters, defaults.wordWrapBreakBeforeCharacters),
            wordWrapBreakAfterCharacters: _string(opts.wordWrapBreakAfterCharacters, defaults.wordWrapBreakAfterCharacters),
            wordWrapBreakObtrusiveCharacters: _string(opts.wordWrapBreakObtrusiveCharacters, defaults.wordWrapBreakObtrusiveCharacters),
            autoClosingBrackets: autoClosingBrackets,
            autoClosingQuotes: autoClosingQuotes,
            autoSurround: autoSurround,
            autoIndent: _boolean(opts.autoIndent, defaults.autoIndent),
            dragAndDrop: _boolean(opts.dragAndDrop, defaults.dragAndDrop),
            emptySelectionClipboard: _boolean(opts.emptySelectionClipboard, defaults.emptySelectionClipboard),
            copyWithSyntaxHighlighting: _boolean(opts.copyWithSyntaxHighlighting, defaults.copyWithSyntaxHighlighting),
            useTabStops: _boolean(opts.useTabStops, defaults.useTabStops),
            multiCursorModifier: multiCursorModifier,
            multiCursorMergeOverlapping: _boolean(opts.multiCursorMergeOverlapping, defaults.multiCursorMergeOverlapping),
            accessibilitySupport: _stringSet(opts.accessibilitySupport, defaults.accessibilitySupport, ['auto', 'on', 'off']),
            showUnused: _boolean(opts.showUnused, defaults.showUnused),
            viewInfo: viewInfo,
            contribInfo: contribInfo,
        };
    };
    EditorOptionsValidator._sanitizeScrollbarOpts = function (opts, defaults, mouseWheelScrollSensitivity) {
        if (typeof opts !== 'object') {
            return defaults;
        }
        var horizontalScrollbarSize = _clampedInt(opts.horizontalScrollbarSize, defaults.horizontalScrollbarSize, 0, 1000);
        var verticalScrollbarSize = _clampedInt(opts.verticalScrollbarSize, defaults.verticalScrollbarSize, 0, 1000);
        return {
            vertical: _scrollbarVisibilityFromString(opts.vertical, defaults.vertical),
            horizontal: _scrollbarVisibilityFromString(opts.horizontal, defaults.horizontal),
            arrowSize: _clampedInt(opts.arrowSize, defaults.arrowSize, 0, 1000),
            useShadows: _boolean(opts.useShadows, defaults.useShadows),
            verticalHasArrows: _boolean(opts.verticalHasArrows, defaults.verticalHasArrows),
            horizontalHasArrows: _boolean(opts.horizontalHasArrows, defaults.horizontalHasArrows),
            horizontalScrollbarSize: horizontalScrollbarSize,
            horizontalSliderSize: _clampedInt(opts.horizontalSliderSize, horizontalScrollbarSize, 0, 1000),
            verticalScrollbarSize: verticalScrollbarSize,
            verticalSliderSize: _clampedInt(opts.verticalSliderSize, verticalScrollbarSize, 0, 1000),
            handleMouseWheel: _boolean(opts.handleMouseWheel, defaults.handleMouseWheel),
            mouseWheelScrollSensitivity: mouseWheelScrollSensitivity
        };
    };
    EditorOptionsValidator._sanitizeMinimapOpts = function (opts, defaults) {
        if (typeof opts !== 'object') {
            return defaults;
        }
        return {
            enabled: _boolean(opts.enabled, defaults.enabled),
            side: _stringSet(opts.side, defaults.side, ['right', 'left']),
            showSlider: _stringSet(opts.showSlider, defaults.showSlider, ['always', 'mouseover']),
            renderCharacters: _boolean(opts.renderCharacters, defaults.renderCharacters),
            maxColumn: _clampedInt(opts.maxColumn, defaults.maxColumn, 1, 10000),
        };
    };
    EditorOptionsValidator._santizeFindOpts = function (opts, defaults) {
        if (typeof opts !== 'object') {
            return defaults;
        }
        return {
            seedSearchStringFromSelection: _boolean(opts.seedSearchStringFromSelection, defaults.seedSearchStringFromSelection),
            autoFindInSelection: _boolean(opts.autoFindInSelection, defaults.autoFindInSelection),
            globalFindClipboard: _boolean(opts.globalFindClipboard, defaults.globalFindClipboard)
        };
    };
    EditorOptionsValidator._sanitizeParameterHintOpts = function (opts, defaults) {
        if (typeof opts !== 'object') {
            return defaults;
        }
        return {
            enabled: _boolean(opts.enabled, defaults.enabled),
            cycle: _boolean(opts.cycle, defaults.cycle)
        };
    };
    EditorOptionsValidator._santizeHoverOpts = function (_opts, defaults) {
        var opts;
        if (typeof _opts === 'boolean') {
            opts = {
                enabled: _opts
            };
        }
        else if (typeof _opts === 'object') {
            opts = _opts;
        }
        else {
            return defaults;
        }
        return {
            enabled: _boolean(opts.enabled, defaults.enabled),
            delay: _clampedInt(opts.delay, defaults.delay, 0, 10000),
            sticky: _boolean(opts.sticky, defaults.sticky)
        };
    };
    EditorOptionsValidator._sanitizeSuggestOpts = function (opts, defaults) {
        var suggestOpts = opts.suggest || {};
        return {
            filterGraceful: _boolean(suggestOpts.filterGraceful, defaults.filterGraceful),
            snippets: _stringSet(opts.snippetSuggestions, defaults.snippets, ['top', 'bottom', 'inline', 'none']),
            snippetsPreventQuickSuggestions: _boolean(suggestOpts.snippetsPreventQuickSuggestions, defaults.filterGraceful),
            localityBonus: _boolean(suggestOpts.localityBonus, defaults.localityBonus),
        };
    };
    EditorOptionsValidator._sanitizeTabCompletionOpts = function (opts, defaults) {
        if (opts === false) {
            return 'off';
        }
        else if (opts === true) {
            return 'onlySnippets';
        }
        else {
            return _stringSet(opts, defaults, ['on', 'off', 'onlySnippets']);
        }
    };
    EditorOptionsValidator._sanitizeViewInfo = function (opts, defaults) {
        var rulers = [];
        if (Array.isArray(opts.rulers)) {
            for (var i = 0, len = opts.rulers.length; i < len; i++) {
                rulers.push(_clampedInt(opts.rulers[i], 0, 0, 10000));
            }
            rulers.sort();
        }
        var renderLineNumbers = defaults.renderLineNumbers;
        var renderCustomLineNumbers = defaults.renderCustomLineNumbers;
        if (typeof opts.lineNumbers !== 'undefined') {
            var lineNumbers = opts.lineNumbers;
            // Compatibility with old true or false values
            if (lineNumbers === true) {
                lineNumbers = 'on';
            }
            else if (lineNumbers === false) {
                lineNumbers = 'off';
            }
            if (typeof lineNumbers === 'function') {
                renderLineNumbers = 4 /* Custom */;
                renderCustomLineNumbers = lineNumbers;
            }
            else if (lineNumbers === 'interval') {
                renderLineNumbers = 3 /* Interval */;
            }
            else if (lineNumbers === 'relative') {
                renderLineNumbers = 2 /* Relative */;
            }
            else if (lineNumbers === 'on') {
                renderLineNumbers = 1 /* On */;
            }
            else {
                renderLineNumbers = 0 /* Off */;
            }
        }
        var fontLigatures = _boolean(opts.fontLigatures, defaults.fontLigatures);
        var disableMonospaceOptimizations = _boolean(opts.disableMonospaceOptimizations, defaults.disableMonospaceOptimizations) || fontLigatures;
        var renderWhitespace = opts.renderWhitespace;
        {
            // Compatibility with old true or false values
            if (renderWhitespace === true) {
                renderWhitespace = 'boundary';
            }
            else if (renderWhitespace === false) {
                renderWhitespace = 'none';
            }
            renderWhitespace = _stringSet(opts.renderWhitespace, defaults.renderWhitespace, ['none', 'boundary', 'all']);
        }
        var renderLineHighlight = opts.renderLineHighlight;
        {
            // Compatibility with old true or false values
            if (renderLineHighlight === true) {
                renderLineHighlight = 'line';
            }
            else if (renderLineHighlight === false) {
                renderLineHighlight = 'none';
            }
            renderLineHighlight = _stringSet(opts.renderLineHighlight, defaults.renderLineHighlight, ['none', 'gutter', 'line', 'all']);
        }
        var mouseWheelScrollSensitivity = _float(opts.mouseWheelScrollSensitivity, defaults.scrollbar.mouseWheelScrollSensitivity);
        if (mouseWheelScrollSensitivity === 0) {
            // Disallow 0, as it would prevent/block scrolling
            mouseWheelScrollSensitivity = 1;
        }
        var scrollbar = this._sanitizeScrollbarOpts(opts.scrollbar, defaults.scrollbar, mouseWheelScrollSensitivity);
        var minimap = this._sanitizeMinimapOpts(opts.minimap, defaults.minimap);
        return {
            extraEditorClassName: _string(opts.extraEditorClassName, defaults.extraEditorClassName),
            disableMonospaceOptimizations: disableMonospaceOptimizations,
            rulers: rulers,
            ariaLabel: _string(opts.ariaLabel, defaults.ariaLabel),
            renderLineNumbers: renderLineNumbers,
            renderCustomLineNumbers: renderCustomLineNumbers,
            selectOnLineNumbers: _boolean(opts.selectOnLineNumbers, defaults.selectOnLineNumbers),
            glyphMargin: _boolean(opts.glyphMargin, defaults.glyphMargin),
            revealHorizontalRightPadding: _clampedInt(opts.revealHorizontalRightPadding, defaults.revealHorizontalRightPadding, 0, 1000),
            roundedSelection: _boolean(opts.roundedSelection, defaults.roundedSelection),
            overviewRulerLanes: _clampedInt(opts.overviewRulerLanes, defaults.overviewRulerLanes, 0, 3),
            overviewRulerBorder: _boolean(opts.overviewRulerBorder, defaults.overviewRulerBorder),
            cursorBlinking: _cursorBlinkingStyleFromString(opts.cursorBlinking, defaults.cursorBlinking),
            mouseWheelZoom: _boolean(opts.mouseWheelZoom, defaults.mouseWheelZoom),
            cursorStyle: _cursorStyleFromString(opts.cursorStyle, defaults.cursorStyle),
            cursorWidth: _clampedInt(opts.cursorWidth, defaults.cursorWidth, 0, Number.MAX_VALUE),
            hideCursorInOverviewRuler: _boolean(opts.hideCursorInOverviewRuler, defaults.hideCursorInOverviewRuler),
            scrollBeyondLastLine: _boolean(opts.scrollBeyondLastLine, defaults.scrollBeyondLastLine),
            scrollBeyondLastColumn: _clampedInt(opts.scrollBeyondLastColumn, defaults.scrollBeyondLastColumn, 0, 1073741824 /* MAX_SAFE_SMALL_INTEGER */),
            smoothScrolling: _boolean(opts.smoothScrolling, defaults.smoothScrolling),
            stopRenderingLineAfter: _clampedInt(opts.stopRenderingLineAfter, defaults.stopRenderingLineAfter, -1, 1073741824 /* MAX_SAFE_SMALL_INTEGER */),
            renderWhitespace: renderWhitespace,
            renderControlCharacters: _boolean(opts.renderControlCharacters, defaults.renderControlCharacters),
            fontLigatures: fontLigatures,
            renderIndentGuides: _boolean(opts.renderIndentGuides, defaults.renderIndentGuides),
            highlightActiveIndentGuide: _boolean(opts.highlightActiveIndentGuide, defaults.highlightActiveIndentGuide),
            renderLineHighlight: renderLineHighlight,
            scrollbar: scrollbar,
            minimap: minimap,
            fixedOverflowWidgets: _boolean(opts.fixedOverflowWidgets, defaults.fixedOverflowWidgets),
        };
    };
    EditorOptionsValidator._sanitizeContribInfo = function (opts, defaults) {
        var quickSuggestions;
        if (typeof opts.quickSuggestions === 'object') {
            quickSuggestions = __assign({ other: true }, opts.quickSuggestions);
        }
        else {
            quickSuggestions = _boolean(opts.quickSuggestions, defaults.quickSuggestions);
        }
        // Compatibility support for acceptSuggestionOnEnter
        if (typeof opts.acceptSuggestionOnEnter === 'boolean') {
            opts.acceptSuggestionOnEnter = opts.acceptSuggestionOnEnter ? 'on' : 'off';
        }
        var find = this._santizeFindOpts(opts.find, defaults.find);
        return {
            selectionClipboard: _boolean(opts.selectionClipboard, defaults.selectionClipboard),
            hover: this._santizeHoverOpts(opts.hover, defaults.hover),
            links: _boolean(opts.links, defaults.links),
            contextmenu: _boolean(opts.contextmenu, defaults.contextmenu),
            quickSuggestions: quickSuggestions,
            quickSuggestionsDelay: _clampedInt(opts.quickSuggestionsDelay, defaults.quickSuggestionsDelay, -1073741824 /* MIN_SAFE_SMALL_INTEGER */, 1073741824 /* MAX_SAFE_SMALL_INTEGER */),
            parameterHints: this._sanitizeParameterHintOpts(opts.parameterHints, defaults.parameterHints),
            iconsInSuggestions: _boolean(opts.iconsInSuggestions, defaults.iconsInSuggestions),
            formatOnType: _boolean(opts.formatOnType, defaults.formatOnType),
            formatOnPaste: _boolean(opts.formatOnPaste, defaults.formatOnPaste),
            suggestOnTriggerCharacters: _boolean(opts.suggestOnTriggerCharacters, defaults.suggestOnTriggerCharacters),
            acceptSuggestionOnEnter: _stringSet(opts.acceptSuggestionOnEnter, defaults.acceptSuggestionOnEnter, ['on', 'smart', 'off']),
            acceptSuggestionOnCommitCharacter: _boolean(opts.acceptSuggestionOnCommitCharacter, defaults.acceptSuggestionOnCommitCharacter),
            wordBasedSuggestions: _boolean(opts.wordBasedSuggestions, defaults.wordBasedSuggestions),
            suggestSelection: _stringSet(opts.suggestSelection, defaults.suggestSelection, ['first', 'recentlyUsed', 'recentlyUsedByPrefix']),
            suggestFontSize: _clampedInt(opts.suggestFontSize, defaults.suggestFontSize, 0, 1000),
            suggestLineHeight: _clampedInt(opts.suggestLineHeight, defaults.suggestLineHeight, 0, 1000),
            tabCompletion: this._sanitizeTabCompletionOpts(opts.tabCompletion, defaults.tabCompletion),
            suggest: this._sanitizeSuggestOpts(opts, defaults.suggest),
            selectionHighlight: _boolean(opts.selectionHighlight, defaults.selectionHighlight),
            occurrencesHighlight: _boolean(opts.occurrencesHighlight, defaults.occurrencesHighlight),
            codeLens: _boolean(opts.codeLens, defaults.codeLens),
            folding: _boolean(opts.folding, defaults.folding),
            foldingStrategy: _stringSet(opts.foldingStrategy, defaults.foldingStrategy, ['auto', 'indentation']),
            showFoldingControls: _stringSet(opts.showFoldingControls, defaults.showFoldingControls, ['always', 'mouseover']),
            matchBrackets: _boolean(opts.matchBrackets, defaults.matchBrackets),
            find: find,
            colorDecorators: _boolean(opts.colorDecorators, defaults.colorDecorators),
            lightbulbEnabled: _boolean(opts.lightbulb ? opts.lightbulb.enabled : false, defaults.lightbulbEnabled),
            codeActionsOnSave: _booleanMap(opts.codeActionsOnSave, {}),
            codeActionsOnSaveTimeout: _clampedInt(opts.codeActionsOnSaveTimeout, defaults.codeActionsOnSaveTimeout, 1, 10000)
        };
    };
    return EditorOptionsValidator;
}());
export { EditorOptionsValidator };
/**
 * @internal
 */
var InternalEditorOptionsFactory = /** @class */ (function () {
    function InternalEditorOptionsFactory() {
    }
    InternalEditorOptionsFactory._tweakValidatedOptions = function (opts, accessibilitySupport) {
        var accessibilityIsOn = (accessibilitySupport === 2 /* Enabled */);
        var accessibilityIsOff = (accessibilitySupport === 1 /* Disabled */);
        return {
            inDiffEditor: opts.inDiffEditor,
            wordSeparators: opts.wordSeparators,
            lineNumbersMinChars: opts.lineNumbersMinChars,
            lineDecorationsWidth: opts.lineDecorationsWidth,
            readOnly: opts.readOnly,
            mouseStyle: opts.mouseStyle,
            disableLayerHinting: opts.disableLayerHinting,
            automaticLayout: opts.automaticLayout,
            wordWrap: opts.wordWrap,
            wordWrapColumn: opts.wordWrapColumn,
            wordWrapMinified: opts.wordWrapMinified,
            wrappingIndent: opts.wrappingIndent,
            wordWrapBreakBeforeCharacters: opts.wordWrapBreakBeforeCharacters,
            wordWrapBreakAfterCharacters: opts.wordWrapBreakAfterCharacters,
            wordWrapBreakObtrusiveCharacters: opts.wordWrapBreakObtrusiveCharacters,
            autoClosingBrackets: opts.autoClosingBrackets,
            autoClosingQuotes: opts.autoClosingQuotes,
            autoSurround: opts.autoSurround,
            autoIndent: opts.autoIndent,
            dragAndDrop: opts.dragAndDrop,
            emptySelectionClipboard: opts.emptySelectionClipboard,
            copyWithSyntaxHighlighting: opts.copyWithSyntaxHighlighting,
            useTabStops: opts.useTabStops,
            multiCursorModifier: opts.multiCursorModifier,
            multiCursorMergeOverlapping: opts.multiCursorMergeOverlapping,
            accessibilitySupport: opts.accessibilitySupport,
            showUnused: opts.showUnused,
            viewInfo: {
                extraEditorClassName: opts.viewInfo.extraEditorClassName,
                disableMonospaceOptimizations: opts.viewInfo.disableMonospaceOptimizations,
                rulers: opts.viewInfo.rulers,
                ariaLabel: (accessibilityIsOff ? nls.localize('accessibilityOffAriaLabel', "The editor is not accessible at this time. Press Alt+F1 for options.") : opts.viewInfo.ariaLabel),
                renderLineNumbers: opts.viewInfo.renderLineNumbers,
                renderCustomLineNumbers: opts.viewInfo.renderCustomLineNumbers,
                selectOnLineNumbers: opts.viewInfo.selectOnLineNumbers,
                glyphMargin: opts.viewInfo.glyphMargin,
                revealHorizontalRightPadding: opts.viewInfo.revealHorizontalRightPadding,
                roundedSelection: (accessibilityIsOn ? false : opts.viewInfo.roundedSelection),
                overviewRulerLanes: opts.viewInfo.overviewRulerLanes,
                overviewRulerBorder: opts.viewInfo.overviewRulerBorder,
                cursorBlinking: opts.viewInfo.cursorBlinking,
                mouseWheelZoom: opts.viewInfo.mouseWheelZoom,
                cursorStyle: opts.viewInfo.cursorStyle,
                cursorWidth: opts.viewInfo.cursorWidth,
                hideCursorInOverviewRuler: opts.viewInfo.hideCursorInOverviewRuler,
                scrollBeyondLastLine: opts.viewInfo.scrollBeyondLastLine,
                scrollBeyondLastColumn: opts.viewInfo.scrollBeyondLastColumn,
                smoothScrolling: opts.viewInfo.smoothScrolling,
                stopRenderingLineAfter: opts.viewInfo.stopRenderingLineAfter,
                renderWhitespace: (accessibilityIsOn ? 'none' : opts.viewInfo.renderWhitespace),
                renderControlCharacters: (accessibilityIsOn ? false : opts.viewInfo.renderControlCharacters),
                fontLigatures: (accessibilityIsOn ? false : opts.viewInfo.fontLigatures),
                renderIndentGuides: (accessibilityIsOn ? false : opts.viewInfo.renderIndentGuides),
                highlightActiveIndentGuide: opts.viewInfo.highlightActiveIndentGuide,
                renderLineHighlight: opts.viewInfo.renderLineHighlight,
                scrollbar: opts.viewInfo.scrollbar,
                minimap: {
                    enabled: (accessibilityIsOn ? false : opts.viewInfo.minimap.enabled),
                    side: opts.viewInfo.minimap.side,
                    renderCharacters: opts.viewInfo.minimap.renderCharacters,
                    showSlider: opts.viewInfo.minimap.showSlider,
                    maxColumn: opts.viewInfo.minimap.maxColumn
                },
                fixedOverflowWidgets: opts.viewInfo.fixedOverflowWidgets
            },
            contribInfo: {
                selectionClipboard: opts.contribInfo.selectionClipboard,
                hover: opts.contribInfo.hover,
                links: (accessibilityIsOn ? false : opts.contribInfo.links),
                contextmenu: opts.contribInfo.contextmenu,
                quickSuggestions: opts.contribInfo.quickSuggestions,
                quickSuggestionsDelay: opts.contribInfo.quickSuggestionsDelay,
                parameterHints: opts.contribInfo.parameterHints,
                iconsInSuggestions: opts.contribInfo.iconsInSuggestions,
                formatOnType: opts.contribInfo.formatOnType,
                formatOnPaste: opts.contribInfo.formatOnPaste,
                suggestOnTriggerCharacters: opts.contribInfo.suggestOnTriggerCharacters,
                acceptSuggestionOnEnter: opts.contribInfo.acceptSuggestionOnEnter,
                acceptSuggestionOnCommitCharacter: opts.contribInfo.acceptSuggestionOnCommitCharacter,
                wordBasedSuggestions: opts.contribInfo.wordBasedSuggestions,
                suggestSelection: opts.contribInfo.suggestSelection,
                suggestFontSize: opts.contribInfo.suggestFontSize,
                suggestLineHeight: opts.contribInfo.suggestLineHeight,
                tabCompletion: opts.contribInfo.tabCompletion,
                suggest: opts.contribInfo.suggest,
                selectionHighlight: (accessibilityIsOn ? false : opts.contribInfo.selectionHighlight),
                occurrencesHighlight: (accessibilityIsOn ? false : opts.contribInfo.occurrencesHighlight),
                codeLens: (accessibilityIsOn ? false : opts.contribInfo.codeLens),
                folding: (accessibilityIsOn ? false : opts.contribInfo.folding),
                foldingStrategy: opts.contribInfo.foldingStrategy,
                showFoldingControls: opts.contribInfo.showFoldingControls,
                matchBrackets: (accessibilityIsOn ? false : opts.contribInfo.matchBrackets),
                find: opts.contribInfo.find,
                colorDecorators: opts.contribInfo.colorDecorators,
                lightbulbEnabled: opts.contribInfo.lightbulbEnabled,
                codeActionsOnSave: opts.contribInfo.codeActionsOnSave,
                codeActionsOnSaveTimeout: opts.contribInfo.codeActionsOnSaveTimeout
            }
        };
    };
    InternalEditorOptionsFactory.createInternalEditorOptions = function (env, _opts) {
        var accessibilitySupport;
        if (_opts.accessibilitySupport === 'auto') {
            // The editor reads the `accessibilitySupport` from the environment
            accessibilitySupport = env.accessibilitySupport;
        }
        else if (_opts.accessibilitySupport === 'on') {
            accessibilitySupport = 2 /* Enabled */;
        }
        else {
            accessibilitySupport = 1 /* Disabled */;
        }
        // Disable some non critical features to get as best performance as possible
        // See https://github.com/Microsoft/vscode/issues/26730
        var opts = this._tweakValidatedOptions(_opts, accessibilitySupport);
        var lineDecorationsWidth;
        if (typeof opts.lineDecorationsWidth === 'string' && /^\d+(\.\d+)?ch$/.test(opts.lineDecorationsWidth)) {
            var multiple = parseFloat(opts.lineDecorationsWidth.substr(0, opts.lineDecorationsWidth.length - 2));
            lineDecorationsWidth = multiple * env.fontInfo.typicalHalfwidthCharacterWidth;
        }
        else {
            lineDecorationsWidth = _clampedInt(opts.lineDecorationsWidth, 0, 0, 1000);
        }
        if (opts.contribInfo.folding) {
            lineDecorationsWidth += 16;
        }
        var layoutInfo = EditorLayoutProvider.compute({
            outerWidth: env.outerWidth,
            outerHeight: env.outerHeight,
            showGlyphMargin: opts.viewInfo.glyphMargin,
            lineHeight: env.fontInfo.lineHeight,
            showLineNumbers: (opts.viewInfo.renderLineNumbers !== 0 /* Off */),
            lineNumbersMinChars: opts.lineNumbersMinChars,
            lineNumbersDigitCount: env.lineNumbersDigitCount,
            lineDecorationsWidth: lineDecorationsWidth,
            typicalHalfwidthCharacterWidth: env.fontInfo.typicalHalfwidthCharacterWidth,
            maxDigitWidth: env.fontInfo.maxDigitWidth,
            verticalScrollbarWidth: opts.viewInfo.scrollbar.verticalScrollbarSize,
            horizontalScrollbarHeight: opts.viewInfo.scrollbar.horizontalScrollbarSize,
            scrollbarArrowSize: opts.viewInfo.scrollbar.arrowSize,
            verticalScrollbarHasArrows: opts.viewInfo.scrollbar.verticalHasArrows,
            minimap: opts.viewInfo.minimap.enabled,
            minimapSide: opts.viewInfo.minimap.side,
            minimapRenderCharacters: opts.viewInfo.minimap.renderCharacters,
            minimapMaxColumn: opts.viewInfo.minimap.maxColumn,
            pixelRatio: env.pixelRatio
        });
        var bareWrappingInfo = null;
        {
            var wordWrap = opts.wordWrap;
            var wordWrapColumn = opts.wordWrapColumn;
            var wordWrapMinified = opts.wordWrapMinified;
            if (accessibilitySupport === 2 /* Enabled */) {
                // See https://github.com/Microsoft/vscode/issues/27766
                // Never enable wrapping when a screen reader is attached
                // because arrow down etc. will not move the cursor in the way
                // a screen reader expects.
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: -1
                };
            }
            else if (wordWrapMinified && env.isDominatedByLongLines) {
                // Force viewport width wrapping if model is dominated by long lines
                bareWrappingInfo = {
                    isWordWrapMinified: true,
                    isViewportWrapping: true,
                    wrappingColumn: Math.max(1, layoutInfo.viewportColumn)
                };
            }
            else if (wordWrap === 'on') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: true,
                    wrappingColumn: Math.max(1, layoutInfo.viewportColumn)
                };
            }
            else if (wordWrap === 'bounded') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: true,
                    wrappingColumn: Math.min(Math.max(1, layoutInfo.viewportColumn), wordWrapColumn)
                };
            }
            else if (wordWrap === 'wordWrapColumn') {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: wordWrapColumn
                };
            }
            else {
                bareWrappingInfo = {
                    isWordWrapMinified: false,
                    isViewportWrapping: false,
                    wrappingColumn: -1
                };
            }
        }
        var wrappingInfo = {
            inDiffEditor: opts.inDiffEditor,
            isDominatedByLongLines: env.isDominatedByLongLines,
            isWordWrapMinified: bareWrappingInfo.isWordWrapMinified,
            isViewportWrapping: bareWrappingInfo.isViewportWrapping,
            wrappingColumn: bareWrappingInfo.wrappingColumn,
            wrappingIndent: opts.wrappingIndent,
            wordWrapBreakBeforeCharacters: opts.wordWrapBreakBeforeCharacters,
            wordWrapBreakAfterCharacters: opts.wordWrapBreakAfterCharacters,
            wordWrapBreakObtrusiveCharacters: opts.wordWrapBreakObtrusiveCharacters,
        };
        var className = 'monaco-editor';
        if (opts.viewInfo.extraEditorClassName) {
            className += ' ' + opts.viewInfo.extraEditorClassName;
        }
        if (env.extraEditorClassName) {
            className += ' ' + env.extraEditorClassName;
        }
        if (opts.viewInfo.fontLigatures) {
            className += ' enable-ligatures';
        }
        if (opts.mouseStyle === 'default') {
            className += ' mouse-default';
        }
        else if (opts.mouseStyle === 'copy') {
            className += ' mouse-copy';
        }
        return new InternalEditorOptions({
            canUseLayerHinting: opts.disableLayerHinting ? false : true,
            pixelRatio: env.pixelRatio,
            editorClassName: className,
            lineHeight: env.fontInfo.lineHeight,
            readOnly: opts.readOnly,
            accessibilitySupport: accessibilitySupport,
            multiCursorModifier: opts.multiCursorModifier,
            multiCursorMergeOverlapping: opts.multiCursorMergeOverlapping,
            wordSeparators: opts.wordSeparators,
            autoClosingBrackets: opts.autoClosingBrackets,
            autoClosingQuotes: opts.autoClosingQuotes,
            autoSurround: opts.autoSurround,
            autoIndent: opts.autoIndent,
            useTabStops: opts.useTabStops,
            tabFocusMode: opts.readOnly ? true : env.tabFocusMode,
            dragAndDrop: opts.dragAndDrop,
            emptySelectionClipboard: opts.emptySelectionClipboard && env.emptySelectionClipboard,
            copyWithSyntaxHighlighting: opts.copyWithSyntaxHighlighting,
            layoutInfo: layoutInfo,
            fontInfo: env.fontInfo,
            viewInfo: opts.viewInfo,
            wrappingInfo: wrappingInfo,
            contribInfo: opts.contribInfo,
            showUnused: opts.showUnused,
        });
    };
    return InternalEditorOptionsFactory;
}());
export { InternalEditorOptionsFactory };
/**
 * @internal
 */
var EditorLayoutProvider = /** @class */ (function () {
    function EditorLayoutProvider() {
    }
    EditorLayoutProvider.compute = function (_opts) {
        var outerWidth = _opts.outerWidth | 0;
        var outerHeight = _opts.outerHeight | 0;
        var showGlyphMargin = _opts.showGlyphMargin;
        var lineHeight = _opts.lineHeight | 0;
        var showLineNumbers = _opts.showLineNumbers;
        var lineNumbersMinChars = _opts.lineNumbersMinChars | 0;
        var lineNumbersDigitCount = _opts.lineNumbersDigitCount | 0;
        var lineDecorationsWidth = _opts.lineDecorationsWidth | 0;
        var typicalHalfwidthCharacterWidth = _opts.typicalHalfwidthCharacterWidth;
        var maxDigitWidth = _opts.maxDigitWidth;
        var verticalScrollbarWidth = _opts.verticalScrollbarWidth | 0;
        var verticalScrollbarHasArrows = _opts.verticalScrollbarHasArrows;
        var scrollbarArrowSize = _opts.scrollbarArrowSize | 0;
        var horizontalScrollbarHeight = _opts.horizontalScrollbarHeight | 0;
        var minimap = _opts.minimap;
        var minimapSide = _opts.minimapSide;
        var minimapRenderCharacters = _opts.minimapRenderCharacters;
        var minimapMaxColumn = _opts.minimapMaxColumn | 0;
        var pixelRatio = _opts.pixelRatio;
        var lineNumbersWidth = 0;
        if (showLineNumbers) {
            var digitCount = Math.max(lineNumbersDigitCount, lineNumbersMinChars);
            lineNumbersWidth = Math.round(digitCount * maxDigitWidth);
        }
        var glyphMarginWidth = 0;
        if (showGlyphMargin) {
            glyphMarginWidth = lineHeight;
        }
        var glyphMarginLeft = 0;
        var lineNumbersLeft = glyphMarginLeft + glyphMarginWidth;
        var decorationsLeft = lineNumbersLeft + lineNumbersWidth;
        var contentLeft = decorationsLeft + lineDecorationsWidth;
        var remainingWidth = outerWidth - glyphMarginWidth - lineNumbersWidth - lineDecorationsWidth;
        var renderMinimap;
        var minimapLeft;
        var minimapWidth;
        var contentWidth;
        if (!minimap) {
            minimapLeft = 0;
            minimapWidth = 0;
            renderMinimap = RenderMinimap.None;
            contentWidth = remainingWidth;
        }
        else {
            var minimapCharWidth = void 0;
            if (pixelRatio >= 2) {
                renderMinimap = minimapRenderCharacters ? RenderMinimap.Large : RenderMinimap.LargeBlocks;
                minimapCharWidth = 2 / pixelRatio;
            }
            else {
                renderMinimap = minimapRenderCharacters ? RenderMinimap.Small : RenderMinimap.SmallBlocks;
                minimapCharWidth = 1 / pixelRatio;
            }
            // Given:
            // (leaving 2px for the cursor to have space after the last character)
            // viewportColumn = (contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth
            // minimapWidth = viewportColumn * minimapCharWidth
            // contentWidth = remainingWidth - minimapWidth
            // What are good values for contentWidth and minimapWidth ?
            // minimapWidth = ((contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth) * minimapCharWidth
            // typicalHalfwidthCharacterWidth * minimapWidth = (contentWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // typicalHalfwidthCharacterWidth * minimapWidth = (remainingWidth - minimapWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // (typicalHalfwidthCharacterWidth + minimapCharWidth) * minimapWidth = (remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth
            // minimapWidth = ((remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth) / (typicalHalfwidthCharacterWidth + minimapCharWidth)
            minimapWidth = Math.max(0, Math.floor(((remainingWidth - verticalScrollbarWidth - 2) * minimapCharWidth) / (typicalHalfwidthCharacterWidth + minimapCharWidth)));
            var minimapColumns = minimapWidth / minimapCharWidth;
            if (minimapColumns > minimapMaxColumn) {
                minimapWidth = Math.floor(minimapMaxColumn * minimapCharWidth);
            }
            contentWidth = remainingWidth - minimapWidth;
            if (minimapSide === 'left') {
                minimapLeft = 0;
                glyphMarginLeft += minimapWidth;
                lineNumbersLeft += minimapWidth;
                decorationsLeft += minimapWidth;
                contentLeft += minimapWidth;
            }
            else {
                minimapLeft = outerWidth - minimapWidth - verticalScrollbarWidth;
            }
        }
        // (leaving 2px for the cursor to have space after the last character)
        var viewportColumn = Math.max(1, Math.floor((contentWidth - verticalScrollbarWidth - 2) / typicalHalfwidthCharacterWidth));
        var verticalArrowSize = (verticalScrollbarHasArrows ? scrollbarArrowSize : 0);
        return {
            width: outerWidth,
            height: outerHeight,
            glyphMarginLeft: glyphMarginLeft,
            glyphMarginWidth: glyphMarginWidth,
            glyphMarginHeight: outerHeight,
            lineNumbersLeft: lineNumbersLeft,
            lineNumbersWidth: lineNumbersWidth,
            lineNumbersHeight: outerHeight,
            decorationsLeft: decorationsLeft,
            decorationsWidth: lineDecorationsWidth,
            decorationsHeight: outerHeight,
            contentLeft: contentLeft,
            contentWidth: contentWidth,
            contentHeight: outerHeight,
            renderMinimap: renderMinimap,
            minimapLeft: minimapLeft,
            minimapWidth: minimapWidth,
            viewportColumn: viewportColumn,
            verticalScrollbarWidth: verticalScrollbarWidth,
            horizontalScrollbarHeight: horizontalScrollbarHeight,
            overviewRuler: {
                top: verticalArrowSize,
                width: verticalScrollbarWidth,
                height: (outerHeight - 2 * verticalArrowSize),
                right: 0
            }
        };
    };
    return EditorLayoutProvider;
}());
export { EditorLayoutProvider };
var DEFAULT_WINDOWS_FONT_FAMILY = 'Consolas, \'Courier New\', monospace';
var DEFAULT_MAC_FONT_FAMILY = 'Menlo, Monaco, \'Courier New\', monospace';
var DEFAULT_LINUX_FONT_FAMILY = '\'Droid Sans Mono\', \'monospace\', monospace, \'Droid Sans Fallback\'';
/**
 * @internal
 */
export var EDITOR_FONT_DEFAULTS = {
    fontFamily: (platform.isMacintosh ? DEFAULT_MAC_FONT_FAMILY : (platform.isLinux ? DEFAULT_LINUX_FONT_FAMILY : DEFAULT_WINDOWS_FONT_FAMILY)),
    fontWeight: 'normal',
    fontSize: (platform.isMacintosh ? 12 : 14),
    lineHeight: 0,
    letterSpacing: 0,
};
/**
 * @internal
 */
export var EDITOR_MODEL_DEFAULTS = {
    tabSize: 4,
    insertSpaces: true,
    detectIndentation: true,
    trimAutoWhitespace: true,
    largeFileOptimizations: true
};
/**
 * @internal
 */
export var EDITOR_DEFAULTS = {
    inDiffEditor: false,
    wordSeparators: USUAL_WORD_SEPARATORS,
    lineNumbersMinChars: 5,
    lineDecorationsWidth: 10,
    readOnly: false,
    mouseStyle: 'text',
    disableLayerHinting: false,
    automaticLayout: false,
    wordWrap: 'off',
    wordWrapColumn: 80,
    wordWrapMinified: true,
    wrappingIndent: WrappingIndent.Same,
    wordWrapBreakBeforeCharacters: '([{‘“〈《「『【〔（［｛｢£¥＄￡￥+＋',
    wordWrapBreakAfterCharacters: ' \t})]?|&,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ”〉》」』】〕）］｝｣',
    wordWrapBreakObtrusiveCharacters: '.',
    autoClosingBrackets: 'languageDefined',
    autoClosingQuotes: 'languageDefined',
    autoSurround: 'languageDefined',
    autoIndent: true,
    dragAndDrop: true,
    emptySelectionClipboard: true,
    copyWithSyntaxHighlighting: true,
    useTabStops: true,
    multiCursorModifier: 'altKey',
    multiCursorMergeOverlapping: true,
    accessibilitySupport: 'auto',
    showUnused: true,
    viewInfo: {
        extraEditorClassName: '',
        disableMonospaceOptimizations: false,
        rulers: [],
        ariaLabel: nls.localize('editorViewAccessibleLabel', "Editor content"),
        renderLineNumbers: 1 /* On */,
        renderCustomLineNumbers: null,
        selectOnLineNumbers: true,
        glyphMargin: true,
        revealHorizontalRightPadding: 30,
        roundedSelection: true,
        overviewRulerLanes: 2,
        overviewRulerBorder: true,
        cursorBlinking: TextEditorCursorBlinkingStyle.Blink,
        mouseWheelZoom: false,
        cursorStyle: TextEditorCursorStyle.Line,
        cursorWidth: 0,
        hideCursorInOverviewRuler: false,
        scrollBeyondLastLine: true,
        scrollBeyondLastColumn: 5,
        smoothScrolling: false,
        stopRenderingLineAfter: 10000,
        renderWhitespace: 'none',
        renderControlCharacters: false,
        fontLigatures: false,
        renderIndentGuides: true,
        highlightActiveIndentGuide: true,
        renderLineHighlight: 'line',
        scrollbar: {
            vertical: ScrollbarVisibility.Auto,
            horizontal: ScrollbarVisibility.Auto,
            arrowSize: 11,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            horizontalScrollbarSize: 10,
            horizontalSliderSize: 10,
            verticalScrollbarSize: 14,
            verticalSliderSize: 14,
            handleMouseWheel: true,
            mouseWheelScrollSensitivity: 1,
        },
        minimap: {
            enabled: true,
            side: 'right',
            showSlider: 'mouseover',
            renderCharacters: true,
            maxColumn: 120
        },
        fixedOverflowWidgets: false,
    },
    contribInfo: {
        selectionClipboard: true,
        hover: {
            enabled: true,
            delay: 300,
            sticky: true
        },
        links: true,
        contextmenu: true,
        quickSuggestions: { other: true, comments: false, strings: false },
        quickSuggestionsDelay: 10,
        parameterHints: {
            enabled: true,
            cycle: false
        },
        iconsInSuggestions: true,
        formatOnType: false,
        formatOnPaste: false,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        acceptSuggestionOnCommitCharacter: true,
        wordBasedSuggestions: true,
        suggestSelection: 'recentlyUsed',
        suggestFontSize: 0,
        suggestLineHeight: 0,
        tabCompletion: 'off',
        suggest: {
            filterGraceful: true,
            snippets: 'inline',
            snippetsPreventQuickSuggestions: true,
            localityBonus: false
        },
        selectionHighlight: true,
        occurrencesHighlight: true,
        codeLens: true,
        folding: true,
        foldingStrategy: 'auto',
        showFoldingControls: 'mouseover',
        matchBrackets: true,
        find: {
            seedSearchStringFromSelection: true,
            autoFindInSelection: false,
            globalFindClipboard: false
        },
        colorDecorators: true,
        lightbulbEnabled: true,
        codeActionsOnSave: {},
        codeActionsOnSaveTimeout: 750
    },
};
