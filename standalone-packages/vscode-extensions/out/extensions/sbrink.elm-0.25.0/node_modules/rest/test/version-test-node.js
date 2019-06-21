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

	define('rest/version-test', function (require) {

		var bowerJson, packageJson;

		bowerJson = require('rest/bower.json');
		packageJson = require('rest/package.json');

		buster.testCase('rest/version', {
			'should have the same name for package.json and bower.json': function () {
				assert.same(bowerJson.name, packageJson.name);
			},
			'should have the same version for package.json and bower.json': function () {
				assert.same(bowerJson.version, packageJson.version);
			},
			'should have the same depenencies for package.json and bpwer.json': function () {
				// this may not always hold true, but it currently does
				assert.equals(bowerJson.dependencies, packageJson.dependencies);
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
