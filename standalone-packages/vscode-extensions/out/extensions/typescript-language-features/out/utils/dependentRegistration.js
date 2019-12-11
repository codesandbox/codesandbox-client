"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const dispose_1 = require("./dispose");
class ConditionalRegistration {
    constructor(_doRegister) {
        this._doRegister = _doRegister;
        this.registration = undefined;
    }
    dispose() {
        if (this.registration) {
            this.registration.dispose();
            this.registration = undefined;
        }
    }
    update(enabled) {
        if (enabled) {
            if (!this.registration) {
                this.registration = this._doRegister();
            }
        }
        else {
            if (this.registration) {
                this.registration.dispose();
                this.registration = undefined;
            }
        }
    }
}
exports.ConditionalRegistration = ConditionalRegistration;
class VersionDependentRegistration extends dispose_1.Disposable {
    constructor(client, minVersion, register) {
        super();
        this.client = client;
        this.minVersion = minVersion;
        this._registration = new ConditionalRegistration(register);
        this.update(client.apiVersion);
        this.client.onTsServerStarted(() => {
            this.update(this.client.apiVersion);
        }, null, this._disposables);
    }
    dispose() {
        super.dispose();
        this._registration.dispose();
    }
    update(api) {
        this._registration.update(api.gte(this.minVersion));
    }
}
exports.VersionDependentRegistration = VersionDependentRegistration;
class ConfigurationDependentRegistration extends dispose_1.Disposable {
    constructor(language, configValue, register) {
        super();
        this.language = language;
        this.configValue = configValue;
        this._registration = new ConditionalRegistration(register);
        this.update();
        vscode.workspace.onDidChangeConfiguration(this.update, this, this._disposables);
    }
    dispose() {
        super.dispose();
        this._registration.dispose();
    }
    update() {
        const config = vscode.workspace.getConfiguration(this.language, null);
        this._registration.update(!!config.get(this.configValue));
    }
}
exports.ConfigurationDependentRegistration = ConfigurationDependentRegistration;
//# sourceMappingURL=dependentRegistration.js.map