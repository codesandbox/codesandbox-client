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
import { RunOnceScheduler, createCancelablePromise } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { dispose, toDisposable } from '../../../base/common/lifecycle.js';
import { StableEditorScrollState } from '../../browser/core/editorState.js';
import { registerEditorContribution } from '../../browser/editorExtensions.js';
import { CodeLensProviderRegistry } from '../../common/modes.js';
import { getCodeLensData } from './codelens.js';
import { CodeLens, CodeLensHelper } from './codelensWidget.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
var CodeLensContribution = /** @class */ (function () {
    function CodeLensContribution(_editor, _commandService, _notificationService) {
        var _this = this;
        this._editor = _editor;
        this._commandService = _commandService;
        this._notificationService = _notificationService;
        this._isEnabled = this._editor.getConfiguration().contribInfo.codeLens;
        this._globalToDispose = [];
        this._localToDispose = [];
        this._lenses = [];
        this._currentFindCodeLensSymbolsPromise = null;
        this._modelChangeCounter = 0;
        this._globalToDispose.push(this._editor.onDidChangeModel(function () { return _this._onModelChange(); }));
        this._globalToDispose.push(this._editor.onDidChangeModelLanguage(function () { return _this._onModelChange(); }));
        this._globalToDispose.push(this._editor.onDidChangeConfiguration(function (e) {
            var prevIsEnabled = _this._isEnabled;
            _this._isEnabled = _this._editor.getConfiguration().contribInfo.codeLens;
            if (prevIsEnabled !== _this._isEnabled) {
                _this._onModelChange();
            }
        }));
        this._globalToDispose.push(CodeLensProviderRegistry.onDidChange(this._onModelChange, this));
        this._onModelChange();
    }
    CodeLensContribution.prototype.dispose = function () {
        this._localDispose();
        this._globalToDispose = dispose(this._globalToDispose);
    };
    CodeLensContribution.prototype._localDispose = function () {
        if (this._currentFindCodeLensSymbolsPromise) {
            this._currentFindCodeLensSymbolsPromise.cancel();
            this._currentFindCodeLensSymbolsPromise = null;
            this._modelChangeCounter++;
        }
        if (this._currentResolveCodeLensSymbolsPromise) {
            this._currentResolveCodeLensSymbolsPromise.cancel();
            this._currentResolveCodeLensSymbolsPromise = null;
        }
        this._localToDispose = dispose(this._localToDispose);
    };
    CodeLensContribution.prototype.getId = function () {
        return CodeLensContribution.ID;
    };
    CodeLensContribution.prototype._onModelChange = function () {
        var _this = this;
        this._localDispose();
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        if (!this._isEnabled) {
            return;
        }
        if (!CodeLensProviderRegistry.has(model)) {
            return;
        }
        for (var _i = 0, _a = CodeLensProviderRegistry.all(model); _i < _a.length; _i++) {
            var provider = _a[_i];
            if (typeof provider.onDidChange === 'function') {
                var registration = provider.onDidChange(function () { return scheduler.schedule(); });
                this._localToDispose.push(registration);
            }
        }
        this._detectVisibleLenses = new RunOnceScheduler(function () {
            _this._onViewportChanged();
        }, 500);
        var scheduler = new RunOnceScheduler(function () {
            var counterValue = ++_this._modelChangeCounter;
            if (_this._currentFindCodeLensSymbolsPromise) {
                _this._currentFindCodeLensSymbolsPromise.cancel();
            }
            _this._currentFindCodeLensSymbolsPromise = createCancelablePromise(function (token) { return getCodeLensData(model, token); });
            _this._currentFindCodeLensSymbolsPromise.then(function (result) {
                if (counterValue === _this._modelChangeCounter) { // only the last one wins
                    _this._renderCodeLensSymbols(result);
                    _this._detectVisibleLenses.schedule();
                }
            }, onUnexpectedError);
        }, 250);
        this._localToDispose.push(scheduler);
        this._localToDispose.push(this._detectVisibleLenses);
        this._localToDispose.push(this._editor.onDidChangeModelContent(function (e) {
            _this._editor.changeDecorations(function (changeAccessor) {
                _this._editor.changeViewZones(function (viewAccessor) {
                    var toDispose = [];
                    var lastLensLineNumber = -1;
                    _this._lenses.forEach(function (lens) {
                        if (!lens.isValid() || lastLensLineNumber === lens.getLineNumber()) {
                            // invalid -> lens collapsed, attach range doesn't exist anymore
                            // line_number -> lenses should never be on the same line
                            toDispose.push(lens);
                        }
                        else {
                            lens.update(viewAccessor);
                            lastLensLineNumber = lens.getLineNumber();
                        }
                    });
                    var helper = new CodeLensHelper();
                    toDispose.forEach(function (l) {
                        l.dispose(helper, viewAccessor);
                        _this._lenses.splice(_this._lenses.indexOf(l), 1);
                    });
                    helper.commit(changeAccessor);
                });
            });
            // Compute new `visible` code lenses
            _this._detectVisibleLenses.schedule();
            // Ask for all references again
            scheduler.schedule();
        }));
        this._localToDispose.push(this._editor.onDidScrollChange(function (e) {
            if (e.scrollTopChanged && _this._lenses.length > 0) {
                _this._detectVisibleLenses.schedule();
            }
        }));
        this._localToDispose.push(this._editor.onDidLayoutChange(function (e) {
            _this._detectVisibleLenses.schedule();
        }));
        this._localToDispose.push(toDisposable(function () {
            if (_this._editor.getModel()) {
                var scrollState = StableEditorScrollState.capture(_this._editor);
                _this._editor.changeDecorations(function (changeAccessor) {
                    _this._editor.changeViewZones(function (accessor) {
                        _this._disposeAllLenses(changeAccessor, accessor);
                    });
                });
                scrollState.restore(_this._editor);
            }
            else {
                // No accessors available
                _this._disposeAllLenses(null, null);
            }
        }));
        scheduler.schedule();
    };
    CodeLensContribution.prototype._disposeAllLenses = function (decChangeAccessor, viewZoneChangeAccessor) {
        var helper = new CodeLensHelper();
        this._lenses.forEach(function (lens) { return lens.dispose(helper, viewZoneChangeAccessor); });
        if (decChangeAccessor) {
            helper.commit(decChangeAccessor);
        }
        this._lenses = [];
    };
    CodeLensContribution.prototype._renderCodeLensSymbols = function (symbols) {
        var _this = this;
        if (!this._editor.getModel()) {
            return;
        }
        var maxLineNumber = this._editor.getModel().getLineCount();
        var groups = [];
        var lastGroup;
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            var line = symbol.symbol.range.startLineNumber;
            if (line < 1 || line > maxLineNumber) {
                // invalid code lens
                continue;
            }
            else if (lastGroup && lastGroup[lastGroup.length - 1].symbol.range.startLineNumber === line) {
                // on same line as previous
                lastGroup.push(symbol);
            }
            else {
                // on later line as previous
                lastGroup = [symbol];
                groups.push(lastGroup);
            }
        }
        var scrollState = StableEditorScrollState.capture(this._editor);
        this._editor.changeDecorations(function (changeAccessor) {
            _this._editor.changeViewZones(function (accessor) {
                var codeLensIndex = 0, groupsIndex = 0, helper = new CodeLensHelper();
                while (groupsIndex < groups.length && codeLensIndex < _this._lenses.length) {
                    var symbolsLineNumber = groups[groupsIndex][0].symbol.range.startLineNumber;
                    var codeLensLineNumber = _this._lenses[codeLensIndex].getLineNumber();
                    if (codeLensLineNumber < symbolsLineNumber) {
                        _this._lenses[codeLensIndex].dispose(helper, accessor);
                        _this._lenses.splice(codeLensIndex, 1);
                    }
                    else if (codeLensLineNumber === symbolsLineNumber) {
                        _this._lenses[codeLensIndex].updateCodeLensSymbols(groups[groupsIndex], helper);
                        groupsIndex++;
                        codeLensIndex++;
                    }
                    else {
                        _this._lenses.splice(codeLensIndex, 0, new CodeLens(groups[groupsIndex], _this._editor, helper, accessor, _this._commandService, _this._notificationService, function () { return _this._detectVisibleLenses.schedule(); }));
                        codeLensIndex++;
                        groupsIndex++;
                    }
                }
                // Delete extra code lenses
                while (codeLensIndex < _this._lenses.length) {
                    _this._lenses[codeLensIndex].dispose(helper, accessor);
                    _this._lenses.splice(codeLensIndex, 1);
                }
                // Create extra symbols
                while (groupsIndex < groups.length) {
                    _this._lenses.push(new CodeLens(groups[groupsIndex], _this._editor, helper, accessor, _this._commandService, _this._notificationService, function () { return _this._detectVisibleLenses.schedule(); }));
                    groupsIndex++;
                }
                helper.commit(changeAccessor);
            });
        });
        scrollState.restore(this._editor);
    };
    CodeLensContribution.prototype._onViewportChanged = function () {
        var _this = this;
        if (this._currentResolveCodeLensSymbolsPromise) {
            this._currentResolveCodeLensSymbolsPromise.cancel();
            this._currentResolveCodeLensSymbolsPromise = null;
        }
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        var toResolve = [];
        var lenses = [];
        this._lenses.forEach(function (lens) {
            var request = lens.computeIfNecessary(model);
            if (request) {
                toResolve.push(request);
                lenses.push(lens);
            }
        });
        if (toResolve.length === 0) {
            return;
        }
        this._currentResolveCodeLensSymbolsPromise = createCancelablePromise(function (token) {
            var promises = toResolve.map(function (request, i) {
                var resolvedSymbols = new Array(request.length);
                var promises = request.map(function (request, i) {
                    if (typeof request.provider.resolveCodeLens === 'function') {
                        return Promise.resolve(request.provider.resolveCodeLens(model, request.symbol, token)).then(function (symbol) {
                            resolvedSymbols[i] = symbol;
                        });
                    }
                    resolvedSymbols[i] = request.symbol;
                    return Promise.resolve(void 0);
                });
                return Promise.all(promises).then(function () {
                    lenses[i].updateCommands(resolvedSymbols);
                });
            });
            return Promise.all(promises);
        });
        this._currentResolveCodeLensSymbolsPromise.then(function () {
            _this._currentResolveCodeLensSymbolsPromise = null;
        }).catch(function (err) {
            _this._currentResolveCodeLensSymbolsPromise = null;
            onUnexpectedError(err);
        });
    };
    CodeLensContribution.ID = 'css.editor.codeLens';
    CodeLensContribution = __decorate([
        __param(1, ICommandService),
        __param(2, INotificationService)
    ], CodeLensContribution);
    return CodeLensContribution;
}());
export { CodeLensContribution };
registerEditorContribution(CodeLensContribution);
