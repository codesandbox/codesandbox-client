/*!
BEGIN THIRD PARTY
*/
import { ITagSet, IHTMLTagProvider } from './common';
export declare const EMPTY_ELEMENTS: string[];
export declare function isEmptyElement(e: string | undefined): boolean;
export declare const HTML_TAGS: ITagSet;
export declare function getHTML5TagProvider(): IHTMLTagProvider;
