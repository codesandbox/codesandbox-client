/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/mime/type/text/plain-test', function (require) {

		var plain = require('rest/mime/type/text/plain');

		buster.testCase('rest/mime/type/text/plain', {
			'should not change when writing string values': function () {
				assert.equals('7', plain.write('7'));
			},
			'should use the string representation for reading non-string values': function () {
				assert.equals('7', plain.write(7));
			},
			'should not change when reading string values': function () {
				assert.equals('7', plain.read('7'));
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
