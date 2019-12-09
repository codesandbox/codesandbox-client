/*
 * Copyright 2013-2014 the original author or authors
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

	define('rest/client/xdr-test', function (require) {

		var client, rest, flickrUrl;

		client = require('rest/client/xdr');
		rest = require('rest');

		flickrUrl = 'http://api.flickr.com/services/rest/?method=flickr.test.echo&api_key=95f41bfa4faa0f43bf7c24795eabbed4&format=rest';

		buster.testCase('rest/client/xdr', {
			'': {
				requiresSupportFor: { xdr: 'XDomainRequest' in window },
				'should make a GET by default': function () {
					var request = { path: flickrUrl };
					return client(request).then(function (response) {
						assert.equals(response.url, flickrUrl);
						assert.same(request, response.request);
						assert.equals(response.request.method, 'GET');
						refute(request.canceled);
					}).otherwise(fail);
				},
				'should make an explicit GET': function () {
					var request = { path: flickrUrl, method: 'GET' };
					return client(request).then(function (response) {
						var xdr;
						xdr = response.raw;
						assert.equals(response.url, flickrUrl);
						assert.same(request, response.request);
						assert.equals(response.request.method, 'GET');
						assert.equals(xdr.responseText, response.entity);
						refute(request.canceled);
					}).otherwise(fail);
				},
				'should make a POST with an entity': function () {
					var request = { path: flickrUrl, entity: 'hello world' };
					return client(request).then(function (response) {
						var xdr;
						xdr = response.raw;
						assert.equals(response.url, flickrUrl);
						assert.same(request, response.request);
						assert.equals(response.request.method, 'POST');
						assert.equals(xdr.responseText, response.entity);
						refute(request.canceled);
					}).otherwise(fail);
				},
				'should make an explicit POST with an entity': function () {
					var request = { path: flickrUrl, entity: 'hello world', method: 'POST' };
					return client(request).then(function (response) {
						var xdr;
						xdr = response.raw;
						assert.equals(response.url, flickrUrl);
						assert.same(request, response.request);
						assert.equals(response.request.method, 'POST');
						assert.equals(xdr.responseText, response.entity);
						refute(request.canceled);
					}).otherwise(fail);
				},
				'should abort the request if canceled': function () {
					// TDOO find an endpoint that takes a bit to respond, cached files may return synchronously
					var request, response;
					request = { path: flickrUrl, params: { q: Date.now() } };
					response = client(request).then(
						fail,
						failOnThrow(function (response) {
							assert.match(response.url, flickrUrl + '&q=');
							assert(response.request.canceled);
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
							assert.equals(response.url, 'http://localhost:1234');
							assert.same('loaderror', response.error);
						})
					);
				},
				'should not make a request that has already been canceled': function () {
					var request = { canceled: true, path: '/' };
					return client(request).then(
						fail,
						failOnThrow(function (response) {
							assert.same(request, response.request);
							assert(request.canceled);
							assert.same('precanceled', response.error);
						})
					);
				},
				'should normalize a string to a request object': function () {
					return client(flickrUrl).then(function (response) {
						assert.equals(response.url, flickrUrl);
						assert.same(flickrUrl, response.request.path);
					}).otherwise(fail);
				},
				'should return a ResponsePromise': function () {
					assert.isFunction(client().entity);
				}
			},
			'should not be the default client': function () {
				rest.resetDefaultClient();
				refute.same(client, rest.getDefaultClient());
			},
			'should support interceptor wrapping': function () {
				assert(typeof client.wrap === 'function');
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
