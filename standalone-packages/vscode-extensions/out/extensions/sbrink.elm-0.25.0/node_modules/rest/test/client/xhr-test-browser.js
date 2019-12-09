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

	define('rest/client/xhr-test', function (require) {

		var xhr, rest, xhrFallback, when, client;

		xhr = require('rest/client/xhr');
		rest = require('rest');
		xhrFallback = require('rest/interceptor/ie/xhr');
		when = require('when');

		// use xhrFallback when XHR is not native
		client = !XMLHttpRequest ? xhr.wrap(xhrFallback) : xhr;

		buster.testCase('rest/client/xhr', {
			'should make a GET by default': function () {
				var request = { path: '/' };
				return client(request).then(function (response) {
					var xhr, name;
					xhr = response.raw;
					assert.same(request, response.request);
					assert.equals(response.url, '/');
					assert.equals(response.request.method, 'GET');
					assert.equals(xhr.responseText, response.entity);
					assert.equals(xhr.status, response.status.code);
					assert.equals(xhr.statusText, response.status.text);
					for (name in response.headers) {
						/*jshint forin:false */
						if (!Array.isArray(response.headers[name])) {
							assert.equals(xhr.getResponseHeader(name), response.headers[name]);
						}
					}
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make an explicit GET': function () {
				var request = { path: '/', method: 'GET' };
				return client(request).then(function (response) {
					var xhr, name;
					xhr = response.raw;
					assert.same(request, response.request);
					assert.equals(response.url, '/');
					assert.equals(response.request.method, 'GET');
					assert.equals(xhr.responseText, response.entity);
					assert.equals(xhr.status, response.status.code);
					assert.equals(xhr.statusText, response.status.text);
					for (name in response.headers) {
						/*jshint forin:false */
						if (!Array.isArray(response.headers[name])) {
							assert.equals(xhr.getResponseHeader(name), response.headers[name]);
						}
					}
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make a POST with an entity': function () {
				var request = { path: '/', entity: 'hello world' };
				return client(request).then(function (response) {
					var xhr, name;
					xhr = response.raw;
					assert.same(request, response.request);
					assert.equals(response.url, '/');
					assert.equals(response.request.method, 'POST');
					assert.equals(xhr.responseText, response.entity);
					assert.equals(xhr.status, response.status.code);
					assert.equals(xhr.statusText, response.status.text);
					for (name in response.headers) {
						/*jshint forin:false */
						if (!Array.isArray(response.headers[name])) {
							assert.equals(xhr.getResponseHeader(name), response.headers[name]);
						}
					}
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make an explicit POST with an entity': function () {
				var request = { path: '/', entity: 'hello world', method: 'POST' };
				return client(request).then(function (response) {
					var xhr, name;
					xhr = response.raw;
					assert.same(request, response.request);
					assert.equals(response.url, '/');
					assert.equals(response.request.method, 'POST');
					assert.equals(xhr.responseText, response.entity);
					assert.equals(xhr.status, response.status.code);
					assert.equals(xhr.statusText, response.status.text);
					for (name in response.headers) {
						/*jshint forin:false */
						if (!Array.isArray(response.headers[name])) {
							assert.equals(xhr.getResponseHeader(name), response.headers[name]);
						}
					}
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should mixin additional properties': {
				requiresSupportFor: { timeout: XMLHttpRequest && 'timeout' in new XMLHttpRequest() },
				'': function () {
					var request = { path: '/', mixin: { timeout: 1000, foo: 'bar' } };
					return client(request).then(function (response) {
						var xhr = response.raw;
						assert.equals(xhr.timeout, 1000);
						refute.equals(xhr.foo, 'bar');
					}).otherwise(function (err) {
						fail(JSON.stringify(err));
					});
				}
			},
			'//should abort the request if canceled': function (done) {
				// TODO find an endpoint that takes a bit to respond, cached files may return synchronously
				// this test misbehavies in IE6, the response is recieved before the request can cancel
				var request = { path: '/wait/' + new Date().getTime() };
				when.all([
					client(request).then(
						fail,
						failOnThrow(function (response) {
							assert(request.canceled);
							try {
								// accessing 'status' will throw in older Firefox
								assert.same(0, response.raw.status);
							}
							catch (e) {
								// ignore
							}

							// this assertion is true in every browser except for IE 6
							// assert.same(XMLHttpRequest.UNSENT || 0, response.raw.readyState);
							assert(response.raw.readyState <= 3);
						})
					),
					when({}, function () {
						// push into when's nextTick resolution
						refute(request.canceled);
						request.cancel();
					})
				]).then(done, done);
			},
			'//should propogate request errors': function () {
				// TODO follow up with Sauce Labs
				// this test is valid, but fails with sauce as their proxy returns a 400
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
			'should reject if an XHR impl is not available': {
				requiresSupportFor: { 'no-xhr': !window.XMLHttpRequest },
				'': function () {
					var request = { path: '/' };
					return xhr(request).then(
						fail,
						failOnThrow(function (response) {
							assert.same(request, response.request);
							assert.equals(response.url, '/');
							assert.same('xhr-not-available', response.error);
						})
					);
				}
			},
			'should normalize a string to a request object': function () {
				return client('/').then(function (response) {
					assert.equals(response.url, '/');
					assert.same('/', response.request.path);
				}).otherwise(fail);
			},
			'should be the default client': function () {
				rest.resetDefaultClient();
				assert.same(xhr, rest.getDefaultClient());
			},
			'should support interceptor wrapping': function () {
				assert(typeof xhr.wrap === 'function');
			},
			'should return a ResponsePromise': function () {
				assert.isFunction(client().entity);
			},
			'should ignore a "Content-Type: multipart/form-data" header': {
				requiresSupportFor: {
					spyxhr: (function () {
						// some browsers (IE6) won't allow the XHR to be spied
						try {
							var xhr = new XMLHttpRequest();
							xhr.setRequestHeader = function () {};
							return true;
						}
						catch (e) {
							return false;
						}
					}())
				},
				'': function () {
					function XMLHttpRequestSpy() {
						var xhr = new XMLHttpRequest();
						xhr.requestHeaders = {};

						var setRequestHeader = xhr.setRequestHeader;
						xhr.setRequestHeader = function (header, value) {
							xhr.requestHeaders[header] = value;
							return setRequestHeader.apply(xhr, arguments);
						};

						return xhr;
					}

					return client({
						engine: XMLHttpRequestSpy,
						path: '/',
						headers: { 'Content-Type': 'multipart/form-data' }
					}).then(function (response) {
						refute('Content-Type' in response.raw.requestHeaders);
					});
				}
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
