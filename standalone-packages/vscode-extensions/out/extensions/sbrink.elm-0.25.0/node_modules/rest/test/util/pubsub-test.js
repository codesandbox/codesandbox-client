/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/util/pubsub-test', function (require) {

		var pubsub = require('rest/util/pubsub');

		buster.testCase('rest/util/pubsub', {
			'should pass arguments to subscribed listener': function () {
				var callback = this.spy(function (value) {
					assert.equals('result', value);
				});
				pubsub.subscribe('topic', callback);
				pubsub.publish('topic', 'result');
				assert.called(callback);
			},
			'should ignore publish with no listeners': function () {
				pubsub.publish('topic', 'result');
				assert(true);
			},
			'should unsubscribe listener after publish': function () {
				var callback = this.spy(function (value) {
					assert.equals('result', value);
				});
				pubsub.subscribe('topic', callback);
				pubsub.publish('topic', 'result');
				pubsub.publish('topic', 'result2');
				assert.calledOnce(callback);
			},
			'should only call most recent listener': function () {
				var callback1, callback2;
				callback1 = this.spy();
				callback2 = this.spy(function (value) {
					assert.equals('result', value);
				});
				pubsub.subscribe('topic', callback1);
				pubsub.subscribe('topic', callback2);
				pubsub.publish('topic', 'result');
				assert.calledOnce(callback2);
				refute.called(callback1);
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
