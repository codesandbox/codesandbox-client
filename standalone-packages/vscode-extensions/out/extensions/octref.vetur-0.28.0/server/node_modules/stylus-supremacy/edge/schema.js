const sortedProperties = require('./createSortedProperties')()

module.exports = {
	insertColons: {
		description: 'Insert or remove a colon between a property name and its value.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				background red
			`
		}
	},
	insertSemicolons: {
		description: 'Insert or remove a semi-colon after a property value, a variable declaration, a variable assignment and a mixin/function call.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				background red
			`
		}
	},
	insertBraces: {
		description: 'Insert or remove a pair of curly braces where they are supposed to be. Note that this option does not affect <code>@block</code> construction, see <a class="nada" href="#option-always-use-at-block"><mark>alwaysUseAtBlock</mark></a>.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				background red
			`
		}
	},
	insertNewLineAroundImports: {
		description: 'Insert a new-line around a group of <code>@import</code>/<code>@require</code>(s).\nOnly apply to imports outside a block when set to <code>"root"</code>, or only apply to imports inside a block when set to <code>"nested"</code>.\n<span class="no-vsce">Check the detailed examples <a href="#option-insert-newline-around-any">below</a>.</span>',
		enum: [true, false, 'root', 'nested'],
		default: true,
	},
	insertNewLineAroundBlocks: {
		description: 'Insert a new-line around blocks.\nOnly apply to top-level blocks when set to <code>"root"</code>, or only apply to nested blocks when set to <code>"nested"</code>.\n<span class="no-vsce">Check the detailed examples <a href="#option-insert-newline-around-any">below</a>.</span>',
		enum: [true, false, 'root', 'nested'],
		default: true,
	},
	insertNewLineAroundProperties: {
		description: 'Insert a new-line around a group of CSS properties.\nUnlike <mark>insertNewLineAroundBlocks</mark> and <mark>insertNewLineAroundOthers</mark>, this option cannot be set to <code>"root"</code> nor <code>"nested"</code> because CSS properties cannot be placed at the top level.\n<span class="no-vsce">Check the detailed examples <a href="#option-insert-newline-around-any">below</a>.</span>',
		type: 'boolean',
		default: false,
	},
	insertNewLineAroundOthers: {
		description: 'Insert a new-line around a group of non-properties, non-imports and non-blocks.\nOnly apply to others outside a block when set to <code>"root"</code>, or only apply to others inside a block when set to <code>"nested"</code>.\n<span class="no-vsce">Check the detailed examples <a href="#option-insert-newline-around-any">below</a>.</span>',
		enum: [true, false, 'root', 'nested'],
		default: false,
	},
	insertNewLineBetweenSelectors: {
		deprecated: true,
		description: 'Insert or remove a new-line between selectors.\nPlease use <a href="#option-selector-separator">selectorSeparator</a> option instead.',
		type: 'boolean',
		default: false,
		hideInDemo: true
	},
	preserveNewLinesBetweenPropertyValues: {
		description: 'Preserve the new-lines between property values instead of flattening the lines. This also adds/keeps the colon after the property name according to Stylus syntax.',
		enum: [true, false],
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				box-shadow:
					0px 0px 5px black,
					0px 5px 1px 1px blue,
					10px 10px 0px red,
					0px 0px 0px 1px yellow inset
			`
		}
	},
	insertSpaceBeforeComment: {
		description: 'Insert or remove a white-space before a comment.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				background red//comment
			`
		}
	},
	insertSpaceAfterComment: {
		description: 'Insert or remove a white-space after a comment.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				background red//comment
			`
		}
	},
	insertSpaceAfterComma: {
		description: 'Insert or remove a white-space after a comma.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			mixin(a,b)
				margin a b
			`
		}
	},
	insertSpaceInsideParenthesis: {
		description: 'Insert or remove a white-space after an open parenthesis and before a close parenthesis.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			mixin(a,b)
				margin a b
			`
		}
	},
	insertParenthesisAfterNegation: {
		description: 'Insert a pair of parentheses or a white-space after a negation operator. This does nothing if a pair of parentheses is already after the negation operator.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				top - 10px
				left -(10px)
			`
		}
	},
	insertParenthesisAroundIfCondition: {
		description: 'Insert a pair of parentheses around <code>if</code>-condition but does not remove the existing pair of parentheses.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			if a > b
				background red
			`
		}
	},
	insertNewLineBeforeElse: {
		description: 'Insert or remove a new-line before <code>else</code> keyword.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			if (a > b)
				background red
			else
				background blue
			`
		}
	},
	insertLeadingZeroBeforeFraction: {
		description: 'Insert or remove a zero before a number that between 1 and 0.',
		type: 'boolean',
		default: true,
		example: {
			values: [true, false],
			code: `
			.class1
				margin 0.5px
			`
		}
	},
	selectorSeparator: {
		description: 'Represent a separator between selectors.\nIf the option <a href="#option-insert-new-line-between-selectors">insertNewLineBetweenSelectors</a> is set to <code>true</code>, then <code>",\\n"</code> or <code>"\\n"</code> will be used. Also <code>\\r\\n</code> may be used in place of <code>\\n</code> according to <a href="#option-new-line-char">newLineChar</a> option.',
		enum: [',', ', ', ',\n', '\n'],
		default: ', ',
		example: {
			values: [',', ', ', ',\n', '\n'],
			code: `
			.class1, .class2
				background red
			`
		}
	},
	tabStopChar: {
		description: 'Represent an indentation. You may change this to any sequence of white-spaces.',
		type: 'string',
		default: '\t',
		hideInDemo: true,
		hideInVSCE: true,
	},
	newLineChar: {
		description: 'Represent a new-line character. You may want to change this to <code>"\\r\\n"</code> for Microsoft Windows.',
		enum: ['\n', '\r\n'],
		default: '\n',
		hideInDemo: true,
		hideInVSCE: true,
	},
	quoteChar: {
		description: 'Represent a quote character that is used to begin and terminate a string. You must choose either a single-quote or a double-quote.\n' +
			'This replaces the original quote characters with the given one, unless the string contains the given quote character (see <code>font-family</code> in <code>.class2</code>.) However, if the string starts with <code>data:image/svg+xml;utf8,</code>, the given quote character will be used, and the quote characters in the string will be escaped (see <code>background-image</code> in <code>.class2</code>.)',
		enum: ['\'', '"'],
		default: '\'',
		example: {
			values: ['\'', '"'],
			code: `
			.class1
				font-family 'Open Sans'
			.class2
				font-family "Manta's Nite"
				background-image url('data:image/svg+xml;utf8,<svg fill="red"></svg>')
			`
		}
	},
	sortProperties: {
		description: 'Can be either <code>false</code> for not sorting, <code>"alphabetical"</code> for sorting CSS properties from A to Z, <code>"grouped"</code> for sorting CSS properties according to <a href="https://github.com/SimenB/stylint/blob/master/src/data/ordering.json" target="_blank">Stylint</a> and <a href="https://github.com/tj/nib/blob/master/docs/README.md" target="_blank">nib</a><span class="no-vsce"> -- <a href="#option-sort-properties-grouped" onclick="$(\'#option-sort-properties-grouped\').toggle()">click here to show the full list of sorted properties</a></span>, or an array of property names that defines the property order, for example <code>["color", "background", "display"]</code>.\n' +
			'<table id="option-sort-properties-grouped" class="no-vsce" style="display: none;"><tr><th>Sorted properties for "grouped"</th></tr>' + sortedProperties.map(prop => `<tr><td>${prop}</td></tr>`).join('') + '</table>',
		oneOf: [
			{
				enum: [
					false,
					'alphabetical',
					'grouped',
				]
			},
			{
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true
			}
		],
		default: false,
		example: {
			values: [false, 'alphabetical', 'grouped', ['color', 'background', 'display']],
			code: `
			.class1
				background red
				display block
				color white
			`
		}
	},
	alwaysUseImport: {
		description: 'Replace <code>@require</code> with <code>@import</code>, or do nothing.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			@require './file.styl'
			`
		}
	},
	alwaysUseNot: {
		description: 'Replace <code>!</code> operator with <code>not</code> keyword, or vice versa.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				if (!condition)
					background red
			`
		}
	},
	alwaysUseAtBlock: {
		description: 'Replace an increased-indent at-block construction with an explicit one with <code>@block</code> keyword or vice versa.\nNote that this option does not incorporate <a class="nada" href="#option-insert-braces"><mark>insertBraces</mark></a> option.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			block =
				background red
			`
		}
	},
	alwaysUseExtends: {
		description: 'Convert <code>@extend</code> keyword to <code>@extends</code> keyword, or vice versa.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				background red
			.class2
				@extend .class1
				color white
			`
		}
	},
	alwaysUseNoneOverZero: {
		description: 'Replace <code>0</code> (regardless of its unit) with <code>none</code> for <code>border</code> and <code>outline</code> properties, or do nothing.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				border 0px
			`
		}
	},
	alwaysUseZeroWithoutUnit: {
		description: 'Replace <code>0</code> (regardless of its unit) with <code>0</code> (without units), or do nothing.\nThere is an exception for <code>flex-basis</code>, which <code>0</code> will always have the unit of <code>%</code>, because of <a href="https://github.com/philipwalton/flexbugs#flexbug-4" target="_blank">the problem with Internet Explorer</a>.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				margin 0px
				flex-basis 0px
			`
		}
	},
	reduceMarginAndPaddingValues: {
		description: 'Reduce <code>margin</code> and <code>padding</code> duplicate values by converting <code>margin x x x x</code> to <code>margin x</code>, <code>margin x y x y</code> to <code>margin x y</code>, and <code>margin x y y y</code> to <code>margin x y y</code> where <code>x</code>, <code>y</code> is a unique property value.',
		type: 'boolean',
		default: false,
		example: {
			values: [true, false],
			code: `
			.class1
				margin 0px 0px
				padding 0px 5px 0px 5px
			`
		}
	},
	ignoreFiles: {
		description: 'Do not format the files that match the given <a href="https://www.npmjs.com/package/glob#glob-primer" target="_blank">Glob</a> patterns.\nFor example, <code>ignoreFiles: ["bin/**", "src/vendors/**"]</code>',
		type: 'array',
		items: { type: 'string' },
		default: [],
		hideInDemo: true
	}
}