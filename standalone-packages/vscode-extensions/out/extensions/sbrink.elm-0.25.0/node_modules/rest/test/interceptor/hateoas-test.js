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

	define('rest/interceptor/hateoas-test', function (require) {

		var hateoas, rest, when, supports;

		hateoas = require('rest/interceptor/hateoas');
		rest = require('rest');
		when = require('when');

		supports = {
			'Object.defineProperty': (function () {
				try {
					var obj = {};
					Object.defineProperty(obj, 'test', { enumerable: false, configurable: true, value: true });
					return obj.test;
				}
				catch (e) {
					return false;
				}
			}()),
			'ES5 getters': (function () {
				try {
					var obj = {};
					Object.defineProperty(obj, 'test', { get: function () { return true; } });
					return obj.test;
				}
				catch (e) {
					return false;
				}
			}())
		};

		buster.testCase('rest/interceptor/hateoas', {
			'should parse header links': function () {
				var client, entity, headers;

				headers = {
					Link: [
						'<http://example.com/TheBook/chapter2>; rel="previous"; title="previous chapter"',
						'<http://example.com/TheBook/chapter4>; rel="next"; title="next chapter"'
					]
				};
				entity = {};
				client = hateoas(function () { return { entity: entity, headers: headers }; });

				return client().then(function (response) {
					assert('previous' in response.links);
					assert.same(response.links.previousLink.href, 'http://example.com/TheBook/chapter2');
					assert.same(response.links.previousLink.title, 'previous chapter');
					assert('next' in response.links);
					assert.same(response.links.nextLink.href, 'http://example.com/TheBook/chapter4');
					assert.same(response.links.nextLink.title, 'next chapter');
				}).otherwise(fail);
			},
			'should parse compound header links': function () {
				var client, entity, headers;

				headers = {	Link: '<http://example.com/TheBook/chapter2>; rel="previous"; title="previous chapter", <http://example.com/TheBook/chapter4>; rel="next"; title="next chapter"' };
				entity = {};
				client = hateoas(function () { return { entity: entity, headers: headers }; });

				return client().then(function (response) {
					assert('previous' in response.links);
					assert.same(response.links.previousLink.href, 'http://example.com/TheBook/chapter2');
					assert.same(response.links.previousLink.title, 'previous chapter');
					assert('next' in response.links);
					assert.same(response.links.nextLink.href, 'http://example.com/TheBook/chapter4');
					assert.same(response.links.nextLink.title, 'next chapter');
				}).otherwise(fail);
			},
			'should gracefully recover from maleformed header links': function () {
				var client, entity, headers;

				headers = {	Link: 'foo bar' };
				entity = {};
				client = hateoas(function () { return { entity: entity, headers: headers }; });

				return client().then(function (response) {
					assert.same(entity, response.entity);
				}).otherwise(fail);
			},
			'': {
				requiresSupportFor: { 'Object.defineProperty': supports['Object.defineProperty'] },

				'should parse links in the entity': function () {
					var client, body, parent, self;

					parent = { rel: 'parent', href: '/' };
					self = { rel: 'self', href: '/resource' };

					body = { links: [ parent, self ]};
					client = hateoas(function () { return { entity: body }; }, { target: '_links' });

					return client().then(function (response) {
						assert.same(parent, response.entity._links.parentLink);
						assert.same(self, response.entity._links.selfLink);
					}).otherwise(fail);
				},
				'should parse links in the entity into the entity': function () {
					var client, body, parent, self;

					parent = { rel: 'parent', href: '/' };
					self = { rel: 'self', href: '/resource' };

					body = { links: [ parent, self ]};
					client = hateoas(function () { return { entity: body }; });

					return client().then(function (response) {
						assert.same(parent, response.entity.parentLink);
						assert.same(self, response.entity.selfLink);
					}).otherwise(fail);
				},
				'should create a client for the related resource': function () {
					var client, body, parent, self;

					parent = { rel: 'parent', href: '/' };
					self = { rel: 'self', href: '/resource' };

					body = { links: [ parent, self ]};
					client = hateoas(function () { return { entity: body }; });

					return client().then(function (response) {
						var parentClient = response.entity.clientFor('parent', function (request) { return { request: request }; });
						return parentClient().then(function (response) {
							assert.same(parent.href, response.request.path);
						});
					}).otherwise(fail);
				},
				'should return the same value for multiple property accesses': function () {
					var client, body;

					body = { links: [ { rel: 'self', href: '/resource' } ]};
					client = hateoas(function (request) {
						return request.path ? { entity: body } : { entity: {} };
					});

					return client().then(function (response) {
						assert.same(response.entity.self, response.entity.self);
					}).otherwise(fail);
				}
			},
			'should fetch a related resource': {
				requiresSupportFor: { 'ES5 getters': supports['ES5 getters'] },
				'': function () {
					var client, parentClient;

					parentClient = function (request) {
						return request.path === '/' ?
							{ request: request, entity: { links: [ { rel: 'self', href: '/' }, { rel: 'child', href: '/resource' } ] } } :
							{ request: request, entity: { links: [ { rel: 'self', href: '/resource' }, { rel: 'parent', href: '/' } ] } };
					};
					client = hateoas(parentClient);

					return client({ path: '/' }).then(function (response) {
						assert.same('/', response.request.path);
						assert.same('/', response.entity.selfLink.href);
						return response.entity.child.then(function (response) {
							assert.same('/resource', response.request.path);
							assert.same('/resource', response.entity.selfLink.href);
						});
					}).otherwise(fail);
				}
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, hateoas().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof hateoas().wrap === 'function');
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
