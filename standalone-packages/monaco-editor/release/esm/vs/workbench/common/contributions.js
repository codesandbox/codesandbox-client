/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Registry } from '../../platform/registry/common/platform.js';
import { runWhenIdle } from '../../base/common/async.js';
export var Extensions;
(function (Extensions) {
    Extensions.Workbench = 'workbench.contributions.kind';
})(Extensions || (Extensions = {}));
var WorkbenchContributionsRegistry = /** @class */ (function () {
    function WorkbenchContributionsRegistry() {
        this.toBeInstantiated = new Map();
    }
    WorkbenchContributionsRegistry.prototype.registerWorkbenchContribution = function (ctor, phase) {
        if (phase === void 0) { phase = 1 /* Starting */; }
        // Instantiate directly if we are already matching the provided phase
        if (this.instantiationService && this.lifecycleService && this.lifecycleService.phase >= phase) {
            this.instantiationService.createInstance(ctor);
        }
        // Otherwise keep contributions by lifecycle phase
        else {
            var toBeInstantiated = this.toBeInstantiated.get(phase);
            if (!toBeInstantiated) {
                toBeInstantiated = [];
                this.toBeInstantiated.set(phase, toBeInstantiated);
            }
            toBeInstantiated.push(ctor);
        }
    };
    WorkbenchContributionsRegistry.prototype.start = function (instantiationService, lifecycleService) {
        var _this = this;
        this.instantiationService = instantiationService;
        this.lifecycleService = lifecycleService;
        [1 /* Starting */, 2 /* Restoring */, 3 /* Running */, 4 /* Eventually */].forEach(function (phase) {
            _this.instantiateByPhase(instantiationService, lifecycleService, phase);
        });
    };
    WorkbenchContributionsRegistry.prototype.instantiateByPhase = function (instantiationService, lifecycleService, phase) {
        var _this = this;
        // Instantiate contributions directly when phase is already reached
        if (lifecycleService.phase >= phase) {
            this.doInstantiateByPhase(instantiationService, phase);
        }
        // Otherwise wait for phase to be reached
        else {
            lifecycleService.when(phase).then(function () {
                _this.doInstantiateByPhase(instantiationService, phase);
            });
        }
    };
    WorkbenchContributionsRegistry.prototype.doInstantiateByPhase = function (instantiationService, phase) {
        var toBeInstantiated = this.toBeInstantiated.get(phase);
        if (toBeInstantiated) {
            this.toBeInstantiated.delete(phase);
            if (phase !== 4 /* Eventually */) {
                // instantiate everything synchronously and blocking
                for (var _i = 0, toBeInstantiated_1 = toBeInstantiated; _i < toBeInstantiated_1.length; _i++) {
                    var ctor = toBeInstantiated_1[_i];
                    instantiationService.createInstance(ctor);
                }
            }
            else {
                // for the Eventually-phase we instantiate contributions
                // only when idle. this might take a few idle-busy-cycles
                // but will finish within the timeouts
                var forcedTimeout_1 = 3000;
                var i_1 = 0;
                var instantiateSome_1 = function (idle) {
                    while (i_1 < toBeInstantiated.length) {
                        var ctor = toBeInstantiated[i_1++];
                        instantiationService.createInstance(ctor);
                        if (idle.timeRemaining() < 1) {
                            // time is up -> reschedule
                            runWhenIdle(instantiateSome_1, forcedTimeout_1);
                            break;
                        }
                    }
                };
                runWhenIdle(instantiateSome_1, forcedTimeout_1);
            }
        }
    };
    return WorkbenchContributionsRegistry;
}());
Registry.add(Extensions.Workbench, new WorkbenchContributionsRegistry());
