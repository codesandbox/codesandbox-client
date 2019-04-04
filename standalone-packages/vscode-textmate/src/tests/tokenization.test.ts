/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { Registry, IGrammar, RegistryOptions, StackElement, parseRawGrammar, Thenable } from '../main';
import { IOnigLib, IRawGrammar } from '../types';
import { getOnigasm, getOniguruma } from '../onigLibs';

const REPO_ROOT = path.join(__dirname, '../../');

function assertTokenizationSuite(testLocation: string): void {

	interface IRawTest {
		desc: string;
		grammars: string[];
		grammarPath?: string;
		grammarScopeName?: string;
		grammarInjections?: string[];
		lines: IRawTestLine[];
		skipOnigasm: boolean;
	}
	interface IRawTestLine {
		line: string;
		tokens: IRawToken[];
	}
	interface IRawToken {
		value: string;
		scopes: string[];
	}

	let tests: IRawTest[] = JSON.parse(fs.readFileSync(testLocation).toString());


	tests.forEach((test) => {

		if (test.skipOnigasm) {
			it.skip(test.desc + '-onigasm', () => {
				return performTest(test, getOnigasm());
			});
		} else {
			it(test.desc + '-onigasm', () => {
				return performTest(test, getOnigasm());
			});
		}

		it(test.desc + '-oniguruma', () => {
			return performTest(test, getOniguruma());
		});
	});

	async function performTest(test: IRawTest, onigLib: Thenable<IOnigLib>): Promise<void> {

		let grammarScopeName = test.grammarScopeName;
		let grammarByScope : { [scope:string]:IRawGrammar } = {};
		for (let grammarPath of test.grammars) {
			let content = fs.readFileSync(path.join(path.dirname(testLocation), grammarPath)).toString();
			let rawGrammar = parseRawGrammar(content, grammarPath);
			grammarByScope[rawGrammar.scopeName] = rawGrammar;
			if (!grammarScopeName && grammarPath === test.grammarPath) {
				grammarScopeName = rawGrammar.scopeName;
			}
		};

		let locator: RegistryOptions = {
			loadGrammar: (scopeName: string) => Promise.resolve(grammarByScope[scopeName]),
			getInjections: (scopeName: string) => {
				if (scopeName === grammarScopeName) {
					return test.grammarInjections;
				}
			},
			getOnigLib: () => onigLib
		};
		let registry = new Registry(locator);
		let grammar: IGrammar = await registry.loadGrammar(grammarScopeName);
		if (!grammar) {
			throw new Error('I HAVE NO GRAMMAR FOR TEST');
		}
		let prevState: StackElement = null;
		for (let i = 0; i < test.lines.length; i++) {
			prevState = assertLineTokenization(grammar, test.lines[i], prevState);
		}
	}

	function assertLineTokenization(grammar: IGrammar, testCase: IRawTestLine, prevState: StackElement): StackElement {
		let actual = grammar.tokenizeLine(testCase.line, prevState);

		let actualTokens: IRawToken[] = actual.tokens.map((token) => {
			return {
				value: testCase.line.substring(token.startIndex, token.endIndex),
				scopes: token.scopes
			};
		});

		// TODO@Alex: fix tests instead of working around
		if (testCase.line.length > 0) {
			// Remove empty tokens...
			testCase.tokens = testCase.tokens.filter((token) => {
				return (token.value.length > 0);
			});
		}

		assert.deepEqual(actualTokens, testCase.tokens, 'Tokenizing line ' + testCase.line);

		return actual.ruleStack;
	}
}

describe('Tokenization /first-mate/', () => {
	assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/first-mate/tests.json'));
});

describe('Tokenization /suite1/', () => {
	assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/suite1/tests.json'));
	assertTokenizationSuite(path.join(REPO_ROOT, 'test-cases/suite1/whileTests.json'));
});

