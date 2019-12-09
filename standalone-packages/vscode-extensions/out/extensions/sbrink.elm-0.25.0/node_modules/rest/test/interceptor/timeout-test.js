/*
 * Copyright 2012-2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, failOnThrow;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/interceptor/timeout-test', function (require) {

		var timeout, rest, when;

		timeout = require('rest/interceptor/timeout');
		rest = require('rest');
		when = require('when');

		function hangClient(/* request */) {
			return when.defer().promise;
		}

		function immediateClient(request) {
			return { request: request };
		}

		function delayedClient(request) {
			return when({ request: request }).delay(50);
		}

		function cancelableClient(request) {
			/*jshint validthis:true */
			var d = when.defer();
			request.canceled = false;
			request.cancel = this.spy(function () {
				request.canceled = true;
				d.resolver.reject({ request: request });
			});
			return d.promise;
		}

		buster.testCase('rest/interceptor/timeout', {
			'should resolve if client responds immediately': function () {
				var client, request;
				client = timeout(immediateClient, { timeout: 20 });
				request = {};
				return client(request).then(function (response) {
					assert.same(request, response.request);
					refute(response.error);
					return when().delay(40).then(function () {
						// delay to make sure timeout has fired, but not rejected the response
						refute(request.canceled);
					});
				}).otherwise(fail);
			},
			'should resolve if client responds before timeout': function () {
				var client, request;
				client = timeout(delayedClient, { timeout: 100 });
				request = {};
				return client(request).then(function (response) {
					assert.same(request, response.request);
					refute(response.error);
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should reject even if client responds after timeout': function () {
				var client, request;
				client = timeout(delayedClient, { timeout: 10 });
				request = {};
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert.equals('timeout', response.error);
						assert(request.canceled);
					})
				);
			},
			'should reject if client hanges': function () {
				var client, request;
				client = timeout(hangClient, { timeout: 50 });
				request = {};
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert.equals('timeout', response.error);
						assert(request.canceled);
					})
				);
			},
			'should use request timeout value in perference to interceptor value': function () {
				var client, request;
				client = timeout(delayedClient, { timeout: 10 });
				request = { timeout: 0 };
				return client(request).then(function (response) {
					assert.same(request, response.request);
					refute(response.error);
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should not reject without a configured timeout value': function () {
				var client, request;
				client = timeout(delayedClient);
				request = {};
				return client(request).then(function (response) {
					assert.same(request, response.request);
					refute(response.error);
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should cancel request if client support cancelation': function () {
				var client, request, response;
				client = timeout(cancelableClient.bind(this), { timeout: 11 });
				request = {};
				response = client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert.equals('timeout', response.error);
						assert.called(request.cancel);
						assert(request.canceled);
					})
				);
				refute(request.canceled);
				return response;
			},
			'should not cancel request if transient config enabled': function () {
				var client, request, response;
				client = timeout(cancelableClient.bind(this), { timeout: 11, transient: true });
				request = {};
				response = client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert.equals('timeout', response.error);
						assert.called(request.cancel);
						refute(request.canceled);
					})
				);
				refute(request.canceled);
				return response;
			},
			'should use request transient value rather then interceptor': function () {
				var client, request, response;
				client = timeout(cancelableClient.bind(this), { timeout: 11, transient: false });
				request = { transient: true };
				response = client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert.equals('timeout', response.error);
						assert.called(request.cancel);
						refute(request.canceled);
					})
				);
				refute(request.canceled);
				return response;
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, timeout().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof timeout().wrap === 'function');
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
