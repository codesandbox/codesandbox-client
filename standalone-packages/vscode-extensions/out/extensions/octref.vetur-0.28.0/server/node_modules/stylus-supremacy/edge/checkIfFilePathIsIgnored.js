const fp = require('path')
const minimatch = require('minimatch')

function checkIfFilePathIsIgnored(filePath, rootPath, formattingOptions) {
	if (!formattingOptions.ignoreFiles) {
		return false
	}

	const fullPath = fp.isAbsolute(filePath) ? filePath : fp.join(rootPath, filePath)
	const relaPath = fullPath.substring(rootPath.length).replace(/\\/g, '/').replace(/^\//, '')
	return formattingOptions.ignoreFiles.some(pattern => minimatch(relaPath, pattern))
}

module.exports = checkIfFilePathIsIgnored
