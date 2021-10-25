/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import * as vscode from "vscode";
import { BaseTelemtryReporter } from "../common/baseTelemetryReporter";
class WebAppInsightsAppender {
    constructor(key) {
        let endpointUrl;
        if (key && key.indexOf("AIF-") === 0) {
            endpointUrl = "https://vortex.data.microsoft.com/collect/v1";
        }
        this._aiClient = new ApplicationInsights({
            config: {
                instrumentationKey: key,
                endpointUrl,
                disableAjaxTracking: true,
                disableExceptionTracking: true,
                disableFetchTracking: true,
                disableCorrelationHeaders: true,
                disableCookiesUsage: true,
                autoTrackPageVisitTime: false,
                emitLineDelimitedJson: true,
                disableInstrumentationKeyValidation: true
            },
        });
        this._aiClient.loadAppInsights();
        // If we cannot access the endpoint this most likely means it's being blocked
        // and we should not attempt to send any telemetry.
        if (endpointUrl && vscode.env.isTelemetryEnabled) {
            fetch(endpointUrl).catch(() => (this._aiClient = undefined));
        }
    }
    logEvent(eventName, data) {
        if (!this._aiClient) {
            return;
        }
        this._aiClient.trackEvent({ name: eventName }, Object.assign(Object.assign({}, data.properties), data.measurements));
    }
    logException(exception, data) {
        if (!this._aiClient) {
            return;
        }
        this._aiClient.trackException({ exception, properties: Object.assign(Object.assign({}, data.properties), data.measurements) });
    }
    flush() {
        if (this._aiClient) {
            this._aiClient.flush();
            this._aiClient = undefined;
        }
        return Promise.resolve(undefined);
    }
}
export default class TelemetryReporter extends BaseTelemtryReporter {
    constructor(extensionId, extensionVersion, key, firstParty) {
        const appender = new WebAppInsightsAppender(key);
        if (key && key.indexOf("AIF-") === 0) {
            firstParty = true;
        }
        super(extensionId, extensionVersion, appender, { release: navigator.appVersion, platform: "web" }, firstParty);
    }
}
//# sourceMappingURL=telemetryReporter.js.map