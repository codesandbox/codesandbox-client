/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

export interface MatcherWithPriority<T> {
	matcher: Matcher<T>;
	priority: -1 | 0 | 1;
}

export interface Matcher<T> {
	(matcherInput: T): boolean;
}

export function createMatchers<T>(selector: string, matchesName: (names: string[], matcherInput: T) => boolean): MatcherWithPriority<T>[] {
	var results = <MatcherWithPriority<T>[]> [];
	var tokenizer = newTokenizer(selector);
	var token = tokenizer.next();
	while (token !== null) {
		let priority : -1 | 0 | 1 = 0;
		if (token.length === 2 && token.charAt(1) === ':') {
			switch (token.charAt(0)) {
				case 'R': priority = 1; break;
				case 'L': priority = -1; break;
				default:
					console.log(`Unknown priority ${token} in scope selector`);
			}
			token = tokenizer.next();
		}
		let matcher = parseConjunction();
		if (matcher) {
			results.push({ matcher, priority });
		}
		if (token !== ',') {
			break;
		}
		token = tokenizer.next();
	}
	return results;

	function parseOperand(): Matcher<T> {
		if (token === '-') {
			token = tokenizer.next();
			var expressionToNegate = parseOperand();
			return matcherInput => expressionToNegate && !expressionToNegate(matcherInput);
		}
		if (token === '(') {
			token = tokenizer.next();
			var expressionInParents = parseInnerExpression();
			if (token === ')') {
				token = tokenizer.next();
			}
			return expressionInParents;
		}
		if (isIdentifier(token)) {
			var identifiers: string[] = [];
			do {
				identifiers.push(token);
				token = tokenizer.next();
			} while (isIdentifier(token));
			return matcherInput => matchesName(identifiers, matcherInput);
		}
		return null;
	}
	function parseConjunction(): Matcher<T> {
		var matchers: Matcher<T>[] = [];
		var matcher = parseOperand();
		while (matcher) {
			matchers.push(matcher);
			matcher = parseOperand();
		}
		return matcherInput => matchers.every(matcher => matcher(matcherInput)); // and
	}
	function parseInnerExpression(): Matcher<T> {
		var matchers: Matcher<T>[] = [];
		var matcher = parseConjunction();
		while (matcher) {
			matchers.push(matcher);
			if (token === '|' || token === ',') {
				do {
					token = tokenizer.next();
				} while (token === '|' || token === ','); // ignore subsequent commas
			} else {
				break;
			}
			matcher = parseConjunction();
		}
		return matcherInput => matchers.some(matcher => matcher(matcherInput)); // or
	}
}

function isIdentifier(token: string) {
	return token && token.match(/[\w\.:]+/);
}

function newTokenizer(input: string): { next: () => string } {
	let regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
	var match = regex.exec(input);
	return {
		next: () => {
			if (!match) {
				return null;
			}
			var res = match[0];
			match = regex.exec(input);
			return res;
		}
	};
}
