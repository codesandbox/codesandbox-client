import * as ts from 'typescript';
import { TextDocument } from 'vscode-languageserver-types';
import { LanguageModelCache } from '../languageModelCache';
export declare function getServiceHost(workspacePath: string, jsDocuments: LanguageModelCache<TextDocument>): {
    updateCurrentTextDocument: (doc: TextDocument) => {
        service: ts.LanguageService;
        scriptDoc: TextDocument;
    };
    updateExternalDocument: (filePath: string) => void;
    getScriptDocByFsPath: (fsPath: string) => TextDocument | undefined;
    dispose: () => void;
};
