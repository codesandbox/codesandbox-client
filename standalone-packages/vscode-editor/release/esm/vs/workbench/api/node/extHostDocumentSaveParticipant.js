/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../base/common/uri.js';
import { sequence, always } from '../../../base/common/async.js';
import { illegalState } from '../../../base/common/errors.js';
import { TextEdit } from './extHostTypes.js';
import { Range, TextDocumentSaveReason, EndOfLine } from './extHostTypeConverters.js';
import { LinkedList } from '../../../base/common/linkedList.js';
var ExtHostDocumentSaveParticipant = /** @class */ (function () {
    function ExtHostDocumentSaveParticipant(_logService, _documents, _mainThreadEditors, _thresholds) {
        if (_thresholds === void 0) { _thresholds = { timeout: 1500, errors: 3 }; }
        this._logService = _logService;
        this._documents = _documents;
        this._mainThreadEditors = _mainThreadEditors;
        this._thresholds = _thresholds;
        this._callbacks = new LinkedList();
        this._badListeners = new WeakMap();
        //
    }
    ExtHostDocumentSaveParticipant.prototype.dispose = function () {
        this._callbacks.clear();
    };
    ExtHostDocumentSaveParticipant.prototype.getOnWillSaveTextDocumentEvent = function (extension) {
        var _this = this;
        return function (listener, thisArg, disposables) {
            var remove = _this._callbacks.push([listener, thisArg, extension]);
            var result = { dispose: remove };
            if (Array.isArray(disposables)) {
                disposables.push(result);
            }
            return result;
        };
    };
    ExtHostDocumentSaveParticipant.prototype.$participateInSave = function (data, reason) {
        var _this = this;
        var resource = URI.revive(data);
        var entries = this._callbacks.toArray();
        var didTimeout = false;
        var didTimeoutHandle = setTimeout(function () { return didTimeout = true; }, this._thresholds.timeout);
        var promise = sequence(entries.map(function (listener) {
            return function () {
                if (didTimeout) {
                    // timeout - no more listeners
                    return undefined;
                }
                var document = _this._documents.getDocumentData(resource).document;
                return _this._deliverEventAsyncAndBlameBadListeners(listener, { document: document, reason: TextDocumentSaveReason.to(reason) });
            };
        }));
        return always(promise, function () { return clearTimeout(didTimeoutHandle); });
    };
    ExtHostDocumentSaveParticipant.prototype._deliverEventAsyncAndBlameBadListeners = function (_a, stubEvent) {
        var _this = this;
        var listener = _a[0], thisArg = _a[1], extension = _a[2];
        var errors = this._badListeners.get(listener);
        if (errors > this._thresholds.errors) {
            // bad listener - ignore
            return Promise.resolve(false);
        }
        return this._deliverEventAsync(extension, listener, thisArg, stubEvent).then(function () {
            // don't send result across the wire
            return true;
        }, function (err) {
            _this._logService.error("onWillSaveTextDocument-listener from extension '" + extension.id + "' threw ERROR");
            _this._logService.error(err);
            if (!(err instanceof Error) || err.message !== 'concurrent_edits') {
                var errors_1 = _this._badListeners.get(listener);
                _this._badListeners.set(listener, !errors_1 ? 1 : errors_1 + 1);
                if (errors_1 > _this._thresholds.errors) {
                    _this._logService.info("onWillSaveTextDocument-listener from extension '" + extension.id + "' will now be IGNORED because of timeouts and/or errors");
                }
            }
            return false;
        });
    };
    ExtHostDocumentSaveParticipant.prototype._deliverEventAsync = function (extension, listener, thisArg, stubEvent) {
        var _this = this;
        var promises = [];
        var t1 = Date.now();
        var document = stubEvent.document, reason = stubEvent.reason;
        var version = document.version;
        var event = Object.freeze({
            document: document,
            reason: reason,
            waitUntil: function (p) {
                if (Object.isFrozen(promises)) {
                    throw illegalState('waitUntil can not be called async');
                }
                promises.push(Promise.resolve(p));
            }
        });
        try {
            // fire event
            listener.apply(thisArg, [event]);
        }
        catch (err) {
            return Promise.reject(err);
        }
        // freeze promises after event call
        Object.freeze(promises);
        return new Promise(function (resolve, reject) {
            // join on all listener promises, reject after timeout
            var handle = setTimeout(function () { return reject(new Error('timeout')); }, _this._thresholds.timeout);
            return Promise.all(promises).then(function (edits) {
                _this._logService.debug("onWillSaveTextDocument-listener from extension '" + extension.id + "' finished after " + (Date.now() - t1) + "ms");
                clearTimeout(handle);
                resolve(edits);
            }).catch(function (err) {
                clearTimeout(handle);
                reject(err);
            });
        }).then(function (values) {
            var resourceEdit = {
                resource: document.uri,
                edits: []
            };
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (Array.isArray(value) && value.every(function (e) { return e instanceof TextEdit; })) {
                    for (var _a = 0, value_1 = value; _a < value_1.length; _a++) {
                        var _b = value_1[_a], newText = _b.newText, newEol = _b.newEol, range = _b.range;
                        resourceEdit.edits.push({
                            range: range && Range.from(range),
                            text: newText,
                            eol: EndOfLine.from(newEol)
                        });
                    }
                }
            }
            // apply edits if any and if document
            // didn't change somehow in the meantime
            if (resourceEdit.edits.length === 0) {
                return undefined;
            }
            if (version === document.version) {
                return _this._mainThreadEditors.$tryApplyWorkspaceEdit({ edits: [resourceEdit] });
            }
            // TODO@joh bubble this to listener?
            return Promise.reject(new Error('concurrent_edits'));
        });
    };
    return ExtHostDocumentSaveParticipant;
}());
export { ExtHostDocumentSaveParticipant };
