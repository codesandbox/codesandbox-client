/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define, global) {
	'use strict';

	define(function (require) {

		var interceptor, UrlBuilder, pubsub, when;

		interceptor = require('../interceptor');
		UrlBuilder = require('../UrlBuilder');
		pubsub = require('../util/pubsub');
		when = require('when');

		function defaultOAuthCallback(hash) {
			var params, queryString, regex, m;

			queryString = hash.indexOf('#') === 0 ? hash.substring(1) : hash;
			params = {};
			regex = /([^&=]+)=([^&]*)/g;

			m = regex.exec(queryString);
			do {
				params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
				m = regex.exec(queryString);
			} while (m);

			/*jshint camelcase:false */
			pubsub.publish(params.state, params.token_type + ' ' + params.access_token);
		}

		function defaultWindowStrategy(url) {
			var w = window.open(url, '_blank', 'width=500,height=400');
			return function () {
				w.close();
			};
		}

		function authorize(config) {
			var state, url, dismissWindow;

			return when.promise(function (resolve) {

				state = Math.random() * new Date().getTime();
				url = new UrlBuilder(config.authorizationUrlBase).build({
					'response_type': 'token',
					'redirect_uri': config.redirectUrl,
					'client_id': config.clientId,
					'scope': config.scope,
					'state': state
				});

				dismissWindow = config.windowStrategy(url);

				pubsub.subscribe(state, function (authorization) {
					dismissWindow();
					resolve(authorization);
				});

			});
		}

		/**
		 * OAuth implicit flow support
		 *
		 * Authorizes request with the OAuth authorization token.  Tokens are
		 * requested from the authorization server as needed if there isn't a
		 * token, or the token is expired.
		 *
		 * A custom window strategy can be provided to replace the default popup
		 * window.  The window strategy is a function that must accept a URL as an
		 * argument and returns a function to close and cleanup the window.  A
		 * common custom strategy would be to use an iframe in a dialog.
		 *
		 * The callback function must be invoked when the authorization server
		 * redirects the browser back to the application.
		 *
		 * NOTE: Registering a handler to receive the redirect is required and
		 * outside the scope of this interceptor.  The implementer must collect the
		 * URL fragment and pass it to the callback function on the 'opener', or
		 * 'parent' window.
		 *
		 * @param {Client} [target] client to wrap
		 * @param {string} [config.token] pre-configured authentication token
		 * @param {string} config.clientId OAuth clientId
		 * @param {string} config.scope OAuth scope
		 * @param {string} config.authorizationUrlBase URL of the authorization server
		 * @param {string} [config.redirectUrl] callback URL from the authorization server.  Will be converted to a fully qualified, absolute URL, if needed.  Default's to the window's location or base href.
		 * @param {Function} [config.windowStrategy] strategy for opening the authorization window, defaults to window.open
		 * @param {string} [config.oAuthCallbackName='oAuthCallback'] name to register the callback as in global scope
		 * @param {Function} [config.oAuthCallback] callback function to receive OAuth URL fragment
		 *
		 * @returns {Client}
		 */
		return interceptor({
			init: function (config) {
				config.redirectUrl = new UrlBuilder(config.redirectUrl).fullyQualify().build();
				config.windowStrategy = config.windowStrategy || defaultWindowStrategy;
				config.oAuthCallback = config.oAuthCallback || defaultOAuthCallback;
				config.oAuthCallbackName = config.oAuthCallbackName || 'oAuthCallback';

				global[config.oAuthCallbackName] = config.oAuthCallback;

				return config;
			},
			request: function (request, config) {
				request.headers = request.headers || {};

				if (config.token) {
					request.headers.Authorization = config.token;
					return request;
				}
				else {
					return authorize(config).then(function (authorization) {
						request.headers.Authorization = config.token = authorization;
						return request;
					});
				}
			},
			response: function (response, config, meta) {
				if (response.status.code === 401) {
					// token probably expired, reauthorize
					return authorize(config).then(function (authorization) {
						config.token = authorization;
						return meta.client(response.request);
					});
				}
				else if (response.status.code === 403) {
					return when.reject(response);
				}

				return response;
			}
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); },
	typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : void 0
	// Boilerplate for AMD and Node
));
