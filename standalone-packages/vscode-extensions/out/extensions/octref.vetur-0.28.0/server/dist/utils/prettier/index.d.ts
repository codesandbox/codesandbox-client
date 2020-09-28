import { TextEdit, Range } from 'vscode-languageserver-types';
import { ParserOption } from './prettier';
import { VLSFormatConfig } from '../../config';
export declare function prettierify(code: string, fileFsPath: string, workspacePath: string | undefined, range: Range, vlsFormatConfig: VLSFormatConfig, parser: ParserOption, initialIndent: boolean): TextEdit[];
export declare function prettierEslintify(code: string, fileFsPath: string, workspacePath: string | undefined, range: Range, vlsFormatConfig: VLSFormatConfig, parser: ParserOption, initialIndent: boolean): TextEdit[];
export declare function prettierTslintify(code: string, fileFsPath: string, workspacePath: string, range: Range, vlsFormatConfig: VLSFormatConfig, parser: ParserOption, initialIndent: boolean): TextEdit[];
