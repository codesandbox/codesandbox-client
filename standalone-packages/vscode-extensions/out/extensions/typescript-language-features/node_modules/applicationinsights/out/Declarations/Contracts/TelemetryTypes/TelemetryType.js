"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts the user-friendly enumeration TelemetryType to the underlying schema baseType value
 * @param type Type to convert to BaseData string
 */
function telemetryTypeToBaseType(type) {
    switch (type) {
        case TelemetryType.Event:
            return "EventData";
        case TelemetryType.Exception:
            return "ExceptionData";
        case TelemetryType.Trace:
            return "MessageData";
        case TelemetryType.Metric:
            return "MetricData";
        case TelemetryType.Request:
            return "RequestData";
        case TelemetryType.Dependency:
            return "RemoteDependencyData";
    }
    return undefined;
}
exports.telemetryTypeToBaseType = telemetryTypeToBaseType;
/**
 * Converts the schema baseType value to the user-friendly enumeration TelemetryType
 * @param baseType BaseData string to convert to TelemetryType
 */
function baseTypeToTelemetryType(baseType) {
    switch (baseType) {
        case "EventData":
            return TelemetryType.Event;
        case "ExceptionData":
            return TelemetryType.Exception;
        case "MessageData":
            return TelemetryType.Trace;
        case "MetricData":
            return TelemetryType.Metric;
        case "RequestData":
            return TelemetryType.Request;
        case "RemoteDependencyData":
            return TelemetryType.Dependency;
    }
    return undefined;
}
exports.baseTypeToTelemetryType = baseTypeToTelemetryType;
/**
 * Telemetry types supported by this SDK
 */
var TelemetryType;
(function (TelemetryType) {
    TelemetryType[TelemetryType["Event"] = 0] = "Event";
    TelemetryType[TelemetryType["Exception"] = 1] = "Exception";
    TelemetryType[TelemetryType["Trace"] = 2] = "Trace";
    TelemetryType[TelemetryType["Metric"] = 3] = "Metric";
    TelemetryType[TelemetryType["Request"] = 4] = "Request";
    TelemetryType[TelemetryType["Dependency"] = 5] = "Dependency";
})(TelemetryType = exports.TelemetryType || (exports.TelemetryType = {}));
//# sourceMappingURL=TelemetryType.js.map