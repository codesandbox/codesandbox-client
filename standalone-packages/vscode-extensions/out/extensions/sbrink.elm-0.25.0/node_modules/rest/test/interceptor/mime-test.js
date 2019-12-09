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

	define('rest/interceptor/mime-test', function (require) {

		var mime, registry, rest, when;

		mime = require('rest/interceptor/mime');
		registry = require('rest/mime/registry');
		rest = require('rest');
		when = require('when');

		buster.testCase('rest/interceptor/mime', {
			'should return the response entity decoded': function () {
				var client;

				client = mime(function () {
					return { entity: '{}', headers: { 'Content-Type': 'application/json' } };
				});

				return client({}).then(function (response) {
					assert.equals({}, response.entity);
				}).otherwise(fail);
			},
			'should encode the request entity': function () {
				var client;

				client = mime(
					function (request) {
						return { request: request, headers: {} };
					},
					{ mime: 'application/json' }
				);

				return client({ entity: {} }).then(function (response) {
					assert.equals('{}', response.request.entity);
				}).otherwise(fail);
			},
			'should encode the request entity from the Content-Type of the request, ignoring the filter config': function () {
				var client;

				client = mime(
					function (request) {
						return { request: request, headers: {} };
					},
					{ mime: 'text/plain' }
				);

				return client({ entity: {}, headers: { 'Content-Type': 'application/json' } }).then(function (response) {
					assert.equals('{}', response.request.entity);
					assert.equals('application/json', response.request.headers['Content-Type']);
					assert.equals(0, response.request.headers.Accept.indexOf('application/json'));
				}).otherwise(fail);
			},
			'should not overwrite the requests Accept header': function () {
				var client;

				client = mime(
					function (request) {
						return { request: request, headers: {} };
					},
					{ mime: 'application/json' }
				);

				return client({ entity: {}, headers: { Accept: 'foo' } }).then(function (response) {
					assert.equals('{}', response.request.entity);
					assert.equals('application/json', response.request.headers['Content-Type']);
					assert.equals('foo', response.request.headers.Accept);
				}).otherwise(fail);
			},
			'should error the request if unable to find a converter for the desired mime': function () {
				var client, request;

				client = mime();

				request = { headers: { 'Content-Type': 'application/vnd.com.example' }, entity: {} };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same('mime-unknown', response.error);
						assert.same(request, response.request);
					})
				);
			},
			'should error the request if unable to find a converter for the desired mime, unless in permissive mode': function () {
				var client, entity, request;

				client = mime(
					function (request) {
						return { request: request, headers: {} };
					},
					{ permissive: true }
				);

				entity = {};
				request = { headers: { 'Content-Type': 'application/vnd.com.example' }, entity: entity };
				return client(request).then(function (response) {
					assert.same(entity, response.request.entity);
					assert.equals('application/vnd.com.example', response.request.headers['Content-Type']);
				}).otherwise(fail);
			},
			'should use text/plain converter for a response if unable to find a converter for the desired mime': function () {
				var client;

				client = mime(function () {
					return { entity: '{}', headers: { 'Content-Type': 'application/vnd.com.example' } };
				});

				return client({}).then(function (response) {
					assert.same('{}', response.entity);
				}).otherwise(fail);
			},
			'should use the configured mime registry': function () {
				var client, converter, customRegistry;

				converter = {
					read: this.spy(function (str) {
						return 'read: ' + str;
					}),
					write: this.spy(function (obj) {
						return 'write: ' + obj.toString();
					})
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{ mime: 'application/vnd.com.example', registry: customRegistry }
				);

				return client({ entity: 'request entity' }).then(function (response) {
					assert.equals('application/vnd.com.example', response.request.headers['Content-Type']);
					assert.equals('write: request entity', response.request.entity);
					assert.equals('application/vnd.com.example', response.headers['Content-Type']);
					assert.equals('read: response entity', response.entity);

					assert.calledWith(converter.read, 'response entity', {
						client: client,
						response: response,
						mime: { raw: 'application/vnd.com.example', type: 'application/vnd.com.example', suffix: '', params: {} },
						registry: customRegistry
					});
					assert.calledWith(converter.write, 'request entity', {
						client: client,
						request: response.request,
						mime: { raw: 'application/vnd.com.example', type: 'application/vnd.com.example', suffix: '', params: {} },
						registry: customRegistry
					});
				}).otherwise(fail);
			},
			'should reject the response if the serializer fails to write the request': function () {
				var client, converter, customRegistry;

				converter = {
					read: function (str) {
						throw str;
					}
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request };
					},
					{ mime: 'application/vnd.com.example', registry: customRegistry }
				);

				return client({ entity: 'request entity' }).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.error, 'mime-serialization');
					})
				);
			},
			'should reject the response if the serializer fails to read the response': function () {
				var client, converter, customRegistry;

				converter = {
					write: function (obj) {
						throw obj;
					}
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{  registry: customRegistry }
				);

				return client({}).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.error, 'mime-deserialization');
					})
				);
			},
			'should reject the response if serializer rejects promise while reading response entity': function () {
				var client, converter, customRegistry;

				converter = {
					read: function (obj) {
						return when.reject(obj);
					}
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{  registry: customRegistry }
				);

				return client({}).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.error, 'mime-deserialization');
					})
				);
			},
			'should wait for entity to resolve before returning when serializer returns a promise while reading response entity': function () {
				var client, converter, customRegistry;

				converter = {
					read: function (obj) {
						return when(obj);
					}
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{  registry: customRegistry }
				);

				return client({}).then(function (response) {
					assert.equals('response entity', response.entity);
				}).otherwise(fail);
			},
			'should wait for entity to resolve before returning when serializer returns a promise while writing request entity': function () {
				var client, converter, customRegistry, entityToPromise;

				entityToPromise = function(obj) { return when(obj); };

				converter = {
					write: entityToPromise,
					read: entityToPromise
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{ registry: customRegistry }
				);

				return client({ entity: 'request entity' }).then(function (response) {
					assert.equals('request entity', response.request.entity);
				}).otherwise(fail);
			},
			'should reject the response if serializer rejects promise while writing request entity': function () {
				var client, converter, customRegistry;

				converter = {
					write: function (obj) {
						return when.reject(obj);
					}
				};

				customRegistry = registry.child();
				customRegistry.register('application/vnd.com.example', converter);

				client = mime(
					function (request) {
						return { request: request, headers: { 'Content-Type': 'application/vnd.com.example' }, entity: 'response entity' };
					},
					{  registry: customRegistry }
				);

				return client({ entity: 'request entity' }).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.error, 'mime-deserialization');
					})
				);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, mime().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof mime().wrap === 'function');
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
