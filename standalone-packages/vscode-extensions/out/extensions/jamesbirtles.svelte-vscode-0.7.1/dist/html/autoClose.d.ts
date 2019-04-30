import { Disposable, TextDocument, Position } from 'vscode';
export declare function activateTagClosing(tagProvider: (document: TextDocument, position: Position) => Thenable<string>, supportedLanguages: {
    [id: string]: boolean;
}, configName: string): Disposable;
