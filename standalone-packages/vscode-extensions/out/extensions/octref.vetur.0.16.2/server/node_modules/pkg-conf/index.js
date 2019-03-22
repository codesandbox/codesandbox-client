'use strict';
var findUp = require('find-up');
var loadJsonFile = require('load-json-file');
var objectAssign = require('object-assign');
var Symbol = require('symbol');
var fpSymbol = Symbol('package.json filepath');

function addFp(x, fp) {
	x[fpSymbol] = fp;
	return x;
}

module.exports = function (namespace, opts) {
	// legacy
	if (typeof opts === 'string') {
		opts = {cwd: opts};
	}

	opts = opts || {};

	return findUp('package.json', {cwd: opts.cwd})
		.then(function (fp) {
			if (!namespace) {
				throw new TypeError('Expected a namespace');
			}

			if (!fp) {
				return addFp(objectAssign({}, opts.defaults), fp);
			}

			return loadJsonFile(fp).then(function (pkg) {
				return addFp(objectAssign({}, opts.defaults, pkg[namespace]), fp);
			});
		});
};

module.exports.sync = function (namespace, opts) {
	if (!namespace) {
		throw new TypeError('Expected a namespace');
	}

	// legacy
	if (typeof opts === 'string') {
		opts = {cwd: opts};
	}

	opts = opts || {};

	var fp = findUp.sync('package.json', {cwd: opts.cwd});

	if (!fp) {
		return addFp(objectAssign({}, opts.defaults), fp);
	}

	var pkg = loadJsonFile.sync(fp);

	return addFp(objectAssign({}, opts.defaults, pkg[namespace]), fp);
};

module.exports.filepath = function (conf) {
	return conf[fpSymbol];
};
