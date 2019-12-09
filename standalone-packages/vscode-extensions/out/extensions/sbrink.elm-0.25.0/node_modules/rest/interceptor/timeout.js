/*
 * Copyright 2012-2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var interceptor, when;

		interceptor = require('../interceptor');
		when = require('when');

		/**
		 * Cancels a request if it takes longer then the timeout value.
		 *
		 * @param {Client} [client] client to wrap
		 * @param {number} [config.timeout=0] duration in milliseconds before canceling the request. Non-positive values disable the timeout
		 * @param {boolean} [config.transient=false] if true, timed out requests will not be marked as canceled so that it may be retried
		 *
		 * @returns {Client}
		 */
		return interceptor({
			init: function (config) {
				config.timeout = config.timeout || 0;
				config.transient = !!config.transient;
				return config;
			},
			request: function (request, config) {
				var timeout, abortTrigger, transient;
				timeout = 'timeout' in request ? request.timeout : config.timeout;
				transient = 'transient' in request ? request.transient : config.transient;
				if (timeout <= 0) {
					return request;
				}
				abortTrigger = when.defer();
				this.timeout = setTimeout(function () {
					abortTrigger.reject({ request: request, error: 'timeout' });
					if (request.cancel) {
						request.cancel();
						if (transient) {
							// unmark request as canceled for future requests
							request.canceled = false;
						}
					}
					else if (!transient) {
						request.canceled = true;
					}
				}, timeout);
				return new interceptor.ComplexRequest({ request: request, abort: abortTrigger.promise });
			},
			response: function (response) {
				if (this.timeout) {
					clearTimeout(this.timeout);
					delete this.timeout;
				}
				return response;
			}
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
