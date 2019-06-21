/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var interceptor, jsonpClient;

		interceptor = require('../interceptor');
		jsonpClient = require('../client/jsonp');

		/**
		 * Allows common configuration of JSONP clients.
		 *
		 * Values provided to this interceptor are added to the request, if the
		 * request dose not already contain the property.
		 *
		 * The rest/client/jsonp client is used by default instead of the
		 * common default client for the platform.
		 *
		 * @param {Client} [client=rest/client/jsonp] custom client to wrap
		 * @param {string} [config.callback.param] the parameter name for which the
		 *   callback function name is the value
		 * @param {string} [config.callback.prefix] prefix for the callback function,
		 *   as the callback is attached to the window object, a unique, unobtrusive
		 *   prefix is desired
		 * @param {string} [request.callback.name=<generated>] pins the name of the
		 *   callback function, useful for cases where the server doesn't allow
		 *   custom callback names. Generally not recommended.
		 *
		 * @returns {Client}
		 */
		return interceptor({
			client: jsonpClient,
			init: function (config) {
				config.callback = config.callback || {};
				return config;
			},
			request: function (request, config) {
				request.callback = request.callback || {};
				request.callback.param = request.callback.param || config.callback.param;
				request.callback.prefix = request.callback.prefix || config.callback.prefix;
				request.callback.name = request.callback.name || config.callback.name;
				return request;
			}
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
