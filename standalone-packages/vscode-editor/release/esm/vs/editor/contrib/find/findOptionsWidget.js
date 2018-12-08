/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as dom from '../../../base/browser/dom.js';
import { CaseSensitiveCheckbox, RegexCheckbox, WholeWordsCheckbox } from '../../../base/browser/ui/findinput/findInputCheckboxes.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { FIND_IDS } from './findModel.js';
import { contrastBorder, editorWidgetBackground, inputActiveOptionBorder, widgetShadow } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
var FindOptionsWidget = /** @class */ (function (_super) {
    __extends(FindOptionsWidget, _super);
    function FindOptionsWidget(editor, state, keybindingService, themeService) {
        var _this = _super.call(this) || this;
        _this._hideSoon = _this._register(new RunOnceScheduler(function () { return _this._hide(); }, 2000));
        _this._isVisible = false;
        _this._editor = editor;
        _this._state = state;
        _this._keybindingService = keybindingService;
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'findOptionsWidget';
        _this._domNode.style.display = 'none';
        _this._domNode.style.top = '10px';
        _this._domNode.setAttribute('role', 'presentation');
        _this._domNode.setAttribute('aria-hidden', 'true');
        var inputActiveOptionBorderColor = themeService.getTheme().getColor(inputActiveOptionBorder);
        _this.caseSensitive = _this._register(new CaseSensitiveCheckbox({
            appendTitle: _this._keybindingLabelFor(FIND_IDS.ToggleCaseSensitiveCommand),
            isChecked: _this._state.matchCase,
            inputActiveOptionBorder: inputActiveOptionBorderColor
        }));
        _this._domNode.appendChild(_this.caseSensitive.domNode);
        _this._register(_this.caseSensitive.onChange(function () {
            _this._state.change({
                matchCase: _this.caseSensitive.checked
            }, false);
        }));
        _this.wholeWords = _this._register(new WholeWordsCheckbox({
            appendTitle: _this._keybindingLabelFor(FIND_IDS.ToggleWholeWordCommand),
            isChecked: _this._state.wholeWord,
            inputActiveOptionBorder: inputActiveOptionBorderColor
        }));
        _this._domNode.appendChild(_this.wholeWords.domNode);
        _this._register(_this.wholeWords.onChange(function () {
            _this._state.change({
                wholeWord: _this.wholeWords.checked
            }, false);
        }));
        _this.regex = _this._register(new RegexCheckbox({
            appendTitle: _this._keybindingLabelFor(FIND_IDS.ToggleRegexCommand),
            isChecked: _this._state.isRegex,
            inputActiveOptionBorder: inputActiveOptionBorderColor
        }));
        _this._domNode.appendChild(_this.regex.domNode);
        _this._register(_this.regex.onChange(function () {
            _this._state.change({
                isRegex: _this.regex.checked
            }, false);
        }));
        _this._editor.addOverlayWidget(_this);
        _this._register(_this._state.onFindReplaceStateChange(function (e) {
            var somethingChanged = false;
            if (e.isRegex) {
                _this.regex.checked = _this._state.isRegex;
                somethingChanged = true;
            }
            if (e.wholeWord) {
                _this.wholeWords.checked = _this._state.wholeWord;
                somethingChanged = true;
            }
            if (e.matchCase) {
                _this.caseSensitive.checked = _this._state.matchCase;
                somethingChanged = true;
            }
            if (!_this._state.isRevealed && somethingChanged) {
                _this._revealTemporarily();
            }
        }));
        _this._register(dom.addDisposableNonBubblingMouseOutListener(_this._domNode, function (e) { return _this._onMouseOut(); }));
        _this._register(dom.addDisposableListener(_this._domNode, 'mouseover', function (e) { return _this._onMouseOver(); }));
        _this._applyTheme(themeService.getTheme());
        _this._register(themeService.onThemeChange(_this._applyTheme.bind(_this)));
        return _this;
    }
    FindOptionsWidget.prototype._keybindingLabelFor = function (actionId) {
        var kb = this._keybindingService.lookupKeybinding(actionId);
        if (!kb) {
            return '';
        }
        return " (" + kb.getLabel() + ")";
    };
    FindOptionsWidget.prototype.dispose = function () {
        this._editor.removeOverlayWidget(this);
        _super.prototype.dispose.call(this);
    };
    // ----- IOverlayWidget API
    FindOptionsWidget.prototype.getId = function () {
        return FindOptionsWidget.ID;
    };
    FindOptionsWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    FindOptionsWidget.prototype.getPosition = function () {
        return {
            preference: 0 /* TOP_RIGHT_CORNER */
        };
    };
    FindOptionsWidget.prototype.highlightFindOptions = function () {
        this._revealTemporarily();
    };
    FindOptionsWidget.prototype._revealTemporarily = function () {
        this._show();
        this._hideSoon.schedule();
    };
    FindOptionsWidget.prototype._onMouseOut = function () {
        this._hideSoon.schedule();
    };
    FindOptionsWidget.prototype._onMouseOver = function () {
        this._hideSoon.cancel();
    };
    FindOptionsWidget.prototype._show = function () {
        if (this._isVisible) {
            return;
        }
        this._isVisible = true;
        this._domNode.style.display = 'block';
    };
    FindOptionsWidget.prototype._hide = function () {
        if (!this._isVisible) {
            return;
        }
        this._isVisible = false;
        this._domNode.style.display = 'none';
    };
    FindOptionsWidget.prototype._applyTheme = function (theme) {
        var inputStyles = { inputActiveOptionBorder: theme.getColor(inputActiveOptionBorder) };
        this.caseSensitive.style(inputStyles);
        this.wholeWords.style(inputStyles);
        this.regex.style(inputStyles);
    };
    FindOptionsWidget.ID = 'editor.contrib.findOptionsWidget';
    return FindOptionsWidget;
}(Widget));
export { FindOptionsWidget };
registerThemingParticipant(function (theme, collector) {
    var widgetBackground = theme.getColor(editorWidgetBackground);
    if (widgetBackground) {
        collector.addRule(".monaco-editor .findOptionsWidget { background-color: " + widgetBackground + "; }");
    }
    var widgetShadowColor = theme.getColor(widgetShadow);
    if (widgetShadowColor) {
        collector.addRule(".monaco-editor .findOptionsWidget { box-shadow: 0 2px 8px " + widgetShadowColor + "; }");
    }
    var hcBorder = theme.getColor(contrastBorder);
    if (hcBorder) {
        collector.addRule(".monaco-editor .findOptionsWidget { border: 2px solid " + hcBorder + "; }");
    }
});
