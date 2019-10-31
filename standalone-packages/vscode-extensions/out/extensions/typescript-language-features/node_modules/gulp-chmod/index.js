'use strict';
const through = require('through2');
const deepAssign = require('deep-assign');
const Mode = require('stat-mode');

const defaultMode = 0o777 & (~process.umask());

function normalize(mode) {
	let called = false;
	const newMode = {
		owner: {},
		group: {},
		others: {}
	};

	['read', 'write', 'execute'].forEach(key => {
		if (typeof mode[key] === 'boolean') {
			newMode.owner[key] = mode[key];
			newMode.group[key] = mode[key];
			newMode.others[key] = mode[key];
			called = true;
		}
	});

	return called ? newMode : mode;
}

module.exports = (mode, dirMode) => {
	if (mode !== null && mode !== undefined && typeof mode !== 'number' && typeof mode !== 'object') {
		throw new TypeError('Expected mode to be null/undefined/number/Object');
	}

	if (dirMode === true) {
		dirMode = mode;
	}

	if (dirMode !== null && dirMode !== undefined && typeof dirMode !== 'number' && typeof dirMode !== 'object') {
		throw new TypeError('Expected dirMode to be null/undefined/true/number/Object');
	}

	return through.obj((file, enc, cb) => {
		let curMode = mode;

		if (file.isNull() && file.stat && file.stat.isDirectory()) {
			curMode = dirMode;
		}

		if (curMode === undefined || curMode === null) {
			cb(null, file);
			return;
		}

		file.stat = file.stat || {};
		file.stat.mode = file.stat.mode || defaultMode;

		if (typeof curMode === 'object') {
			const statMode = new Mode(file.stat);
			deepAssign(statMode, normalize(curMode));
			file.stat.mode = statMode.stat.mode;
		} else {
			file.stat.mode = curMode;
		}

		cb(null, file);
	});
};
