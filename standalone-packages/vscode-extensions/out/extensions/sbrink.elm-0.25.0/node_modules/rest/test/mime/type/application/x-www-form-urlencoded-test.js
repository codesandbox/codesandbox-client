/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/mime/type/application/x-www-form-urlencoded-test', function (require) {

		var encodeder = require('rest/mime/type/application/x-www-form-urlencoded');

		buster.testCase('rest/mime/type/application/x-www-form-urlencoded', {
			'should place an eqauls sign between value pairs': function () {
				assert.equals('foo=bar&bleep=bloop', encodeder.write({ foo: 'bar', bleep: 'bloop' }));
			},
			'should treat array as multiple values with the same name': function () {
				assert.equals('foo=bar&foo=bloop', encodeder.write({ foo: [ 'bar', 'bloop'] }));
			},
			'should url encode names and values': function () {
				assert.equals('fo%3Do=b%26ar', encodeder.write({ 'fo=o': 'b&ar' }));
			},
			'should encode spaces as plus': function () {
				assert.equals('fo+o=b+ar', encodeder.write({ 'fo o': 'b ar' }));
			},
			'should not include an equals if their is no value': function () {
				assert.equals('foo', encodeder.write({ 'foo': undefined }));
				assert.equals('foo', encodeder.write({ 'foo': null }));
				assert.equals('foo=', encodeder.write({ 'foo': '' }));
			},
			'should parse an eqauls sign between value pairs': function () {
				var obj = encodeder.read('foo=bar&bleep=bloop');
				assert.equals('bar', obj.foo);
				assert.equals('bloop', obj.bleep);
			},
			'should parse multiple values with the same name as an array': function () {
				var obj = encodeder.read('foo=bar&foo=bloop');
				assert.equals('bar', obj.foo[0]);
				assert.equals('bloop', obj.foo[1]);
			},
			'should url decode names and values': function () {
				var obj = encodeder.read('fo%3Do=b%26ar');
				assert.equals('b&ar', obj['fo=o']);
			},
			'should decode a plus as a space': function () {
				var obj = encodeder.read('fo+o=b+ar');
				assert.equals('b ar', obj['fo o']);
			},
			'should parse missing value as null': function () {
				var obj = encodeder.read('foo');
				assert.same(null, obj.foo);
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
