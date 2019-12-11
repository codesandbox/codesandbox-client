import TelemetryClient = require("../../Library/TelemetryClient");
import { IStandardEvent } from "diagnostic-channel";
import { mongodb } from "diagnostic-channel-publishers";
export declare const subscriber: (event: IStandardEvent<mongodb.IMongoData>) => void;
export declare function enable(enabled: boolean, client: TelemetryClient): void;
