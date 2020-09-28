import { CLIEngine } from 'eslint';
import { TextDocument, Diagnostic } from 'vscode-languageserver-types';
import { VueVersion } from '../../../services/typescriptService/vueVersion';
export declare function doESLintValidation(document: TextDocument, engine: CLIEngine): Diagnostic[];
export declare function createLintEngine(vueVersion: VueVersion): CLIEngine;
