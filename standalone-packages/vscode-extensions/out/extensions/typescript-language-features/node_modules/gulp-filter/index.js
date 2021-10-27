'use strict';
const path = require('path');
const PluginError = require('plugin-error');
const multimatch = require('multimatch');
const streamfilter = require('streamfilter');

module.exports = (pattern, options) => {
	pattern = typeof pattern === 'string' ? [pattern] : pattern;
	options = options || {};

	if (!Array.isArray(pattern) && typeof pattern !== 'function') {
		throw new PluginError('gulp-filter', '`pattern` should be a string, array, or function');
	}

	return streamfilter((file, enc, cb) => {
		let match;

		if (typeof pattern === 'function') {
			match = pattern(file);
		} else {
			let relPath = path.relative(file.cwd, file.path);

			// If the path leaves the current working directory, then we need to
			// resolve the absolute path so that the path can be properly matched
			// by minimatch (via multimatch)
			if (/^\.\.[\\/]/.test(relPath)) {
				relPath = path.resolve(relPath);
			}

			match = multimatch(relPath, pattern, options).length > 0;
		}

		cb(!match);
	}, {
		objectMode: true,
		passthrough: options.passthrough !== false,
		restore: options.restore
	});
};
