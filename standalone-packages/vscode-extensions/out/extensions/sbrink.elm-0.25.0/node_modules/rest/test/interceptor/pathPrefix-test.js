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

	define('rest/interceptor/pathPrefix-test', function (require) {

		var pathPrefix, rest;

		pathPrefix = require('rest/interceptor/pathPrefix');
		rest = require('rest');

		buster.testCase('rest/interceptor/pathPrefix', {
			'should prepend prefix before path': function () {
				var client = pathPrefix(
					function (request) { return { request: request }; },
					{ prefix: '/foo' }
				);
				return client({ path: '/bar' }).then(function (response) {
					assert.equals('/foo/bar', response.request.path);
				}).otherwise(fail);
			},
			'should prepend prefix before path, adding slash between path segments': function () {
				var client = pathPrefix(
					function (request) { return { request: request }; },
					{ prefix: '/foo' }
				);
				return client({ path: 'bar' }).then(function (response) {
					assert.equals('/foo/bar', response.request.path);
				}).otherwise(fail);
			},
			'should prepend prefix before path, not adding extra slash between path segments': function () {
				var client = pathPrefix(
					function (request) { return { request: request }; },
					{ prefix: '/foo/' }
				);
				return client({ path: 'bar' }).then(function (response) {
					assert.equals('/foo/bar', response.request.path);
				}).otherwise(fail);
			},
			'should not prepend prefix before a fully qualified path': function () {
				var client = pathPrefix(
					function (request) { return { request: request }; },
					{ prefix: '/foo' }
				);
				return client({ path: 'http://www.example.com/' }).then(function (response) {
					assert.equals('http://www.example.com/', response.request.path);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, pathPrefix().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof pathPrefix().wrap === 'function');
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
