import { VueFileInfo } from '../../../services/vueInfoService';
import { TextDocument, Diagnostic } from 'vscode-languageserver-types';
import { HTMLDocument } from '../parser/htmlParser';
export declare function doPropValidation(document: TextDocument, htmlDocument: HTMLDocument, info: VueFileInfo): Diagnostic[];
