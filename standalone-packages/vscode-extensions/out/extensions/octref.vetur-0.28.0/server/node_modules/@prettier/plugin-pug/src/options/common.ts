import { CATEGORY_PUG } from '.';

export const PUG_PRINT_WIDTH_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'int',
	default: -1,
	description: 'The line length where Prettier will try wrap.',
	range: { start: -1, end: Infinity, step: 1 }
};

export const PUG_SINGLE_QUOTE_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `singleQuote` value.'
		},
		{
			value: true,
			description: 'Use single quotes instead of double quotes.'
		},
		{
			// Workaround, because prettier doesn't accept just `true` as choice value in CLI
			value: 'true',
			description: 'Use single quotes instead of double quotes.'
		},
		{
			value: false,
			description: 'Use double quotes instead of double quotes.'
		}
	]
};

export const PUG_TAB_WIDTH_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'int',
	default: -1,
	description: 'Number of spaces per indentation level.',
	range: { start: -1, end: Infinity, step: 1 }
};

export const PUG_USE_TABS_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `useTabs` value.'
		},
		{
			value: true,
			description: 'Indent with tabs instead of spaces.'
		},
		{
			// Workaround, because prettier doesn't accept just `true` as choice value in CLI
			value: 'true',
			description: 'Indent with tabs instead of spaces.'
		},
		{
			value: false,
			description: 'Indent with spaces instead of tabs.'
		}
	]
};

export const PUG_BRACKET_SPACING_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `bracketSpacing` value.'
		},
		{
			value: true,
			description: 'Print spaces between brackets.'
		},
		{
			// Workaround, because prettier doesn't accept just `true` as choice value in CLI
			value: 'true',
			description: 'Print spaces between brackets.'
		},
		{
			value: false,
			description: 'Do not print spaces between brackets.'
		}
	]
};

export const PUG_SEMI_OPTION = {
	since: '1.6.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `bracketSpacing` value.'
		},
		{
			value: true,
			description: 'Print semicolons.'
		},
		{
			// Workaround, because prettier doesn't accept just `true` as choice value in CLI
			value: 'true',
			description: 'Print semicolons.'
		},
		{
			value: false,
			description: 'Do not print semicolons, except at the beginning of lines which may need them.'
		}
	]
};
