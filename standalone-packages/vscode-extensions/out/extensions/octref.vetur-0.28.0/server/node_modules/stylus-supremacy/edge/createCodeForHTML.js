const _ = require('lodash')

function createCodeForHTML(code) {
	let temp = code
		.split(/\r?\n/)
		.map(_.escape)
		// Escape white-spaces
		.map(line => line
			.replace(/^\t+/, s => '  '.repeat(s.length))
			.replace(/^\s+/, s => '&nbsp;'.repeat(s.length))
		)
		// Wrap single-line comments
		.map(line => line.includes('//')
			? line.substring(0, line.indexOf('//')) + '<s>' + line.substring(line.indexOf('//')) + '</s>'
			: line
		)
		.join('<br>')

	// Wrap multi-line comments
	let startIndex = temp.indexOf('/*')
	let closeIndex = temp.indexOf('*/', startIndex + 2)
	while (startIndex >= 0 && startIndex < closeIndex) {
		temp = temp.substring(0, startIndex) + '<s>' + temp.substring(startIndex, closeIndex + 2) + '</s>' + temp.substring(closeIndex + 2)

		startIndex = temp.indexOf('/*', closeIndex + 2)
		closeIndex = temp.indexOf('*/', startIndex + 2)
	}

	return temp
}

module.exports = createCodeForHTML