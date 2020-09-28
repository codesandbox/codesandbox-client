import { ClientCapabilities } from 'vscode-languageserver-protocol';
import { BaseLanguageClient, StaticFeature } from './client';
export declare class ProgressFeature implements StaticFeature {
    private _client;
    constructor(_client: BaseLanguageClient);
    fillClientCapabilities(capabilities: ClientCapabilities): void;
    initialize(): void;
}
