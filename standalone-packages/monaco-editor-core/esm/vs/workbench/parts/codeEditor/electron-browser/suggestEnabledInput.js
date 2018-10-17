/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { $, addClass, append, removeClass } from '../../../../base/browser/dom';
import { Widget } from '../../../../base/browser/ui/widget';
import { chain, Emitter } from '../../../../base/common/event';
import { dispose } from '../../../../base/common/lifecycle';
import { isMacintosh } from '../../../../base/common/platform';
import { URI as uri } from '../../../../base/common/uri';
import './media/suggestEnabledInput.css';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditorWidget';
import { Position } from '../../../../editor/common/core/position';
import { Range } from '../../../../editor/common/core/range';
import * as modes from '../../../../editor/common/modes';
import { IModelService } from '../../../../editor/common/services/modelService';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/contextmenu';
import { SnippetController2 } from '../../../../editor/contrib/snippet/snippetController2';
import { SuggestController } from '../../../../editor/contrib/suggest/suggestController';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { inputBackground, inputBorder, inputForeground, inputPlaceholderForeground, selectionBackground } from '../../../../platform/theme/common/colorRegistry';
import { attachStyler } from '../../../../platform/theme/common/styler';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService';
import { MenuPreventer } from '../browser/menuPreventer';
import { getSimpleEditorOptions } from '../browser/simpleEditorOptions';
import { EditOperation } from '../../../../editor/common/core/editOperation';
import { mixin } from '../../../../base/common/objects';
import { SelectionClipboard } from './selectionClipboard';
export function attachSuggestEnabledInputBoxStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        inputBackground: (style && style.inputBackground) || inputBackground,
        inputForeground: (style && style.inputForeground) || inputForeground,
        inputBorder: (style && style.inputBorder) || inputBorder,
        inputPlaceholderForeground: (style && style.inputPlaceholderForeground) || inputPlaceholderForeground,
    }, widget);
}
var SuggestEnabledInput = /** @class */ (function (_super) {
    __extends(SuggestEnabledInput, _super);
    function SuggestEnabledInput(id, parent, suggestionProvider, ariaLabel, resourceHandle, options, instantiationService, modelService) {
        var _this = _super.call(this) || this;
        _this._onShouldFocusResults = new Emitter();
        _this.onShouldFocusResults = _this._onShouldFocusResults.event;
        _this._onEnter = new Emitter();
        _this.onEnter = _this._onEnter.event;
        _this._onInputDidChange = new Emitter();
        _this.onInputDidChange = _this._onInputDidChange.event;
        _this.disposables = [];
        _this.stylingContainer = append(parent, $('.suggest-input-container'));
        _this.placeholderText = append(_this.stylingContainer, $('.suggest-input-placeholder', null, options.placeholderText || ''));
        var editorOptions = mixin(getSimpleEditorOptions(), getSuggestEnabledInputOptions(ariaLabel));
        _this.inputWidget = instantiationService.createInstance(CodeEditorWidget, _this.stylingContainer, editorOptions, {
            contributions: [SuggestController, SnippetController2, ContextMenuController, MenuPreventer, SelectionClipboard],
            isSimpleWidget: true,
        });
        var scopeHandle = uri.parse(resourceHandle);
        _this.inputWidget.setModel(modelService.createModel('', null, scopeHandle, true));
        _this.disposables.push(_this.inputWidget.onDidPaste(function () { return _this.setValue(_this.getValue()); })); // setter cleanses
        _this.disposables.push((_this.inputWidget.onDidFocusEditorText(function () {
            if (options.focusContextKey) {
                options.focusContextKey.set(true);
            }
            addClass(_this.stylingContainer, 'synthetic-focus');
        })));
        _this.disposables.push((_this.inputWidget.onDidBlurEditorText(function () {
            if (options.focusContextKey) {
                options.focusContextKey.set(false);
            }
            removeClass(_this.stylingContainer, 'synthetic-focus');
        })));
        var onKeyDownMonaco = chain(_this.inputWidget.onKeyDown);
        onKeyDownMonaco.filter(function (e) { return e.keyCode === 3 /* Enter */; }).on(function (e) { e.preventDefault(); _this._onEnter.fire(); }, _this, _this.disposables);
        onKeyDownMonaco.filter(function (e) { return e.keyCode === 18 /* DownArrow */ && (isMacintosh ? e.metaKey : e.ctrlKey); }).on(function () { return _this._onShouldFocusResults.fire(); }, _this, _this.disposables);
        var preexistingContent = _this.getValue();
        _this.disposables.push(_this.inputWidget.getModel().onDidChangeContent(function () {
            var content = _this.getValue();
            _this.placeholderText.style.visibility = content ? 'hidden' : 'visible';
            if (preexistingContent.trim() === content.trim()) {
                return;
            }
            _this._onInputDidChange.fire();
            preexistingContent = content;
        }));
        var validatedSuggestProvider = {
            provideResults: suggestionProvider.provideResults,
            sortKey: suggestionProvider.sortKey || (function (a) { return a; }),
            triggerCharacters: suggestionProvider.triggerCharacters || []
        };
        _this.disposables.push(modes.CompletionProviderRegistry.register({ scheme: scopeHandle.scheme, pattern: '**/' + scopeHandle.path, hasAccessToAllModels: true }, {
            triggerCharacters: validatedSuggestProvider.triggerCharacters,
            provideCompletionItems: function (model, position, _context) {
                var query = model.getValue();
                var wordStart = query.lastIndexOf(' ', position.column - 1) + 1;
                var alreadyTypedCount = position.column - wordStart - 1;
                // dont show suggestions if the user has typed something, but hasn't used the trigger character
                if (alreadyTypedCount > 0 && (validatedSuggestProvider.triggerCharacters).indexOf(query[wordStart]) === -1) {
                    return { suggestions: [] };
                }
                return {
                    suggestions: suggestionProvider.provideResults(query).map(function (result) {
                        return {
                            label: result,
                            insertText: result,
                            overwriteBefore: alreadyTypedCount,
                            sortText: validatedSuggestProvider.sortKey(result),
                            kind: 17 /* Keyword */
                        };
                    })
                };
            }
        }));
        return _this;
    }
    SuggestEnabledInput.prototype.setValue = function (val) {
        val = val.replace(/\s/g, ' ');
        var fullRange = new Range(1, 1, 1, this.getValue().length + 1);
        this.inputWidget.executeEdits('suggestEnabledInput.setValue', [EditOperation.replace(fullRange, val)]);
        this.inputWidget.setScrollTop(0);
        this.inputWidget.setPosition(new Position(1, val.length + 1));
    };
    SuggestEnabledInput.prototype.getValue = function () {
        return this.inputWidget.getValue();
    };
    SuggestEnabledInput.prototype.style = function (colors) {
        this.stylingContainer.style.backgroundColor = colors.inputBackground && colors.inputBackground.toString();
        this.stylingContainer.style.color = colors.inputForeground && colors.inputForeground.toString();
        this.placeholderText.style.color = colors.inputPlaceholderForeground && colors.inputPlaceholderForeground.toString();
        this.stylingContainer.style.borderWidth = '1px';
        this.stylingContainer.style.borderStyle = 'solid';
        this.stylingContainer.style.borderColor = colors.inputBorder ?
            colors.inputBorder.toString() :
            'transparent';
        var cursor = this.stylingContainer.getElementsByClassName('cursor')[0];
        if (cursor) {
            cursor.style.backgroundColor = colors.inputForeground && colors.inputForeground.toString();
        }
    };
    SuggestEnabledInput.prototype.focus = function (selectAll) {
        this.inputWidget.focus();
        if (selectAll && this.inputWidget.getValue()) {
            this.selectAll();
        }
    };
    SuggestEnabledInput.prototype.layout = function (dimension) {
        this.inputWidget.layout(dimension);
        this.placeholderText.style.width = dimension.width + "px";
    };
    SuggestEnabledInput.prototype.selectAll = function () {
        this.inputWidget.setSelection(new Range(1, 1, 1, this.getValue().length + 1));
    };
    SuggestEnabledInput.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        _super.prototype.dispose.call(this);
    };
    SuggestEnabledInput = __decorate([
        __param(6, IInstantiationService),
        __param(7, IModelService)
    ], SuggestEnabledInput);
    return SuggestEnabledInput;
}(Widget));
export { SuggestEnabledInput };
// Override styles in selections.ts
registerThemingParticipant(function (theme, collector) {
    var workbenchSelectionColor = theme.getColor(selectionBackground);
    if (workbenchSelectionColor) {
        collector.addRule(".suggest-input-container .monaco-editor .focused .selected-text { background-color: " + workbenchSelectionColor + "; }");
    }
    // Override inactive selection bg
    var inputBackgroundColor = theme.getColor(inputBackground);
    if (inputBackground) {
        collector.addRule(".suggest-input-container .monaco-editor .selected-text { background-color: " + inputBackgroundColor + "; }");
    }
    // Override selected fg
    var inputForegroundColor = theme.getColor(inputForeground);
    if (inputForegroundColor) {
        collector.addRule(".suggest-input-container .monaco-editor .view-line span.inline-selected-text { color: " + inputForegroundColor + "; }");
    }
});
function getSuggestEnabledInputOptions(ariaLabel) {
    return {
        fontSize: 13,
        lineHeight: 20,
        wordWrap: 'off',
        scrollbar: { vertical: 'hidden', },
        roundedSelection: false,
        renderIndentGuides: false,
        cursorWidth: 1,
        fontFamily: ' -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", "Ubuntu", "Droid Sans", sans-serif',
        ariaLabel: ariaLabel || '',
        snippetSuggestions: 'none',
        suggest: { filterGraceful: false },
        iconsInSuggestions: false
    };
}
