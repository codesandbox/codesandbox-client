/*
 * Copyright 2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, failOnThrow;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/client-test', function (require) {

		var client, rest, interceptor, defaultClient, skippableClient, defaultInterceptor;

		client = require('rest/client');
		rest = require('rest/client/default');
		interceptor = require('rest/interceptor');

		buster.testCase('rest/client', {
			'setUp': function () {
				defaultClient = client(function (request) {
					return { request: request, id: 'default' };
				});
				skippableClient = client(function (request) {
					return { request: request, id: 'default' };
				}, rest);
				defaultInterceptor = interceptor();
			},

			'should wrap the client with an interceptor': function () {
				assert(typeof defaultClient.wrap(defaultInterceptor) === 'function');
			},
			'should continue to support chain as a alias for wrap': function () {
				var config = {};
				this.spy(defaultClient, 'wrap');
				defaultClient.chain(defaultInterceptor, config);
				assert.calledWith(defaultClient.wrap, defaultInterceptor, config);
				defaultClient.wrap.restore();
			},
			'should return the next client in the chain': function () {
				assert.same(rest, skippableClient.skip());
				refute(defaultClient.skip);
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
