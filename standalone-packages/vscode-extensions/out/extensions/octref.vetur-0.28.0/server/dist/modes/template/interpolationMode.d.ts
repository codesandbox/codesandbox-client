import { CompletionItem, CompletionList, Diagnostic, Location, MarkedString, Position, Range, TextDocument } from 'vscode-languageserver-types';
import { LanguageModelCache } from '../../embeddedSupport/languageModelCache';
import { LanguageMode } from '../../embeddedSupport/languageModes';
import { T_TypeScript } from '../../services/dependencyService';
import { IServiceHost } from '../../services/typescriptService/serviceHost';
import { VueInfoService } from '../../services/vueInfoService';
import { HTMLDocument } from './parser/htmlParser';
export declare class VueInterpolationMode implements LanguageMode {
    private tsModule;
    private serviceHost;
    private vueDocuments;
    private vueInfoService?;
    private config;
    constructor(tsModule: T_TypeScript, serviceHost: IServiceHost, vueDocuments: LanguageModelCache<HTMLDocument>, vueInfoService?: VueInfoService | undefined);
    getId(): string;
    configure(c: any): void;
    queryVirtualFileInfo(fileName: string, currFileText: string): {
        source: string;
        sourceMapNodesString: string;
    };
    doValidation(document: TextDocument): Diagnostic[];
    doComplete(document: TextDocument, position: Position): CompletionList;
    doResolve(document: TextDocument, item: CompletionItem): CompletionItem;
    doHover(document: TextDocument, position: Position): {
        contents: MarkedString[];
        range?: Range;
    };
    findDefinition(document: TextDocument, position: Position): Location[];
    findReferences(document: TextDocument, position: Position): Location[];
    onDocumentRemoved(): void;
    dispose(): void;
}
