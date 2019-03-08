/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as durations from 'durations';

import { IGrammarRegistration, Resolver, ILanguageRegistration } from './resolver';
import { getOnigasm, getOniguruma } from '../onigLibs';
import { Registry, StackElement } from '../main';

declare module 'durations';

describe.skip('Compare OnigLibs outputs', () => {
	let registrations = getVSCodeRegistrations();;
	if (!registrations) {
		console.log('vscode repo ot found, skipping OnigLibs tests');
		return;
	}
	let onigurumaResolver = new Resolver(registrations.grammarRegistrations, registrations.languageRegistrations, getOniguruma(), 'oniguruma');
	let onigasmResolver = new Resolver(registrations.grammarRegistrations, registrations.languageRegistrations, getOnigasm(), 'onigasm');

	const fixturesDir = path.join(__dirname, '../../test-cases/onigtests/fixtures');
	const fixturesFiles = fs.readdirSync(fixturesDir);
	for (let fixturesFile of fixturesFiles) {
		let testFilePath = path.join(fixturesDir, fixturesFile);
		let scopeName = onigurumaResolver.findScopeByFilename(fixturesFile);
		addTest(scopeName, testFilePath, new Registry(onigurumaResolver), new Registry(onigasmResolver));
	}
});

async function addTest(scopeName: string, filePath: string, onigurumaRegistry: Registry, onigasmRegistry: Registry) {
	(<any>it(scopeName + '/' + path.basename(filePath), async () => {
		const fileContent = fs.readFileSync(filePath).toString();
		let lines = fileContent.match(/[^\r\n]+/g);
		let prevState1: StackElement = null;
		let prevState2: StackElement = null;

		let grammar1 = await onigurumaRegistry.loadGrammar(scopeName);
		let grammar2 = await onigasmRegistry.loadGrammar(scopeName);

		let stopWatch1 = durations.stopwatch();
		let stopWatch2 = durations.stopwatch();

		for (let i = 0; i < lines.length; i++) {
			stopWatch1.start();
			let t1 = grammar1.tokenizeLine(lines[i], prevState1);
			stopWatch1.stop();
			stopWatch2.start();
			let t2 = grammar2.tokenizeLine(lines[i], prevState2);
			stopWatch2.stop();
			assert.deepEqual(t2.tokens, t1.tokens, `Difference at line ${i}: ${lines[i]}`);
			prevState1 = t1.ruleStack;
			prevState2 = t2.ruleStack;
		}
		console.log(`Oniguruma: ${stopWatch1.format()}, Onigasm: ${stopWatch2.format()} (${Math.round(stopWatch2.duration().micros() * 10 / stopWatch1.duration().micros()) / 10}x slower)`);
	})).timeout(1000000);
}

function getVSCodeRegistrations(): { grammarRegistrations: IGrammarRegistration[], languageRegistrations: ILanguageRegistration[] } {
	const grammarRegistrations: IGrammarRegistration[] = [];
	const languageRegistrations: ILanguageRegistration[] = [];

	const extensionsPath = path.join(__dirname, '../../../vscode/extensions');
	if (!fs.existsSync(extensionsPath)) {
		return null;
	}

	const extDirs = fs.readdirSync(extensionsPath);
	for (let ext of extDirs) {
		try {
			let packageJSONPath = path.join(extensionsPath, ext, 'package.json');
			if (!fs.existsSync(packageJSONPath)) {
				continue;
			}
			let packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString());
			let contributes = packageJSON['contributes'];
			if (contributes) {
				let grammars = contributes['grammars'];
				if (Array.isArray(grammars)) {
					for (let grammar of grammars) {
						let registration: IGrammarRegistration = {
							scopeName: grammar.scopeName,
							path: path.join(extensionsPath, ext, grammar.path),
							language: grammar.language,
							embeddedLanguages: grammar.embeddedLanguages
						};
						grammarRegistrations.push(registration);
					}
				}
				let languages = contributes['languages'];
				if (Array.isArray(languages)) {
					for (let language of languages) {
						let registration: ILanguageRegistration = {
							id: language.id,
							filenames: language.filenames,
							extensions: language.extensions
						};
						languageRegistrations.push(registration);
					}
				}
			}
		} catch (e) {
			// i
		}
	}
	return { grammarRegistrations, languageRegistrations };
}