/*
* Copyright 2014 the original author or authors
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

	define('rest/mime-test', function (require) {

		var mime;

		mime = require('rest/mime');

		buster.testCase('rest/mime', {
			'should parse plain mime types': function () {
				var parsed = mime.parse('text/plain');
				assert.equals(parsed.raw, 'text/plain');
				assert.equals(parsed.type, 'text/plain');
				assert.equals(parsed.suffix, '');
				assert.equals(parsed.params, {});
			},
			'should parse suffixed mime types': function () {
				var parsed = mime.parse('application/hal+json');
				assert.equals(parsed.raw, 'application/hal+json');
				assert.equals(parsed.type, 'application/hal');
				assert.equals(parsed.suffix, '+json');
				assert.equals(parsed.params, {});
			},
			'should parse paramerters from mime types': function () {
				var parsed = mime.parse('text/plain; charset=ascii; foo=bar');
				assert.equals(parsed.raw, 'text/plain; charset=ascii; foo=bar');
				assert.equals(parsed.type, 'text/plain');
				assert.equals(parsed.suffix, '');
				assert.equals(parsed.params, { charset: 'ascii', foo: 'bar' });
			},
			'should parse a naked mime suffix': function () {
				var parsed = mime.parse('+json');
				assert.equals(parsed.raw, '+json');
				assert.equals(parsed.type, '');
				assert.equals(parsed.suffix, '+json');
				assert.equals(parsed.params, {});
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
