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
import './parameterHints.css';
import * as nls from '../../../nls.js';
import { dispose, Disposable } from '../../../base/common/lifecycle.js';
import * as dom from '../../../base/browser/dom.js';
import * as aria from '../../../base/browser/ui/aria/aria.js';
import * as modes from '../../common/modes.js';
import { ContentWidgetPositionPreference } from '../../browser/editorBrowser.js';
import { RunOnceScheduler, createCancelablePromise } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter, chain } from '../../../base/common/event.js';
import { domEvent, stop } from '../../../base/browser/event.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { Context, provideSignatureHelp } from './provideSignatureHelp.js';
import { DomScrollableElement } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import { CharacterSet } from '../../common/core/characterClassifier.js';
import { registerThemingParticipant, HIGH_CONTRAST } from '../../../platform/theme/common/themeService.js';
import { editorHoverBackground, editorHoverBorder, textLinkForeground, textCodeBlockBackground } from '../../../platform/theme/common/colorRegistry.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { IModeService } from '../../common/services/modeService.js';
import { MarkdownRenderer } from '../markdown/markdownRenderer.js';
var $ = dom.$;
var ParameterHintsModel = /** @class */ (function (_super) {
    __extends(ParameterHintsModel, _super);
    function ParameterHintsModel(editor, delay) {
        if (delay === void 0) { delay = ParameterHintsModel.DEFAULT_DELAY; }
        var _this = _super.call(this) || this;
        _this._onHint = _this._register(new Emitter());
        _this.onHint = _this._onHint.event;
        _this._onCancel = _this._register(new Emitter());
        _this.onCancel = _this._onCancel.event;
        _this.active = false;
        _this.pending = false;
        _this.triggerChars = new CharacterSet();
        _this.editor = editor;
        _this.enabled = false;
        _this.triggerCharactersListeners = [];
        _this.throttledDelayer = new RunOnceScheduler(function () { return _this.doTrigger(); }, delay);
        _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.onEditorConfigurationChange(); }));
        _this._register(_this.editor.onDidChangeModel(function (e) { return _this.onModelChanged(); }));
        _this._register(_this.editor.onDidChangeModelLanguage(function (_) { return _this.onModelChanged(); }));
        _this._register(_this.editor.onDidChangeCursorSelection(function (e) { return _this.onCursorChange(e); }));
        _this._register(_this.editor.onDidChangeModelContent(function (e) { return _this.onModelContentChange(); }));
        _this._register(modes.SignatureHelpProviderRegistry.onDidChange(_this.onModelChanged, _this));
        _this._register(_this.editor.onDidType(function (text) { return _this.onDidType(text); }));
        _this.onEditorConfigurationChange();
        _this.onModelChanged();
        return _this;
    }
    ParameterHintsModel.prototype.cancel = function (silent) {
        if (silent === void 0) { silent = false; }
        this.active = false;
        this.pending = false;
        this.triggerContext = undefined;
        this.throttledDelayer.cancel();
        if (!silent) {
            this._onCancel.fire(void 0);
        }
        if (this.provideSignatureHelpRequest) {
            this.provideSignatureHelpRequest.cancel();
            this.provideSignatureHelpRequest = undefined;
        }
    };
    ParameterHintsModel.prototype.trigger = function (context, delay) {
        if (!modes.SignatureHelpProviderRegistry.has(this.editor.getModel())) {
            return;
        }
        this.cancel(true);
        this.triggerContext = context;
        return this.throttledDelayer.schedule(delay);
    };
    ParameterHintsModel.prototype.doTrigger = function () {
        var _this = this;
        if (this.provideSignatureHelpRequest) {
            this.provideSignatureHelpRequest.cancel();
        }
        this.pending = true;
        var triggerContext = this.triggerContext || { triggerReason: modes.SignatureHelpTriggerReason.Invoke };
        this.triggerContext = undefined;
        this.provideSignatureHelpRequest = createCancelablePromise(function (token) {
            return provideSignatureHelp(_this.editor.getModel(), _this.editor.getPosition(), triggerContext, token);
        });
        this.provideSignatureHelpRequest.then(function (result) {
            _this.pending = false;
            if (!result || !result.signatures || result.signatures.length === 0) {
                _this.cancel();
                _this._onCancel.fire(void 0);
                return false;
            }
            _this.active = true;
            var event = { hints: result };
            _this._onHint.fire(event);
            return true;
        }).catch(function (error) {
            _this.pending = false;
            onUnexpectedError(error);
        });
    };
    Object.defineProperty(ParameterHintsModel.prototype, "isTriggered", {
        get: function () {
            return this.active || this.pending || this.throttledDelayer.isScheduled();
        },
        enumerable: true,
        configurable: true
    });
    ParameterHintsModel.prototype.onModelChanged = function () {
        this.cancel();
        // Update trigger characters
        this.triggerChars = new CharacterSet();
        var model = this.editor.getModel();
        if (!model) {
            return;
        }
        for (var _i = 0, _a = modes.SignatureHelpProviderRegistry.ordered(model); _i < _a.length; _i++) {
            var support = _a[_i];
            if (Array.isArray(support.signatureHelpTriggerCharacters)) {
                for (var _b = 0, _c = support.signatureHelpTriggerCharacters; _b < _c.length; _b++) {
                    var ch = _c[_b];
                    this.triggerChars.add(ch.charCodeAt(0));
                }
            }
        }
    };
    ParameterHintsModel.prototype.onDidType = function (text) {
        if (!this.enabled) {
            return;
        }
        var lastCharIndex = text.length - 1;
        if (this.triggerChars.has(text.charCodeAt(lastCharIndex))) {
            this.trigger({
                triggerReason: this.isTriggered
                    ? modes.SignatureHelpTriggerReason.Retrigger
                    : modes.SignatureHelpTriggerReason.TriggerCharacter,
                triggerCharacter: text.charAt(lastCharIndex)
            });
        }
    };
    ParameterHintsModel.prototype.onCursorChange = function (e) {
        if (e.source === 'mouse') {
            this.cancel();
        }
        else if (this.isTriggered) {
            this.trigger({ triggerReason: modes.SignatureHelpTriggerReason.Retrigger });
        }
    };
    ParameterHintsModel.prototype.onModelContentChange = function () {
        if (this.isTriggered) {
            this.trigger({ triggerReason: modes.SignatureHelpTriggerReason.Retrigger });
        }
    };
    ParameterHintsModel.prototype.onEditorConfigurationChange = function () {
        this.enabled = this.editor.getConfiguration().contribInfo.parameterHints.enabled;
        if (!this.enabled) {
            this.cancel();
        }
    };
    ParameterHintsModel.prototype.dispose = function () {
        this.cancel(true);
        this.triggerCharactersListeners = dispose(this.triggerCharactersListeners);
        _super.prototype.dispose.call(this);
    };
    ParameterHintsModel.DEFAULT_DELAY = 120; // ms
    return ParameterHintsModel;
}(Disposable));
export { ParameterHintsModel };
var ParameterHintsWidget = /** @class */ (function () {
    function ParameterHintsWidget(editor, contextKeyService, openerService, modeService) {
        var _this = this;
        this.editor = editor;
        // Editor.IContentWidget.allowEditorOverflow
        this.allowEditorOverflow = true;
        this.markdownRenderer = new MarkdownRenderer(editor, modeService, openerService);
        this.model = new ParameterHintsModel(editor);
        this.keyVisible = Context.Visible.bindTo(contextKeyService);
        this.keyMultipleSignatures = Context.MultipleSignatures.bindTo(contextKeyService);
        this.visible = false;
        this.disposables = [];
        this.disposables.push(this.model.onHint(function (e) {
            _this.show();
            _this.hints = e.hints;
            _this.currentSignature = e.hints.activeSignature;
            _this.render();
        }));
        this.disposables.push(this.model.onCancel(function () {
            _this.hide();
        }));
    }
    ParameterHintsWidget.prototype.createParamaterHintDOMNodes = function () {
        var _this = this;
        this.element = $('.editor-widget.parameter-hints-widget');
        var wrapper = dom.append(this.element, $('.wrapper'));
        var buttons = dom.append(wrapper, $('.buttons'));
        var previous = dom.append(buttons, $('.button.previous'));
        var next = dom.append(buttons, $('.button.next'));
        var onPreviousClick = stop(domEvent(previous, 'click'));
        onPreviousClick(this.previous, this, this.disposables);
        var onNextClick = stop(domEvent(next, 'click'));
        onNextClick(this.next, this, this.disposables);
        this.overloads = dom.append(wrapper, $('.overloads'));
        var body = $('.body');
        this.scrollbar = new DomScrollableElement(body, {});
        this.disposables.push(this.scrollbar);
        wrapper.appendChild(this.scrollbar.getDomNode());
        this.signature = dom.append(body, $('.signature'));
        this.docs = dom.append(body, $('.docs'));
        this.currentSignature = 0;
        this.editor.addContentWidget(this);
        this.hide();
        this.disposables.push(this.editor.onDidChangeCursorSelection(function (e) {
            if (_this.visible) {
                _this.editor.layoutContentWidget(_this);
            }
        }));
        var updateFont = function () {
            var fontInfo = _this.editor.getConfiguration().fontInfo;
            _this.element.style.fontSize = fontInfo.fontSize + "px";
        };
        updateFont();
        chain(this.editor.onDidChangeConfiguration.bind(this.editor))
            .filter(function (e) { return e.fontInfo; })
            .on(updateFont, null, this.disposables);
        this.disposables.push(this.editor.onDidLayoutChange(function (e) { return _this.updateMaxHeight(); }));
        this.updateMaxHeight();
    };
    ParameterHintsWidget.prototype.show = function () {
        var _this = this;
        if (!this.model || this.visible) {
            return;
        }
        if (!this.element) {
            this.createParamaterHintDOMNodes();
        }
        this.keyVisible.set(true);
        this.visible = true;
        setTimeout(function () { return dom.addClass(_this.element, 'visible'); }, 100);
        this.editor.layoutContentWidget(this);
    };
    ParameterHintsWidget.prototype.hide = function () {
        if (!this.model || !this.visible) {
            return;
        }
        if (!this.element) {
            this.createParamaterHintDOMNodes();
        }
        this.keyVisible.reset();
        this.visible = false;
        this.hints = null;
        this.announcedLabel = null;
        dom.removeClass(this.element, 'visible');
        this.editor.layoutContentWidget(this);
    };
    ParameterHintsWidget.prototype.getPosition = function () {
        if (this.visible) {
            return {
                position: this.editor.getPosition(),
                preference: [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW]
            };
        }
        return null;
    };
    ParameterHintsWidget.prototype.render = function () {
        var multiple = this.hints.signatures.length > 1;
        dom.toggleClass(this.element, 'multiple', multiple);
        this.keyMultipleSignatures.set(multiple);
        this.signature.innerHTML = '';
        this.docs.innerHTML = '';
        var signature = this.hints.signatures[this.currentSignature];
        if (!signature) {
            return;
        }
        var code = dom.append(this.signature, $('.code'));
        var hasParameters = signature.parameters.length > 0;
        var fontInfo = this.editor.getConfiguration().fontInfo;
        code.style.fontSize = fontInfo.fontSize + "px";
        code.style.fontFamily = fontInfo.fontFamily;
        if (!hasParameters) {
            var label = dom.append(code, $('span'));
            label.textContent = signature.label;
        }
        else {
            this.renderParameters(code, signature, this.hints.activeParameter);
        }
        dispose(this.renderDisposeables);
        this.renderDisposeables = [];
        var activeParameter = signature.parameters[this.hints.activeParameter];
        if (activeParameter && activeParameter.documentation) {
            var documentation = $('span.documentation');
            if (typeof activeParameter.documentation === 'string') {
                documentation.textContent = activeParameter.documentation;
            }
            else {
                var renderedContents = this.markdownRenderer.render(activeParameter.documentation);
                dom.addClass(renderedContents.element, 'markdown-docs');
                this.renderDisposeables.push(renderedContents);
                documentation.appendChild(renderedContents.element);
            }
            dom.append(this.docs, $('p', null, documentation));
        }
        dom.toggleClass(this.signature, 'has-docs', !!signature.documentation);
        if (typeof signature.documentation === 'string') {
            dom.append(this.docs, $('p', null, signature.documentation));
        }
        else {
            var renderedContents = this.markdownRenderer.render(signature.documentation);
            dom.addClass(renderedContents.element, 'markdown-docs');
            this.renderDisposeables.push(renderedContents);
            dom.append(this.docs, renderedContents.element);
        }
        var currentOverload = String(this.currentSignature + 1);
        if (this.hints.signatures.length < 10) {
            currentOverload += "/" + this.hints.signatures.length;
        }
        this.overloads.textContent = currentOverload;
        if (activeParameter) {
            var labelToAnnounce = activeParameter.label;
            // Select method gets called on every user type while parameter hints are visible.
            // We do not want to spam the user with same announcements, so we only announce if the current parameter changed.
            if (this.announcedLabel !== labelToAnnounce) {
                aria.alert(nls.localize('hint', "{0}, hint", labelToAnnounce));
                this.announcedLabel = labelToAnnounce;
            }
        }
        this.editor.layoutContentWidget(this);
        this.scrollbar.scanDomNode();
    };
    ParameterHintsWidget.prototype.renderParameters = function (parent, signature, currentParameter) {
        var end = signature.label.length;
        var idx = 0;
        var element;
        for (var i = signature.parameters.length - 1; i >= 0; i--) {
            var parameter = signature.parameters[i];
            idx = signature.label.lastIndexOf(parameter.label, end - 1);
            var signatureLabelOffset = 0;
            var signatureLabelEnd = 0;
            if (idx >= 0) {
                signatureLabelOffset = idx;
                signatureLabelEnd = idx + parameter.label.length;
            }
            // non parameter part
            element = document.createElement('span');
            element.textContent = signature.label.substring(signatureLabelEnd, end);
            dom.prepend(parent, element);
            // parameter part
            element = document.createElement('span');
            element.className = "parameter " + (i === currentParameter ? 'active' : '');
            element.textContent = signature.label.substring(signatureLabelOffset, signatureLabelEnd);
            dom.prepend(parent, element);
            end = signatureLabelOffset;
        }
        // non parameter part
        element = document.createElement('span');
        element.textContent = signature.label.substring(0, end);
        dom.prepend(parent, element);
    };
    // private select(position: number): void {
    // 	const signature = this.signatureViews[position];
    // 	if (!signature) {
    // 		return;
    // 	}
    // 	this.signatures.style.height = `${ signature.height }px`;
    // 	this.signatures.scrollTop = signature.top;
    // 	let overloads = '' + (position + 1);
    // 	if (this.signatureViews.length < 10) {
    // 		overloads += '/' + this.signatureViews.length;
    // 	}
    // 	this.overloads.textContent = overloads;
    // 	if (this.hints && this.hints.signatures[position].parameters[this.hints.activeParameter]) {
    // 		const labelToAnnounce = this.hints.signatures[position].parameters[this.hints.activeParameter].label;
    // 		// Select method gets called on every user type while parameter hints are visible.
    // 		// We do not want to spam the user with same announcements, so we only announce if the current parameter changed.
    // 		if (this.announcedLabel !== labelToAnnounce) {
    // 			aria.alert(nls.localize('hint', "{0}, hint", labelToAnnounce));
    // 			this.announcedLabel = labelToAnnounce;
    // 		}
    // 	}
    // 	this.editor.layoutContentWidget(this);
    // }
    ParameterHintsWidget.prototype.next = function () {
        var length = this.hints.signatures.length;
        var last = (this.currentSignature % length) === (length - 1);
        var cycle = this.editor.getConfiguration().contribInfo.parameterHints.cycle;
        // If there is only one signature, or we're on last signature of list
        if ((length < 2 || last) && !cycle) {
            this.cancel();
            return false;
        }
        if (last && cycle) {
            this.currentSignature = 0;
        }
        else {
            this.currentSignature++;
        }
        this.render();
        return true;
    };
    ParameterHintsWidget.prototype.previous = function () {
        var length = this.hints.signatures.length;
        var first = this.currentSignature === 0;
        var cycle = this.editor.getConfiguration().contribInfo.parameterHints.cycle;
        // If there is only one signature, or we're on first signature of list
        if ((length < 2 || first) && !cycle) {
            this.cancel();
            return false;
        }
        if (first && cycle) {
            this.currentSignature = length - 1;
        }
        else {
            this.currentSignature--;
        }
        this.render();
        return true;
    };
    ParameterHintsWidget.prototype.cancel = function () {
        this.model.cancel();
    };
    ParameterHintsWidget.prototype.getDomNode = function () {
        return this.element;
    };
    ParameterHintsWidget.prototype.getId = function () {
        return ParameterHintsWidget.ID;
    };
    ParameterHintsWidget.prototype.trigger = function (context) {
        this.model.trigger(context, 0);
    };
    ParameterHintsWidget.prototype.updateMaxHeight = function () {
        var height = Math.max(this.editor.getLayoutInfo().height / 4, 250);
        this.element.style.maxHeight = height + "px";
    };
    ParameterHintsWidget.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        this.renderDisposeables = dispose(this.renderDisposeables);
        if (this.model) {
            this.model.dispose();
            this.model = null;
        }
    };
    ParameterHintsWidget.ID = 'editor.widget.parameterHintsWidget';
    ParameterHintsWidget = __decorate([
        __param(1, IContextKeyService),
        __param(2, IOpenerService),
        __param(3, IModeService)
    ], ParameterHintsWidget);
    return ParameterHintsWidget;
}());
export { ParameterHintsWidget };
registerThemingParticipant(function (theme, collector) {
    var border = theme.getColor(editorHoverBorder);
    if (border) {
        var borderWidth = theme.type === HIGH_CONTRAST ? 2 : 1;
        collector.addRule(".monaco-editor .parameter-hints-widget { border: " + borderWidth + "px solid " + border + "; }");
        collector.addRule(".monaco-editor .parameter-hints-widget.multiple .body { border-left: 1px solid " + border.transparent(0.5) + "; }");
        collector.addRule(".monaco-editor .parameter-hints-widget .signature.has-docs { border-bottom: 1px solid " + border.transparent(0.5) + "; }");
    }
    var background = theme.getColor(editorHoverBackground);
    if (background) {
        collector.addRule(".monaco-editor .parameter-hints-widget { background-color: " + background + "; }");
    }
    var link = theme.getColor(textLinkForeground);
    if (link) {
        collector.addRule(".monaco-editor .parameter-hints-widget a { color: " + link + "; }");
    }
    var codeBackground = theme.getColor(textCodeBlockBackground);
    if (codeBackground) {
        collector.addRule(".monaco-editor .parameter-hints-widget code { background-color: " + codeBackground + "; }");
    }
});
