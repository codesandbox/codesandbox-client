"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var semver = require("semver");
/* tslint:disable-next-line:no-var-requires */
var moduleModule = require("module");
var nativeModules = Object.keys(process.binding("natives"));
var originalRequire = moduleModule.prototype.require;
function makePatchingRequire(knownPatches) {
    var patchedModules = {};
    return function patchedRequire(moduleId) {
        var originalModule = originalRequire.apply(this, arguments);
        if (knownPatches[moduleId]) {
            // Fetch the specific path of the module
            var modulePath = moduleModule._resolveFilename(moduleId, this);
            if (patchedModules.hasOwnProperty(modulePath)) {
                // This module has already been patched, no need to reapply
                return patchedModules[modulePath];
            }
            var moduleVersion = void 0;
            if (nativeModules.indexOf(moduleId) < 0) {
                try {
                    moduleVersion = originalRequire.call(this, path.join(moduleId, "package.json")).version;
                }
                catch (e) {
                    // This should only happen if moduleId is actually a path rather than a module
                    // This is not a supported scenario
                    return originalModule;
                }
            }
            else {
                // This module is implemented natively so we cannot find a package.json
                // Instead, take the version of node itself
                moduleVersion = process.version.substring(1);
            }
            var prereleaseTagIndex = moduleVersion.indexOf("-");
            if (prereleaseTagIndex >= 0) {
                // We ignore prerelease tags to avoid impossible to fix gaps in support
                // e.g. supporting console in >= 4.0.0 would otherwise not include
                // 8.0.0-pre
                moduleVersion = moduleVersion.substring(0, prereleaseTagIndex);
            }
            var modifiedModule = originalModule;
            for (var _i = 0, _a = knownPatches[moduleId]; _i < _a.length; _i++) {
                var modulePatcher = _a[_i];
                if (semver.satisfies(moduleVersion, modulePatcher.versionSpecifier)) {
                    modifiedModule = modulePatcher.patch(modifiedModule, modulePath);
                }
            }
            return patchedModules[modulePath] = modifiedModule;
        }
        return originalModule;
    };
}
exports.makePatchingRequire = makePatchingRequire;
//# sourceMappingURL=patchRequire.js.map