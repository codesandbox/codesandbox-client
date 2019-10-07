import TelemetryClient = require("../../Library/TelemetryClient");
import { IStandardEvent } from "diagnostic-channel";
import { pg } from "diagnostic-channel-publishers";
export declare const subscriber: (event: IStandardEvent<pg.IPostgresData>) => void;
export declare function enable(enabled: boolean, client: TelemetryClient): void;
