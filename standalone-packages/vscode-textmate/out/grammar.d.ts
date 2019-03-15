import { IRawGrammar, IRawRepository, IOnigLib, OnigString, OnigScanner } from './types';
import { IRuleRegistry, IRuleFactoryHelper, Rule } from './rule';
import { Matcher } from './matcher';
import { IGrammar, ITokenizeLineResult, ITokenizeLineResult2, IEmbeddedLanguagesMap, StackElement as StackElementDef, ITokenTypeMap } from './main';
import { FontStyle, ThemeTrieElementRule } from './theme';
export declare const enum TemporaryStandardTokenType {
    Other = 0,
    Comment = 1,
    String = 2,
    RegEx = 4,
    MetaEmbedded = 8
}
export declare function createGrammar(grammar: IRawGrammar, initialLanguage: number, embeddedLanguages: IEmbeddedLanguagesMap, tokenTypes: ITokenTypeMap, grammarRepository: IGrammarRepository & IThemeProvider, onigLib: IOnigLib): Grammar;
export interface IThemeProvider {
    themeMatch(scopeName: string): ThemeTrieElementRule[];
    getDefaults(): ThemeTrieElementRule;
}
export interface IGrammarRepository {
    lookup(scopeName: string): IRawGrammar;
    injections(scopeName: string): string[];
}
export interface IScopeNameSet {
    [scopeName: string]: boolean;
}
/**
 * Collects the list of all external included scopes in `grammar`.
 */
export declare function collectIncludedScopes(result: IScopeNameSet, grammar: IRawGrammar): void;
export interface Injection {
    readonly matcher: Matcher<string[]>;
    readonly priority: -1 | 0 | 1;
    readonly ruleId: number;
    readonly grammar: IRawGrammar;
}
export declare class ScopeMetadata {
    readonly scopeName: string;
    readonly languageId: number;
    readonly tokenType: TemporaryStandardTokenType;
    readonly themeData: ThemeTrieElementRule[];
    constructor(scopeName: string, languageId: number, tokenType: TemporaryStandardTokenType, themeData: ThemeTrieElementRule[]);
}
export declare class Grammar implements IGrammar, IRuleFactoryHelper, IOnigLib {
    private _rootId;
    private _lastRuleId;
    private readonly _ruleId2desc;
    private readonly _includedGrammars;
    private readonly _grammarRepository;
    private readonly _grammar;
    private _injections;
    private readonly _scopeMetadataProvider;
    private readonly _tokenTypeMatchers;
    private readonly _onigLib;
    constructor(grammar: IRawGrammar, initialLanguage: number, embeddedLanguages: IEmbeddedLanguagesMap, tokenTypes: ITokenTypeMap, grammarRepository: IGrammarRepository & IThemeProvider, onigLib: IOnigLib);
    createOnigScanner(sources: string[]): OnigScanner;
    createOnigString(sources: string): OnigString;
    onDidChangeTheme(): void;
    getMetadataForScope(scope: string): ScopeMetadata;
    getInjections(): Injection[];
    registerRule<T extends Rule>(factory: (id: number) => T): T;
    getRule(patternId: number): Rule;
    getExternalGrammar(scopeName: string, repository?: IRawRepository): IRawGrammar;
    tokenizeLine(lineText: string, prevState: StackElement): ITokenizeLineResult;
    tokenizeLine2(lineText: string, prevState: StackElement): ITokenizeLineResult2;
    private _tokenize;
}
export declare class StackElementMetadata {
    static toBinaryStr(metadata: number): string;
    static printMetadata(metadata: number): void;
    static getLanguageId(metadata: number): number;
    static getTokenType(metadata: number): number;
    static getFontStyle(metadata: number): number;
    static getForeground(metadata: number): number;
    static getBackground(metadata: number): number;
    static set(metadata: number, languageId: number, tokenType: TemporaryStandardTokenType, fontStyle: FontStyle, foreground: number, background: number): number;
}
export declare class ScopeListElement {
    _scopeListElementBrand: void;
    readonly parent: ScopeListElement;
    readonly scope: string;
    readonly metadata: number;
    constructor(parent: ScopeListElement, scope: string, metadata: number);
    private static _equals;
    equals(other: ScopeListElement): boolean;
    private static _matchesScope;
    private static _matches;
    static mergeMetadata(metadata: number, scopesList: ScopeListElement, source: ScopeMetadata): number;
    private static _push;
    push(grammar: Grammar, scope: string): ScopeListElement;
    private static _generateScopes;
    generateScopes(): string[];
}
/**
 * Represents a "pushed" state on the stack (as a linked list element).
 */
export declare class StackElement implements StackElementDef {
    _stackElementBrand: void;
    static NULL: StackElement;
    /**
     * The position on the current line where this state was pushed.
     * This is relevant only while tokenizing a line, to detect endless loops.
     * Its value is meaningless across lines.
     */
    private _enterPos;
    /**
     * The previous state on the stack (or null for the root state).
     */
    readonly parent: StackElement;
    /**
     * The depth of the stack.
     */
    readonly depth: number;
    /**
     * The state (rule) that this element represents.
     */
    readonly ruleId: number;
    /**
     * The "pop" (end) condition for this state in case that it was dynamically generated through captured text.
     */
    readonly endRule: string;
    /**
     * The list of scopes containing the "name" for this state.
     */
    readonly nameScopesList: ScopeListElement;
    /**
     * The list of scopes containing the "contentName" (besides "name") for this state.
     * This list **must** contain as an element `scopeName`.
     */
    readonly contentNameScopesList: ScopeListElement;
    constructor(parent: StackElement, ruleId: number, enterPos: number, endRule: string, nameScopesList: ScopeListElement, contentNameScopesList: ScopeListElement);
    /**
     * A structural equals check. Does not take into account `scopes`.
     */
    private static _structuralEquals;
    private static _equals;
    clone(): StackElement;
    equals(other: StackElement): boolean;
    private static _reset;
    reset(): void;
    pop(): StackElement;
    safePop(): StackElement;
    push(ruleId: number, enterPos: number, endRule: string, nameScopesList: ScopeListElement, contentNameScopesList: ScopeListElement): StackElement;
    getEnterPos(): number;
    getRule(grammar: IRuleRegistry): Rule;
    private _writeString;
    toString(): string;
    setContentNameScopesList(contentNameScopesList: ScopeListElement): StackElement;
    setEndRule(endRule: string): StackElement;
    hasSameRuleAs(other: StackElement): boolean;
}
export declare class LocalStackElement {
    readonly scopes: ScopeListElement;
    readonly endPos: number;
    constructor(scopes: ScopeListElement, endPos: number);
}
