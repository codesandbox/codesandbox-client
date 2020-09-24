const fs = require('fs')
const _ = require('lodash')

const schema = require('./schema')
const createFormattingOptions = require('./createFormattingOptions')

const filePath = 'edge/index.d.ts'
let content = fs.readFileSync(filePath, 'utf-8')

const lines = content.split('\n')
const begin = _.findIndex(lines, line => line === '\texport interface FormattingOptions {')
const final = _.findIndex(lines, line => line === '\t}', begin + 1)

if (begin === -1 || final === -1) {
	throw new Error(`Could not find "FormattingOptions" interface in ${filePath}.`)
}

const formattingOptionDefinition = _.chain(schema)
	.map((info, name) => '\t\t' + name + '?: ' + getType(info))
	.value()

content = _.concat(
	lines.slice(0, begin + 1),
	formattingOptionDefinition,
	lines.slice(final)
).join('\n')

fs.writeFileSync(filePath, content)

function getType(info) {
	if (info.type === 'integer') {
		return 'number'

	} else if (info.type === 'array') {
		return info.items.type + '[]'
		
	} else if (info.enum) {
		return _.chain(info.enum)
			.map(item => typeof item)
			.uniq()
			.value()
			.join(' | ')

	} else if (info.oneOf) {
		return _.chain(info.oneOf)
			.map(item => getType(item))
			.flatten()
			.uniq()
			.value()
			.join(' | ')

	} else {
		return info.type || 'any'
	}
}