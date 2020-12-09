import { CATEGORY_PUG } from '.';

export const CLOSING_BRACKET_POSITION_OPTION = {
	since: '1.3.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: 'new-line',
	description: 'Determines position of closing bracket which wraps attributes.',
	choices: [
		{
			value: 'new-line',
			description: `
				Closing bracket ends with a new line.
				Example:
				input(
					type='text',
					value='my_value',
					name='my_name',
					alt='my_alt',
					autocomplete='on'
				)
				`
		},
		{
			value: 'last-line',
			description: `
			Closing bracket remains with last attribute's line.
			Example:
			input(
				type='text',
				value='my_value',
				name='my_name',
				alt='my_alt',
				autocomplete='on')
			`
		}
	]
};

export const PUG_CLOSING_BRACKET_POSITION_OPTION = {
	...CLOSING_BRACKET_POSITION_OPTION,
	since: '1.6.0',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `closingBracketPosition` value.'
		},
		{
			value: 'new-line',
			description: `
				Closing bracket ends with a new line.
				Example:
				input(
					type='text',
					value='my_value',
					name='my_name',
					alt='my_alt',
					autocomplete='on'
				)
				`
		},
		{
			value: 'last-line',
			description: `
			Closing bracket remains with last attribute's line.
			Example:
			input(
				type='text',
				value='my_value',
				name='my_name',
				alt='my_alt',
				autocomplete='on')
			`
		}
	]
};

export type ClosingBracketPosition = 'new-line' | 'last-line';

export function resolveClosingBracketPositionOption(closingBracketPosition: ClosingBracketPosition): boolean {
	switch (closingBracketPosition) {
		case 'new-line':
			return true;
		case 'last-line':
			return false;
	}
	throw new Error(
		`Invalid option for pug closingBracketPosition. Found '${closingBracketPosition}'. Possible options: 'new-line' or 'last-line'`
	);
}
