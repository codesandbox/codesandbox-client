/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as nls from '../../../nls.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { ReferenceWidget } from './referencesWidget.js';
import { Range } from '../../common/core/range.js';
import { Position } from '../../common/core/position.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
export var ctxReferenceSearchVisible = new RawContextKey('referenceSearchVisible', false);
var ReferencesController = /** @class */ (function () {
    function ReferencesController(_defaultTreeKeyboardSupport, editor, contextKeyService, _editorService, _notificationService, _instantiationService, _storageService, _configurationService) {
        this._defaultTreeKeyboardSupport = _defaultTreeKeyboardSupport;
        this._editorService = _editorService;
        this._notificationService = _notificationService;
        this._instantiationService = _instantiationService;
        this._storageService = _storageService;
        this._configurationService = _configurationService;
        this._requestIdPool = 0;
        this._disposables = [];
        this._ignoreModelChangeEvent = false;
        this._editor = editor;
        this._referenceSearchVisible = ctxReferenceSearchVisible.bindTo(contextKeyService);
    }
    ReferencesController.get = function (editor) {
        return editor.getContribution(ReferencesController.ID);
    };
    ReferencesController.prototype.getId = function () {
        return ReferencesController.ID;
    };
    ReferencesController.prototype.dispose = function () {
        this._referenceSearchVisible.reset();
        dispose(this._disposables);
        dispose(this._widget);
        dispose(this._model);
        this._widget = null;
        this._model = null;
        this._editor = null;
    };
    ReferencesController.prototype.toggleWidget = function (range, modelPromise, options) {
        var _this = this;
        // close current widget and return early is position didn't change
        var widgetPosition;
        if (this._widget) {
            widgetPosition = this._widget.position;
        }
        this.closeWidget();
        if (!!widgetPosition && range.containsPosition(widgetPosition)) {
            return null;
        }
        this._referenceSearchVisible.set(true);
        // close the widget on model/mode changes
        this._disposables.push(this._editor.onDidChangeModelLanguage(function () { _this.closeWidget(); }));
        this._disposables.push(this._editor.onDidChangeModel(function () {
            if (!_this._ignoreModelChangeEvent) {
                _this.closeWidget();
            }
        }));
        var storageKey = 'peekViewLayout';
        var data = JSON.parse(this._storageService.get(storageKey, 0 /* GLOBAL */, '{}'));
        this._widget = this._instantiationService.createInstance(ReferenceWidget, this._editor, this._defaultTreeKeyboardSupport, data);
        this._widget.setTitle(nls.localize('labelLoading', "Loading..."));
        this._widget.show(range);
        this._disposables.push(this._widget.onDidClose(function () {
            modelPromise.cancel();
            _this._storageService.store(storageKey, JSON.stringify(_this._widget.layoutData), 0 /* GLOBAL */);
            _this._widget = null;
            _this.closeWidget();
        }));
        this._disposables.push(this._widget.onDidSelectReference(function (event) {
            var element = event.element, kind = event.kind;
            switch (kind) {
                case 'open':
                    if (event.source === 'editor'
                        && _this._configurationService.getValue('editor.stablePeek')) {
                        // when stable peek is configured we don't close
                        // the peek window on selecting the editor
                        break;
                    }
                case 'side':
                    _this.openReference(element, kind === 'side');
                    break;
                case 'goto':
                    if (options.onGoto) {
                        options.onGoto(element);
                    }
                    else {
                        _this._gotoReference(element);
                    }
                    break;
            }
        }));
        var requestId = ++this._requestIdPool;
        modelPromise.then(function (model) {
            // still current request? widget still open?
            if (requestId !== _this._requestIdPool || !_this._widget) {
                return undefined;
            }
            if (_this._model) {
                _this._model.dispose();
            }
            _this._model = model;
            // show widget
            return _this._widget.setModel(_this._model).then(function () {
                if (_this._widget) { // might have been closed
                    // set title
                    _this._widget.setMetaTitle(options.getMetaTitle(_this._model));
                    // set 'best' selection
                    var uri = _this._editor.getModel().uri;
                    var pos = new Position(range.startLineNumber, range.startColumn);
                    var selection = _this._model.nearestReference(uri, pos);
                    if (selection) {
                        return _this._widget.setSelection(selection);
                    }
                }
                return undefined;
            });
        }, function (error) {
            _this._notificationService.error(error);
        });
    };
    ReferencesController.prototype.goToNextOrPreviousReference = function (fwd) {
        return __awaiter(this, void 0, void 0, function () {
            var source, target, editorFocus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._model) return [3 /*break*/, 3];
                        source = this._model.nearestReference(this._editor.getModel().uri, this._widget.position);
                        target = this._model.nextOrPreviousReference(source, fwd);
                        editorFocus = this._editor.hasTextFocus();
                        return [4 /*yield*/, this._widget.setSelection(target)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._gotoReference(target)];
                    case 2:
                        _a.sent();
                        if (editorFocus) {
                            this._editor.focus();
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReferencesController.prototype.closeWidget = function () {
        dispose(this._widget);
        this._widget = null;
        this._referenceSearchVisible.reset();
        this._disposables = dispose(this._disposables);
        dispose(this._model);
        this._model = null;
        this._editor.focus();
        this._requestIdPool += 1; // Cancel pending requests
    };
    ReferencesController.prototype._gotoReference = function (ref) {
        var _this = this;
        this._widget.hide();
        this._ignoreModelChangeEvent = true;
        var range = Range.lift(ref.range).collapseToStart();
        return this._editorService.openCodeEditor({
            resource: ref.uri,
            options: { selection: range }
        }, this._editor).then(function (openedEditor) {
            _this._ignoreModelChangeEvent = false;
            if (!openedEditor || openedEditor !== _this._editor) {
                // TODO@Alex TODO@Joh
                // when opening the current reference we might end up
                // in a different editor instance. that means we also have
                // a different instance of this reference search controller
                // and cannot hold onto the widget (which likely doesn't
                // exist). Instead of bailing out we should find the
                // 'sister' action and pass our current model on to it.
                _this.closeWidget();
                return;
            }
            _this._widget.show(range);
            _this._widget.focus();
        }, function (err) {
            _this._ignoreModelChangeEvent = false;
            onUnexpectedError(err);
        });
    };
    ReferencesController.prototype.openReference = function (ref, sideBySide) {
        // clear stage
        if (!sideBySide) {
            this.closeWidget();
        }
        var uri = ref.uri, range = ref.range;
        this._editorService.openCodeEditor({
            resource: uri,
            options: { selection: range }
        }, this._editor, sideBySide);
    };
    ReferencesController.ID = 'editor.contrib.referencesController';
    ReferencesController = __decorate([
        __param(2, IContextKeyService),
        __param(3, ICodeEditorService),
        __param(4, INotificationService),
        __param(5, IInstantiationService),
        __param(6, IStorageService),
        __param(7, IConfigurationService)
    ], ReferencesController);
    return ReferencesController;
}());
export { ReferencesController };
