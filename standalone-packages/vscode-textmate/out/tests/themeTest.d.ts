import { ThemeData } from './themes.test';
import { Resolver } from './resolver';
export interface IExpectedTokenization {
    content: string;
    color: string;
    _r: string;
    _t: string;
}
export declare class ThemeTest {
    private static _readFile;
    private static _readJSONFile;
    private readonly tests;
    private readonly THEMES_TEST_PATH;
    readonly testName: string;
    constructor(THEMES_TEST_PATH: string, testFile: string, resolver: Resolver);
    evaluate(themeDatas: ThemeData[]): Promise<any>;
    private _getDiffPageData;
    hasDiff(): boolean;
    writeDiffPage(): void;
}
