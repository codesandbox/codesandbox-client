/*
 * Copyright 2013-2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, failOnThrow, undef;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/interceptor-test', function (require) {

		var interceptor, rest, when;

		interceptor = require('rest/interceptor');
		rest = require('rest');
		when = require('when');

		function defaultClient(request) {
			return { request: request, id: 'default' };
		}

		function otherClient(request) {
			return { request: request, id: 'other' };
		}

		function errorClient(request) {
			return when.reject({ request: request, id: 'error' });
		}

		function unresponsiveClient(request) {
			request.id = 'unresponsive';
			return when.defer().promise;
		}

		buster.testCase('rest/interceptor', {
			'should set the originator client on the request for the, but do not overwrite': function () {
				var theInterceptor, client;
				theInterceptor = interceptor();
				client = theInterceptor(defaultClient).wrap(theInterceptor);
				return client().then(function (response) {
					assert.same('default', response.id);
					assert.same(client, response.request.originator);
				}).otherwise(fail);
			},
			'should use the client configured into the interceptor by default': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					client: defaultClient
				});
				client = theInterceptor();
				return client().then(function (response) {
					assert.same('default', response.id);
					assert.same(client, response.request.originator);
				}).otherwise(fail);
			},
			'should override the client configured into the interceptor by default': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					client: defaultClient
				});
				client = theInterceptor(otherClient);
				return client().then(function (response) {
					assert.same('other', response.id);
					assert.same(client, response.request.originator);
				}).otherwise(fail);
			},
			'should intercept the request phase': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						request.phase = 'request';
						return request;
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('request', response.request.phase);
				}).otherwise(fail);
			},
			'should intercept the request phase and handle a promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						return when().delay(5).then(function () {
							request.phase = 'request';
							return request;
						});
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('default', response.id);
					assert.same('request', response.request.phase);
				}).otherwise(fail);
			},
			'should intercept the request phase and handle a rejected promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						request.phase = 'request';
						return when.reject('rejected request');
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						// request never makes it to the root client
						refute(response.id);
						assert.same('request', response.request.phase);
						assert.same('rejected request', response.error);
					})
				);
			},
			'should intercept the response phase': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						response.phase = 'response';
						return response;
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('response', response.phase);
				}).otherwise(fail);
			},
			'should intercept the response phase and handle a promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						return when().delay(5).then(function () {
							response.phase = 'response';
							return response;
						});
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('response', response.phase);
				}).otherwise(fail);
			},
			'should intercept the response phase and handle a rejceted promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						response.phase = 'response';
						return when.reject(response);
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('response', response.phase);
					})
				);
			},
			'should intercept the response phase for an error': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						response.phase = 'response';
						return response;
					}
				});
				client = theInterceptor(errorClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('response', response.phase);
					})
				);
			},
			'should intercept the response phase for an error and handle a promise maintaining the error': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						response.phase = 'response';
						return when(response);
					}
				});
				client = theInterceptor(errorClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('response', response.phase);
					})
				);
			},
			'should intercept the response phase for an error and handle a rejected promise maintaining the error': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: function (response) {
						response.phase = 'response';
						return when.reject(response);
					}
				});
				client = theInterceptor(errorClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('response', response.phase);
					})
				);
			},
			'should intercept the success phase': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					success: function (response) {
						response.phase = 'success';
						return response;
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('success', response.phase);
				}).otherwise(fail);
			},
			'should intercept the success phase and handle a promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					success: function (response) {
						return when().delay(5).then(function () {
							response.phase = 'success';
							return response;
						});
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same('success', response.phase);
				}).otherwise(fail);
			},
			'should intercept the success phase and handle a rejceted promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					success: function (response) {
						response.phase = 'success';
						return when.reject(response);
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('success', response.phase);
					})
				);
			},
			'should intercept the error phase': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					error: function (response) {
						response.phase = 'error';
						return response;
					}
				});
				client = theInterceptor(errorClient);
				return client().then(function (response) {
					assert.same('error', response.phase);
				}).otherwise(fail);
			},
			'should intercept the error phase and handle a promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					error: function (response) {
						response.phase = 'error';
						return when(response);
					}
				});
				client = theInterceptor(errorClient);
				return client().then(function (response) {
					assert.same('error', response.phase);
				}).otherwise(fail);
			},
			'should intercept the error phase and handle a rejceted promise': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					response: fail,
					error: function (response) {
						response.phase = 'error';
						return when.reject(response);
					}
				});
				client = theInterceptor(errorClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('error', response.phase);
					})
				);
			},
			'should pass interceptor config to handlers': function () {
				var theInterceptor, client, theConfig;
				theConfig = { foo: 'bar' };
				theInterceptor = interceptor({
					request: function (request, config) {
						request.phase = 'request';
						assert.same(theConfig, config);
						return request;
					},
					response: function (response, config) {
						response.phase = 'response';
						assert.same(theConfig, config);
						return response;
					}
				});
				client = theInterceptor(defaultClient, theConfig);
				return client().then(function (response) {
					assert.same('request', response.request.phase);
					assert.same('response', response.phase);
				}).otherwise(fail);
			},
			'should share context between handlers that is unique per request': function () {
				var theInterceptor, client, count, counted;
				count = 0;
				counted = [];
				theInterceptor = interceptor({
					request: function (request) {
						count += 1;
						if (count % 2) {
							this.count = count;
						}
						return request;
					},
					response: function (response) {
						counted.push(this.count);
						return response;
					}
				});
				client = theInterceptor(defaultClient);
				return when.all([client(), client(), client()]).then(function () {
					assert.same(3, counted.length);
					assert(counted.indexOf(1) >= 0);
					// if 'this' was shared between requests, we'd have 1 twice and no undef
					assert(counted.indexOf(2) === -1);
					assert(counted.indexOf(undef) >= 0);
					assert(counted.indexOf(3) >= 0);
				}).otherwise(fail);
			},
			'should use the client provided by a ComplexRequest': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						return new interceptor.ComplexRequest({
							request: request,
							client: defaultClient
						});
					}
				});
				client = theInterceptor();
				return client().then(function (response) {
					assert.same('default', response.id);
					assert.same(client, response.request.originator);
				}).otherwise(fail);
			},
			'should use the repsponse provided by a ComplexRequest': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						return new interceptor.ComplexRequest({
							response: { request: request, id: 'complex-response' }
						});
					}
				});
				client = theInterceptor();
				return client().then(function (response) {
					assert.same('complex-response', response.id);
					assert.same(client, response.request.originator);
				}).otherwise(fail);
			},
			'should cancel requests with the abort trigger provided by a ComplexRequest': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request) {
						refute.same('unresponsive', request.id);
						return new interceptor.ComplexRequest({
							request: request,
							abort: when.reject({ request: request, id: 'abort' })
						});
					}
				});
				client = theInterceptor(unresponsiveClient);
				return client().then(
					fail,
					failOnThrow(function (response) {
						assert.same('abort', response.id);
						assert.same('unresponsive', response.request.id);
					})
				);
			},
			'should have access to the client for subsequent requests': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request, config, meta) {
						request.client = meta.client;
						return request;
					},
					response: function (response, config, meta) {
						response.client = meta.client;
						return response;
					}
				});
				client = theInterceptor(defaultClient);
				return client().then(function (response) {
					assert.same(client, response.client);
					assert.same(client, response.request.client);
					assert.same('default', response.id);
				}).otherwise(fail);
			},
			'should have access to the invocation args': function () {
				var theInterceptor, client;
				theInterceptor = interceptor({
					request: function (request, config, meta) {
						request['arguments'] = meta['arguments'];
						return request;
					},
					response: function (response, config, meta) {
						response['arguments'] = meta['arguments'];
						return response;
					}
				});
				client = theInterceptor(defaultClient);
				return client('foo', 'bar').then(function (response) {
					assert.same('foo', response['arguments'][0]);
					assert.same('bar', response['arguments'][1]);
					assert.same(response['arguments'], response.request['arguments']);
					assert.same('default', response.id);
				}).otherwise(fail);
			},
			'should initialize the config object, modifying the provided object': function () {
				var theConfig, theInterceptor, client;
				theConfig = { foo: 'bar' };
				theInterceptor = interceptor({
					init: function (config) {
						assert.same(theConfig, config);
						config.bleep = 'bloop';
						return config;
					},
					request: function (request, config) {
						assert.same(theConfig, config);
						request.phase = 'request';
						return request;
					},
					response: function (response, config) {
						assert.same(theConfig, config);
						response.phase = 'response';
						return response;
					}
				});
				refute('bleep' in theConfig);
				client = theInterceptor(defaultClient, theConfig);
				assert.same('bloop', theConfig.bleep);
				return client().then(function (response) {
					assert.same('request', response.request.phase);
					assert.same('response', response.phase);
					assert.same('default', response.id);
				}).otherwise(fail);
			},
			'should normalize a string to a request object': function () {
				var theInterceptor, client;
				theInterceptor = interceptor();
				client = theInterceptor(defaultClient);
				return client('/').then(function (response) {
					assert.same('/', response.request.path);
				}).otherwise(fail);
			},
			'should have the default client as the parent by default': function () {
				var theInterceptor = interceptor();
				assert.same(rest, theInterceptor().skip());
			},
			'should support interceptor wrapping': function () {
				var theInterceptor = interceptor();
				assert(typeof theInterceptor().wrap === 'function');
			},
			'should return a ResponsePromise from intercepted clients': function () {
				var theInterceptor, client;
				theInterceptor = interceptor();
				client = theInterceptor(defaultClient);
				assert.isFunction(client().entity);
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
