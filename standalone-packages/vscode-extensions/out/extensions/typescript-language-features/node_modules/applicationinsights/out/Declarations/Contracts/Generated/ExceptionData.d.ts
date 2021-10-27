import Domain = require('./Domain');
import ExceptionDetails = require('./ExceptionDetails');
import SeverityLevel = require('./SeverityLevel');
/**
 * An instance of Exception represents a handled or unhandled exception that occurred during execution of the monitored application.
 */
declare class ExceptionData extends Domain {
    /**
     * Schema version
     */
    ver: number;
    /**
     * Exception chain - list of inner exceptions.
     */
    exceptions: ExceptionDetails[];
    /**
     * Severity level. Mostly used to indicate exception severity level when it is reported by logging library.
     */
    severityLevel: SeverityLevel;
    /**
     * Identifier of where the exception was thrown in code. Used for exceptions grouping. Typically a combination of exception type and a function from the call stack.
     */
    problemId: string;
    /**
     * Collection of custom properties.
     */
    properties: any;
    /**
     * Collection of custom measurements.
     */
    measurements: any;
    constructor();
}
export = ExceptionData;
