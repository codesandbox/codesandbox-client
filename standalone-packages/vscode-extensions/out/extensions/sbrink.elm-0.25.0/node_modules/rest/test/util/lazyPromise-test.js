/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;

	define('rest/util/lazyPromise-test', function (require) {

		var lazyPromise = require('rest/util/lazyPromise');

		buster.testCase('rest/util/lazyPromise', {
			'should not start work until a handler is attached': function () {
				var promise, spy;

				spy = this.spy(function () { return 'lazy'; });
				promise = lazyPromise(spy);

				refute.called(spy);

				return promise.then(
					function (value) {
						assert.called(spy);
						assert.equals('lazy', value);
					},
					fail
				);
			},
			'should reject if the work function throws': function () {
				var promise, spy;

				spy = this.spy(function () { throw 'lazy'; });
				promise = lazyPromise(spy);

				refute.called(spy);

				return promise.then(
					fail,
					function (value) {
						assert.called(spy);
						assert.equals('lazy', value);
					}
				);
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
