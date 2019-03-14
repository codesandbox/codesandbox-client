import { IGrammarRepository } from './grammar';
import { IRawGrammar } from './types';
import { Thenable } from './main';
import { IGrammar, IEmbeddedLanguagesMap, ITokenTypeMap } from './main';
import { Theme, ThemeTrieElementRule } from './theme';
import { IOnigLib } from './types';
export declare class SyncRegistry implements IGrammarRepository {
    private readonly _grammars;
    private readonly _rawGrammars;
    private readonly _injectionGrammars;
    private _theme;
    private _onigLibPromise;
    constructor(theme: Theme, onigLibPromise: Thenable<IOnigLib>);
    setTheme(theme: Theme): void;
    getColorMap(): string[];
    /**
     * Add `grammar` to registry and return a list of referenced scope names
     */
    addGrammar(grammar: IRawGrammar, injectionScopeNames?: string[]): string[];
    /**
     * Lookup a raw grammar.
     */
    lookup(scopeName: string): IRawGrammar;
    /**
     * Returns the injections for the given grammar
     */
    injections(targetScope: string): string[];
    /**
     * Get the default theme settings
     */
    getDefaults(): ThemeTrieElementRule;
    /**
     * Match a scope in the theme.
     */
    themeMatch(scopeName: string): ThemeTrieElementRule[];
    /**
     * Lookup a grammar.
     */
    grammarForScopeName(scopeName: string, initialLanguage: number, embeddedLanguages: IEmbeddedLanguagesMap, tokenTypes: ITokenTypeMap): Promise<IGrammar>;
}
