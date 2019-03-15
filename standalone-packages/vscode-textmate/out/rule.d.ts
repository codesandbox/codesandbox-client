import { ILocation, IRawGrammar, IRawRepository, IRawRule } from './types';
import { IOnigLib, OnigScanner, IOnigCaptureIndex } from './types';
export interface IRuleRegistry {
    getRule(patternId: number): Rule;
    registerRule<T extends Rule>(factory: (id: number) => T): T;
}
export interface IGrammarRegistry {
    getExternalGrammar(scopeName: string, repository: IRawRepository): IRawGrammar;
}
export interface IRuleFactoryHelper extends IRuleRegistry, IGrammarRegistry {
}
export interface ICompiledRule {
    readonly scanner: OnigScanner;
    readonly rules: number[];
    readonly debugRegExps: string[];
}
export declare abstract class Rule {
    readonly $location: ILocation;
    readonly id: number;
    private readonly _nameIsCapturing;
    private readonly _name;
    private readonly _contentNameIsCapturing;
    private readonly _contentName;
    constructor($location: ILocation, id: number, name: string, contentName: string);
    readonly debugName: string;
    getName(lineText: string, captureIndices: IOnigCaptureIndex[]): string;
    getContentName(lineText: string, captureIndices: IOnigCaptureIndex[]): string;
    collectPatternsRecursive(grammar: IRuleRegistry, out: RegExpSourceList, isFirst: boolean): void;
    compile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
}
export interface ICompilePatternsResult {
    readonly patterns: number[];
    readonly hasMissingPatterns: boolean;
}
export declare class CaptureRule extends Rule {
    readonly retokenizeCapturedWithRuleId: number;
    constructor($location: ILocation, id: number, name: string, contentName: string, retokenizeCapturedWithRuleId: number);
}
export declare class RegExpSource {
    source: string;
    readonly ruleId: number;
    hasAnchor: boolean;
    readonly hasBackReferences: boolean;
    private _anchorCache;
    constructor(regExpSource: string, ruleId: number, handleAnchors?: boolean);
    clone(): RegExpSource;
    setSource(newSource: string): void;
    private _handleAnchors;
    resolveBackReferences(lineText: string, captureIndices: IOnigCaptureIndex[]): string;
    private _buildAnchorCache;
    resolveAnchors(allowA: boolean, allowG: boolean): string;
}
export declare class RegExpSourceList {
    private readonly _items;
    private _hasAnchors;
    private _cached;
    private _anchorCache;
    private readonly _cachedSources;
    constructor();
    push(item: RegExpSource): void;
    unshift(item: RegExpSource): void;
    length(): number;
    setSource(index: number, newSource: string): void;
    compile(onigLib: IOnigLib, allowA: boolean, allowG: boolean): ICompiledRule;
    private _resolveAnchors;
}
export declare class MatchRule extends Rule {
    private readonly _match;
    readonly captures: CaptureRule[];
    private _cachedCompiledPatterns;
    constructor($location: ILocation, id: number, name: string, match: string, captures: CaptureRule[]);
    readonly debugMatchRegExp: string;
    collectPatternsRecursive(grammar: IRuleRegistry, out: RegExpSourceList, isFirst: boolean): void;
    compile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
}
export declare class IncludeOnlyRule extends Rule {
    readonly hasMissingPatterns: boolean;
    readonly patterns: number[];
    private _cachedCompiledPatterns;
    constructor($location: ILocation, id: number, name: string, contentName: string, patterns: ICompilePatternsResult);
    collectPatternsRecursive(grammar: IRuleRegistry, out: RegExpSourceList, isFirst: boolean): void;
    compile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
}
export declare class BeginEndRule extends Rule {
    private readonly _begin;
    readonly beginCaptures: CaptureRule[];
    private readonly _end;
    readonly endHasBackReferences: boolean;
    readonly endCaptures: CaptureRule[];
    readonly applyEndPatternLast: boolean;
    readonly hasMissingPatterns: boolean;
    readonly patterns: number[];
    private _cachedCompiledPatterns;
    constructor($location: ILocation, id: number, name: string, contentName: string, begin: string, beginCaptures: CaptureRule[], end: string, endCaptures: CaptureRule[], applyEndPatternLast: boolean, patterns: ICompilePatternsResult);
    readonly debugBeginRegExp: string;
    readonly debugEndRegExp: string;
    getEndWithResolvedBackReferences(lineText: string, captureIndices: IOnigCaptureIndex[]): string;
    collectPatternsRecursive(grammar: IRuleRegistry, out: RegExpSourceList, isFirst: boolean): void;
    compile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
    private _precompile;
}
export declare class BeginWhileRule extends Rule {
    private readonly _begin;
    readonly beginCaptures: CaptureRule[];
    readonly whileCaptures: CaptureRule[];
    private readonly _while;
    readonly whileHasBackReferences: boolean;
    readonly hasMissingPatterns: boolean;
    readonly patterns: number[];
    private _cachedCompiledPatterns;
    private _cachedCompiledWhilePatterns;
    constructor($location: ILocation, id: number, name: string, contentName: string, begin: string, beginCaptures: CaptureRule[], _while: string, whileCaptures: CaptureRule[], patterns: ICompilePatternsResult);
    getWhileWithResolvedBackReferences(lineText: string, captureIndices: IOnigCaptureIndex[]): string;
    collectPatternsRecursive(grammar: IRuleRegistry, out: RegExpSourceList, isFirst: boolean): void;
    compile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
    private _precompile;
    compileWhile(grammar: IRuleRegistry & IOnigLib, endRegexSource: string, allowA: boolean, allowG: boolean): ICompiledRule;
    private _precompileWhile;
}
export declare class RuleFactory {
    static createCaptureRule(helper: IRuleFactoryHelper, $location: ILocation, name: string, contentName: string, retokenizeCapturedWithRuleId: number): CaptureRule;
    static getCompiledRuleId(desc: IRawRule, helper: IRuleFactoryHelper, repository: IRawRepository): number;
    private static _compileCaptures;
    private static _compilePatterns;
}
