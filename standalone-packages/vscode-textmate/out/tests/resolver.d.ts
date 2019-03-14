import { IRawGrammar, IOnigLib } from '../types';
import { RegistryOptions, Thenable } from '../main';
export interface ILanguageRegistration {
    id: string;
    extensions: string[];
    filenames: string[];
}
export interface IGrammarRegistration {
    language: string;
    scopeName: string;
    path: string;
    embeddedLanguages: {
        [scopeName: string]: string;
    };
    grammar?: Thenable<IRawGrammar>;
}
export declare class Resolver implements RegistryOptions {
    readonly language2id: {
        [languages: string]: number;
    };
    private _lastLanguageId;
    private _id2language;
    private readonly _grammars;
    private readonly _languages;
    private readonly _onigLibPromise;
    private readonly _onigLibName;
    constructor(grammars: IGrammarRegistration[], languages: ILanguageRegistration[], onigLibPromise: Thenable<IOnigLib>, onigLibName: string);
    getOnigLib(): Thenable<IOnigLib>;
    getOnigLibName(): string;
    findLanguageByExtension(fileExtension: string): string;
    findLanguageByFilename(filename: string): string;
    findScopeByFilename(filename: string): string;
    findGrammarByLanguage(language: string): IGrammarRegistration;
    loadGrammar(scopeName: string): Thenable<IRawGrammar | null>;
}
