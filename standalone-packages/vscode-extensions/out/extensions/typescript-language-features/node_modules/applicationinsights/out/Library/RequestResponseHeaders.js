"use strict";
module.exports = {
    /**
     * Request-Context header
     */
    requestContextHeader: "request-context",
    /**
     * Source instrumentation header that is added by an application while making http
     * requests and retrieved by the other application when processing incoming requests.
     */
    requestContextSourceKey: "appId",
    /**
     * Target instrumentation header that is added to the response and retrieved by the
     * calling application when processing incoming responses.
     */
    requestContextTargetKey: "appId",
    /**
     * Request-Id header
     */
    requestIdHeader: "request-id",
    /**
     * Legacy Header containing the id of the immidiate caller
     */
    parentIdHeader: "x-ms-request-id",
    /**
     * Legacy Header containing the correlation id that kept the same for every telemetry item
     * accross transactions
     */
    rootIdHeader: "x-ms-request-root-id",
    /**
     * Correlation-Context header
     *
     * Not currently actively used, but the contents should be passed from incoming to outgoing requests
     */
    correlationContextHeader: "correlation-context"
};
//# sourceMappingURL=RequestResponseHeaders.js.map