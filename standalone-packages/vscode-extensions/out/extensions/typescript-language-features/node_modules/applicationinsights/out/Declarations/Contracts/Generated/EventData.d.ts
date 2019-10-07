import Domain = require('./Domain');
/**
 * Instances of Event represent structured event records that can be grouped and searched by their properties. Event data item also creates a metric of event count by name.
 */
declare class EventData extends Domain {
    /**
     * Schema version
     */
    ver: number;
    /**
     * Event name. Keep it low cardinality to allow proper grouping and useful metrics.
     */
    name: string;
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
export = EventData;
