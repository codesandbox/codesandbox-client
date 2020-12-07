import { TextDocument } from 'vscode-languageserver-types';
export declare class Node {
    start: number;
    end: number;
    children: Node[];
    parent: Node;
    tag?: string;
    closed?: boolean;
    endTagStart?: number;
    isInterpolation: boolean;
    attributes?: {
        [name: string]: string;
    };
    get attributeNames(): string[];
    constructor(start: number, end: number, children: Node[], parent: Node);
    isSameTag(tagInLowerCase: string): boolean | "" | undefined;
    get firstChild(): Node;
    get lastChild(): Node | undefined;
    findNodeBefore(offset: number): Node;
    findNodeAt(offset: number): Node;
}
export interface HTMLDocument {
    roots: Node[];
    findNodeBefore(offset: number): Node;
    findNodeAt(offset: number): Node;
}
export declare function parse(text: string): HTMLDocument;
export declare function parseHTMLDocument(document: TextDocument): HTMLDocument;
