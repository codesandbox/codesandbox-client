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
import { illegalState } from '../../../base/common/errors.js';
import { create } from '../../../base/common/types.js';
import { Graph } from './graph.js';
import { SyncDescriptor } from './descriptors.js';
import { IInstantiationService, _util, optional } from './instantiation.js';
import { ServiceCollection } from './serviceCollection.js';
// TRACING
var _enableTracing = false;
var InstantiationService = /** @class */ (function () {
    function InstantiationService(services, strict, parent) {
        if (services === void 0) { services = new ServiceCollection(); }
        if (strict === void 0) { strict = false; }
        this._services = services;
        this._strict = strict;
        this._parent = parent;
        this._services.set(IInstantiationService, this);
    }
    InstantiationService.prototype.createChild = function (services) {
        return new InstantiationService(services, this._strict, this);
    };
    InstantiationService.prototype.invokeFunction = function (fn) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _trace = Trace.traceInvocation(fn);
        var _done = false;
        try {
            var accessor = {
                get: function (id, isOptional) {
                    if (_done) {
                        throw illegalState('service accessor is only valid during the invocation of its target method');
                    }
                    var result = _this._getOrCreateServiceInstance(id, _trace);
                    if (!result && isOptional !== optional) {
                        throw new Error("[invokeFunction] unknown service '" + id + "'");
                    }
                    return result;
                }
            };
            return fn.apply(undefined, [accessor].concat(args));
        }
        finally {
            _done = true;
            _trace.stop();
        }
    };
    InstantiationService.prototype.createInstance = function (ctorOrDescriptor) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var _trace;
        var result;
        if (ctorOrDescriptor instanceof SyncDescriptor) {
            _trace = Trace.traceCreation(ctorOrDescriptor.ctor);
            result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest), _trace);
        }
        else {
            _trace = Trace.traceCreation(ctorOrDescriptor);
            result = this._createInstance(ctorOrDescriptor, rest, _trace);
        }
        _trace.stop();
        return result;
    };
    InstantiationService.prototype._createInstance = function (ctor, args, _trace) {
        if (args === void 0) { args = []; }
        // arguments defined by service decorators
        var serviceDependencies = _util.getServiceDependencies(ctor).sort(function (a, b) { return a.index - b.index; });
        var serviceArgs = [];
        for (var _i = 0, serviceDependencies_1 = serviceDependencies; _i < serviceDependencies_1.length; _i++) {
            var dependency = serviceDependencies_1[_i];
            var service = this._getOrCreateServiceInstance(dependency.id, _trace);
            if (!service && this._strict && !dependency.optional) {
                throw new Error("[createInstance] " + ctor.name + " depends on UNKNOWN service " + dependency.id + ".");
            }
            serviceArgs.push(service);
        }
        var firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;
        // check for argument mismatches, adjust static args if needed
        if (args.length !== firstServiceArgPos) {
            console.warn("[createInstance] First service dependency of " + ctor.name + " at position " + (firstServiceArgPos + 1) + " conflicts with " + args.length + " static arguments");
            var delta = firstServiceArgPos - args.length;
            if (delta > 0) {
                args = args.concat(new Array(delta));
            }
            else {
                args = args.slice(0, firstServiceArgPos);
            }
        }
        // now create the instance
        return create.apply(null, [ctor].concat(args, serviceArgs));
    };
    InstantiationService.prototype._setServiceInstance = function (id, instance) {
        if (this._services.get(id) instanceof SyncDescriptor) {
            this._services.set(id, instance);
        }
        else if (this._parent) {
            this._parent._setServiceInstance(id, instance);
        }
        else {
            throw new Error('illegalState - setting UNKNOWN service instance');
        }
    };
    InstantiationService.prototype._getServiceInstanceOrDescriptor = function (id) {
        var instanceOrDesc = this._services.get(id);
        if (!instanceOrDesc && this._parent) {
            return this._parent._getServiceInstanceOrDescriptor(id);
        }
        else {
            return instanceOrDesc;
        }
    };
    InstantiationService.prototype._getOrCreateServiceInstance = function (id, _trace) {
        var thing = this._getServiceInstanceOrDescriptor(id);
        if (thing instanceof SyncDescriptor) {
            return this._createAndCacheServiceInstance(id, thing, _trace.branch(id, true));
        }
        else {
            _trace.branch(id, false);
            return thing;
        }
    };
    InstantiationService.prototype._createAndCacheServiceInstance = function (id, desc, _trace) {
        var graph = new Graph(function (data) { return data.id.toString(); });
        function throwCycleError() {
            var err = new Error('[createInstance] cyclic dependency between services');
            err.message = graph.toString();
            throw err;
        }
        var count = 0;
        var stack = [{ id: id, desc: desc, _trace: _trace }];
        while (stack.length) {
            var item = stack.pop();
            graph.lookupOrInsertNode(item);
            // TODO@joh use the graph to find a cycle
            // a weak heuristic for cycle checks
            if (count++ > 100) {
                throwCycleError();
            }
            // check all dependencies for existence and if they need to be created first
            var dependencies = _util.getServiceDependencies(item.desc.ctor);
            for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                var dependency = dependencies_1[_i];
                var instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
                if (!instanceOrDesc && !dependency.optional) {
                    console.warn("[createInstance] " + id + " depends on " + dependency.id + " which is NOT registered.");
                }
                if (instanceOrDesc instanceof SyncDescriptor) {
                    var d = { id: dependency.id, desc: instanceOrDesc, _trace: item._trace.branch(dependency.id, true) };
                    graph.insertEdge(item, d);
                    stack.push(d);
                }
            }
        }
        while (true) {
            var roots = graph.roots();
            // if there is no more roots but still
            // nodes in the graph we have a cycle
            if (roots.length === 0) {
                if (!graph.isEmpty()) {
                    throwCycleError();
                }
                break;
            }
            for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                var data = roots_1[_a].data;
                // create instance and overwrite the service collections
                var instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, false, data._trace);
                this._setServiceInstance(data.id, instance);
                graph.removeNode(data);
            }
        }
        return this._getServiceInstanceOrDescriptor(id);
    };
    InstantiationService.prototype._createServiceInstanceWithOwner = function (id, ctor, args, supportsDelayedInstantiation, _trace) {
        if (args === void 0) { args = []; }
        if (this._services.get(id) instanceof SyncDescriptor) {
            return this._createServiceInstance(ctor, args, supportsDelayedInstantiation, _trace);
        }
        else if (this._parent) {
            return this._parent._createServiceInstanceWithOwner(id, ctor, args, supportsDelayedInstantiation, _trace);
        }
        else {
            throw new Error('illegalState - creating UNKNOWN service instance');
        }
    };
    InstantiationService.prototype._createServiceInstance = function (ctor, args, supportsDelayedInstantiation, _trace) {
        if (args === void 0) { args = []; }
        return this._createInstance(ctor, args, _trace);
    };
    return InstantiationService;
}());
export { InstantiationService };
var Trace = /** @class */ (function () {
    function Trace(type, name) {
        this.type = type;
        this.name = name;
        this._start = Date.now();
        this._dep = [];
    }
    Trace.traceInvocation = function (ctor) {
        return !_enableTracing ? Trace._None : new Trace(1 /* Invocation */, ctor.name || ctor.toString().substring(0, 42).replace(/\n/g, ''));
    };
    Trace.traceCreation = function (ctor) {
        return !_enableTracing ? Trace._None : new Trace(0 /* Creation */, ctor.name);
    };
    Trace.prototype.branch = function (id, first) {
        var child = new Trace(2 /* Branch */, id.toString());
        this._dep.push([id, first, child]);
        return child;
    };
    Trace.prototype.stop = function () {
        var dur = Date.now() - this._start;
        Trace._totals += dur;
        var causedCreation = false;
        function printChild(n, trace) {
            var res = [];
            var prefix = new Array(n + 1).join('\t');
            for (var _i = 0, _a = trace._dep; _i < _a.length; _i++) {
                var _b = _a[_i], id = _b[0], first = _b[1], child = _b[2];
                if (first && child) {
                    causedCreation = true;
                    res.push(prefix + "CREATES -> " + id);
                    var nested = printChild(n + 1, child);
                    if (nested) {
                        res.push(nested);
                    }
                }
                else {
                    res.push(prefix + "uses -> " + id);
                }
            }
            return res.join('\n');
        }
        var lines = [
            (this.type === 0 /* Creation */ ? 'CREATE' : 'CALL') + " " + this.name,
            "" + printChild(1, this),
            "DONE, took " + dur.toFixed(2) + "ms (grand total " + Trace._totals.toFixed(2) + "ms)"
        ];
        if (dur > 2 || causedCreation) {
            console.log(lines.join('\n'));
        }
    };
    Trace._None = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super.call(this, -1, null) || this;
        }
        class_1.prototype.stop = function () { };
        class_1.prototype.branch = function () { return this; };
        return class_1;
    }(Trace));
    Trace._totals = 0;
    return Trace;
}());
//#endregion
