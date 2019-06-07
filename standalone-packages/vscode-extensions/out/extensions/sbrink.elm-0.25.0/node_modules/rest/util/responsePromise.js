/*
 * Copyright 2014-2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var when = require('when'),
			normalizeHeaderName = require('./normalizeHeaderName');

		function property(promise, name) {
			return promise.then(
				function (value) {
					return value && value[name];
				},
				function (value) {
					return when.reject(value && value[name]);
				}
			);
		}

		/**
		 * Obtain the response entity
		 *
		 * @returns {Promise} for the response entity
		 */
		function entity() {
			/*jshint validthis:true */
			return property(this, 'entity');
		}

		/**
		 * Obtain the response status
		 *
		 * @returns {Promise} for the response status
		 */
		function status() {
			/*jshint validthis:true */
			return property(property(this, 'status'), 'code');
		}

		/**
		 * Obtain the response headers map
		 *
		 * @returns {Promise} for the response headers map
		 */
		function headers() {
			/*jshint validthis:true */
			return property(this, 'headers');
		}

		/**
		 * Obtain a specific response header
		 *
		 * @param {String} headerName the header to retrieve
		 * @returns {Promise} for the response header's value
		 */
		function header(headerName) {
			/*jshint validthis:true */
			headerName = normalizeHeaderName(headerName);
			return property(this.headers(), headerName);
		}

		/**
		 * Follow a related resource
		 *
		 * The relationship to follow may be define as a plain string, an object
		 * with the rel and params, or an array containing one or more entries
		 * with the previous forms.
		 *
		 * Examples:
		 *   response.follow('next')
		 *
		 *   response.follow({ rel: 'next', params: { pageSize: 100 } })
		 *
		 *   response.follow([
		 *       { rel: 'items', params: { projection: 'noImages' } },
		 *       'search',
		 *       { rel: 'findByGalleryIsNull', params: { projection: 'noImages' } },
		 *       'items'
		 *   ])
		 *
		 * @param {String|Object|Array} rels one, or more, relationships to follow
		 * @returns ResponsePromise<Response> related resource
		 */
		function follow(rels) {
			/*jshint validthis:true */
			rels = [].concat(rels);
			return make(when.reduce(rels, function (response, rel) {
				if (typeof rel === 'string') {
					rel = { rel: rel };
				}
				if (typeof response.entity.clientFor !== 'function') {
					throw new Error('Hypermedia response expected');
				}
				var client = response.entity.clientFor(rel.rel);
				return client({ params: rel.params });
			}, this));
		}

		/**
		 * Wrap a Promise as an ResponsePromise
		 *
		 * @param {Promise<Response>} promise the promise for an HTTP Response
		 * @returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
		 */
		function make(promise) {
			promise.status = status;
			promise.headers = headers;
			promise.header = header;
			promise.entity = entity;
			promise.follow = follow;
			return promise;
		}

		function responsePromise() {
			return make(when.apply(when, arguments));
		}

		responsePromise.make = make;
		responsePromise.reject = function (val) {
			return make(when.reject(val));
		};
		responsePromise.promise = function (func) {
			return make(when.promise(func));
		};

		return responsePromise;

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
