/// <reference types="node" />
import http = require("http");
import Contracts = require("../Declarations/Contracts");
import RequestParser = require("./RequestParser");
/**
 * Helper class to read data from the requst/response objects and convert them into the telemetry contract
 */
declare class HttpRequestParser extends RequestParser {
    private static keys;
    private rawHeaders;
    private socketRemoteAddress;
    private connectionRemoteAddress;
    private legacySocketRemoteAddress;
    private userAgent;
    private sourceCorrelationId;
    private parentId;
    private operationId;
    private requestId;
    private correlationContextHeader;
    constructor(request: http.IncomingMessage, requestId?: string);
    onError(error: Error | string, ellapsedMilliseconds?: number): void;
    onResponse(response: http.ServerResponse, ellapsedMilliseconds?: number): void;
    getRequestTelemetry(baseTelemetry?: Contracts.Telemetry): Contracts.RequestTelemetry;
    getRequestTags(tags: {
        [key: string]: string;
    }): {
        [key: string]: string;
    };
    getOperationId(tags: {
        [key: string]: string;
    }): string;
    getOperationParentId(tags: {
        [key: string]: string;
    }): string;
    getOperationName(tags: {
        [key: string]: string;
    }): string;
    getRequestId(): string;
    getCorrelationContextHeader(): string;
    private _getAbsoluteUrl(request);
    private _getIp();
    private _getId(name);
    private parseHeaders(request, requestId?);
    static parseId(cookieValue: string): string;
}
export = HttpRequestParser;
