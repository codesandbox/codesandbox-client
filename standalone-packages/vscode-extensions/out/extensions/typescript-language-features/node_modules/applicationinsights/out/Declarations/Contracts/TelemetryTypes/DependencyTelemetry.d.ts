import { Telemetry } from "./Telemetry";
/**
 * Telemetry about the call to remote component
 */
export interface DependencyTelemetry extends Telemetry {
    /**
     * Type name of the telemetry, such as HTTP of SQL
     */
    dependencyTypeName: string;
    /**
     * Remote component general target information
     * If left empty, this will be prepopulated with an extracted hostname from the data field, if it is a url.
     * This prepopulation happens when calling `trackDependency`. Use `track` directly to avoid this behavior.
     */
    target?: string;
    /**
     * Remote call name
     */
    name: string;
    /**
     * Remote call data. This is the most detailed information about the call, such as full URL or SQL statement
     */
    data: string;
    /**
     * Remote call duration in ms
     */
    duration: number;
    /**
     * Result code returned form the remote component. This is domain specific and can be HTTP status code or SQL result code
     */
    resultCode: string | number;
    /**
     * True if remote call was successful, false otherwise
     */
    success: boolean;
}
