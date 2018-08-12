define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = monaco.Promise;
    var WorkerManager = /** @class */ (function () {
        function WorkerManager(modeId, defaults) {
            var _this = this;
            this._modeId = modeId;
            this._defaults = defaults;
            this._worker = null;
            this._idleCheckInterval = setInterval(function () { return _this._checkIfIdle(); }, 30 * 1000);
            this._lastUsedTime = 0;
            this._configChangeListener = this._defaults.onDidChange(function () { return _this._stopWorker(); });
        }
        WorkerManager.prototype._stopWorker = function () {
            if (this._worker) {
                this._worker.dispose();
                this._worker = null;
            }
            this._client = null;
        };
        WorkerManager.prototype.dispose = function () {
            clearInterval(this._idleCheckInterval);
            this._configChangeListener.dispose();
            this._stopWorker();
        };
        WorkerManager.prototype._checkIfIdle = function () {
            if (!this._worker) {
                return;
            }
            var maxIdleTime = this._defaults.getWorkerMaxIdleTime();
            var timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
            if (maxIdleTime > 0 && timePassedSinceLastUsed > maxIdleTime) {
                this._stopWorker();
            }
        };
        WorkerManager.prototype._getClient = function () {
            var _this = this;
            this._lastUsedTime = Date.now();
            if (!this._client) {
                this._worker = monaco.editor.createWebWorker({
                    // module that exports the create() method and returns a `TypeScriptWorker` instance
                    moduleId: 'vs/language/typescript/tsWorker',
                    label: this._modeId,
                    // passed in to the create() method
                    createData: {
                        compilerOptions: this._defaults.getCompilerOptions(),
                        extraLibs: this._defaults.getExtraLibs()
                    }
                });
                var p = this._worker.getProxy();
                if (this._defaults.getEagerModelSync()) {
                    p = p.then(function (worker) {
                        return _this._worker.withSyncedResources(monaco.editor.getModels()
                            .filter(function (model) { return model.getModeId() === _this._modeId; })
                            .map(function (model) { return model.uri; }));
                    });
                }
                this._client = p;
            }
            return this._client;
        };
        WorkerManager.prototype.getLanguageServiceWorker = function () {
            var _this = this;
            var resources = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                resources[_i] = arguments[_i];
            }
            var _client;
            return toShallowCancelPromise(this._getClient().then(function (client) {
                _client = client;
            }).then(function (_) {
                return _this._worker.withSyncedResources(resources);
            }).then(function (_) { return _client; }));
        };
        return WorkerManager;
    }());
    exports.WorkerManager = WorkerManager;
    function toShallowCancelPromise(p) {
        var completeCallback;
        var errorCallback;
        var r = new Promise(function (c, e) {
            completeCallback = c;
            errorCallback = e;
        }, function () { });
        p.then(completeCallback, errorCallback);
        return r;
    }
});
