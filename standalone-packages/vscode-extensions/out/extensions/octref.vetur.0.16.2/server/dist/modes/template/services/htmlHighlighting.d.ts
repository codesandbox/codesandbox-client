import { HTMLDocument } from '../parser/htmlParser';
import { TextDocument, Position, DocumentHighlight } from 'vscode-languageserver-types';
export declare function findDocumentHighlights(document: TextDocument, position: Position, htmlDocument: HTMLDocument): DocumentHighlight[];
