import { LanguageModelCache } from '../languageModelCache';
import { LanguageMode } from '../languageModes';
import { VueDocumentRegions } from '../embeddedSupport';
declare type DocumentRegionCache = LanguageModelCache<VueDocumentRegions>;
export declare function getVueHTMLMode(documentRegions: DocumentRegionCache, workspacePath: string | null | undefined): LanguageMode;
export {};
