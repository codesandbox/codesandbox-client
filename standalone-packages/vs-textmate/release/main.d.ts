import { IRawGrammar, IOnigLib } from './types';
export * from './types';
/**
 * A single theme setting.
 */
export interface IRawThemeSetting {
    readonly name?: string;
    readonly scope?: string | string[];
    readonly settings: {
        readonly fontStyle?: string;
        readonly foreground?: string;
        readonly background?: string;
    };
}
/**
 * A TextMate theme.
 */
export interface IRawTheme {
    readonly name?: string;
    readonly settings: IRawThemeSetting[];
}
export interface Thenable<T> extends PromiseLike<T> {
}
/**
 * A registry helper that can locate grammar file paths given scope names.
 */
export interface RegistryOptions {
    theme?: IRawTheme;
    loadGrammar(scopeName: string): Thenable<IRawGrammar | undefined | null>;
    getInjections?(scopeName: string): string[];
    getOnigLib?(): Thenable<IOnigLib>;
}
/**
 * A map from scope name to a language id. Please do not use language id 0.
 */
export interface IEmbeddedLanguagesMap {
    [scopeName: string]: number;
}
/**
 * A map from selectors to token types.
 */
export interface ITokenTypeMap {
    [selector: string]: StandardTokenType;
}
export declare const enum StandardTokenType {
    Other = 0,
    Comment = 1,
    String = 2,
    RegEx = 4
}
export interface IGrammarConfiguration {
    embeddedLanguages?: IEmbeddedLanguagesMap;
    tokenTypes?: ITokenTypeMap;
}
/**
 * The registry that will hold all grammars.
 */
export declare class Registry {
    private readonly _locator;
    private readonly _syncRegistry;
    constructor(locator?: RegistryOptions);
    /**
     * Change the theme. Once called, no previous `ruleStack` should be used anymore.
     */
    setTheme(theme: IRawTheme): void;
    /**
     * Returns a lookup array for color ids.
     */
    getColorMap(): string[];
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    loadGrammarWithEmbeddedLanguages(initialScopeName: string, initialLanguage: number, embeddedLanguages: IEmbeddedLanguagesMap): Thenable<IGrammar>;
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    loadGrammarWithConfiguration(initialScopeName: string, initialLanguage: number, configuration: IGrammarConfiguration): Thenable<IGrammar>;
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     */
    loadGrammar(initialScopeName: string): Thenable<IGrammar>;
    private _loadGrammar;
    /**
     * Adds a rawGrammar.
     */
    addGrammar(rawGrammar: IRawGrammar, injections?: string[], initialLanguage?: number, embeddedLanguages?: IEmbeddedLanguagesMap): Thenable<IGrammar>;
    /**
     * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
     */
    grammarForScopeName(scopeName: string, initialLanguage?: number, embeddedLanguages?: IEmbeddedLanguagesMap, tokenTypes?: ITokenTypeMap): Thenable<IGrammar>;
}
/**
 * A grammar
 */
export interface IGrammar {
    /**
     * Tokenize `lineText` using previous line state `prevState`.
     */
    tokenizeLine(lineText: string, prevState: StackElement): ITokenizeLineResult;
    /**
     * Tokenize `lineText` using previous line state `prevState`.
     * The result contains the tokens in binary format, resolved with the following information:
     *  - language
     *  - token type (regex, string, comment, other)
     *  - font style
     *  - foreground color
     *  - background color
     * e.g. for getting the languageId: `(metadata & MetadataConsts.LANGUAGEID_MASK) >>> MetadataConsts.LANGUAGEID_OFFSET`
     */
    tokenizeLine2(lineText: string, prevState: StackElement): ITokenizeLineResult2;
}
export interface ITokenizeLineResult {
    readonly tokens: IToken[];
    /**
     * The `prevState` to be passed on to the next line tokenization.
     */
    readonly ruleStack: StackElement;
}
/**
 * Helpers to manage the "collapsed" metadata of an entire StackElement stack.
 * The following assumptions have been made:
 *  - languageId < 256 => needs 8 bits
 *  - unique color count < 512 => needs 9 bits
 *
 * The binary format is:
 * - -------------------------------------------
 *     3322 2222 2222 1111 1111 1100 0000 0000
 *     1098 7654 3210 9876 5432 1098 7654 3210
 * - -------------------------------------------
 *     xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx
 *     bbbb bbbb bfff ffff ffFF FTTT LLLL LLLL
 * - -------------------------------------------
 *  - L = LanguageId (8 bits)
 *  - T = StandardTokenType (3 bits)
 *  - F = FontStyle (3 bits)
 *  - f = foreground color (9 bits)
 *  - b = background color (9 bits)
 */
export declare const enum MetadataConsts {
    LANGUAGEID_MASK = 255,
    TOKEN_TYPE_MASK = 1792,
    FONT_STYLE_MASK = 14336,
    FOREGROUND_MASK = 8372224,
    BACKGROUND_MASK = 4286578688,
    LANGUAGEID_OFFSET = 0,
    TOKEN_TYPE_OFFSET = 8,
    FONT_STYLE_OFFSET = 11,
    FOREGROUND_OFFSET = 14,
    BACKGROUND_OFFSET = 23
}
export interface ITokenizeLineResult2 {
    /**
     * The tokens in binary format. Each token occupies two array indices. For token i:
     *  - at offset 2*i => startIndex
     *  - at offset 2*i + 1 => metadata
     *
     */
    readonly tokens: Uint32Array;
    /**
     * The `prevState` to be passed on to the next line tokenization.
     */
    readonly ruleStack: StackElement;
}
export interface IToken {
    startIndex: number;
    readonly endIndex: number;
    readonly scopes: string[];
}
/**
 * **IMPORTANT** - Immutable!
 */
export interface StackElement {
    _stackElementBrand: void;
    readonly depth: number;
    clone(): StackElement;
    equals(other: StackElement): boolean;
}
export declare const INITIAL: StackElement;
export declare const parseRawGrammar: (content: string, filePath: string) => IRawGrammar;
