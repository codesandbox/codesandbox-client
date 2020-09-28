import { CATEGORY_PUG } from '.';

export const COMMENT_PRESERVE_SPACES_OPTION = {
	since: '1.1.0',
	category: CATEGORY_PUG,
	type: 'choice',
	default: 'keep-all',
	description: 'Change behavior of spaces within comments.',
	choices: [
		{
			value: 'keep-all',
			description: 'Keep all spaces within comments. Example: `//    this  is   a   comment`'
		},
		{
			value: 'keep-leading',
			description: 'Keep leading spaces within comments. Example: `//    this is a comment`'
		},
		{
			value: 'trim-all',
			description: 'Trim all spaces within comments. Example: `// this is a comment`'
		}
	]
};

export const PUG_COMMENT_PRESERVE_SPACES_OPTION = {
	...COMMENT_PRESERVE_SPACES_OPTION,
	since: '1.6.0',
	default: null,
	choices: [
		{
			value: null,
			description: 'Use `commentPreserveSpaces` value.'
		},
		{
			value: 'keep-all',
			description: 'Keep all spaces within comments. Example: `//    this  is   a   comment`'
		},
		{
			value: 'keep-leading',
			description: 'Keep leading spaces within comments. Example: `//    this is a comment`'
		},
		{
			value: 'trim-all',
			description: 'Trim all spaces within comments. Example: `// this is a comment`'
		}
	]
};

export type CommentPreserveSpaces = 'keep-all' | 'keep-leading' | 'trim-all';

export function formatCommentPreserveSpaces(
	input: string,
	commentPreserveSpaces: CommentPreserveSpaces,
	pipeless: boolean = false
): string {
	switch (commentPreserveSpaces) {
		case 'keep-leading': {
			let result: string = '';
			let firstNonSpace = 0;
			for (firstNonSpace; firstNonSpace < input.length && input[firstNonSpace] === ' '; firstNonSpace++) {
				result += ' ';
			}
			result += input.slice(firstNonSpace).trim().replace(/\s\s+/g, ' ');
			return result;
		}
		case 'trim-all': {
			let result: string = input.trim();
			result = result.replace(/\s\s+/g, ' ');
			if (!pipeless && input[0] === ' ') {
				result = ` ${result}`;
			}
			return result;
		}
		case 'keep-all':
		default:
			// Don't touch comment
			return input;
	}
}
