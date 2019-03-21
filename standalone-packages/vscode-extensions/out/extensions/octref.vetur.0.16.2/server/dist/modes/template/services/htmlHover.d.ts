import { HTMLDocument } from '../parser/htmlParser';
import { TextDocument, Position, Hover } from 'vscode-languageserver-types';
import { IHTMLTagProvider } from '../tagProviders';
export declare function doHover(document: TextDocument, position: Position, htmlDocument: HTMLDocument, tagProviders: IHTMLTagProvider[]): Hover;
