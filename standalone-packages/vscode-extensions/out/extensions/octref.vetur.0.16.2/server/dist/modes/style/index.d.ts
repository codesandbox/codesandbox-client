import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode } from '../languageModes';
import { VueDocumentRegions } from '../embeddedSupport';
export declare function getCSSMode(documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getPostCSSMode(documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getSCSSMode(documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getLESSMode(documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
