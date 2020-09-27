import * as ts from 'typescript';
import { CompletionItem } from 'vscode-languageserver';
import { VueFileInfo } from '../../../services/vueInfoService';
import { T_TypeScript } from '../../../services/dependencyService';
export declare function getVueInterpolationCompletionMap(tsModule: T_TypeScript, fileName: string, offset: number, templateService: ts.LanguageService, vueFileInfo: VueFileInfo): Map<string, CompletionItem> | undefined;
