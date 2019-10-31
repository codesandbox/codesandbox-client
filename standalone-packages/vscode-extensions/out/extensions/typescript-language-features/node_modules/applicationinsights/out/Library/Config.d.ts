/// <reference types="node" />
import http = require('http');
import https = require('https');
declare class Config {
    static ENV_azurePrefix: string;
    static ENV_iKey: string;
    static legacy_ENV_iKey: string;
    static ENV_profileQueryEndpoint: string;
    static ENV_http_proxy: string;
    static ENV_https_proxy: string;
    /** An identifier for your Application Insights resource */
    instrumentationKey: string;
    /** The id for cross-component correlation. READ ONLY. */
    correlationId: string;
    /** The ingestion endpoint to send telemetry payloads to */
    endpointUrl: string;
    /** The maximum number of telemetry items to include in a payload to the ingestion endpoint (Default 250) */
    maxBatchSize: number;
    /** The maximum amount of time to wait for a payload to reach maxBatchSize (Default 15000) */
    maxBatchIntervalMs: number;
    /** A flag indicating if telemetry transmission is disabled (Default false) */
    disableAppInsights: boolean;
    /** The percentage of telemetry items tracked that should be transmitted (Default 100) */
    samplingPercentage: number;
    /** The time to wait before retrying to retrieve the id for cross-component correlation (Default 30000) */
    correlationIdRetryIntervalMs: number;
    /** A list of domains to exclude from cross-component header injection */
    correlationHeaderExcludedDomains: string[];
    /** A proxy server for SDK HTTP traffic (Optional, Default pulled from `http_proxy` environment variable) */
    proxyHttpUrl: string;
    /** A proxy server for SDK HTTPS traffic (Optional, Default pulled from `https_proxy` environment variable) */
    proxyHttpsUrl: string;
    /** An http.Agent to use for SDK HTTP traffic (Optional, Default undefined) */
    httpAgent: http.Agent;
    /** An https.Agent to use for SDK HTTPS traffic (Optional, Default undefined) */
    httpsAgent: https.Agent;
    private endpointBase;
    private setCorrelationId;
    private _profileQueryEndpoint;
    constructor(instrumentationKey?: string);
    profileQueryEndpoint: string;
    private static _getInstrumentationKey();
}
export = Config;
