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

	define('rest/interceptor/ie/xhr-test', function (require) {

		var xhr, rest;

		xhr = require('rest/interceptor/ie/xhr');
		rest = require('rest');

		function defaultClient(request) {
			return { request: request };
		}

		buster.testCase('rest/interceptor/ie/xhr', {
			'should provide the native XHR object as the engine': {
				// native XHR
				requiresSupportFor: { xhr: !!XMLHttpRequest },
				'': function () {
					var client = xhr(defaultClient);
					return client({}).then(function (response) {
						assert.same(XMLHttpRequest, response.request.engine);
					}).otherwise(fail);
				}
			},
			'should fall back to an ActiveX XHR-like object as the engine': {
				// XHR ActiveX fallback
				requiresSupportFor: { xhr: !XMLHttpRequest },
				'': function () {
					var client = xhr(defaultClient);
					return client({}).then(function (response) {
						refute.same(XMLHttpRequest, response.request.engine);
						assert.same('function', typeof response.request.engine);
					}).otherwise(fail);
				}
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, xhr().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof xhr().wrap === 'function');
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
