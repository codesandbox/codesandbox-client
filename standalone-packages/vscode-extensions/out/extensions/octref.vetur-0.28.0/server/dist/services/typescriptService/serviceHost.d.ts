import * as ts from 'typescript';
import { TextDocument } from 'vscode-languageserver-types';
import { LanguageModelCache } from '../../embeddedSupport/languageModelCache';
import { T_TypeScript } from '../../services/dependencyService';
import { TemplateSourceMap } from './sourceMap';
import { ChildComponent } from '../vueInfoService';
export declare const templateSourceMap: TemplateSourceMap;
export interface IServiceHost {
    queryVirtualFileInfo(fileName: string, currFileText: string): {
        source: string;
        sourceMapNodesString: string;
    };
    updateCurrentVirtualVueTextDocument(doc: TextDocument, childComponents?: ChildComponent[]): {
        templateService: ts.LanguageService;
        templateSourceMap: TemplateSourceMap;
    };
    updateCurrentVueTextDocument(doc: TextDocument): {
        service: ts.LanguageService;
        scriptDoc: TextDocument;
    };
    updateExternalDocument(filePath: string): void;
    dispose(): void;
}
/**
 * Manges 4 set of files
 *
 * - `vue` files in workspace
 * - `js/ts` files in workspace
 * - `vue` files in `node_modules`
 * - `js/ts` files in `node_modules`
 */
export declare function getServiceHost(tsModule: T_TypeScript, workspacePath: string, updatedScriptRegionDocuments: LanguageModelCache<TextDocument>): IServiceHost;
