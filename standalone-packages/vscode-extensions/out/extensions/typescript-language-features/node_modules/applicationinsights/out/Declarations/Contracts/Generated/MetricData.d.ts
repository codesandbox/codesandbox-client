import Domain = require('./Domain');
import DataPoint = require('./DataPoint');
/**
 * An instance of the Metric item is a list of measurements (single data points) and/or aggregations.
 */
declare class MetricData extends Domain {
    /**
     * Schema version
     */
    ver: number;
    /**
     * List of metrics. Only one metric in the list is currently supported by Application Insights storage. If multiple data points were sent only the first one will be used.
     */
    metrics: DataPoint[];
    /**
     * Collection of custom properties.
     */
    properties: any;
    constructor();
}
export = MetricData;
