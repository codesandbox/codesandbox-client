/*
 * Copyright 2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Michael Jackson
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/mime/type/multipart/form-data-test', function (require) {

		var encoder = require('rest/mime/type/multipart/form-data');

		buster.testCase('rest/mime/type/multipart/form-data', {
			requiresSupportFor: { FormData: 'FormData' in window },
			'should pass a FormData object through unmodified': function () {
				var data = new FormData();
				assert.same(encoder.write(data), data);
			},
			'should encode a form element as FormData': function () {
				var form = document.createElement('form');
				assert.hasPrototype(encoder.write(form), FormData.prototype);
			},
			'should encode a plain object as FormData': function () {
				assert.hasPrototype(encoder.write({ a: 'string', b: 5 }), FormData.prototype);
			},
			'should throw when given a non-object': function () {
				assert.exception(function () {
					encoder.write('hello world');
				}, 'Error');
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
