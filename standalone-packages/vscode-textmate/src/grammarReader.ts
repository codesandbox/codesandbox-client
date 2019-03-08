/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import { IRawGrammar } from './types';
import * as plist from './plist';
import { CAPTURE_METADATA } from './debug';
import { parse as manualParseJSON } from './json';

export function parseRawGrammar(content: string, filePath: string): IRawGrammar {
	if (/\.json$/.test(filePath)) {
		return parseJSONGrammar(content, filePath);
	}
	return parsePLISTGrammar(content, filePath);
}

function parseJSONGrammar(contents: string, filename: string): IRawGrammar {
	if (CAPTURE_METADATA) {
		return <IRawGrammar>manualParseJSON(contents, filename, true);
	}
	return <IRawGrammar>JSON.parse(contents);
}

function parsePLISTGrammar(contents: string, filename: string): IRawGrammar {
	if (CAPTURE_METADATA) {
		return <IRawGrammar>plist.parseWithLocation(contents, filename, '$vscodeTextmateLocation');
	}
	return <IRawGrammar>plist.parse(contents);
}
