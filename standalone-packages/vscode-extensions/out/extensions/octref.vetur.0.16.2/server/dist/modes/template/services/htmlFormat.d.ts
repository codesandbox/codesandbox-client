import { TextDocument, Range, TextEdit } from 'vscode-languageserver-types';
import { VLSFormatConfig } from '../../../config';
export declare function htmlFormat(document: TextDocument, currRange: Range, vlsFormatConfig: VLSFormatConfig): TextEdit[];
