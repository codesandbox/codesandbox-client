/*
 * Copyright 2012-2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var client, when, pipeline, plugin;

		client = require('./client/default');
		when = require('when');
		pipeline = require('when/pipeline');

		function normalizeRestFactoryConfig(spec, wire) {
			var config = {};

			config.parent = wire(spec.parent || client);
			config.interceptors = when.all((Array.isArray(spec) ? spec : spec.interceptors || []).map(function (interceptorDef) {
				var interceptorConfig = interceptorDef.config;
				delete interceptorDef.config;
				return when.all([
					wire(typeof interceptorDef === 'string' ? { module: interceptorDef } : interceptorDef),
					wire(interceptorConfig)
				]).spread(function (interceptor, config) {
					return { interceptor: interceptor, config: config };
				});
			}));

			return config;
		}

		/**
		 * Creates a rest client for the "rest" factory.
		 * @param resolver
		 * @param spec
		 * @param wire
		 */
		function restFactory(resolver, spec, wire) {
			var config = normalizeRestFactoryConfig(spec.rest || spec.options, wire);
			return config.parent.then(function (parent) {
				return config.interceptors.then(function (interceptorDefs) {
					pipeline(interceptorDefs.map(function (interceptorDef) {
						return function (parent) {
							return interceptorDef.interceptor(parent, interceptorDef.config);
						};
					}), parent).then(resolver.resolve, resolver.reject);
				});
			});
		}

		/**
		 * The plugin instance.  Can be the same for all wiring runs
		 */
		plugin = {
			resolvers: {
				client: function () {
					throw new Error('rest.js: client! wire reference resolved is deprecated, use \'rest\' facotry instead');
				}
			},
			factories: {
				rest: restFactory
			}
		};

		return {
			wire$plugin: function restPlugin(/* ready, destroyed, options */) {
				return plugin;
			}
		};

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
