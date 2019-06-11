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

	define('rest/util/normalizeHeaderName-test', function (require) {

		var normalizeHeaderName = require('rest/util/normalizeHeaderName');

		buster.testCase('rest/util/normalizeHeaderName', {
			'should normalize header names': function () {
				assert.equals('Accept', normalizeHeaderName('accept'));
				assert.equals('Accept', normalizeHeaderName('ACCEPT'));
				assert.equals('Content-Length', normalizeHeaderName('content-length'));
				assert.equals('X-Some-Custom-Header', normalizeHeaderName('x-some-custom-header'));
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
