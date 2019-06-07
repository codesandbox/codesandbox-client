import { LanguageClient } from "vscode-languageclient";
export declare const timeSince: (date: number) => string | undefined;
export declare const printNoFileOpenMessage: (client: LanguageClient, extVersion: string) => void;
export interface TypeStats {
    service?: number;
    client?: number;
    total?: number;
}
export interface ProjectStats {
    type: string;
    loaded: boolean;
    serviceId?: string;
    types?: TypeStats;
    tag?: string;
    lastFetch?: number;
}
export declare const printStatsToClientOutputChannel: (client: LanguageClient, stats: ProjectStats, extVersion: string) => void;
//# sourceMappingURL=utils.d.ts.map