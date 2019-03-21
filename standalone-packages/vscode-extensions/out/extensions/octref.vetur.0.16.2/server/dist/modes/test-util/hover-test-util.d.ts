import { TextDocument, Position, Hover } from 'vscode-languageserver-types';
export interface HoverTestSetup {
    docUri: string;
    langId: string;
    doHover(document: TextDocument, position: Position): Hover;
}
export declare class HoverAsserter {
    hover: Hover;
    document: TextDocument;
    constructor(hover: Hover, document: TextDocument);
    hasNothing(): void;
    hasHoverAt(label: string, offset: number): void;
}
export declare function hoverDSL(setup: HoverTestSetup): ([value]: TemplateStringsArray) => HoverAsserter;
