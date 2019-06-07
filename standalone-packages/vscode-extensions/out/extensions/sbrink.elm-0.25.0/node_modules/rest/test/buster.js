/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var config = exports;

config['rest:node'] = {
	environment: 'node',
	rootPath: '../',
	tests: [
		'test/**/*-test.js',
		'test/**/*-test-node.js'
	],
	testHelpers: ['test/failOnThrow.js']
};

config['rest:browser'] = {
	environment: 'browser',
	autoRun: false,
	rootPath: '../',
	resources: [
		//'**', ** is busted in buster
		'*.js',
		'client/**/*.js',
		'interceptor/**/*.js',
		'mime/**/*.js',
		'parsers/**/*.js',
		'util/**/*.js',
		'node_modules/curl/**/*.js',
		'node_modules/poly/**/*.js',
		'node_modules/when/**/*.js',
		'node_modules/wire/**/*.js',
		'test/**/fixtures/**',
		{ path: '/wait', backend: 'http://example.com' }
	],
	libs: [
		'test/curl-config.js',
		'node_modules/curl/src/curl.js'
	],
	sources: [
		// loaded as resources
	],
	tests: [
		'test/**/*-test.js',
		'test/**/*-test-browser.js',
		'test/run.js'
	],
	testHelpers: ['test/failOnThrow.js']
};
