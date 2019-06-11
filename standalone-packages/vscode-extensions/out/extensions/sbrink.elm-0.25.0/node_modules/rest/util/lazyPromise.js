/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var when;

		when = require('when');

		/**
		 * Create a promise whose work is started only when a handler is registered.
		 *
		 * The work function will be invoked at most once. Thrown values will result
		 * in promise rejection.
		 *
		 * @param {Function} work function whose ouput is used to resolve the
		 *   returned promise.
		 * @returns {Promise} a lazy promise
		 */
		function lazyPromise(work) {
			var defer, started, resolver, promise, then;

			defer = when.defer();
			started = false;

			resolver = defer.resolver;
			promise = defer.promise;
			then = promise.then;

			promise.then = function () {
				if (!started) {
					started = true;
					when.attempt(work).then(resolver.resolve, resolver.reject);
				}
				return then.apply(promise, arguments);
			};

			return promise;
		}

		return lazyPromise;

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
