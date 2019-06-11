/*
 * Copyright 2015 the original author or authors
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

	define('rest/interceptor/template-test', function (require) {

		var template, rest;

		template = require('rest/interceptor/template');
		rest = require('rest');

		function parent(request) {
			return { request: request };
		}

		buster.testCase('rest/interceptor/template', {
			'should apply the params to the path template': function () {
				var client, config;

				config = {};
				client = template(parent, config);

				return client({ path: 'http://example.com/dictionary{/term:1,term}{?lang}', params: { term: 'hypermedia' } }).then(function (response) {
					assert.same('http://example.com/dictionary/h/hypermedia', response.request.path);
					refute('params' in response.request);
				}).otherwise(fail);
			},
			'should apply the template and params from the config if not defined on the request': function () {
				var client, config;

				config = { template: 'http://example.com/dictionary{/term:1,term}{?lang}', params: { term: 'hypermedia' } };
				client = template(parent, config);

				return client().then(function (response) {
					assert.same('http://example.com/dictionary/h/hypermedia', response.request.path);
					refute('params' in response.request);
				}).otherwise(fail);
			},
			'should individually mix config params into the request': function () {
				var client, config;

				config = { params: { lang: 'en-us' } };
				client = template(parent, config);

				return client({ path: 'http://example.com/dictionary{/term:1,term}{?lang}', params: { term: 'hypermedia' } }).then(function (response) {
					assert.same('http://example.com/dictionary/h/hypermedia?lang=en-us', response.request.path);
					refute('params' in response.request);
				}).otherwise(fail);
			},
			'should ignore missing and overdefined params': function () {
				var client, config;

				config = {};
				client = template(parent, config);

				return client({ path: 'http://example.com/dictionary{/term:1,term}{?lang}', params: { q: 'hypermedia' } }).then(function (response) {
					assert.same('http://example.com/dictionary', response.request.path);
					refute('params' in response.request);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, template().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof template().wrap === 'function');
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
