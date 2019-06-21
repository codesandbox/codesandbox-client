/*
 * Copyright 2013-2014 the original author or authors
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

	define('rest/interceptor/csrf-test', function (require) {

		var csrf, rest;

		csrf = require('rest/interceptor/csrf');
		rest = require('rest');

		buster.testCase('rest/interceptor/csrf', {
			'should protect the requst from the config': function () {
				var client = csrf(
					function (request) { return { request: request }; },
					{ token: 'abc123xyz789'}
				);
				return client({}).then(function (response) {
					assert.equals('abc123xyz789', response.request.headers['X-Csrf-Token']);
				}).otherwise(fail);
			},
			'should protect the requst from the request': function () {
				var client = csrf(
					function (request) { return { request: request }; }
				);
				return client({ csrfToken: 'abc123xyz789' }).then(function (response) {
					assert.equals('abc123xyz789', response.request.headers['X-Csrf-Token']);
				}).otherwise(fail);
			},
			'should protect the requst from the config using a custom header': function () {
				var client = csrf(
					function (request) { return { request: request }; },
					{ token: 'abc123xyz789', name: 'Csrf-Token' }
				);
				return client({}).then(function (response) {
					assert.equals('abc123xyz789', response.request.headers['Csrf-Token']);
				}).otherwise(fail);
			},
			'should protect the requst from the request using a custom header': function () {
				var client = csrf(
					function (request) { return { request: request }; }
				);
				return client({ csrfToken: 'abc123xyz789', csrfTokenName: 'Csrf-Token' }).then(function (response) {
					assert.equals('abc123xyz789', response.request.headers['Csrf-Token']);
				}).otherwise(fail);
			},
			'should not protect without a token': function () {
				var client = csrf(
					function (request) { return { request: request }; }
				);
				return client({}).then(function (response) {
					refute.defined(response.request.headers['X-Csrf-Token']);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, csrf().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof csrf().wrap === 'function');
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
