import Base = require('./Base');
/**
 * Data struct to contain both B and C sections.
 */
declare class Data<TDomain> extends Base {
    /**
     * Name of item (B section) if any. If telemetry data is derived straight from this, this should be null.
     */
    baseType: string;
    /**
     * Container for data item (B section).
     */
    baseData: TDomain;
    constructor();
}
export = Data;
