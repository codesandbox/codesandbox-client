import TelemetryClient = require("../../Library/TelemetryClient");
import { IStandardEvent } from "diagnostic-channel";
import { mysql } from "diagnostic-channel-publishers";
export declare const subscriber: (event: IStandardEvent<mysql.IMysqlData>) => void;
export declare function enable(enabled: boolean, client: TelemetryClient): void;
