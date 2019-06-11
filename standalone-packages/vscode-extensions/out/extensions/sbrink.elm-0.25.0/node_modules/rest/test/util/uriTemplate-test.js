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

	define('rest/util/uriTemplate-test', function (require) {

		var uriTemplate, params;

		uriTemplate = require('rest/util/uriTemplate');

		buster.testCase('rest/util/uriTempalte', {
			'should support examples in rfc6570': {
				setUp: function () {
					params = {
						count : ['one', 'two', 'three'],
						dom   : ['example', 'com'],
						dub   : 'me/too',
						hello : 'Hello World!',
						half  : '50%',
						'var' : 'value',
						who   : 'fred',
						base  : 'http://example.com/home/',
						path  : '/foo/bar',
						list  : ['red', 'green', 'blue'],
						keys  : { semi: ';', dot: '.', comma: ',' },
						v     : '6',
						x     : '1024',
						y     : '768',
						empty : '',
						'empty_keys' : {},
						undef : null
					};
				},

				'3.2.1. Variable Expansion': function () {
					assert.same(uriTemplate.expand('{count}', params), 'one,two,three');
					assert.same(uriTemplate.expand('{count*}', params), 'one,two,three');
					assert.same(uriTemplate.expand('{/count}', params), '/one,two,three');
					assert.same(uriTemplate.expand('{/count*}', params), '/one/two/three');
					assert.same(uriTemplate.expand('{;count}', params), ';count=one,two,three');
					assert.same(uriTemplate.expand('{;count*}', params), ';count=one;count=two;count=three');
					assert.same(uriTemplate.expand('{?count}', params), '?count=one,two,three');
					assert.same(uriTemplate.expand('{?count*}', params), '?count=one&count=two&count=three');
					assert.same(uriTemplate.expand('{&count*}', params), '&count=one&count=two&count=three');
				},
				'3.2.2. Simple String Expansion: {var}': function () {
					assert.same(uriTemplate.expand('{var}', params), 'value');
					assert.same(uriTemplate.expand('{hello}', params), 'Hello%20World%21');
					assert.same(uriTemplate.expand('{half}', params), '50%25');
					assert.same(uriTemplate.expand('O{empty}X', params), 'OX');
					assert.same(uriTemplate.expand('O{undef}X', params), 'OX');
					assert.same(uriTemplate.expand('{x,y}', params), '1024,768');
					assert.same(uriTemplate.expand('{x,hello,y}', params), '1024,Hello%20World%21,768');
					assert.same(uriTemplate.expand('?{x,empty}', params), '?1024,');
					assert.same(uriTemplate.expand('?{x,undef}', params), '?1024');
					assert.same(uriTemplate.expand('?{undef,y}', params), '?768');
					assert.same(uriTemplate.expand('{var:3}', params), 'val');
					assert.same(uriTemplate.expand('{var:30}', params), 'value');
					assert.same(uriTemplate.expand('{list}', params), 'red,green,blue');
					assert.same(uriTemplate.expand('{list*}', params), 'red,green,blue');
					assert.same(uriTemplate.expand('{keys}', params), 'semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('{keys*}', params), 'semi=%3B,dot=.,comma=%2C');
				},
				'3.2.3. Reserved Expansion: {+var}': function () {
					assert.same(uriTemplate.expand('{+var}', params), 'value');
					assert.same(uriTemplate.expand('{+hello}', params), 'Hello%20World!');
					assert.same(uriTemplate.expand('{+half}', params), '50%25');

					assert.same(uriTemplate.expand('{base}index', params), 'http%3A%2F%2Fexample.com%2Fhome%2Findex');
					assert.same(uriTemplate.expand('{+base}index', params), 'http://example.com/home/index');
					assert.same(uriTemplate.expand('O{+empty}X', params), 'OX');
					assert.same(uriTemplate.expand('O{+undef}X', params), 'OX');

					assert.same(uriTemplate.expand('{+path}/here', params), '/foo/bar/here');
					assert.same(uriTemplate.expand('here?ref={+path}', params), 'here?ref=/foo/bar');
					assert.same(uriTemplate.expand('up{+path}{var}/here', params), 'up/foo/barvalue/here');
					assert.same(uriTemplate.expand('{+x,hello,y}', params), '1024,Hello%20World!,768');
					assert.same(uriTemplate.expand('{+path,x}/here', params), '/foo/bar,1024/here');

					assert.same(uriTemplate.expand('{+path:6}/here', params), '/foo/b/here');
					assert.same(uriTemplate.expand('{+list}', params), 'red,green,blue');
					assert.same(uriTemplate.expand('{+list*}', params), 'red,green,blue');
					assert.same(uriTemplate.expand('{+keys}', params), 'semi,;,dot,.,comma,,');
					assert.same(uriTemplate.expand('{+keys*}', params), 'semi=;,dot=.,comma=,');
				},
				'3.2.4. Fragment Expansion: {#var}': function () {
					assert.same(uriTemplate.expand('{#var}', params), '#value');
					assert.same(uriTemplate.expand('{#hello}', params), '#Hello%20World!');
					assert.same(uriTemplate.expand('{#half}', params), '#50%25');
					assert.same(uriTemplate.expand('foo{#empty}', params), 'foo#');
					assert.same(uriTemplate.expand('foo{#undef}', params), 'foo');
					assert.same(uriTemplate.expand('{#x,hello,y}', params), '#1024,Hello%20World!,768');
					assert.same(uriTemplate.expand('{#path,x}/here', params), '#/foo/bar,1024/here');
					assert.same(uriTemplate.expand('{#path:6}/here', params), '#/foo/b/here');
					assert.same(uriTemplate.expand('{#list}', params), '#red,green,blue');
					assert.same(uriTemplate.expand('{#list*}', params), '#red,green,blue');
					assert.same(uriTemplate.expand('{#keys}', params), '#semi,;,dot,.,comma,,');
					assert.same(uriTemplate.expand('{#keys*}', params), '#semi=;,dot=.,comma=,');
				},
				'3.2.5. Label Expansion with Dot-Prefix: {.var}': function () {
					assert.same(uriTemplate.expand('{.who}', params), '.fred');
					assert.same(uriTemplate.expand('{.who,who}', params), '.fred.fred');
					assert.same(uriTemplate.expand('{.half,who}', params), '.50%25.fred');
					assert.same(uriTemplate.expand('www{.dom*}', params), 'www.example.com');
					assert.same(uriTemplate.expand('X{.var}', params), 'X.value');
					assert.same(uriTemplate.expand('X{.empty}', params), 'X.');
					assert.same(uriTemplate.expand('X{.undef}', params), 'X');
					assert.same(uriTemplate.expand('X{.var:3}', params), 'X.val');
					assert.same(uriTemplate.expand('X{.list}', params), 'X.red,green,blue');
					assert.same(uriTemplate.expand('X{.list*}', params), 'X.red.green.blue');
					assert.same(uriTemplate.expand('X{.keys}', params), 'X.semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('X{.keys*}', params), 'X.semi=%3B.dot=..comma=%2C');
					assert.same(uriTemplate.expand('X{.empty_keys}', params), 'X');
					assert.same(uriTemplate.expand('X{.empty_keys*}', params), 'X');
				},
				'3.2.6. Path Segment Expansion: {/var}': function () {
					assert.same(uriTemplate.expand('{/who}', params), '/fred');
					assert.same(uriTemplate.expand('{/who,who}', params), '/fred/fred');
					assert.same(uriTemplate.expand('{/half,who}', params), '/50%25/fred');
					assert.same(uriTemplate.expand('{/who,dub}', params), '/fred/me%2Ftoo');
					assert.same(uriTemplate.expand('{/var}', params), '/value');
					assert.same(uriTemplate.expand('{/var,empty}', params), '/value/');
					assert.same(uriTemplate.expand('{/var,undef}', params), '/value');
					assert.same(uriTemplate.expand('{/var,x}/here', params), '/value/1024/here');
					assert.same(uriTemplate.expand('{/var:1,var}', params), '/v/value');
					assert.same(uriTemplate.expand('{/list}', params), '/red,green,blue');
					assert.same(uriTemplate.expand('{/list*}', params), '/red/green/blue');
					assert.same(uriTemplate.expand('{/list*,path:4}', params), '/red/green/blue/%2Ffoo');
					assert.same(uriTemplate.expand('{/keys}', params), '/semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('{/keys*}', params), '/semi=%3B/dot=./comma=%2C');
				},
				'3.2.7. Path-Style Parameter Expansion: {;var}': function () {
					assert.same(uriTemplate.expand('{;who}', params), ';who=fred');
					assert.same(uriTemplate.expand('{;half}', params), ';half=50%25');
					assert.same(uriTemplate.expand('{;empty}', params), ';empty');
					assert.same(uriTemplate.expand('{;v,empty,who}', params), ';v=6;empty;who=fred');
					assert.same(uriTemplate.expand('{;v,bar,who}', params), ';v=6;who=fred');
					assert.same(uriTemplate.expand('{;x,y}', params), ';x=1024;y=768');
					assert.same(uriTemplate.expand('{;x,y,empty}', params), ';x=1024;y=768;empty');
					assert.same(uriTemplate.expand('{;x,y,undef}', params), ';x=1024;y=768');
					assert.same(uriTemplate.expand('{;hello:5}', params), ';hello=Hello');
					assert.same(uriTemplate.expand('{;list}', params), ';list=red,green,blue');
					assert.same(uriTemplate.expand('{;list*}', params), ';list=red;list=green;list=blue');
					assert.same(uriTemplate.expand('{;keys}', params), ';keys=semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('{;keys*}', params), ';semi=%3B;dot=.;comma=%2C');
				},
				'3.2.8. Form-Style Query Expansion: {?var}': function () {
					assert.same(uriTemplate.expand('{?who}', params), '?who=fred');
					assert.same(uriTemplate.expand('{?half}', params), '?half=50%25');
					assert.same(uriTemplate.expand('{?x,y}', params), '?x=1024&y=768');
					assert.same(uriTemplate.expand('{?x,y,empty}', params), '?x=1024&y=768&empty=');
					assert.same(uriTemplate.expand('{?x,y,undef}', params), '?x=1024&y=768');
					assert.same(uriTemplate.expand('{?var:3}', params), '?var=val');
					assert.same(uriTemplate.expand('{?list}', params), '?list=red,green,blue');
					assert.same(uriTemplate.expand('{?list*}', params), '?list=red&list=green&list=blue');
					assert.same(uriTemplate.expand('{?keys}', params), '?keys=semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('{?keys*}', params), '?semi=%3B&dot=.&comma=%2C');
				},
				'3.2.9. Form-Style Query Continuation: {&var}': function () {
					assert.same(uriTemplate.expand('{&who}', params), '&who=fred');
					assert.same(uriTemplate.expand('{&half}', params), '&half=50%25');
					assert.same(uriTemplate.expand('?fixed=yes{&x}', params), '?fixed=yes&x=1024');
					assert.same(uriTemplate.expand('{&x,y,empty}', params), '&x=1024&y=768&empty=');
					assert.same(uriTemplate.expand('{&x,y,undef}', params), '&x=1024&y=768');

					assert.same(uriTemplate.expand('{&var:3}', params), '&var=val');
					assert.same(uriTemplate.expand('{&list}', params), '&list=red,green,blue');
					assert.same(uriTemplate.expand('{&list*}', params), '&list=red&list=green&list=blue');
					assert.same(uriTemplate.expand('{&keys}', params), '&keys=semi,%3B,dot,.,comma,%2C');
					assert.same(uriTemplate.expand('{&keys*}', params), '&semi=%3B&dot=.&comma=%2C');
				}
			},

			'should support number params': function () {
				assert.same(uriTemplate.expand('http://example.com/{a}', { a: 123 }), 'http://example.com/123');
			},
			'should support boolean params': function () {
				assert.same(uriTemplate.expand('http://example.com/{a}', { a: true }), 'http://example.com/true');
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
