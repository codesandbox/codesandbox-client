import { IPropertyData, IAtDirectiveData, IPseudoClassData, IPseudoElementData } from 'vscode-css-languageservice';
export interface LoadedCSSData {
    properties: IPropertyData[];
    atDirectives: IAtDirectiveData[];
    pseudoClasses: IPseudoClassData[];
    pseudoElements: IPseudoElementData[];
}
export declare const cssData: LoadedCSSData;
