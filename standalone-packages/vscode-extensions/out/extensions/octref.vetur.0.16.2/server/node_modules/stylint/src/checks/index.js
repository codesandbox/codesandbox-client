var stampit = require( 'stampit' )

// group together all the checks in this folder
var linterMethods = stampit().methods( {
	lintMethods: {
		blocks: require( './blocks' ),
		brackets: require( './brackets' ),
		colons: require( './colons' ),
		colors: require( './colors' ),
		commaSpace: require( './commaSpace' ),
		commentSpace: require( './commentSpace' ),
		cssLiteral: require( './cssLiteral' ),
		depthLimit: require( './depthLimit' ),
		duplicates: require( './duplicates' ),
		efficient: require( './efficient' ),
		extendPref: require( './extendPref' ),
		indentPref: require( './indentPref' ),
		leadingZero: require( './leadingZero' ),
		mixed: require( './mixed' ),
		namingConvention: require( './namingConvention' ),
		none: require( './none' ),
		noImportant: require( './noImportant' ),
		parenSpace: require( './parenSpace' ),
		placeholders: require( './placeholders' ),
		prefixVarsWithDollar: require( './prefixVarsWithDollar' ),
		quotePref: require( './quotePref' ),
		semicolons: require( './semicolons' ),
		sortOrder: require( './sortOrder' ),
		stackedProperties: require( './stackedProperties' ),
		trailingWhitespace: require( './trailingWhitespace' ),
		universal: require( './universal' ),
		valid: require( './valid' ),
		zeroUnits: require( './zeroUnits' ),
		zIndexNormalize: require( './zIndexNormalize' )
	}
} )

module.exports = linterMethods
