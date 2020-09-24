import { TextDocument, Position, Range } from 'vscode-languageserver-types';
import { EmbeddedRegion } from './vueDocumentRegionParser';
export declare type LanguageId = 'vue' | 'vue-html' | 'pug' | 'css' | 'postcss' | 'scss' | 'sass' | 'less' | 'stylus' | 'javascript' | 'typescript' | 'tsx';
export interface LanguageRange extends Range {
    languageId: LanguageId;
    attributeValue?: boolean;
}
export interface VueDocumentRegions {
    /**
     * Get a document where all regions of `languageId` is preserved
     * Whereas other regions are replaced with whitespaces
     */
    getSingleLanguageDocument(languageId: LanguageId): TextDocument;
    /**
     * Get a document where all regions of `type` RegionType is preserved
     * Whereas other regions are replaced with whitespaces
     */
    getSingleTypeDocument(type: RegionType): TextDocument;
    /**
     * Get a list of ranges that has `RegionType`
     */
    getLanguageRangesOfType(type: RegionType): LanguageRange[];
    /**
     * Get all language ranges inside document
     */
    getAllLanguageRanges(): LanguageRange[];
    /**
     * Get language for determining
     */
    getLanguageAtPosition(position: Position): LanguageId;
    getImportedScripts(): string[];
}
declare type RegionType = 'template' | 'script' | 'style' | 'custom';
export declare function getVueDocumentRegions(document: TextDocument): VueDocumentRegions;
export declare function getSingleLanguageDocument(document: TextDocument, regions: EmbeddedRegion[], languageId: LanguageId): TextDocument;
export declare function getSingleTypeDocument(document: TextDocument, regions: EmbeddedRegion[], type: RegionType): TextDocument;
export declare function getLanguageRangesOfType(document: TextDocument, regions: EmbeddedRegion[], type: RegionType): LanguageRange[];
export {};
