/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as assert from 'assert';
import { StandardTokenType } from '../main';
import { StackElementMetadata, TemporaryStandardTokenType } from '../grammar';
import { FontStyle } from '../theme';

describe('StackElementMetadata', () => {

	function assertEquals(metadata: number, languageId: number, tokenType: StandardTokenType, fontStyle: FontStyle, foreground: number, background: number): void {
		let actual = {
			languageId: StackElementMetadata.getLanguageId(metadata),
			tokenType: StackElementMetadata.getTokenType(metadata),
			fontStyle: StackElementMetadata.getFontStyle(metadata),
			foreground: StackElementMetadata.getForeground(metadata),
			background: StackElementMetadata.getBackground(metadata),
		};

		let expected = {
			languageId: languageId,
			tokenType: tokenType,
			fontStyle: fontStyle,
			foreground: foreground,
			background: background,
		};

		assert.deepEqual(actual, expected, 'equals for ' + StackElementMetadata.toBinaryStr(metadata));
	}

	it('works', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
	});

	it('can overwrite languageId', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);

		value = StackElementMetadata.set(value, 2, TemporaryStandardTokenType.Other, FontStyle.NotSet, 0, 0);
		assertEquals(value, 2, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
	});

	it('can overwrite tokenType', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);

		value = StackElementMetadata.set(value, 0, TemporaryStandardTokenType.Comment, FontStyle.NotSet, 0, 0);
		assertEquals(value, 1, StandardTokenType.Comment, FontStyle.Underline | FontStyle.Bold, 101, 102);
	});

	it('can overwrite font style', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);

		value = StackElementMetadata.set(value, 0, TemporaryStandardTokenType.Other, FontStyle.None, 0, 0);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.None, 101, 102);
	});

	it('can overwrite foreground', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);

		value = StackElementMetadata.set(value, 0, TemporaryStandardTokenType.Other, FontStyle.NotSet, 5, 0);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 5, 102);
	});

	it('can overwrite background', () => {
		let value = StackElementMetadata.set(0, 1, TemporaryStandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 102);

		value = StackElementMetadata.set(value, 0, TemporaryStandardTokenType.Other, FontStyle.NotSet, 0, 7);
		assertEquals(value, 1, StandardTokenType.RegEx, FontStyle.Underline | FontStyle.Bold, 101, 7);
	});

	it('can work at max values', () => {
		const maxLangId = 255;
		const maxTokenType = StandardTokenType.Comment | StandardTokenType.Other | StandardTokenType.RegEx | StandardTokenType.String;
		const maxFontStyle = FontStyle.Bold | FontStyle.Italic | FontStyle.Underline;
		const maxForeground = 511;
		const maxBackground = 511;

		let value = StackElementMetadata.set(0, maxLangId, maxTokenType, maxFontStyle, maxForeground, maxBackground);
		assertEquals(value, maxLangId, maxTokenType, maxFontStyle, maxForeground, maxBackground);
	});


});