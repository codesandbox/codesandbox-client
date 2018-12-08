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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import './links.css';
import * as nls from '../../../nls.js';
import * as async from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';
import { dispose } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { LinkProviderRegistry } from '../../common/modes.js';
import { ClickLinkGesture } from '../goToDefinition/clickLinkGesture.js';
import { getLinks } from './getLinks.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { editorActiveLinkForeground } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
var HOVER_MESSAGE_GENERAL_META = new MarkdownString().appendText(platform.isMacintosh
    ? nls.localize('links.navigate.mac', "Cmd + click to follow link")
    : nls.localize('links.navigate', "Ctrl + click to follow link"));
var HOVER_MESSAGE_COMMAND_META = new MarkdownString().appendText(platform.isMacintosh
    ? nls.localize('links.command.mac', "Cmd + click to execute command")
    : nls.localize('links.command', "Ctrl + click to execute command"));
var HOVER_MESSAGE_GENERAL_ALT = new MarkdownString().appendText(platform.isMacintosh
    ? nls.localize('links.navigate.al.mac', "Option + click to follow link")
    : nls.localize('links.navigate.al', "Alt + click to follow link"));
var HOVER_MESSAGE_COMMAND_ALT = new MarkdownString().appendText(platform.isMacintosh
    ? nls.localize('links.command.al.mac', "Option + click to execute command")
    : nls.localize('links.command.al', "Alt + click to execute command"));
var decoration = {
    meta: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link',
        hoverMessage: HOVER_MESSAGE_GENERAL_META
    }),
    metaActive: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link-active',
        hoverMessage: HOVER_MESSAGE_GENERAL_META
    }),
    alt: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link',
        hoverMessage: HOVER_MESSAGE_GENERAL_ALT
    }),
    altActive: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link-active',
        hoverMessage: HOVER_MESSAGE_GENERAL_ALT
    }),
    altCommand: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link',
        hoverMessage: HOVER_MESSAGE_COMMAND_ALT
    }),
    altCommandActive: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link-active',
        hoverMessage: HOVER_MESSAGE_COMMAND_ALT
    }),
    metaCommand: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link',
        hoverMessage: HOVER_MESSAGE_COMMAND_META
    }),
    metaCommandActive: ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        collapseOnReplaceEdit: true,
        inlineClassName: 'detected-link-active',
        hoverMessage: HOVER_MESSAGE_COMMAND_META
    }),
};
var LinkOccurrence = /** @class */ (function () {
    function LinkOccurrence(link, decorationId) {
        this.link = link;
        this.decorationId = decorationId;
    }
    LinkOccurrence.decoration = function (link, useMetaKey) {
        return {
            range: link.range,
            options: LinkOccurrence._getOptions(link, useMetaKey, false)
        };
    };
    LinkOccurrence._getOptions = function (link, useMetaKey, isActive) {
        if (link.url && /^command:/i.test(link.url)) {
            if (useMetaKey) {
                return (isActive ? decoration.metaCommandActive : decoration.metaCommand);
            }
            else {
                return (isActive ? decoration.altCommandActive : decoration.altCommand);
            }
        }
        else {
            if (useMetaKey) {
                return (isActive ? decoration.metaActive : decoration.meta);
            }
            else {
                return (isActive ? decoration.altActive : decoration.alt);
            }
        }
    };
    LinkOccurrence.prototype.activate = function (changeAccessor, useMetaKey) {
        changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurrence._getOptions(this.link, useMetaKey, true));
    };
    LinkOccurrence.prototype.deactivate = function (changeAccessor, useMetaKey) {
        changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurrence._getOptions(this.link, useMetaKey, false));
    };
    return LinkOccurrence;
}());
var LinkDetector = /** @class */ (function () {
    function LinkDetector(editor, openerService, notificationService) {
        var _this = this;
        this.editor = editor;
        this.openerService = openerService;
        this.notificationService = notificationService;
        this.listenersToRemove = [];
        var clickLinkGesture = new ClickLinkGesture(editor);
        this.listenersToRemove.push(clickLinkGesture);
        this.listenersToRemove.push(clickLinkGesture.onMouseMoveOrRelevantKeyDown(function (_a) {
            var mouseEvent = _a[0], keyboardEvent = _a[1];
            _this._onEditorMouseMove(mouseEvent, keyboardEvent);
        }));
        this.listenersToRemove.push(clickLinkGesture.onExecute(function (e) {
            _this.onEditorMouseUp(e);
        }));
        this.listenersToRemove.push(clickLinkGesture.onCancel(function (e) {
            _this.cleanUpActiveLinkDecoration();
        }));
        this.enabled = editor.getConfiguration().contribInfo.links;
        this.listenersToRemove.push(editor.onDidChangeConfiguration(function (e) {
            var enabled = editor.getConfiguration().contribInfo.links;
            if (_this.enabled === enabled) {
                // No change in our configuration option
                return;
            }
            _this.enabled = enabled;
            // Remove any links (for the getting disabled case)
            _this.updateDecorations([]);
            // Stop any computation (for the getting disabled case)
            _this.stop();
            // Start computing (for the getting enabled case)
            _this.beginCompute();
        }));
        this.listenersToRemove.push(editor.onDidChangeModelContent(function (e) { return _this.onChange(); }));
        this.listenersToRemove.push(editor.onDidChangeModel(function (e) { return _this.onModelChanged(); }));
        this.listenersToRemove.push(editor.onDidChangeModelLanguage(function (e) { return _this.onModelModeChanged(); }));
        this.listenersToRemove.push(LinkProviderRegistry.onDidChange(function (e) { return _this.onModelModeChanged(); }));
        this.timeout = new async.TimeoutTimer();
        this.computePromise = null;
        this.currentOccurrences = {};
        this.activeLinkDecorationId = null;
        this.beginCompute();
    }
    LinkDetector.get = function (editor) {
        return editor.getContribution(LinkDetector.ID);
    };
    LinkDetector.prototype.getId = function () {
        return LinkDetector.ID;
    };
    LinkDetector.prototype.onModelChanged = function () {
        this.currentOccurrences = {};
        this.activeLinkDecorationId = null;
        this.stop();
        this.beginCompute();
    };
    LinkDetector.prototype.onModelModeChanged = function () {
        this.stop();
        this.beginCompute();
    };
    LinkDetector.prototype.onChange = function () {
        var _this = this;
        this.timeout.setIfNotSet(function () { return _this.beginCompute(); }, LinkDetector.RECOMPUTE_TIME);
    };
    LinkDetector.prototype.beginCompute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var model, links, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.editor.hasModel() || !this.enabled) {
                            return [2 /*return*/];
                        }
                        model = this.editor.getModel();
                        if (!LinkProviderRegistry.has(model)) {
                            return [2 /*return*/];
                        }
                        this.computePromise = async.createCancelablePromise(function (token) { return getLinks(model, token); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.computePromise];
                    case 2:
                        links = _a.sent();
                        this.updateDecorations(links);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        onUnexpectedError(err_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.computePromise = null;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LinkDetector.prototype.updateDecorations = function (links) {
        var useMetaKey = (this.editor.getConfiguration().multiCursorModifier === 'altKey');
        var oldDecorations = [];
        var keys = Object.keys(this.currentOccurrences);
        for (var i = 0, len = keys.length; i < len; i++) {
            var decorationId = keys[i];
            var occurance = this.currentOccurrences[decorationId];
            oldDecorations.push(occurance.decorationId);
        }
        var newDecorations = [];
        if (links) {
            // Not sure why this is sometimes null
            for (var i = 0; i < links.length; i++) {
                newDecorations.push(LinkOccurrence.decoration(links[i], useMetaKey));
            }
        }
        var decorations = this.editor.deltaDecorations(oldDecorations, newDecorations);
        this.currentOccurrences = {};
        this.activeLinkDecorationId = null;
        for (var i = 0, len = decorations.length; i < len; i++) {
            var occurance = new LinkOccurrence(links[i], decorations[i]);
            this.currentOccurrences[occurance.decorationId] = occurance;
        }
    };
    LinkDetector.prototype._onEditorMouseMove = function (mouseEvent, withKey) {
        var _this = this;
        var useMetaKey = (this.editor.getConfiguration().multiCursorModifier === 'altKey');
        if (this.isEnabled(mouseEvent, withKey)) {
            this.cleanUpActiveLinkDecoration(); // always remove previous link decoration as their can only be one
            var occurrence_1 = this.getLinkOccurrence(mouseEvent.target.position);
            if (occurrence_1) {
                this.editor.changeDecorations(function (changeAccessor) {
                    occurrence_1.activate(changeAccessor, useMetaKey);
                    _this.activeLinkDecorationId = occurrence_1.decorationId;
                });
            }
        }
        else {
            this.cleanUpActiveLinkDecoration();
        }
    };
    LinkDetector.prototype.cleanUpActiveLinkDecoration = function () {
        var useMetaKey = (this.editor.getConfiguration().multiCursorModifier === 'altKey');
        if (this.activeLinkDecorationId) {
            var occurrence_2 = this.currentOccurrences[this.activeLinkDecorationId];
            if (occurrence_2) {
                this.editor.changeDecorations(function (changeAccessor) {
                    occurrence_2.deactivate(changeAccessor, useMetaKey);
                });
            }
            this.activeLinkDecorationId = null;
        }
    };
    LinkDetector.prototype.onEditorMouseUp = function (mouseEvent) {
        if (!this.isEnabled(mouseEvent)) {
            return;
        }
        var occurrence = this.getLinkOccurrence(mouseEvent.target.position);
        if (!occurrence) {
            return;
        }
        this.openLinkOccurrence(occurrence, mouseEvent.hasSideBySideModifier);
    };
    LinkDetector.prototype.openLinkOccurrence = function (occurrence, openToSide) {
        var _this = this;
        if (!this.openerService) {
            return;
        }
        var link = occurrence.link;
        link.resolve(CancellationToken.None).then(function (uri) {
            // open the uri
            return _this.openerService.open(uri, { openToSide: openToSide });
        }, function (err) {
            // different error cases
            if (err === 'invalid') {
                _this.notificationService.warn(nls.localize('invalid.url', 'Failed to open this link because it is not well-formed: {0}', link.url));
            }
            else if (err === 'missing') {
                _this.notificationService.warn(nls.localize('missing.url', 'Failed to open this link because its target is missing.'));
            }
            else {
                onUnexpectedError(err);
            }
        });
    };
    LinkDetector.prototype.getLinkOccurrence = function (position) {
        if (!this.editor.hasModel() || !position) {
            return null;
        }
        var decorations = this.editor.getModel().getDecorationsInRange({
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        }, 0, true);
        for (var i = 0; i < decorations.length; i++) {
            var decoration_1 = decorations[i];
            var currentOccurrence = this.currentOccurrences[decoration_1.id];
            if (currentOccurrence) {
                return currentOccurrence;
            }
        }
        return null;
    };
    LinkDetector.prototype.isEnabled = function (mouseEvent, withKey) {
        return Boolean((mouseEvent.target.type === 6 /* CONTENT_TEXT */)
            && (mouseEvent.hasTriggerModifier || (withKey && withKey.keyCodeIsTriggerKey)));
    };
    LinkDetector.prototype.stop = function () {
        this.timeout.cancel();
        if (this.computePromise) {
            this.computePromise.cancel();
            this.computePromise = null;
        }
    };
    LinkDetector.prototype.dispose = function () {
        this.listenersToRemove = dispose(this.listenersToRemove);
        this.stop();
        this.timeout.dispose();
    };
    LinkDetector.ID = 'editor.linkDetector';
    LinkDetector.RECOMPUTE_TIME = 1000; // ms
    LinkDetector = __decorate([
        __param(1, IOpenerService),
        __param(2, INotificationService)
    ], LinkDetector);
    return LinkDetector;
}());
var OpenLinkAction = /** @class */ (function (_super) {
    __extends(OpenLinkAction, _super);
    function OpenLinkAction() {
        return _super.call(this, {
            id: 'editor.action.openLink',
            label: nls.localize('label', "Open Link"),
            alias: 'Open Link',
            precondition: null
        }) || this;
    }
    OpenLinkAction.prototype.run = function (accessor, editor) {
        var linkDetector = LinkDetector.get(editor);
        if (!linkDetector) {
            return;
        }
        if (!editor.hasModel()) {
            return;
        }
        var selections = editor.getSelections();
        for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
            var sel = selections_1[_i];
            var link = linkDetector.getLinkOccurrence(sel.getEndPosition());
            if (link) {
                linkDetector.openLinkOccurrence(link, false);
            }
        }
    };
    return OpenLinkAction;
}(EditorAction));
registerEditorContribution(LinkDetector);
registerEditorAction(OpenLinkAction);
registerThemingParticipant(function (theme, collector) {
    var activeLinkForeground = theme.getColor(editorActiveLinkForeground);
    if (activeLinkForeground) {
        collector.addRule(".monaco-editor .detected-link-active { color: " + activeLinkForeground + " !important; }");
    }
});
