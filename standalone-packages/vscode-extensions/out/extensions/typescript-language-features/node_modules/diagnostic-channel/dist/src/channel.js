"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
var patchRequire_1 = require("./patchRequire");
var patchRequire_2 = require("./patchRequire");
exports.makePatchingRequire = patchRequire_2.makePatchingRequire;
var trueFilter = function (publishing) { return true; };
var ContextPreservingEventEmitter = (function () {
    function ContextPreservingEventEmitter() {
        this.version = require("./../../package.json").version; // Allow for future versions to replace things?
        this.subscribers = {};
        this.contextPreservationFunction = function (cb) { return cb; };
        this.knownPatches = {};
        this.currentlyPublishing = false;
    }
    ContextPreservingEventEmitter.prototype.shouldPublish = function (name) {
        var listeners = this.subscribers[name];
        if (listeners) {
            return listeners.some(function (_a) {
                var filter = _a.filter;
                return !filter || filter(false);
            });
        }
        return false;
    };
    ContextPreservingEventEmitter.prototype.publish = function (name, event) {
        if (this.currentlyPublishing) {
            return; // Avoid reentrancy
        }
        var listeners = this.subscribers[name];
        // Note: Listeners called synchronously to preserve context
        if (listeners) {
            var standardEvent_1 = {
                timestamp: Date.now(),
                data: event,
            };
            this.currentlyPublishing = true;
            listeners.forEach(function (_a) {
                var listener = _a.listener, filter = _a.filter;
                try {
                    if (filter && filter(true)) {
                        listener(standardEvent_1);
                    }
                }
                catch (e) {
                    // Subscriber threw an error
                }
            });
            this.currentlyPublishing = false;
        }
    };
    ContextPreservingEventEmitter.prototype.subscribe = function (name, listener, filter) {
        if (filter === void 0) { filter = trueFilter; }
        if (!this.subscribers[name]) {
            this.subscribers[name] = [];
        }
        this.subscribers[name].push({ listener: listener, filter: filter });
    };
    ContextPreservingEventEmitter.prototype.unsubscribe = function (name, listener, filter) {
        if (filter === void 0) { filter = trueFilter; }
        var listeners = this.subscribers[name];
        if (listeners) {
            for (var index = 0; index < listeners.length; ++index) {
                if (listeners[index].listener === listener && listeners[index].filter === filter) {
                    listeners.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    };
    // Used for tests
    ContextPreservingEventEmitter.prototype.reset = function () {
        var _this = this;
        this.subscribers = {};
        this.contextPreservationFunction = function (cb) { return cb; };
        // Modify the knownPatches object rather than replace, since a reference will be used in the require patcher
        Object.getOwnPropertyNames(this.knownPatches).forEach(function (prop) { return delete _this.knownPatches[prop]; });
    };
    ContextPreservingEventEmitter.prototype.bindToContext = function (cb) {
        return this.contextPreservationFunction(cb);
    };
    ContextPreservingEventEmitter.prototype.addContextPreservation = function (preserver) {
        var previousPreservationStack = this.contextPreservationFunction;
        this.contextPreservationFunction = (function (cb) { return preserver(previousPreservationStack(cb)); });
    };
    ContextPreservingEventEmitter.prototype.registerMonkeyPatch = function (packageName, patcher) {
        if (!this.knownPatches[packageName]) {
            this.knownPatches[packageName] = [];
        }
        this.knownPatches[packageName].push(patcher);
    };
    ContextPreservingEventEmitter.prototype.getPatchesObject = function () {
        return this.knownPatches;
    };
    return ContextPreservingEventEmitter;
}());
if (!global.diagnosticsSource) {
    global.diagnosticsSource = new ContextPreservingEventEmitter();
    // TODO: should this only patch require after at least one monkey patch is registered?
    /* tslint:disable-next-line:no-var-requires */
    var moduleModule = require("module");
    // Note: We pass in the object now before any patches are registered, but the object is passed by reference
    // so any updates made to the object will be visible in the patcher.
    moduleModule.prototype.require = patchRequire_1.makePatchingRequire(global.diagnosticsSource.getPatchesObject());
}
exports.channel = global.diagnosticsSource;
//# sourceMappingURL=channel.js.map