/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import { IEmbeddedLanguagesMap, Thenable } from '../main';
import { tokenizeWithTheme, IThemedToken, IThemedTokenScopeExplanation } from './themedTokenizer';
import { ThemeData } from './themes.test';
import { Resolver } from './resolver';

interface IExpected {
	[theme: string]: IExpectedTokenization[];
}

interface IExpectedPatch {
	[theme: string]: IExpectedTokenizationPatch[];
}

export interface IExpectedTokenization {
	content: string;
	color: string;
	_r: string;
	_t: string;
}

interface IExpectedTokenizationPatch {
	index: number;
	content: string;
	color: string;
	newColor: string;
}

export class ThemeTest {

	private static _readFile(filename: string): string {
		try {
			return fs.readFileSync(filename).toString('utf8');
		} catch (err) {
			return null;
		}
	}

	private static _readJSONFile<T>(filename: string): T {
		try {
			return JSON.parse(this._readFile(filename));
		} catch (err) {
			return null;
		}
	}

	private readonly tests: SingleThemeTest[];

	private readonly THEMES_TEST_PATH: string;
	public readonly testName: string;
	// private readonly contents: string;
	// private readonly initialScopeName: string;
	// private readonly initialLanguage: number;
	// private readonly embeddedLanguages: IEmbeddedLanguagesMap;
	// private readonly expected: IExpected;
	// private readonly expectedPatch: IExpectedPatch;

	constructor(THEMES_TEST_PATH: string, testFile: string, resolver: Resolver) {
		this.THEMES_TEST_PATH = THEMES_TEST_PATH;
		const TEST_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile);
		const testFileContents = ThemeTest._readFile(TEST_FILE_PATH);

		const EXPECTED_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile + '.result');
		const testFileExpected = ThemeTest._readJSONFile<IExpected>(EXPECTED_FILE_PATH);

		const EXPECTED_PATCH_FILE_PATH = path.join(THEMES_TEST_PATH, 'tests', testFile + '.result.patch');
		const testFileExpectedPatch = ThemeTest._readJSONFile<IExpectedPatch>(EXPECTED_PATCH_FILE_PATH);

		// Determine the language
		let language = resolver.findLanguageByExtension(path.extname(testFile)) || resolver.findLanguageByFilename(testFile);
		if (!language) {
			throw new Error('Could not determine language for ' + testFile);
		}
		let grammar = resolver.findGrammarByLanguage(language);

		let embeddedLanguages: IEmbeddedLanguagesMap = Object.create(null);
		if (grammar.embeddedLanguages) {
			for (let scopeName in grammar.embeddedLanguages) {
				embeddedLanguages[scopeName] = resolver.language2id[grammar.embeddedLanguages[scopeName]];
			}
		}

		// console.log(testFileExpected);
		// console.log(testFileExpectedPatch);

		this.tests = [];
		for (let themeName in testFileExpected) {
			this.tests.push(new SingleThemeTest(
				themeName,
				testFile,
				testFileContents,
				grammar.scopeName,
				resolver.language2id[language],
				embeddedLanguages,
				testFileExpected[themeName],
				testFileExpectedPatch ? testFileExpectedPatch[themeName] : []
			));
		}

		this.testName = testFile + '-' + resolver.getOnigLibName();
		// this.contents = testFileContents;
		// this.initialScopeName = grammar.scopeName;
		// this.initialLanguage = resolver.language2id[language];
		// this.embeddedLanguages = embeddedLanguages;
		// this.expected = testFileExpected;
		// this.expectedPatch = testFileExpectedPatch;

		// assertTokenizationForThemes(test, themeDatas);
	}

	public evaluate(themeDatas: ThemeData[]): Promise<any> {
		let testsMap: { [themeName: string]: SingleThemeTest; } = {};
		for (let i = 0; i < this.tests.length; i++) {
			testsMap[this.tests[i].themeName] = this.tests[i];
		}
		return Promise.all(themeDatas.map(data => testsMap[data.themeName].evaluate(data)));
	}

	private _getDiffPageData(): IDiffPageData[] {
		return this.tests.map(t => t.getDiffPageData());
	}

	public hasDiff(): boolean {
		for (let i = 0; i < this.tests.length; i++) {
			let test = this.tests[i];
			if (test.patchedDiff && test.patchedDiff.length > 0) {
				return true;
			}
		}
		return false;
	}

	public writeDiffPage(): void {
		let r = `<html><head>`;
		r += `\n<link rel="stylesheet" type="text/css" href="../diff.css"/>`;
		r += `\n<meta charset="utf-8">`;
		r += `\n</head><body>`;
		r += `\n<script>var allData = "${new Buffer(JSON.stringify(this._getDiffPageData())).toString('base64')}";</script>`;
		r += `\n<script type="text/javascript" src="../diff.js"></script>`;
		r += `\n</body></html>`;

		fs.writeFileSync(path.join(this.THEMES_TEST_PATH, 'tests', this.testName + '.diff.html'), r);
	}
}

interface IActualCanonicalToken {
	content: string;
	color: string;
	scopes: IThemedTokenScopeExplanation[];
}
interface IExpectedCanonicalToken {
	oldIndex: number;
	content: string;
	color: string;
	_r: string;
	_t: string;
}
interface ITokenizationDiff {
	oldIndex: number;
	oldToken: IExpectedTokenization;
	newToken: IActualCanonicalToken;
}

interface IDiffPageData {
	testContent: string;
	themeName: string;
	backgroundColor: string;
	actual: IThemedToken[];
	expected: IExpectedTokenization[];
	diff: ITokenizationDiff[];
	patchedExpected: IExpectedTokenization[];
	patchedDiff: ITokenizationDiff[];
}

class SingleThemeTest {

	public readonly themeName: string;
	private readonly testName: string;
	private readonly contents: string;
	private readonly initialScopeName: string;
	private readonly initialLanguage: number;
	private readonly embeddedLanguages: IEmbeddedLanguagesMap;
	private readonly expected: IExpectedTokenization[];
	private readonly patchedExpected: IExpectedTokenization[];
	private readonly expectedPatch: IExpectedTokenizationPatch[];

	private backgroundColor: string;
	public actual: IThemedToken[];
	public diff: ITokenizationDiff[];
	public patchedDiff: ITokenizationDiff[];

	constructor(
		themeName: string,
		testName: string,
		contents: string,
		initialScopeName: string,
		initialLanguage: number,
		embeddedLanguages: IEmbeddedLanguagesMap,
		expected: IExpectedTokenization[],
		expectedPatch: IExpectedTokenizationPatch[],
	) {
		this.themeName = themeName;
		this.testName = testName;
		this.contents = contents;
		this.initialScopeName = initialScopeName;
		this.initialLanguage = initialLanguage;
		this.embeddedLanguages = embeddedLanguages;
		this.expected = expected;
		this.expectedPatch = expectedPatch;

		this.patchedExpected = [];
		let patchIndex = this.expectedPatch.length - 1;
		for (let i = this.expected.length - 1; i >= 0; i--) {
			let expectedElement = this.expected[i];
			let content = expectedElement.content;
			while (patchIndex >= 0 && i === this.expectedPatch[patchIndex].index) {
				let patch = this.expectedPatch[patchIndex];

				let patchContentIndex = content.lastIndexOf(patch.content);

				let afterContent = content.substr(patchContentIndex + patch.content.length);
				if (afterContent.length > 0) {
					this.patchedExpected.unshift({
						_r: expectedElement._r,
						_t: expectedElement._t,
						content: afterContent,
						color: expectedElement.color
					});
				}

				this.patchedExpected.unshift({
					_r: expectedElement._r,
					_t: expectedElement._t,
					content: patch.content,
					color: patch.newColor
				});

				content = content.substr(0, patchContentIndex);

				patchIndex--;
			}

			if (content.length > 0) {
				this.patchedExpected.unshift({
					_r: expectedElement._r,
					_t: expectedElement._t,
					content: content,
					color: expectedElement.color
				});
			}
		}

		this.backgroundColor = null;
		this.actual = null;
		this.diff = null;
		this.patchedDiff = null;
	}

	public evaluate(themeData: ThemeData): Thenable<void> {
		this.backgroundColor = themeData.theme.settings[0].settings.background;
		return this._tokenizeWithThemeAsync(themeData).then(res => {
			this.actual = res;
			this.diff = SingleThemeTest.computeThemeTokenizationDiff(this.actual, this.expected);
			this.patchedDiff = SingleThemeTest.computeThemeTokenizationDiff(this.actual, this.patchedExpected);
		});
	}

	public getDiffPageData(): IDiffPageData {
		return {
			testContent: this.contents,
			themeName: this.themeName,
			backgroundColor: this.backgroundColor,
			actual: this.actual,
			expected: this.expected,
			diff: this.diff,
			patchedExpected: this.patchedExpected,
			patchedDiff: this.patchedDiff
		};
	}

	private _tokenizeWithThemeAsync(themeData: ThemeData): Thenable<IThemedToken[]> {
		return themeData.registry.loadGrammarWithEmbeddedLanguages(this.initialScopeName, this.initialLanguage, this.embeddedLanguages).then(grammar => {
			return tokenizeWithTheme(themeData.theme, themeData.registry.getColorMap(), this.contents, grammar);
		});
	}

	private static computeThemeTokenizationDiff(_actual: IThemedToken[], _expected: IExpectedTokenization[]): ITokenizationDiff[] {
		let canonicalTokens: string[] = [];
		for (let i = 0, len = _actual.length; i < len; i++) {
			let explanation = _actual[i].explanation;
			for (let j = 0, lenJ = explanation.length; j < lenJ; j++) {
				canonicalTokens.push(explanation[j].content);
			}
		}

		let actual: IActualCanonicalToken[] = [];
		for (let i = 0, len = _actual.length; i < len; i++) {
			let item = _actual[i];

			for (let j = 0, lenJ = item.explanation.length; j < lenJ; j++) {
				actual.push({
					content: item.explanation[j].content,
					color: item.color,
					scopes: item.explanation[j].scopes
				});
			}
		}

		let expected: IExpectedCanonicalToken[] = [];
		for (let i = 0, len = _expected.length, canonicalIndex = 0; i < len; i++) {
			let item = _expected[i];

			let content = item.content;
			while (content.length > 0) {
				expected.push({
					oldIndex: i,
					content: canonicalTokens[canonicalIndex],
					color: item.color,
					_t: item._t,
					_r: item._r
				});
				content = content.substr(canonicalTokens[canonicalIndex].length);
				canonicalIndex++;
			}
		}

		if (actual.length !== expected.length) {
			throw new Error('Content mismatch');
		}

		let diffs: ITokenizationDiff[] = [];

		for (let i = 0, len = actual.length; i < len; i++) {
			let expectedItem = expected[i];
			let actualItem = actual[i];

			let contentIsInvisible = /^\s+$/.test(expectedItem.content);
			if (contentIsInvisible) {
				continue;
			}

			if (actualItem.color.substr(0, 7) !== expectedItem.color) {
				diffs.push({
					oldIndex: expectedItem.oldIndex,
					oldToken: expectedItem,
					newToken: actualItem
				});
			}
		}

		return diffs;
	}

}
