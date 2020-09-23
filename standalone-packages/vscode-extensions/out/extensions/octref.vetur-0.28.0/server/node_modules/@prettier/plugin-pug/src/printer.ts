import { format, RequiredOptions } from 'prettier';
import {
	AndAttributesToken,
	AttributeToken,
	BlockcodeToken,
	BlockToken,
	CallToken,
	CaseToken,
	ClassToken,
	CodeToken,
	ColonToken,
	CommentToken,
	DefaultToken,
	DoctypeToken,
	DotToken,
	EachOfToken,
	EachToken,
	ElseIfToken,
	ElseToken,
	EndAttributesToken,
	EndPipelessTextToken,
	EndPugInterpolationToken,
	EosToken,
	ExtendsToken,
	FilterToken,
	IdToken,
	IfToken,
	IncludeToken,
	IndentToken,
	InterpolatedCodeToken,
	InterpolationToken,
	LexTokenType,
	MixinBlockToken,
	MixinToken,
	NewlineToken,
	OutdentToken,
	PathToken,
	SlashToken,
	StartAttributesToken,
	StartPipelessTextToken,
	StartPugInterpolationToken,
	TagToken,
	TextHtmlToken,
	TextToken,
	Token,
	WhenToken,
	WhileToken,
	YieldToken
} from 'pug-lexer';
import { DOCTYPE_SHORTCUT_REGISTRY } from './doctype-shortcut-registry';
import { createLogger, Logger, LogLevel } from './logger';
import { AttributeSeparator, resolveAttributeSeparatorOption } from './options/attribute-separator';
import { ClosingBracketPosition, resolveClosingBracketPositionOption } from './options/closing-bracket-position';
import { CommentPreserveSpaces, formatCommentPreserveSpaces } from './options/comment-preserve-spaces';
import { isAngularAction, isAngularBinding, isAngularDirective, isAngularInterpolation } from './utils/angular';
import {
	handleBracketSpacing,
	isMultilineInterpolation,
	isQuoted,
	makeString,
	previousNormalAttributeToken,
	unwrapLineFeeds
} from './utils/common';
import { isVueEventBinding, isVueExpression } from './utils/vue';

const logger: Logger = createLogger(console);
if (process.env.NODE_ENV === 'test') {
	logger.setLogLevel(LogLevel.DEBUG);
}

export interface PugPrinterOptions {
	readonly printWidth: number;
	readonly pugPrintWidth: number;
	readonly singleQuote: boolean;
	readonly pugSingleQuote: boolean;
	readonly tabWidth: number;
	readonly pugTabWidth: number;
	readonly useTabs: boolean;
	readonly pugUseTabs: boolean;
	readonly bracketSpacing: boolean;
	readonly pugBracketSpacing: boolean;
	readonly semi: boolean;
	readonly pugSemi: boolean;
	readonly attributeSeparator: AttributeSeparator;
	readonly closingBracketPosition: ClosingBracketPosition;
	readonly commentPreserveSpaces: CommentPreserveSpaces;
}

export class PugPrinter {
	private result: string = '';

	private currentIndex: number = 0;

	private readonly indentString: string;
	private indentLevel: number = 0;

	/**
	 * The line length starts by 1, it's not an zero based index
	 */
	private currentLineLength = 1;

	private readonly quotes: "'" | '"';
	private readonly otherQuotes: "'" | '"';

	private readonly alwaysUseAttributeSeparator: boolean;
	private readonly closingBracketRemainsAtNewLine: boolean;
	private readonly codeInterpolationOptions: Pick<RequiredOptions, 'singleQuote' | 'printWidth' | 'endOfLine'>;

	private possibleIdPosition: number = 0;
	private possibleClassPosition: number = 0;

	private previousAttributeRemapped: boolean = false;
	private wrapAttributes: boolean = false;

	private pipelessText: boolean = false;
	private pipelessComment: boolean = false;

	public constructor(private readonly tokens: ReadonlyArray<Token>, private readonly options: PugPrinterOptions) {
		this.indentString = options.pugUseTabs ? '\t' : ' '.repeat(options.pugTabWidth);
		this.quotes = this.options.pugSingleQuote ? "'" : '"';
		this.otherQuotes = this.options.pugSingleQuote ? '"' : "'";
		this.alwaysUseAttributeSeparator = resolveAttributeSeparatorOption(options.attributeSeparator);
		this.closingBracketRemainsAtNewLine = resolveClosingBracketPositionOption(options.closingBracketPosition);
		const codeSingleQuote = !options.pugSingleQuote;
		this.codeInterpolationOptions = {
			singleQuote: codeSingleQuote,
			printWidth: 9000,
			endOfLine: 'lf'
		};
	}

	private get previousToken(): Token | undefined {
		return this.tokens[this.currentIndex - 1];
	}

	private get nextToken(): Token | undefined {
		return this.tokens[this.currentIndex + 1];
	}

	public build(): string {
		const results: string[] = [];
		if (this.tokens[0]?.type === 'text') {
			results.push('| ');
		} else if (this.tokens[0]?.type === 'eos') {
			return '';
		}
		for (let index: number = 0; index < this.tokens.length; index++) {
			this.currentIndex = index;
			const token: Token = this.tokens[index];
			logger.debug('[PugPrinter]:', JSON.stringify(token));
			try {
				switch (token.type) {
					case 'attribute':
					case 'class':
					case 'end-attributes':
					case 'id':
					case 'eos':
						// TODO: These tokens write directly into the result
						this.result = results.join('');
						// @ts-expect-error
						this[token.type](token);
						results.length = 0;
						results.push(this.result);
						break;
					case 'tag':
					case 'start-attributes':
					case 'interpolation':
					case 'call':
					case ':':
						// TODO: These tokens read the length of the result
						this.result = results.join('');
					// eslint-disable-next-line no-fallthrough
					default:
						// @ts-expect-error
						results.push(this[token.type](token));
						break;
				}
			} catch {
				throw new Error('Unhandled token: ' + JSON.stringify(token));
			}
		}
		return results.join('');
	}

	// ##     ## ######## ##       ########  ######## ########   ######
	// ##     ## ##       ##       ##     ## ##       ##     ## ##    ##
	// ##     ## ##       ##       ##     ## ##       ##     ## ##
	// ######### ######   ##       ########  ######   ########   ######
	// ##     ## ##       ##       ##        ##       ##   ##         ##
	// ##     ## ##       ##       ##        ##       ##    ##  ##    ##
	// ##     ## ######## ######## ##        ######## ##     ##  ######

	private get computedIndent(): string {
		switch (this.previousToken?.type) {
			case 'newline':
			case 'outdent':
				return this.indentString.repeat(this.indentLevel);
			case 'indent':
				return this.indentString;
		}
		return '';
	}

	private quoteString(val: string): string {
		return `${this.quotes}${val}${this.quotes}`;
	}

	private checkTokenType(token: Token | undefined, possibilities: LexTokenType[], invert: boolean = false): boolean {
		return !!token && possibilities.includes(token.type) !== invert;
	}

	private formatDelegatePrettier(
		val: string,
		parser: '__vue_expression' | '__ng_binding' | '__ng_action' | '__ng_directive'
	): string {
		val = val.trim();
		val = val.slice(1, -1);
		val = format(val, { parser: parser as any, ...this.codeInterpolationOptions });
		val = unwrapLineFeeds(val);
		return this.quoteString(val);
	}

	private formatText(text: string): string {
		let result: string = '';
		while (text) {
			const start = text.indexOf('{{');
			if (start !== -1) {
				result += text.slice(0, start);
				text = text.slice(start + 2);
				const end = text.indexOf('}}');
				if (end !== -1) {
					let code = text.slice(0, end);
					try {
						// Index of primary quote
						const q1 = code.indexOf(this.quotes);
						// Index of secondary (other) quote
						const q2 = code.indexOf(this.otherQuotes);
						// Index of backtick
						const qb = code.indexOf('`');
						if (q1 >= 0 && q2 >= 0 && q2 > q1 && (qb < 0 || q1 < qb)) {
							logger.log({
								code,
								quotes: this.quotes,
								otherQuotes: this.otherQuotes,
								q1,
								q2,
								qb
							});
							logger.warn(
								'The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:',
								code
							);
							result += handleBracketSpacing(this.options.pugBracketSpacing, code);
							text = text.slice(end + 2);
							continue;
						} else {
							code = format(code, {
								parser: '__ng_interpolation' as any,
								...this.codeInterpolationOptions
							});
						}
					} catch (error: unknown) {
						if (typeof error === 'string') {
							if (error.includes('Unexpected token Lexer Error')) {
								if (!error.includes('Unexpected character [`]')) {
									logger.debug('[PugPrinter:formatText]: Using fallback strategy');
								}
							} else if (error.includes('Bindings cannot contain assignments')) {
								logger.warn(
									'[PugPrinter:formatText]: Bindings should not contain assignments:',
									code.trim()
								);
							} else {
								logger.warn('[PugPrinter:formatText]: ', error);
							}
							// else ignore message
						} else {
							logger.warn('[PugPrinter:formatText]: ', error);
						}
						try {
							code = format(code, {
								parser: 'babel',
								...this.codeInterpolationOptions,
								semi: false
							});
							if (code[0] === ';') {
								code = code.slice(1);
							}
						} catch (error: unknown) {
							logger.warn(error);
						}
					}
					code = unwrapLineFeeds(code);
					result += handleBracketSpacing(this.options.pugBracketSpacing, code);
					text = text.slice(end + 2);
				} else {
					result += '{{';
					result += text;
					text = '';
				}
			} else {
				result += text;
				text = '';
			}
		}
		return result;
	}

	private formatVueEventBinding(val: string): string {
		val = val.trim();
		val = val.slice(1, -1); // Remove quotes
		val = format(val, { parser: '__vue_event_binding' as any, ...this.codeInterpolationOptions });
		val = unwrapLineFeeds(val);
		if (val[val.length - 1] === ';') {
			val = val.slice(0, -1);
		}
		return this.quoteString(val);
	}

	private formatVueExpression(val: string): string {
		return this.formatDelegatePrettier(val, '__vue_expression');
	}

	private formatAngularBinding(val: string): string {
		return this.formatDelegatePrettier(val, '__ng_binding');
	}

	private formatAngularAction(val: string): string {
		return this.formatDelegatePrettier(val, '__ng_action');
	}

	private formatAngularDirective(val: string): string {
		return this.formatDelegatePrettier(val, '__ng_directive');
	}

	private formatAngularInterpolation(val: string): string {
		val = val.slice(1, -1); // Remove quotes
		val = val.slice(2, -2); // Remove braces
		val = val.trim();
		if (val.includes(`\\${this.otherQuotes}`)) {
			logger.warn(
				'The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:',
				val
			);
		} else {
			val = format(val, {
				parser: '__ng_interpolation' as any,
				...this.codeInterpolationOptions
			});
			val = unwrapLineFeeds(val);
		}
		val = handleBracketSpacing(this.options.pugBracketSpacing, val);
		return this.quoteString(val);
	}

	// ########  #######  ##    ## ######## ##    ##    ########  ########   #######   ######  ########  ######   ######   #######  ########   ######
	//    ##    ##     ## ##   ##  ##       ###   ##    ##     ## ##     ## ##     ## ##    ## ##       ##    ## ##    ## ##     ## ##     ## ##    ##
	//    ##    ##     ## ##  ##   ##       ####  ##    ##     ## ##     ## ##     ## ##       ##       ##       ##       ##     ## ##     ## ##
	//    ##    ##     ## #####    ######   ## ## ##    ########  ########  ##     ## ##       ######    ######   ######  ##     ## ########   ######
	//    ##    ##     ## ##  ##   ##       ##  ####    ##        ##   ##   ##     ## ##       ##             ##       ## ##     ## ##   ##         ##
	//    ##    ##     ## ##   ##  ##       ##   ###    ##        ##    ##  ##     ## ##    ## ##       ##    ## ##    ## ##     ## ##    ##  ##    ##
	//    ##     #######  ##    ## ######## ##    ##    ##        ##     ##  #######   ######  ########  ######   ######   #######  ##     ##  ######

	private tag(token: TagToken): string {
		let val = token.val;
		if (val === 'div' && this.nextToken && (this.nextToken.type === 'class' || this.nextToken.type === 'id')) {
			val = '';
		}
		this.currentLineLength += val.length;
		const result = `${this.computedIndent}${val}`;
		logger.debug('tag', { result, val: token.val, length: token.val.length }, this.currentLineLength);
		this.possibleIdPosition = this.result.length + result.length;
		this.possibleClassPosition = this.result.length + result.length;
		return result;
	}

	private ['start-attributes'](token: StartAttributesToken): string {
		let result = '';
		if (this.nextToken?.type === 'attribute') {
			this.previousAttributeRemapped = false;
			this.possibleClassPosition = this.result.length;
			result = '(';
			logger.debug(this.currentLineLength);
			this.currentLineLength += 1;
			let tempToken: AttributeToken | EndAttributesToken = this.nextToken;
			let tempIndex: number = this.currentIndex + 1;
			let nonPrefixAttributes = 0;
			let hasPrefixAttribute = false;
			while (tempToken.type === 'attribute') {
				switch (tempToken.name) {
					case 'class':
					case 'id': {
						hasPrefixAttribute = true;
						const val = tempToken.val.toString();
						if (isQuoted(val)) {
							this.currentLineLength -= 2;
						}
						this.currentLineLength += 1 + val.length;
						logger.debug(
							{ tokenName: tempToken.name, length: tempToken.name.length },
							this.currentLineLength
						);
						break;
					}
					default: {
						nonPrefixAttributes += 1;
						this.currentLineLength += tempToken.name.length;
						logger.debug(
							{ tokenName: tempToken.name, length: tempToken.name.length },
							this.currentLineLength
						);
						const val = tempToken.val.toString();
						if (val.length > 0 && val !== 'true') {
							this.currentLineLength += 1 + val.length;
							logger.debug({ tokenVal: val, length: val.length }, this.currentLineLength);
						}
						break;
					}
				}
				tempToken = this.tokens[++tempIndex] as AttributeToken | EndAttributesToken;
			}
			logger.debug('after token', this.currentLineLength);
			if (hasPrefixAttribute) {
				// Remove div
				if (this.previousToken?.type === 'tag' && this.previousToken.val === 'div') {
					this.currentLineLength -= 3;
				}
			}
			const hasPrefixAttributes = nonPrefixAttributes > 0;
			if (!hasPrefixAttributes) {
				// Remove leading brace
				this.currentLineLength -= 1;
			} else {
				// Attributes are separated by commas: ', '.length === 2
				this.currentLineLength += 2 * (nonPrefixAttributes - 1);

				// Add trailing brace
				this.currentLineLength += 1;
			}
			logger.debug(this.currentLineLength);
			if (this.currentLineLength > this.options.pugPrintWidth) {
				this.wrapAttributes = true;
			}
		}
		return result;
	}

	private attribute(token: AttributeToken): void {
		if (typeof token.val === 'string') {
			if (isQuoted(token.val)) {
				if (token.name === 'class') {
					// Handle class attribute
					let val = token.val;
					val = val.slice(1, -1);
					val = val.trim();
					val = val.replace(/\s\s+/g, ' ');
					const classes: string[] = val.split(' ');
					const specialClasses: string[] = [];
					const normalClasses: string[] = [];
					const validClassNameRegex: RegExp = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
					for (const className of classes) {
						if (!validClassNameRegex.test(className)) {
							specialClasses.push(className);
						} else {
							normalClasses.push(className);
						}
					}
					if (normalClasses.length > 0) {
						// Write css-class in front of attributes
						const position: number = this.possibleClassPosition;
						this.result = [
							this.result.slice(0, position),
							'.',
							normalClasses.join('.'),
							this.result.slice(position)
						].join('');
						this.possibleClassPosition += 1 + normalClasses.join('.').length;
						this.result = this.result.replace(/div\./, '.');
					}
					if (specialClasses.length > 0) {
						token.val = makeString(specialClasses.join(' '), this.quotes);
						this.previousAttributeRemapped = false;
					} else {
						this.previousAttributeRemapped = true;
						return;
					}
				} else if (token.name === 'id') {
					// Handle id attribute
					let val = token.val;
					val = val.slice(1, -1);
					val = val.trim();
					const validIdNameRegex: RegExp = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
					if (!validIdNameRegex.test(val)) {
						val = makeString(val, this.quotes);
						this.result += 'id';
						if (token.mustEscape === false) {
							this.result += '!';
						}
						this.result += `=${val}`;
						return;
					}
					// Write css-id in front of css-classes
					const position: number = this.possibleIdPosition;
					this.result = [this.result.slice(0, position), `#${val}`, this.result.slice(position)].join('');
					this.possibleClassPosition += 1 + val.length;
					this.result = this.result.replace(/div#/, '#');
					if (
						this.previousToken &&
						this.previousToken.type === 'attribute' &&
						this.previousToken.name !== 'class'
					) {
						this.previousAttributeRemapped = true;
					}
					return;
				}
			}
		}

		const hasNormalPreviousToken: AttributeToken | undefined = previousNormalAttributeToken(
			this.tokens,
			this.currentIndex
		);
		if (this.previousToken?.type === 'attribute' && (!this.previousAttributeRemapped || hasNormalPreviousToken)) {
			if (this.alwaysUseAttributeSeparator || /^(\(|\[|:).*/.test(token.name)) {
				this.result += ',';
			}
			if (!this.wrapAttributes) {
				this.result += ' ';
			}
		}
		this.previousAttributeRemapped = false;

		if (this.wrapAttributes) {
			this.result += '\n';
			this.result += this.indentString.repeat(this.indentLevel + 1);
		}

		this.result += `${token.name}`;
		if (typeof token.val === 'boolean') {
			if (token.val !== true) {
				this.result += `=${token.val}`;
			}
		} else {
			let val = token.val;
			if (isMultilineInterpolation(val)) {
				// do not reformat multiline strings surrounded by `
			} else if (isVueExpression(token.name)) {
				val = this.formatVueExpression(val);
			} else if (isVueEventBinding(token.name)) {
				val = this.formatVueEventBinding(val);
			} else if (isAngularBinding(token.name)) {
				val = this.formatAngularBinding(val);
			} else if (isAngularAction(token.name)) {
				val = this.formatAngularAction(val);
			} else if (isAngularDirective(token.name)) {
				val = this.formatAngularDirective(val);
			} else if (isAngularInterpolation(val)) {
				val = this.formatAngularInterpolation(val);
			} else if (isQuoted(val)) {
				val = makeString(val.slice(1, -1), this.quotes);
			} else if (val === 'true') {
				// The value is exactly true and is not quoted
				return;
			} else if (token.mustEscape) {
				val = format(val, {
					parser: '__js_expression' as any,
					...this.codeInterpolationOptions
				});

				const lines = val.split('\n');
				const codeIndentLevel = this.wrapAttributes ? this.indentLevel + 1 : this.indentLevel;
				if (lines.length > 1) {
					val = lines[0];
					for (let index = 1; index < lines.length; index++) {
						val += '\n';
						val += this.indentString.repeat(codeIndentLevel);
						val += lines[index];
					}
				}
			} else {
				// The value is not quoted and may be js-code
				val = val.trim();
				val = val.replace(/\s\s+/g, ' ');
				if (val[0] === '{' && val[1] === ' ') {
					val = `{${val.slice(2, val.length)}`;
				}
			}

			if (token.mustEscape === false) {
				this.result += '!';
			}

			this.result += `=${val}`;
		}
	}

	private ['end-attributes'](token: EndAttributesToken): void {
		if (this.wrapAttributes && this.result[this.result.length - 1] !== '(') {
			if (this.closingBracketRemainsAtNewLine) {
				this.result += '\n';
			}
			this.result += this.indentString.repeat(this.indentLevel);
		}
		this.wrapAttributes = false;
		if (this.result[this.result.length - 1] === '(') {
			// There were no attributes
			this.result = this.result.slice(0, -1);
		} else if (this.previousToken?.type === 'attribute') {
			if (!this.closingBracketRemainsAtNewLine) {
				this.result = this.result.trimRight();
			}
			this.result += ')';
		}
		if (this.nextToken?.type === 'text' || this.nextToken?.type === 'path') {
			this.result += ' ';
		}
	}

	private indent(token: IndentToken): string {
		const result = `\n${this.indentString.repeat(this.indentLevel)}`;
		this.currentLineLength = result.length - 1 + 1 + this.indentString.length; // -1 for \n, +1 for non zero based
		logger.debug('indent', { result, indentLevel: this.indentLevel }, this.currentLineLength);
		this.indentLevel++;
		return result;
	}

	private outdent(token: OutdentToken): string {
		let result = '';
		if (this.previousToken && this.previousToken.type !== 'outdent') {
			if (token.loc.start.line - this.previousToken.loc.end.line > 1) {
				// Insert one extra blank line
				result += '\n';
			}
			result += '\n';
		}
		this.indentLevel--;
		this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length; // -1 for \n, +1 for non zero based
		logger.debug('outdent', { result, indentLevel: this.indentLevel }, this.currentLineLength);
		return result;
	}

	private class(token: ClassToken): void {
		const val = `.${token.val}`;
		this.currentLineLength += val.length;
		logger.debug('class', { val, length: val.length }, this.currentLineLength);
		switch (this.previousToken?.type) {
			case 'newline':
			case 'outdent':
			case 'indent': {
				this.possibleIdPosition = this.result.length + this.computedIndent.length;
				const result = `${this.computedIndent}${val}`;
				this.result += result;
				this.possibleClassPosition = this.result.length;
				break;
			}
			default: {
				const prefix = this.result.slice(0, this.possibleClassPosition);
				this.result = [prefix, val, this.result.slice(this.possibleClassPosition)].join('');
				this.possibleClassPosition += val.length;
				break;
			}
		}
		if (this.nextToken?.type === 'text') {
			this.currentLineLength += 1;
			this.result += ' ';
		}
	}

	private eos(token: EosToken): void {
		// Remove all newlines at the end
		while (this.result[this.result.length - 1] === '\n') {
			this.result = this.result.slice(0, -1);
		}
		// Insert one newline
		this.result += '\n';
	}

	private comment(token: CommentToken): string {
		let result = this.computedIndent;
		if (this.checkTokenType(this.previousToken, ['newline', 'indent', 'outdent'], true)) {
			result += ' ';
		}
		result += '//';
		if (!token.buffer) {
			result += '-';
		}
		result += formatCommentPreserveSpaces(token.val, this.options.commentPreserveSpaces);
		if (this.nextToken?.type === 'start-pipeless-text') {
			this.pipelessComment = true;
		}
		return result;
	}

	private newline(token: NewlineToken): string {
		let result = '';
		if (this.previousToken && token.loc.start.line - this.previousToken.loc.end.line > 1) {
			// Insert one extra blank line
			result += '\n';
		}
		result += '\n';
		this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length; // -1 for \n, +1 for non zero based
		logger.debug('newline', { result, indentLevel: this.indentLevel }, this.currentLineLength);
		return result;
	}

	private text(token: TextToken): string {
		let result = '';
		let val = token.val;
		let needsTrailingWhitespace: boolean = false;

		if (this.pipelessText) {
			switch (this.previousToken?.type) {
				case 'newline':
					if (val.trim().length > 0) {
						result += this.indentString.repeat(this.indentLevel + 1);
					}
					break;
				case 'start-pipeless-text':
					result += this.indentString;
					break;
			}

			if (this.pipelessComment) {
				val = formatCommentPreserveSpaces(val, this.options.commentPreserveSpaces, true);
			}
		} else {
			if (this.nextToken && val[val.length - 1] === ' ') {
				switch (this.nextToken.type) {
					case 'interpolated-code':
					case 'start-pug-interpolation':
						needsTrailingWhitespace = true;
						break;
				}
			}

			val = val.replace(/\s\s+/g, ' ');

			switch (this.previousToken?.type) {
				case 'newline':
					result += this.indentString.repeat(this.indentLevel);
					if (/^ .+$/.test(val)) {
						result += '|\n';
						result += this.indentString.repeat(this.indentLevel);
					}
					result += '|';
					if (/.*\S.*/.test(token.val) || this.nextToken?.type === 'start-pug-interpolation') {
						result += ' ';
					}
					break;
				case 'indent':
					result += this.indentString;
					if (/^ .+$/.test(val)) {
						result += '|\n';
						result += this.indentString.repeat(this.indentLevel);
					}
					result += '|';
					if (/.*\S.*/.test(token.val)) {
						result += ' ';
					}
					break;
				case 'interpolated-code':
				case 'end-pug-interpolation':
					if (/^ .+$/.test(val)) {
						result += ' ';
					}
					break;
			}

			val = val.trim();
			val = this.formatText(val);
			val = val.replace(/#(\{|\[)/g, '\\#$1');
		}

		if (this.checkTokenType(this.previousToken, ['tag', 'id', 'interpolation', 'call', '&attributes', 'filter'])) {
			val = ` ${val}`;
		}

		result += val;
		if (needsTrailingWhitespace) {
			result += ' ';
		}

		return result;
	}

	private ['interpolated-code'](token: InterpolatedCodeToken): string {
		let result = '';
		switch (this.previousToken?.type) {
			case 'tag':
			case 'class':
			case 'id':
			case 'end-attributes':
				result = ' ';
				break;
			case 'start-pug-interpolation':
				result = '| ';
				break;
			case 'indent':
			case 'newline':
			case 'outdent':
				result = this.computedIndent;
				result += this.pipelessText ? this.indentString : '| ';
				break;
		}
		result += token.mustEscape ? '#' : '!';
		result += `{${token.val}}`;
		return result;
	}

	private code(token: CodeToken): string {
		let result = this.computedIndent;
		if (!token.mustEscape && token.buffer) {
			result += '!';
		}
		result += token.buffer ? '=' : '-';
		let useSemi = this.options.pugSemi;
		if (useSemi && (token.mustEscape || token.buffer)) {
			useSemi = false;
		}
		let val = token.val;
		try {
			const valBackup = val;
			val = format(val, {
				parser: 'babel',
				...this.codeInterpolationOptions,
				semi: useSemi,
				endOfLine: 'lf'
			});
			val = val.slice(0, -1);
			if (val[0] === ';') {
				val = val.slice(1);
			}
			if (val.includes('\n')) {
				val = valBackup;
			}
		} catch (error: unknown) {
			logger.warn('[PugPrinter]:', error);
		}
		result += ` ${val}`;
		return result;
	}

	private id(token: IdToken): void {
		const val = `#${token.val}`;
		this.currentLineLength += val.length;
		switch (this.previousToken?.type) {
			case 'newline':
			case 'outdent':
			case 'indent': {
				const result = `${this.computedIndent}${val}`;
				this.result += result;
				this.possibleClassPosition = this.result.length;
				break;
			}
			default: {
				const prefix = this.result.slice(0, this.possibleIdPosition);
				this.possibleClassPosition += val.length;
				this.result = [prefix, val, this.result.slice(this.possibleIdPosition)].join('');
				break;
			}
		}
	}

	private ['start-pipeless-text'](token: StartPipelessTextToken): string {
		this.pipelessText = true;
		return `\n${this.indentString.repeat(this.indentLevel)}`;
	}

	private ['end-pipeless-text'](token: EndPipelessTextToken): string {
		this.pipelessText = false;
		this.pipelessComment = false;
		return '';
	}

	private doctype(token: DoctypeToken): string {
		let result = `${this.computedIndent}doctype`;
		if (token.val) {
			result += ` ${token.val}`;
		}
		return result;
	}

	private dot(token: DotToken): string {
		return '.';
	}

	private block(token: BlockToken): string {
		let result = `${this.computedIndent}block `;
		if (token.mode !== 'replace') {
			result += `${token.mode} `;
		}
		result += token.val;
		return result;
	}

	private extends(token: ExtendsToken): string {
		return 'extends ';
	}

	private path(token: PathToken): string {
		let result = '';
		if (this.checkTokenType(this.previousToken, ['include', 'filter'])) {
			result += ' ';
		}
		result += token.val;
		return result;
	}

	private ['start-pug-interpolation'](token: StartPugInterpolationToken): string {
		let result = '';
		if (
			this.tokens[this.currentIndex - 2]?.type === 'newline' &&
			this.previousToken?.type === 'text' &&
			this.previousToken.val.trim().length === 0
		) {
			result += this.indentString.repeat(this.indentLevel + 1);
		}
		result += '#[';
		return result;
	}

	private ['end-pug-interpolation'](token: EndPugInterpolationToken): string {
		return ']';
	}

	private interpolation(token: InterpolationToken): string {
		const result = `${this.computedIndent}#{${token.val}}`;
		this.currentLineLength += result.length;
		this.possibleIdPosition = this.result.length + result.length;
		this.possibleClassPosition = this.result.length + result.length;
		return result;
	}

	private include(token: IncludeToken): string {
		return `${this.computedIndent}include`;
	}

	private filter(token: FilterToken): string {
		return `${this.computedIndent}:${token.val}`;
	}

	private call(token: CallToken): string {
		let result = `${this.computedIndent}+${token.val}`;
		let args: string | null = token.args;
		if (args) {
			args = args.trim();
			args = args.replace(/\s\s+/g, ' ');
			result += `(${args})`;
		}
		this.currentLineLength += result.length;
		this.possibleIdPosition = this.result.length + result.length;
		this.possibleClassPosition = this.result.length + result.length;
		return result;
	}

	private mixin(token: MixinToken): string {
		let result = `${this.computedIndent}mixin ${token.val}`;
		let args: string | null = token.args;
		if (args) {
			args = args.trim();
			args = args.replace(/\s\s+/g, ' ');
			result += `(${args})`;
		}
		return result;
	}

	private if(token: IfToken): string {
		let result = this.computedIndent;
		const match = /^!\((.*)\)$/.exec(token.val);
		logger.debug('[PugPrinter]:', match);
		result += !match ? `if ${token.val}` : `unless ${match[1]}`;
		return result;
	}

	private ['mixin-block'](token: MixinBlockToken): string {
		return `${this.computedIndent}block`;
	}

	private else(token: ElseToken): string {
		return `${this.computedIndent}else`;
	}

	private ['&attributes'](token: AndAttributesToken): string {
		const result = `&attributes(${token.val})`;
		this.currentLineLength += result.length;
		return result;
	}

	private ['text-html'](token: TextHtmlToken): string {
		const match: RegExpExecArray | null = /^<(.*?)>(.*)<\/(.*?)>$/.exec(token.val);
		logger.debug('[PugPrinter]:', match);
		if (match) {
			return `${this.computedIndent}${match[1]} ${match[2]}`;
		}
		const entry = Object.entries(DOCTYPE_SHORTCUT_REGISTRY).find(([key]) => key === token.val.toLowerCase());
		if (entry) {
			return `${this.computedIndent}${entry[1]}`;
		}
		return `${this.computedIndent}${token.val}`;
	}

	private each(token: EachToken): string {
		let result = `${this.computedIndent}each ${token.val}`;
		if (token.key !== null) {
			result += `, ${token.key}`;
		}
		result += ` in ${token.code}`;
		return result;
	}

	private eachOf(token: EachOfToken): string {
		let value = token.value.trim();
		value = format(value, {
			parser: 'babel',
			...this.codeInterpolationOptions,
			semi: false
		});
		if (value[0] === ';') {
			value = value.slice(1);
		}
		value = unwrapLineFeeds(value);
		const code = token.code.trim();
		return `${this.computedIndent}each ${value} of ${code}`;
	}

	private while(token: WhileToken): string {
		return `${this.computedIndent}while ${token.val}`;
	}

	private case(token: CaseToken): string {
		return `${this.computedIndent}case ${token.val}`;
	}

	private when(token: WhenToken): string {
		return `${this.computedIndent}when ${token.val}`;
	}

	private [':'](token: ColonToken): string {
		this.possibleIdPosition = this.result.length + 2;
		this.possibleClassPosition = this.result.length + 2;
		return ': ';
	}

	private default(token: DefaultToken): string {
		return `${this.computedIndent}default`;
	}

	private ['else-if'](token: ElseIfToken): string {
		return `${this.computedIndent}else if ${token.val}`;
	}

	private blockcode(token: BlockcodeToken): string {
		return `${this.computedIndent}-`;
	}

	private yield(token: YieldToken): string {
		return `${this.computedIndent}yield`;
	}

	private slash(token: SlashToken): string {
		return '/';
	}
}
