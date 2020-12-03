import { CompletionItem } from 'vscode-languageserver-types';
export interface ScaffoldSnippetSources {
    workspace: string | undefined;
    user: string | undefined;
    vetur: string | undefined;
}
export declare class SnippetManager {
    private _snippets;
    constructor(workspacePath: string, globalSnippetDir?: string);
    completeSnippets(scaffoldSnippetSources: ScaffoldSnippetSources): CompletionItem[];
}
