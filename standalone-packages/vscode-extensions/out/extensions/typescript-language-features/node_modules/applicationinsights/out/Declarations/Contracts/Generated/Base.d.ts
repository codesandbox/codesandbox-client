/**
 * Data struct to contain only C section with custom fields.
 */
declare class Base {
    /**
     * Name of item (B section) if any. If telemetry data is derived straight from this, this should be null.
     */
    baseType: string;
    constructor();
}
export = Base;
