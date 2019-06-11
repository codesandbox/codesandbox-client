/*
 * Copyright 2012 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	define('rest/test/run', ['curl/_privileged', 'domReady!'], function (curl) {

		var modules = Object.keys(curl.cache).filter(function (moduleId) {
			return moduleId.indexOf('-test') > 0;
		});

		buster.testRunner.timeout = 5000;
		define('rest/test/run-faux', modules, function () {
			buster.run();
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
