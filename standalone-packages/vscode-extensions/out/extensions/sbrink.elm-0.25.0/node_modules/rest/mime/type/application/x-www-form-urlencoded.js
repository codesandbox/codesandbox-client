/*
 * Copyright 2012 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (/* require */) {

		var encodedSpaceRE, urlEncodedSpaceRE;

		encodedSpaceRE = /%20/g;
		urlEncodedSpaceRE = /\+/g;

		function urlEncode(str) {
			str = encodeURIComponent(str);
			// spec says space should be encoded as '+'
			return str.replace(encodedSpaceRE, '+');
		}

		function urlDecode(str) {
			// spec says space should be encoded as '+'
			str = str.replace(urlEncodedSpaceRE, ' ');
			return decodeURIComponent(str);
		}

		function append(str, name, value) {
			if (Array.isArray(value)) {
				value.forEach(function (value) {
					str = append(str, name, value);
				});
			}
			else {
				if (str.length > 0) {
					str += '&';
				}
				str += urlEncode(name);
				if (value !== undefined && value !== null) {
					str += '=' + urlEncode(value);
				}
			}
			return str;
		}

		return {

			read: function (str) {
				var obj = {};
				str.split('&').forEach(function (entry) {
					var pair, name, value;
					pair = entry.split('=');
					name = urlDecode(pair[0]);
					if (pair.length === 2) {
						value = urlDecode(pair[1]);
					}
					else {
						value = null;
					}
					if (name in obj) {
						if (!Array.isArray(obj[name])) {
							// convert to an array, perserving currnent value
							obj[name] = [obj[name]];
						}
						obj[name].push(value);
					}
					else {
						obj[name] = value;
					}
				});
				return obj;
			},

			write: function (obj) {
				var str = '';
				Object.keys(obj).forEach(function (name) {
					str = append(str, name, obj[name]);
				});
				return str;
			}

		};
	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
