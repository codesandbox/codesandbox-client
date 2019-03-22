import { TextDocument, Position, CompletionList } from 'vscode-languageserver-types';
import { HTMLDocument } from '../parser/htmlParser';
import { IHTMLTagProvider } from '../tagProviders';
import * as emmet from 'vscode-emmet-helper';
import { VueFileInfo } from '../../../services/vueInfoService';
export declare function doComplete(document: TextDocument, position: Position, htmlDocument: HTMLDocument, tagProviders: IHTMLTagProvider[], emmetConfig: emmet.EmmetConfiguration, vueFileInfo?: VueFileInfo): CompletionList;
