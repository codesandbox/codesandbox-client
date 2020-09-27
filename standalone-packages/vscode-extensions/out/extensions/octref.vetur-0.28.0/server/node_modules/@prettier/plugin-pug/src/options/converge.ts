import { ParserOptions } from 'prettier';
import { PugParserOptions } from '.';
import { PugPrinterOptions } from '../printer';

export function convergeOptions(options: ParserOptions & PugParserOptions): PugPrinterOptions {
	return {
		printWidth: options.printWidth,
		pugPrintWidth: options.pugPrintWidth !== -1 ? options.pugPrintWidth : options.printWidth,
		singleQuote: options.singleQuote,
		pugSingleQuote: options.pugSingleQuote ?? options.singleQuote,
		tabWidth: options.tabWidth,
		pugTabWidth: options.pugTabWidth !== -1 ? options.pugTabWidth : options.tabWidth,
		useTabs: options.useTabs,
		pugUseTabs: options.pugUseTabs ?? options.useTabs,
		bracketSpacing: options.bracketSpacing,
		pugBracketSpacing: options.pugBracketSpacing ?? options.bracketSpacing,
		semi: options.semi,
		pugSemi: options.pugSemi ?? options.semi,
		attributeSeparator: options.pugAttributeSeparator ?? options.attributeSeparator,
		closingBracketPosition: options.pugClosingBracketPosition ?? options.closingBracketPosition,
		commentPreserveSpaces: options.pugCommentPreserveSpaces ?? options.commentPreserveSpaces
	};
}
