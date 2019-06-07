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

	define('rest/interceptor/ie/xdomain-test', function (require) {

		var xdomain, rest, client, xdr, xhrCors;

		xdomain = require('rest/interceptor/ie/xdomain');
		rest = require('rest');

		function defaultClient(request) {
			return { request: request, client: 'default' };
		}

		function xdrClient(request) {
			return { request: request, client: 'xdr' };
		}

		client = xdomain(defaultClient, { xdrClient: xdrClient });

		xdr = 'XDomainRequest' in window;
		xhrCors = window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest();

		buster.testCase('rest/interceptor/ie/xdomain', {
			'for XDomainRequest enabled browsers': {
				requiresSupportFor: { 'xdr': xdr, 'not-xhrCors': !xhrCors },
				'should use the XDomainRequest engine for cross domain requests': function () {
					return client({ path: 'http://example.com' }).then(function (response) {
						assert.same('xdr', response.client);
					}).otherwise(fail);
				},
				'should use the standard engine for same domain requests, with absolute paths': function () {
					return client({ path: window.location.toString() }).then(function (response) {
						assert.same('default', response.client);
					}).otherwise(fail);
				},
				'should use the standard engine for same domain requests, with relative paths': function () {
					return client({ path: '/' }).then(function (response) {
						assert.same('default', response.client);
					}).otherwise(fail);
				}
			},
			'for non-XDomainRequest enabled browsers': {
				requiresSupportForAny: { 'not-xdr': !xdr, 'xhrCors': xhrCors },
				'should always use the standard engine': function () {
					return client({ path: 'http://example.com' }).then(function (response) {
						assert.same('default', response.client);
					}).otherwise(fail);
				}
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, xdomain().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof xdomain().wrap === 'function');
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
