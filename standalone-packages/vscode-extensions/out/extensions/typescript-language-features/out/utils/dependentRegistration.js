"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSomeCapability = exports.requireConfiguration = exports.requireMinVersion = exports.conditionalRegistration = exports.Condition = void 0;
const vscode = require("vscode");
const dispose_1 = require("./dispose");
class Condition extends dispose_1.Disposable {
    constructor(getValue, onUpdate) {
        super();
        this.getValue = getValue;
        this._onDidChange = this._register(new vscode.EventEmitter());
        this.onDidChange = this._onDidChange.event;
        this._value = this.getValue();
        onUpdate(() => {
            const newValue = this.getValue();
            if (newValue !== this._value) {
                this._value = newValue;
                this._onDidChange.fire();
            }
        });
    }
    get value() { return this._value; }
}
exports.Condition = Condition;
class ConditionalRegistration {
    constructor(conditions, doRegister) {
        this.conditions = conditions;
        this.doRegister = doRegister;
        this.registration = undefined;
        for (const condition of conditions) {
            condition.onDidChange(() => this.update());
        }
        this.update();
    }
    dispose() {
        this.registration?.dispose();
        this.registration = undefined;
    }
    update() {
        const enabled = this.conditions.every(condition => condition.value);
        if (enabled) {
            if (!this.registration) {
                this.registration = this.doRegister();
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
function conditionalRegistration(conditions, doRegister) {
    return new ConditionalRegistration(conditions, doRegister);
}
exports.conditionalRegistration = conditionalRegistration;
function requireMinVersion(client, minVersion) {
    return new Condition(() => client.apiVersion.gte(minVersion), client.onTsServerStarted);
}
exports.requireMinVersion = requireMinVersion;
function requireConfiguration(language, configValue) {
    return new Condition(() => {
        const config = vscode.workspace.getConfiguration(language, null);
        return !!config.get(configValue);
    }, vscode.workspace.onDidChangeConfiguration);
}
exports.requireConfiguration = requireConfiguration;
function requireSomeCapability(client, ...capabilities) {
    return new Condition(() => capabilities.some(requiredCapability => client.capabilities.has(requiredCapability)), client.onDidChangeCapabilities);
}
exports.requireSomeCapability = requireSomeCapability;
//# sourceMappingURL=dependentRegistration.js.map