/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var mime, when, registry;

		mime = require('../mime');
		when = require('when');

		function Registry(mimes) {

			/**
			 * Lookup the converter for a MIME type
			 *
			 * @param {string} type the MIME type
			 * @return a promise for the converter
			 */
			this.lookup = function lookup(type) {
				var parsed;

				parsed = typeof type === 'string' ? mime.parse(type) : type;

				if (mimes[parsed.raw]) {
					return mimes[parsed.raw];
				}
				if (mimes[parsed.type + parsed.suffix]) {
					return mimes[parsed.type + parsed.suffix];
				}
				if (mimes[parsed.type]) {
					return mimes[parsed.type];
				}
				if (mimes[parsed.suffix]) {
					return mimes[parsed.suffix];
				}

				return when.reject(new Error('Unable to locate converter for mime "' + parsed.raw + '"'));
			};

			/**
			 * Create a late dispatched proxy to the target converter.
			 *
			 * Common when a converter is registered under multiple names and
			 * should be kept in sync if updated.
			 *
			 * @param {string} type mime converter to dispatch to
			 * @returns converter whose read/write methods target the desired mime converter
			 */
			this.delegate = function delegate(type) {
				return {
					read: function () {
						var args = arguments;
						return this.lookup(type).then(function (converter) {
							return converter.read.apply(this, args);
						}.bind(this));
					}.bind(this),
					write: function () {
						var args = arguments;
						return this.lookup(type).then(function (converter) {
							return converter.write.apply(this, args);
						}.bind(this));
					}.bind(this)
				};
			};

			/**
			 * Register a custom converter for a MIME type
			 *
			 * @param {string} type the MIME type
			 * @param converter the converter for the MIME type
			 * @return a promise for the converter
			 */
			this.register = function register(type, converter) {
				mimes[type] = when(converter);
				return mimes[type];
			};

			/**
			 * Create a child registry whoes registered converters remain local, while
			 * able to lookup converters from its parent.
			 *
			 * @returns child MIME registry
			 */
			this.child = function child() {
				return new Registry(Object.create(mimes));
			};

		}

		registry = new Registry({});

		// include provided serializers
		registry.register('application/hal', require('./type/application/hal'));
		registry.register('application/json', require('./type/application/json'));
		registry.register('application/x-www-form-urlencoded', require('./type/application/x-www-form-urlencoded'));
		registry.register('multipart/form-data', require('./type/multipart/form-data'));
		registry.register('text/plain', require('./type/text/plain'));

		registry.register('+json', registry.delegate('application/json'));

		return registry;

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
