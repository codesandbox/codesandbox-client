import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
export declare function registerVeturTextDocumentProviders(): Promise<vscode.Disposable>;
export declare function generateShowVirtualFileCommand(client: LanguageClient): () => Promise<string | undefined>;
export declare function setVirtualContents(virtualFileSource: string, prettySourceMap: string): void;
