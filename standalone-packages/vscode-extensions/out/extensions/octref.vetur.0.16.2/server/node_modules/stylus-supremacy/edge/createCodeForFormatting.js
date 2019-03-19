function createCodeForFormatting(code) {
	let lines = code.split(/\r?\n/)

	while (lines[0].trim() === '') {
		lines.shift()
	}

	const indent = (lines[0].match(/(\s|\t)+/g) || [''])[0]
	lines = lines.map(line => line.substring(indent.length))

	return lines.join('\n')
}

module.exports = createCodeForFormatting