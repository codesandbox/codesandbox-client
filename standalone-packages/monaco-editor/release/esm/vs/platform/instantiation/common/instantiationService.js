/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { illegalState } from '../../../base/common/errors.js';
import { create } from '../../../base/common/types.js';
import * as assert from '../../../base/common/assert.js';
import { Graph } from '../../../base/common/graph.js';
import { SyncDescriptor } from './descriptors.js';
import { IInstantiationService, _util, optional } from './instantiation.js';
import { ServiceCollection } from './serviceCollection.js';
var InstantiationService = /** @class */ (function () {
    function InstantiationService(services, strict) {
        if (services === void 0) { services = new ServiceCollection(); }
        if (strict === void 0) { strict = false; }
        this._services = services;
        this._strict = strict;
        this._services.set(IInstantiationService, this);
    }
    InstantiationService.prototype.createChild = function (services) {
        var _this = this;
        this._services.forEach(function (id, thing) {
            if (services.has(id)) {
                return;
            }
            // If we copy descriptors we might end up with
            // multiple instances of the same service
            if (thing instanceof SyncDescriptor) {
                thing = _this._createAndCacheServiceInstance(id, thing);
            }
            services.set(id, thing);
        });
        return new InstantiationService(services, this._strict);
    };
    InstantiationService.prototype.invokeFunction = function (signature) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var accessor;
        try {
            accessor = {
                get: function (id, isOptional) {
                    var result = _this._getOrCreateServiceInstance(id);
                    if (!result && isOptional !== optional) {
                        throw new Error("[invokeFunction] unknown service '" + id + "'");
                    }
                    return result;
                }
            };
            return signature.apply(undefined, [accessor].concat(args));
        }
        finally {
            accessor.get = function () {
                throw illegalState('service accessor is only valid during the invocation of its target method');
            };
        }
    };
    InstantiationService.prototype.createInstance = function (param) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (param instanceof SyncDescriptor) {
            // sync
            return this._createInstance(param, rest);
        }
        else {
            // sync, just ctor
            return this._createInstance(new SyncDescriptor(param), rest);
        }
    };
    InstantiationService.prototype._createInstance = function (desc, args) {
        // arguments given by createInstance-call and/or the descriptor
        var staticArgs = desc.staticArguments.concat(args);
        // arguments defined by service decorators
        var serviceDependencies = _util.getServiceDependencies(desc.ctor).sort(function (a, b) { return a.index - b.index; });
        var serviceArgs = [];
        for (var _i = 0, serviceDependencies_1 = serviceDependencies; _i < serviceDependencies_1.length; _i++) {
            var dependency = serviceDependencies_1[_i];
            var service = this._getOrCreateServiceInstance(dependency.id);
            if (!service && this._strict && !dependency.optional) {
                throw new Error("[createInstance] " + desc.ctor.name + " depends on UNKNOWN service " + dependency.id + ".");
            }
            serviceArgs.push(service);
        }
        var firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : staticArgs.length;
        // check for argument mismatches, adjust static args if needed
        if (staticArgs.length !== firstServiceArgPos) {
            console.warn("[createInstance] First service dependency of " + desc.ctor.name + " at position " + (firstServiceArgPos + 1) + " conflicts with " + staticArgs.length + " static arguments");
            var delta = firstServiceArgPos - staticArgs.length;
            if (delta > 0) {
                staticArgs = staticArgs.concat(new Array(delta));
            }
            else {
                staticArgs = staticArgs.slice(0, firstServiceArgPos);
            }
        }
        // // check for missing args
        // for (let i = 0; i < serviceArgs.length; i++) {
        // 	if (!serviceArgs[i]) {
        // 		console.warn(`${desc.ctor.name} MISSES service dependency ${serviceDependencies[i].id}`, new Error().stack);
        // 	}
        // }
        // now create the instance
        var argArray = [desc.ctor];
        argArray.push.apply(argArray, staticArgs);
        argArray.push.apply(argArray, serviceArgs);
        return create.apply(null, argArray);
    };
    InstantiationService.prototype._getOrCreateServiceInstance = function (id) {
        var thing = this._services.get(id);
        if (thing instanceof SyncDescriptor) {
            return this._createAndCacheServiceInstance(id, thing);
        }
        else {
            return thing;
        }
    };
    InstantiationService.prototype._createAndCacheServiceInstance = function (id, desc) {
        assert.ok(this._services.get(id) instanceof SyncDescriptor);
        var graph = new Graph(function (data) { return data.id.toString(); });
        function throwCycleError() {
            var err = new Error('[createInstance] cyclic dependency between services');
            err.message = graph.toString();
            throw err;
        }
        var count = 0;
        var stack = [{ id: id, desc: desc }];
        while (stack.length) {
            var item = stack.pop();
            graph.lookupOrInsertNode(item);
            // TODO@joh use the graph to find a cycle
            // a weak heuristic for cycle checks
            if (count++ > 100) {
                throwCycleError();
            }
            // check all dependencies for existence and if the need to be created first
            var dependencies = _util.getServiceDependencies(item.desc.ctor);
            for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                var dependency = dependencies_1[_i];
                var instanceOrDesc = this._services.get(dependency.id);
                if (!instanceOrDesc) {
                    console.warn("[createInstance] " + id + " depends on " + dependency.id + " which is NOT registered.");
                }
                if (instanceOrDesc instanceof SyncDescriptor) {
                    var d = { id: dependency.id, desc: instanceOrDesc };
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
                if (graph.length !== 0) {
                    throwCycleError();
                }
                break;
            }
            for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                var root = roots_1[_a];
                // create instance and overwrite the service collections
                var instance = this._createInstance(root.data.desc, []);
                this._services.set(root.data.id, instance);
                graph.removeNode(root.data);
            }
        }
        return this._services.get(id);
    };
    return InstantiationService;
}());
export { InstantiationService };
