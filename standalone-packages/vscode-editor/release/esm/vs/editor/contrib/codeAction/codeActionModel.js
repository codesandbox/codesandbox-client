/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createCancelablePromise, TimeoutTimer } from '../../../base/common/async.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { Range } from '../../common/core/range.js';
import { CodeActionProviderRegistry } from '../../common/modes.js';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { getCodeActions } from './codeAction.js';
export var SUPPORTED_CODE_ACTIONS = new RawContextKey('supportedCodeAction', '');
var CodeActionOracle = /** @class */ (function () {
    function CodeActionOracle(_editor, _markerService, _signalChange, _delay, _progressService) {
        if (_delay === void 0) { _delay = 250; }
        var _this = this;
        this._editor = _editor;
        this._markerService = _markerService;
        this._signalChange = _signalChange;
        this._delay = _delay;
        this._progressService = _progressService;
        this._disposables = [];
        this._autoTriggerTimer = new TimeoutTimer();
        this._disposables.push(this._markerService.onMarkerChanged(function (e) { return _this._onMarkerChanges(e); }), this._editor.onDidChangeCursorPosition(function () { return _this._onCursorChange(); }));
    }
    CodeActionOracle.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
        this._autoTriggerTimer.cancel();
    };
    CodeActionOracle.prototype.trigger = function (trigger) {
        var selection = this._getRangeOfSelectionUnlessWhitespaceEnclosed(trigger);
        return this._createEventAndSignalChange(trigger, selection);
    };
    CodeActionOracle.prototype._onMarkerChanges = function (resources) {
        var _this = this;
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        if (resources.some(function (resource) { return resource.toString() === model.uri.toString(); })) {
            this._autoTriggerTimer.cancelAndSet(function () {
                _this.trigger({ type: 'auto' });
            }, this._delay);
        }
    };
    CodeActionOracle.prototype._onCursorChange = function () {
        var _this = this;
        this._autoTriggerTimer.cancelAndSet(function () {
            _this.trigger({ type: 'auto' });
        }, this._delay);
    };
    CodeActionOracle.prototype._getRangeOfMarker = function (selection) {
        var model = this._editor.getModel();
        if (!model) {
            return undefined;
        }
        for (var _i = 0, _a = this._markerService.read({ resource: model.uri }); _i < _a.length; _i++) {
            var marker = _a[_i];
            if (Range.intersectRanges(marker, selection)) {
                return Range.lift(marker);
            }
        }
        return undefined;
    };
    CodeActionOracle.prototype._getRangeOfSelectionUnlessWhitespaceEnclosed = function (trigger) {
        var model = this._editor.getModel();
        var selection = this._editor.getSelection();
        if (model && selection && selection.isEmpty() && !(trigger.filter && trigger.filter.includeSourceActions)) {
            var _a = selection.getPosition(), lineNumber = _a.lineNumber, column = _a.column;
            var line = model.getLineContent(lineNumber);
            if (line.length === 0) {
                // empty line
                return undefined;
            }
            else if (column === 1) {
                // look only right
                if (/\s/.test(line[0])) {
                    return undefined;
                }
            }
            else if (column === model.getLineMaxColumn(lineNumber)) {
                // look only left
                if (/\s/.test(line[line.length - 1])) {
                    return undefined;
                }
            }
            else {
                // look left and right
                if (/\s/.test(line[column - 2]) && /\s/.test(line[column - 1])) {
                    return undefined;
                }
            }
        }
        return selection ? selection : undefined;
    };
    CodeActionOracle.prototype._createEventAndSignalChange = function (trigger, selection) {
        if (!selection) {
            // cancel
            this._signalChange({
                trigger: trigger,
                rangeOrSelection: undefined,
                position: undefined,
                actions: undefined,
            });
            return Promise.resolve(undefined);
        }
        else {
            var model_1 = this._editor.getModel();
            if (!model_1) {
                // cancel
                this._signalChange({
                    trigger: trigger,
                    rangeOrSelection: undefined,
                    position: undefined,
                    actions: undefined,
                });
                return Promise.resolve(undefined);
            }
            var markerRange = this._getRangeOfMarker(selection);
            var position = markerRange ? markerRange.getStartPosition() : selection.getStartPosition();
            var actions = createCancelablePromise(function (token) { return getCodeActions(model_1, selection, trigger, token); });
            if (this._progressService && trigger.type === 'manual') {
                this._progressService.showWhile(actions, 250);
            }
            this._signalChange({
                trigger: trigger,
                rangeOrSelection: selection,
                position: position,
                actions: actions
            });
            return actions;
        }
    };
    return CodeActionOracle;
}());
export { CodeActionOracle };
var CodeActionModel = /** @class */ (function () {
    function CodeActionModel(editor, markerService, contextKeyService, _progressService) {
        var _this = this;
        this._progressService = _progressService;
        this._onDidChangeFixes = new Emitter();
        this._disposables = [];
        this._editor = editor;
        this._markerService = markerService;
        this._supportedCodeActions = SUPPORTED_CODE_ACTIONS.bindTo(contextKeyService);
        this._disposables.push(this._editor.onDidChangeModel(function () { return _this._update(); }));
        this._disposables.push(this._editor.onDidChangeModelLanguage(function () { return _this._update(); }));
        this._disposables.push(CodeActionProviderRegistry.onDidChange(this._update, this));
        this._update();
    }
    CodeActionModel.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
        dispose(this._codeActionOracle);
    };
    Object.defineProperty(CodeActionModel.prototype, "onDidChangeFixes", {
        get: function () {
            return this._onDidChangeFixes.event;
        },
        enumerable: true,
        configurable: true
    });
    CodeActionModel.prototype._update = function () {
        var _this = this;
        if (this._codeActionOracle) {
            this._codeActionOracle.dispose();
            this._codeActionOracle = undefined;
            this._onDidChangeFixes.fire(undefined);
        }
        var model = this._editor.getModel();
        if (model
            && CodeActionProviderRegistry.has(model)
            && !this._editor.getConfiguration().readOnly) {
            var supportedActions = [];
            for (var _i = 0, _a = CodeActionProviderRegistry.all(model); _i < _a.length; _i++) {
                var provider = _a[_i];
                if (Array.isArray(provider.providedCodeActionKinds)) {
                    supportedActions.push.apply(supportedActions, provider.providedCodeActionKinds);
                }
            }
            this._supportedCodeActions.set(supportedActions.join(' '));
            this._codeActionOracle = new CodeActionOracle(this._editor, this._markerService, function (p) { return _this._onDidChangeFixes.fire(p); }, undefined, this._progressService);
            this._codeActionOracle.trigger({ type: 'auto' });
        }
        else {
            this._supportedCodeActions.reset();
        }
    };
    CodeActionModel.prototype.trigger = function (trigger) {
        if (this._codeActionOracle) {
            return this._codeActionOracle.trigger(trigger);
        }
        return Promise.resolve(undefined);
    };
    return CodeActionModel;
}());
export { CodeActionModel };
