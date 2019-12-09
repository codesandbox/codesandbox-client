/*
 * Copyright 2012-2014 the original author or authors
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

	define('rest/interceptor/basicAuth-test', function (require) {

		var basicAuth, rest;

		basicAuth = require('rest/interceptor/basicAuth');
		rest = require('rest');

		buster.testCase('rest/interceptor/basicAuth', {
			'should authenticate the requst from the config': function () {
				var client = basicAuth(
					function (request) { return { request: request }; },
					{ username: 'user', password: 'pass'}
				);
				return client({}).then(function (response) {
					assert.equals('Basic dXNlcjpwYXNz', response.request.headers.Authorization);
				}).otherwise(fail);
			},
			'should authenticate the requst from the request': function () {
				var client = basicAuth(
					function (request) { return { request: request }; }
				);
				return client({ username: 'user', password: 'pass'}).then(function (response) {
					assert.equals('Basic dXNlcjpwYXNz', response.request.headers.Authorization);
				}).otherwise(fail);
			},
			'should not authenticate without a username': function () {
				var client = basicAuth(
					function (request) { return { request: request }; }
				);
				return client({}).then(function (response) {
					refute.defined(response.request.headers.Authorization);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, basicAuth().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof basicAuth().wrap === 'function');
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
