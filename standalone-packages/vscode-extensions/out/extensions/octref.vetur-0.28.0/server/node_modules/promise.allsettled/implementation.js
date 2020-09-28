'use strict';

var requirePromise = require('./requirePromise');

requirePromise();

var PromiseResolve = require('es-abstract/2019/PromiseResolve');
var Type = require('es-abstract/2019/Type');
var iterate = require('iterate-value');
var map = require('array.prototype.map');
var getIntrinsic = require('es-abstract/GetIntrinsic');
var bind = require('function-bind');

var all = bind.call(Function.call, getIntrinsic('%Promise_all%'));
var reject = bind.call(Function.call, getIntrinsic('%Promise_reject%'));

module.exports = function allSettled(iterable) {
	var C = this;
	if (Type(C) !== 'Object') {
		throw new TypeError('`this` value must be an object');
	}
	var values = iterate(iterable);
	return all(C, map(values, function (item) {
		var onFulfill = function (value) {
			return { status: 'fulfilled', value: value };
		};
		var onReject = function (reason) {
			return { status: 'rejected', reason: reason };
		};
		var itemPromise = PromiseResolve(C, item);
		try {
			return itemPromise.then(onFulfill, onReject);
		} catch (e) {
			return reject(C, e);
		}
	}));
};
