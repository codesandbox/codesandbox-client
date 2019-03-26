import { TextDocument, SymbolInformation } from 'vscode-languageserver-types';
import { HTMLDocument } from '../parser/htmlParser';
export declare function findDocumentSymbols(document: TextDocument, htmlDocument: HTMLDocument): SymbolInformation[];
