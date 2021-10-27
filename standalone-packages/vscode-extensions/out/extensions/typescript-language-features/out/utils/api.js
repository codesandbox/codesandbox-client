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
    constructor(versionString, version) {
        this.versionString = versionString;
        this.version = version;
    }
    static fromSimpleString(value) {
        return new API(value, value);
    }
    static fromVersionString(versionString) {
        let version = semver.valid(versionString);
        if (!version) {
            return new API(localize('invalidVersion', 'invalid version'), '1.0.0');
        }
        // Cut off any prerelease tag since we sometimes consume those on purpose.
        const index = versionString.indexOf('-');
        if (index >= 0) {
            version = version.substr(0, index);
        }
        return new API(versionString, version);
    }
    gte(other) {
        return semver.gte(this.version, other.version);
    }
    lt(other) {
        return !this.gte(other);
    }
}
API.defaultVersion = API.fromSimpleString('1.0.0');
API.v203 = API.fromSimpleString('2.0.3');
API.v206 = API.fromSimpleString('2.0.6');
API.v208 = API.fromSimpleString('2.0.8');
API.v213 = API.fromSimpleString('2.1.3');
API.v220 = API.fromSimpleString('2.2.0');
API.v222 = API.fromSimpleString('2.2.2');
API.v230 = API.fromSimpleString('2.3.0');
API.v234 = API.fromSimpleString('2.3.4');
API.v240 = API.fromSimpleString('2.4.0');
API.v250 = API.fromSimpleString('2.5.0');
API.v260 = API.fromSimpleString('2.6.0');
API.v270 = API.fromSimpleString('2.7.0');
API.v280 = API.fromSimpleString('2.8.0');
API.v290 = API.fromSimpleString('2.9.0');
API.v291 = API.fromSimpleString('2.9.1');
API.v292 = API.fromSimpleString('2.9.2');
API.v300 = API.fromSimpleString('3.0.0');
API.v310 = API.fromSimpleString('3.1.0');
API.v314 = API.fromSimpleString('3.1.4');
API.v320 = API.fromSimpleString('3.2.0');
API.v330 = API.fromSimpleString('3.3.0');
API.v333 = API.fromSimpleString('3.3.3');
API.v340 = API.fromSimpleString('3.4.0');
API.v345 = API.fromSimpleString('3.4.5');
API.v350 = API.fromSimpleString('3.5.0');
exports.default = API;
//# sourceMappingURL=api.js.map