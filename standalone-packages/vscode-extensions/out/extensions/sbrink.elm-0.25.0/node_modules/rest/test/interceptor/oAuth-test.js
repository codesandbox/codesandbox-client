/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define, global) {
	'use strict';

	var assert, refute, fail;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;

	define('rest/interceptor/oAuth-test', function (require) {

		var oAuth, rest, pubsub;

		oAuth = require('rest/interceptor/oAuth');
		pubsub = require('rest/util/pubsub');
		rest = require('rest');

		buster.testCase('rest/interceptor/oAuth', {
			'should authenticate the request for a known token': function () {
				var client;

				client = oAuth(
					function (request) { return { request: request, status: { code: 200 } }; },
					{ token: 'bearer abcxyz' }
				);

				return client({}).then(function (response) {
					assert.equals('bearer abcxyz', response.request.headers.Authorization);
				}).otherwise(fail);
			},
			'should use implicit flow to authenticate the request': function () {
				var client, windowStrategy, windowStrategyClose, oAuthCallbackName;

				oAuthCallbackName = 'oAuthCallback' + Math.round(Math.random() * 100000);
				windowStrategyClose = this.spy(function () {});
				windowStrategy = function (url) {
					var state;
					assert(url.indexOf('https://www.example.com/auth?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%2FimplicitHandler&client_id=user&scope=openid&state=') === 0);
					state = url.substring(url.lastIndexOf('=') + 1);
					setTimeout(function () {
						global[oAuthCallbackName]('#state=' + state + '&=token_type=bearer&access_token=abcxyz');
					}, 10);
					return windowStrategyClose;
				};

				client = oAuth(
					function (request) {
						return { request: request, status: { code: 200 } };
					},
					{
						clientId: 'user',
						authorizationUrlBase: 'https://www.example.com/auth',
						redirectUrl: 'http://localhost/implicitHandler',
						scope: 'openid',
						windowStrategy: windowStrategy,
						oAuthCallbackName: oAuthCallbackName
					}
				);

				return client({}).then(function (response) {
					assert.equals('bearer abcxyz', response.request.headers.Authorization);
					assert.called(windowStrategyClose);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, oAuth({ token: 'bearer abcxyz' }).skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof oAuth().wrap === 'function');
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
	},
	typeof global === 'undefined' ? this : global
	// Boilerplate for AMD and Node
));
