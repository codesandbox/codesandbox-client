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

	define('rest/mime/registry-test', function (require) {

		var mimeRegistry, when, registry;

		mimeRegistry = require('rest/mime/registry');
		when = require('when');

		buster.testCase('rest/mime/registry', {
			setUp: function () {
				registry = mimeRegistry.child();
			},
			'should discover unregisted converter': function () {
				return registry.lookup('text/plain').then(function (converter) {
					assert.isFunction(converter.read);
					assert.isFunction(converter.write);
				}).otherwise(fail);
			},
			'should return registed converter': function () {
				var converter = {};
				registry.register('application/vnd.com.example', converter);
				return registry.lookup('application/vnd.com.example').then(function (c) {
					assert.same(converter, c);
				}).otherwise(fail);
			},
			'should reject for non-existant converter': function () {
				return registry.lookup('application/bogus').then(
					fail,
					function () {
						assert(true);
					}
				);
			},
			'should resolve converters from parent registries': function () {
				var child, converter;
				child = registry.child();
				converter = {};
				registry.register('application/vnd.com.example', converter);
				return child.lookup('application/vnd.com.example').then(function (c) {
					assert.same(converter, c);
				}).otherwise(fail);
			},
			'should override parent registries when registering in a child': function () {
				var child, converterParent, converterChild;
				child = registry.child();
				converterParent = {};
				converterChild = {};
				registry.register('application/vnd.com.example', converterParent);
				child.register('application/vnd.com.example', converterChild);
				return child.lookup('application/vnd.com.example').then(function (c) {
					assert.same(converterChild, c);
				}).otherwise(fail);
			},
			'should not have any side effects in a parent registry from a child': function () {
				var child, converterParent, converterChild;
				child = registry.child();
				converterParent = {};
				converterChild = {};
				registry.register('application/vnd.com.example', converterParent);
				child.register('application/vnd.com.example', converterChild);
				return registry.lookup('application/vnd.com.example').then(function (c) {
					assert.same(converterParent, c);
				}).otherwise(fail);
			},
			'should ignore charset in mime resolution': function () {
				var converter = {};
				registry.register('application/vnd.com.example', converter);
				return registry.lookup('application/vnd.com.example;charset=utf-8').then(function (c) {
					assert.same(converter, c);
				}).otherwise(fail);
			},
			'should ignore suffix in mime resolution': function () {
				var converter = {};
				registry.register('application/vnd.com.example', converter);
				return registry.lookup('application/vnd.com.example+foo').then(function (c) {
					assert.same(converter, c);
				}).otherwise(fail);
			},
			'should fallback to suffix if mime type is not resolved': function () {
				var converter = {};
				registry.register('+foo', converter);
				return registry.lookup('application/vnd.com.example+foo').then(function (c) {
					assert.same(converter, c);
				}).otherwise(fail);
			},
			'should invoke the delegate mime converter': function () {
				var converter = {
					read: function (obj) {
						return 'read ' + obj;
					},
					write: function (obj) {
						return 'write ' + obj;
					}
				};
				registry.register('+bar', registry.delegate('+foo'));
				registry.register('+foo', converter);
				return registry.lookup('application/vnd.com.example+foo').then(function (converter) {
					assert.same('read hello', converter.read('hello'));
					assert.same('write world', converter.write('world'));
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
