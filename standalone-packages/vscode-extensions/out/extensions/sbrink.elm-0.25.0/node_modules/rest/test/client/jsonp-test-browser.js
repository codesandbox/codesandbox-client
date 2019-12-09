/*
 * Copyright 2012-2014 the original author or authors
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

	define('rest/client/jsonp-test', function (require) {

		var client, jsonpInterceptor, rest;

		client = require('rest/client/jsonp');
		jsonpInterceptor = require('rest/interceptor/jsonp');
		rest = require('rest');

		buster.testCase('rest/client/jsonp', {
			'should make a cross origin request': function () {
				var request = { path: 'https://api.github.com/' };
				return client(request).then(function (response) {
					assert.match(response.url, 'https://api.github.com/?callback=');
					assert(response.entity.data);
					assert.same(request, response.request);
					refute(request.canceled);
					refute(response.raw.parentNode);
				}).otherwise(fail);
			},
			'should use the jsonp client from the jsonp interceptor by default': function () {
				var request = { path: '/test/client/fixtures/data.js', callback: { name: 'callback' } };
				return jsonpInterceptor()(request).then(function (response) {
					assert.match(response.url, '/test/client/fixtures/data.js?callback=callback');
					assert(response.entity.data);
					assert.same(request, response.request);
					refute(request.canceled);
					refute(response.raw.parentNode);
				}).otherwise(fail);
			},
			'should abort the request if canceled': function () {
				var request, response;
				request = { path: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0', params: { q: 'jsonp' } };
				response = client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.match(response.url, 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=jsonp&callback=');
						assert.same(request, response.request);
						assert(request.canceled);
						refute(response.raw.parentNode);
					})
				);
				refute(request.canceled);
				request.cancel();
				return response;
			},
			'should propogate request errors': function () {
				var request = { path: 'http://localhost:1234' };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.match(response.url, 'http://localhost:1234?callback=');
						assert.same('loaderror', response.error);
					})
				);
			},
			'should not make a request that has already been canceled': function () {
				var request = { canceled: true, path: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0', params: { q: 'html5' } };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert(request.canceled);
						assert.same('precanceled', response.error);
					})
				);
			},
			'should error if callback not invoked': function () {
				var request = { path: '/test/client/fixtures/noop.js' };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.match(response.url, '/test/client/fixtures/noop.js?callback=');
						assert.same('loaderror', response.error);
					})
				);
			},
			'should error if script throws': function () {
				var request = { path: '/test/client/fixtures/throw.js' };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.match(response.url, '/test/client/fixtures/throw.js?callback=');
						assert.same('loaderror', response.error);
					})
				);
			},
			'should normalize a string to a request object': function () {
				var request = 'https://api.github.com/';
				return client(request).then(function (response) {
					assert.match(response.url, 'https://api.github.com/?callback=');
					assert.same(request, response.request.path);
				}).otherwise(fail);
			},
			'should not be the default client': function () {
				rest.resetDefaultClient();
				refute.same(client, rest.getDefaultClient());
			},
			'should support interceptor wrapping': function () {
				assert(typeof client.wrap === 'function');
			},
			'should return a ResponsePromise': function () {
				var response = client();
				response.otherwise(function () {});
				assert.isFunction(response.entity);
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
