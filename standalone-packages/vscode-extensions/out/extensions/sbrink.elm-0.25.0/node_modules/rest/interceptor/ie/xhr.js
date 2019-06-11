/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define, global) {
	'use strict';

	define(function (require) {

		var interceptor, XMLHttpRequest;

		interceptor = require('../../interceptor');

		XMLHttpRequest = (function () {
			// derived from https://github.com/cujojs/poly/blob/0.5.1/xhr.js
			if (global.XMLHttpRequest) {
				return global.XMLHttpRequest;
			}

			var progIds, xhr;

			progIds = [
				'Msxml2.XMLHTTP',
				'Microsoft.XMLHTTP',
				'Msxml2.XMLHTTP.4.0'
			];

			function tryCtor(progId) {
				try {
					/*jshint nonew:false */
					new global.ActiveXObject(progId);
					xhr = function () { return new global.ActiveXObject(progId); };
				}
				catch (ex) {}
			}

			while (!xhr && progIds.length) {
				tryCtor(progIds.shift());
			}

			return xhr;
		}());

		/**
		 * Defaults request.engine to XMLHttpRequest, or an appropriate ActiveX fall
		 * back
		 *
		 * @param {Client} [client] client to wrap
		 *
		 * @returns {Client}
		 */
		return interceptor({
			request: function handleRequest(request) {
				request.engine = request.engine || XMLHttpRequest;
				return request;
			}
		});

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); },
	typeof window !== 'undefined' ? window : void 0
	// Boilerplate for AMD and Node
));
