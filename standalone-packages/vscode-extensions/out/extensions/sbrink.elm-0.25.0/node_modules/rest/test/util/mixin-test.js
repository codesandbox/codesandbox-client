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

	define('rest/util/mixin-test', function (require) {

		var mixin = require('rest/util/mixin');

		buster.testCase('rest/util/mixin', {
			'should return an emtpy object for no args': function () {
				var mixed, prop;
				mixed = mixin();
				assert(mixed);
				for (prop in mixed) {
					/*jshint forin:false */
					refute(mixed.hasOwnProperty(prop));
				}
			},
			'should return original object': function () {
				var orig, mixed;
				orig = { foo: 'bar' };
				mixed = mixin(orig);
				assert.same(orig, mixed);
			},
			'should return original object, supplemented': function () {
				var orig, supplemented, mixed;
				orig = { foo: 'bar' };
				supplemented = { foo: 'foo' };
				mixed = mixin(orig, supplemented);
				assert.same(orig, mixed);
				assert.equals('foo', mixed.foo);
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
