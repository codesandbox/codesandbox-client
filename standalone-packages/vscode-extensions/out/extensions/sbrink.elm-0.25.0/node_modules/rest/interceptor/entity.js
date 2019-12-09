/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var interceptor;

		interceptor = require('../interceptor');

		if (typeof console !== 'undefined') {
			console.log('rest.js: rest/interceptor/entity is deprecated, please use response.entity() instead');
		}

		/**
		 * @deprecated use response.entity() instead
		 *
		 * Returns the response entity as the response, discarding other response
		 * properties.
		 *
		 * @param {Client} [client] client to wrap
		 *
		 * @returns {Client}
		 */
		return interceptor({
			response: function (response) {
				if ('entity' in response) {
					return response.entity;
				}
				return response;
			}
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
