import { FormattingOptions, Position, Range, TextDocument, Hover, Location, CompletionItem } from 'vscode-languageserver-types';
import { VueDocumentRegions } from '../../embeddedSupport/embeddedSupport';
import { LanguageModelCache } from '../../embeddedSupport/languageModelCache';
import { LanguageMode } from '../../embeddedSupport/languageModes';
import { VueInfoService } from '../../services/vueInfoService';
import { DocumentContext } from '../../types';
import { IServiceHost } from '../../services/typescriptService/serviceHost';
import { T_TypeScript } from '../../services/dependencyService';
declare type DocumentRegionCache = LanguageModelCache<VueDocumentRegions>;
export declare class VueHTMLMode implements LanguageMode {
    private htmlMode;
    private vueInterpolationMode;
    constructor(tsModule: T_TypeScript, serviceHost: IServiceHost, documentRegions: DocumentRegionCache, workspacePath: string, vueInfoService?: VueInfoService);
    getId(): string;
    configure(c: any): void;
    queryVirtualFileInfo(fileName: string, currFileText: string): {
        source: string;
        sourceMapNodesString: string;
    };
    doValidation(document: TextDocument): import("vscode-languageserver-types").Diagnostic[];
    doComplete(document: TextDocument, position: Position): {
        isIncomplete: boolean;
        items: CompletionItem[];
    };
    doResolve(document: TextDocument, item: CompletionItem): CompletionItem;
    doHover(document: TextDocument, position: Position): Hover;
    findDocumentHighlight(document: TextDocument, position: Position): import("vscode-languageserver-types").DocumentHighlight[];
    findDocumentLinks(document: TextDocument, documentContext: DocumentContext): import("vscode-languageserver-types").DocumentLink[];
    findDocumentSymbols(document: TextDocument): import("vscode-languageserver-types").SymbolInformation[];
    format(document: TextDocument, range: Range, formattingOptions: FormattingOptions): import("vscode-languageserver-types").TextEdit[];
    findReferences(document: TextDocument, position: Position): Location[];
    findDefinition(document: TextDocument, position: Position): Location[];
    getFoldingRanges(document: TextDocument): import("vscode-languageserver-types").FoldingRange[];
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export {};
