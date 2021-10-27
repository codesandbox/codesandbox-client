import Domain = require('./Domain');
import SeverityLevel = require('./SeverityLevel');
/**
 * Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.
 */
declare class MessageData extends Domain {
    /**
     * Schema version
     */
    ver: number;
    /**
     * Trace message
     */
    message: string;
    /**
     * Trace severity level.
     */
    severityLevel: SeverityLevel;
    /**
     * Collection of custom properties.
     */
    properties: any;
    constructor();
}
export = MessageData;
