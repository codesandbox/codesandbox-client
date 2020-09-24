import { LanguageModelCache } from '../../embeddedSupport/languageModelCache';
import { LanguageMode } from '../../embeddedSupport/languageModes';
import { VueDocumentRegions } from '../../embeddedSupport/embeddedSupport';
export declare function getCSSMode(workspacePath: string, documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getPostCSSMode(workspacePath: string, documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getSCSSMode(workspacePath: string, documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
export declare function getLESSMode(workspacePath: string, documentRegions: LanguageModelCache<VueDocumentRegions>): LanguageMode;
