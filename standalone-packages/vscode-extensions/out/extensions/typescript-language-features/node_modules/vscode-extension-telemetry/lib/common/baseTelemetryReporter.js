/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import * as vscode from "vscode";
export class BaseTelemtryReporter {
    constructor(extensionId, extensionVersion, telemetryAppender, osShim, firstParty) {
        this.extensionId = extensionId;
        this.extensionVersion = extensionVersion;
        this.telemetryAppender = telemetryAppender;
        this.osShim = osShim;
        this.firstParty = false;
        this.userOptIn = false;
        this.firstParty = !!firstParty;
        this.updateUserOptStatus();
        if (vscode.env.onDidChangeTelemetryEnabled !== undefined) {
            this.optOutListener = vscode.env.onDidChangeTelemetryEnabled(() => this.updateUserOptStatus());
        }
        else {
            this.optOutListener = vscode.workspace.onDidChangeConfiguration(() => this.updateUserOptStatus());
        }
    }
    /**
     * Updates whether the user has opted in to having telemetry collected
     */
    updateUserOptStatus() {
        // Newer versions of vscode api have telemetry enablement exposed, but fallback to setting for older versions
        const config = vscode.workspace.getConfiguration(BaseTelemtryReporter.TELEMETRY_CONFIG_ID);
        const newOptInValue = vscode.env.isTelemetryEnabled === undefined ?
            config.get(BaseTelemtryReporter.TELEMETRY_CONFIG_ENABLED_ID, true) :
            vscode.env.isTelemetryEnabled;
        if (this.userOptIn !== newOptInValue) {
            this.userOptIn = newOptInValue;
        }
    }
    /**
     * Given a remoteName ensures it is in the list of valid ones
     * @param remoteName The remotename
     * @returns The "cleaned" one
     */
    cleanRemoteName(remoteName) {
        if (!remoteName) {
            return "none";
        }
        let ret = "other";
        // Allowed remote authorities
        ["ssh-remote", "dev-container", "attached-container", "wsl"].forEach((res) => {
            if (remoteName.indexOf(`${res}+`) === 0) {
                ret = res;
            }
        });
        return ret;
    }
    /**
     * Retrieves the current extension based on the extension id
     */
    get extension() {
        if (this._extension === undefined) {
            this._extension = vscode.extensions.getExtension(this.extensionId);
        }
        return this._extension;
    }
    /**
     * Given an object and a callback creates a clone of the object and modifies it according to the callback
     * @param obj The object to clone and modify
     * @param change The modifying function
     * @returns A new changed object
     */
    cloneAndChange(obj, change) {
        if (obj === null || typeof obj !== "object")
            return obj;
        if (typeof change !== "function")
            return obj;
        const ret = {};
        for (const key in obj) {
            ret[key] = change(key, obj[key]);
        }
        return ret;
    }
    /**
     * Whether or not it is safe to send error telemetry
     */
    shouldSendErrorTelemetry() {
        if (this.firstParty) {
            if (this.cleanRemoteName(vscode.env.remoteName) !== "other") {
                return true;
            }
            if (this.extension === undefined || this.extension.extensionKind === vscode.ExtensionKind.Workspace) {
                return false;
            }
            if (vscode.env.uiKind === vscode.UIKind.Web) {
                return false;
            }
            return true;
        }
        return true;
    }
    // __GDPR__COMMON__ "common.os" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.platformversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extname" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extversion" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodemachineid" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodesessionid" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.uikind" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.remotename" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.isnewappinstall" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    getCommonProperties() {
        const commonProperties = Object.create(null);
        commonProperties["common.os"] = this.osShim.platform;
        commonProperties["common.platformversion"] = (this.osShim.release || "").replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, "$1$2$3");
        commonProperties["common.extname"] = this.extensionId;
        commonProperties["common.extversion"] = this.extensionVersion;
        if (vscode && vscode.env) {
            commonProperties["common.vscodemachineid"] = vscode.env.machineId;
            commonProperties["common.vscodesessionid"] = vscode.env.sessionId;
            commonProperties["common.vscodeversion"] = vscode.version;
            commonProperties["common.isnewappinstall"] = vscode.env.isNewAppInstall.toString();
            switch (vscode.env.uiKind) {
                case vscode.UIKind.Web:
                    commonProperties["common.uikind"] = "web";
                    break;
                case vscode.UIKind.Desktop:
                    commonProperties["common.uikind"] = "desktop";
                    break;
                default:
                    commonProperties["common.uikind"] = "unknown";
            }
            commonProperties["common.remotename"] = this.cleanRemoteName(vscode.env.remoteName);
        }
        return commonProperties;
    }
    /**
     * Given an error stack cleans up the file paths within
     * @param stack The stack to clean
     * @param anonymizeFilePaths Whether or not to clean the file paths or anonymize them as well
     * @returns The cleaned stack
     */
    anonymizeFilePaths(stack, anonymizeFilePaths) {
        let result;
        if (stack === undefined || stack === null) {
            return "";
        }
        const cleanupPatterns = [];
        if (vscode.env.appRoot !== "") {
            cleanupPatterns.push(new RegExp(vscode.env.appRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
        }
        if (this.extension) {
            cleanupPatterns.push(new RegExp(this.extension.extensionPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
        }
        let updatedStack = stack;
        if (anonymizeFilePaths) {
            const cleanUpIndexes = [];
            for (const regexp of cleanupPatterns) {
                while ((result = regexp.exec(stack))) {
                    if (!result) {
                        break;
                    }
                    cleanUpIndexes.push([result.index, regexp.lastIndex]);
                }
            }
            const nodeModulesRegex = /^[\\/]?(node_modules|node_modules\.asar)[\\/]/;
            const fileRegex = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-._]+(\\\\|\\|\/))+[\w-._]*/g;
            let lastIndex = 0;
            updatedStack = "";
            while ((result = fileRegex.exec(stack))) {
                if (!result) {
                    break;
                }
                // Anoynimize user file paths that do not need to be retained or cleaned up.
                if (result[0] && !nodeModulesRegex.test(result[0]) && cleanUpIndexes.every(([x, y]) => result.index < x || result.index >= y)) {
                    updatedStack += stack.substring(lastIndex, result.index) + "<REDACTED: user-file-path>";
                    lastIndex = fileRegex.lastIndex;
                }
            }
            if (lastIndex < stack.length) {
                updatedStack += stack.substr(lastIndex);
            }
        }
        // sanitize with configured cleanup patterns
        for (const regexp of cleanupPatterns) {
            updatedStack = updatedStack.replace(regexp, "");
        }
        return updatedStack;
    }
    removePropertiesWithPossibleUserInfo(properties) {
        if (typeof properties !== "object") {
            return;
        }
        const cleanedObject = Object.create(null);
        // Loop through key and values of the properties object
        for (const key of Object.keys(properties)) {
            const value = properties[key];
            // If for some reason it is undefined we skip it (this shouldn't be possible);
            if (!value) {
                continue;
            }
            // Regex which matches @*.site
            const emailRegex = /@[a-zA-Z0-9-.]+/;
            const secretRegex = /\S*(key|token|sig|password|passwd|pwd)[="':\s]+\S*/;
            // Check for common user data in the telemetry events
            if (secretRegex.test(value.toLowerCase())) {
                cleanedObject[key] = "<REDACTED: secret>";
            }
            else if (emailRegex.test(value)) {
                cleanedObject[key] = "<REDACTED: email>";
            }
            else {
                cleanedObject[key] = value;
            }
        }
        return cleanedObject;
    }
    /**
     * Given an event name, some properties, and measurements sends a teleemtry event
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     */
    sendTelemetryEvent(eventName, properties, measurements) {
        if (this.userOptIn && eventName !== "") {
            properties = Object.assign(Object.assign({}, properties), this.getCommonProperties());
            const cleanProperties = this.cloneAndChange(properties, (_key, prop) => this.anonymizeFilePaths(prop, this.firstParty));
            this.telemetryAppender.logEvent(`${this.extensionId}/${eventName}`, { properties: this.removePropertiesWithPossibleUserInfo(cleanProperties), measurements: measurements });
        }
    }
    /**
     * Given an event name, some properties, and measurements sends an error event
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     * @param errorProps If not present then we assume all properties belong to the error prop and will be anonymized
     */
    sendTelemetryErrorEvent(eventName, properties, measurements, errorProps) {
        if (this.userOptIn && eventName !== "") {
            // always clean the properties if first party
            // do not send any error properties if we shouldn't send error telemetry
            // if we have no errorProps, assume all are error props
            properties = Object.assign(Object.assign({}, properties), this.getCommonProperties());
            const cleanProperties = this.cloneAndChange(properties, (key, prop) => {
                if (this.shouldSendErrorTelemetry()) {
                    return this.anonymizeFilePaths(prop, this.firstParty);
                }
                if (errorProps === undefined || errorProps.indexOf(key) !== -1) {
                    return "REDACTED";
                }
                return this.anonymizeFilePaths(prop, this.firstParty);
            });
            this.telemetryAppender.logEvent(`${this.extensionId}/${eventName}`, { properties: this.removePropertiesWithPossibleUserInfo(cleanProperties), measurements: measurements });
        }
    }
    /**
     * Given an error, properties, and measurements. Sends an exception event
     * @param error The error to send
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     */
    sendTelemetryException(error, properties, measurements) {
        if (this.shouldSendErrorTelemetry() && this.userOptIn && error) {
            properties = Object.assign(Object.assign({}, properties), this.getCommonProperties());
            const cleanProperties = this.cloneAndChange(properties, (_key, prop) => this.anonymizeFilePaths(prop, this.firstParty));
            // Also run the error stack through the anonymizer
            if (error.stack) {
                error.stack = this.anonymizeFilePaths(error.stack, this.firstParty);
            }
            this.telemetryAppender.logException(error, { properties: this.removePropertiesWithPossibleUserInfo(cleanProperties), measurements: measurements });
        }
    }
    /**
     * Disposes of the telemetry reporter
     */
    dispose() {
        this.telemetryAppender.flush();
        return this.optOutListener.dispose();
    }
}
BaseTelemtryReporter.TELEMETRY_CONFIG_ID = "telemetry";
BaseTelemtryReporter.TELEMETRY_CONFIG_ENABLED_ID = "enableTelemetry";
//# sourceMappingURL=baseTelemetryReporter.js.map