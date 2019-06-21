/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;

	define('rest/util/find-test', function (require) {

		var find = require('rest/util/find');

		buster.testCase('rest/util/find', {
			'should find objects that contain a given property name': function () {
				var graph, spy;

				graph = { foo: { foo: {}, bar: { bar: { foo: {} } } } };
				spy = this.spy();

				find.findProperties(graph, 'foo', spy);

				assert.same(3, spy.callCount);
				assert.calledWith(spy, graph.foo, graph, 'foo');
				assert.calledWith(spy, graph.foo.foo, graph.foo, 'foo');
				assert.calledWith(spy, graph.foo.bar.bar.foo, graph.foo.bar.bar, 'foo');
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
