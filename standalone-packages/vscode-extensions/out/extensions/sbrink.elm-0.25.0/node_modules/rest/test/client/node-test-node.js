/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, failOnThrow;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/client/node-test', function (require) {

		var rest, client, http, https, fs, serverHttp, serverHttps;

		rest = require('rest');
		client = require('rest/client/node');
		http = require('http');
		https = require('https');
		fs = require('fs');

		buster.testCase('rest/client/node', {
			setUp: function () {
				serverHttp = http.createServer();
				serverHttps = https.createServer({
					key: fs.readFileSync(__dirname + '/node-ssl.key'),
					cert: fs.readFileSync(__dirname + '/node-ssl.crt')
				});

				function handle(request, response) {
					var requestBody = '';
					request.on('data', function (chunk) {
						requestBody += chunk;
					});
					request.on('end', function () {
						var responseBody = requestBody ? requestBody : 'hello world';
						response.writeHead(200, 'OK', {
							'content-length': responseBody.length,
							'content-type': 'text/plain'
						});
						response.write(responseBody);
						response.end();
					});
					request.on('error', function () { console.log('server error'); });
				}

				serverHttp.on('request', handle);
				serverHttps.on('request', handle);

				// TODO handle port conflicts
				serverHttp.listen(8080);
				serverHttps.listen(8443);
			},
			tearDown: function () {
				serverHttp.close();
				serverHttps.close();
			},

			'should make a GET by default': function () {
				var request = { path: 'http://localhost:8080/' };
				return client(request).then(function (response) {
					assert.equals(response.url, 'http://localhost:8080/');
					assert(response.raw.request instanceof http.ClientRequest);
					// assert(response.raw.response instanceof http.ClientResponse);
					assert(response.raw.response);
					assert.same(request, response.request);
					assert.equals(response.request.method, 'GET');
					assert.equals(response.entity, 'hello world');
					assert.equals(response.status.code, 200);
					assert.equals('text/plain', response.headers['Content-Type']);
					assert.equals(response.entity.length, parseInt(response.headers['Content-Length'], 10));
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make an explicit GET': function () {
				var request = { path: 'http://localhost:8080/', method: 'GET' };
				return client(request).then(function (response) {
					assert.equals(response.url, 'http://localhost:8080/');
					assert.same(request, response.request);
					assert.equals(response.request.method, 'GET');
					assert.equals(response.entity, 'hello world');
					assert.equals(response.status.code, 200);
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make a POST with an entity': function () {
				var request = { path: 'http://localhost:8080/', entity: 'echo' };
				return client(request).then(function (response) {
					assert.equals(response.url, 'http://localhost:8080/');
					assert.same(request, response.request);
					assert.equals(response.request.method, 'POST');
					assert.equals(response.entity, 'echo');
					assert.equals(response.status.code, 200);
					assert.equals('text/plain', response.headers['Content-Type']);
					assert.equals(response.entity.length, parseInt(response.headers['Content-Length'], 10));
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make an explicit POST with an entity': function () {
				var request = { path: 'http://localhost:8080/', entity: 'echo', method: 'POST' };
				return client(request).then(function (response) {
					assert.equals(response.url, 'http://localhost:8080/');
					assert.same(request, response.request);
					assert.equals(response.request.method, 'POST');
					assert.equals(response.entity, 'echo');
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should make an https request': function () {
				var request = {
					path: 'https://localhost:8443/',
					mixin: { rejectUnauthorized: false }
				};
				return client(request).then(function (response) {
					assert.equals(response.url, 'https://localhost:8443/');
					assert(response.raw.request instanceof http.ClientRequest);
					// assert(response.raw.response instanceof http.ClientResponse);
					assert(response.raw.response);
					assert.same(request, response.request);
					assert.equals(response.request.method, 'GET');
					assert.equals(response.entity, 'hello world');
					assert.equals(response.status.code, 200);
					assert.equals('text/plain', response.headers['Content-Type']);
					assert.equals(response.entity.length, parseInt(response.headers['Content-Length'], 10));
					refute(request.canceled);
				}).otherwise(fail);
			},
			'should abort the request if canceled': function () {
				var request, response;
				request = { path: 'http://localhost:8080/' };
				client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.url, 'http://localhost:8080/');
						assert(request.canceled);
					})
				);
				refute(request.canceled);
				request.cancel();
				return response;
			},
			'should propogate request errors': function () {
				var request = { path: 'http://localhost:1234' };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.url, 'http://localhost:1234');
						assert(response.error);
					})
				);
			},
			'should not make a request that has already been canceled': function () {
				var request = { canceled: true, path: 'http://localhost:1234' };
				return client(request).then(
					fail,
					failOnThrow(function (response) {
						assert.same(request, response.request);
						assert(request.canceled);
						assert.same('precanceled', response.error);
					})
				);
			},
			'should normalize a string to a request object': function () {
				return client('http://localhost:8080/').then(function (response) {
					assert.equals(response.url, 'http://localhost:8080/');
					assert.same('http://localhost:8080/', response.request.path);
				}).otherwise(fail);
			},
			'should be the default client': function () {
				rest.resetDefaultClient();
				assert.same(client, rest.getDefaultClient());
			},
			'should support interceptor wrapping': function () {
				assert(typeof client.wrap === 'function');
			},
			'should return a ResponsePromise': function () {
				var response = client();
				response.otherwise(function () {});
				assert.isFunction(response.entity);
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
