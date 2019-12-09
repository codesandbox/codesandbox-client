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

	define('rest/interceptor/entity-test', function (require) {

		var entity, rest;

		entity = require('rest/interceptor/entity');
		rest = require('rest');

		buster.testCase('rest/interceptor/entity', {
			'should return the response entity': function () {
				var client, body;

				body = {};
				client = entity(function () { return { entity: body }; });

				return client().then(function (response) {
					assert.same(body, response);
				}).otherwise(fail);
			},
			'should return the whole response if there is no entity': function () {
				var client, response;

				response = {};
				client = entity(function () { return response; });

				return client().then(function (r) {
					assert.same(response, r);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, entity().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof entity().wrap === 'function');
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
