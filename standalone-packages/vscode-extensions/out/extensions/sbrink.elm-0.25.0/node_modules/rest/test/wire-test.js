/*
 * Copyright 2012-2015 the original author or authors
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

	define('rest/wire-test', function (require) {

		var rest, pathPrefixInterceptor, wire;

		rest = require('rest');
		pathPrefixInterceptor = require('rest/interceptor/pathPrefix');
		wire = require('wire');

		buster.testCase('rest/wire', {
			'should use the rest factory': {
				'': function () {
					var spec, client;
					client = function (request) {
						return { request: request, status: { code: 200 }, headers: { 'Content-Type': 'application/json' }, entity: '{"foo":"bar"}' };
					};
					spec = {
						client: {
							rest: {
								parent: client,
								interceptors: [
									{ module: 'rest/interceptor/mime', config: { mime: 'application/json' } },
									{ module: 'rest/interceptor/pathPrefix', config: { prefix: 'http://example.com' } },
									{ module: 'rest/interceptor/errorCode' }
								]
							}
						},
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip().skip().skip());
						spec.client({ method: 'post', path: '/', entity: { bleep: 'bloop' } }).then(function (response) {
							assert.equals('http://example.com/', response.request.path);
							assert.equals({ foo: 'bar' }, response.entity);
							assert.equals('{"bleep":"bloop"}', response.request.entity);
							assert.equals(0, response.request.headers.Accept.indexOf('application/json'));
							assert.equals('application/json', response.request.headers['Content-Type']);
						});
					}).otherwise(fail);
				},
				'with interceptor references': function () {
					var spec, client;
					client = function (request) {
						return { request: request, status: { code: 200 }, headers: { 'Content-Type': 'application/json' }, entity: '{"foo":"bar"}' };
					};
					spec = {
						client: {
							rest: {
								parent: client,
								interceptors: [
									{ $ref: 'mime', config: { mime: 'application/json' } },
									{ $ref: 'pathPrefix', config: { prefix: 'http://example.com' } },
									{ $ref: 'errorCode' }
								]
							}
						},
						mime: { module: 'rest/interceptor/mime' },
						pathPrefix: { module: 'rest/interceptor/pathPrefix' },
						errorCode: { module: 'rest/interceptor/errorCode' },
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip().skip().skip());
						spec.client({ method: 'post', path: '/', entity: { bleep: 'bloop' } }).then(function (response) {
							assert.equals('http://example.com/', response.request.path);
							assert.equals({ foo: 'bar' }, response.entity);
							assert.equals('{"bleep":"bloop"}', response.request.entity);
							assert.equals(0, response.request.headers.Accept.indexOf('application/json'));
							assert.equals('application/json', response.request.headers['Content-Type']);
						});
					}).otherwise(fail);
				},
				'with interceptor string shortcuts': function () {
					var spec, client;
					client = function () {};
					spec = {
						client: {
							rest: {
								parent: client,
								interceptors: [
									'rest/interceptor/mime',
									'rest/interceptor/pathPrefix',
									'rest/interceptor/errorCode'
								]
							}
						},
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip().skip().skip());
					}).otherwise(fail);
				},
				'with concrete interceptors': function () {
					var spec, client;
					client = function (request) {
						return { request: request };
					};
					spec = {
						client: {
							rest: {
								parent: client,
								interceptors: [
									{ module: pathPrefixInterceptor, config: { prefix: 'thePrefix' } }
								]
							}
						},
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip());
						spec.client().then(function (response) {
							assert.equals('thePrefix', response.request.path);
						});
					}).otherwise(fail);
				},
				'using the default client': function () {
					var spec;
					spec = {
						client: {
							rest: [
								'rest/interceptor/pathPrefix'
							]
						},
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(rest, spec.client.skip());
					}).otherwise(fail);
				},
				'using a referenced parent client': function () {
					var spec, client;
					client = function (request) {
						return { request: request };
					};
					spec = {
						client: {
							rest: {
								parent: { $ref: 'parentClient' },
								interceptors: [
									{ module: 'rest/interceptor/pathPrefix' }
								]
							}
						},
						parentClient: client,
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip());
					}).otherwise(fail);
				},
				'wiring interceptor configurations': function () {
					var spec, client;
					client = function (request) {
						return { request: request };
					};
					spec = {
						client: {
							rest: {
								parent: client,
								interceptors: [
									{ module: 'rest/interceptor/pathPrefix', config: { $ref: 'basePath', prefix: 'dontUseThisOne' } }
								]
							}
						},
						basePath: {
							literal: { prefix: 'useThisOne' }
						},
						$plugins: [{ module: 'rest/wire' }]
					};
					return wire(spec, { require: require }).then(function (spec) {
						assert.same(client, spec.client.skip());
						spec.client().then(function (response) {
							assert.equals('useThisOne', response.request.path);
						});
					}).otherwise(fail);
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
