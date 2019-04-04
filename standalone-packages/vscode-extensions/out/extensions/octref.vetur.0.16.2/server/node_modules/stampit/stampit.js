/**
 * Stampit
 **
 * Create objects from reusable, composable behaviors.
 **
 * Copyright (c) 2013 Eric Elliott
 * http://opensource.org/licenses/MIT
 **/
'use strict';
var forEach = require('mout/array/forEach');
var mixIn = require('mout/object/mixIn');
var merge = require('mout/object/merge');
var map = require('mout/array/map');
var forOwn = require('mout/object/forOwn');
var mixInChain = require('./mixinchain.js');
var slice = [].slice;

/*jshint -W024 */

// Avoiding JSHist W003 violations.
var create, extractFunctions, stampit, compose, isStamp, convertConstructor;

create = function (o) {
  if (arguments.length > 1) {
    throw new Error('Object.create implementation only accepts the first parameter.');
  }
  function F() {}

  F.prototype = o;
  return new F();
};

if (!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

extractFunctions = function extractFunctions(arg) {
  if (typeof arg === 'function') {
    return map(slice.call(arguments), function (fn) {
      if (typeof fn === 'function') {
        return fn;
      }
    });
  } else if (typeof arg === 'object') {
    var arr = [];
    forEach(slice.call(arguments), function (obj) {
      forOwn(obj, function (fn) {
        arr.push(fn);
      });
    });
    return arr;
  } else if (Array.isArray(arg)) {
    return slice.call(arg);
  }
  return [];
};

/**
 * Return a factory function that will produce new objects using the
 * prototypes that are passed in or composed.
 *
 * @param  {Object} [methods] A map of method names and bodies for delegation.
 * @param  {Object} [state]   A map of property names and values to clone for each new object.
 * @param  {Function} [enclose] A closure (function) used to create private data and privileged methods.
 * @return {Function} factory A factory to produce objects using the given prototypes.
 * @return {Function} factory.create Just like calling the factory function.
 * @return {Object} factory.fixed An object map containing the fixed prototypes.
 * @return {Function} factory.methods Add methods to the methods prototype. Chainable.
 * @return {Function} factory.state Add properties to the state prototype. Chainable.
 * @return {Function} factory.enclose Add or replace the closure prototype. Not chainable.
 */
stampit = function stampit(methods, state, enclose) {
  var fixed = {
      methods: methods || {},
      state: state,
      enclose: extractFunctions(enclose),
      static: {}
    },

    factory = function factory(properties) {
      var state = merge({}, fixed.state),
        instance = mixIn(create(fixed.methods || {}),
          state, properties),
        closures = fixed.enclose,
        args = slice.call(arguments, 1);

      forEach(closures, function (fn) {
        if (typeof fn === 'function') {
          instance = fn.apply(instance, args) || instance;
        }
      });

      return instance;
    };

  return mixIn(factory, {
    create: factory,
    fixed: fixed,
    /**
     * Take n objects and add them to the methods prototype.
     * @return {Object} stamp  The factory in question (`this`).
     */
    methods: function stampMethods() {
      var obj = fixed.methods || {},
        args = [obj].concat(slice.call(arguments));
      fixed.methods = mixInChain.apply(this, args);
      return this;
    },
    /**
     * Take n objects and add them to the state prototype.
     * @return {Object} stamp  The factory in question (`this`).
     */
    state: function stampState() {
      var obj = fixed.state || {},
        args = [obj].concat(slice.call(arguments));
      fixed.state = mixIn.apply(this, args);
      return this;
    },
    /**
     * Take n functions, an array of functions, or n objects and add
     * the functions to the enclose prototype.
     * @return {Object} The factory in question (`this`).
     */
    enclose: function stampEnclose() {
      fixed.enclose = fixed.enclose
        .concat(extractFunctions.apply(null, arguments));
      return this;
    },
    /**
     * Take n objects and add all props to the factory object.
     * @return {Object} stamp The factory in question (`this`).
     */
    static: function stampStatic() {
      var obj = fixed.static || {},
        args = [obj].concat(slice.call(arguments));
      fixed.static = mixInChain.apply(this, args);

      return mixIn(this, fixed.static);
     },
    /**
     * Take one or more factories produced from stampit() and
     * combine them with `this` to produce and return a new factory.
     * Combining overrides properties with last-in priority.
     * @param {[Function]|...Function} factories Stampit factories.
     * @return {Function} A new stampit factory composed from arguments.
     */
    compose: function (factories) {
      var args = Array.isArray(factories) ? factories : slice.call(arguments);
      args = [this].concat(args);
      return compose(args);
    }
  }, fixed.static);
};

/**
 * Take two or more factories produced from stampit() and
 * combine them to produce a new factory.
 * Combining overrides properties with last-in priority.
 * @param {[Function]|...Function} factories A factory produced by stampit().
 * @return {Function} A new stampit factory composed from arguments.
 */
compose = function compose(factories) {
  factories = Array.isArray(factories) ? factories : slice.call(arguments);
  var result = stampit(),
    f = result.fixed;
  forEach(factories, function (source) {
    if (source && source.fixed) {
      if (source.fixed.methods) {
        f.methods = mixInChain(f.methods, source.fixed.methods);
      }

      if (source.fixed.state) {
        f.state = mixIn(f.state || {}, source.fixed.state);
      }

      if (source.fixed.enclose) {
        f.enclose = f.enclose.concat(source.fixed.enclose);
      }

      if (source.fixed.static) {
        f.static = mixIn(f.static, source.fixed.static);
      }
    }
  });
  return mixIn(result, f.static);
};

/**
 * Check if an object is a stamp.
 * @param {Object} obj An object to check.
 * @returns {Boolean}
 */
isStamp = function isStamp(obj) {
  return (
    typeof obj === 'function' &&
    typeof obj.fixed === 'object' &&
    typeof obj.methods === 'function' &&
    typeof obj.state === 'function' &&
    typeof obj.enclose === 'function' &&
    typeof obj.static === 'function'
    );
};

/**
 * Take an old-fashioned JS constructor and return a stampit stamp
 * that you can freely compose with other stamps.
 * @param  {Function} Constructor
 * @return {Function}             A composable stampit factory
 *                                (aka stamp).
 */
convertConstructor = function convertConstructor(Constructor) {
  return stampit().methods(Constructor.prototype).enclose(Constructor);
};

module.exports = mixIn(stampit, {
  compose: compose,
  /**
   * Alias for mixIn
   */
  extend: mixIn,
  /**
   * Take a destination object followed by one or more source objects,
   * and copy the source object properties to the destination object,
   * with last in priority overrides.
   * @param {Object} destination An object to copy properties to.
   * @param {...Object} source An object to copy properties from.
   * @returns {Object}
   */
  mixIn: mixIn,
  /**
   * Check if an object is a stamp.
   * @param {Object} obj An object to check.
   * @returns {Boolean}
   */
  isStamp: isStamp,

  convertConstructor: convertConstructor
});
