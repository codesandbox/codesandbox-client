const fs = require('fs')
const fp = require('path')
const ps = require('process')
const glob = require('glob')
const _ = require('lodash')
const JSON5 = require('json5')
const YAML = require('js-yaml')

const format = require('./format')
const createFormattingOptions = require('./createFormattingOptions')
const createFormattingOptionsFromStylint = require('./createFormattingOptionsFromStylint')
const checkIfFilePathIsIgnored = require('./checkIfFilePathIsIgnored')

function process(command, params = [], Console = console) {
	if (command === '--version' || command === '-v') {
		Console.log('v' + require('../package.json').version)

	} else if (command === 'format') {
		const optionFilePathParams = getParam(params, ['--options', '-p'], 1)
		const outputDirectoryParams = getParam(params, ['--outDir', '-o'], 1)
		const replaceOriginalParams = getParam(params, ['--replace', '-r'])
		const dryRunParams = getParam(params, ['--dryRun'])
		const debuggingParams = getParam(params, ['--debug', '-d'])

		const inputFiles = _.chain(params)
			.difference(optionFilePathParams, outputDirectoryParams, replaceOriginalParams)
			.map(path => glob.sync(path))
			.flatten()
			.value()
		if (inputFiles.length === 0) {
			Console.log('No input files found.')
		}

		let formattingOptions = {}
		if (optionFilePathParams.length > 0) {
			if (fs.existsSync(optionFilePathParams[1]) === false) {
				throw new Error('The given option file path did not exist.')
			}

			try {
				const fileText = fs.readFileSync(optionFilePathParams[1], 'utf8')
				if (optionFilePathParams[1].endsWith('.yaml') || optionFilePathParams[1].endsWith('.yml')) {
					formattingOptions = YAML.safeLoad(fileText, { json: true })
				} else {
					formattingOptions = JSON5.parse(fileText)
				}
			} catch (ex) {
				throw new Error('The given option file could not be parsed as JSON.')
			}

			if (fp.basename(optionFilePathParams[1]).startsWith('.stylintrc')) {
				formattingOptions = createFormattingOptionsFromStylint(formattingOptions)
			} else {
				formattingOptions = createFormattingOptions(formattingOptions)
			}
		}

		if (debuggingParams.length > 0) {
			Console.log(JSON.stringify(formattingOptions, null, '  '))
		}

		return _.chain(inputFiles)
			.reject(path => checkIfFilePathIsIgnored(path, ps.cwd(), formattingOptions))
			.map(path => {
				if (inputFiles.length > 1) {
					Console.log()
					Console.log('»', path)
				}

				try {
					const inputContent = fs.readFileSync(path, 'utf8')
					const outputContent = format(inputContent, formattingOptions)

					if (dryRunParams.length > 0) {
						// Do nothing

					} else if (outputDirectoryParams.length > 0) {
						if (fs.existsSync(fp.resolve(outputDirectoryParams[1])) === false) {
							fs.mkdirSync(fp.resolve(outputDirectoryParams[1]))
						}

						fs.writeFileSync(fp.resolve(outputDirectoryParams[1], fp.basename(path)), outputContent)

					} else if (replaceOriginalParams.length > 0) {
						if (inputContent !== outputContent) {
							fs.writeFileSync(path, outputContent)
						}

					} else {
						Console.log(outputContent)
					}

				} catch (error) {
					Console.log(error)
					return error
				}
			})
			.compact()
			.value()

	} else {
		throw new Error(`Command "${command}" was not recognized.`)
	}

	return []
}

function getParam(paramArray, names, nextValueCount = 0) {
	let paramIndex = -1
	while (++paramIndex < paramArray.length) {
		if (names.includes(paramArray[paramIndex])) {
			return [paramArray[paramIndex]].concat(paramArray.slice(paramIndex + 1).slice(0, nextValueCount))
		}
	}
	return []
}

module.exports = process
