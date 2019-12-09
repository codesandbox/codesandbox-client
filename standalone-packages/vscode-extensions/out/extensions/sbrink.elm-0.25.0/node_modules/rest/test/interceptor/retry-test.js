/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Jeremy Grelle
 * @author Scott Andrews
 */

(function (buster, define, nextTick) {
	'use strict';

	var assert, fail, failOnThrow;

	assert = buster.assertions.assert;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/interceptor/retry-test', function (require) {

		var interceptor, retry, rest, when, clock;

		interceptor = require('rest/interceptor');
		retry = require('rest/interceptor/retry');
		rest = require('rest');
		when = require('when');

		buster.testCase('rest/interceptor/retry', {
			'should retry until successful': function () {
				var count = 0, client = retry(
					function (request) {
						count += 1;
						if (count === 2) {
							return { request: request, status: { code: 200 } };
						} else {
							return when.reject({ request: request, error: 'Thrown by fake client' });
						}
					}
				);
				return client({}).then(function (response) {
				    assert.equals(200, response.status.code);
				}).otherwise(fail);
			},
			'should accept custom config': {
				setUp: function () {
					clock = this.useFakeTimers();
				},
				tearDown: function () {
					clock.restore();
				},
				'': function () {
					var count = 0, client, start, config;

					start = new Date().getTime();
					config = { initial: 10, multiplier: 3, max: 20 };
					client = retry(
						function (request) {
							var tick = Math.min(Math.pow(config.multiplier, count) * config.initial, config.max);
							count += 1;
							if (count === 4) {
								return { request: request, status: { code: 200 } };
							} else {
								nextTick(function () {
									clock.tick(tick);
								}, 0);
								return when.reject({ request: request, error: 'Thrown by fake client' });
							}
						},
						config
					);

					return client({}).then(function (response) {
						assert.equals(200, response.status.code);
					    assert.equals(count, 4);
						assert.equals(50, new Date().getTime() - start);
					}).otherwise(fail);
				}
			},
			'should not make propagate request if marked as canceled': function () {
				var parent, client, request, response;

				parent = this.spy(function (request) {
					return when.reject({ request: request });
				});
				client = retry(parent, { initial: 10 });

				request = {};
				response = client(request).then(
					fail,
					failOnThrow(function (response) {
						assert(request.canceled);
						assert.equals('precanceled', response.error);
						assert.same(1, parent.callCount);
					})
				);
				request.canceled = true;

				return response;
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, retry().skip());
			},
			'should support interceptor wrapping': function () {
				assert(typeof retry().wrap === 'function');
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
	},
	// retain access to the native setTimeout function
	(function (setTimeout) {
		return typeof process !== 'undefined' && process.nextTick ?
			function (work) {
				process.nextTick(work);
			} :
			function (work) {
				setTimeout(work, 0);
			};
	}(setTimeout))
	// Boilerplate for AMD and Node
));
