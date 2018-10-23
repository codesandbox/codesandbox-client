/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { TextDocument, Position, Range, CompletionItem, CompletionList, TextEdit, InsertTextFormat, CompletionItemKind } from './expand/languageserver-types'
import { expand, createSnippetsRegistry, parse } from './expand/expand-full';
import { extractAbbreviation as extract }  from './expand/extract-abbreviation';

const endsWith = function (str, search, this_len?) {
	if (this_len === undefined || this_len > str.length) {
		this_len = str.length;
	}
	return str.substring(this_len - search.length, this_len) === search;
};

const startsWith = function (str, search, pos?) {
	return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};

const find = function (arr, predicate) {
	// 1. Let O be ? ToObject(this value).
	if (arr == null) {
		throw new TypeError('"this" is null or not defined');
	}

	var o = Object(arr);

	// 2. Let len be ? ToLength(? Get(O, "length")).
	var len = o.length >>> 0;

	// 3. If IsCallable(predicate) is false, throw a TypeError exception.
	if (typeof predicate !== 'function') {
		throw new TypeError('predicate must be a function');
	}

	// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
	var thisArg = arr;

	// 5. Let k be 0.
	var k = 0;

	// 6. Repeat, while k < len
	while (k < len) {
		// a. Let Pk be ! ToString(k).
		// b. Let kValue be ? Get(O, Pk).
		// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
		// d. If testResult is true, return kValue.
		var kValue = o[k];
		if (predicate.call(thisArg, kValue, k, o)) {
			return kValue;
		}
		// e. Increase k by 1.
		k++;
	}

	// 7. Return undefined.
	return undefined;
}


let snippetKeyCache = {}; //new Map<string, string[]>();
let markupSnippetKeys: string[];
let markupSnippetKeysRegex: RegExp[];
let stylesheetCustomSnippetsKeyCache = {}; //new Map<string, string[]>();
const htmlAbbreviationStartRegex = /^[a-z,A-Z,!,(,[,#,\.]/;
const cssAbbreviationRegex = /^-?[a-z,A-Z,!,@,#]/;
const htmlAbbreviationRegex = /[a-z,A-Z]/;
const emmetModes = ['html', 'pug', 'slim', 'haml', 'xml', 'xsl', 'jsx', 'css', 'scss', 'sass', 'less', 'stylus'];
const commonlyUsedTags = ['div', 'span', 'p', 'b', 'i', 'body', 'html', 'ul', 'ol', 'li', 'head', 'section', 'canvas', 'dl', 'dt', 'dd', 'em', 'main', 'figure',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'nav', 'aside', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'th', 'td', 'blockquote', 'pre', 'sup', 'sub', 'title',
	'plaintext', 'noscript', 'legend', 'u', 'code', 'comment', 'caption', 'colgroup', 'button', 'big', 'applet', 'address', 'strong', 'small', 'lorem'];
const bemFilterSuffix = 'bem';
const filterDelimitor = '|';
const trimFilterSuffix = 't';
const commentFilterSuffix = 'c';
const maxFilters = 3;
const defaultUnitAliases = {
	e: 'em',
	p: '%',
	x: 'ex',
	r: 'rem'
};
const vendorPrefixes = { 'w': "webkit", 'm': "moz", 's': "ms", 'o': "o" };
const defaultVendorProperties = {
	'w': "animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, backface-visibility, background-clip, background-composite, background-origin, background-size, border-fit, border-horizontal-spacing, border-image, border-vertical-spacing, box-align, box-direction, box-flex, box-flex-group, box-lines, box-ordinal-group, box-orient, box-pack, box-reflect, box-shadow, color-correction, column-break-after, column-break-before, column-break-inside, column-count, column-gap, column-rule-color, column-rule-style, column-rule-width, column-span, column-width, dashboard-region, font-smoothing, highlight, hyphenate-character, hyphenate-limit-after, hyphenate-limit-before, hyphens, line-box-contain, line-break, line-clamp, locale, margin-before-collapse, margin-after-collapse, marquee-direction, marquee-increment, marquee-repetition, marquee-style, mask-attachment, mask-box-image, mask-box-image-outset, mask-box-image-repeat, mask-box-image-slice, mask-box-image-source, mask-box-image-width, mask-clip, mask-composite, mask-image, mask-origin, mask-position, mask-repeat, mask-size, nbsp-mode, perspective, perspective-origin, rtl-ordering, text-combine, text-decorations-in-effect, text-emphasis-color, text-emphasis-position, text-emphasis-style, text-fill-color, text-orientation, text-security, text-stroke-color, text-stroke-width, transform, transition, transform-origin, transform-style, transition-delay, transition-duration, transition-property, transition-timing-function, user-drag, user-modify, user-select, writing-mode, svg-shadow, box-sizing, border-radius",
	'm': "animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, backface-visibility, background-inline-policy, binding, border-bottom-colors, border-image, border-left-colors, border-right-colors, border-top-colors, box-align, box-direction, box-flex, box-ordinal-group, box-orient, box-pack, box-shadow, box-sizing, column-count, column-gap, column-rule-color, column-rule-style, column-rule-width, column-width, float-edge, font-feature-settings, font-language-override, force-broken-image-icon, hyphens, image-region, orient, outline-radius-bottomleft, outline-radius-bottomright, outline-radius-topleft, outline-radius-topright, perspective, perspective-origin, stack-sizing, tab-size, text-blink, text-decoration-color, text-decoration-line, text-decoration-style, text-size-adjust, transform, transform-origin, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, user-focus, user-input, user-modify, user-select, window-shadow, background-clip, border-radius",
	's': "accelerator, backface-visibility, background-position-x, background-position-y, behavior, block-progression, box-align, box-direction, box-flex, box-line-progression, box-lines, box-ordinal-group, box-orient, box-pack, content-zoom-boundary, content-zoom-boundary-max, content-zoom-boundary-min, content-zoom-chaining, content-zoom-snap, content-zoom-snap-points, content-zoom-snap-type, content-zooming, filter, flow-from, flow-into, font-feature-settings, grid-column, grid-column-align, grid-column-span, grid-columns, grid-layer, grid-row, grid-row-align, grid-row-span, grid-rows, high-contrast-adjust, hyphenate-limit-chars, hyphenate-limit-lines, hyphenate-limit-zone, hyphens, ime-mode, interpolation-mode, layout-flow, layout-grid, layout-grid-char, layout-grid-line, layout-grid-mode, layout-grid-type, line-break, overflow-style, perspective, perspective-origin, perspective-origin-x, perspective-origin-y, scroll-boundary, scroll-boundary-bottom, scroll-boundary-left, scroll-boundary-right, scroll-boundary-top, scroll-chaining, scroll-rails, scroll-snap-points-x, scroll-snap-points-y, scroll-snap-type, scroll-snap-x, scroll-snap-y, scrollbar-arrow-color, scrollbar-base-color, scrollbar-darkshadow-color, scrollbar-face-color, scrollbar-highlight-color, scrollbar-shadow-color, scrollbar-track-color, text-align-last, text-autospace, text-justify, text-kashida-space, text-overflow, text-size-adjust, text-underline-position, touch-action, transform, transform-origin, transform-origin-x, transform-origin-y, transform-origin-z, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, user-select, word-break, wrap-flow, wrap-margin, wrap-through, writing-mode",
	'o': "dashboard-region, animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, border-image, link, link-source, object-fit, object-position, tab-size, table-baseline, transform, transform-origin, transition, transition-delay, transition-duration, transition-property, transition-timing-function, accesskey, input-format, input-required, marquee-dir, marquee-loop, marquee-speed, marquee-style"
}

export interface EmmetConfiguration {
	showExpandedAbbreviation?: string;
	showAbbreviationSuggestions?: boolean;
	syntaxProfiles?: object;
	variables?: object;
	preferences?: object;
	excludeLanguages?: string[];
	showSuggestionsAsSnippets?: boolean;
}

export interface ExpandOptions {
	field: (index: any, placeholder: any) => string,
	syntax: string,
	profile: any,
	addons: any,
	variables: any,
	snippets: any,
	format: any,
	preferences: any
}

export function doComplete(document: TextDocument, position: Position, syntax: string, emmetConfig: EmmetConfiguration): CompletionList {

	if (emmetConfig.showExpandedAbbreviation === 'never' || !getEmmetMode(syntax, emmetConfig.excludeLanguages)) {
		return;
	}

	if (!isStyleSheet(syntax)) {
		if (!snippetKeyCache[syntax] || !markupSnippetKeysRegex || markupSnippetKeysRegex.length === 0) {
			let registry = customSnippetRegistry[syntax] ? customSnippetRegistry[syntax] : createSnippetsRegistry(syntax);

			if (!snippetKeyCache[syntax]) {
				snippetKeyCache[syntax] = registry.all({ type: 'string' }).map(snippet => {
					return snippet.key;
				});
			}

			markupSnippetKeysRegex = registry.all({ type: 'regexp' }).map(snippet => {
				return snippet.key;
			});

		}
		markupSnippetKeys = snippetKeyCache[syntax];
	}

	let extractedValue = extractAbbreviation(document, position);
	if (!extractedValue) {
		return;
	}
	let { abbreviationRange, abbreviation, filter } = extractedValue;
	let currentLineTillPosition = getCurrentLine(document, position).substr(0, position.character);
	let currentWord = getCurrentWord(currentLineTillPosition);

	// Dont attempt to expand open tags
	if (currentWord === abbreviation
		&& endsWith(currentLineTillPosition, `<${abbreviation}`)
		&& (syntax === 'html' || syntax === 'xml' || syntax === 'xsl' || syntax === 'jsx')) {
		return;
	}

	let expandOptions = getExpandOptions(syntax, emmetConfig, filter);
	let preferences = expandOptions['preferences'];
	delete expandOptions['preferences'];
	let expandedText;
	let expandedAbbr: CompletionItem;
	let completionItems: CompletionItem[] = [];

	// Create completion item for expanded abbreviation
	const createExpandedAbbr = (abbr) => {

		try {
			expandedText = expand(abbr, expandOptions);
		} catch (e) {
		}

		if (expandedText && isExpandedTextNoise(syntax, abbr, expandedText)) {
			expandedText = '';
		}

		if (expandedText) {
			expandedAbbr = CompletionItem.create(abbr);
			expandedAbbr.textEdit = TextEdit.replace(abbreviationRange, escapeNonTabStopDollar(addFinalTabStop(expandedText)));
			expandedAbbr.documentation = replaceTabStopsWithCursors(expandedText);
			expandedAbbr.insertTextFormat = InsertTextFormat.Snippet;
			expandedAbbr.detail = 'Emmet Abbreviation';
			expandedAbbr.label = abbreviation;
			expandedAbbr.label += filter ? '|' + filter.replace(',', '|') : "";
			completionItems = [expandedAbbr];
		}
	}

	if (isStyleSheet(syntax)) {
		let { prefixOptions, abbreviationWithoutPrefix } = splitVendorPrefix(abbreviation);
		// If abbreviation is valid, then expand it and ensure the expanded value is not noise
		if (isAbbreviationValid(syntax, abbreviation)) {
			createExpandedAbbr(abbreviationWithoutPrefix);
		}

		if (expandedAbbr) {
			let prefixedExpandedText = applyVendorPrefixes(expandedText, prefixOptions, preferences);
			expandedAbbr.textEdit = TextEdit.replace(abbreviationRange, escapeNonTabStopDollar(addFinalTabStop(prefixedExpandedText)));
			expandedAbbr.documentation = replaceTabStopsWithCursors(prefixedExpandedText);
			expandedAbbr.label = removeTabStops(expandedText);
			expandedAbbr.filterText = abbreviation;

			const stylesheetCustomSnippetsKeys = stylesheetCustomSnippetsKeyCache[syntax] ? stylesheetCustomSnippetsKeyCache[syntax] : stylesheetCustomSnippetsKeyCache['css'];
			completionItems = makeSnippetSuggestion(stylesheetCustomSnippetsKeys, currentWord, abbreviation, abbreviationRange, expandOptions, 'Emmet Custom Snippet', false);

			if (!find(completionItems, x => x.textEdit.newText === expandedAbbr.textEdit.newText)) {

				// Fix for https://github.com/Microsoft/vscode/issues/28933#issuecomment-309236902
				// When user types in propertyname, emmet uses it to match with snippet names, resulting in width -> widows or font-family -> font: family
				// Filter out those cases here.
				const abbrRegex = new RegExp('.*' + abbreviationWithoutPrefix.split('').map(x => x === '$' ? '\\$' : x).join('.*') + '.*', 'i');
				if (/\d/.test(abbreviation) || abbrRegex.test(expandedAbbr.label)) {
					completionItems.push(expandedAbbr);
				}
			}
		}

		// Incomplete abbreviation using vendor prefix
		if (!completionItems.length && (abbreviation === '-' || /^-[wmso]{1,4}-?$/.test(abbreviation))) {
			return CompletionList.create([], true);
		}
	} else {
		// If abbreviation is valid, then expand it and ensure the expanded value is not noise
		if (isAbbreviationValid(syntax, abbreviation)) {
			createExpandedAbbr(abbreviation);
		}

		let commonlyUsedTagSuggestions = makeSnippetSuggestion(commonlyUsedTags, currentWord, abbreviation, abbreviationRange, expandOptions, 'Emmet Abbreviation');
		completionItems = completionItems.concat(commonlyUsedTagSuggestions);

		if (emmetConfig.showAbbreviationSuggestions === true) {
			let abbreviationSuggestions = makeSnippetSuggestion(markupSnippetKeys, currentWord, abbreviation, abbreviationRange, expandOptions, 'Emmet Abbreviation');

			// Workaround for the main expanded abbr not appearing before the snippet suggestions
			if (expandedAbbr && abbreviationSuggestions.length > 0) {
				expandedAbbr.sortText = '0' + expandedAbbr.label;
			}

			abbreviationSuggestions.forEach(item => {
				// Workaround for snippet suggestions items getting filtered out as the complete abbr does not start with snippetKey
				item.filterText = abbreviation
				// Workaround for the main expanded abbr not appearing before the snippet suggestions
				item.sortText = '9' + abbreviation;
			});
			completionItems = completionItems.concat(abbreviationSuggestions);
		}
	}

	if (emmetConfig.showSuggestionsAsSnippets === true) {
		completionItems.forEach(x => x.kind = CompletionItemKind.Snippet);
	}
	return completionItems.length ? CompletionList.create(completionItems, true) : undefined;
}

function makeSnippetSuggestion(snippets: string[], prefix: string, abbreviation: string, abbreviationRange: Range, expandOptions: any, snippetDetail: string, skipFullMatch: boolean = true): CompletionItem[] {
	if (!prefix || !snippets) {
		return [];
	}
	let snippetCompletions = [];
	snippets.forEach(snippetKey => {
		if (!startsWith(snippetKey, prefix.toLowerCase()) || (skipFullMatch && snippetKey === prefix.toLowerCase())) {
			return;
		}

		let currentAbbr = abbreviation + snippetKey.substr(prefix.length);
		let expandedAbbr;
		try {
			expandedAbbr = expand(currentAbbr, expandOptions);
		} catch (e) {

		}
		if (!expandedAbbr) {
			return;
		}

		let item = CompletionItem.create(prefix + snippetKey.substr(prefix.length));
		item.documentation = replaceTabStopsWithCursors(expandedAbbr);
		item.detail = snippetDetail;
		item.textEdit = TextEdit.replace(abbreviationRange, escapeNonTabStopDollar(addFinalTabStop(expandedAbbr)));
		item.insertTextFormat = InsertTextFormat.Snippet;

		snippetCompletions.push(item);
	});
	return snippetCompletions;
}

function getCurrentWord(currentLineTillPosition: string): string {
	if (currentLineTillPosition) {
		let matches = currentLineTillPosition.match(/[\w,:,-]*$/);
		if (matches) {
			return matches[0];
		}
	}
}

function replaceTabStopsWithCursors(expandedWord: string): string {
	return expandedWord.replace(/([^\\])\$\{\d+\}/g, '$1|').replace(/\$\{\d+:([^\}]+)\}/g, '$1');
}

function removeTabStops(expandedWord: string): string {
	return expandedWord.replace(/([^\\])\$\{\d+\}/g, '$1').replace(/\$\{\d+:([^\}]+)\}/g, '$1');
}

function escapeNonTabStopDollar(text: string): string {
	return text ? text.replace(/([^\\])(\$)([^\{])/g, '$1\\$2$3') : text;
}

function addFinalTabStop(text): string {
	if (!text || !text.trim()) {
		return text;
	}

	let maxTabStop = -1;
	let maxTabStopRanges = [];
	let foundLastStop = false;
	let replaceWithLastStop = false;
	let i = 0;
	let n = text.length;

	try {
		while (i < n && !foundLastStop) {
			// Look for ${
			if (text[i++] != '$' || text[i++] != '{') {
				continue;
			}

			// Find tabstop
			let numberStart = -1;
			let numberEnd = -1;
			while (i < n && /\d/.test(text[i])) {
				numberStart = numberStart < 0 ? i : numberStart;
				numberEnd = i + 1;
				i++;
			}

			// If ${ was not followed by a number and either } or :, then its not a tabstop
			if (numberStart === -1 || numberEnd === -1 || i >= n || (text[i] != '}' && text[i] != ':')) {
				continue;
			}

			// If ${0} was found, then break
			const currentTabStop = text.substring(numberStart, numberEnd);
			foundLastStop = currentTabStop === '0';
			if (foundLastStop) {
				break;
			}

			let foundPlaceholder = false;
			if (text[i++] == ':') {
				// TODO: Nested placeholders may break here
				while (i < n) {
					if (text[i] == '}') {
						foundPlaceholder = true;
						break;
					}
					i++;
				}
			}

			// Decide to replace currentTabStop with ${0} only if its the max among all tabstops and is not a placeholder
			if (Number(currentTabStop) > Number(maxTabStop)) {
				maxTabStop = currentTabStop;
				maxTabStopRanges = [{ numberStart, numberEnd }];
				replaceWithLastStop = !foundPlaceholder;
			} else if (currentTabStop == maxTabStop) {
				maxTabStopRanges.push({ numberStart, numberEnd });
			}
		}
	} catch (e) {

	}

	if (replaceWithLastStop && !foundLastStop) {
		for (let i = 0; i < maxTabStopRanges.length; i++) {
			let rangeStart = maxTabStopRanges[i].numberStart;
			let rangeEnd = maxTabStopRanges[i].numberEnd;
			text = text.substr(0, rangeStart) + '0' + text.substr(rangeEnd);
		}
	}

	return text;
}

function getCurrentLine(document: TextDocument, position: Position): string {
	let offset = document.offsetAt(position);
	let text = document.getText();
	let start = 0;
	let end = text.length;
	for (let i = offset - 1; i >= 0; i--) {
		if (text[i] === '\n') {
			start = i + 1;
			break;
		}
	}
	for (let i = offset; i < text.length; i++) {
		if (text[i] === '\n') {
			end = i;
			break;
		}
	}
	return text.substring(start, end);
}

let customSnippetRegistry = {};
let variablesFromFile = {};
let profilesFromFile = {};

export const emmetSnippetField = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;

export function isStyleSheet(syntax): boolean {
	let stylesheetSyntaxes = ['css', 'scss', 'sass', 'less', 'stylus'];
	return (stylesheetSyntaxes.indexOf(syntax) > -1);
}

function getFilters(text: string, pos: number): { pos: number, filter: string } {
	let filter;
	for (let i = 0; i < maxFilters; i++) {
		if (endsWith(text, `${filterDelimitor}${bemFilterSuffix}`, pos)) {
			pos -= bemFilterSuffix.length + 1;
			filter = filter ? bemFilterSuffix + ',' + filter : bemFilterSuffix;
		} else if (endsWith(text, `${filterDelimitor}${commentFilterSuffix}`, pos)) {
			pos -= commentFilterSuffix.length + 1;
			filter = filter ? commentFilterSuffix + ',' + filter : commentFilterSuffix;
		} else if (endsWith(text, `${filterDelimitor}${trimFilterSuffix}`, pos)) {
			pos -= trimFilterSuffix.length + 1;
			filter = filter ? trimFilterSuffix + ',' + filter : trimFilterSuffix;
		} else {
			break;
		}
	}
	return {
		pos: pos,
		filter: filter
	}
}
/**
 * Extracts abbreviation from the given position in the given document
 */
export function extractAbbreviation(document: TextDocument, position: Position, lookAhead: boolean = true): { abbreviation: string, abbreviationRange: Range, filter: string } {
	const currentLine = getCurrentLine(document, position);
	const currentLineTillPosition = currentLine.substr(0, position.character);
	const { pos, filter } = getFilters(currentLineTillPosition, position.character);
	const lengthOccupiedByFilter = filter ? filter.length + 1 : 0;

	try {
		const result = extract(currentLine, pos, { lookAhead: lookAhead });
		const rangeToReplace = Range.create(position.line, result.location, position.line, result.location + result.abbreviation.length + lengthOccupiedByFilter);
		return {
			abbreviationRange: rangeToReplace,
			abbreviation: result.abbreviation,
			filter
		};
	}
	catch (e) {
	}
}

/**
 * Extracts abbreviation from the given text
 */
export function extractAbbreviationFromText(text: string): { abbreviation: string, filter: string } {
	if (!text) {
		return;
	}

	const { pos, filter } = getFilters(text, text.length);

	try {
		const result = extract(text, pos, { lookAhead: true });
		return {
			abbreviation: result.abbreviation,
			filter
		};
	}
	catch (e) {
	}
}

/**
 * Returns a boolean denoting validity of given abbreviation in the context of given syntax
 * Not needed once https://github.com/emmetio/atom-plugin/issues/22 is fixed
 * @param syntax string
 * @param abbreviation string
 */
export function isAbbreviationValid(syntax: string, abbreviation: string): boolean {
	if (!abbreviation) {
		return false;
	}
	if (isStyleSheet(syntax)) {
		// Fix for https://github.com/Microsoft/vscode/issues/1623 in new emmet
		if (endsWith(abbreviation, ':')) {
			return false;
		}
		return cssAbbreviationRegex.test(abbreviation);
	}
	if (startsWith(abbreviation, '!')) {
		return !/[^!]/.test(abbreviation);
	}
	// Its common for users to type (sometextinsidebrackets), this should not be treated as an abbreviation
	if (/^[a-z,A-Z,\d,-,:,\(,\),\.,\$]*$/.test(abbreviation) && /\(/.test(abbreviation) && /\)/.test(abbreviation)) {
		return false;
	}

	return (htmlAbbreviationStartRegex.test(abbreviation) && htmlAbbreviationRegex.test(abbreviation));
}

function isExpandedTextNoise(syntax: string, abbreviation: string, expandedText: string): boolean {
	// Unresolved css abbreviations get expanded to a blank property value
	// Eg: abc -> abc: ; or abc:d -> abc: d; which is noise if it gets suggested for every word typed
	if (isStyleSheet(syntax)) {
		let after = (syntax === 'sass' || syntax === 'stylus') ? '' : ';';
		return expandedText === `${abbreviation}: \${1}${after}` || expandedText.replace(/\s/g, '') === abbreviation.replace(/\s/g, '') + after;
	}

	if (commonlyUsedTags.indexOf(abbreviation.toLowerCase()) > -1 || markupSnippetKeys.indexOf(abbreviation) > -1) {
		return false;
	}

	// Custom tags can have - or :
	if (/[-,:]/.test(abbreviation) && !/--|::/.test(abbreviation)) {
		return false;
	}

	// Its common for users to type some text and end it with period, this should not be treated as an abbreviation
	// Else it becomes noise.
	if (/^[a-z,A-Z,\d]*\.$/.test(abbreviation)) {
		return true;
	}

	// Unresolved html abbreviations get expanded as if it were a tag
	// Eg: abc -> <abc></abc> which is noise if it gets suggested for every word typed
	return (expandedText.toLowerCase() === `<${abbreviation.toLowerCase()}>\${1}</${abbreviation.toLowerCase()}>`);
}

/**
 * Returns options to be used by the expand module
 * @param syntax
 * @param textToReplace
 */
export function getExpandOptions(syntax: string, emmetConfig?: object, filter?: string): ExpandOptions {
	emmetConfig = emmetConfig || {};
	emmetConfig['preferences'] = emmetConfig['preferences'] || {};

	// Fetch snippet registry
	let baseSyntax = isStyleSheet(syntax) ? 'css' : 'html';
	if (!customSnippetRegistry[syntax] && customSnippetRegistry[baseSyntax]) {
		customSnippetRegistry[syntax] = customSnippetRegistry[baseSyntax];
	}

	// Fetch Profile
	let profile = getProfile(syntax, emmetConfig['syntaxProfiles']);
	let filtersFromProfile: string[] = (profile && profile['filters']) ? profile['filters'].split(',') : [];
	filtersFromProfile = filtersFromProfile.map(filterFromProfile => filterFromProfile.trim());

	// Update profile based on preferences
	if (emmetConfig['preferences']['format.noIndentTags']) {
		if (Array.isArray(emmetConfig['preferences']['format.noIndentTags'])) {
			profile['formatSkip'] = emmetConfig['preferences']['format.noIndentTags'];
		} else if (typeof emmetConfig['preferences']['format.noIndentTags'] === 'string') {
			profile['formatSkip'] = emmetConfig['preferences']['format.noIndentTags'].split(',');
		}

	}
	if (emmetConfig['preferences']['format.forceIndentationForTags']) {
		if (Array.isArray(emmetConfig['preferences']['format.forceIndentationForTags'])) {
			profile['formatForce'] = emmetConfig['preferences']['format.forceIndentationForTags'];
		} else if (typeof emmetConfig['preferences']['format.forceIndentationForTags'] === 'string') {
			profile['formatForce'] = emmetConfig['preferences']['format.forceIndentationForTags'].split(',');
		}
	}
	if (emmetConfig['preferences']['profile.allowCompactBoolean'] && typeof emmetConfig['preferences']['profile.allowCompactBoolean'] === 'boolean') {
		profile['compactBooleanAttributes'] = emmetConfig['preferences']['profile.allowCompactBoolean'];
	}

	// Fetch Add Ons
	let addons = {};
	if (filter && find(filter.split(','), x => x.trim() === 'bem') || filtersFromProfile.indexOf('bem') > -1) {
		addons['bem'] = { element: '__' };
		if (emmetConfig['preferences']['bem.elementSeparator']) {
			addons['bem']['element'] = emmetConfig['preferences']['bem.elementSeparator'];
		}
		if (emmetConfig['preferences']['bem.modifierSeparator']) {
			addons['bem']['modifier'] = emmetConfig['preferences']['bem.modifierSeparator'];
		}
	}
	if (syntax === 'jsx') {
		addons['jsx'] = true;
	}

	// Fetch Formatters
	let formatters = getFormatters(syntax, emmetConfig['preferences']);
	if (filter && find(filter.split(','), x => x.trim() === 'c') || filtersFromProfile.indexOf('c') > -1) {
		if (!formatters['comment']) {
			formatters['comment'] = {
				enabled: true
			}
		} else {
			formatters['comment']['enabled'] = true;
		}
	}

	// If the user doesn't provide specific properties for a vendor, use the default values
	let preferences = emmetConfig['preferences'];
	for (const v in vendorPrefixes) {
		let vendorProperties = preferences['css.' + vendorPrefixes[v] + 'Properties'];
		if (vendorProperties == null) {
			preferences['css.' + vendorPrefixes[v] + 'Properties'] = defaultVendorProperties[v];
		}
	}


	return {
		field: emmetSnippetField,
		syntax: syntax,
		profile: profile,
		addons: addons,
		variables: getVariables(emmetConfig['variables']),
		snippets: customSnippetRegistry[syntax],
		format: formatters,
		preferences: preferences
	};
}

function splitVendorPrefix(abbreviation: string): { prefixOptions: string, abbreviationWithoutPrefix: string } {
	abbreviation = abbreviation || "";
	if (abbreviation[0] != '-') {
		return {
			prefixOptions: "",
			abbreviationWithoutPrefix: abbreviation
		};
	} else {
		abbreviation = abbreviation.substr(1);
		let pref = "-";
		if (/^[wmso]*-./.test(abbreviation)) {
			let index = abbreviation.indexOf("-");
			if (index > -1) {
				pref += abbreviation.substr(0, index + 1);
				abbreviation = abbreviation.substr(index + 1);
			}
		}
		return {
			prefixOptions: pref,
			abbreviationWithoutPrefix: abbreviation
		};
	}
}

function applyVendorPrefixes(expandedProperty: string, vendors: string, preferences: any) {
	preferences = preferences || {};
	expandedProperty = expandedProperty || "";
	vendors = vendors || "";

	if (vendors[0] !== '-') {
		return expandedProperty;
	}

	if (vendors == "-") {
		let defaultVendors = "-";
		let property = expandedProperty.substr(0, expandedProperty.indexOf(':'));
		if (!property) {
			return expandedProperty;
		}

		for (const v in vendorPrefixes) {
			let vendorProperties = preferences['css.' + vendorPrefixes[v] + 'Properties'];
			if (vendorProperties && vendorProperties.split(',').find(x => x.trim() === property)) defaultVendors += v;
		}

		// If no vendors specified, add all
		vendors = defaultVendors == "-" ? "-wmso" : defaultVendors;
		vendors += '-';
	}
	vendors = vendors.substr(1);

	let prefixedProperty = "";
	for (let index = 0; index < vendors.length - 1; index++) {
		prefixedProperty += '-' + vendorPrefixes[vendors[index]] + '-' + expandedProperty + "\n";
	}
	return prefixedProperty + expandedProperty;
}

export function parseAbbreviation(abbreviation: string, options: ExpandOptions): any {
	return parse(abbreviation, options);
}

/**
 * Expands given abbreviation using given options
 * @param abbreviation string
 * @param options
 */
export function expandAbbreviation(abbreviation: any, options: ExpandOptions): string {
	let expandedText;
	let preferences = options['preferences'];
	delete options['preferences'];
	if (isStyleSheet(options['syntax']) && typeof abbreviation === 'string') {
		let { prefixOptions, abbreviationWithoutPrefix } = splitVendorPrefix(abbreviation);
		expandedText = expand(abbreviationWithoutPrefix, options);
		expandedText = applyVendorPrefixes(expandedText, prefixOptions, preferences);
	} else {
		expandedText = expand(abbreviation, options);
	}
	return escapeNonTabStopDollar(addFinalTabStop(expandedText));
}

/**
 * Maps and returns syntaxProfiles of previous format to ones compatible with new emmet modules
 * @param syntax
 */
function getProfile(syntax: string, profilesFromSettings: object): any {
	if (!profilesFromSettings) {
		profilesFromSettings = {};
	}
	let profilesConfig = (<any>Object).assign({}, profilesFromFile, profilesFromSettings);

	let options = profilesConfig[syntax];
	if (!options || typeof options === 'string') {
		if (options === 'xhtml') {
			return {
				selfClosingStyle: 'xhtml'
			};
		}
		return {};
	}
	let newOptions = {};
	for (let key in options) {
		switch (key) {
			case 'tag_case':
				newOptions['tagCase'] = (options[key] === 'lower' || options[key] === 'upper') ? options[key] : '';
				break;
			case 'attr_case':
				newOptions['attributeCase'] = (options[key] === 'lower' || options[key] === 'upper') ? options[key] : '';
				break;
			case 'attr_quotes':
				newOptions['attributeQuotes'] = options[key];
				break;
			case 'tag_nl':
				newOptions['format'] = (options[key] === true || options[key] === false) ? options[key] : true;
				break;
			case 'inline_break':
				newOptions['inlineBreak'] = options[key];
				break;
			case 'self_closing_tag':
				if (options[key] === true) {
					newOptions['selfClosingStyle'] = 'xml'; break;
				}
				if (options[key] === false) {
					newOptions['selfClosingStyle'] = 'html'; break;
				}
				newOptions['selfClosingStyle'] = options[key];
				break;
			case 'compact_bool':
				newOptions['compactBooleanAttributes'] = options[key];
				break;
			default:
				newOptions[key] = options[key];
				break;
		}
	}
	return newOptions;
}

/**
 * Returns variables to be used while expanding snippets
 */
function getVariables(variablesFromSettings: object): any {
	if (!variablesFromSettings) {
		return variablesFromFile;
	}
	return (<any>Object).assign({}, variablesFromFile, variablesFromSettings);
}

function getFormatters(syntax: string, preferences: object) {
	if (!preferences) {
		return {};
	}

	if (!isStyleSheet(syntax)) {
		let commentFormatter = {};
		for (let key in preferences) {
			switch (key) {
				case 'filter.commentAfter':
					commentFormatter['after'] = preferences[key];
					break;
				case 'filter.commentBefore':
					commentFormatter['before'] = preferences[key];
					break;
				case 'filter.commentTrigger':
					commentFormatter['trigger'] = preferences[key];
					break;
				default:
					break;
			}
		}
		return {
			comment: commentFormatter
		};
	}

	let stylesheetFormatter = {
		'fuzzySearchMinScore': 0.3
	};
	for (let key in preferences) {
		switch (key) {
			case 'css.floatUnit':
				stylesheetFormatter['floatUnit'] = preferences[key];
				break;
			case 'css.intUnit':
				stylesheetFormatter['intUnit'] = preferences[key];
				break;
			case 'css.unitAliases':
				let unitAliases = {};
				preferences[key].split(',').forEach(alias => {
					if (!alias || !alias.trim() || alias.indexOf(':') === -1) {
						return;
					}
					let aliasName = alias.substr(0, alias.indexOf(':'));
					let aliasValue = alias.substr(aliasName.length + 1);
					if (!aliasName.trim() || !aliasValue) {
						return;
					}
					unitAliases[aliasName.trim()] = aliasValue;
				});
				stylesheetFormatter['unitAliases'] = unitAliases;
				break;
			case `${syntax}.valueSeparator`:
				stylesheetFormatter['between'] = preferences[key];
				break;
			case `${syntax}.propertyEnd`:
				stylesheetFormatter['after'] = preferences[key];
				break;
			default:
				break;
		}
	}
	return {
		stylesheet: stylesheetFormatter
	};
}

/**
 * Updates customizations from snippets.json and syntaxProfiles.json files in the directory configured in emmet.extensionsPath setting
 */
/* export function updateExtensionsPath(emmetExtensionsPath: string, workspaceFolderPath?: string): Promise<void> {
	if (!emmetExtensionsPath || !emmetExtensionsPath.trim()) {
		resetSettingsFromFile();
		return Promise.resolve();
	}

	emmetExtensionsPath = emmetExtensionsPath.trim();
	workspaceFolderPath = workspaceFolderPath ? workspaceFolderPath.trim() : '';
	if (emmetExtensionsPath[0] === '~') {
		emmetExtensionsPath = path.join(homedir(), emmetExtensionsPath.substr(1));
	} else if (!path.isAbsolute(emmetExtensionsPath) && workspaceFolderPath) {
		emmetExtensionsPath = path.join(workspaceFolderPath, emmetExtensionsPath);
	}

	if (!path.isAbsolute(emmetExtensionsPath)) {
		resetSettingsFromFile();
		return Promise.reject('The path provided in emmet.extensionsPath setting should be absoulte path');
	}
	if (!dirExists(emmetExtensionsPath)) {
		resetSettingsFromFile();
		return Promise.reject(`The directory ${emmetExtensionsPath} doesnt exist. Update emmet.extensionsPath setting`);
	}

	let dirPath = emmetExtensionsPath;
	let snippetsPath = path.join(dirPath, 'snippets.json');
	let profilesPath = path.join(dirPath, 'syntaxProfiles.json');

	let snippetsPromise = new Promise<void>((resolve, reject) => {
		fs.readFile(snippetsPath, (err, snippetsData) => {
			if (err) {
				return reject(`Error while fetching the file ${snippetsPath}`);
			}
			try {
				let errors = [];
				let snippetsJson = JSONC.parse(snippetsData.toString(), errors);
				if (errors.length > 0) {
					return reject(`Found error ${JSONC.ScanError[errors[0].error]} while parsing the file ${snippetsPath} at offset ${errors[0].offset}`);
				}
				variablesFromFile = snippetsJson['variables'];
				customSnippetRegistry = {};
				snippetKeyCache.clear();
				Object.keys(snippetsJson).forEach(syntax => {
					if (!snippetsJson[syntax]['snippets']) {
						return;
					}
					let baseSyntax = isStyleSheet(syntax) ? 'css' : 'html';
					let customSnippets = snippetsJson[syntax]['snippets'];
					if (snippetsJson[baseSyntax] && snippetsJson[baseSyntax]['snippets'] && baseSyntax !== syntax) {
						customSnippets = Object.assign({}, snippetsJson[baseSyntax]['snippets'], snippetsJson[syntax]['snippets'])
					}
					if (!isStyleSheet(syntax)) {
						// In Emmet 2.0 all snippets should be valid abbreviations
						// Convert old snippets that do not follow this format to new format
						for (let snippetKey in customSnippets) {
							if (customSnippets.hasOwnProperty(snippetKey)
								&& customSnippets[snippetKey].startsWith('<')
								&& customSnippets[snippetKey].endsWith('>')) {
								customSnippets[snippetKey] = `{${customSnippets[snippetKey]}}`
							}
						}
					} else {
						stylesheetCustomSnippetsKeyCache.set(syntax, Object.keys(customSnippets));
					}

					customSnippetRegistry[syntax] = createSnippetsRegistry(syntax, customSnippets);

					let snippetKeys: string[] = customSnippetRegistry[syntax].all({ type: 'string' }).map(snippet => {
						return snippet.key;
					});
					snippetKeyCache.set(syntax, snippetKeys);
				});
			} catch (e) {
				return reject(`Error while parsing the file ${snippetsPath}`);
			}
			return resolve();
		});
	});

	let variablesPromise = new Promise<void>((resolve, reject) => {
		fs.readFile(profilesPath, (err, profilesData) => {
			try {
				if (!err) {
					profilesFromFile = JSON.parse(profilesData.toString());
				}
			} catch (e) {

			}
			return resolve();
		});
	});

	return Promise.all([snippetsPromise, variablesFromFile]).then(() => Promise.resolve());

} */

/* function dirExists(dirPath: string): boolean {
	try {

		return fs.statSync(dirPath).isDirectory();
	} catch (e) {
		return false;
	}
} */

function resetSettingsFromFile() {
	customSnippetRegistry = {};
	snippetKeyCache = {};
	stylesheetCustomSnippetsKeyCache = {};
	profilesFromFile = {};
	variablesFromFile = {};
}

/**
* Get the corresponding emmet mode for given vscode language mode
* Eg: jsx for typescriptreact/javascriptreact or pug for jade
* If the language is not supported by emmet or has been exlcuded via `exlcudeLanguages` setting,
* then nothing is returned
*
* @param language
* @param exlcudedLanguages Array of language ids that user has chosen to exlcude for emmet
*/
export function getEmmetMode(language: string, excludedLanguages: string[] = []): string {
	if (!language || excludedLanguages.indexOf(language) > -1) {
		return;
	}
	if (/\b(typescriptreact|javascriptreact|jsx-tags)\b/.test(language)) { // treat tsx like jsx
		return 'jsx';
	}
	if (language === 'sass-indented') { // map sass-indented to sass
		return 'sass';
	}
	if (language === 'jade') {
		return 'pug';
	}
	if (emmetModes.indexOf(language) > -1) {
		return language;
	}
}

const hexColorRegex = /^#[\d,a-f,A-F]{1,6}$/;
const onlyLetters = /^[a-z,A-Z]+$/;
export function getEmmetCompletionParticipants(document: TextDocument, position: Position, syntax: string, emmetSettings: EmmetConfiguration, result: CompletionList): any {
	return {
		onCssProperty: (context) => {
			if (context && context.propertyName) {
				const currentresult = doComplete(document, position, syntax, emmetSettings);
				if (result && currentresult) {
					result.items = currentresult.items;
				}
			}
		},
		onCssPropertyValue: (context) => {
			if (context && context.propertyValue) {
				const extractedResults = extractAbbreviation(document, position);
				if (!extractedResults) {
					return;
				}
				const validAbbreviationWithColon = extractedResults.abbreviation === `${context.propertyName}:${context.propertyValue}` && onlyLetters.test(context.propertyValue);
				if (validAbbreviationWithColon // Allows abbreviations like pos:f
					|| hexColorRegex.test(extractedResults.abbreviation)
					|| extractedResults.abbreviation === '!') {
					const currentresult = doComplete(document, position, syntax, emmetSettings);
					if (result && currentresult) {
						result.items = currentresult.items;
					}
				}
			}
		},
		onHtmlContent: () => {
			const currentresult = doComplete(document, position, syntax, emmetSettings);
			if (result && currentresult) {
				result.items = currentresult.items;
			}
		}
	};
}



