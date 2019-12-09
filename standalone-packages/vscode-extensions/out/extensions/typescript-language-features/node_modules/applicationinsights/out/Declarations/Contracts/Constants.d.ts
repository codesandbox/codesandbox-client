import { Domain } from "./Generated";
export declare class RemoteDependencyDataConstants {
    static TYPE_HTTP: string;
    static TYPE_AI: string;
}
export interface ISupportProperties extends Domain {
    properties: any;
}
export declare function domainSupportsProperties(domain: Domain): domain is ISupportProperties;
