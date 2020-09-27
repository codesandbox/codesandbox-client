const _ = require('lodash')

const createComparableLines = text => text
	.replace(/\r/g, '¶')
	.replace(/\t/g, '→')
	.replace(/^\s+/gm, spaces => _.repeat('·', spaces.length))
	.split('\n')

function compareContent(actualContent, expectContent) {
	if (actualContent === expectContent) {
		return
	}

	const resultLines = createComparableLines(actualContent)
	const expectLines = createComparableLines(expectContent)

	let lineIndex = -1
	while (++lineIndex < Math.min(resultLines.length, expectLines.length)) {
		if (resultLines[lineIndex] !== expectLines[lineIndex]) {
			let markers = ''
			let charIndex = -1
			const charLimit = Math.max(resultLines[lineIndex].length, expectLines[lineIndex].length)
			while (++charIndex < charLimit) {
				if (resultLines[lineIndex][charIndex] !== expectLines[lineIndex][charIndex]) {
					markers += '^'
				} else {
					markers += ' '
				}
			}

			return [
				'The first mismatched was at line ' + (lineIndex + 1) + '.',
				'  Actual: ' + resultLines[lineIndex],
				'  Expect: ' + expectLines[lineIndex],
				'          ' + markers
			].join('\n')
		}
	}

	return 'It was not clear to show the difference.'
}

module.exports = compareContent