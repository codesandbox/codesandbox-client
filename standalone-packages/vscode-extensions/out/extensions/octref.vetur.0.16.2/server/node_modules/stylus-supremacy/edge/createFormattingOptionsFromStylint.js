const _ = require('lodash')
const schema = require('./schema')

const createAdapterForAlwaysNeverFalse = value => (value === 'always' || value === 'never') ? value === 'always' : undefined

const stylintOptionMap = {
	blocks: ['alwaysUseAtBlock', createAdapterForAlwaysNeverFalse],
	brackets: ['insertBraces', createAdapterForAlwaysNeverFalse],
	colons: ['insertColons', createAdapterForAlwaysNeverFalse],
	commaSpace: ['insertSpaceAfterComma', createAdapterForAlwaysNeverFalse],
	commentSpace: ['insertSpaceAfterComment', createAdapterForAlwaysNeverFalse],
	efficient: ['reduceMarginAndPaddingValues', createAdapterForAlwaysNeverFalse],
	exclude: ['ignoreFiles', value => value],
	extendPref: ['alwaysUseExtends', value => value === '@extends'],
	indentPref: ['tabStopChar', value => value > 0 ? _.repeat(' ', value) : undefined],
	leadingZero: ['insertLeadingZeroBeforeFraction', createAdapterForAlwaysNeverFalse],
	parenSpace: ['insertSpaceInsideParenthesis', createAdapterForAlwaysNeverFalse],
	quotePref: ['quoteChar', value => (value === 'single' && '\'' || value === 'double' && '"' || undefined)],
	semicolons: ['insertSemicolons', createAdapterForAlwaysNeverFalse],
	sortOrder: ['sortProperties', value => value, 'insertNewLineAroundProperties', value => value === 'grouped' ? true : undefined],
	none: ['alwaysUseNoneOverZero', createAdapterForAlwaysNeverFalse],
	zeroUnits: ['alwaysUseZeroWithoutUnit', value => value === false ? undefined : value === 'never'],
}

const usedFormattingOptionNames = _.chain(stylintOptionMap)
	.values()
	.flatten()
	.chunk(2)
	.map('0')
	.flatten()
	.value()

const complementaryOptionMap = _.chain(schema)
	.keys()
	.difference(usedFormattingOptionNames) // Prevent conflicts by removing the formatting options that can be specified via Stylint above
	.reduce((hash, name) => {
		hash['stylusSupremacy.' + name] = [name, _.identity]
		return hash
	}, {})
	.value()

const universalOptionMap = _.assign({}, stylintOptionMap, complementaryOptionMap)

function createFormattingOptionsFromStylint(stylintOptions = {}) {
	return _.chain(stylintOptions)
		.omitBy((rule, name) => universalOptionMap[name] === undefined)
		.reduce((hash, rule, name) => {
			const value = _.isObject(rule) && rule.expect !== undefined ? rule.expect : rule

			_.chunk(universalOptionMap[name], 2).forEach(pair => {
				const result = pair[1](value)
				if (result !== undefined) {
					hash['stylusSupremacy.' + pair[0]] = result
				}
			})

			return hash
		}, {})
		.value()
}

createFormattingOptionsFromStylint.map = stylintOptionMap

module.exports = createFormattingOptionsFromStylint