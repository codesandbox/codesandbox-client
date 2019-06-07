/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define, location) {
	'use strict';

	var assert, refute, undef;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/UrlBuilder-test', function (require) {

		var UrlBuilder = require('rest/UrlBuilder');

		buster.testCase('rest/UrlBuilder', {
			'should use the provided template': function () {
				assert.equals('/foo/bar', new UrlBuilder('/foo/bar').build());
			},
			'should replace values in the provided template': function () {
				assert.equals('/foo/bar', new UrlBuilder('/foo/{foo}', { foo: 'bar' }).build());
			},
			'should add unused params to the query string': function () {
				assert.equals('/foo/bar?foo=bar', new UrlBuilder('/foo/bar', { foo: 'bar' }).build());
			},
			'should add only name of unused param to query string if value is null': function () {
				assert.equals('/foo/bar?foo', new UrlBuilder('/foo/bar', { foo: null }).build());
			},
			'should add only name of unused param to query string if value is undefined': function () {
				assert.equals('/foo/bar?foo', new UrlBuilder('/foo/bar', { foo: undef }).build());
			},
			'should add unused params to an exsisting query string': function () {
				assert.equals('/foo/bar?bleep=bloop', new UrlBuilder('/foo/{foo}', { foo: 'bar', bleep: 'bloop' }).build());
			},
			'should url encode all param names and values added to the url': function () {
				assert.equals('/foo/bar?bl%25eep=bl%20oop', new UrlBuilder('/foo/bar', { 'bl%eep': 'bl oop' }).build());
			},
			'should return a built url for string concatination': function () {
				assert.equals('/prefix/foo/bar', '/prefix' + new UrlBuilder('/foo/bar'));
			},
			'should append additional template to the current template': function () {
				var foo, bar;
				foo = new UrlBuilder('/foo');
				bar = foo.append('/bar');
				refute.same(foo, bar);
				assert.equals('/foo', foo.build());
				assert.equals('/foo/bar', bar.build());
			},
			'should add or override praram with appended values': function () {
				var foo, bar;
				foo = new UrlBuilder('/{foo}', { foo: '' });
				bar = foo.append('/bar', { foo: 'foo', bleep: 'bloop' });
				refute.same(foo, bar);
				assert.equals('/', foo.build());
				assert.equals('/foo/bar?bleep=bloop', bar.build());
			},
			'should make the URL fully qualified': {
				requiresSupportFor: { location: location },
				'': function () {
					assert.same(location.toString(), new UrlBuilder('').fullyQualify().build());
					assert.same(location.protocol + '//' + location.host + '/', new UrlBuilder('/').fullyQualify().build());
					assert.same(location.protocol + '//' + location.host + '/foo', new UrlBuilder('/foo').fullyQualify().build());
					assert.same(location.protocol + '//example.com/', new UrlBuilder('//example.com').fullyQualify().build());
					assert.same('http://example.com/', new UrlBuilder('http://example.com').fullyQualify().build());
					assert.same('https://example.com/', new UrlBuilder('https://example.com').fullyQualify().build());
				}
			},
			'should indicate if the URL is absolute': function () {
				refute(new UrlBuilder('').isAbsolute());
				assert(new UrlBuilder('/foo').isAbsolute());
				assert(new UrlBuilder('//foo').isAbsolute());
				assert(new UrlBuilder('http://example.com').isAbsolute());
				assert(new UrlBuilder('https://example.com').isAbsolute());
				assert(new UrlBuilder('file:///').isAbsolute());
				assert(new UrlBuilder('file:///home/example/index.html').isAbsolute());
				assert(new UrlBuilder('file:///C:/Documents%20and%20Settings/example/index.html').isAbsolute());
			},
			'should indicate if the URL is fully qualified': function () {
				refute(new UrlBuilder('').isFullyQualified());
				refute(new UrlBuilder('/foo').isFullyQualified());
				refute(new UrlBuilder('//foo').isFullyQualified());
				refute(new UrlBuilder('http://example.com').isFullyQualified());
				refute(new UrlBuilder('https://example.com').isFullyQualified());
				assert(new UrlBuilder('http://example.com/').isFullyQualified());
				assert(new UrlBuilder('https://example.com/').isFullyQualified());
				assert(new UrlBuilder('file:///').isFullyQualified());
				assert(new UrlBuilder('file:///home/example/index.html').isFullyQualified());
				assert(new UrlBuilder('file:///C:/Documents%20and%20Settings/example/index.html').isFullyQualified());
			},
			'should indicate if the URL is cross origin': {
				requiresSupportFor: { location: location },
				'': function () {
					refute(new UrlBuilder('').isCrossOrigin());
					refute(new UrlBuilder('/foo').isCrossOrigin());
					refute(new UrlBuilder(location.protocol + '//' + location.host + '/foo').isCrossOrigin());
					assert(new UrlBuilder('//example.com').isCrossOrigin());
					assert(new UrlBuilder('http://example.com').isCrossOrigin());
					assert(new UrlBuilder('https://example.com').isCrossOrigin());
				}
			},
			'should split a URL into its parts': {
				'for a simple http URL': function () {
					var parts = new UrlBuilder('http://www.example.com/').parts();
					assert.same('http://www.example.com/', parts.href);
					assert.same('http:', parts.protocol);
					assert.same('www.example.com', parts.host);
					assert.same('www.example.com', parts.hostname);
					assert.same('80', parts.port);
					assert.same('http://www.example.com', parts.origin);
					assert.same('/', parts.pathname);
					assert.same('', parts.search);
					assert.same('', parts.hash);
				},
				'for a simple https URL': function () {
					var parts = new UrlBuilder('https://www.example.com/').parts();
					assert.same('https://www.example.com/', parts.href);
					assert.same('https:', parts.protocol);
					assert.same('www.example.com', parts.host);
					assert.same('www.example.com', parts.hostname);
					assert.same('443', parts.port);
					assert.same('https://www.example.com', parts.origin);
					assert.same('/', parts.pathname);
					assert.same('', parts.search);
					assert.same('', parts.hash);
				},
				'for a complex URL': function () {
					var parts = new UrlBuilder('http://user:pass@www.example.com:8080/some/path?hello=world#main').parts();
					assert.same('http://user:pass@www.example.com:8080/some/path?hello=world#main', parts.href);
					assert.same('http:', parts.protocol);
					assert.same('www.example.com:8080', parts.host);
					assert.same('www.example.com', parts.hostname);
					assert.same('8080', parts.port);
					assert.same('http://www.example.com:8080', parts.origin);
					assert.same('/some/path', parts.pathname);
					assert.same('?hello=world', parts.search);
					assert.same('#main', parts.hash);
				},
				'for a path-less URL': function () {
					var parts = new UrlBuilder('http://www.example.com/?hello=world#main').parts();
					assert.same('http://www.example.com/?hello=world#main', parts.href);
					assert.same('http:', parts.protocol);
					assert.same('www.example.com', parts.host);
					assert.same('www.example.com', parts.hostname);
					assert.same('80', parts.port);
					assert.same('http://www.example.com', parts.origin);
					assert.same('/', parts.pathname);
					assert.same('?hello=world', parts.search);
					assert.same('#main', parts.hash);
				},
				'for a path and query-less URL': function () {
					var parts = new UrlBuilder('http://www.example.com/#main').parts();
					assert.same('http://www.example.com/#main', parts.href);
					assert.same('http:', parts.protocol);
					assert.same('www.example.com', parts.host);
					assert.same('www.example.com', parts.hostname);
					assert.same('80', parts.port);
					assert.same('http://www.example.com', parts.origin);
					assert.same('/', parts.pathname);
					assert.same('', parts.search);
					assert.same('#main', parts.hash);
				},
				'for a Unix file URL': function () {
					var parts = new UrlBuilder('file:///home/example/index.html').parts();
					assert.same('file:///home/example/index.html', parts.href);
					assert.same('file:', parts.protocol);
					assert.same('', parts.host);
					assert.same('', parts.hostname);
					assert.same('', parts.port);
					assert.same('file://', parts.origin);
					assert.same('/home/example/index.html', parts.pathname);
					assert.same('', parts.search);
					assert.same('', parts.hash);
				},
				'for a Windows file URL': function () {
					var parts = new UrlBuilder('file:///C:/Documents%20and%20Settings/example/index.html').parts();
					assert.same('file:///C:/Documents%20and%20Settings/example/index.html', parts.href);
					assert.same('file:', parts.protocol);
					assert.same('', parts.host);
					assert.same('', parts.hostname);
					assert.same('', parts.port);
					assert.same('file://', parts.origin);
					assert.same('/C:/Documents%20and%20Settings/example/index.html', parts.pathname);
					assert.same('', parts.search);
					assert.same('', parts.hash);
				}
			},
			'should be forgiving of non constructor calls': function () {
				/*jshint newcap:false */
				assert(UrlBuilder() instanceof UrlBuilder);
			}
			// TODO test .absolute()
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
	},
	this.location
	// Boilerplate for AMD and Node
));
