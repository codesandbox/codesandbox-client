/**
 * default configuration object
 * this is what the linter will run when no config file is passed
 */
var config = {
	// check for @block when defining blocks
	blocks: false,
	// check for { or }, unless used in a hash
	brackets: 'never',
	// enforce or disallow colons
	colons: 'always',
	// check for hex colors used without variables
	colors: 'always',
	// check for spaces after commas (0, 0, 0, .18)
	commaSpace: 'always',
	// check for space after line comment
	commentSpace: 'always',
	// if never disallow css literals
	cssLiteral: 'never',
	// set a maximum selector depth (dont nest more than 4 deep)
	depthLimit: false,
	// check if properties or selectors are duplicate
	duplicates: true,
	// check for margin 0 0 0 0 and recommend margin 0
	efficient: 'always',
	// prefer a specific syntax when using @extends (or @extend)
	extendPref: false,
	// throw duplicate selector warning across all files instead of curr file
	globalDupe: false,
	// group reporter output by file or go sequentially
	groupOutputByFile: true,
	// manipulate terminal output with or without an additional reporter
	reporterOptions: {
		columns: ['lineData', 'severity', 'description', 'rule'],
		columnSplitter: '  ',
		showHeaders: false,
		truncate: true
	},
	// how many spaces should we prefer when indenting, pass in false if hard tabs
	indentPref: false,
	// enforce or disallow leading zeroes
	leadingZero: 'never',
	// exit if over error limit
	maxErrors: false,
	// exit if over warning limit
	maxWarnings: false,
	// check for mixed spaces and tabs
	mixed: false,
	// lowercase-dash, camelCase, lowercase_underscore, BEM or false (dont check)
	namingConvention: false,
	// if true, then check classes and ids, if false just check variables
	namingConventionStrict: false,
	// check for use of border none or outline none, prefer 0
	none: 'never',
	// disallow !importants
	noImportant: true,
	// check for extra space inside parens
	parenSpace: false,
	// only allow @extending of placeholder vars
	placeholders: 'always',
	// check for $ when declaring vars (doesnt check use)
	prefixVarsWithDollar: 'always',
	// single or double quotes, or false to not check
	quotePref: false,
	// default reporter
	reporter: '../core/reporter',
	// disallow or enforce semicolons
	semicolons: 'never',
	// alphabetical, grouped, Array<String> or false (no check)
	sortOrder: 'alphabetical',
	// no one liners
	stackedProperties: 'never',
	// check for trailing whitespace
	trailingWhitespace: 'never',
	// check for use of * and recommend against it
	universal: false,
	// check if prop or value is a valid assignment
	valid: true,
	// check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
	zeroUnits: 'never',
	// suggest a normalized z index value, base of whatever this is
	zIndexNormalize: false
}

module.exports = config
