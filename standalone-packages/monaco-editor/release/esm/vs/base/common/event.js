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
import { onUnexpectedError } from './errors.js';
import { once as onceFn } from './functional.js';
import { combinedDisposable, Disposable, toDisposable } from './lifecycle.js';
import { LinkedList } from './linkedList.js';
import { TPromise } from './winjs.base.js';
export var Event;
(function (Event) {
    var _disposable = { dispose: function () { } };
    Event.None = function () { return _disposable; };
})(Event || (Event = {}));
/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
    class Document {

        private _onDidChange = new Emitter<(value:string)=>any>();

        public onDidChange = this._onDidChange.event;

        // getter-style
        // get onDidChange(): Event<(value:string)=>any> {
        // 	return this._onDidChange.event;
        // }

        private _doIt() {
            //...
            this._onDidChange.fire(value);
        }
    }
 */
var Emitter = /** @class */ (function () {
    function Emitter(_options) {
        this._options = _options;
    }
    Object.defineProperty(Emitter.prototype, "event", {
        /**
         * For the public to allow to subscribe
         * to events from this Emitter
         */
        get: function () {
            var _this = this;
            if (!this._event) {
                this._event = function (listener, thisArgs, disposables) {
                    if (!_this._listeners) {
                        _this._listeners = new LinkedList();
                    }
                    var firstListener = _this._listeners.isEmpty();
                    if (firstListener && _this._options && _this._options.onFirstListenerAdd) {
                        _this._options.onFirstListenerAdd(_this);
                    }
                    var remove = _this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);
                    if (firstListener && _this._options && _this._options.onFirstListenerDidAdd) {
                        _this._options.onFirstListenerDidAdd(_this);
                    }
                    if (_this._options && _this._options.onListenerDidAdd) {
                        _this._options.onListenerDidAdd(_this, listener, thisArgs);
                    }
                    var result;
                    result = {
                        dispose: function () {
                            result.dispose = Emitter._noop;
                            if (!_this._disposed) {
                                remove();
                                if (_this._options && _this._options.onLastListenerRemove && _this._listeners.isEmpty()) {
                                    _this._options.onLastListenerRemove(_this);
                                }
                            }
                        }
                    };
                    if (Array.isArray(disposables)) {
                        disposables.push(result);
                    }
                    return result;
                };
            }
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    Emitter.prototype.fire = function (event) {
        if (this._listeners) {
            // put all [listener,event]-pairs into delivery queue
            // then emit all event. an inner/nested event might be
            // the driver of this
            if (!this._deliveryQueue) {
                this._deliveryQueue = [];
            }
            for (var iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
                this._deliveryQueue.push([e.value, event]);
            }
            while (this._deliveryQueue.length > 0) {
                var _a = this._deliveryQueue.shift(), listener = _a[0], event_1 = _a[1];
                try {
                    if (typeof listener === 'function') {
                        listener.call(undefined, event_1);
                    }
                    else {
                        listener[0].call(listener[1], event_1);
                    }
                }
                catch (e) {
                    onUnexpectedError(e);
                }
            }
        }
    };
    Emitter.prototype.dispose = function () {
        if (this._listeners) {
            this._listeners = undefined;
        }
        if (this._deliveryQueue) {
            this._deliveryQueue.length = 0;
        }
        this._disposed = true;
    };
    Emitter._noop = function () { };
    return Emitter;
}());
export { Emitter };
var AsyncEmitter = /** @class */ (function (_super) {
    __extends(AsyncEmitter, _super);
    function AsyncEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncEmitter.prototype.fireAsync = function (eventFn) {
        return __awaiter(this, void 0, void 0, function () {
            var iter, e, thenables, _a, listener, event_2, thenables;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._listeners) {
                            return [2 /*return*/];
                        }
                        // put all [listener,event]-pairs into delivery queue
                        // then emit all event. an inner/nested event might be
                        // the driver of this
                        if (!this._asyncDeliveryQueue) {
                            this._asyncDeliveryQueue = [];
                        }
                        for (iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
                            thenables = [];
                            this._asyncDeliveryQueue.push([e.value, eventFn(thenables, typeof e.value === 'function' ? e.value : e.value[0]), thenables]);
                        }
                        _b.label = 1;
                    case 1:
                        if (!(this._asyncDeliveryQueue.length > 0)) return [3 /*break*/, 3];
                        _a = this._asyncDeliveryQueue.shift(), listener = _a[0], event_2 = _a[1], thenables = _a[2];
                        try {
                            if (typeof listener === 'function') {
                                listener.call(undefined, event_2);
                            }
                            else {
                                listener[0].call(listener[1], event_2);
                            }
                        }
                        catch (e) {
                            onUnexpectedError(e);
                            return [3 /*break*/, 1];
                        }
                        // freeze thenables-collection to enforce sync-calls to
                        // wait until and then wait for all thenables to resolve
                        Object.freeze(thenables);
                        return [4 /*yield*/, Promise.all(thenables)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AsyncEmitter;
}(Emitter));
export { AsyncEmitter };
var EventMultiplexer = /** @class */ (function () {
    function EventMultiplexer() {
        var _this = this;
        this.hasListeners = false;
        this.events = [];
        this.emitter = new Emitter({
            onFirstListenerAdd: function () { return _this.onFirstListenerAdd(); },
            onLastListenerRemove: function () { return _this.onLastListenerRemove(); }
        });
    }
    Object.defineProperty(EventMultiplexer.prototype, "event", {
        get: function () {
            return this.emitter.event;
        },
        enumerable: true,
        configurable: true
    });
    EventMultiplexer.prototype.add = function (event) {
        var _this = this;
        var e = { event: event, listener: null };
        this.events.push(e);
        if (this.hasListeners) {
            this.hook(e);
        }
        var dispose = function () {
            if (_this.hasListeners) {
                _this.unhook(e);
            }
            var idx = _this.events.indexOf(e);
            _this.events.splice(idx, 1);
        };
        return toDisposable(onceFn(dispose));
    };
    EventMultiplexer.prototype.onFirstListenerAdd = function () {
        var _this = this;
        this.hasListeners = true;
        this.events.forEach(function (e) { return _this.hook(e); });
    };
    EventMultiplexer.prototype.onLastListenerRemove = function () {
        var _this = this;
        this.hasListeners = false;
        this.events.forEach(function (e) { return _this.unhook(e); });
    };
    EventMultiplexer.prototype.hook = function (e) {
        var _this = this;
        e.listener = e.event(function (r) { return _this.emitter.fire(r); });
    };
    EventMultiplexer.prototype.unhook = function (e) {
        e.listener.dispose();
        e.listener = null;
    };
    EventMultiplexer.prototype.dispose = function () {
        this.emitter.dispose();
    };
    return EventMultiplexer;
}());
export { EventMultiplexer };
export function fromCallback(fn) {
    var listener;
    var emitter = new Emitter({
        onFirstListenerAdd: function () { return listener = fn(function (e) { return emitter.fire(e); }); },
        onLastListenerRemove: function () { return listener.dispose(); }
    });
    return emitter.event;
}
export function fromPromise(promise) {
    var emitter = new Emitter();
    var shouldEmit = false;
    promise
        .then(null, function () { return null; })
        .then(function () {
        if (!shouldEmit) {
            setTimeout(function () { return emitter.fire(); }, 0);
        }
        else {
            emitter.fire();
        }
    });
    shouldEmit = true;
    return emitter.event;
}
export function toPromise(event) {
    return new TPromise(function (c) { return once(event)(c); });
}
export function toNativePromise(event) {
    return new Promise(function (c) { return once(event)(c); });
}
export function once(event) {
    return function (listener, thisArgs, disposables) {
        if (thisArgs === void 0) { thisArgs = null; }
        // we need this, in case the event fires during the listener call
        var didFire = false;
        var result = event(function (e) {
            if (didFire) {
                return;
            }
            else if (result) {
                result.dispose();
            }
            else {
                didFire = true;
            }
            return listener.call(thisArgs, e);
        }, null, disposables);
        if (didFire) {
            result.dispose();
        }
        return result;
    };
}
export function anyEvent() {
    var events = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        events[_i] = arguments[_i];
    }
    return function (listener, thisArgs, disposables) {
        if (thisArgs === void 0) { thisArgs = null; }
        return combinedDisposable(events.map(function (event) { return event(function (e) { return listener.call(thisArgs, e); }, null, disposables); }));
    };
}
export function debounceEvent(event, merger, delay, leading) {
    if (delay === void 0) { delay = 100; }
    if (leading === void 0) { leading = false; }
    var subscription;
    var output = undefined;
    var handle = undefined;
    var numDebouncedCalls = 0;
    var emitter = new Emitter({
        onFirstListenerAdd: function () {
            subscription = event(function (cur) {
                numDebouncedCalls++;
                output = merger(output, cur);
                if (leading && !handle) {
                    emitter.fire(output);
                }
                clearTimeout(handle);
                handle = setTimeout(function () {
                    var _output = output;
                    output = undefined;
                    handle = undefined;
                    if (!leading || numDebouncedCalls > 1) {
                        emitter.fire(_output);
                    }
                    numDebouncedCalls = 0;
                }, delay);
            });
        },
        onLastListenerRemove: function () {
            subscription.dispose();
        }
    });
    return emitter.event;
}
/**
 * The EventDelayer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */
var EventBufferer = /** @class */ (function () {
    function EventBufferer() {
        this.buffers = [];
    }
    EventBufferer.prototype.wrapEvent = function (event) {
        var _this = this;
        return function (listener, thisArgs, disposables) {
            return event(function (i) {
                var buffer = _this.buffers[_this.buffers.length - 1];
                if (buffer) {
                    buffer.push(function () { return listener.call(thisArgs, i); });
                }
                else {
                    listener.call(thisArgs, i);
                }
            }, void 0, disposables);
        };
    };
    EventBufferer.prototype.bufferEvents = function (fn) {
        var buffer = [];
        this.buffers.push(buffer);
        fn();
        this.buffers.pop();
        buffer.forEach(function (flush) { return flush(); });
    };
    return EventBufferer;
}());
export { EventBufferer };
export function mapEvent(event, map) {
    return function (listener, thisArgs, disposables) {
        if (thisArgs === void 0) { thisArgs = null; }
        return event(function (i) { return listener.call(thisArgs, map(i)); }, null, disposables);
    };
}
export function forEach(event, each) {
    return function (listener, thisArgs, disposables) {
        if (thisArgs === void 0) { thisArgs = null; }
        return event(function (i) { each(i); listener.call(thisArgs, i); }, null, disposables);
    };
}
export function filterEvent(event, filter) {
    return function (listener, thisArgs, disposables) {
        if (thisArgs === void 0) { thisArgs = null; }
        return event(function (e) { return filter(e) && listener.call(thisArgs, e); }, null, disposables);
    };
}
export function signalEvent(event) {
    return event;
}
var ChainableEvent = /** @class */ (function () {
    function ChainableEvent(_event) {
        this._event = _event;
    }
    Object.defineProperty(ChainableEvent.prototype, "event", {
        get: function () { return this._event; },
        enumerable: true,
        configurable: true
    });
    ChainableEvent.prototype.map = function (fn) {
        return new ChainableEvent(mapEvent(this._event, fn));
    };
    ChainableEvent.prototype.forEach = function (fn) {
        return new ChainableEvent(forEach(this._event, fn));
    };
    ChainableEvent.prototype.filter = function (fn) {
        return new ChainableEvent(filterEvent(this._event, fn));
    };
    ChainableEvent.prototype.latch = function () {
        return new ChainableEvent(latch(this._event));
    };
    ChainableEvent.prototype.on = function (listener, thisArgs, disposables) {
        return this._event(listener, thisArgs, disposables);
    };
    ChainableEvent.prototype.once = function (listener, thisArgs, disposables) {
        return once(this._event)(listener, thisArgs, disposables);
    };
    return ChainableEvent;
}());
export function chain(event) {
    return new ChainableEvent(event);
}
export function stopwatch(event) {
    var start = new Date().getTime();
    return mapEvent(once(event), function (_) { return new Date().getTime() - start; });
}
/**
 * Buffers the provided event until a first listener comes
 * along, at which point fire all the events at once and
 * pipe the event from then on.
 *
 * ```typescript
 * const emitter = new Emitter<number>();
 * const event = emitter.event;
 * const bufferedEvent = buffer(event);
 *
 * emitter.fire(1);
 * emitter.fire(2);
 * emitter.fire(3);
 * // nothing...
 *
 * const listener = bufferedEvent(num => console.log(num));
 * // 1, 2, 3
 *
 * emitter.fire(4);
 * // 4
 * ```
 */
export function buffer(event, nextTick, buffer) {
    if (nextTick === void 0) { nextTick = false; }
    if (buffer === void 0) { buffer = []; }
    buffer = buffer.slice();
    var listener = event(function (e) {
        if (buffer) {
            buffer.push(e);
        }
        else {
            emitter.fire(e);
        }
    });
    var flush = function () {
        buffer.forEach(function (e) { return emitter.fire(e); });
        buffer = null;
    };
    var emitter = new Emitter({
        onFirstListenerAdd: function () {
            if (!listener) {
                listener = event(function (e) { return emitter.fire(e); });
            }
        },
        onFirstListenerDidAdd: function () {
            if (buffer) {
                if (nextTick) {
                    setTimeout(flush);
                }
                else {
                    flush();
                }
            }
        },
        onLastListenerRemove: function () {
            listener.dispose();
            listener = null;
        }
    });
    return emitter.event;
}
/**
 * Similar to `buffer` but it buffers indefinitely and repeats
 * the buffered events to every new listener.
 */
export function echo(event, nextTick, buffer) {
    if (nextTick === void 0) { nextTick = false; }
    if (buffer === void 0) { buffer = []; }
    buffer = buffer.slice();
    event(function (e) {
        buffer.push(e);
        emitter.fire(e);
    });
    var flush = function (listener, thisArgs) { return buffer.forEach(function (e) { return listener.call(thisArgs, e); }); };
    var emitter = new Emitter({
        onListenerDidAdd: function (emitter, listener, thisArgs) {
            if (nextTick) {
                setTimeout(function () { return flush(listener, thisArgs); });
            }
            else {
                flush(listener, thisArgs);
            }
        }
    });
    return emitter.event;
}
var Relay = /** @class */ (function () {
    function Relay() {
        var _this = this;
        this.listening = false;
        this.inputEvent = Event.None;
        this.inputEventListener = Disposable.None;
        this.emitter = new Emitter({
            onFirstListenerDidAdd: function () {
                _this.listening = true;
                _this.inputEventListener = _this.inputEvent(_this.emitter.fire, _this.emitter);
            },
            onLastListenerRemove: function () {
                _this.listening = false;
                _this.inputEventListener.dispose();
            }
        });
        this.event = this.emitter.event;
    }
    Object.defineProperty(Relay.prototype, "input", {
        set: function (event) {
            this.inputEvent = event;
            if (this.listening) {
                this.inputEventListener.dispose();
                this.inputEventListener = event(this.emitter.fire, this.emitter);
            }
        },
        enumerable: true,
        configurable: true
    });
    Relay.prototype.dispose = function () {
        this.inputEventListener.dispose();
        this.emitter.dispose();
    };
    return Relay;
}());
export { Relay };
export function fromNodeEventEmitter(emitter, eventName, map) {
    if (map === void 0) { map = function (id) { return id; }; }
    var fn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return result.fire(map.apply(void 0, args));
    };
    var onFirstListenerAdd = function () { return emitter.on(eventName, fn); };
    var onLastListenerRemove = function () { return emitter.removeListener(eventName, fn); };
    var result = new Emitter({ onFirstListenerAdd: onFirstListenerAdd, onLastListenerRemove: onLastListenerRemove });
    return result.event;
}
export function latch(event) {
    var firstCall = true;
    var cache;
    return filterEvent(event, function (value) {
        var shouldEmit = firstCall || value !== cache;
        firstCall = false;
        cache = value;
        return shouldEmit;
    });
}
