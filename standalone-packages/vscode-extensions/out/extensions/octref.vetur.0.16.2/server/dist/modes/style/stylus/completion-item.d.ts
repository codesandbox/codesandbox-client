import { CompletionItem, TextDocument, Position, CompletionList } from 'vscode-languageserver-types';
import * as cssSchema from './css-schema';
declare type CSSSchema = typeof cssSchema;
/**
 * Naive check whether currentWord is class or id
 * @param {String} currentWord
 * @return {Boolean}
 */
export declare function isClassOrId(currentWord: string): boolean;
/**
 * Naive check whether currentWord is at rule
 * @param {String} currentWord
 * @return {Boolean}
 */
export declare function isAtRule(currentWord: string): boolean;
/**
 * Naive check whether currentWord is value for given property
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {Boolean}
 */
export declare function isValue(cssSchema: CSSSchema, currentWord: string): boolean;
/**
 * Formats property name
 * @param {String} currentWord
 * @return {String}
 */
export declare function getPropertyName(currentWord: string): string;
/**
 * Search for property in cssSchema
 * @param {Object} cssSchema
 * @param {String} property
 * @return {Object}
 */
export declare function findPropertySchema(cssSchema: CSSSchema, property: string): cssSchema.CSSRecord | undefined;
/**
 * Returns completion items lists from document symbols
 * @param {String} text
 * @param {String} currentWord
 * @return {CompletionItem}
 */
export declare function getAllSymbols(text: string, currentWord: string, position: Position): CompletionItem[];
/**
 * Returns at rules list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
export declare function getAtRules(cssSchema: CSSSchema, currentWord: string): CompletionItem[];
/**
 * Returns property list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
export declare function getProperties(cssSchema: CSSSchema, currentWord: string, useSeparator: boolean): CompletionItem[];
/**
 * Returns values for current property for completion list
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
export declare function getValues(cssSchema: CSSSchema, currentWord: string): CompletionItem[];
export declare function provideCompletionItems(document: TextDocument, position: Position): CompletionList;
export {};
