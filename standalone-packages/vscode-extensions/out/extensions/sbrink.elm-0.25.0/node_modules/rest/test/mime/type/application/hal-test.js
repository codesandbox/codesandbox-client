/*
 * Copyright 2013-2015 the original author or authors
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

	define('rest/mime/type/application/hal-test', function (require) {

		var hal, mime, registry, halMime, supports;

		hal = require('rest/mime/type/application/hal');
		mime = require('rest/interceptor/mime');
		registry = require('rest/mime/registry');

		halMime = require('rest/mime').parse('application/hal+json');

		function client(request) {
			return { request: request };
		}

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
			}())
		};


		buster.testCase('rest/mime/type/application/hal', {
			'should stringify json': function () {
				return hal.write({ foo: 'bar' }, { mime: halMime, registry: registry }).then(function (resource) {
					assert.equals('{"foo":"bar"}', resource);
				}).otherwise(fail);
			},
			'should read json': function () {
				return hal.read('{"foo":"bar"}', { mime: halMime, registry: registry }).then(function (resource) {
					assert.equals({ foo: 'bar' }, resource);
				}).otherwise(fail);
			},
			'should place embedded relationships on the host object': function () {
				return hal.read(JSON.stringify({ _embedded: { prop: 'embed' } }), { mime: halMime, registry: registry }).then(function (resource) {
					return resource.prop.entity().then(function (prop) {
						assert.same(prop, 'embed');
					});
				}).otherwise(fail);
			},
			'should not overwrite a property on the host oject with an embedded relationship': function () {
				return hal.read(JSON.stringify({ prop: 'host', _embedded: { prop: 'embed' } }), { mime: halMime, registry: registry }).then(function (resource) {
					assert.same(resource.prop, 'host');
				}).otherwise(fail);
			},
			'should place linked relationships on the host object': function () {
				return hal.read(JSON.stringify({ _links: { prop: { href: '/' } } }), { mime: halMime, registry: registry }).then(function (resource) {
					assert.isFunction(resource.prop.entity);
				}).otherwise(fail);
			},
			'should not overwrite a property on the host oject with a linked relationship': function () {
				return hal.read(JSON.stringify({ prop: 'host', _links: { prop: { href: '/' } } }), { mime: halMime, registry: registry }).then(function (resource) {
					assert.same(resource.prop, 'host');
				}).otherwise(fail);
			},
			'should fetch a linked resource': function () {
				var client = mime(function client(request) {
					return request.path === '/' ?
						{ request: request, entity: JSON.stringify({ _links: { self: { href: '/' }, child: { href: '/resource' } } }), headers: { 'Content-Type': 'application/hal+json' } } :
						{ request: request, entity: JSON.stringify({ _links: { self: { href: '/resource' }, parent: { href: '/' } } }), headers: { 'Content-Type': 'application/hal+json' } };
				});

				return client({ path: '/' }).then(function (response) {
					assert.same('/', response.request.path);
					return response.entity.child.then(function (response) {
						assert.same('/resource', response.request.path);
					});
				}).otherwise(fail);
			},
			'should fetch a templated linked resource': function () {
				var client = mime(function client(request) {
					return request.path === '/' ?
						{ request: request, entity: JSON.stringify({ _links: { self: { href: '/' }, child: { templated: true, href: '/resource{?lang}' } } }), headers: { 'Content-Type': 'application/hal+json' } } :
						{ request: request, entity: JSON.stringify({ _links: { self: { href: '/resource' }, parent: { href: '/' } } }), headers: { 'Content-Type': 'application/hal+json' } };
				});

				return client({ path: '/' }).then(function (response) {
					assert.same('/', response.request.path);
					return response.entity.child.then(function (response) {
						assert.same('/resource', response.request.path);
					});
				}).otherwise(fail);
			},
			'should make a request for a relationship': function () {
				return hal.read(JSON.stringify({ _links: { prop: { href: '/' } } }), { mime: halMime, registry: registry, client: client }).then(function (resource) {
					return resource.requestFor('prop', { method: 'delete' }).then(function (response) {
						assert.same('/', response.request.path);
						assert.same('delete', response.request.method);
					});
				}).otherwise(fail);
			},
			'should get a client for a relationship': function () {
				return hal.read(JSON.stringify({ _links: { prop: { href: '/' } } }), { mime: halMime, registry: registry, client: client }).then(function (resource) {
					return resource.clientFor('prop')().then(function (response) {
						assert.same('/', response.request.path);
					});
				}).otherwise(fail);
			},
			'should get a client for a templated relationship': function () {
				return hal.read(JSON.stringify({ _links: { prop: { templated: true, href: '/{?lang}' } } }), { mime: halMime, registry: registry, client: client }).then(function (resource) {
					return resource.clientFor('prop')({ params: { lang: 'en-us' } }).then(function (response) {
						assert.same('/?lang=en-us', response.request.path);
						refute('params' in response.request);
					});
				}).otherwise(fail);
			},
			'should safely warn when accessing a deprecated relationship': {
				'': function () {
					var console;

					console = {
						warn: this.spy(),
						log: this.spy()
					};

					return hal.read(JSON.stringify({ _links: { prop: { href: '/', deprecation: 'http://example.com/deprecation' } } }), { mime: halMime, registry: registry, client: client, console: console }).then(function (resource) {
						return resource.clientFor('prop')().then(function (response) {
							assert.same('/', response.request.path);
							assert.calledWith(console.warn, 'Relationship \'prop\' is deprecated, see http://example.com/deprecation');
							refute.called(console.log);
						});
					}).otherwise(fail);

				},
				'falling back to log if warn is not availble': function () {
					var console;

					console = {
						log: this.spy()
					};

					return hal.read(JSON.stringify({ _links: { prop: { href: '/', deprecation: 'http://example.com/deprecation' } } }), { mime: halMime, registry: registry, client: client, console: console }).then(function (resource) {
						return resource.clientFor('prop')().then(function (response) {
							assert.same('/', response.request.path);
							assert.calledWith(console.log, 'Relationship \'prop\' is deprecated, see http://example.com/deprecation');
						});
					}).otherwise(fail);
				},
				'doing nothing if the console is unavailable': function () {
					var console;

					console = {};

					return hal.read(JSON.stringify({ _links: { prop: { href: '/', deprecation: 'http://example.com/deprecation' } } }), { mime: halMime, registry: registry, client: client, console: console }).then(function (resource) {
						return resource.clientFor('prop')().then(function (response) {
							assert.same('/', response.request.path);
						});
					}).otherwise(fail);
				}
			},
			'should be able to write read entities': function () {
				var raw;

				raw = { _embedded: { prop: 'embed' }, _links: { prop: { href: '/' } }, foo: 'bar' };

				return hal.read(JSON.stringify(raw), { mime: halMime, registry: registry }).then(function (read) {
					return hal.write(read, { mime: halMime, registry: registry });
				}).then(function (written) {
					assert.match(written, '"foo":"bar"');

					if (!supports['Object.defineProperty']) {
						refute.match(written, '_embedded');
						refute.match(written, '_links');
						refute.match(written, 'clientFor');
						refute.match(written, 'prop');
					}
				});
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
