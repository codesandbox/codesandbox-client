/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		if (console) {
			(console.warn || console.log).call(console, 'rest.js: The main module has moved, please switch your configuration to use \'rest/browser\' as the main module for browser applications.');
		}

		return require('./browser');

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
