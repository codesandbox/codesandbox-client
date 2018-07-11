/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { renderMarkdown } from '../../../base/browser/htmlContentRenderer.js';
import { IOpenerService, NullOpenerService } from '../../../platform/opener/common/opener.js';
import { IModeService } from '../../common/services/modeService.js';
import URI from '../../../base/common/uri.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { tokenizeToString } from '../../common/modes/textToHtmlTokenizer.js';
import { optional } from '../../../platform/instantiation/common/instantiation.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
var MarkdownRenderer = /** @class */ (function () {
    function MarkdownRenderer(_editor, _modeService, _openerService) {
        if (_openerService === void 0) { _openerService = NullOpenerService; }
        this._editor = _editor;
        this._modeService = _modeService;
        this._openerService = _openerService;
        this._onDidRenderCodeBlock = new Emitter();
        this.onDidRenderCodeBlock = this._onDidRenderCodeBlock.event;
    }
    MarkdownRenderer.prototype.getOptions = function (disposeables) {
        var _this = this;
        return {
            codeBlockRenderer: function (languageAlias, value) {
                // In markdown,
                // it is possible that we stumble upon language aliases (e.g.js instead of javascript)
                // it is possible no alias is given in which case we fall back to the current editor lang
                var modeId = languageAlias
                    ? _this._modeService.getModeIdForLanguageName(languageAlias)
                    : _this._editor.getModel().getLanguageIdentifier().language;
                return _this._modeService.getOrCreateMode(modeId).then(function (_) {
                    return tokenizeToString(value, modeId);
                }).then(function (code) {
                    return "<span style=\"font-family: " + _this._editor.getConfiguration().fontInfo.fontFamily + "\">" + code + "</span>";
                });
            },
            codeBlockRenderCallback: function () { return _this._onDidRenderCodeBlock.fire(); },
            actionHandler: {
                callback: function (content) {
                    _this._openerService.open(URI.parse(content)).then(void 0, onUnexpectedError);
                },
                disposeables: disposeables
            }
        };
    };
    MarkdownRenderer.prototype.render = function (markdown) {
        var disposeables = [];
        var element;
        if (!markdown) {
            element = document.createElement('span');
        }
        else {
            element = renderMarkdown(markdown, this.getOptions(disposeables));
        }
        return {
            element: element,
            dispose: function () { return dispose(disposeables); }
        };
    };
    MarkdownRenderer = __decorate([
        __param(1, IModeService),
        __param(2, optional(IOpenerService))
    ], MarkdownRenderer);
    return MarkdownRenderer;
}());
export { MarkdownRenderer };
