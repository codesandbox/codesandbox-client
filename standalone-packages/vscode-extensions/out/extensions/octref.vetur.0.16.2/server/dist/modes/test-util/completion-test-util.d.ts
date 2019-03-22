import { CompletionList, TextDocument, CompletionItemKind, Position, CompletionItem } from 'vscode-languageserver-types';
export interface CompletionTestSetup {
    doComplete(doc: TextDocument, pos: Position): CompletionList;
    langId: string;
    docUri: string;
}
export declare function testDSL(setup: CompletionTestSetup): (text: TemplateStringsArray) => CompletionAsserter;
export declare class CompletionAsserter {
    items: CompletionItem[];
    doc: TextDocument;
    lastMatch: CompletionItem;
    constructor(items: CompletionItem[], doc: TextDocument);
    count(expect: number): this;
    has(label: string): this;
    withDoc(doc: string): this;
    withKind(kind: CompletionItemKind): this;
    become(resultText: string): this;
    hasNo(label: string): this;
}
