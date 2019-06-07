/*
 * Copyright 2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest-test', function (require) {

		var rest = require('rest'),
			interceptor = require('rest/interceptor');

		function stubClient(request) {
			return { request: request };
		}

		var stubInterceptor = interceptor();

		buster.testCase('rest', {
			setUp: function () {
				rest.resetDefaultClient();
			},
			tearDown: function () {
				rest.resetDefaultClient();
			},
			'should return a client by default': function () {
				assert.equals('function', typeof rest.getDefaultClient());
			},
			'should use the provided client as a default': function () {
				rest.setDefaultClient(stubClient);
				assert.same(stubClient, rest.getDefaultClient());
				assert.equals('request', rest('request').request);
			},
			'should restore the platform default client': function () {
				var client = rest.getDefaultClient();
				rest.setDefaultClient(stubClient);
				refute.same(client, rest.getDefaultClient());
				rest.resetDefaultClient();
				assert.same(client, rest.getDefaultClient());
			},
			'should wrap off the default client, using the lastest default client': function () {
				var client = rest.wrap(stubInterceptor);
				rest.setDefaultClient(stubClient);
				refute.same(client, stubClient);
				assert.equals('request', rest('request').request);
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
