const _ = require('lodash')
const schema = require('./schema')

function createFormattingOptions(options = {}) {
	if (_.isEmpty(options)) {
		return _.reduce(schema, (hash, info, name) => {
			hash[name] = info.default
			return hash
		}, {})

	} else {
		return _.reduce(schema, (hash, info, name) => {
			try {
				// Support "stylusSupremacy." prefix for Visual Studio Code setting compatibility since v2.4
				const data = options['stylusSupremacy.' + name] !== undefined ? options['stylusSupremacy.' + name] : options[name]

				if (data === undefined) {
					hash[name] = info.default

				} else if (verify(data, info)) {
					hash[name] = data
				}
			} catch (ex) {
				throw new Error(ex.message + ` at "${name}".`)
			}
			return hash
		}, {})
	}
}

function verify(data, info) {
	if (_.some(info.enum)) {
		return _.some(info.enum, item => {
			if (_.isObject(item)) {
				return verify(data, item)
			} else {
				return data === item
			}
		})

	} else if (info.oneOf !== undefined) {
		const matchAnyValue = info.oneOf.some(item => {
			if (_.isObject(item)) {
				try {
					return verify(data, item)
				} catch (ex) {
					return false
				}
			} else {
				return item === data
			}
		})
		if (matchAnyValue === false) {
			throw new Error(`Expected ${data} to be one of the defined values`)
		}

	} else if (info.type === 'integer') {
		if (_.isInteger(data) === false) {
			throw new Error(`Expected ${data} to be an integer`)
		} else if (info.minimum !== undefined && data < info.minimum) {
			throw new Error(`Expected ${data} to be greater or equal than ${info.minimum}`)
		} else if (info.maximum !== undefined && data > info.maximum) {
			throw new Error(`Expected ${data} to be less or equal than ${info.maximum}`)
		}

	} else if (info.type === 'array') {
		if (_.isArray(data) === false) {
			throw new Error(`Expected ${data} to be an array`)
		} else if (info.items !== undefined && _.some(data, item => verify(item, info.items) === false)) {
			throw new Error(`Expected ${data} to have items of ${JSON.stringify(info.items)}`)
		} else if (info.uniqueItems === true && _.size(data) !== _.uniq(data).length) {
			throw new Error(`Expected ${data} to have unique items`)
		}

	} else if (info.type === 'null') {
		if (data !== null) {
			throw new Error(`Expected ${data} to be null`)
		}

	} else if (info.type !== typeof data) { // 'boolean', 'string', 'number', 'object'
		throw new Error(`Expected ${data} to be ${info.type}`)
	}

	return true
}

module.exports = createFormattingOptions