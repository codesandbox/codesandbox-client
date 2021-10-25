"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
class API {
    constructor(
    /**
     * Human readable string for the current version. Displayed in the UI
     */
    displayName, 
    /**
     * Semver version, e.g. '3.9.0'
     */
    version, 
    /**
     * Full version string including pre-release tags, e.g. '3.9.0-beta'
     */
    fullVersionString) {
        this.displayName = displayName;
        this.version = version;
        this.fullVersionString = fullVersionString;
    }
    static fromSimpleString(value) {
        return new API(value, value, value);
    }
    static fromVersionString(versionString) {
        let version = semver.valid(versionString);
        if (!version) {
            return new API(localize('invalidVersion', 'invalid version'), '1.0.0', '1.0.0');
        }
        // Cut off any prerelease tag since we sometimes consume those on purpose.
        const index = versionString.indexOf('-');
        if (index >= 0) {
            version = version.substr(0, index);
        }
        return new API(versionString, version, versionString);
    }
    eq(other) {
        return semver.eq(this.version, other.version);
    }
    gte(other) {
        return semver.gte(this.version, other.version);
    }
    lt(other) {
        return !this.gte(other);
    }
}
exports.default = API;
API.defaultVersion = API.fromSimpleString('1.0.0');
API.v240 = API.fromSimpleString('2.4.0');
API.v250 = API.fromSimpleString('2.5.0');
API.v260 = API.fromSimpleString('2.6.0');
API.v270 = API.fromSimpleString('2.7.0');
API.v280 = API.fromSimpleString('2.8.0');
API.v290 = API.fromSimpleString('2.9.0');
API.v291 = API.fromSimpleString('2.9.1');
API.v300 = API.fromSimpleString('3.0.0');
API.v310 = API.fromSimpleString('3.1.0');
API.v314 = API.fromSimpleString('3.1.4');
API.v320 = API.fromSimpleString('3.2.0');
API.v333 = API.fromSimpleString('3.3.3');
API.v340 = API.fromSimpleString('3.4.0');
API.v345 = API.fromSimpleString('3.4.5');
API.v350 = API.fromSimpleString('3.5.0');
API.v380 = API.fromSimpleString('3.8.0');
API.v381 = API.fromSimpleString('3.8.1');
API.v390 = API.fromSimpleString('3.9.0');
API.v400 = API.fromSimpleString('4.0.0');
API.v401 = API.fromSimpleString('4.0.1');
API.v420 = API.fromSimpleString('4.2.0');
API.v430 = API.fromSimpleString('4.3.0');
API.v440 = API.fromSimpleString('4.4.0');
//# sourceMappingURL=api.js.map