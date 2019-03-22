import { CompletionList } from 'vscode-languageserver';
import { VueFileInfo } from '../../../services/vueInfoService';
/**
 * Naive approach
 * Switch to use vue-eslint-parser to parse expression and walk AST instead
 */
export declare function shouldDoInterpolationComplete(text: string, relativeOffset: number): boolean;
export declare function doVueInterpolationComplete(vueFileInfo: VueFileInfo): CompletionList;
