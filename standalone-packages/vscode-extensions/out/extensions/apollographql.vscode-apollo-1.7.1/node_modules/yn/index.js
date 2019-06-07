'use strict';
const lenient = require('./lenient');

module.exports = (val, opts) => {
	val = String(val).trim();
	opts = Object.assign({
		lenient: false,
		default: null
	}, opts);

	if (opts.default !== null && typeof opts.default !== 'boolean') {
		throw new TypeError(`Expected the \`default\` option to be of type \`boolean\`, got \`${typeof opts.default}\``);
	}

	if (/^(?:y|yes|true|1)$/i.test(val)) {
		return true;
	}

	if (/^(?:n|no|false|0)$/i.test(val)) {
		return false;
	}

	if (opts.lenient === true) {
		return lenient(val, opts);
	}

	return opts.default;
};
