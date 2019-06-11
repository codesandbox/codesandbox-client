/*
 * Copyright 2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/util/uriEncoder-test', function (require) {

		var uriEncoder, strings;

		uriEncoder = require('rest/util/uriEncoder');

		strings = {
			alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			digit: '0123456789',
			punctuation: '!"#$%&\'()*+,-./:;<=>?@[]^_`{}~',
			whitespace: '\n\r \t'
		};

		buster.testCase('rest/util/uriEncoder', {
			'#decode()': function () {
				assert.same(uriEncoder.decode('Hello%20World%21'), 'Hello World!');

				assert.same(uriEncoder.decode('%41%42%43%44%45%46%47%48%49%4A%4B%4C%4D%4E%4F%50%51%52%53%54%55%56%57%58%59%5A%61%62%63%64%65%66%67%68%69%6A%6B%6C%6D%6E%6F%70%71%72%73%74%75%76%77%78%79%7A'), strings.alpha);
				assert.same(uriEncoder.decode('%30%31%32%33%34%35%36%37%38%39'), strings.digit);
				assert.same(uriEncoder.decode('%21%22%23%24%25%26%27%28%29%2A%2B%2C%2D%2E%2F%3A%3B%3C%3D%3E%3F%40%5B%5D%5E%5F%60%7B%7D%7E'), strings.punctuation);
			},
			'#encode()': function () {
				assert.same(uriEncoder.encode('Hello World!'), 'Hello%20World%21');

				assert.same(uriEncoder.encode(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encode(strings.digit), strings.digit);
				assert.same(uriEncoder.encode(strings.punctuation), '%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encode(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodeScheme()': function () {
				assert.same(uriEncoder.encodeScheme('http'), 'http');
				assert.same(uriEncoder.encodeScheme('view-source'), 'view-source');
				assert.same(uriEncoder.encodeScheme('xmlrpc.beep'), 'xmlrpc.beep');
				assert.same(uriEncoder.encodeScheme('foo$bar'), 'foo%24bar');

				assert.same(uriEncoder.encodeScheme(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodeScheme(strings.digit), strings.digit);
				assert.same(uriEncoder.encodeScheme(strings.punctuation), '%21%22%23%24%25%26%27%28%29%2A+%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5D%5E%5F%60%7B%7D%7E');
				assert.same(uriEncoder.encodeScheme(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodeUserInfo()': function () {
				assert.same(uriEncoder.encodeUserInfo(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodeUserInfo(strings.digit), strings.digit);
				assert.same(uriEncoder.encodeUserInfo(strings.punctuation), '!%22%23$%25&\'()*+,-.%2F:;%3C=%3E%3F%40%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodeUserInfo(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodeHost()': function () {
				assert.same(uriEncoder.encodeHost('www.example.com'), 'www.example.com');
				assert.same(uriEncoder.encodeHost('127.0.0.1'), '127.0.0.1');
				assert.same(uriEncoder.encodeHost('foo@bar.example.com'), 'foo%40bar.example.com');

				assert.same(uriEncoder.encodeHost(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodeHost(strings.digit), strings.digit);
				assert.same(uriEncoder.encodeHost(strings.punctuation), '!%22%23$%25&\'()*+,-.%2F%3A;%3C=%3E%3F%40%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodeHost(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodePort()': function () {
				assert.same(uriEncoder.encodePort(strings.alpha), '%41%42%43%44%45%46%47%48%49%4A%4B%4C%4D%4E%4F%50%51%52%53%54%55%56%57%58%59%5A%61%62%63%64%65%66%67%68%69%6A%6B%6C%6D%6E%6F%70%71%72%73%74%75%76%77%78%79%7A');
				assert.same(uriEncoder.encodePort(strings.digit), strings.digit);
				assert.same(uriEncoder.encodePort(strings.punctuation), '%21%22%23%24%25%26%27%28%29%2A%2B%2C%2D%2E%2F%3A%3B%3C%3D%3E%3F%40%5B%5D%5E%5F%60%7B%7D%7E');
				assert.same(uriEncoder.encodePort(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodePathSegment()': function () {
				assert.same(uriEncoder.encodePathSegment('path'), 'path');
				assert.same(uriEncoder.encodePathSegment('/path'), '%2Fpath');

				assert.same(uriEncoder.encodePathSegment(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodePathSegment(strings.digit), strings.digit);
				assert.same(uriEncoder.encodePathSegment(strings.punctuation), '!%22%23$%25&\'()*+,-.%2F:;%3C=%3E%3F@%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodePathSegment(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodePath()': function () {
				assert.same(uriEncoder.encodePath('path'), 'path');
				assert.same(uriEncoder.encodePath('/path'), '/path');
				assert.same(uriEncoder.encodePath('/path?'), '/path%3F');

				assert.same(uriEncoder.encodePath(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodePath(strings.digit), strings.digit);
				assert.same(uriEncoder.encodePath(strings.punctuation), '!%22%23$%25&\'()*+,-./:;%3C=%3E%3F@%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodePath(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodeQuery()': function () {
				assert.same(uriEncoder.encodeQuery('?foo=bar&baz=bloop'), '?foo=bar&baz=bloop');
				assert.same(uriEncoder.encodeQuery('?foo=bar&baz=bloop#'), '?foo=bar&baz=bloop%23');

				assert.same(uriEncoder.encodeQuery(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodeQuery(strings.digit), strings.digit);
				assert.same(uriEncoder.encodeQuery(strings.punctuation), '!%22%23$%25&\'()*+,-./:;%3C=%3E?@%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodeQuery(strings.whitespace), '%0A%0D%20%09');
			},
			'#encodeFragment()': function () {
				assert.same(uriEncoder.encodeFragment('#foo'), '%23foo');
				assert.same(uriEncoder.encodeFragment('#foo=bar&baz=bloop'), '%23foo=bar&baz=bloop');
				assert.same(uriEncoder.encodeFragment('#foo=bar&baz=bloop#'), '%23foo=bar&baz=bloop%23');

				assert.same(uriEncoder.encodeFragment(strings.alpha), strings.alpha);
				assert.same(uriEncoder.encodeFragment(strings.digit), strings.digit);
				assert.same(uriEncoder.encodeFragment(strings.punctuation), '!%22%23$%25&\'()*+,-./:;%3C=%3E?@%5B%5D%5E_%60%7B%7D~');
				assert.same(uriEncoder.encodeFragment(strings.whitespace), '%0A%0D%20%09');
			},

			'utf-16': function () {
				// airplane ✈
				assert.same(uriEncoder.encode('\u2708'), '%E2%9C%88');
				assert.same(uriEncoder.decode('%E2%9C%88'), '\u2708');

				// pile of poo
				assert.same(uriEncoder.encode('\u1F4A9'), '%E1%BD%8A9');
				assert.same(uriEncoder.decode('%E1%BD%8A9'), '\u1F4A9');
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
