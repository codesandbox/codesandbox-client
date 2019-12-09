/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (define, envRequire) {
	'use strict';

	define(function (require) {

		var parser, http, https, when, UrlBuilder, mixin, normalizeHeaderName, responsePromise, client, httpsExp;

		parser = envRequire('url');
		http = envRequire('http');
		https = envRequire('https');
		when = require('when');
		UrlBuilder = require('../UrlBuilder');
		mixin = require('../util/mixin');
		normalizeHeaderName = require('../util/normalizeHeaderName');
		responsePromise = require('../util/responsePromise');
		client = require('../client');

		httpsExp = /^https/i;

		// TODO remove once Node 0.6 is no longer supported
		Buffer.concat = Buffer.concat || function (list, length) {
			/*jshint plusplus:false, shadow:true */
			// from https://github.com/joyent/node/blob/v0.8.21/lib/buffer.js
			if (!Array.isArray(list)) {
				throw new Error('Usage: Buffer.concat(list, [length])');
			}

			if (list.length === 0) {
				return new Buffer(0);
			} else if (list.length === 1) {
				return list[0];
			}

			if (typeof length !== 'number') {
				length = 0;
				for (var i = 0; i < list.length; i++) {
					var buf = list[i];
					length += buf.length;
				}
			}

			var buffer = new Buffer(length);
			var pos = 0;
			for (var i = 0; i < list.length; i++) {
				var buf = list[i];
				buf.copy(buffer, pos);
				pos += buf.length;
			}
			return buffer;
		};

		return client(function node(request) {
			/*jshint maxcomplexity:20 */
			return responsePromise.promise(function (resolve, reject) {

				var options, clientRequest, client, url, headers, entity, response;

				request = typeof request === 'string' ? { path: request } : request || {};
				response = { request: request };

				if (request.canceled) {
					response.error = 'precanceled';
					reject(response);
					return;
				}

				url = response.url = new UrlBuilder(request.path || '', request.params).build();
				client = url.match(httpsExp) ? https : http;

				options = mixin({}, request.mixin, parser.parse(url));

				entity = request.entity;
				request.method = request.method || (entity ? 'POST' : 'GET');
				options.method = request.method;
				headers = options.headers = {};
				Object.keys(request.headers || {}).forEach(function (name) {
					headers[normalizeHeaderName(name)] = request.headers[name];
				});
				if (!headers['Content-Length']) {
					headers['Content-Length'] = entity ? Buffer.byteLength(entity, 'utf8') : 0;
				}

				request.canceled = false;
				request.cancel = function cancel() {
					request.canceled = true;
					clientRequest.abort();
				};

				clientRequest = client.request(options, function (clientResponse) {
					// Array of Buffers to collect response chunks
					var buffers = [];

					response.raw = {
						request: clientRequest,
						response: clientResponse
					};
					response.status = {
						code: clientResponse.statusCode
						// node doesn't provide access to the status text
					};
					response.headers = {};
					Object.keys(clientResponse.headers).forEach(function (name) {
						response.headers[normalizeHeaderName(name)] = clientResponse.headers[name];
					});

					clientResponse.on('data', function (data) {
						// Collect the next Buffer chunk
						buffers.push(data);
					});

					clientResponse.on('end', function () {
						// Create the final response entity
						response.entity = buffers.length > 0 ? Buffer.concat(buffers).toString() : '';
						buffers = null;

						resolve(response);
					});
				});

				clientRequest.on('error', function (e) {
					response.error = e;
					reject(response);
				});

				if (entity) {
					clientRequest.write(entity);
				}
				clientRequest.end();

			});
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); },
	typeof require === 'function' && require
	// Boilerplate for AMD and Node
));
