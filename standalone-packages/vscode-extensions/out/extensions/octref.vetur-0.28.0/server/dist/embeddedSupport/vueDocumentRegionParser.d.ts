import { TextDocument } from 'vscode-languageserver-types';
import { LanguageId } from './embeddedSupport';
export declare type RegionType = 'template' | 'script' | 'style' | 'custom';
export interface EmbeddedRegion {
    languageId: LanguageId;
    start: number;
    end: number;
    type: RegionType;
}
export declare function parseVueDocumentRegions(document: TextDocument): {
    regions: EmbeddedRegion[];
    importedScripts: string[];
};
