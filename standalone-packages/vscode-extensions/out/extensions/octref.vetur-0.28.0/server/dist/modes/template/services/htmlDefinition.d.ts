import { HTMLDocument } from '../parser/htmlParser';
import { TextDocument, Position, Location } from 'vscode-languageserver-types';
import { VueFileInfo } from '../../../services/vueInfoService';
export declare function findDefinition(document: TextDocument, position: Position, htmlDocument: HTMLDocument, vueFileInfo?: VueFileInfo): Location[];
