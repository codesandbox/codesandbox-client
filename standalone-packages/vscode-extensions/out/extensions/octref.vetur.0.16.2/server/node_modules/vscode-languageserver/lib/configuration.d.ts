import { ConfigurationItem } from 'vscode-languageserver-protocol';
import { Feature, _RemoteWorkspace } from './main';
export interface Configuration {
    getConfiguration(): Thenable<any>;
    getConfiguration(section: string): Thenable<any>;
    getConfiguration(item: ConfigurationItem): Thenable<any>;
    getConfiguration(items: ConfigurationItem[]): Thenable<any[]>;
}
export declare const ConfigurationFeature: Feature<_RemoteWorkspace, Configuration>;
