/*!
BEGIN THIRD PARTY
*/
import { ITagSet, IHTMLTagProvider } from './common';
export declare const VOID_ELEMENTS: string[];
export declare function isVoidElement(e: string | undefined): boolean;
export declare const HTML_TAGS: ITagSet;
export declare function getHTML5TagProvider(): IHTMLTagProvider;
