import TelemetryClient = require("../../Library/TelemetryClient");
import { IStandardEvent } from "diagnostic-channel";
import { redis } from "diagnostic-channel-publishers";
export declare const subscriber: (event: IStandardEvent<redis.IRedisData>) => void;
export declare function enable(enabled: boolean, client: TelemetryClient): void;
