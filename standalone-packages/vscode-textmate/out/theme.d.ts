import { IRawTheme } from './main';
export declare const enum FontStyle {
    NotSet = -1,
    None = 0,
    Italic = 1,
    Bold = 2,
    Underline = 4
}
export declare class ParsedThemeRule {
    _parsedThemeRuleBrand: void;
    readonly scope: string;
    readonly parentScopes: string[];
    readonly index: number;
    /**
     * -1 if not set. An or mask of `FontStyle` otherwise.
     */
    readonly fontStyle: number;
    readonly foreground: string;
    readonly background: string;
    constructor(scope: string, parentScopes: string[], index: number, fontStyle: number, foreground: string, background: string);
}
/**
 * Parse a raw theme into rules.
 */
export declare function parseTheme(source: IRawTheme): ParsedThemeRule[];
export declare class ColorMap {
    private _lastColorId;
    private _id2color;
    private _color2id;
    constructor();
    getId(color: string): number;
    getColorMap(): string[];
}
export declare class Theme {
    static createFromRawTheme(source: IRawTheme): Theme;
    static createFromParsedTheme(source: ParsedThemeRule[]): Theme;
    private readonly _colorMap;
    private readonly _root;
    private readonly _defaults;
    private readonly _cache;
    constructor(colorMap: ColorMap, defaults: ThemeTrieElementRule, root: ThemeTrieElement);
    getColorMap(): string[];
    getDefaults(): ThemeTrieElementRule;
    match(scopeName: string): ThemeTrieElementRule[];
}
export declare function strcmp(a: string, b: string): number;
export declare function strArrCmp(a: string[], b: string[]): number;
export declare class ThemeTrieElementRule {
    _themeTrieElementRuleBrand: void;
    scopeDepth: number;
    parentScopes: string[];
    fontStyle: number;
    foreground: number;
    background: number;
    constructor(scopeDepth: number, parentScopes: string[], fontStyle: number, foreground: number, background: number);
    clone(): ThemeTrieElementRule;
    static cloneArr(arr: ThemeTrieElementRule[]): ThemeTrieElementRule[];
    acceptOverwrite(scopeDepth: number, fontStyle: number, foreground: number, background: number): void;
}
export interface ITrieChildrenMap {
    [segment: string]: ThemeTrieElement;
}
export declare class ThemeTrieElement {
    _themeTrieElementBrand: void;
    private readonly _mainRule;
    private readonly _rulesWithParentScopes;
    private readonly _children;
    constructor(mainRule: ThemeTrieElementRule, rulesWithParentScopes?: ThemeTrieElementRule[], children?: ITrieChildrenMap);
    private static _sortBySpecificity;
    private static _cmpBySpecificity;
    match(scope: string): ThemeTrieElementRule[];
    insert(scopeDepth: number, scope: string, parentScopes: string[], fontStyle: number, foreground: number, background: number): void;
    private _doInsertHere;
}
